"use client"

import {
  Search,
  Camera,
  MoreVertical,
  Archive,
  Phone,
  Users,
  MessageCircle,
  Plus,
  ArrowLeft,
  Video,
  Smile,
  Paperclip,
  Mic,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function WhatsAppInterface() {
  const [currentView, setCurrentView] = useState<"chatList" | "chat">("chatList")
  const [selectedChat, setSelectedChat] = useState<any>(null)

  const chats = [
    {
      id: 1,
      name: "Agus",
      fullName: "Agus C Summant",
      message: "Tú: https://agusfmartinez.github.io...",
      time: "20:04",
      avatar: "/young-man-with-blue-shirt.png",
      isRead: true,
      isPinned: true,
    },
    {
      id: 2,
      name: "Amor",
      message: "Sticker",
      time: "23:33",
      avatar: "/long-haired-woman.png",
      isRead: true,
      hasSticker: true,
    },
    {
      id: 3,
      name: "WhatsApp",
      message: "Nuevo: Más herramientas para manten...",
      time: "22:32",
      avatar: "/whatsapp-logo-green.png",
      isRead: false,
      isOfficial: true,
    },
    {
      id: 4,
      name: "FuturxsProgramadoresUNaHur",
      message: "FuturxsProgramadoresArg Grupo General",
      time: "",
      avatar: "/programming-group-icon.png",
      isGroup: true,
      hasArrow: true,
    },
    {
      id: 5,
      name: "Rosita",
      message: "😘",
      time: "19:37",
      avatar: "/young-blonde-woman.png",
      isRead: true,
    },
    {
      id: 6,
      name: "Lucho",
      message: "Todo esto no quita que",
      time: "",
      avatar: "/dark-haired-man.png",
      isRead: false,
      hasStatus: true,
    },
    {
      id: 7,
      name: "Prueba",
      message: "🤝 👍",
      time: "",
      avatar: "/tree-logo-nature.png",
      isRead: true,
    },
  ]

  const chatMessages = [
    {
      id: 1,
      text: "conecte a la VPN y estoy conectandome al server desde mi local con mysql workbench",
      time: "14:16",
      isSent: true,
      isRead: true,
    },
    {
      id: 2,
      text: "Ponele root al user",
      time: "14:16",
      isSent: false,
    },
    {
      id: 3,
      text: "Estaba mal lo de desarrollo",
      time: "14:16",
      isSent: false,
    },
    {
      id: 4,
      text: "ah okis",
      time: "14:18",
      isSent: true,
      isRead: true,
    },
    {
      id: 5,
      text: "a ver",
      time: "14:19",
      isSent: true,
      isRead: true,
    },
    {
      id: 6,
      text: "listoo",
      time: "14:20",
      isSent: true,
      isRead: true,
    },
    {
      id: 7,
      text: "la db es la que dice _test verdad? conviene crear un usuario para desarrollo o uso el root? y lo mismo para la tabla de prueba conviene que cree una de prueba que de momento consulte personas y numero, y agregarle el campo para evaluar si fue respondido o no?",
      time: "14:26",
      isSent: true,
      isRead: true,
    },
    {
      id: 8,
      text: "Dame un ratito y lo vemos Agus, por ahora no crees nada",
      time: "14:26",
      isSent: false,
    },
    {
      id: 9,
      text: "Solo usa la base de test",
      time: "14:27",
      isSent: false,
    },
    {
      id: 10,
      text: "dale!",
      time: "14:27",
      isSent: true,
      isRead: true,
    },
    {
      id: 11,
      text: "Agus, querés ver lo de la bdd?",
      time: "17:04",
      isSent: false,
    },
    {
      id: 12,
      text: "Perdón la demora pero había surgido un urgente de NASA",
      time: "17:04",
      isSent: false,
    },
    {
      id: 13,
      text: "Agus, dale estoy",
      time: "17:04",
      isSent: true,
      isRead: true,
    },
  ]

  const handleChatClick = (chat: any) => {
    setSelectedChat(chat)
    setCurrentView("chat")
  }

  const handleBackToChats = () => {
    setCurrentView("chatList")
    setSelectedChat(null)
  }

  if (currentView === "chat" && selectedChat) {
    return (
      <div className="bg-gray-900 text-white min-h-screen max-w-sm mx-auto">
        {/* Status Bar */}
        <div className="flex justify-between items-center px-4 py-2 text-sm">
          <div className="flex items-center gap-2">
            <span>23:15</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-white rounded-sm"></div>
              <div className="w-1 h-3 bg-white rounded-sm"></div>
              <div className="w-1 h-3 bg-white rounded-sm"></div>
              <div className="w-1 h-3 bg-gray-500 rounded-sm"></div>
            </div>
            <span>66%</span>
            <div className="w-6 h-3 bg-white rounded-sm"></div>
          </div>
        </div>

        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-800">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto text-white hover:bg-transparent"
            onClick={handleBackToChats}
          >
            <ArrowLeft size={24} />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage
              src={selectedChat.avatar || "/placeholder.svg"}
              alt={selectedChat.fullName || selectedChat.name}
            />
            <AvatarFallback className="bg-gray-700 text-white">
              {(selectedChat.fullName || selectedChat.name).charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-medium text-white">{selectedChat.fullName || selectedChat.name}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Video size={24} className="text-white" />
            <Phone size={24} className="text-white" />
            <MoreVertical size={24} className="text-white" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-4 space-y-2 min-h-[calc(100vh-200px)] overflow-y-auto">
          {chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg ${
                  message.isSent ? "bg-green-700 text-white" : "bg-gray-700 text-white"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs text-gray-300">{message.time}</span>
                  {message.isSent && message.isRead && <div className="text-blue-400 text-xs">✓✓</div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="px-4 py-3 bg-gray-900">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2 text-gray-400 hover:bg-gray-800">
              <Smile size={24} />
            </Button>
            <div className="flex-1 relative">
              <Input placeholder="Mensaje" className="bg-gray-800 border-gray-700 text-white rounded-full pr-20" />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-1 text-gray-400 hover:bg-transparent">
                  <Paperclip size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 text-gray-400 hover:bg-transparent">
                  <Camera size={20} />
                </Button>
              </div>
            </div>
            <Button className="bg-green-500 hover:bg-green-600 w-12 h-12 rounded-full p-0">
              <Mic size={24} />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen max-w-sm mx-auto">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 text-sm">
        <div className="flex items-center gap-2">
          <span>23:47</span>
          <MessageCircle size={16} />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-white rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-500 rounded-sm"></div>
          </div>
          <span>73%</span>
          <div className="w-6 h-3 bg-white rounded-sm"></div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-medium">WhatsApp</h1>
        <div className="flex items-center gap-4">
          <Camera size={24} />
          <MoreVertical size={24} />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Preguntar a Meta AI o buscar"
            className="bg-gray-800 border-gray-700 text-white pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 mb-4">
        <Button variant="default" className="bg-green-700 hover:bg-green-600 text-white rounded-full px-4 py-2 text-sm">
          Todos
        </Button>
        <Button
          variant="outline"
          className="border-gray-600 text-gray-300 rounded-full px-4 py-2 text-sm bg-transparent"
        >
          No leídos <span className="ml-1">25</span>
        </Button>
        <Button
          variant="outline"
          className="border-gray-600 text-gray-300 rounded-full px-4 py-2 text-sm bg-transparent"
        >
          Favoritos <span className="ml-1">1</span>
        </Button>
        <Button
          variant="outline"
          className="border-gray-600 text-gray-300 rounded-full px-4 py-2 text-sm bg-transparent"
        >
          Grupos <span className="ml-1">1</span>
        </Button>
      </div>

      {/* Archived Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Archive size={20} className="text-gray-400" />
          <span className="text-gray-300">Archivados</span>
        </div>
        <span className="text-gray-400 text-sm">19</span>
      </div>

      {/* Chat List */}
      <div className="flex-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
            onClick={() => handleChatClick(chat)}
          >
            <div className="relative">
              <Avatar className="w-12 h-12">
                <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                <AvatarFallback className="bg-gray-700 text-white">{chat.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {chat.hasStatus && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <span className="text-xs text-white">8</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-white truncate">{chat.name}</h3>
                <div className="flex items-center gap-2">
                  {chat.time && <span className="text-xs text-gray-400">{chat.time}</span>}
                  {chat.isPinned && <div className="w-4 h-4 text-gray-400">📌</div>}
                  {chat.hasArrow && <div className="text-gray-400">›</div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {chat.isRead && <div className="text-blue-400 text-xs">✓✓</div>}
                {chat.hasSticker && <div className="text-gray-400 text-xs">🎭</div>}
                {chat.isOfficial && <div className="text-gray-400 text-xs">📢</div>}
                <p className="text-sm text-gray-400 truncate">{chat.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center py-2 border-t border-gray-800 bg-gray-900">
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <MessageCircle size={24} className="text-white" />
            <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              25
            </div>
          </div>
          <span className="text-xs text-white">Chats</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400">Novedades</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Users size={24} className="text-gray-400" />
          <span className="text-xs text-gray-400">Comunidades</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Phone size={24} className="text-gray-400" />
          <span className="text-xs text-gray-400">Llamadas</span>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4">
        <Button className="bg-green-500 hover:bg-green-600 w-14 h-14 rounded-full shadow-lg">
          <Plus size={24} />
        </Button>
      </div>
    </div>
  )
}
