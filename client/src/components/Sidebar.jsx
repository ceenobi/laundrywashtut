import Logo from "./Logo";
import { adminLinks } from "@/utils/constants";
import { NavLink } from "react-router";
import Logout from "./Logout";

export default function Sidebar() {
  return (
    <aside className="hidden bg-laundryDark lg:block min-h-screen fixed z-40 w-[200px]">
      <div className="p-4">
        <Logo classname="text-lg" />
      </div>
      <div className="h-[calc(100vh-150px)] p-4">
        {adminLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.path}
            className={({ isActive }) =>
              `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-lg mb-3 ${
                isActive ? "bg-indigoLight" : "hover:text-indigoLight"
              }`
            }
            end
          >
            <link.icon />
            {link.label}
          </NavLink>
        ))}
      </div>
      <div className="p-4">
        <Logout />
      </div>
    </aside>
  );
}
