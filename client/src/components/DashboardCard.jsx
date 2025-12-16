import { formatCurrency } from "@/utils/constants";
import { useLocation } from "react-router";

export default function DashboardCard({ color, image, total, text, id }) {
  const location = useLocation()
  const path = location.pathname
  return (
    <div className={`rounded-lg p-6 ${color} space-y-4`}>
      <div className="flex gap-2 items-center">
        <img src={image} alt="icon" className="size-12" />
        <p className="text-xl">{text}</p>
      </div>
      <h1 className="text-3xl font-bold">
        {id === 3 || path === "/admin/revenue" ? `${formatCurrency(total)}` : `${total}`}
      </h1>
    </div>
  );
}

