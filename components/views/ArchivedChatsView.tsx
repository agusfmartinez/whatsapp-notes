"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatList from "@/components/chat/ChatList"
import { Chat } from "@/types/chat"

type ArchivedChatsViewProps = {
  chats: Chat[]
  onBack: () => void
  onChatClick: (chat: Chat) => void
  onAvatarClick: (avatarSrc: string) => void
}

export default function ArchivedChatsView({
  chats,
  onBack,
  onChatClick,
  onAvatarClick,
}: ArchivedChatsViewProps) {
  return (
    <div className="bg-background text-foreground h-screen w-screen flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-auto text-foreground hover:bg-transparent"
          onClick={onBack}
          aria-label="Volver a la lista de chats"
        >
          <ArrowLeft size={24} />
        </Button>
        <h1 className="text-lg font-medium">Archivados</h1>
      </div>

      <ChatList
        chats={chats}
        onChatClick={onChatClick}
        onAvatarClick={onAvatarClick}
      />
    </div>
  )
}
