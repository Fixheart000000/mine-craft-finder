import { createFileRoute } from "@tanstack/react-router";
import TeamProfile from "@/pages/TeamProfile";

export const Route = createFileRoute("/team/$id")({
  component: TeamProfile,
});
