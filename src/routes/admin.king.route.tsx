import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "kingwatercompany@gmail.com";

export const Route = createFileRoute("/admin/king")({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/admin/king/login") {
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session || session.user.email !== ADMIN_EMAIL) {
      if (session) {
        await supabase.auth.signOut();
      }
      throw redirect({
        to: "/admin/king/login",
      });
    }
  },
  component: () => <Outlet />,
});
