import SectionCard from "@/components/settings/section-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function InvitationsForm() {
  return (
    <SectionCard
      title="Invitations"
      footer={
        <div className="flex items-center gap-2">
          <Input placeholder="Invite user by email" type="email" />
          <Button disabled>Invite</Button>
        </div>
      }
    >
      <p className="text-sm text-muted-foreground">
        Invitations will be sent via email once backend is connected.
      </p>
    </SectionCard>
  );
}
