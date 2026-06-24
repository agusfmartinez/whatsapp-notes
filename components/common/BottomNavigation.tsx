"use client"

import { MessageCircle, Users, Phone, Settings, CircleDashed } from "lucide-react"
import type { Platform } from "@/hooks/useSettings"

interface BottomNavigationProps {
  chatsCount: number
  platform?: Platform
  onOpenSettings?: () => void
}

export default function BottomNavigation({ chatsCount, platform = "android", onOpenSettings }: BottomNavigationProps) {
  const ChatsTab = (
    <div className="flex flex-col items-center gap-1">
      <div className="relative bg-primary/20 py-1.5 px-6 rounded-full">
        <MessageCircle size={24} className="text-primary" />
        {chatsCount > 0 && (
          <div className="absolute -top-2 right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {chatsCount}
          </div>
        )}
      </div>
      <span className="text-xs text-foreground">Chats</span>
    </div>
  )

  const tab = (icon: React.ReactNode, label: string, onClick?: () => void) => (
    <button type="button" onClick={onClick} className="flex flex-col items-center gap-1">
      {icon}
      <span className="text-xs text-muted-foreground">{label}</span>
    </button>
  )

  return (
    <div className="border-t border-border bg-background">
      <div className="flex justify-around items-center py-2">
        {platform === "ios" ? (
          <>
            {tab(<CircleDashed size={24} className="text-muted-foreground" />, "Novedades")}
            {tab(<Phone size={24} className="text-muted-foreground" />, "Llamadas")}
            {tab(<Users size={24} className="text-muted-foreground" />, "Comunidades")}
            {ChatsTab}
            {tab(<Settings size={24} className="text-muted-foreground" />, "Ajustes", onOpenSettings)}
          </>
        ) : (
          <>
            {ChatsTab}
            {tab(<CircleDashed size={24} className="text-muted-foreground" />, "Novedades")}
            {tab(<Users size={24} className="text-muted-foreground" />, "Comunidades")}
            {tab(<Phone size={24} className="text-muted-foreground" />, "Llamadas")}
          </>
        )}
      </div>
    </div>
  )
}
