import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { checkAdminSession } from "@/lib/adminAuth";

export const Route = createFileRoute("/admin/king")({
  beforeLoad: async ({ location }) => {
    // Skip the check if we are going to the login page itself
    if (location.pathname === "/admin/king/login") {
      return;
    }

    // Check if the secure cookie is present and valid
    const isAuthenticated = checkAdminSession();

    if (!isAuthenticated) {
      throw redirect({
        to: "/admin/king/login",
      });
    }
  },
  component: () => <Outlet />,
});
