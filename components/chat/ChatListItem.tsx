"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCheck } from "lucide-react"
import { Chat } from "@/types/chat"

type ChatListItemProps = {
  chat: Chat
  onClick: (chat: Chat) => void
  onAvatarClick: (avatarSrc: string) => void
}

export default function ChatListItem({ chat, onClick, onAvatarClick }: ChatListItemProps) {
  const lastMessage = chat.messages[chat.messages.length - 1]
  const avatarSrc = chat.avatar || "/placeholder.svg"

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/60 transition-colors cursor-pointer"
      onClick={() => onClick(chat)}
    >
      <Avatar
        className="w-12 h-12 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation()
          onAvatarClick(avatarSrc)
        }}
      >
        <AvatarImage src={avatarSrc} alt={`Avatar de ${chat.name}`} />
        <AvatarFallback className="bg-gray-700 text-foreground">
          {chat.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-foreground truncate">{chat.name}</h3>
          <div className="flex items-center gap-2">
            {lastMessage && (
              <span className="text-xs text-gray-400">
                {lastMessage.time}
              </span>
            )}
            {chat.isPinned && <div className="w-4 h-4 text-gray-400">📌</div>}
            {chat.hasArrow && <div className="text-gray-400">›</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastMessage && lastMessage.isSent && (
            lastMessage.isRead
              ? <div className="text-blue-400 text-xs"><CheckCheck size={16} /></div>
              : <div className="text-gray-400 text-xs"><CheckCheck size={16} /></div>
          )}
          {chat.hasSticker && <div className="text-gray-400 text-xs">🎭</div>}
          {chat.isOfficial && <div className="text-gray-400 text-xs">📢</div>}
          <p className="text-sm text-gray-400 truncate">
            {lastMessage ? lastMessage.text : "Sin mensajes"}
          </p>
        </div>
      </div>
    </div>
  )
}
