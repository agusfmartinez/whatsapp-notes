"use client"

import { CheckCheck } from "lucide-react"
import { Message } from "@/types/chat"

interface MessageBubbleProps {
  message: Message
  isSelected: boolean
  onLongPress: () => void
  onLongPressCancel: () => void
}

export default function MessageBubble({ 
  message, 
  isSelected, 
  onLongPress, 
  onLongPressCancel 
}: MessageBubbleProps) {
  return (
    <div className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-3 py-2 rounded-lg transition-colors ${
          message.isSent
            ? isSelected
              ? "bg-[#176848] outline outline-2 outline-[#21c063]"
              : "bg-[#134c36]"
            : isSelected
              ? "bg-[#3b4751] outline outline-2 outline-[#21c063]"
              : "bg-gray-700"
        } text-white`}
        // Long-press para seleccionar
        onPointerDown={onLongPress}
        onPointerUp={onLongPressCancel}
        onPointerCancel={onLongPressCancel}
        onPointerLeave={onLongPressCancel}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-gray-300">{message.time}</span>
          {message.isSent && message.isRead && (
            <div className="text-blue-400 text-xs">
              <CheckCheck size={16} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
