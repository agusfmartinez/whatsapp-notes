"use client"

import { useState, useEffect } from "react"
import { Camera, MoreVertical, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Componentes
import ChatList from "@/components/chat/ChatList"
import ChatView from "@/components/chat/ChatView"
import NewChatForm from "@/components/chat/NewChatForm"
import EditChatForm from "@/components/chat/EditChatForm"
import SearchBar from "@/components/common/SearchBar"
import FilterTabs from "@/components/common/FilterTabs"
import BottomNavigation from "@/components/common/BottomNavigation"
import FloatingActionButton from "@/components/common/FloatingActionButton"
import AvatarCropperModal from "@/components/modals/AvatarCropperModal"
import ImageViewerModal from "@/components/modals/ImageViewerModal"
import ConfirmDeleteChatModal from "@/components/modals/ConfirmDeleteChatModal"


// Hooks
import { useChats } from "@/hooks/useChats"
import { useKeyboardOffset } from "@/hooks/useKeyboardOffset"
import { useLongPress } from "@/hooks/useLongPress"

// Utils
import { fileToDataURL, compressDataURL } from "@/lib/images"

// Types
import { Chat } from "@/types/chat"

type View = "chatList" | "chat" | "newChat" | "editChat"

export default function WhatsAppInterface() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [composeAsMe, setComposeAsMe] = useState(true)
  const [selectedMsg, setSelectedMsg] = useState<{ chatId: number; msgId: number } | null>(null)
  const [editingTarget, setEditingTarget] = useState<{ chatId: number; msgId: number } | null>(null)
  const [currentView, setCurrentView] = useState<View>("chatList")

  // Avatar Cropper modal
  const [cropperOpen, setCropperOpen] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropW, setCropW] = useState(0)
  const [cropH, setCropH] = useState(0)
  const [cropX, setCropX] = useState(0)
  const [cropY, setCropY] = useState(0)
  const [cropSize, setCropSize] = useState(100)

  // Para el formulario de "nuevo chat"
  const [newChatName, setNewChatName] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // Para el formulario de "editar chat"
  const [editChatName, setEditChatName] = useState("")
  const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null)

  // Image Viewer modal
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerSrc, setViewerSrc] = useState<string | null>(null)

  // Hooks
  const { chats, createChat, deleteChat, sendMessage, deleteMessage, editMessage, updateChat } = useChats()
  const kbOffset = useKeyboardOffset()
  const { startLongPress, cancelLongPress } = useLongPress()

  // Modal Confirm
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [chatIdToDelete, setChatIdToDelete] = useState<number | null>(null)


  // Sincronizar selectedChat cuando chats cambie
  useEffect(() => {
    if (selectedChat && chats.length > 0) {
      const updatedSelected = chats.find(c => c.id === selectedChat.id)
      if (updatedSelected) {
        setSelectedChat(updatedSelected)
      }
    }
  }, [chats, selectedChat])

  // ✅ Crear un nuevo chat
  const createChatAndOpen = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    const newChat = createChat(trimmed, avatarPreview || "/placeholder.svg")
    setSelectedChat(newChat)
    setCurrentView("chat")
    setNewChatName("")
    setAvatarPreview(null)
  }

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat)
    setCurrentView("chat")
    setInputValue("")
  }

  const handleBackToChats = () => {
    setCurrentView("chatList")
    setSelectedChat(null)
  }

  const startSelectLongPress = (chatId: number, msgId: number) => {
    startLongPress(() => {
      setSelectedMsg({ chatId, msgId })
      setEditingTarget(null)
    })
  }

  const deleteSelectedMessage = () => {
    if (!selectedMsg) return
    deleteMessage(selectedMsg.chatId, selectedMsg.msgId)
    setSelectedMsg(null)
    setEditingTarget(null)
  }

  const beginEditSelectedMessage = () => {
    if (!selectedMsg) return
    const chat = chats.find(c => c.id === selectedMsg.chatId)
    const msg = chat?.messages.find(m => m.id === selectedMsg.msgId)
    if (!msg) return
    setInputValue(msg.text)
    setEditingTarget(selectedMsg)
  }

  const saveEditedMessage = () => {
    if (!editingTarget) return
    const newText = inputValue.trim()
    if (!newText) return
    editMessage(editingTarget.chatId, editingTarget.msgId, newText)
    setInputValue("")
    setEditingTarget(null)
    setSelectedMsg(null)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const raw = await fileToDataURL(file)
    // setear límites y valores iniciales del cropper
    const img = new Image()
    img.src = raw
    await img.decode()
    const side = Math.min(img.width, img.height)
    setCropSrc(raw)
    setCropW(img.width)
    setCropH(img.height)
    setCropSize(Math.floor(side * 0.8)) // arranca con 80% del lado corto
    setCropX(Math.floor((img.width - side * 0.8) / 2))
    setCropY(Math.floor((img.height - side * 0.8) / 2))
    setCropperOpen(true)
  }

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const raw = await fileToDataURL(file)
    // setear límites y valores iniciales del cropper
    const img = new Image()
    img.src = raw
    await img.decode()
    const side = Math.min(img.width, img.height)
    setCropSrc(raw)
    setCropW(img.width)
    setCropH(img.height)
    setCropSize(Math.floor(side * 0.8)) // arranca con 80% del lado corto
    setCropX(Math.floor((img.width - side * 0.8) / 2))
    setCropY(Math.floor((img.height - side * 0.8) / 2))
    setCropperOpen(true)
  }

  const handleCropSave = async () => {
    if (!cropSrc) return
    const dataURL = await compressDataURL(
      cropSrc,
      { x: cropX, y: cropY, size: cropSize },
      256, // exportSize
      true, // preferWebP
      0.8   // quality
    )
    setAvatarPreview(dataURL)
    setCropperOpen(false)
  }

  const handleEditCropSave = async () => {
    if (!cropSrc) return
    const dataURL = await compressDataURL(
      cropSrc,
      { x: cropX, y: cropY, size: cropSize },
      256, // exportSize
      true, // preferWebP
      0.8   // quality
    )
    setEditAvatarPreview(dataURL)
    setCropperOpen(false)
  }

  const handleEditChat = () => {
    if (!selectedChat) return
    setEditChatName(selectedChat.name)
    setEditAvatarPreview(null)
    setCurrentView("editChat")
  }

  const handleSaveEditChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChat || !editChatName.trim()) return
    
    const updates: Partial<Pick<Chat, 'name' | 'avatar'>> = {
      name: editChatName.trim()
    }
    
    if (editAvatarPreview) {
      updates.avatar = editAvatarPreview
    }
    
    updateChat(selectedChat.id, updates)
    setCurrentView("chat")
    setEditChatName("")
    setEditAvatarPreview(null)
  }

  const requestDeleteChat = (chatId: number) => {
    setChatIdToDelete(chatId)
    setConfirmDeleteOpen(true)
  }
  
  const confirmDeleteChat = () => {
    if (chatIdToDelete == null) return
    deleteChat(chatIdToDelete)
    setConfirmDeleteOpen(false)
    setChatIdToDelete(null)
    handleBackToChats() // 👉 vuelve a la lista de chats
  }
  
  const cancelDeleteChat = () => {
    setConfirmDeleteOpen(false)
    setChatIdToDelete(null)
  }

  // ==================================
  // 🔹 Vista: crear nuevo chat
  // ==================================
  if (currentView === "newChat") {
    return (
      <>
        <NewChatForm
          newChatName={newChatName}
          setNewChatName={setNewChatName}
          avatarPreview={avatarPreview}
          onBack={() => setCurrentView("chatList")}
          onSubmit={(e) => {
            e.preventDefault()
            createChatAndOpen(newChatName)
          }}
          onFileChange={handleFileChange}
        />

        <AvatarCropperModal
          isOpen={cropperOpen}
          cropSrc={cropSrc}
          cropW={cropW}
          cropH={cropH}
          cropX={cropX}
          cropY={cropY}
          cropSize={cropSize}
          onClose={() => setCropperOpen(false)}
          onCropXChange={setCropX}
          onCropYChange={setCropY}
          onCropSizeChange={setCropSize}
          onSave={handleCropSave}
        />
      </>
    )
  }

  // ==================================
  // 🔹 Vista: editar chat
  // ==================================
  if (currentView === "editChat" && selectedChat) {
    return (
      <>
        <EditChatForm
          chat={selectedChat}
          chatName={editChatName}
          setChatName={setEditChatName}
          avatarPreview={editAvatarPreview}
          onBack={() => setCurrentView("chat")}
          onSubmit={handleSaveEditChat}
          onFileChange={handleEditFileChange}
        />

        <AvatarCropperModal
          isOpen={cropperOpen}
          cropSrc={cropSrc}
          cropW={cropW}
          cropH={cropH}
          cropX={cropX}
          cropY={cropY}
          cropSize={cropSize}
          onClose={() => setCropperOpen(false)}
          onCropXChange={setCropX}
          onCropYChange={setCropY}
          onCropSizeChange={setCropSize}
          onSave={handleEditCropSave}
        />
      </>
    )
  }

  // ==================================
  // 🔹 Vista del chat seleccionado
  // ==================================
  if (currentView === "chat" && selectedChat) {
    const updatedSelected = chats.find(c => c.id === selectedChat.id) || selectedChat

    return (
      <>
        <ChatView
          chat={updatedSelected}
          composeAsMe={composeAsMe}
          inputValue={inputValue}
          setInputValue={setInputValue}
          selectedMsg={selectedMsg}
          editingTarget={editingTarget}
          kbOffset={kbOffset}
          onBack={() => {
            handleBackToChats()
            setSelectedMsg(null)
            setEditingTarget(null)
          }}
          onAvatarClick={(avatarSrc) => {
            setViewerSrc(avatarSrc)
            setViewerOpen(true)
          }}
          onDeleteChat={(id: number) => requestDeleteChat(id)}
          onToggleComposeMode={() => setComposeAsMe(v => !v)}
          onEditMessage={beginEditSelectedMessage}
          onDeleteMessage={deleteSelectedMessage}
          onEditChat={handleEditChat}
          onSendMessage={(text, asMe) => sendMessage(updatedSelected.id, text, asMe)}
          onSaveEdit={saveEditedMessage}
          onStartSelectLongPress={startSelectLongPress}
          onCancelLongPress={cancelLongPress}
          onDeselectMessage={() => setSelectedMsg(null)}
        />

        <ImageViewerModal
          isOpen={viewerOpen}
          src={viewerSrc}
          onClose={() => setViewerOpen(false)}
        />

        <ConfirmDeleteChatModal
          isOpen={confirmDeleteOpen}
          chatName={selectedChat?.name}
          onCancel={cancelDeleteChat}
          onConfirm={confirmDeleteChat}
        />

      </>
    )
  }

  // ==================================
  // 🔹 Vista de lista de chats
  // ==================================
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
          onChatClick={handleChatClick}
          onAvatarClick={(avatarSrc) => {
            setViewerSrc(avatarSrc)
            setViewerOpen(true)
          }}
        />

        <BottomNavigation chatsCount={chats.length} />

        <FloatingActionButton onClick={() => setCurrentView("newChat")} />
      </div>

      <ImageViewerModal
        isOpen={viewerOpen}
        src={viewerSrc}
        onClose={() => setViewerOpen(false)}
      />
    </>
  )
}