"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import Composer from "./Composer"
import { Chat } from "@/types/chat"
import { formatDayLabel } from "@/lib/time"
import { strings } from "@/strings/es"

interface ChatController {
  onBack: () => void
  onAvatarClick: (avatarSrc: string) => void
  onDeleteChat: (chatId: number) => void
  onArchiveChat: () => void
  onUnarchiveChat: () => void
  onTogglePin: () => void
  onClearChat: (chatId: number) => void
  onToggleOnline: () => void
  onToggleComposeMode: () => void
  onEditMessage: () => void
  onDeleteMessage: () => void
  onEditChat: () => void
  onAssignCategory: (category: string | null) => void
  categories: { id: string; label: string }[]
  onCreateCategory: () => void
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
  const [searchOpen, setSearchOpen] = useState(false)
  const [msgQuery, setMsgQuery] = useState("")

  // Cerrar/limpiar el buscador al cambiar de chat
  useEffect(() => {
    setSearchOpen(false)
    setMsgQuery("")
  }, [chat.id])

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

  const query = msgQuery.trim().toLowerCase()
  const visibleMessages = query
    ? chat.messages.filter((m) => m.text.toLowerCase().includes(query))
    : chat.messages

  const messagesWithLabels: React.ReactNode[] = []
  let lastLabel = ""
  let prevSent: boolean | null = null

  visibleMessages.forEach((message) => {
    let labelBreak = false
    // Al buscar no se muestran separadores de fecha (cada match es su propio grupo)
    if (!query) {
      const label = message.timestamp ? formatDayLabel(message.timestamp) : ""
      if (label && label !== lastLabel) {
        messagesWithLabels.push(
          <div key={`${message.id}-label`} className="flex justify-center my-2">
            <span className="text-xs text-gray-300 bg-[#1a222b] px-3 py-1 rounded-full">
              {label}
            </span>
          </div>
        )
        lastLabel = label
        labelBreak = true
      }
    }

    const isSelected =
      selectedMsg?.chatId === chat.id && selectedMsg?.msgId === message.id

    // Primer mensaje de la cadena: cambia el emisor o hay un separador de fecha
    const isFirstOfGroup = labelBreak || prevSent === null || prevSent !== message.isSent
    prevSent = message.isSent

    messagesWithLabels.push(
      <MessageBubble
        key={message.id}
        message={message}
        isSelected={isSelected}
        isFirstOfGroup={isFirstOfGroup}
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
    <div className="bg-background text-foreground h-[100dvh] w-screen flex flex-col overflow-hidden">
      <ChatHeader
        chat={chat}
        composeAsMe={composeAsMe}
        selectedMsg={selectedMsg}
        onBack={chatController.onBack}
        onAvatarClick={chatController.onAvatarClick}
        onDeleteChat={chatController.onDeleteChat}
        onArchiveChat={chatController.onArchiveChat}
        onUnarchiveChat={chatController.onUnarchiveChat}
        onTogglePin={chatController.onTogglePin}
        onClearChat={chatController.onClearChat}
        onToggleOnline={chatController.onToggleOnline}
        onToggleComposeMode={chatController.onToggleComposeMode}
        onEditMessage={chatController.onEditMessage}
        onDeleteMessage={chatController.onDeleteMessage}
        onEditChat={chatController.onEditChat}
        onAssignCategory={chatController.onAssignCategory}
        categories={chatController.categories}
        onCreateCategory={chatController.onCreateCategory}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {searchOpen && (
        <div className="flex items-center gap-2 px-4 py-2 bg-background border-b border-border">
          <Search size={18} className="text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            autoFocus
            value={msgQuery}
            onChange={(e) => setMsgQuery(e.target.value)}
            placeholder={strings.chatMenu.searchPlaceholder}
            aria-label={strings.chatMenu.searchPlaceholder}
            className="flex-1 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => { setSearchOpen(false); setMsgQuery("") }}
            aria-label={strings.chatMenu.closeSearch}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Messages (scrolleable) */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
        style={{ paddingBottom: kbOffset + 88, scrollPaddingBottom: 88 }}
        onClick={() => {
          // tap en cualquier parte del área de mensajes (fuera de una burbuja)
          // des-selecciona; la burbuja frena la propagación.
          chatController.onDeselectMessage()
        }}
      >
        {messagesWithLabels.length > 0 ? (
          messagesWithLabels
        ) : (
          <div className="h-full flex items-center justify-center text-foreground text-sm text-center px-6">
            {query ? strings.chatMenu.searchNoResults : strings.emptyMessages}
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
