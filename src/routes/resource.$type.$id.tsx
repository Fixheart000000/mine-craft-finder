import { createFileRoute } from "@tanstack/react-router";
import ResourceDetail from "#/pages/ResourceDetail";

export const Route = createFileRoute("/resource/$type/$id")({
  component: ResourceDetail,
});
