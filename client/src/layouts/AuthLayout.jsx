import Logo from "@/components/Logo";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="lg:grid grid-cols-2 items-center gap-4 min-h-dvh">
      <div className="w-full h-full relative">
        <div className="flex justify-center absolute top-10 w-full z-10">
          <Logo classname={"text-3xl"} />
        </div>
        <img
          src="/authbg.png"
          alt="authbg"
          className="w-full min-h-screen lg:h-screen object-cover opacity-50 lg:opacity-100"
        />
        <div className="hidden lg:flex justify-center items-center absolute bottom-10 w-full mx-auto z-10">
          <img
            src="/authTestimonial.svg"
            alt="auth-testimonial"
            className="w-[80%]"
          />
        </div>
      </div>
      <div className="absolute top-40 w-full z-30 px-4 lg:px-0 lg:static">
        <Outlet />
      </div>
    </div>
  );
}
