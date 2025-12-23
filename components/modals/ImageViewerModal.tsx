"use client"

import Image from "next/image"

interface ImageViewerModalProps {
  isOpen: boolean
  src: string | null
  onClose: () => void
}

export default function ImageViewerModal({ isOpen, src, onClose }: ImageViewerModalProps) {
  if (!isOpen || !src) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative w-full h-full max-w-[90vw] max-h-[85vh]">
        <Image
          src={src}
          alt="avatar"
          fill
          sizes="90vw"
          className="object-contain rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          unoptimized
        />
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/90 bg-black/40 rounded-full px-3 py-1"
      >
        Cerrar
      </button>
    </div>
  )
}
