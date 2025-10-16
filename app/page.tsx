"use client"

import { useReducer, useEffect, useMemo, useState } from "react"
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
import { chatUiReducer, initialState, ChatUIAction } from "@/ui/reducers/chatUi"

export default function WhatsAppInterface() {
  // Estado global de UI usando reducer
  const [uiState, dispatch] = useReducer(chatUiReducer, initialState)
  
  // Estado local para el input del chat (no forma parte del estado global)
  const [inputValue, setInputValue] = useState("")

  // Hooks
  const { chats, createChat, deleteChat, sendMessage, deleteMessage, editMessage, updateChat } = useChats()
  const kbOffset = useKeyboardOffset()
  const { startLongPress, cancelLongPress } = useLongPress()


  // Obtener el chat seleccionado actual
  const selectedChat = useMemo(() => {
    if (!uiState.selectedChatId) return null
    return chats.find(c => c.id === uiState.selectedChatId) || null
  }, [chats, uiState.selectedChatId])

  // Función unificada para abrir cropper
  const openCropperFor = async (file: File, target: "new" | "edit") => {
    const raw = await fileToDataURL(file)
    const img = new Image()
    img.src = raw
    await img.decode()
    const side = Math.min(img.width, img.height)
    const initialSize = Math.floor(side * 0.8)
    const initialX = Math.floor((img.width - initialSize) / 2)
    const initialY = Math.floor((img.height - initialSize) / 2)
    
    dispatch({
      type: "OPEN_CROPPER",
      payload: {
        src: raw,
        w: img.width,
        h: img.height,
        x: initialX,
        y: initialY,
        size: initialSize,
        target
      }
    })
  }

  // Función unificada para guardar crop
  const handleCropSave = async () => {
    if (!uiState.cropper.src) return
    
    const dataURL = await compressDataURL(
      uiState.cropper.src,
      { x: uiState.cropper.x, y: uiState.cropper.y, size: uiState.cropper.size },
      256, // exportSize
      true, // preferWebP
      0.8   // quality
    )
    
    dispatch({ type: "SAVE_CROP", payload: dataURL })
  }

  // ✅ Crear un nuevo chat
  const createChatAndOpen = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    const newChat = createChat(trimmed, uiState.newChat.avatarPreview || "/placeholder.svg")
    dispatch({ type: "NAVIGATE_TO_CHAT", payload: newChat.id })
    dispatch({ type: "RESET_NEW_CHAT_FORM" })
    setInputValue("")
  }

  const handleChatClick = (chat: Chat) => {
    dispatch({ type: "NAVIGATE_TO_CHAT", payload: chat.id })
    setInputValue("")
  }

  const handleBackToChats = () => {
    dispatch({ type: "NAVIGATE_BACK_TO_CHATS" })
  }

  const startSelectLongPress = (chatId: number, msgId: number) => {
    startLongPress(() => {
      dispatch({ type: "SET_SELECTED_MSG", payload: { chatId, msgId } })
    })
  }

  const deleteSelectedMessage = () => {
    if (!uiState.selectedMsg) return
    deleteMessage(uiState.selectedMsg.chatId, uiState.selectedMsg.msgId)
    dispatch({ type: "CLEAR_MSG_SELECTION" })
  }

  const beginEditSelectedMessage = () => {
    if (!uiState.selectedMsg) return
    const chat = chats.find(c => c.id === uiState.selectedMsg!.chatId)
    const msg = chat?.messages.find(m => m.id === uiState.selectedMsg!.msgId)
    if (!msg) return
    setInputValue(msg.text)
    dispatch({ type: "SET_EDITING_TARGET", payload: uiState.selectedMsg })
  }

  const saveEditedMessage = () => {
    if (!uiState.editingTarget) return
    const newText = inputValue.trim()
    if (!newText) return
    editMessage(uiState.editingTarget.chatId, uiState.editingTarget.msgId, newText)
    setInputValue("")
    dispatch({ type: "CLEAR_MSG_SELECTION" })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await openCropperFor(file, "new")
  }

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await openCropperFor(file, "edit")
  }

  const handleEditChat = () => {
    if (!selectedChat) return
    dispatch({ type: "SET_EDIT_CHAT_NAME", payload: selectedChat.name })
    dispatch({ type: "RESET_EDIT_CHAT_FORM" })
    dispatch({ type: "NAVIGATE_TO_EDIT_CHAT" })
  }

  const handleSaveEditChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChat || !uiState.editChat.name.trim()) return
    
    const updates: Partial<Pick<Chat, 'name' | 'avatar'>> = {
      name: uiState.editChat.name.trim()
    }
    
    if (uiState.editChat.avatarPreview) {
      updates.avatar = uiState.editChat.avatarPreview
    }
    
    updateChat(selectedChat.id, updates)
    dispatch({ type: "NAVIGATE_TO_CHAT", payload: selectedChat.id })
    dispatch({ type: "RESET_EDIT_CHAT_FORM" })
  }

  const requestDeleteChat = (chatId: number) => {
    dispatch({ type: "OPEN_CONFIRM_DELETE", payload: chatId })
  }
  
  const confirmDeleteChat = () => {
    if (uiState.confirmDelete.chatId == null) return
    deleteChat(uiState.confirmDelete.chatId)
    dispatch({ type: "CLOSE_CONFIRM_DELETE" })
    handleBackToChats() // 👉 vuelve a la lista de chats
  }
  
  const cancelDeleteChat = () => {
    dispatch({ type: "CLOSE_CONFIRM_DELETE" })
  }

  // ChatController - objeto con todos los handlers para ChatView
  const chatController = useMemo(() => ({
    onBack: () => {
      handleBackToChats()
      dispatch({ type: "CLEAR_MSG_SELECTION" })
    },
    onAvatarClick: (avatarSrc: string) => {
      dispatch({ type: "OPEN_IMAGE_VIEWER", payload: avatarSrc })
    },
    onDeleteChat: requestDeleteChat,
    onToggleComposeMode: () => dispatch({ type: "TOGGLE_COMPOSE_MODE" }),
    onEditMessage: beginEditSelectedMessage,
    onDeleteMessage: deleteSelectedMessage,
    onEditChat: handleEditChat,
    onSendMessage: (text: string, asMe: boolean) => {
      if (selectedChat) {
        sendMessage(selectedChat.id, text, asMe)
      }
    },
    onSaveEdit: saveEditedMessage,
    onStartSelectLongPress: startSelectLongPress,
    onCancelLongPress: cancelLongPress,
    onDeselectMessage: () => dispatch({ type: "SET_SELECTED_MSG", payload: null })
  }), [selectedChat, chats, sendMessage])

  // ==================================
  // 🔹 Vista: crear nuevo chat
  // ==================================
  if (uiState.view === "newChat") {
    return (
      <>
        <NewChatForm
          newChatName={uiState.newChat.name}
          setNewChatName={(name) => dispatch({ type: "SET_NEW_CHAT_NAME", payload: name })}
          avatarPreview={uiState.newChat.avatarPreview}
          onBack={() => dispatch({ type: "NAVIGATE_BACK_TO_CHATS" })}
          onSubmit={(e) => {
            e.preventDefault()
            createChatAndOpen(uiState.newChat.name)
          }}
          onFileChange={handleFileChange}
        />

        <AvatarCropperModal
          isOpen={uiState.cropper.isOpen}
          cropSrc={uiState.cropper.src}
          cropW={uiState.cropper.w}
          cropH={uiState.cropper.h}
          cropX={uiState.cropper.x}
          cropY={uiState.cropper.y}
          cropSize={uiState.cropper.size}
          onClose={() => dispatch({ type: "CLOSE_CROPPER" })}
          onCropXChange={(x) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x, y: uiState.cropper.y, size: uiState.cropper.size } })}
          onCropYChange={(y) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x: uiState.cropper.x, y, size: uiState.cropper.size } })}
          onCropSizeChange={(size) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x: uiState.cropper.x, y: uiState.cropper.y, size } })}
          onSave={handleCropSave}
        />
      </>
    )
  }

  // ==================================
  // 🔹 Vista: editar chat
  // ==================================
  if (uiState.view === "editChat" && selectedChat) {
    return (
      <>
        <EditChatForm
          chat={selectedChat}
          chatName={uiState.editChat.name}
          setChatName={(name) => dispatch({ type: "SET_EDIT_CHAT_NAME", payload: name })}
          avatarPreview={uiState.editChat.avatarPreview}
          onBack={() => dispatch({ type: "NAVIGATE_TO_CHAT", payload: selectedChat.id })}
          onSubmit={handleSaveEditChat}
          onFileChange={handleEditFileChange}
        />

        <AvatarCropperModal
          isOpen={uiState.cropper.isOpen}
          cropSrc={uiState.cropper.src}
          cropW={uiState.cropper.w}
          cropH={uiState.cropper.h}
          cropX={uiState.cropper.x}
          cropY={uiState.cropper.y}
          cropSize={uiState.cropper.size}
          onClose={() => dispatch({ type: "CLOSE_CROPPER" })}
          onCropXChange={(x) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x, y: uiState.cropper.y, size: uiState.cropper.size } })}
          onCropYChange={(y) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x: uiState.cropper.x, y, size: uiState.cropper.size } })}
          onCropSizeChange={(size) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x: uiState.cropper.x, y: uiState.cropper.y, size } })}
          onSave={handleCropSave}
        />
      </>
    )
  }

  // ==================================
  // 🔹 Vista del chat seleccionado
  // ==================================
  if (uiState.view === "chat" && selectedChat) {
    return (
      <>
        <ChatView
          chat={selectedChat}
          composeAsMe={uiState.composeAsMe}
          inputValue={inputValue}
          setInputValue={setInputValue}
          selectedMsg={uiState.selectedMsg}
          editingTarget={uiState.editingTarget}
          kbOffset={kbOffset}
          chatController={chatController}
        />

        <ImageViewerModal
          isOpen={uiState.imageViewer.isOpen}
          src={uiState.imageViewer.src}
          onClose={() => dispatch({ type: "CLOSE_IMAGE_VIEWER" })}
        />

        <ConfirmDeleteChatModal
          isOpen={uiState.confirmDelete.isOpen}
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
            dispatch({ type: "OPEN_IMAGE_VIEWER", payload: avatarSrc })
          }}
        />

        <BottomNavigation chatsCount={chats.length} />

        <FloatingActionButton onClick={() => dispatch({ type: "NAVIGATE_TO_NEW_CHAT" })} />
      </div>

      <ImageViewerModal
        isOpen={uiState.imageViewer.isOpen}
        src={uiState.imageViewer.src}
        onClose={() => dispatch({ type: "CLOSE_IMAGE_VIEWER" })}
      />
    </>
  )
}