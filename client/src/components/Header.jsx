import { Link } from "react-router";
import Logo from "./Logo";
import Drawer from "./Drawer";
import { useAuth } from "@/hooks/useAuth";
import UserAvatar from "./UserAvatar";

export default function Header() {
  const { user } = useAuth();

  const links = [
    {
      name: "services",
      label: "Services",
    },
    {
      name: "about-us",
      label: "About Us",
    },
    {
      name: "contact-us",
      label: "Contact Us",
    },
  ];
  return (
    <div className="fixed top-0 w-full bg-zinc-900 z-40">
      <div className="container mx-auto px-4 xl:px-6 py-4 flex justify-between items-center">
        <Logo classname="text-xl" />
        <div className="hidden md:flex gap-3 lg:gap-12">
          {links.map((link) => (
            <a href={`#${link.name}`} key={link.name} className="">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <UserAvatar />
          ) : (
            <div className="hidden md:flex gap-4">
              <Link to="/register">
                <button className="btn btn-lg rounded-full bg-indigoLight lg:w-[153px] text-white  font-medium">
                  Sign Up
                </button>
              </Link>
              <Link to="/login">
                <button className="btn btn-lg rounded-full bg-transparent border border-indigoLight lg:w-[153px] text-indigoLight font-medium">
                  Log In
                </button>
              </Link>
            </div>
          )}
          <Drawer />
        </div>
      </div>
    </div>
  );
}
