// Migrated from ff-chat-6880/src/components/MessageBubble.tsx for HMS
'use client'

import type { Message } from '@/types/chat'
import { cn, formatTime } from '@/lib/utils'

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex mb-4",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-xs lg:max-w-md xl:max-w-lg",
        isOwn ? "order-1" : "order-2"
      )}>
        {!isOwn && (
          <div className="text-sm text-gray-600 mb-1 px-1">
            {message.sender}
          </div>
        )}
        <div className={cn(
          "px-4 py-2 rounded-2xl shadow-sm",
          isOwn ? "bg-sky-500 text-white rounded-br-md" : "bg-gray-200 text-gray-900 rounded-bl-md"
        )}>
          {message.content}
        </div>
        <div className="text-xs text-gray-400 mt-1 text-right">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}
