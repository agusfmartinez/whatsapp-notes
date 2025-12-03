"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Video, Phone } from "lucide-react"
import { Chat } from "@/types/chat"
import OptionsMenu from "@/components/common/OptionsMenu"

interface ChatHeaderProps {
  chat: Chat
  composeAsMe: boolean
  selectedMsg: { chatId: number; msgId: number } | null
  onBack: () => void
  onAvatarClick: (avatarSrc: string) => void
  onDeleteChat: (chatId: number) => void
  onToggleComposeMode: () => void
  onEditMessage: () => void
  onDeleteMessage: () => void
  onEditChat: () => void
}

export default function ChatHeader({
  chat,
  composeAsMe,
  selectedMsg,
  onBack,
  onAvatarClick,
  onDeleteChat,
  onToggleComposeMode,
  onEditMessage,
  onDeleteMessage,
  onEditChat
}: ChatHeaderProps) {
  const menuItems = [
    { label: "Info del contacto", onSelect: onEditChat },
    { label: "Archivar chat" },
    { label: "Eliminar chat", onSelect: () => onDeleteChat(chat.id), danger: true },
    { label: composeAsMe ? "Recibir mensaje" : "Enviar mensaje", onSelect: onToggleComposeMode },
    { label: "__divider__" },
    { label: "Editar mensaje", onSelect: onEditMessage, disabled: !selectedMsg },
    { label: "Borrar mensaje", onSelect: onDeleteMessage, disabled: !selectedMsg },
  ]

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-[#0b1014]">
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-0 h-auto text-white hover:bg-transparent"
        onClick={onBack}
      >
        <ArrowLeft size={24} />
      </Button>
      
      <Avatar 
        className="w-10 h-10 cursor-pointer" 
        onClick={() => onAvatarClick(chat.avatar || "/placeholder.svg")}
      >
        <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
        <AvatarFallback className="bg-gray-700 text-white">
          {chat.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h2 className="font-medium text-white">{chat.name}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <Video size={24} className="text-white" />
        <Phone size={24} className="text-white" />
        <OptionsMenu items={menuItems} />
      </div>
    </div>
  )
}
