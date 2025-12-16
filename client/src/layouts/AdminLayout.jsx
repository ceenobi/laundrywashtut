import AdminHeader from "@/components/AdminHeader";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Outlet } from "react-router";

export default function AdminLayout() {
  const { user } = useAuth();
  return (
    <>
      <section className="min-h-dvh">
        <Sidebar user={user} />
        <div className="lg:ml-[200px]">
          <AdminHeader />
          <Outlet />
        </div>
      </section>
    </>
  );
}
