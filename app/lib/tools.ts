export function downloadAudio(arrayBuffer: ArrayBuffer) {
  // Step 1: Convert ArrayBuffer to Blob
  const blob = new Blob([arrayBuffer], { type: 'audio/wav' })

  // Step 2: Create a URL for the Blob
  const url = URL.createObjectURL(blob)

  // Step 3: Create a download link and trigger the download
  const downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.download = 'downloaded_audio.wav' // You can specify the filename here
  document.body.appendChild(downloadLink)
  downloadLink.click()

  // Clean up by revoking the Blob URL and removing the link
  URL.revokeObjectURL(url)
  document.body.removeChild(downloadLink)
}

export function saveAs(blob: Blob, name: string) {
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.setAttribute('style', 'display: none')
  const url = window.URL.createObjectURL(blob)
  a.href = url
  a.download = name
  a.click()
  window.URL.revokeObjectURL(url)
}
