import React from "react";

export default function ChatContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full max-h-[80vh] border rounded-lg p-4 overflow-y-auto space-y-4 bg-background">
      {children}
    </div>
  );
}
