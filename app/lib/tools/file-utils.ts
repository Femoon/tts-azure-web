interface DownloadOptions {
  appendTimestamp?: boolean
  timestampSeparator?: string
}

const DEFAULT_DOWNLOAD_OPTIONS: DownloadOptions = {
  appendTimestamp: false,
  timestampSeparator: '_',
}

function parseFileName(fileName: string): { name: string; ext: string } {
  const lastDotIndex = fileName.lastIndexOf('.')

  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return { name: fileName, ext: '' }
  }

  return {
    name: fileName.substring(0, lastDotIndex),
    ext: fileName.substring(lastDotIndex),
  }
}

export function saveAs(blob: Blob, name: string, options: DownloadOptions = DEFAULT_DOWNLOAD_OPTIONS): void {
  const opts = { ...DEFAULT_DOWNLOAD_OPTIONS, ...options }

  let fileName = name
  if (opts.appendTimestamp) {
    const timestamp = getFormatDate(new Date())
    const { name: baseName, ext } = parseFileName(fileName)
    fileName = `${baseName}${opts.timestampSeparator}${timestamp}${ext}`
  }

  const a = document.createElement('a')
  document.body.appendChild(a)
  a.setAttribute('style', 'display: none')

  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = fileName
  a.click()

  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}

export function getFormatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`
}
