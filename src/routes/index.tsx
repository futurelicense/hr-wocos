import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WoCOS HR — Intelligent Workforce Operations" },
      {
        name: "description",
        content:
          "WoCOS HR runs the full workforce lifecycle for TeamAce: workforce requests, recruitment, verification, onboarding, deployment readiness and workforce operations.",
      },
      { property: "og:title", content: "WoCOS HR — Intelligent Workforce Operations" },
      {
        property: "og:description",
        content: "Workforce requests to deployment, in one operations console.",
      },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/hr" });
  },
});
