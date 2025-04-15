import type { FilePond as FilePondContrat, FilePondFile, FileStatus } from 'filepond'
import type { Ref } from 'vue'

import * as FilePond from 'filepond'
import { defineStore } from 'pinia'
import { tuyau } from '~/settings/tuyau'
import { ref } from 'vue'

type File  = {
  filename: string,
  id: string,
  fileSize: number,
  progress?: number,
  status: FileStatus,
  statusLabel: string
}

function getEnumKeyByValue<T extends object>(enumObj: T, value: number): string | undefined {
  return Object.entries(enumObj).find(([_, v]) => v === value)?.[0]
}

export const useUploadStore = defineStore('uploadStore', () => {
  const filePond: Ref<FilePondContrat | undefined> = ref()
  const files = ref<File[]>([])

  function init() {
    const inputElement = document.querySelector('#uploads')

    if (!inputElement) {
      return false
    }

    const pond = FilePond.create(inputElement, {
      name: 'uploads'
    })
    pond.setOptions({
      server: tuyau.$route('uploads').path,
      // server: {
      //   process: tuyau.$route('uploads').path,
      //   load: null,
      //   restore: null,
      //   fetch: null,
      //   revert: null,
      // },
    })

    pond.on('addfile', (error: unknown, item: FilePondFile) => {
      if (error) {
        console.error(error)
        return
      }

      files.value.unshift({
        filename: item.filename,
        id: item.id,
        fileSize: item.fileSize,
        progress: undefined,
        status: item.status,
        statusLabel: getEnumKeyByValue(FilePond.FileStatus, item.status)!
      })
    })

    pond.on('removefile', (error: unknown, item: FilePondFile) => {
      if (error) {
        console.error(error)
        return
      }

      files.value = files.value.filter((objet) => objet.id !== item.id)
    })

    const callback = (item: FilePondFile, progress?: number) => {
      const file = files.value.find((file) => file.id === item.id)
      if (file) {
        file.status = item.status
        file.statusLabel = getEnumKeyByValue(FilePond.FileStatus, item.status)!

        if (progress) {
          file.progress = Math.ceil(progress * 100)
        }
      }
    }

    pond.on('processfilestart', callback)
    pond.on('processfileabort', callback)
    pond.on('processfileprogress', callback)

    pond.on('error', (error: unknown, item: FilePondFile) => {
      const file = files.value.find((file) => file.id === item.id)
      if (file && !file.progress) {
        file.progress = 0
      }

      callback(item)
      console.error(error)
    })

    filePond.value = pond
  }

  function browse() {
    if (filePond.value) {
      filePond.value.browse()
    }
  }

  function load(file: File) {
    if (filePond.value) {
      const item = filePond.value.getFile(file.id)
      const input = item.file

      filePond.value.addFile(input)
      item.abortLoad()
    }
  }

  function remove(file: File) {
    if (filePond.value) {
      filePond.value.removeFile(file.id)
    }
  }

  function abord(file: File) {
    if (filePond.value) {
      const item = filePond.value.getFile(file.id)
      item.abortProcessing()
    }
  }

  function clear() {
    files.value.forEach((file) => {
      if (filePond.value && FilePond.FileStatus.PROCESSING_COMPLETE === file.status) {
        filePond.value.removeFile(file.id)
      }
    })
  }

  function isProcessing(file: File) {
    if (
      FilePond.FileStatus.INIT === file.status ||
      FilePond.FileStatus.IDLE === file.status ||
      FilePond.FileStatus.PROCESSING === file.status ||
      FilePond.FileStatus.PROCESSING_QUEUED === file.status
    ) {
      return true
    }
    return false
  }

  function isComplete(file: File) {
    if (
      FilePond.FileStatus.PROCESSING_COMPLETE === file.status
    ) {
      return true
    }
    return false
  }

  function isError(file: File) {
    if (
      FilePond.FileStatus.PROCESSING_ERROR === file.status
    ) {
      return true
    }
    return false
  }

  function isAbort(file: File) {
    if (
      FilePond.FileStatus.IDLE === file.status
    ) {
      return true
    }
    return false
  }

  return {
    files,
    init,
    load,
    abord,
    remove,
    clear,
    isProcessing,
    isComplete,
    isAbort,
    isError,
    browse
  }
})
