import os from 'node:os'
import path, { join } from 'node:path'
import { $ } from 'execa'
import { cuid } from '@adonisjs/core/helpers'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'

export interface YouTubeVideoInfo {
  id: string
  title: string
  description: string
  duration: string
  author: string
}

export class YouTubeService {
  #ytDlpPath: string
  #timeout: NodeJS.Timeout | null
  #TIMEOUT: number

  constructor() {
    this.#timeout = null
    this.#TIMEOUT = 30_000
    this.#ytDlpPath = env.get('YT_DLP') || 'yt-dlp'
  }

  #createAbortController() {
    this.#cleanup()
    const controller = new AbortController()
    this.#timeout = setTimeout(() => {
      controller.abort()
    }, this.#TIMEOUT)

    return controller
  }

  #cleanup() {
    if (this.#timeout) {
      clearTimeout(this.#timeout)
    }
  }

  /**
   * Extract video ID from YouTube URL
   */
  extractVideoId(url: string): string {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)

    if (!match) {
      throw new Error('Invalid YouTube URL')
    }

    return match[1]
  }

  /**
   * Get video ID from YouTube URL or ID
   */
  getVideoId(urlOrId: string): string {
    return urlOrId.length === 11 ? urlOrId : this.extractVideoId(urlOrId)
  }

  /**
   * Get video information
   */
  async getVideoInfo(urlOrId: string): Promise<YouTubeVideoInfo> {
    try {
      const videoId = this.getVideoId(urlOrId)

      const { stdout } = await $({
        cancelSignal: this.#createAbortController().signal,
        gracefulCancel: true,
        timeout: this.#TIMEOUT
      })`${this.#ytDlpPath} --quiet --dump-json ${videoId}`

      const info = JSON.parse(stdout)

      return {
        id: info.id,
        title: info.title,
        description: info.description,
        duration: info.duration,
        author: info.author
      }
    } catch (error) {
      throw new Error(`Failed to get video info: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Get video thumbnail
   */
  async getVideoThumbnailUrl(urlOrId: string): Promise<string> {
    try {
      const videoId = this.getVideoId(urlOrId)

      const { stdout } = await $({
        cancelSignal: this.#createAbortController().signal,
        gracefulCancel: true,
        timeout: this.#TIMEOUT
      })`${this.#ytDlpPath} --quiet --print thumbnail ${videoId}`

      return stdout
    } catch (error) {
      throw new Error(`Failed to get video thumbnail: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  /**
   * Download video with progress tracking
   */
  async downloadVideo(urlOrId: string, downloadPath: string) {
    try {
      const videoId = this.getVideoId(urlOrId)

      await $({
        cancelSignal: this.#createAbortController().signal,
        gracefulCancel: true,
        timeout: this.#TIMEOUT
      })`${this.#ytDlpPath} --quiet --force-overwrites -o ${downloadPath} ${videoId}`

    } catch (error) {
      throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

}
