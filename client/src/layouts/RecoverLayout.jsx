import Logo from "@/components/Logo";
import { Outlet } from "react-router";

export default function RecoverLayout() {
  return (
    <div className="flex flex-col items-center min-h-dvh">
      <div className="mt-20">
        <Logo classname={"text-3xl"} />
      </div>
      <div className="my-20">
        <Outlet />
      </div>
    </div>
  );
}
