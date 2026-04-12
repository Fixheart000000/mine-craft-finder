import { createFileRoute } from "@tanstack/react-router";
import UserProfile from "#/pages/UserProfile";

export const Route = createFileRoute("/user/$id")({
  component: UserProfile,
});
