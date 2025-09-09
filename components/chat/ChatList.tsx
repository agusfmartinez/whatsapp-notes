"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCheck } from "lucide-react"
import { Chat } from "@/types/chat"

interface ChatListProps {
  chats: Chat[]
  onChatClick: (chat: Chat) => void
  onAvatarClick: (avatarSrc: string) => void
}

export default function ChatList({ chats, onChatClick, onAvatarClick }: ChatListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {[...chats]
        .sort((a, b) => {
          const lastA = a.messages[a.messages.length - 1]
          const lastB = b.messages[b.messages.length - 1]

          if (!lastA && !lastB) return 0
          if (!lastA) return 1   // si A no tiene mensajes, va al fondo
          if (!lastB) return -1  // si B no tiene mensajes, va arriba

          return (lastB?.timestamp || 0) - (lastA?.timestamp || 0)
        })
        .map((chat) => (
          <div key={chat.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => onChatClick(chat)}>
            <Avatar className="w-12 h-12 cursor-pointer" onClick={(e) => {
              e.stopPropagation()
              onAvatarClick(chat.avatar || "/placeholder.svg")
            }}>
              <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
              <AvatarFallback className="bg-gray-700 text-white">{chat.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-white truncate">{chat.name}</h3>
                <div className="flex items-center gap-2">
                  {chat.messages.length > 0 && (
                    <span className="text-xs text-gray-400">
                      {chat.messages[chat.messages.length - 1].time}
                    </span>
                  )}
                  {chat.isPinned && <div className="w-4 h-4 text-gray-400">📌</div>}
                  {chat.hasArrow && <div className="text-gray-400">›</div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {chat.messages.length > 0 && chat.messages[chat.messages.length - 1].isSent && (
                  chat.messages[chat.messages.length - 1].isRead
                    ? <div className="text-blue-400 text-xs"> <CheckCheck size={16} /> </div>
                    : <div className="text-gray-400 text-xs"> <CheckCheck size={16} /> </div>
                )}
                {chat.hasSticker && <div className="text-gray-400 text-xs">🎭</div>}
                {chat.isOfficial && <div className="text-gray-400 text-xs">📢</div>}
                <p className="text-sm text-gray-400 truncate">
                  {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Sin mensajes"}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
