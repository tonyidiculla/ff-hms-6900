// Migrated from ff-chat-6880/src/components/ChannelList.tsx for HMS
'use client'

import { useState, useEffect } from 'react'
import { Hash, Plus, Users, Lock, MessageSquare, Bell, BellOff } from 'lucide-react'
import { ChatService } from '@/lib/chat-service'
import type { Database } from '@/lib/supabase'

type ChatChannel = Database['public']['Tables']['chat_channels']['Row']

interface ChannelListProps {
  userId: string
  selectedChannelId?: string
  onChannelSelect: (channelId: string) => void
  onChannelCreate: () => void
}

export default function ChannelList({
  userId,
  selectedChannelId,
  onChannelSelect,
  onChannelCreate,
}: ChannelListProps) {
  const [channels, setChannels] = useState<ChatChannel[]>([])
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChannels()
  }, [userId])

  useEffect(() => {
    // Subscribe to channel updates
    const subscription = ChatService.subscribeToChannels(userId, (channel) => {
      setChannels(prev => {
        const existingIndex = prev.findIndex(c => c.id === channel.id)
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = channel
          return updated
        } else {
          return [...prev, channel]
        }
      })
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [userId])

  const loadChannels = async () => {
    // ...fetch channels logic...
  }

  return (
    <div>
      {/* ...UI for channel list... */}
    </div>
  )
}
