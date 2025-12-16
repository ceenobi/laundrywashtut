import { useNavigate } from "react-router";

export default function Logo({ classname }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      role="button"
      aria-label="logo"
      className="flex gap-2 items-center cursor-pointer"
    >
      <img src="/logo.svg" alt="logo" className="w-10 h-10" />
      <h1 className={`text-white font-semibold ${classname} `}>LaundryWash</h1>
    </div>
  );
}
