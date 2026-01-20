"use client"

import { Button } from "@/components/ui/button"

type ConfirmDeleteCategoryModalProps = {
  isOpen: boolean
  categoryName?: string
  onCancel: () => void
  onConfirm: () => void
}

export default function ConfirmDeleteCategoryModal({
  isOpen,
  categoryName,
  onCancel,
  onConfirm,
}: ConfirmDeleteCategoryModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-background text-foreground w-full max-w-md rounded-xl p-6">
        <h2 className="text-lg font-medium mb-2">Eliminar categoría</h2>
        <p className="text-muted-foreground mb-6">
          {`¿Eliminar la categoría${categoryName ? ` "${categoryName}"` : ""}? Los chats dejarán de tener categoría.`}
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} className="border-border">
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  )
}
