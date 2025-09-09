"use client"

import { Button } from "@/components/ui/button"

type ConfirmDeleteChatModalProps = {
  isOpen: boolean
  chatName?: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDeleteChatModal({
  isOpen,
  chatName,
  onCancel,
  onConfirm,
}: ConfirmDeleteChatModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#0b1014] text-white w-full max-w-md rounded-xl p-6">
        <h2 className="text-lg font-medium mb-2">Eliminar chat</h2>
        <p className="text-gray-300 mb-6">
          {`¿Desea eliminar el chat${chatName ? ` "${chatName}"` : ""}? Esta acción no se puede deshacer.`}
        </p>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}
