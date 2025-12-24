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
  avatarPreview: string | null
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EditChatForm({
  chat,
  chatName,
  setChatName,
  avatarPreview,
  onBack,
  onSubmit,
  onFileChange
}: EditChatFormProps) {
  return (
    <div className="bg-[#0b1014] text-white h-[100dvh] w-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-white hover:bg-transparent"
          onClick={onBack}
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-medium">Editar chat</h1>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="px-4 mt-4 space-y-4">
        <div className="space-y-2">
          <label className="block text-sm text-gray-300">Avatar</label>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[#22292c] border border-gray-700">
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
          <label className="block text-sm text-gray-300 mb-2">Nombre del chat</label>
          <Input
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
            placeholder="Ej: Ideas, Tareas, Compras…"
            className="bg-[#22292c] border-gray-700 text-white"
            autoFocus
          />
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
