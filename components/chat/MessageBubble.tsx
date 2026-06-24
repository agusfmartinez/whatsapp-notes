"use client"

import { CheckCheck } from "lucide-react"
import { Message } from "@/types/chat"

interface MessageBubbleProps {
  message: Message
  isSelected: boolean
  isFirstOfGroup: boolean
  onLongPress: () => void
  onLongPressCancel: () => void
}

export default function MessageBubble({
  message,
  isSelected,
  isFirstOfGroup,
  onLongPress,
  onLongPressCancel,
}: MessageBubbleProps) {
  const sent = message.isSent

  // Color de fondo (hex), compartido por la burbuja y el pico
  const bg = sent
    ? isSelected ? "#176848" : "#134c36"
    : isSelected ? "#3b4751" : "#374151"

  // Esquina superior apuntada solo en el primer mensaje de la cadena
  const pointedCorner = isFirstOfGroup
    ? sent ? "rounded-tr-none" : "rounded-tl-none"
    : ""

  return (
    <div
      className={`flex ${sent ? "justify-end" : "justify-start"} ${isFirstOfGroup ? "" : "-mt-1"}`}
    >
      <div
        className={`relative max-w-[80%] px-3 py-2 rounded-lg ${pointedCorner} transition-[outline] ${
          isSelected ? "outline outline-2 outline-[#21c063]" : ""
        } text-white`}
        style={{ backgroundColor: bg }}
        // Long-press para seleccionar
        onPointerDown={onLongPress}
        onPointerUp={onLongPressCancel}
        onPointerCancel={onLongPressCancel}
        onPointerLeave={onLongPressCancel}
        // tap sobre la burbuja no des-selecciona
        onClick={(e) => e.stopPropagation()}
      >
        {isFirstOfGroup && (
          <span
            aria-hidden="true"
            className="absolute top-0 w-0 h-0"
            style={
              sent
                ? { right: "-7px", borderTop: `8px solid ${bg}`, borderRight: "8px solid transparent" }
                : { left: "-7px", borderTop: `8px solid ${bg}`, borderLeft: "8px solid transparent" }
            }
          />
        )}
        <p className="text-sm leading-relaxed">{message.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs text-gray-300">{message.time}</span>
          {sent && (
            <div className={`text-xs ${message.isRead ? "text-blue-400" : "text-gray-300"}`}>
              <CheckCheck size={16} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
