export async function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function supportsWebP(): boolean {
  try {
    const c = document.createElement("canvas")
    return c.toDataURL("image/webp").startsWith("data:image/webp")
  } catch {
    return false
  }
}

/**
 * Recorta un CUADRADO desde la imagen fuente y exporta comprimido.
 * - srcDataURL: dataURL de la imagen original
 * - crop: {x, y, size} en coordenadas de la imagen original
 * - exportSize: tamaño final (ej 256 => 256x256)
 * - preferWebP: si true, intenta webp y cae a jpeg si no hay soporte
 */
export async function compressDataURL(
  srcDataURL: string, 
  crop: { x: number; y: number; size: number }, 
  exportSize = 256, 
  preferWebP = true, 
  quality = 0.8
): Promise<string> {
  const img = new Image()
  img.src = srcDataURL
  await img.decode()

  const { x, y, size } = crop

  const canvas = document.createElement("canvas")
  canvas.width = exportSize
  canvas.height = exportSize
  const ctx = canvas.getContext("2d")!

  // dibujar el recorte cuadrado escalado al canvas
  ctx.drawImage(img, x, y, size, size, 0, 0, exportSize, exportSize)

  const useWebP = preferWebP && supportsWebP()
  const mime = useWebP ? "image/webp" : "image/jpeg"
  return canvas.toDataURL(mime, quality)
}
