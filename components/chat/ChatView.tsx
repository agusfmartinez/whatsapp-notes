"use client"

import { useRef } from "react"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import Composer from "./Composer"
import { Chat, Message } from "@/types/chat"

interface ChatViewProps {
  chat: Chat
  composeAsMe: boolean
  inputValue: string
  setInputValue: (value: string) => void
  selectedMsg: { chatId: number; msgId: number } | null
  editingTarget: { chatId: number; msgId: number } | null
  kbOffset: number
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

export default function ChatView({
  chat,
  composeAsMe,
  inputValue,
  setInputValue,
  selectedMsg,
  editingTarget,
  kbOffset,
  onBack,
  onAvatarClick,
  onDeleteChat,
  onToggleComposeMode,
  onEditMessage,
  onDeleteMessage,
  onEditChat,
  onSendMessage,
  onSaveEdit,
  onStartSelectLongPress,
  onCancelLongPress,
  onDeselectMessage
}: ChatViewProps) {
  const messagesRef = useRef<HTMLDivElement | null>(null)

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim(), composeAsMe)
      setInputValue("")
      requestAnimationFrame(() => {
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight
        }
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (inputValue.trim()) {
        if (editingTarget) {
          onSaveEdit()
        } else {
          onSendMessage(inputValue.trim(), composeAsMe)
        }
        requestAnimationFrame(() => {
          if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight
          }
        })
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
        onBack={onBack}
        onAvatarClick={onAvatarClick}
        onDeleteChat={onDeleteChat}
        onToggleComposeMode={onToggleComposeMode}
        onEditMessage={onEditMessage}
        onDeleteMessage={onDeleteMessage}
        onEditChat={onEditChat}
      />

      {/* Messages (scrolleable) */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
        style={{ paddingBottom: kbOffset + 88, scrollPaddingBottom: 88 }}
        onClick={(e) => {
          // si hacés tap en el fondo (no sobre un bubble), des-selecciona
          if (e.target === e.currentTarget) {
            onDeselectMessage()
          }
        }}
      >
        {chat.messages.map((message) => {
          const isSelected =
            selectedMsg?.chatId === chat.id && selectedMsg?.msgId === message.id

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isSelected={isSelected}
              onLongPress={() => onStartSelectLongPress(chat.id, message.id)}
              onLongPressCancel={onCancelLongPress}
            />
          )
        })}
      </div>

      <Composer
        inputValue={inputValue}
        setInputValue={setInputValue}
        isEditing={!!editingTarget}
        onSend={handleSend}
        onSaveEdit={onSaveEdit}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        messagesRef={messagesRef as React.RefObject<HTMLDivElement>}
      />
    </div>
  )
}
