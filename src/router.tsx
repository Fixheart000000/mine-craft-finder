import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient } from "@tanstack/react-query";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { NotFound } from "#/components/app/NotFound.tsx";

export function getRouter() {
  const queryClient = new QueryClient()
  const router =  createTanStackRouter({
    routeTree,
    defaultNotFoundComponent: ({ isNotFound, routeId, data }) => <NotFound />,
		context: { queryClient },

		scrollRestoration: true,
		defaultPreload: 'intent',
		defaultPreloadStaleTime: 0,
  });
  	// https://tanstack.com/router/latest/docs/integrations/query#prefetching-and-streaming
	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});
  return router

}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
