import { createFileRoute } from "@tanstack/react-router";
import OtherResourceDetail from "#/pages/OtherResourceDetail";

export const Route = createFileRoute("/other/$type/$id")({
  component: OtherResourceDetail,
});
