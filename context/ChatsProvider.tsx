"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Chat, Message } from "@/types/chat"

// —— Claves de storage —— //
const LS_KEY = "chats"

// —— Helpers tiempo —— //
function fmtTime(d = new Date()) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

// —— Tipos del contexto —— //
type EditingTarget = { chatId: number; msgId: number } | null

type ChatsContextValue = {
  // estado
  chats: Chat[]
  selectedChatId: number | null
  composeAsMe: boolean
  selectedMsg: { chatId: number; msgId: number } | null
  editingTarget: EditingTarget

  // derivados
  selectedChat: Chat | null

  // acciones de chats
  createChat: (name: string, avatar?: string) => number
  deleteChat: (chatId: number) => void
  setSelectedChatId: (id: number | null) => void
  updateAvatar: (chatId: number, dataUrl: string) => void

  // mensajes
  sendMessage: (chatId: number, text: string, asMe?: boolean) => void
  beginEditSelected: () => void
  saveEdit: (newText: string) => void
  deleteSelectedMessage: () => void

  // selección / modo composición
  selectMessage: (chatId: number, msgId: number) => void
  clearSelection: () => void
  toggleComposeAsMe: () => void
}

const ChatsContext = createContext<ChatsContextValue | null>(null)

// —— Provider —— //
export function ChatsProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null)
  const [composeAsMe, setComposeAsMe] = useState<boolean>(true) // true: envío yo
  const [selectedMsg, setSelectedMsg] = useState<{ chatId: number; msgId: number } | null>(null)
  const [editingTarget, setEditingTarget] = useState<EditingTarget>(null)

  // Cargar al iniciar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setChats(JSON.parse(raw))
    } catch {
      // no-op
    }
  }, [])

  // Guardar cada cambio
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(chats))
    } catch {
      // no-op
    }
  }, [chats])

  // Chat seleccionado derivado
  const selectedChat = useMemo(
    () => chats.find(c => c.id === selectedChatId) || null,
    [chats, selectedChatId]
  )

  // —— Acciones —— //
  const createChat: ChatsContextValue["createChat"] = (name, avatar) => {
    const id = Date.now()
    const newChat: Chat = {
      id,
      name: name.trim(),
      avatar: avatar || "/placeholder.svg",
      messages: [],
    }
    setChats(prev => [...prev, newChat])
    setSelectedChatId(id)
    // limpiar selecciones
    setSelectedMsg(null)
    setEditingTarget(null)
    return id
  }

  const deleteChat: ChatsContextValue["deleteChat"] = (chatId) => {
    setChats(prev => prev.filter(c => c.id !== chatId))
    if (selectedChatId === chatId) setSelectedChatId(null)
    setSelectedMsg(null)
    setEditingTarget(null)
  }

  const updateAvatar: ChatsContextValue["updateAvatar"] = (chatId, dataUrl) => {
    setChats(prev => prev.map(c => (c.id === chatId ? { ...c, avatar: dataUrl } : c)))
  }

  const sendMessage: ChatsContextValue["sendMessage"] = (chatId, text, asMe) => {
    const now = new Date()
    const msg: Message = {
      id: Date.now(),
      text: text.trim(),
      time: fmtTime(now),
      timestamp: now.getTime(),
      isSent: asMe ?? composeAsMe,
      isRead: (asMe ?? composeAsMe) ? true : undefined,
    }
    if (!msg.text) return

    setChats(prev =>
      prev.map(c => (c.id === chatId ? { ...c, messages: [...c.messages, msg] } : c))
    )
    // al enviar/guardar, limpiamos selección/edición
    setSelectedMsg(null)
    setEditingTarget(null)
  }

  const selectMessage: ChatsContextValue["selectMessage"] = (chatId, msgId) => {
    setSelectedMsg({ chatId, msgId })
    setEditingTarget(null) // si había edición, salgo
  }

  const clearSelection: ChatsContextValue["clearSelection"] = () => {
    setSelectedMsg(null)
    // no tocamos editingTarget para no perder texto en UI si lo manejás ahí
  }

  const beginEditSelected: ChatsContextValue["beginEditSelected"] = () => {
    if (!selectedMsg) return
    setEditingTarget(selectedMsg)
  }

  const saveEdit: ChatsContextValue["saveEdit"] = (newText) => {
    if (!editingTarget) return
    const trimmed = newText.trim()
    if (!trimmed) return
    setChats(prev =>
      prev.map(c =>
        c.id === editingTarget.chatId
          ? {
              ...c,
              messages: c.messages.map(m =>
                m.id === editingTarget.msgId ? { ...m, text: trimmed } : m
              ),
            }
          : c
      )
    )
    setEditingTarget(null)
    setSelectedMsg(null)
  }

  const deleteSelectedMessage: ChatsContextValue["deleteSelectedMessage"] = () => {
    if (!selectedMsg) return
    setChats(prev =>
      prev.map(c =>
        c.id === selectedMsg.chatId
          ? { ...c, messages: c.messages.filter(m => m.id !== selectedMsg.msgId) }
          : c
      )
    )
    setSelectedMsg(null)
    setEditingTarget(null)
  }

  const toggleComposeAsMe: ChatsContextValue["toggleComposeAsMe"] = () => {
    setComposeAsMe(v => !v)
  }

  const value: ChatsContextValue = {
    // estado
    chats,
    selectedChatId,
    composeAsMe,
    selectedMsg,
    editingTarget,

    // derivados
    selectedChat,

    // acciones
    createChat,
    deleteChat,
    setSelectedChatId,
    updateAvatar,

    sendMessage,
    beginEditSelected,
    saveEdit,
    deleteSelectedMessage,

    selectMessage,
    clearSelection,
    toggleComposeAsMe,
  }

  return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>
}

// —— Hook de consumo —— //
export function useChats() {
  const ctx = useContext(ChatsContext)
  if (!ctx) throw new Error("useChats must be used within <ChatsProvider>")
  return ctx
}
