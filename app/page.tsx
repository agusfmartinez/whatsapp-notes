"use client"

import { useReducer, useMemo, useState } from "react"
import { useChats } from "@/hooks/useChats"
import { useKeyboardOffset } from "@/hooks/useKeyboardOffset"
import { useLongPress } from "@/hooks/useLongPress"
import { fileToDataURL, compressDataURL } from "@/lib/images"
import { Chat } from "@/types/chat"
import { chatUiReducer, initialState } from "@/ui/reducers/chatUi"
import ChatListView from "@/components/views/ChatListView"
import ChatScreen from "@/components/views/ChatScreen"
import NewChatScreen from "@/components/views/NewChatScreen"
import EditChatScreen from "@/components/views/EditChatScreen"
import ServiceWorkerClient from "@/components/common/ServiceWorkerClient"

export default function WhatsAppInterface() {
  const [uiState, dispatch] = useReducer(chatUiReducer, initialState)
  const [inputValue, setInputValue] = useState("")
  const { chats, createChat, deleteChat, sendMessage, deleteMessage, editMessage, updateChat } = useChats()
  const kbOffset = useKeyboardOffset()
  const { startLongPress, cancelLongPress } = useLongPress()


  const selectedChat = useMemo(() => {
    if (!uiState.selectedChatId) return null
    return chats.find(c => c.id === uiState.selectedChatId) || null
  }, [chats, uiState.selectedChatId])

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
  }), [
    selectedChat,
    sendMessage,
    handleBackToChats,
    requestDeleteChat,
    beginEditSelectedMessage,
    deleteSelectedMessage,
    handleEditChat,
    saveEditedMessage,
    startSelectLongPress,
    cancelLongPress
  ])

  if (uiState.view === "newChat") {
    return (
      <NewChatScreen
        newChatName={uiState.newChat.name}
        setNewChatName={(name) => dispatch({ type: "SET_NEW_CHAT_NAME", payload: name })}
        avatarPreview={uiState.newChat.avatarPreview}
        onBack={() => dispatch({ type: "NAVIGATE_BACK_TO_CHATS" })}
        onSubmit={(e) => {
          e.preventDefault()
          createChatAndOpen(uiState.newChat.name)
        }}
        onFileChange={handleFileChange}
        cropper={uiState.cropper}
        onCloseCropper={() => dispatch({ type: "CLOSE_CROPPER" })}
        onCropXChange={(x) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x, y: uiState.cropper.y, size: uiState.cropper.size } })}
        onCropYChange={(y) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x: uiState.cropper.x, y, size: uiState.cropper.size } })}
        onCropSizeChange={(size) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x: uiState.cropper.x, y: uiState.cropper.y, size } })}
        onSaveCrop={handleCropSave}
      />
    )
  }

  if (uiState.view === "editChat" && selectedChat) {
    return (
      <EditChatScreen
        chat={selectedChat}
        chatName={uiState.editChat.name}
        setChatName={(name) => dispatch({ type: "SET_EDIT_CHAT_NAME", payload: name })}
        avatarPreview={uiState.editChat.avatarPreview}
        onBack={() => dispatch({ type: "NAVIGATE_TO_CHAT", payload: selectedChat.id })}
        onSubmit={handleSaveEditChat}
        onFileChange={handleEditFileChange}
        cropper={uiState.cropper}
        onCloseCropper={() => dispatch({ type: "CLOSE_CROPPER" })}
        onCropXChange={(x) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x, y: uiState.cropper.y, size: uiState.cropper.size } })}
        onCropYChange={(y) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x: uiState.cropper.x, y, size: uiState.cropper.size } })}
        onCropSizeChange={(size) => dispatch({ type: "UPDATE_CROP_POSITION", payload: { x: uiState.cropper.x, y: uiState.cropper.y, size } })}
        onSaveCrop={handleCropSave}
      />
    )
  }

  if (uiState.view === "chat" && selectedChat) {
    return (
      <ChatScreen
        chat={selectedChat}
        composeAsMe={uiState.composeAsMe}
        inputValue={inputValue}
        setInputValue={setInputValue}
        selectedMsg={uiState.selectedMsg}
        editingTarget={uiState.editingTarget}
        kbOffset={kbOffset}
        chatController={chatController}
        imageViewer={uiState.imageViewer}
        onCloseImage={() => dispatch({ type: "CLOSE_IMAGE_VIEWER" })}
        confirmDelete={uiState.confirmDelete}
        onCancelDelete={cancelDeleteChat}
        onConfirmDelete={confirmDeleteChat}
      />
    )
  }

  return (
    <>
      <ServiceWorkerClient />
      <ChatListView
        chats={chats}
        onChatClick={handleChatClick}
        onAvatarClick={(avatarSrc) => {
          dispatch({ type: "OPEN_IMAGE_VIEWER", payload: avatarSrc })
        }}
        onNewChat={() => dispatch({ type: "NAVIGATE_TO_NEW_CHAT" })}
        imageViewer={uiState.imageViewer}
        onCloseImage={() => dispatch({ type: "CLOSE_IMAGE_VIEWER" })}
      />
    </>
  )
}
