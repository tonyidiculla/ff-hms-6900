// Migrated from ff-chat-6880/src/types/chat.ts for HMS
export interface Message {
  id: string
  content: string
  sender: string
  timestamp: Date
  type: 'text' | 'system' | 'image' | 'file'
  edited?: boolean
  reactions?: Reaction[]
}

export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  status: 'online' | 'away' | 'offline'
  lastSeen?: Date
}

export interface Reaction {
  emoji: string
  users: string[]
  count: number
}

export interface ChatRoom {
  id: string
  name: string
  description?: string
  type: 'public' | 'private' | 'direct'
  members: User[]
  createdAt: Date
  updatedAt: Date
}

export interface TypingIndicator {
  userId: string
  userName: string
  roomId: string
}
