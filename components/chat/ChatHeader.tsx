"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Video, Phone, MoreVertical } from "lucide-react"
import { Chat } from "@/types/chat"
import { strings } from "@/strings/es"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  onAssignCategory: (category: string | null) => void
  categories: { id: string; label: string }[]
  onCreateCategory: () => void
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
  onEditChat,
  onAssignCategory,
  categories = [],
  onCreateCategory
}: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-background">
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-0 h-auto text-foreground hover:bg-transparent"
        onClick={onBack}
        aria-label="Volver a la lista de chats"
      >
        <ArrowLeft size={24} />
      </Button>
      
      <Avatar 
        className="w-10 h-10 cursor-pointer" 
        onClick={() => onAvatarClick(chat.avatar || "/placeholder.svg")}
      >
        <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
        <AvatarFallback className="bg-gray-700 text-foreground">
          {chat.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <h2 className="font-medium text-foreground">{chat.name}</h2>
      </div>
      
      <div className="flex items-center gap-4">
        <Video size={24} className="text-foreground" aria-hidden="true" />
        <Phone size={24} className="text-foreground" aria-hidden="true" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-foreground" aria-label="Opciones de chat">
              <MoreVertical size={24} aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onEditChat}>{strings.chatMenu.contactInfo}</DropdownMenuItem>
            <DropdownMenuItem>{strings.chatMenu.archive}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDeleteChat(chat.id)} className="text-red-500 focus:text-red-600">
              {strings.chatMenu.delete}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleComposeMode}>
              {composeAsMe ? strings.chatMenu.toggleComposeMe.receive : strings.chatMenu.toggleComposeMe.send}
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{strings.chatMenu.addTo}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-44">
                <DropdownMenuItem onClick={() => onAssignCategory("no-leidos")}>
                  {strings.tabs.unread}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAssignCategory("favoritos")}>
                  {strings.tabs.favorites}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAssignCategory("grupos")}>
                  {strings.tabs.groups}
                </DropdownMenuItem>
                {Array.isArray(categories) && categories.length > 0 && <DropdownMenuSeparator />}
                {Array.isArray(categories) && categories.map((cat) => (
                  <DropdownMenuItem key={cat.id} onClick={() => onAssignCategory(cat.id)}>
                    {cat.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onAssignCategory(null)}>
                  {strings.chatMenu.removeCategory}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onCreateCategory}>
                  Nueva categoría
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />
            <DropdownMenuItem disabled={!selectedMsg} onClick={onEditMessage}>
              {strings.chatMenu.editMessage}
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!selectedMsg} onClick={onDeleteMessage}>
              {strings.chatMenu.deleteMessage}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
