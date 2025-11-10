'use client';

import React from 'react';
import { ContentArea, VStack } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ChatPage() {
  return (
    <ContentArea maxWidth="full">
      <VStack size="lg">
        <div className="flex justify-between items-start shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chat & Messaging</h1>
            <p className="text-muted-foreground mt-1">Team communication and messaging</p>
          </div>
          <Button>+ New Message</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">0</div>
              <p className="text-xs text-muted-foreground mt-1">Unread Messages</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">0</div>
              <p className="text-xs text-muted-foreground mt-1">Active Chats</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <p className="text-xs text-muted-foreground mt-1">Channels</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <p className="text-xs text-muted-foreground mt-1">Team Members</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <p>Chat features coming soon</p>
              <p className="text-sm mt-2">Connect to Chat microservice API for full functionality</p>
            </div>
          </CardContent>
        </Card>
      </VStack>
    </ContentArea>
  );
}
