// Loads a File selected from an <input type="file"> into an <img>,
// resized down to maxDimension on its longest side, drawn onto a
// canvas. Shared by the data-url and blob helpers below.
function loadResizedCanvas(file, maxDimension) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'))
    if (!file.type.startsWith('image/')) return reject(new Error('File is not an image'))

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not load image'))
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width)
          width = maxDimension
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height)
          height = maxDimension
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

// Reads a File selected from an <input type="file"> and returns a
// compressed, base64-encoded JPEG data URL small enough to store as a
// plain string field on a Firestore document (Firestore's per-document
// limit is 1MB; at these settings each photo is typically 40-80KB,
// so hundreds of products fit comfortably within Firestore's free tier).
//
// maxDimension: longest side (px) the image is resized down to.
// quality: JPEG quality (0-1).
export async function fileToCompressedDataUrl(file, { maxDimension = 640, quality = 0.72 } = {}) {
  const canvas = await loadResizedCanvas(file, maxDimension)
  return canvas.toDataURL('image/jpeg', quality)
}
