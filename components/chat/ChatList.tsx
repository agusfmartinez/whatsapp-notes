"use client"

import ChatListItem from "./ChatListItem"
import { Chat } from "@/types/chat"

type ChatListProps = {
  chats: Chat[]
  onChatClick: (chat: Chat) => void
  onAvatarClick: (avatarSrc: string) => void
}

export default function ChatList({ chats, onChatClick, onAvatarClick }: ChatListProps) {
  const sortedChats = [...chats].sort((a, b) => {
    const lastA = a.messages[a.messages.length - 1]
    const lastB = b.messages[b.messages.length - 1]

    if (!lastA && !lastB) return 0
    if (!lastA) return 1
    if (!lastB) return -1

    return (lastB?.timestamp || 0) - (lastA?.timestamp || 0)
  })

  if (!sortedChats.length) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm px-6 text-center">
        No hay chats aún. Crea uno nuevo con el botón “+”.
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {sortedChats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          onClick={onChatClick}
          onAvatarClick={onAvatarClick}
        />
      ))}
    </div>
  )
}
