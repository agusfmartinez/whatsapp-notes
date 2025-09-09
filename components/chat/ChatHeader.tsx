"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Video, Phone, MoreVertical } from "lucide-react"
import { Chat } from "@/types/chat"

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <MoreVertical size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEditChat}>Info del contacto</DropdownMenuItem>
            <DropdownMenuItem>Archivar chat</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteChat(chat.id)}>
              Eliminar chat
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleComposeMode}>
              {composeAsMe ? "Recibir mensaje" : "Enviar mensaje"}
            </DropdownMenuItem>
            <div className="h-px my-1 bg-gray-700/50" />
            <DropdownMenuItem
              disabled={!selectedMsg}
              onClick={onEditMessage}
            >
              Editar mensaje
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={!selectedMsg}
              onClick={onDeleteMessage}
            >
              Borrar mensaje
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
