"use client"

import { Camera, Archive } from "lucide-react"
import ChatList from "@/components/chat/ChatList"
import SearchBar from "@/components/common/SearchBar"
import FilterTabs from "@/components/common/FilterTabs"
import BottomNavigation from "@/components/common/BottomNavigation"
import FloatingActionButton from "@/components/common/FloatingActionButton"
import ImageViewerModal from "@/components/modals/ImageViewerModal"
import OptionsMenu from "@/components/common/OptionsMenu"
import { Chat } from "@/types/chat"
import { strings } from "@/strings/es"
import { useEffect, useState } from "react"

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
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    const saved = localStorage.getItem("theme")
    const shouldDark = saved ? saved === "dark" : root.classList.contains("dark")
    setIsDark(shouldDark)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const nextDark = !isDark
    setIsDark(nextDark)
    root.classList.toggle("dark", nextDark)
    localStorage.setItem("theme", nextDark ? "dark" : "light")
  }
  return (
    <>
      <div className="bg-background text-foreground h-screen w-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-medium">{strings.appTitle}</h1>
          <div className="flex items-center gap-4">
            <Camera size={24} aria-hidden="true" />
            <OptionsMenu
              items={[
                { label: strings.mainMenu.broadcast },
                { label: strings.mainMenu.linked },
                { label: isDark ? strings.mainMenu.toggleThemeLight : strings.mainMenu.toggleThemeDark, onSelect: toggleTheme },
                { label: "__divider__" },
                { label: strings.mainMenu.settings },
              ]}
            />
          </div>
        </div>

        <SearchBar />

        <FilterTabs />

        {/* Archived Section */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Archive size={20} className="text-muted-foreground" />
            <span className="text-muted-foreground">{strings.archived}</span>
          </div>
          <span className="text-muted-foreground text-sm">{strings.archivedCount}</span>
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
