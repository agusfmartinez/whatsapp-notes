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
  readReceipts: boolean
  readDelayMinutes: number
  background: string | null
  avatarPreview: string | null
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setChatName: (name: string) => void
  setChatDescription: (description: string) => void
  setReadReceipts: (v: boolean) => void
  setReadDelayMinutes: (n: number) => void
  setBackground: (b: string | null) => void
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
  readReceipts,
  readDelayMinutes,
  background,
  avatarPreview,
  onBack,
  onSubmit,
  onFileChange,
  setChatName,
  setChatDescription,
  setReadReceipts,
  setReadDelayMinutes,
  setBackground,
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
        readReceipts={readReceipts}
        setReadReceipts={setReadReceipts}
        readDelayMinutes={readDelayMinutes}
        setReadDelayMinutes={setReadDelayMinutes}
        background={background}
        setBackground={setBackground}
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
