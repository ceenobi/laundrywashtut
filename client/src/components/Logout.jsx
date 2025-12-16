import { useState } from "react";
import Modal from "./Modal";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export default function Logout() {
  const [isOpen, setIsOpen] = useState(false);
  const { handleLogout } = useAuth();

  return (
    <>
      <a
        href="#"
        className="hidden md:flex gap-2 items-center p-4 transition duration-300 ease-in rounded-lg"
        onClick={() => setIsOpen(true)}
      >
        <LogOut />
        Logout
      </a>
      <Modal
        id="logout"
        isOpen={isOpen}
        classname="bg-laundryDark max-w-[400px] mx-auto rounded-lg p-4"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <LogOut size={40} className="text-red-500" />
          <h1 className="text-2xl font-bold">Logout</h1>
          <p className="text-center text-sm">
            Are you sure you want to be logged out?
          </p>
          <div className="my-4 flex gap-4">
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-outline w-[100px]"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="btn bg-red-500 text-white w-[130px]"
            >
              Yes, Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
