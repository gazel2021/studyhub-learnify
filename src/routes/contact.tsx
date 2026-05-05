import { createFileRoute } from "@tanstack/react-router";
import { EditableSitePage } from "@/components/EditableSitePage";

export const Route = createFileRoute("/contact")({
  component: () => <EditableSitePage slug="contact" />,
});
