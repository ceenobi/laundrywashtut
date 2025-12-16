import { userBookingOrdersColumn, orderStatusColors } from "@/utils/constants";
import TableBody from "@/components/TableBody";
import { useCallback } from "react";

export default function Table({ filterBookings }) {
  const renderCell = useCallback((booking, columnKey) => {
    const cellValue = booking[columnKey];
    switch (columnKey) {
      case "orderId":
        return <p className="text-sm">{booking?._id}</p>;
      case "service":
        return <p className="text-sm">{booking?.serviceType}</p>;
      case "pickUpDate":
        return (
          <p className="text-sm">
            {new Date(booking?.pickUp?.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            {booking?.pickUp?.time}
          </p>
        );
      case "status":
        return (
          <div
            className={`capitalize badge font-semibold text-sm ${orderStatusColors[booking?.status]}`}
          >
            {booking?.status}
          </div>
        );
      case "total":
        return <p> &#x20A6; {booking?.total || 0}</p>;
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={userBookingOrdersColumn}
        tableData={filterBookings}
        renderCell={renderCell}
      />
    </>
  );
}
