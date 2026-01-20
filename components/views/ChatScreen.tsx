"use client"

import ChatView from "@/components/chat/ChatView"
import ImageViewerModal from "@/components/modals/ImageViewerModal"
import ConfirmDeleteChatModal from "@/components/modals/ConfirmDeleteChatModal"
import { Chat } from "@/types/chat"

type ChatController = {
  onBack: () => void
  onAvatarClick: (avatarSrc: string) => void
  onDeleteChat: (chatId: number) => void
  onArchiveChat: () => void
  onUnarchiveChat: () => void
  onToggleComposeMode: () => void
  onEditMessage: () => void
  onDeleteMessage: () => void
  onEditChat: () => void
  onAssignCategory: (category: string | null) => void
  categories: { id: string; label: string }[]
  onCreateCategory: () => void
  onSendMessage: (text: string, asMe: boolean) => void
  onSaveEdit: () => void
  onStartSelectLongPress: (chatId: number, msgId: number) => void
  onCancelLongPress: () => void
  onDeselectMessage: () => void
}

type ChatScreenProps = {
  chat: Chat
  composeAsMe: boolean
  inputValue: string
  setInputValue: (value: string) => void
  selectedMsg: { chatId: number; msgId: number } | null
  editingTarget: { chatId: number; msgId: number } | null
  kbOffset: number
  chatController: ChatController
  imageViewer: { isOpen: boolean; src: string | null }
  onCloseImage: () => void
  confirmDelete: { isOpen: boolean; chatId: number | null }
  onCancelDelete: () => void
  onConfirmDelete: () => void
}

export default function ChatScreen({
  chat,
  composeAsMe,
  inputValue,
  setInputValue,
  selectedMsg,
  editingTarget,
  kbOffset,
  chatController,
  imageViewer,
  onCloseImage,
  confirmDelete,
  onCancelDelete,
  onConfirmDelete,
}: ChatScreenProps) {
  return (
    <>
      <ChatView
        chat={chat}
        composeAsMe={composeAsMe}
        inputValue={inputValue}
        setInputValue={setInputValue}
        selectedMsg={selectedMsg}
        editingTarget={editingTarget}
        kbOffset={kbOffset}
        chatController={chatController}
      />

      <ImageViewerModal
        isOpen={imageViewer.isOpen}
        src={imageViewer.src}
        onClose={onCloseImage}
      />

      <ConfirmDeleteChatModal
        isOpen={confirmDelete.isOpen}
        chatName={chat?.name}
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
      />
    </>
  )
}
