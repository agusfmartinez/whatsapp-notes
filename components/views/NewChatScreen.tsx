"use client"

import NewChatForm from "@/components/chat/NewChatForm"
import AvatarCropperModal from "@/components/modals/AvatarCropperModal"

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

type NewChatScreenProps = {
  newChatName: string
  avatarPreview: string | null
  onBack: () => void
  onSubmit: (e: React.FormEvent) => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setNewChatName: (name: string) => void
  cropper: CropperState
  onCloseCropper: () => void
  onCropXChange: (x: number) => void
  onCropYChange: (y: number) => void
  onCropSizeChange: (size: number) => void
  onSaveCrop: () => void
}

export default function NewChatScreen({
  newChatName,
  avatarPreview,
  onBack,
  onSubmit,
  onFileChange,
  setNewChatName,
  cropper,
  onCloseCropper,
  onCropXChange,
  onCropYChange,
  onCropSizeChange,
  onSaveCrop,
}: NewChatScreenProps) {
  return (
    <>
      <NewChatForm
        newChatName={newChatName}
        setNewChatName={setNewChatName}
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
