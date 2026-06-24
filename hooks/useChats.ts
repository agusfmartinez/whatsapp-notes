"use client"

import { useState, useEffect } from "react"
import { Chat, Category } from "@/types/chat"
import { formatTime } from "@/lib/time"

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loaded, setLoaded] = useState(false)

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("chats")
    if (saved) {
      const parsedChats = JSON.parse(saved)
      setChats(parsedChats)
    } else {
      setChats([])
    }

    const savedCategories = localStorage.getItem("categories")
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories))
      } catch {
        setCategories([])
      }
    }

    setLoaded(true)
  }, [])

  // Guardar cada vez que cambien los chats
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats))
  }, [chats])

  // Persistir categorías
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories))
  }, [categories])

  // Visto demorado: marca como leídos los mensajes cuyo readAt ya venció,
  // y programa un timer para los que vencen en el futuro.
  useEffect(() => {
    const now = Date.now()
    let hasDue = false
    const next = chats.map(chat => {
      let touched = false
      const msgs = chat.messages.map(m => {
        if (m.isSent && m.isRead === false && m.readAt && m.readAt <= now) {
          touched = true
          return { ...m, isRead: true, readAt: undefined }
        }
        return m
      })
      if (touched) hasDue = true
      return touched ? { ...chat, messages: msgs } : chat
    })

    if (hasDue) {
      setChats(next)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    chats.forEach(chat => {
      chat.messages.forEach(m => {
        if (m.isSent && m.isRead === false && m.readAt && m.readAt > now) {
          const id = m.id
          const chatId = chat.id
          timers.push(setTimeout(() => {
            setChats(prev => prev.map(c =>
              c.id === chatId
                ? { ...c, messages: c.messages.map(mm => mm.id === id ? { ...mm, isRead: true, readAt: undefined } : mm) }
                : c
            ))
          }, m.readAt - now))
        }
      })
    })
    return () => timers.forEach(clearTimeout)
  }, [chats])

  const createChat = (name: string, avatar?: string) => {
    const newChat: Chat = {
      id: Date.now(),
      name,
      avatar: avatar || "/placeholder.svg",
      messages: []
    }
    setChats(prev => [...prev, newChat])
    return newChat
  }

  const deleteChat = (chatId: number) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId))
  }

  const clearChat = (chatId: number) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId ? { ...chat, messages: [] } : chat
      )
    )
  }

  const sendMessage = (chatId: number, text: string, asMe: boolean) => {
    const now = new Date()
    const nowMs = now.getTime()
    setChats(prev =>
      prev.map(chat => {
        if (chat.id !== chatId) return chat

        // Estado del visto para mensajes enviados
        let isRead: boolean | undefined
        let readAt: number | undefined
        if (!asMe) {
          isRead = undefined // recibido: sin tilde de enviado
        } else {
          const receipts = chat.readReceipts !== false // default true
          const delayMin = chat.readDelayMinutes ?? 0
          if (!receipts) {
            isRead = false // nunca se pone azul (queda gris)
          } else if (delayMin > 0) {
            isRead = false
            readAt = nowMs + delayMin * 60000
          } else {
            isRead = true
          }
        }

        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: Date.now(),
              text,
              time: formatTime(now),
              timestamp: nowMs,
              isSent: asMe,
              isRead,
              readAt,
            },
          ],
        }
      })
    )
  }

  const deleteMessage = (chatId: number, messageId: number) => {
    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? { ...c, messages: c.messages.filter(m => m.id !== messageId) }
          : c
      )
    )
  }

  const editMessage = (chatId: number, messageId: number, newText: string) => {
    setChats(prev =>
      prev.map(c =>
        c.id === chatId
          ? {
            ...c,
            messages: c.messages.map(m =>
              m.id === messageId ? { ...m, text: newText } : m
            ),
          }
          : c
      )
    )
  }

  const updateChat = (chatId: number, updates: Partial<Pick<Chat, "name" | "avatar" | "description" | "category" | "isArchived" | "isPinned" | "showOnline" | "readReceipts" | "readDelayMinutes">>) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, ...updates }
          : chat
      )
    )
  }

  // Crea una categoría con id derivado del nombre (único). Devuelve el id.
  const addCategory = (label: string) => {
    const name = label.trim()
    if (!name) return null
    const baseId = name.toLowerCase().replace(/\s+/g, "-")
    let id = baseId
    setCategories(prev => {
      const exists = prev.some(c => c.id === baseId)
      id = exists ? `${baseId}-${Date.now()}` : baseId
      return [...prev, { id, label: name }]
    })
    return id
  }

  // Elimina la categoría y la quita de los chats que la usaban.
  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId))
    setChats(prev => prev.map(c => (c.category === categoryId ? { ...c, category: undefined } : c)))
  }

  // Reemplaza chats y categorías desde un export importado.
  const importData = (data: { chats?: unknown; categories?: unknown }) => {
    if (Array.isArray(data?.chats)) setChats(data.chats as Chat[])
    if (Array.isArray(data?.categories)) setCategories(data.categories as Category[])
  }

  return {
    chats,
    setChats,
    categories,
    loaded,
    createChat,
    deleteChat,
    clearChat,
    sendMessage,
    deleteMessage,
    editMessage,
    updateChat,
    addCategory,
    deleteCategory,
    importData
  }
}
