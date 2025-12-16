import { adminActivitiesColumn, paymentStatusColors } from "@/utils/constants";
import TableBody from "@/components/TableBody";
import { useCallback } from "react";

export default function Table({ recentActivities }) {
  const renderCell = useCallback((activities, columnKey) => {
    const cellValue = activities[columnKey];
    switch (columnKey) {
      case "activity":
        return (
          <p className="text-sm">
            {activities?.type === "user" ? "Registration" : "Order"}
          </p>
        );
      case "service":
        return (
          <p className="text-sm">
            {activities?.bookingId?.serviceType || activities?.fullname}
          </p>
        );
      case "createdAt":
        return (
          <p className="text-sm">
            {new Date(activities?.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        );
      case "paidAt":
        return (
          <>
            {activities?.type === "payment" ? (
              <>
                {activities?.paidAt ? (
                  <p className="text-sm">Paid</p>
                ) : (
                  "Pay on delivery"
                )}
              </>
            ) : (
              "-"
            )}
          </>
        );
      case "status":
        return (
          <>
            {activities?.type === "payment" ? (
              <div
                className={`capitalize badge font-semibold text-sm ${
                  paymentStatusColors[activities?.status]
                }`}
              >
                {activities?.status}
              </div>
            ) : (
              "-"
            )}
          </>
        );
      case "amount":
        return (
          <>
            {activities?.type === "payment" ? (
              <p> &#x20A6; {activities?.amount || 0}</p>
            ) : (
              "-"
            )}
          </>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <div>
      <TableBody
        tableColumns={adminActivitiesColumn}
        tableData={recentActivities}
        renderCell={renderCell}
      />
    </div>
  );
}
