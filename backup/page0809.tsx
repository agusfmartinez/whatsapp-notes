"use client"

import {
  Search, Camera, MoreVertical, Archive, Phone, Users,
  MessageCircle, Plus, ArrowLeft, Video, Smile, Paperclip, Mic, SendHorizontal, CheckCheck, Check
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState, useRef } from "react"

type Message = {
  id: number
  text: string
  time: string
  timestamp: number
  isSent: boolean
  isRead?: boolean
}

type Chat = {
  id: number
  name: string
  avatar?: string
  messages: Message[]
  isPinned?: boolean
  hasSticker?: boolean
  isOfficial?: boolean
  isGroup?: boolean
  hasArrow?: boolean
  hasStatus?: boolean
}

export default function WhatsAppInterface() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [chats, setChats] = useState<Chat[]>([])
  const [inputValue, setInputValue] = useState("")
  const messagesRef = useRef<HTMLDivElement | null>(null)
  const [kbOffset, setKbOffset] = useState(0)
  const [composeAsMe, setComposeAsMe] = useState(true) // true = envío yo, false = mensaje “del otro”
  const [selectedMsg, setSelectedMsg] = useState<{ chatId: number; msgId: number } | null>(null)
  const [editingTarget, setEditingTarget] = useState<{ chatId: number; msgId: number } | null>(null)
  const longPressTimeout = useRef<number | null>(null)

  // === Avatar Cropper modal ===
  const [cropperOpen, setCropperOpen] = useState(false)
  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [cropW, setCropW] = useState(0)
  const [cropH, setCropH] = useState(0)
  const [cropX, setCropX] = useState(0)
  const [cropY, setCropY] = useState(0)
  const [cropSize, setCropSize] = useState(100) // tamaño del recorte cuadrado

  // Para el formulario de "nuevo chat"
  const [newChatName, setNewChatName] = useState("")
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  // === Image Viewer modal (para ver en grande) ===
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerSrc, setViewerSrc] = useState<string | null>(null)

  type View = "chatList" | "chat" | "newChat"
  const [currentView, setCurrentView] = useState<View>("chatList")

  // 🔹 Cargar desde localStorage al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("chats")
    if (saved) {
      const parsedChats = JSON.parse(saved)
      setChats(parsedChats)
    } else {
      setChats([])
    }
  }, [])

  // 🔹 Sincronizar selectedChat cuando chats cambie
  useEffect(() => {
    if (selectedChat && chats.length > 0) {
      const updatedSelected = chats.find(c => c.id === selectedChat.id)
      if (updatedSelected) {
        setSelectedChat(updatedSelected)
      }
    }
  }, [chats, selectedChat])

  // 🔹 Guardar cada vez que cambien los chats
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats))
  }, [chats])

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    const onResize = () => {
      const offset = Math.max(0, window.innerHeight - vv.height)
      setKbOffset(offset)
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
      }
    }
    vv.addEventListener("resize", onResize)
    vv.addEventListener("scroll", onResize)
    onResize()
    return () => {
      vv.removeEventListener("resize", onResize)
      vv.removeEventListener("scroll", onResize)
    }
  }, [])


  // ✅ Crear un nuevo chat
  const createChat = (name: string) => {
    const newChat: Chat = {
      id: Date.now(),
      name,
      avatar: "/placeholder.svg",
      messages: []
    }
    setChats(prev => [...prev, newChat])
  }

  // helper: crear chat y abrirlo
  const createChatAndOpen = (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return

    const newChat: Chat = {
      id: Date.now(),
      name: trimmed,
      avatar: avatarPreview || "/placeholder.svg",
      messages: []
    }

    setChats(prev => {
      const updated = [...prev, newChat]
      return updated
    })

    setSelectedChat(newChat)
    setCurrentView("chat")
    setNewChatName("")
    setAvatarPreview(null)
  }

  const deleteChat = (chatId: number) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    setCurrentView("chatList")
    setSelectedChat(null)
  }


  // ✅ Enviar mensaje en un chat
  const sendMessage = (chatId: number, text: string, asMe: boolean) => {
    const now = new Date()
    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: Date.now(),
                text,
                time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                timestamp: now.getTime(),
                isSent: asMe,
                isRead: asMe ? true : undefined, // solo marco leído si lo “mandé yo”
              }
            ]
          }
          : chat
      )
    )
    setInputValue("")
    setEditingTarget(null)
    setSelectedMsg(null)
  }

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat)
    setCurrentView("chat")
    setInputValue("")
  }

  const handleBackToChats = () => {
    setCurrentView("chatList")
    setSelectedChat(null)
  }

  const startSelectLongPress = (chatId: number, msgId: number) => {
    if (longPressTimeout.current) window.clearTimeout(longPressTimeout.current)
    longPressTimeout.current = window.setTimeout(() => {
      setSelectedMsg({ chatId, msgId })
      setEditingTarget(null) // si estaba editando, salir
    }, 450)
  }
  const cancelLongPress = () => {
    if (longPressTimeout.current) {
      window.clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }
  }

  const deleteSelectedMessage = () => {
    if (!selectedMsg) return
    setChats(prev =>
      prev.map(c =>
        c.id === selectedMsg.chatId
          ? { ...c, messages: c.messages.filter(m => m.id !== selectedMsg.msgId) }
          : c
      )
    )
    setSelectedMsg(null)
    setEditingTarget(null)
  }

  const beginEditSelectedMessage = () => {
    if (!selectedMsg) return
    const chat = chats.find(c => c.id === selectedMsg.chatId)
    const msg = chat?.messages.find(m => m.id === selectedMsg.msgId)
    if (!msg) return
    setInputValue(msg.text)
    setEditingTarget(selectedMsg)
  }

  const saveEditedMessage = () => {
    if (!editingTarget) return
    const newText = inputValue.trim()
    if (!newText) return
    setChats(prev =>
      prev.map(c =>
        c.id === editingTarget.chatId
          ? {
            ...c,
            messages: c.messages.map(m =>
              m.id === editingTarget.msgId ? { ...m, text: newText } : m
            ),
          }
          : c
      )
    )
    setInputValue("")
    setEditingTarget(null)
    setSelectedMsg(null)
  }

  async function fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  function supportsWebP(): boolean {
    try {
      const c = document.createElement("canvas")
      return c.toDataURL("image/webp").startsWith("data:image/webp")
    } catch {
      return false
    }
  }

  /**
 * Recorta un CUADRADO desde la imagen fuente y exporta comprimido.
 * - srcDataURL: dataURL de la imagen original
 * - crop: {x, y, size} en coordenadas de la imagen original
 * - exportSize: tamaño final (ej 256 => 256x256)
 * - preferWebP: si true, intenta webp y cae a jpeg si no hay soporte
 */
  async function compressDataURL(srcDataURL: string, crop: { x: number; y: number; size: number }, exportSize = 256, preferWebP = true, quality = 0.8): Promise<string> {
    const img = new Image()
    img.src = srcDataURL
    await img.decode()

    const { x, y, size } = crop

    const canvas = document.createElement("canvas")
    canvas.width = exportSize
    canvas.height = exportSize
    const ctx = canvas.getContext("2d")!

    // dibujar el recorte cuadrado escalado al canvas
    ctx.drawImage(img, x, y, size, size, 0, 0, exportSize, exportSize)

    const useWebP = preferWebP && supportsWebP()
    const mime = useWebP ? "image/webp" : "image/jpeg"
    return canvas.toDataURL(mime, quality)
  }

  // ==================================
  // 🔹 Vista: crear nuevo chat
  // ==================================
  if (currentView === "newChat") {
    return (
      <div className="bg-[#0b1014] text-white h-[100dvh] w-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto text-white hover:bg-transparent"
            onClick={() => setCurrentView("chatList")}
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-lg font-medium">Nuevo chat</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            createChatAndOpen(newChatName)
          }}
          className="px-4 mt-4 space-y-4"
        >

          <div className="space-y-2">
            <label className="block text-sm text-gray-300">Avatar (opcional)</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#22292c] border border-gray-700">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    Sin foto
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const raw = await fileToDataURL(file)
                  // setear límites y valores iniciales del cropper
                  const img = new Image()
                  img.src = raw
                  await img.decode()
                  const side = Math.min(img.width, img.height)
                  setCropSrc(raw)
                  setCropW(img.width)
                  setCropH(img.height)
                  setCropSize(Math.floor(side * 0.8)) // arranca con 80% del lado corto
                  setCropX(Math.floor((img.width - side * 0.8) / 2))
                  setCropY(Math.floor((img.height - side * 0.8) / 2))
                  setCropperOpen(true)
                }}
                className="text-sm"
              />

            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Nombre del chat</label>
            <Input
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              placeholder="Ej: Ideas, Tareas, Compras…"
              className="bg-[#22292c] border-gray-700 text-white"
              autoFocus
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#21c063] hover:bg-green-600"
              disabled={!newChatName.trim()}
            >
              Guardar
            </Button>
          </div>
        </form>

        {cropperOpen && cropSrc && (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#0b1014] text-white w-full max-w-md rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-medium">Recortar avatar</h2>
              <button onClick={() => setCropperOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
      
            {/* Preview con rectángulo de recorte (solo ilustrativo) */}
            <div className="relative bg-[#111] rounded-md overflow-hidden aspect-square mb-3">
              {/* imagen completa ajustada a contenedor */}
              <img src={cropSrc} alt="to-crop" className="w-full h-full object-contain" />
              {/* Overlay para marcar el recorte: lo representamos visualmente */}
              <div
                className="absolute border-2 border-[#21c063]/80"
                style={{
                  // convertimos recorte (en coords reales) a coords del contenedor
                  left: `${(cropX / cropW) * 100}%`,
                  top: `${(cropY / cropH) * 100}%`,
                  width: `${(cropSize / cropW) * 100}%`,
                  height: `${(cropSize / cropH) * 100}%`,
                }}
              />
            </div>
      
            {/* Sliders */}
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-300">Posición X</label>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, cropW - cropSize)}
                  value={cropX}
                  onChange={(e) => setCropX(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Posición Y</label>
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, cropH - cropSize)}
                  value={cropY}
                  onChange={(e) => setCropY(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-300">Tamaño</label>
                <input
                  type="range"
                  min={50}
                  max={Math.min(cropW, cropH)}
                  value={cropSize}
                  onChange={(e) => {
                    const next = parseInt(e.target.value)
                    setCropSize(next)
                    // clamp X/Y para que no se salga
                    setCropX((x) => Math.min(x, Math.max(0, cropW - next)))
                    setCropY((y) => Math.min(y, Math.max(0, cropH - next)))
                  }}
                  className="w-full"
                />
              </div>
            </div>
      
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setCropperOpen(false)}
                className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!cropSrc) return
                  const dataURL = await compressDataURL(
                    cropSrc,
                    { x: cropX, y: cropY, size: cropSize },
                    256, // exportSize
                    true, // preferWebP
                    0.8   // quality
                  )
                  setAvatarPreview(dataURL) // 👈 usarás este valor al crear el chat
                  setCropperOpen(false)
                }}
                className="px-3 py-2 rounded-md bg-[#21c063] hover:bg-green-600"
              >
                Recortar y guardar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    )

  }




  // ==================================
  // 🔹 Vista del chat seleccionado
  // ==================================
  if (currentView === "chat" && selectedChat) {
    const updatedSelected = chats.find(c => c.id === selectedChat.id) || selectedChat

    return (
      <div className="bg-red-900/50 text-white h-[100dvh] w-screen flex flex-col overflow-hidden">

        {/* Chat Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[#0b1014]">
          <Button variant="ghost" size="sm" className="p-0 h-auto text-white hover:bg-transparent"
            onClick={() => {
              handleBackToChats()
              setSelectedMsg(null)
              setEditingTarget(null)
            }}>
            <ArrowLeft size={24} />
          </Button>
          <Avatar className="w-10 h-10 cursor-pointer" onClick={() => {
            setViewerSrc(updatedSelected.avatar || "/placeholder.svg")
            setViewerOpen(true)
          }}>
            <AvatarImage src={updatedSelected.avatar || "/placeholder.svg"} alt={updatedSelected.name} />
            <AvatarFallback className="bg-gray-700 text-white">
              {updatedSelected.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-medium text-white">{updatedSelected.name}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Video size={24} className="text-white" />
            <Phone size={24} className="text-white" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <MoreVertical size={24} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem>Info del contacto</DropdownMenuItem>
                <DropdownMenuItem>Archivar chat</DropdownMenuItem>
                <DropdownMenuItem onClick={() => deleteChat(updatedSelected.id)}>Eliminar chat</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setComposeAsMe(v => !v)}>
                  {composeAsMe ? "Recibir mensaje" : "Enviar mensaje"}
                </DropdownMenuItem>
                <div className="h-px my-1 bg-gray-700/50" />
                <DropdownMenuItem
                  disabled={!selectedMsg}
                  onClick={beginEditSelectedMessage}
                >
                  Editar mensaje
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!selectedMsg}
                  onClick={deleteSelectedMessage}
                >
                  Borrar mensaje
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Messages (scrolleable) */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-2"
          style={{ paddingBottom: kbOffset + 88, scrollPaddingBottom: 88 }}
          onClick={(e) => {
            // si hacés tap en el fondo (no sobre un bubble), des-selecciona
            if (e.target === e.currentTarget) {
              setSelectedMsg(null)
              // no salgo de edición para evitar perder texto; quitá la línea de abajo si querés desactivar edición también
              // setEditingTarget(null)
            }
          }}
        >
          {updatedSelected.messages.map((m) => {
            const isSelected =
              selectedMsg?.chatId === updatedSelected.id && selectedMsg?.msgId === m.id

            return (
              <div key={m.id} className={`flex ${m.isSent ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg transition-colors ${m.isSent
                      ? isSelected
                        ? "bg-[#176848] outline outline-2 outline-[#21c063]"
                        : "bg-[#134c36]"
                      : isSelected
                        ? "bg-[#3b4751] outline outline-2 outline-[#21c063]"
                        : "bg-gray-700"
                    } text-white`}
                  // Long-press para seleccionar
                  onPointerDown={() => startSelectLongPress(updatedSelected.id, m.id)}
                  onPointerUp={cancelLongPress}
                  onPointerCancel={cancelLongPress}
                  onPointerLeave={cancelLongPress}
                >
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-xs text-gray-300">{m.time}</span>
                    {m.isSent && m.isRead && <div className="text-blue-400 text-xs"> <CheckCheck size={16} /> </div>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>


        {/* Message Input */}
        <div className="sticky bottom-0 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={() => {
                  if (messagesRef.current) {
                    messagesRef.current.scrollTop = messagesRef.current.scrollHeight
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    if (inputValue.trim()) {
                      if (editingTarget) {
                        saveEditedMessage()
                      } else {
                        sendMessage(updatedSelected.id, inputValue.trim(), composeAsMe)
                      }
                      requestAnimationFrame(() => {
                        if (messagesRef.current) {
                          messagesRef.current.scrollTop = messagesRef.current.scrollHeight
                        }
                      })
                    }
                  }
                }}
                placeholder={editingTarget ? "Editar mensaje…" : "Mensaje"}
                className="bg-[#22292c] py-2.5 pl-4 pr-20 border border-gray-700 text-white rounded-full w-full outline-none"
              />

              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                <Button variant="ghost" size="sm" className="p-1 text-gray-400 hover:bg-transparent">
                  <Paperclip size={20} />
                </Button>
                <Button variant="ghost" size="sm" className="p-1 text-gray-400 hover:bg-transparent">
                  <Camera size={20} />
                </Button>
              </div>
            </div>

            {editingTarget ? (
              <Button
                onClick={saveEditedMessage}
                className="bg-[#21c063] hover:bg-green-600 w-12 h-12 rounded-full p-0"
                aria-label="Guardar edición"
              >
                <Check size={24} />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (inputValue.trim()) {
                    sendMessage(updatedSelected.id, inputValue.trim(), composeAsMe)
                    setInputValue("")
                    requestAnimationFrame(() => {
                      if (messagesRef.current) {
                        messagesRef.current.scrollTop = messagesRef.current.scrollHeight
                      }
                    })
                  }
                }}
                className="bg-[#21c063] hover:bg-green-600 w-12 h-12 rounded-full p-0"
                aria-label="Enviar"
              >
                <SendHorizontal size={24} />
              </Button>
            )}

          </div>
        </div>

        {/* Modal viewer */}
        {viewerOpen && viewerSrc && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setViewerOpen(false)}>
            <img
              src={viewerSrc}
              alt="avatar"
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setViewerOpen(false)}
              className="absolute top-4 right-4 text-white/90 bg-black/40 rounded-full px-3 py-1"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    )
  }

  // ==================================
  // 🔹 Vista de lista de chats
  // ==================================
  return (
    <div className="bg-[#0b1014] text-white h-screen w-screen flex flex-col">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3">
        <h1 className="text-xl font-medium">WhatsApp</h1>
        <div className="flex items-center gap-4">
          <Camera size={24} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <MoreVertical size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem>Opción 1</DropdownMenuItem>
              <DropdownMenuItem>Opción 2</DropdownMenuItem>
              <DropdownMenuItem>Opción 3</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Preguntar a Meta AI o buscar"
            className="bg-[#22292c] border-gray-700 text-white pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-4 mb-4 overflow-x-auto no-scrollbar">
        <Button variant="default" className="bg-[#0f3728] hover:bg-green-600 text-white rounded-full px-4 py-2 text-sm">
          Todos
        </Button>
        <Button variant="outline" className="border-gray-600 text-gray-300 rounded-full px-4 py-2 text-sm bg-transparent">
          No leídos <span className="ml-1">0</span>
        </Button>
        <Button variant="outline" className="border-gray-600 text-gray-300 rounded-full px-4 py-2 text-sm bg-transparent">
          Favoritos <span className="ml-1">0</span>
        </Button>
        <Button variant="outline" className="border-gray-600 text-gray-300 rounded-full px-4 py-2 text-sm bg-transparent">
          Grupos <span className="ml-1">0</span>
        </Button>
      </div>

      {/* Archived Section */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Archive size={20} className="text-gray-400" />
          <span className="text-gray-300">Archivados</span>
        </div>
        <span className="text-gray-400 text-sm">0</span>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {
          [...chats]
            .sort((a, b) => {
              const lastA = a.messages[a.messages.length - 1]
              const lastB = b.messages[b.messages.length - 1]

              if (!lastA && !lastB) return 0
              if (!lastA) return 1   // si A no tiene mensajes, va al fondo
              if (!lastB) return -1  // si B no tiene mensajes, va arriba

              return (lastB?.timestamp || 0) - (lastA?.timestamp || 0)
            })
            .map((chat) => (
              <div key={chat.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => handleChatClick(chat)}>
                <Avatar className="w-12 h-12 cursor-pointer" onClick={(e) => {
                  e.stopPropagation()
                  setViewerSrc(chat.avatar || "/placeholder.svg")
                  setViewerOpen(true)
                }}>
                  <AvatarImage src={chat.avatar || "/placeholder.svg"} alt={chat.name} />
                  <AvatarFallback className="bg-gray-700 text-white">{chat.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white truncate">{chat.name}</h3>
                    <div className="flex items-center gap-2">
                      {chat.messages.length > 0 && (
                        <span className="text-xs text-gray-400">
                          {chat.messages[chat.messages.length - 1].time}
                        </span>
                      )}
                      {chat.isPinned && <div className="w-4 h-4 text-gray-400">📌</div>}
                      {chat.hasArrow && <div className="text-gray-400">›</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {chat.messages.length > 0 && chat.messages[chat.messages.length - 1].isSent && (
                      chat.messages[chat.messages.length - 1].isRead
                        ? <div className="text-blue-400 text-xs"> <CheckCheck size={16} /> </div>
                        : <div className="text-gray-400 text-xs"> <CheckCheck size={16} /> </div>
                    )}
                    {chat.hasSticker && <div className="text-gray-400 text-xs">🎭</div>}
                    {chat.isOfficial && <div className="text-gray-400 text-xs">📢</div>}
                    <p className="text-sm text-gray-400 truncate">
                      {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].text : "Sin mensajes"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-800 bg-[#0b1014]">
        <div className="flex justify-around items-center py-2">
          <div className="flex flex-col items-center gap-1">
            <div className="relative bg-[#0f3728] py-1.5 px-6  rounded-full">
              <MessageCircle size={24} className="text-white" />
              {chats.length > 0 && (
                <div className="absolute -top-2 right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chats.length}
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


      {/* Floating Action Button */}
      <div className="fixed bottom-16 right-4 md:bottom-20">
        <Button
          className="bg-[#21c063] hover:bg-green-600 w-14 h-14 rounded-full shadow-lg"
          onClick={() => setCurrentView("newChat")}
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* Modal viewer */}
      {viewerOpen && viewerSrc && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setViewerOpen(false)}>
          <img
            src={viewerSrc}
            alt="avatar"
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-4 right-4 text-white/90 bg-black/40 rounded-full px-3 py-1"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>

    
  )

  
}


