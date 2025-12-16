import TableBody from "@/components/TableBody";
import { adminUsersColumn } from "@/utils/constants";
import { Mail, Phone } from "lucide-react";
import { useCallback } from "react";

export default function Table({ users }) {
  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey];
    switch (columnKey) {
      case "fullname":
        return (
          <div className="flex items-center gap-2">
            <div className="avatar avatar-placeholder">
              <div className="bg-neutral text-neutral-content w-10 rounded-full ">
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
            <p className="text-sm">{user?.fullname}</p>
          </div>
        );
      case "email":
        return <p className="text-sm">{user?.email}</p>;
      case "phone":
        return <p className="text-sm">{user?.phone}</p>;
      case "action":
        return (
          <div className="flex items-center gap-3">
            <div className="tooltip tooltip-left" data-tip={`email ${user?.fullname}`}>
              <Mail
                className="text-green-500 cursor-pointer"
                onClick={() => window.open(`mailto:${user?.email}`, "_blank")}
                size={20}
              />
            </div>
            <div className="tooltip tooltip-left" data-tip={`phone ${user?.fullname}`}>
              <Phone
                className="text-blue-500 cursor-pointer"
                onClick={() => window.open(`tel:${user?.phone}`, "_blank")}
                size={20}
              />
            </div>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <div>
      <TableBody
        tableColumns={adminUsersColumn}
        tableData={users}
        renderCell={renderCell}
      />
    </div>
  );
}
