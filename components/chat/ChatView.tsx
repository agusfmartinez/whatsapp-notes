"use client"

import { useEffect, useRef } from "react"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import Composer from "./Composer"
import { Chat } from "@/types/chat"

interface ChatController {
  onBack: () => void
  onAvatarClick: (avatarSrc: string) => void
  onDeleteChat: (chatId: number) => void
  onToggleComposeMode: () => void
  onEditMessage: () => void
  onDeleteMessage: () => void
  onEditChat: () => void
  onSendMessage: (text: string, asMe: boolean) => void
  onSaveEdit: () => void
  onStartSelectLongPress: (chatId: number, msgId: number) => void
  onCancelLongPress: () => void
  onDeselectMessage: () => void
}

interface ChatViewProps {
  chat: Chat
  composeAsMe: boolean
  inputValue: string
  setInputValue: (value: string) => void
  selectedMsg: { chatId: number; msgId: number } | null
  editingTarget: { chatId: number; msgId: number } | null
  kbOffset: number
  chatController: ChatController
}

export default function ChatView({
  chat,
  composeAsMe,
  inputValue,
  setInputValue,
  selectedMsg,
  editingTarget,
  kbOffset,
  chatController
}: ChatViewProps) {
  const messagesRef = useRef<HTMLDivElement | null>(null)

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
      }
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chat.id, chat.messages.length])

  const formatDateLabel = (timestamp?: number) => {
    if (!timestamp) return ""
    const msgDate = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    const sameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()

    if (sameDay(msgDate, today)) return "Hoy"
    if (sameDay(msgDate, yesterday)) return "Ayer"
    return msgDate.toLocaleDateString([], { day: "2-digit", month: "short" })
  }

  const messagesWithLabels: React.ReactNode[] = []
  let lastLabel = ""

  chat.messages.forEach((message) => {
    const label = formatDateLabel(message.timestamp)
    if (label && label !== lastLabel) {
      messagesWithLabels.push(
        <div key={`${message.id}-label`} className="flex justify-center my-2">
          <span className="text-xs text-gray-300 bg-[#1a222b] px-3 py-1 rounded-full">
            {label}
          </span>
        </div>
      )
      lastLabel = label
    }

    const isSelected =
      selectedMsg?.chatId === chat.id && selectedMsg?.msgId === message.id

    messagesWithLabels.push(
      <MessageBubble
        key={message.id}
        message={message}
        isSelected={isSelected}
        onLongPress={() => chatController.onStartSelectLongPress(chat.id, message.id)}
        onLongPressCancel={chatController.onCancelLongPress}
      />
    )
  })

  const handleSend = () => {
    if (inputValue.trim()) {
      chatController.onSendMessage(inputValue.trim(), composeAsMe)
      setInputValue("")
      scrollToBottom()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (inputValue.trim()) {
        if (editingTarget) {
          chatController.onSaveEdit()
        } else {
          chatController.onSendMessage(inputValue.trim(), composeAsMe)
        }
        scrollToBottom()
      }
    }
  }

  const handleFocus = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }
  

  return (
    <div className="bg-red-900/50 text-white h-[100dvh] w-screen flex flex-col overflow-hidden">
      <ChatHeader
        chat={chat}
        composeAsMe={composeAsMe}
        selectedMsg={selectedMsg}
        onBack={chatController.onBack}
        onAvatarClick={chatController.onAvatarClick}
        onDeleteChat={chatController.onDeleteChat}
        onToggleComposeMode={chatController.onToggleComposeMode}
        onEditMessage={chatController.onEditMessage}
        onDeleteMessage={chatController.onDeleteMessage}
        onEditChat={chatController.onEditChat}
      />

      {/* Messages (scrolleable) */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
        style={{ paddingBottom: kbOffset + 88, scrollPaddingBottom: 88 }}
        onClick={(e) => {
          // si hacés tap en el fondo (no sobre un bubble), des-selecciona
          if (e.target === e.currentTarget) {
            chatController.onDeselectMessage()
          }
        }}
      >
        {messagesWithLabels.length > 0 ? (
          messagesWithLabels
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm text-center px-6">
            No hay mensajes. Escribe para comenzar la conversación.
          </div>
        )}
      </div>

      <Composer
        inputValue={inputValue}
        setInputValue={setInputValue}
        isEditing={!!editingTarget}
        onSend={handleSend}
        onSaveEdit={chatController.onSaveEdit}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        messagesRef={messagesRef as React.RefObject<HTMLDivElement>}
      />
    </div>
  )
}
