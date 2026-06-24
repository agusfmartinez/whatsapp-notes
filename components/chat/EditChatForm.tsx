"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { Chat } from "@/types/chat"
import Image from "next/image"

interface EditChatFormProps {
  chat: Chat
  chatName: string
  setChatName: (name: string) => void
  chatDescription: string
  setChatDescription: (description: string) => void
  readReceipts: boolean
  setReadReceipts: (v: boolean) => void
  readDelayMinutes: number
  setReadDelayMinutes: (n: number) => void
  avatarPreview: string | null
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EditChatForm({
  chat,
  chatName,
  setChatName,
  chatDescription,
  setChatDescription,
  readReceipts,
  setReadReceipts,
  readDelayMinutes,
  setReadDelayMinutes,
  avatarPreview,
  onBack,
  onSubmit,
  onFileChange
}: EditChatFormProps) {
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
        <h1 className="text-lg font-medium">Editar chat</h1>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="px-4 mt-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-muted-foreground">Avatar</label>
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
                <Image 
                  src={chat.avatar || "/placeholder.svg"} 
                  alt="current avatar" 
                  width={48}
                  height={48}
                  className="w-full h-full object-cover" 
                  unoptimized
                />
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
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder="Ej: Ideas, Tareas, Compras…"
            className="bg-muted border-border text-foreground"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm text-muted-foreground mb-2">Descripción</label>
          <textarea
            value={chatDescription}
            onChange={(e) => setChatDescription(e.target.value)}
            placeholder="Descripción opcional…"
            rows={3}
            className="w-full rounded-md bg-muted border border-border text-foreground px-3 py-2 text-sm outline-none resize-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-3 pt-2 border-t border-border">
          <label className="flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-sm text-foreground">Confirmaciones de lectura (visto azul)</span>
            <input
              type="checkbox"
              checked={readReceipts}
              onChange={(e) => setReadReceipts(e.target.checked)}
              className="h-4 w-4 accent-[#21c063]"
            />
          </label>

          {readReceipts && (
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Demora del visto (minutos)</label>
              <Input
                type="number"
                min={0}
                value={readDelayMinutes}
                onChange={(e) => setReadDelayMinutes(Math.max(0, Number(e.target.value) || 0))}
                className="bg-muted border-border text-foreground w-32"
              />
              <p className="text-xs text-muted-foreground mt-1">
                0 = visto inmediato. Mayor a 0 simula que leen después de ese tiempo.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#21c063] hover:bg-green-600"
            disabled={!chatName.trim()}
          >
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
