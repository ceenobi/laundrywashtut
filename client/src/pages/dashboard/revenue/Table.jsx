import { paymentStatusColors, revenueOrdersColumn } from "@/utils/constants";
import TableBody from "@/components/TableBody";
import { useCallback } from "react";

export default function Table({ payments }) {
  const renderCell = useCallback((payment, columnKey) => {
    const cellValue = payment[columnKey];
    switch (columnKey) {
      case "reference":
        return <p className="text-sm">{payment?.reference}</p>;
      case "client":
        return <p className="text-sm">{payment?.userId?.fullname}</p>;
      case "amount":
        return <p> &#x20A6; {payment?.amount || 0}</p>;
      case "status":
        return (
          <div
            className={`capitalize badge font-semibold text-sm ${
              paymentStatusColors[payment?.status]
            }`}
          >
            {payment?.status}
          </div>
        );
      case "paymentMethod":
        return <p className="text-sm">{payment?.paymentMethod}</p>;
      case "paidAt":
        return (
          <>
            <p className="text-sm">
              {new Date(payment?.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
            </p>
          </>
        );
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={revenueOrdersColumn}
        tableData={payments}
        renderCell={renderCell}
      />
    </>
  );
}
