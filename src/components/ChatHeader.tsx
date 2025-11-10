// Migrated from ff-chat-6880/src/components/ChatHeader.tsx for HMS
'use client'

import { MessageCircle, Users, Settings } from 'lucide-react'

export function ChatHeader() {
  return (
    <header className="bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-8 w-8" />
          <div>
            <h1 className="text-xl font-bold">Furfield Chat</h1>
            <p className="text-sky-100 text-sm">Real-time messaging for your team</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sky-100">
            <Users className="h-4 w-4" />
            <span className="text-sm">3 online</span>
          </div>
          <button className="p-2 hover:bg-sky-600 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
