"use client"

import { Button } from "@/components/ui/button"
import { Paperclip, Camera, Check, SendHorizontal } from "lucide-react"
import { strings } from "@/strings/es"

interface ComposerProps {
  inputValue: string
  setInputValue: (value: string) => void
  isEditing: boolean
  onSend: () => void
  onSaveEdit: () => void
  onFocus: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  messagesRef: React.RefObject<HTMLDivElement>
}

export default function Composer({
  inputValue,
  setInputValue,
  isEditing,
  onSend,
  onSaveEdit,
  onFocus,
  onKeyDown,
  messagesRef
}: ComposerProps) {
  return (
    <div className="sticky bottom-0 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              onFocus()
              if (messagesRef.current) {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight
              }
            }}
            onKeyDown={onKeyDown}
            placeholder={isEditing ? strings.composer.editPlaceholder : strings.composer.placeholder}
            className="bg-[#22292c] py-2.5 pl-4 pr-20 border border-gray-700 text-white rounded-full w-full outline-none"
            aria-label={isEditing ? strings.composer.editPlaceholder : strings.composer.placeholder}
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:bg-transparent"
              aria-label={strings.composer.attach}
            >
              <Paperclip size={20} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-gray-400 hover:bg-transparent"
              aria-label={strings.composer.camera}
            >
              <Camera size={20} />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <Button
            onClick={onSaveEdit}
            className="bg-[#21c063] hover:bg-green-600 w-12 h-12 rounded-full p-0"
            aria-label={strings.composer.save}
          >
            <Check size={24} />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            className="bg-[#21c063] hover:bg-green-600 w-12 h-12 rounded-full p-0"
            aria-label={strings.composer.send}
          >
            <SendHorizontal size={24} />
          </Button>
        )}
      </div>
    </div>
  )
}
