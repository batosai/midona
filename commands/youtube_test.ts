import { BaseCommand, flags } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { YouTubeService } from '#services/youtube_service'

export default class YoutubeTest extends BaseCommand {
  static commandName = 'youtube:test'
  static description = ''

  static options: CommandOptions = {
    // startApp: true,
  }

  @flags.string()
  declare id: string

  async run() {
    const { youtubeUrlValidator, youtubeIdValidator } = await import('#validators/youtube')

    let { id } = this.parsed.flags

    if (!id) {
      id = await this.prompt.ask('Enter the id or url Youtube', {
        async validate(value) {
          let isValid = false
          try {
            await youtubeUrlValidator.validate({ url: value })
            isValid = true
          } catch (error) {}

          try {
            await youtubeIdValidator.validate({ id: value })
            isValid = true
          } catch (error) {}

          return isValid
        },
      })
    }

    const youtubeService = new YouTubeService()
    const videoInfo = await youtubeService.getVideoInfo(id)
    this.logger.log(JSON.stringify(videoInfo, null, 2))

    const thumbnailUrl = await youtubeService.getVideoThumbnailUrl(id)
    this.logger.log(thumbnailUrl)

    await youtubeService.downloadVideo(id, this.app.tmpPath('name'))
  }
}
