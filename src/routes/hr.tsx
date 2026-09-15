import { createFileRoute } from "@tanstack/react-router";
import { HrShell } from "@/components/hr/HrShell";

export const Route = createFileRoute("/hr")({
  component: HrShell,
});
