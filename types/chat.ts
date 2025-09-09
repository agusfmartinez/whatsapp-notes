export type Message = {
    id: number
    text: string
    time: string
    timestamp: number
    isSent: boolean
    isRead?: boolean
  }
  
  export type Chat = {
    id: number
    name: string
    avatar?: string // dataURL o url
    messages: Message[]
    isPinned?: boolean
    hasSticker?: boolean
    isOfficial?: boolean
    isGroup?: boolean
    hasArrow?: boolean
    hasStatus?: boolean
  }
  