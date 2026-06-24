export type Message = {
    id: number
    text: string
    time: string
    timestamp: number
    isSent: boolean
    isRead?: boolean
    readAt?: number // timestamp objetivo para marcar el visto azul (delay)
  }
  
  export type Category = {
    id: string
    label: string
  }

  export type Chat = {
    id: number
    name: string
    avatar?: string // dataURL o url
    description?: string
    messages: Message[]
    category?: string
    isArchived?: boolean
    isPinned?: boolean
    showOnline?: boolean
    readReceipts?: boolean // mostrar visto azul en enviados (default true)
    readDelayMinutes?: number // demora del visto azul, en minutos (default 0)
    hasSticker?: boolean
    isOfficial?: boolean
    isGroup?: boolean
    hasArrow?: boolean
    hasStatus?: boolean
  }
  
