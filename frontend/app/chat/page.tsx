import { ProtectedRoute } from "@/components/protected-route";
import ChatContainer from "@/components/chat/chat-container";
import MessageBubble from "@/components/chat/message-bubble";
import SuggestionChips from "@/components/chat/suggestion-chips";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <ProtectedRoute>
      <div className="space-y-4">
        <ChatContainer>
          <MessageBubble role="user">
            How much did I spend on marketing last month?
          </MessageBubble>
          <MessageBubble role="assistant">
            You spent AED 12,400 on marketing last month. Breakdown: Ads (AED 7,500), Agency (AED 3,900), Tools (AED 1,000).
          </MessageBubble>
          <MessageBubble role="user">What is my current runway?</MessageBubble>
          <MessageBubble role="assistant">
            Your current runway is approximately — days based on the latest burn rate. Consider reviewing large vendor payments due next month.
          </MessageBubble>
        </ChatContainer>

        <SuggestionChips
          items={[
            "Last month’s profit",
            "Top expenses this quarter",
            "Runway",
            "Marketing spend",
          ]}
        />

        <div className="border-t pt-4 flex items-center gap-2">
          <Input placeholder="Ask your CFO..." className="flex-1" />
          <Button disabled>Send</Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
