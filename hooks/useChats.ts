"use client"

import { useState, useEffect } from "react"
import { Chat } from "@/types/chat"
import { formatTime } from "@/lib/time"

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([])

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("chats")
    if (saved) {
      const parsedChats = JSON.parse(saved)
      setChats(parsedChats)
    } else {
      setChats([])
    }
  }, [])

  // Guardar cada vez que cambien los chats
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats))
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

  const updateChat = (chatId: number, updates: Partial<Pick<Chat, "name" | "avatar" | "category">>) => {
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, ...updates }
          : chat
      )
    )
  }

  return {
    chats,
    setChats,
    createChat,
    deleteChat,
    sendMessage,
    deleteMessage,
    editMessage,
    updateChat
  }
}
