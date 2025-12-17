import { Outlet, NavLink } from "react-router";
import { profileLinks } from "@/utils/constants";
import Logout from "@/components/Logout";
import UploadAvatar from "@/pages/profile/UploadAvatar";

export default function ProfileLayout() {
  return (
    <>
      <div className="mt-16 bg-laundryDark py-8 px-4">
        <UploadAvatar />
      </div>
      <div className="container mx-auto py-10 px-4 md:grid grid-cols-12 gap-4">
        <div className="col-span-3 flex flex-col gap-2">
          {profileLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-lg ${
                  isActive ? "bg-indigoLight" : ""
                }`
              }
              end
            >
              <link.icon />
              {link.label}
            </NavLink>
          ))}
          <Logout />
        </div>
        <div className="mt-10 md:mt-0 col-span-9">
          <Outlet />
        </div>
      </div>
    </>
  );
}
