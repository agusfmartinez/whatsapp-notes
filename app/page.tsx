"use client"

import { useReducer, useMemo, useState, useCallback, useEffect, useRef } from "react"
import { useChats } from "@/hooks/useChats"
import { useSettings } from "@/hooks/useSettings"
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
import NewCategoryModal from "@/components/modals/NewCategoryModal"
import ConfirmDeleteCategoryModal from "@/components/modals/ConfirmDeleteCategoryModal"
import ArchivedChatsView from "@/components/views/ArchivedChatsView"
import SettingsScreen from "@/components/views/SettingsScreen"
import UnlockChatModal from "@/components/modals/UnlockChatModal"
import { sha256Hex } from "@/lib/crypto"

export default function WhatsAppInterface() {
  const [uiState, dispatch] = useReducer(chatUiReducer, initialState)
  const [inputValue, setInputValue] = useState("")
  const { chats, createChat, deleteChat, clearChat, sendMessage, deleteMessage, editMessage, updateChat, categories, addCategory, deleteCategory, importData, loaded } = useChats()
  const { settings, setAppName, setPlatform } = useSettings()
  const restoredLastChat = useRef(false)
  const [restoring, setRestoring] = useState(true)
  const [unlockTarget, setUnlockTarget] = useState<Chat | null>(null)
  const [newCategoryOpen, setNewCategoryOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false)
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const [deleteCategoryName, setDeleteCategoryName] = useState("")
  const [activeTab, setActiveTab] = useState("todos")
  const kbOffset = useKeyboardOffset()
  const { startLongPress, cancelLongPress } = useLongPress()


  const selectedChat = useMemo(() => {
    if (!uiState.selectedChatId) return null
    return chats.find(c => c.id === uiState.selectedChatId) || null
  }, [chats, uiState.selectedChatId])

  // Restaurar el último chat abierto una vez que los chats cargaron.
  // Mientras tanto se muestra un splash para no ver la lista por un frame.
  useEffect(() => {
    if (!loaded || restoredLastChat.current) return
    restoredLastChat.current = true
    const lastId = localStorage.getItem("lastChatId")
    if (lastId && chats.some(c => c.id === Number(lastId))) {
      dispatch({ type: "NAVIGATE_TO_CHAT", payload: Number(lastId) })
    }
    setRestoring(false)
  }, [loaded, chats])

  // Persistir el chat abierto (solo escribe; el limpiado se hace al volver
  // a la lista, para no borrar lastChatId antes de restaurarlo al montar).
  useEffect(() => {
    if (uiState.view === "chat" && uiState.selectedChatId != null) {
      localStorage.setItem("lastChatId", String(uiState.selectedChatId))
    }
  }, [uiState.view, uiState.selectedChatId])

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

  const handleChatClick = useCallback((chat: Chat) => {
    if (chat.lockHash) {
      setUnlockTarget(chat)
      return
    }
    dispatch({ type: "NAVIGATE_TO_CHAT", payload: chat.id })
    setInputValue("")
  }, [])

  const verifyUnlock = useCallback(async (clave: string) => {
    if (!unlockTarget) return false
    const hash = await sha256Hex(clave)
    if (hash === unlockTarget.lockHash) {
      dispatch({ type: "NAVIGATE_TO_CHAT", payload: unlockTarget.id })
      setInputValue("")
      setUnlockTarget(null)
      return true
    }
    return false
  }, [unlockTarget])

  const handleBackToChats = useCallback(() => {
    localStorage.removeItem("lastChatId")
    dispatch({ type: "NAVIGATE_BACK_TO_CHATS" })
  }, [])

  const startSelectLongPress = useCallback((chatId: number, msgId: number) => {
    startLongPress(() => {
      dispatch({ type: "SET_SELECTED_MSG", payload: { chatId, msgId } })
    })
  }, [startLongPress])

  const deleteSelectedMessage = useCallback(() => {
    if (!uiState.selectedMsg) return
    deleteMessage(uiState.selectedMsg.chatId, uiState.selectedMsg.msgId)
    dispatch({ type: "CLEAR_MSG_SELECTION" })
  }, [uiState.selectedMsg, deleteMessage])

  const beginEditSelectedMessage = useCallback(() => {
    if (!uiState.selectedMsg) return
    const chat = chats.find(c => c.id === uiState.selectedMsg!.chatId)
    const msg = chat?.messages.find(m => m.id === uiState.selectedMsg!.msgId)
    if (!msg) return
    setInputValue(msg.text)
    dispatch({ type: "SET_EDITING_TARGET", payload: uiState.selectedMsg })
  }, [uiState.selectedMsg, chats])

  const saveEditedMessage = useCallback(() => {
    if (!uiState.editingTarget) return
    const newText = inputValue.trim()
    if (!newText) return
    editMessage(uiState.editingTarget.chatId, uiState.editingTarget.msgId, newText)
    setInputValue("")
    dispatch({ type: "CLEAR_MSG_SELECTION" })
  }, [uiState.editingTarget, inputValue, editMessage])

  const isValidImageFile = (file: File) => {
    return file.type.startsWith("image/")
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !isValidImageFile(file)) return
    await openCropperFor(file, "new")
  }

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !isValidImageFile(file)) return
    await openCropperFor(file, "edit")
  }

  const handleEditChat = useCallback(() => {
    if (!selectedChat) return
    // navigate resetea el form; luego prefill con los valores actuales del chat
    dispatch({ type: "NAVIGATE_TO_EDIT_CHAT" })
    dispatch({ type: "SET_EDIT_CHAT_NAME", payload: selectedChat.name })
    dispatch({ type: "SET_EDIT_CHAT_DESCRIPTION", payload: selectedChat.description ?? "" })
    dispatch({ type: "SET_EDIT_CHAT_READ_RECEIPTS", payload: selectedChat.readReceipts !== false })
    dispatch({ type: "SET_EDIT_CHAT_READ_DELAY", payload: selectedChat.readDelayMinutes ?? 0 })
    dispatch({ type: "SET_EDIT_CHAT_BACKGROUND", payload: selectedChat.background ?? null })
  }, [selectedChat])

  const assignCategory = useCallback((category: string | null) => {
    if (!selectedChat) return
    updateChat(selectedChat.id, { category: category || undefined })
  }, [selectedChat, updateChat])

  const archiveSelectedChat = useCallback(() => {
    if (!selectedChat) return
    updateChat(selectedChat.id, { category: undefined, isArchived: true })
    localStorage.removeItem("lastChatId")
    dispatch({ type: "NAVIGATE_BACK_TO_CHATS" })
  }, [selectedChat, updateChat])

  const unarchiveSelectedChat = useCallback(() => {
    if (!selectedChat) return
    updateChat(selectedChat.id, { isArchived: false })
    localStorage.removeItem("lastChatId")
    dispatch({ type: "NAVIGATE_BACK_TO_CHATS" })
  }, [selectedChat, updateChat])

  const togglePinSelectedChat = useCallback(() => {
    if (!selectedChat) return
    updateChat(selectedChat.id, { isPinned: !selectedChat.isPinned })
  }, [selectedChat, updateChat])

  const toggleOnlineSelectedChat = useCallback(() => {
    if (!selectedChat) return
    updateChat(selectedChat.id, { showOnline: !selectedChat.showOnline })
  }, [selectedChat, updateChat])

  const openNewCategory = useCallback(() => {
    setNewCategoryName("")
    setNewCategoryOpen(true)
  }, [])

  const saveNewCategory = useCallback(() => {
    if (!addCategory(newCategoryName)) return
    setNewCategoryOpen(false)
  }, [newCategoryName, addCategory])

  const requestDeleteCategory = useCallback(() => {
    if (activeTab === "todos" || activeTab === "no-leidos" || activeTab === "favoritos" || activeTab === "grupos") return
    const found = categories.find(c => c.id === activeTab)
    setDeleteCategoryId(activeTab)
    setDeleteCategoryName(found?.label || "")
    setDeleteCategoryOpen(true)
  }, [activeTab, categories])

  const confirmDeleteCategory = useCallback(() => {
    if (!deleteCategoryId) return
    deleteCategory(deleteCategoryId)
    setDeleteCategoryOpen(false)
    setDeleteCategoryId(null)
    setDeleteCategoryName("")
    setActiveTab("todos")
  }, [deleteCategoryId, deleteCategory])

  const handleSaveEditChat = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChat || !uiState.editChat.name.trim()) return

    const updates: Partial<Pick<Chat, 'name' | 'avatar' | 'description' | 'readReceipts' | 'readDelayMinutes' | 'background' | 'lockHash'>> = {
      name: uiState.editChat.name.trim(),
      description: uiState.editChat.description.trim() || undefined,
      readReceipts: uiState.editChat.readReceipts,
      readDelayMinutes: Math.max(0, uiState.editChat.readDelayMinutes || 0),
      background: uiState.editChat.background || undefined
    }

    if (uiState.editChat.avatarPreview) {
      updates.avatar = uiState.editChat.avatarPreview
    }

    // Bloqueo con clave
    if (uiState.editChat.removeLock) {
      updates.lockHash = undefined
    } else if (uiState.editChat.lockClave.trim()) {
      updates.lockHash = await sha256Hex(uiState.editChat.lockClave)
    }

    updateChat(selectedChat.id, updates)
    dispatch({ type: "NAVIGATE_TO_CHAT", payload: selectedChat.id })
    dispatch({ type: "RESET_EDIT_CHAT_FORM" })
  }

  const requestDeleteChat = useCallback((chatId: number) => {
    dispatch({ type: "OPEN_CONFIRM_DELETE", payload: chatId })
  }, [])
  
  const confirmDeleteChat = () => {
    if (uiState.confirmDelete.chatId == null) return
    deleteChat(uiState.confirmDelete.chatId)
    dispatch({ type: "CLOSE_CONFIRM_DELETE" })
    handleBackToChats() // 👉 vuelve a la lista de chats
  }
  
  const cancelDeleteChat = () => {
    dispatch({ type: "CLOSE_CONFIRM_DELETE" })
  }

  const requestClearChat = useCallback((chatId: number) => {
    dispatch({ type: "OPEN_CONFIRM_CLEAR", payload: chatId })
  }, [])

  const confirmClearChat = () => {
    if (uiState.confirmClear.chatId == null) return
    clearChat(uiState.confirmClear.chatId)
    dispatch({ type: "CLOSE_CONFIRM_CLEAR" })
  }

  const cancelClearChat = () => {
    dispatch({ type: "CLOSE_CONFIRM_CLEAR" })
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
    onArchiveChat: archiveSelectedChat,
    onUnarchiveChat: unarchiveSelectedChat,
    onTogglePin: togglePinSelectedChat,
    onClearChat: requestClearChat,
    onToggleOnline: toggleOnlineSelectedChat,
    onToggleComposeMode: () => dispatch({ type: "TOGGLE_COMPOSE_MODE" }),
    onEditMessage: beginEditSelectedMessage,
    onDeleteMessage: deleteSelectedMessage,
    onEditChat: handleEditChat,
    onAssignCategory: assignCategory,
    categories,
    platform: settings.platform,
    onCreateCategory: openNewCategory,
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
    assignCategory,
    archiveSelectedChat,
    unarchiveSelectedChat,
    togglePinSelectedChat,
    requestClearChat,
    toggleOnlineSelectedChat,
    categories,
    openNewCategory,
    saveEditedMessage,
    startSelectLongPress,
    cancelLongPress,
    settings.platform
  ])

  // Splash mientras cargan los chats y se decide si restaurar el último chat
  if (!loaded || restoring) {
    return (
      <div className="bg-background text-foreground h-screen w-screen flex items-center justify-center">
        <div
          className="h-8 w-8 rounded-full border-2 border-muted border-t-primary animate-spin"
          role="status"
          aria-label="Cargando"
        />
      </div>
    )
  }

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
        chatDescription={uiState.editChat.description}
        setChatDescription={(d) => dispatch({ type: "SET_EDIT_CHAT_DESCRIPTION", payload: d })}
        readReceipts={uiState.editChat.readReceipts}
        setReadReceipts={(v) => dispatch({ type: "SET_EDIT_CHAT_READ_RECEIPTS", payload: v })}
        readDelayMinutes={uiState.editChat.readDelayMinutes}
        setReadDelayMinutes={(n) => dispatch({ type: "SET_EDIT_CHAT_READ_DELAY", payload: n })}
        background={uiState.editChat.background}
        setBackground={(b) => dispatch({ type: "SET_EDIT_CHAT_BACKGROUND", payload: b })}
        isLocked={!!selectedChat.lockHash}
        lockClave={uiState.editChat.lockClave}
        setLockClave={(c) => dispatch({ type: "SET_EDIT_CHAT_LOCK_CLAVE", payload: c })}
        removeLock={uiState.editChat.removeLock}
        setRemoveLock={(v) => dispatch({ type: "SET_EDIT_CHAT_REMOVE_LOCK", payload: v })}
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
      <>
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
          confirmClear={uiState.confirmClear}
          onCancelClear={cancelClearChat}
          onConfirmClear={confirmClearChat}
        />
        <NewCategoryModal
          isOpen={newCategoryOpen}
          name={newCategoryName}
          onNameChange={setNewCategoryName}
          onCancel={() => setNewCategoryOpen(false)}
          onSave={saveNewCategory}
        />
      </>
    )
  }

  if (uiState.view === "settings") {
    return (
      <SettingsScreen
        appName={settings.appName}
        onAppNameChange={setAppName}
        platform={settings.platform}
        onPlatformChange={setPlatform}
        onBack={() => dispatch({ type: "NAVIGATE_BACK_TO_CHATS" })}
      />
    )
  }

  if (uiState.view === "archived") {
    return (
      <>
        <ArchivedChatsView
          chats={chats.filter(chat => chat.isArchived)}
          onBack={() => dispatch({ type: "NAVIGATE_BACK_TO_CHATS" })}
          onChatClick={handleChatClick}
          onAvatarClick={(avatarSrc) => dispatch({ type: "OPEN_IMAGE_VIEWER", payload: avatarSrc })}
        />
        <UnlockChatModal
          isOpen={!!unlockTarget}
          chatName={unlockTarget?.name}
          onCancel={() => setUnlockTarget(null)}
          onSubmit={verifyUnlock}
        />
      </>
    )
  }

  return (
    <>
      <ServiceWorkerClient />
      <UnlockChatModal
        isOpen={!!unlockTarget}
        chatName={unlockTarget?.name}
        onCancel={() => setUnlockTarget(null)}
        onSubmit={verifyUnlock}
      />
      <NewCategoryModal
        isOpen={newCategoryOpen}
        name={newCategoryName}
        onNameChange={setNewCategoryName}
        onCancel={() => setNewCategoryOpen(false)}
        onSave={saveNewCategory}
      />
      <ConfirmDeleteCategoryModal
        isOpen={deleteCategoryOpen}
        categoryName={deleteCategoryName}
        onCancel={() => setDeleteCategoryOpen(false)}
        onConfirm={confirmDeleteCategory}
      />
      <ChatListView
        chats={chats}
        categories={categories}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onChatClick={handleChatClick}
        onAvatarClick={(avatarSrc) => {
          dispatch({ type: "OPEN_IMAGE_VIEWER", payload: avatarSrc })
        }}
        onNewChat={() => dispatch({ type: "NAVIGATE_TO_NEW_CHAT" })}
        onArchivedClick={() => dispatch({ type: "NAVIGATE_TO_ARCHIVED" })}
        imageViewer={uiState.imageViewer}
        onCloseImage={() => dispatch({ type: "CLOSE_IMAGE_VIEWER" })}
        onRequestDeleteCategory={requestDeleteCategory}
        onImportData={importData}
        appName={settings.appName}
        onOpenSettings={() => dispatch({ type: "NAVIGATE_TO_SETTINGS" })}
        platform={settings.platform}
      />
    </>
  )
}
