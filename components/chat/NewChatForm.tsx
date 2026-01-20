"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

interface NewChatFormProps {
  newChatName: string
  setNewChatName: (name: string) => void
  avatarPreview: string | null
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function NewChatForm({
  newChatName,
  setNewChatName,
  avatarPreview,
  onBack,
  onSubmit,
  onFileChange
}: NewChatFormProps) {
  return (
    <div className="bg-background text-foreground h-[100dvh] w-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-foreground hover:bg-transparent"
          onClick={onBack}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-medium">Nuevo chat</h1>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="px-4 mt-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-muted-foreground">Avatar (opcional)</label>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted border border-border">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="preview"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                  Sin foto
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Nombre del chat</label>
          <Input
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            placeholder="Ej: Ideas, Tareas, Compras…"
            className="bg-muted border-border text-foreground"
            autoFocus
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#21c063] hover:bg-green-600"
            disabled={!newChatName.trim()}
          >
            Guardar
          </Button>
        </div>
      </form>
    </div>
  )
}
