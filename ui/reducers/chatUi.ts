import { Chat } from "@/types/chat"

export type View = "chatList" | "chat" | "newChat" | "editChat"

export interface ChatUIState {
  // Vista actual
  view: View
  
  // Chat seleccionado
  selectedChatId: number | null
  
  // Composición y selección de mensajes
  composeAsMe: boolean
  selectedMsg: { chatId: number; msgId: number } | null
  editingTarget: { chatId: number; msgId: number } | null
  
  // Formularios
  newChat: {
    name: string
    avatarPreview: string | null
  }
  editChat: {
    name: string
    avatarPreview: string | null
  }
  
  // Modales
  imageViewer: {
    isOpen: boolean
    src: string | null
  }
  confirmDelete: {
    isOpen: boolean
    chatId: number | null
  }
  cropper: {
    isOpen: boolean
    src: string | null
    w: number
    h: number
    x: number
    y: number
    size: number
    target: "new" | "edit"
  }
}

export type ChatUIAction =
  // Navegación
  | { type: "SET_VIEW"; payload: View }
  | { type: "SET_SELECTED_CHAT"; payload: number | null }
  | { type: "NAVIGATE_TO_CHAT"; payload: number }
  | { type: "NAVIGATE_BACK_TO_CHATS" }
  | { type: "NAVIGATE_TO_NEW_CHAT" }
  | { type: "NAVIGATE_TO_EDIT_CHAT" }
  
  // Composición y mensajes
  | { type: "TOGGLE_COMPOSE_MODE" }
  | { type: "SET_SELECTED_MSG"; payload: { chatId: number; msgId: number } | null }
  | { type: "SET_EDITING_TARGET"; payload: { chatId: number; msgId: number } | null }
  | { type: "CLEAR_MSG_SELECTION" }
  
  // Formularios
  | { type: "SET_NEW_CHAT_NAME"; payload: string }
  | { type: "SET_EDIT_CHAT_NAME"; payload: string }
  | { type: "RESET_NEW_CHAT_FORM" }
  | { type: "RESET_EDIT_CHAT_FORM" }
  
  // Cropper
  | { type: "OPEN_CROPPER"; payload: { src: string; w: number; h: number; x: number; y: number; size: number; target: "new" | "edit" } }
  | { type: "CLOSE_CROPPER" }
  | { type: "UPDATE_CROP_POSITION"; payload: { x: number; y: number; size: number } }
  | { type: "SAVE_CROP"; payload: string }
  
  // Modales
  | { type: "OPEN_IMAGE_VIEWER"; payload: string }
  | { type: "CLOSE_IMAGE_VIEWER" }
  | { type: "OPEN_CONFIRM_DELETE"; payload: number }
  | { type: "CLOSE_CONFIRM_DELETE" }

const initialState: ChatUIState = {
  view: "chatList",
  selectedChatId: null,
  composeAsMe: true,
  selectedMsg: null,
  editingTarget: null,
  newChat: {
    name: "",
    avatarPreview: null
  },
  editChat: {
    name: "",
    avatarPreview: null
  },
  imageViewer: {
    isOpen: false,
    src: null
  },
  confirmDelete: {
    isOpen: false,
    chatId: null
  },
  cropper: {
    isOpen: false,
    src: null,
    w: 0,
    h: 0,
    x: 0,
    y: 0,
    size: 100,
    target: "new"
  }
}

export function chatUiReducer(state: ChatUIState, action: ChatUIAction): ChatUIState {
  switch (action.type) {
    // Navegación
    case "SET_VIEW":
      return { ...state, view: action.payload }
    
    case "SET_SELECTED_CHAT":
      return { ...state, selectedChatId: action.payload }
    
    case "NAVIGATE_TO_CHAT":
      return { 
        ...state, 
        view: "chat", 
        selectedChatId: action.payload,
        selectedMsg: null,
        editingTarget: null
      }
    
    case "NAVIGATE_BACK_TO_CHATS":
      return { 
        ...state, 
        view: "chatList", 
        selectedChatId: null,
        selectedMsg: null,
        editingTarget: null
      }
    
    case "NAVIGATE_TO_NEW_CHAT":
      return { 
        ...state, 
        view: "newChat",
        newChat: { name: "", avatarPreview: null }
      }
    
    case "NAVIGATE_TO_EDIT_CHAT":
      return { 
        ...state, 
        view: "editChat",
        editChat: { name: "", avatarPreview: null }
      }
    
    // Composición y mensajes
    case "TOGGLE_COMPOSE_MODE":
      return { ...state, composeAsMe: !state.composeAsMe }
    
    case "SET_SELECTED_MSG":
      return { 
        ...state, 
        selectedMsg: action.payload,
        editingTarget: action.payload ? null : state.editingTarget
      }
    
    case "SET_EDITING_TARGET":
      return { ...state, editingTarget: action.payload }
    
    case "CLEAR_MSG_SELECTION":
      return { 
        ...state, 
        selectedMsg: null,
        editingTarget: null
      }
    
    // Formularios
    case "SET_NEW_CHAT_NAME":
      return { 
        ...state, 
        newChat: { ...state.newChat, name: action.payload }
      }
    
    case "SET_EDIT_CHAT_NAME":
      return { 
        ...state, 
        editChat: { ...state.editChat, name: action.payload }
      }
    
    case "RESET_NEW_CHAT_FORM":
      return { 
        ...state, 
        newChat: { name: "", avatarPreview: null }
      }
    
    case "RESET_EDIT_CHAT_FORM":
      return { 
        ...state, 
        editChat: { name: "", avatarPreview: null }
      }
    
    // Cropper
    case "OPEN_CROPPER":
      return {
        ...state,
        cropper: {
          isOpen: true,
          src: action.payload.src,
          w: action.payload.w,
          h: action.payload.h,
          x: action.payload.x,
          y: action.payload.y,
          size: action.payload.size,
          target: action.payload.target
        }
      }
    
    case "CLOSE_CROPPER":
      return {
        ...state,
        cropper: {
          ...state.cropper,
          isOpen: false,
          src: null
        }
      }
    
    case "UPDATE_CROP_POSITION":
      return {
        ...state,
        cropper: {
          ...state.cropper,
          x: action.payload.x,
          y: action.payload.y,
          size: action.payload.size
        }
      }
    
    case "SAVE_CROP":
      const { target } = state.cropper
      if (target === "new") {
        return {
          ...state,
          newChat: { ...state.newChat, avatarPreview: action.payload },
          cropper: { ...state.cropper, isOpen: false, src: null }
        }
      } else {
        return {
          ...state,
          editChat: { ...state.editChat, avatarPreview: action.payload },
          cropper: { ...state.cropper, isOpen: false, src: null }
        }
      }
    
    // Modales
    case "OPEN_IMAGE_VIEWER":
      return {
        ...state,
        imageViewer: { isOpen: true, src: action.payload }
      }
    
    case "CLOSE_IMAGE_VIEWER":
      return {
        ...state,
        imageViewer: { isOpen: false, src: null }
      }
    
    case "OPEN_CONFIRM_DELETE":
      return {
        ...state,
        confirmDelete: { isOpen: true, chatId: action.payload }
      }
    
    case "CLOSE_CONFIRM_DELETE":
      return {
        ...state,
        confirmDelete: { isOpen: false, chatId: null }
      }
    
    default:
      return state
  }
}

export { initialState }
