import { createFileRoute } from "@tanstack/react-router";
import { EditableSitePage } from "@/components/EditableSitePage";

export const Route = createFileRoute("/support")({
  component: () => <EditableSitePage slug="support" />,
});
