import { createRouter, createRootRoute, createRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import ResourceDetail from "@/pages/ResourceDetail";
import OtherResourceDetail from "@/pages/OtherResourceDetail";
import ProjectDetail from "@/pages/ProjectDetail";
import NotFound from "@/pages/NotFound";

const rootRoute = createRootRoute({
  notFoundComponent: NotFound,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

const resourceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resource/$type/$id",
  component: ResourceDetail,
});

const otherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/other/$type/$id",
  component: OtherResourceDetail,
});

const projectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/project/$id",
  component: ProjectDetail,
});

const routeTree = rootRoute.addChildren([indexRoute, resourceRoute, otherRoute, projectRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
