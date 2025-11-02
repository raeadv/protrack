import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppLayout } from "@/components/layouts/AppLayout";
import { Navigation } from "@/components/layouts/navigation";

const RootLayout = () => (
  <AppLayout>
    <main className="h-screen w-screen">
      <Navigation />
      <div style={{ zIndex: 2 }} className="mt-4 h-full w-full flex flex-col p-2">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </main>
  </AppLayout>
);

export const Route = createRootRoute({ component: RootLayout });
