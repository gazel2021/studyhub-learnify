import { createFileRoute } from "@tanstack/react-router";
import { EditableSitePage } from "@/components/EditableSitePage";

export const Route = createFileRoute("/terms")({
  component: () => <EditableSitePage slug="terms" />,
});
