"use client"

import { MessageCircle, Users, Phone } from "lucide-react"

interface BottomNavigationProps {
  chatsCount: number
}

export default function BottomNavigation({ chatsCount }: BottomNavigationProps) {
  return (
    <div className="border-t border-gray-800 bg-[#0b1014]">
      <div className="flex justify-around items-center py-2">
        <div className="flex flex-col items-center gap-1">
          <div className="relative bg-[#0f3728] py-1.5 px-6 rounded-full">
            <MessageCircle size={24} className="text-white" />
            {chatsCount > 0 && (
              <div className="absolute -top-2 right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chatsCount}
              </div>
            )}
          </div>
          <span className="text-xs text-white">Chats</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-xs text-gray-400">Novedades</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Users size={24} className="text-gray-400" />
          <span className="text-xs text-gray-400">Comunidades</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <Phone size={24} className="text-gray-400" />
          <span className="text-xs text-gray-400">Llamadas</span>
        </div>
      </div>
    </div>
  )
}
