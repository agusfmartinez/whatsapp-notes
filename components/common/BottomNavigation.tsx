"use client"

import { MessageCircle, Users, Phone } from "lucide-react"

interface BottomNavigationProps {
  chatsCount: number
}

export default function BottomNavigation({ chatsCount }: BottomNavigationProps) {
  return (
    <div className="border-t border-border bg-background">
      <div className="flex justify-around items-center py-2">
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

        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <div className="w-6 h-6 rounded-full border-2 border-muted-foreground"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></div>
          </div>
          <span className="text-xs text-muted-foreground">Novedades</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Users size={24} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Comunidades</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Phone size={24} className="text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Llamadas</span>
        </div>
      </div>
    </div>
  )
}
