"use client"

import EditChatForm from "@/components/chat/EditChatForm"
import AvatarCropperModal from "@/components/modals/AvatarCropperModal"
import { Chat } from "@/types/chat"

type CropperState = {
  isOpen: boolean
  src: string | null
  w: number
  h: number
  x: number
  y: number
  size: number
  target: "new" | "edit"
}

type EditChatScreenProps = {
  chat: Chat
  chatName: string
  chatDescription: string
  avatarPreview: string | null
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setChatName: (name: string) => void
  setChatDescription: (description: string) => void
  cropper: CropperState
  onCloseCropper: () => void
  onCropXChange: (x: number) => void
  onCropYChange: (y: number) => void
  onCropSizeChange: (size: number) => void
  onSaveCrop: () => void
}

export default function EditChatScreen({
  chat,
  chatName,
  chatDescription,
  avatarPreview,
  onBack,
  onSubmit,
  onFileChange,
  setChatName,
  setChatDescription,
  cropper,
  onCloseCropper,
  onCropXChange,
  onCropYChange,
  onCropSizeChange,
  onSaveCrop,
}: EditChatScreenProps) {
  return (
    <>
      <EditChatForm
        chat={chat}
        chatName={chatName}
        setChatName={setChatName}
        chatDescription={chatDescription}
        setChatDescription={setChatDescription}
        avatarPreview={avatarPreview}
        onBack={onBack}
        onSubmit={onSubmit}
        onFileChange={onFileChange}
      />

      <AvatarCropperModal
        isOpen={cropper.isOpen}
        cropSrc={cropper.src}
        cropW={cropper.w}
        cropH={cropper.h}
        cropX={cropper.x}
        cropY={cropper.y}
        cropSize={cropper.size}
        onClose={onCloseCropper}
        onCropXChange={onCropXChange}
        onCropYChange={onCropYChange}
        onCropSizeChange={onCropSizeChange}
        onSave={onSaveCrop}
      />
    </>
  )
}
