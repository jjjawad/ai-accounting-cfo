"use client";

import { useEffect, useRef, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import ChatContainer from "@/components/chat/chat-container";
import MessageBubble from "@/components/chat/message-bubble";
import SuggestionChips from "@/components/chat/suggestion-chips";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@/hooks/queries/use-chat";
import { useMockChatHistory } from "@/hooks/use-mock-chat-history";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Page() {
  useChat();

  const { data: initialChat } = useMockChatHistory();

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialChat.map((m) => ({ id: m.id, role: m.role, content: m.content }))
  );

  useEffect(() => {
    setMessages(initialChat.map((m) => ({ id: m.id, role: m.role, content: m.content })));
  }, [initialChat]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    const content = text.trim();
    if (!content) return;
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const reply: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: getAssistantReply(content),
      };
      setMessages((prev) => [...prev, reply]);
    }, 400);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-4">
        <ChatContainer>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role}>
              {msg.content}
            </MessageBubble>
          ))}
          <div ref={bottomRef} />
        </ChatContainer>

        <SuggestionChips
          items={[
            "Last month's profit",
            "Top expenses this quarter",
            "Runway",
            "Marketing spend",
          ]}
        />

        <div className="border-t pt-4 flex items-center gap-2">
          <Input
            placeholder="Ask your CFO..."
            className="flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <Button onClick={() => sendMessage(input)}>Send</Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function getAssistantReply(userText: string) {
  const canned = [
    "Got it. I’ll pull the latest figures from the mock dataset.",
    "Here’s a quick mock insight: cashflow remains stable over the next 30 days.",
    "Noted. I’ll flag this for the CFO review queue.",
    "Using mock data: marketing spend sits around AED 12k this month.",
  ];
  const idx = Math.abs(hashString(userText)) % canned.length;
  return canned[idx];
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
