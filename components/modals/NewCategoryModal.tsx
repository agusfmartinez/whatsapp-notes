"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type NewCategoryModalProps = {
  isOpen: boolean
  name: string
  onNameChange: (value: string) => void
  onCancel: () => void
  onSave: () => void
}

export default function NewCategoryModal({
  isOpen,
  name,
  onNameChange,
  onCancel,
  onSave,
}: NewCategoryModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[110] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-background text-foreground w-full max-w-md rounded-xl p-6">
        <h2 className="text-lg font-medium mb-2">Nueva categoría</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Escribí un nombre para la categoría.
        </p>

        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ej: Trabajo, Proyectos..."
          className="bg-muted border-border text-foreground"
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onCancel} className="border-border">
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!name.trim()}
          >
            Guardar
          </Button>
        </div>
      </div>
    </div>
  )
}
