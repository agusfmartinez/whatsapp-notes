"use client"

import Image from "next/image"

interface AvatarCropperModalProps {
  isOpen: boolean
  cropSrc: string | null
  cropW: number
  cropH: number
  cropX: number
  cropY: number
  cropSize: number
  onClose: () => void
  onCropXChange: (x: number) => void
  onCropYChange: (y: number) => void
  onCropSizeChange: (size: number) => void
  onSave: () => void
}

export default function AvatarCropperModal({
  isOpen,
  cropSrc,
  cropW,
  cropH,
  cropX,
  cropY,
  cropSize,
  onClose,
  onCropXChange,
  onCropYChange,
  onCropSizeChange,
  onSave
}: AvatarCropperModalProps) {
  if (!isOpen || !cropSrc) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-background text-foreground w-full max-w-md rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-medium">Recortar avatar</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>

        {/* Preview con rectángulo de recorte (solo ilustrativo) */}
        <div className="relative bg-muted rounded-md overflow-hidden aspect-square mb-3">
          {/* imagen completa ajustada a contenedor */}
          <div className="absolute inset-0">
            <Image
              src={cropSrc}
              alt="to-crop"
              fill
              sizes="256px"
              className="object-contain"
              unoptimized
            />
          </div>
          {/* Overlay para marcar el recorte: lo representamos visualmente */}
          <div
            className="absolute border-2 border-primary/80"
            style={{
              // convertimos recorte (en coords reales) a coords del contenedor
              left: `${(cropX / cropW) * 100}%`,
              top: `${(cropY / cropH) * 100}%`,
              width: `${(cropSize / cropW) * 100}%`,
              height: `${(cropSize / cropH) * 100}%`,
            }}
          />
        </div>

        {/* Sliders */}
        <div className="space-y-3">
          <div>
            <label className="text-sm text-muted-foreground">Posición X</label>
            <input
              type="range"
              min={0}
              max={Math.max(0, cropW - cropSize)}
              value={cropX}
              onChange={(e) => onCropXChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Posición Y</label>
            <input
              type="range"
              min={0}
              max={Math.max(0, cropH - cropSize)}
              value={cropY}
              onChange={(e) => onCropYChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Tamaño</label>
            <input
              type="range"
              min={50}
              max={Math.min(cropW, cropH)}
              value={cropSize}
              onChange={(e) => {
                const next = parseInt(e.target.value)
                onCropSizeChange(next)
                // clamp X/Y para que no se salga
                onCropXChange(Math.min(cropX, Math.max(0, cropW - next)))
                onCropYChange(Math.min(cropY, Math.max(0, cropH - next)))
              }}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-md bg-muted hover:bg-muted/80 text-foreground"
          >
            Cancelar
          </button>
          <button
            onClick={onSave}
            className="px-3 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Recortar y guardar
          </button>
        </div>
      </div>
    </div>
  )
}
