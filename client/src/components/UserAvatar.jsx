import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, Lock, LogOut, Notebook, User } from "lucide-react";
import { Link } from "react-router";

export default function UserAvatar() {
  const { user, handleLogout } = useAuth();
  return (
    <div className="flex gap-2 items-center">
      <div className="avatar avatar-placeholder">
        <div className="bg-neutral text-neutral-content w-12 rounded-full">
          {user?.avatar ? (
            <img src={user?.avatar} alt={user?.fullname} loading="lazy" />
          ) : (
            <span className="text-lg">
              {user?.fullname
                ?.split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()}
            </span>
          )}
        </div>
      </div>
      <div className="hidden md:block dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost capitalize p-1"
        >
          {user?.fullname} <ChevronDown />
        </div>
        <ul
          tabIndex="-1"
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
        >
          <li>
            <Link to="/profile">
              <div className="flex gap-2 items-center">
                <User />
                <span>Profile</span>
              </div>
            </Link>
          </li>
          <li>
            <Link to="/book-laundry">
              <div className="flex gap-2 items-center">
                <Notebook />
                <span>Book laundry</span>
              </div>
            </Link>
          </li>
          {user?.role === "admin" && (
            <li>
              <Link to="/admin">
                <div className="flex gap-2 items-center">
                  <Lock />
                  <span>Admin</span>
                </div>
              </Link>
            </li>
          )}
          <li>
            <div
              className="flex gap-2 items-center"
              role="button"
              aria-label="logout button"
              onClick={handleLogout}
            >
              <LogOut />
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
