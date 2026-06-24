"use client"

import { Camera, Archive } from "lucide-react"
import ChatList from "@/components/chat/ChatList"
import SearchBar from "@/components/common/SearchBar"
import FilterTabs from "@/components/common/FilterTabs"
import BottomNavigation from "@/components/common/BottomNavigation"
import FloatingActionButton from "@/components/common/FloatingActionButton"
import ImageViewerModal from "@/components/modals/ImageViewerModal"
import AboutModal from "@/components/modals/AboutModal"
import OptionsMenu from "@/components/common/OptionsMenu"
import { Chat } from "@/types/chat"
import { strings } from "@/strings/es"
import { useEffect, useRef, useState } from "react"

type ChatListViewProps = {
  chats: Chat[]
  categories?: { id: string; label: string }[]
  activeTab: string
  onTabChange: (tab: string) => void
  onChatClick: (chat: Chat) => void
  onAvatarClick: (avatarSrc: string) => void
  onNewChat: () => void
  onArchivedClick: () => void
  imageViewer: { isOpen: boolean; src: string | null }
  onCloseImage: () => void
  onRequestDeleteCategory: () => void
  onImportData: (data: { chats?: unknown; categories?: unknown }) => void
}

export default function ChatListView({
  chats,
  categories = [],
  activeTab,
  onTabChange,
  onChatClick,
  onAvatarClick,
  onNewChat,
  onArchivedClick,
  imageViewer,
  onCloseImage,
  onRequestDeleteCategory,
  onImportData,
}: ChatListViewProps) {
  const [isDark, setIsDark] = useState(true)
  const [search, setSearch] = useState("")
  const [aboutOpen, setAboutOpen] = useState(false)
  const importInputRef = useRef<HTMLInputElement>(null)
  const safeChats = Array.isArray(chats) ? chats : []

  const handleExport = () => {
    const payload = {
      app: "whatsapp-notes",
      version: 1,
      exportedAt: new Date().toISOString(),
      chats: safeChats,
      categories: Array.isArray(categories) ? categories : [],
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `whatsapp-notes-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = "" // permite reimportar el mismo archivo
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      if (!data || !Array.isArray(data.chats)) {
        alert(strings.importError)
        return
      }
      if (!confirm(strings.importConfirm)) return
      onImportData(data)
    } catch {
      alert(strings.importError)
    }
  }

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

  const visibleChats = safeChats.filter(chat => !chat.isArchived)
  const tabChats = activeTab === "todos"
    ? visibleChats
    : visibleChats.filter(chat => chat.category === activeTab)

  const query = search.trim().toLowerCase()
  const filteredChats = query
    ? tabChats.filter(chat =>
        chat.name.toLowerCase().includes(query) ||
        chat.messages.some(m => m.text.toLowerCase().includes(query))
      )
    : tabChats

  const isCustomCategory = !["todos", "no-leidos", "favoritos", "grupos"].includes(activeTab)

  const baseTabs = [
    { id: "todos", label: strings.tabs.all },
    { id: "no-leidos", label: strings.tabs.unread, count: visibleChats.filter(chat => chat.category === "no-leidos").length },
    { id: "favoritos", label: strings.tabs.favorites, count: visibleChats.filter(chat => chat.category === "favoritos").length },
    { id: "grupos", label: strings.tabs.groups, count: visibleChats.filter(chat => chat.category === "grupos").length },
  ]

  const extraTabs = (Array.isArray(categories) ? categories : []).map(cat => ({
    id: cat.id,
    label: cat.label,
    count: visibleChats.filter(chat => chat.category === cat.id).length,
  }))

  const archivedCount = safeChats.filter(chat => chat.isArchived).length

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
                { label: "Eliminar categoria", onSelect: onRequestDeleteCategory, disabled: !isCustomCategory },
                { label: "__divider__" },
                { label: strings.mainMenu.exportNotes, onSelect: handleExport },
                { label: strings.mainMenu.importNotes, onSelect: () => importInputRef.current?.click() },
                { label: strings.mainMenu.about, onSelect: () => setAboutOpen(true) },
                { label: "__divider__" },
                { label: strings.mainMenu.settings },
              ]}
            />
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImportFile}
              className="hidden"
              aria-hidden="true"
            />
          </div>
        </div>

        <SearchBar value={search} onChange={setSearch} placeholder={strings.searchPlaceholder} />

        <FilterTabs
          activeTab={activeTab}
          onTabChange={onTabChange}
          baseTabs={baseTabs}
          extraTabs={extraTabs}
        />

        {/* Archived Section */}
        <button
          type="button"
          className="flex items-center justify-between px-4 py-3 border-b border-border/60 hover:bg-muted/60 transition-colors"
          onClick={onArchivedClick}
        >
          <div className="flex items-center gap-3">
            <Archive size={20} className="text-muted-foreground" />
            <span className="text-muted-foreground">{strings.archived}</span>
          </div>
          <span className="text-muted-foreground text-sm">{archivedCount}</span>
        </button>

        <ChatList
          chats={filteredChats}
          onChatClick={onChatClick}
          onAvatarClick={onAvatarClick}
        />

        <BottomNavigation chatsCount={visibleChats.length} />

        <FloatingActionButton onClick={onNewChat} />
      </div>

      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        src={imageViewer.src}
        onClose={onCloseImage}
      />

      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  )
}

