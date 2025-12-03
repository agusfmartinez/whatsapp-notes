"use client"

import { Camera, MoreVertical, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import ChatList from "@/components/chat/ChatList"
import SearchBar from "@/components/common/SearchBar"
import FilterTabs from "@/components/common/FilterTabs"
import BottomNavigation from "@/components/common/BottomNavigation"
import FloatingActionButton from "@/components/common/FloatingActionButton"
import ImageViewerModal from "@/components/modals/ImageViewerModal"
import { Chat } from "@/types/chat"

type ChatListViewProps = {
  chats: Chat[]
  onChatClick: (chat: Chat) => void
  onAvatarClick: (avatarSrc: string) => void
  onNewChat: () => void
  imageViewer: { isOpen: boolean; src: string | null }
  onCloseImage: () => void
}

export default function ChatListView({
  chats,
  onChatClick,
  onAvatarClick,
  onNewChat,
  imageViewer,
  onCloseImage,
}: ChatListViewProps) {
  return (
    <>
      <div className="bg-[#0b1014] text-white h-screen w-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-medium">WhatsApp</h1>
          <div className="flex items-center gap-4">
            <Camera size={24} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <MoreVertical size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>Opción 1</DropdownMenuItem>
                <DropdownMenuItem>Opción 2</DropdownMenuItem>
                <DropdownMenuItem>Opción 3</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <SearchBar />

        <FilterTabs />

        {/* Archived Section */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Archive size={20} className="text-gray-400" />
            <span className="text-gray-300">Archivados</span>
          </div>
          <span className="text-gray-400 text-sm">0</span>
        </div>

        <ChatList
          chats={chats}
          onChatClick={onChatClick}
          onAvatarClick={onAvatarClick}
        />

        <BottomNavigation chatsCount={chats.length} />

        <FloatingActionButton onClick={onNewChat} />
      </div>

      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        src={imageViewer.src}
        onClose={onCloseImage}
      />
    </>
  )
}
