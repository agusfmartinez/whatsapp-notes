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
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: Date.now(),
                text,
                time: formatTime(now),
                timestamp: now.getTime(),
                isSent: asMe,
                isRead: asMe ? true : undefined,
              }
            ]
          }
          : chat
      )
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

  const updateChat = (chatId: number, updates: Partial<Pick<Chat, "name" | "avatar" | "description" | "category" | "isArchived" | "isPinned" | "showOnline">>) => {
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
    deleteCategory
  }
}
