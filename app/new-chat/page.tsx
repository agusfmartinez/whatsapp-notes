// app/new-chat/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Check } from "lucide-react"

type Message = {
  id: number
  text: string
  time: string
  timestamp: number
  isSent: boolean
  isRead?: boolean
}
type Chat = {
  id: number
  name: string
  avatar?: string
  messages: Message[]
  isPinned?: boolean
  hasSticker?: boolean
  isOfficial?: boolean
  isGroup?: boolean
  hasArrow?: boolean
  hasStatus?: boolean
}

export default function NewChatPage() {
  const router = useRouter()
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    // leer y actualizar localStorage
    const raw = localStorage.getItem("chats")
    const chats: Chat[] = raw ? JSON.parse(raw) : []

    const newChat: Chat = {
      id: Date.now(),
      name: trimmed,
      avatar: "/placeholder.svg",
      messages: [],
    }

    const updated = [...chats, newChat]
    localStorage.setItem("chats", JSON.stringify(updated))

    // guardar id para abrirlo automáticamente al volver
    localStorage.setItem("openChatId", String(newChat.id))

    router.push("/") // volver a la home (lista de chats)
  }

  return (
    <div className="bg-[#0b1014] text-white h-[100dvh] w-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Button variant="ghost" size="sm" className="p-0 h-auto text-white hover:bg-transparent" onClick={() => router.back()}>
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-medium">Nuevo chat</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 mt-4 space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Nombre del chat</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Ideas, Tareas, Compras…"
            className="bg-[#22292c] border-gray-700 text-white"
            autoFocus
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="bg-[#21c063] hover:bg-green-600">
            <Check className="mr-2 h-4 w-4" /> Guardar
          </Button>
        </div>
      </form>
    </div>
  )
}
