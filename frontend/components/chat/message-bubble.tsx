import React from "react";

export default function MessageBubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  const bubbleColor = isUser ? "bg-primary text-primary-foreground" : "bg-muted";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`${bubbleColor} p-3 rounded-lg max-w-sm break-words`}>{children}</div>
    </div>
  );
}
