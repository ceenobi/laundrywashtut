import { userPaymentOrdersColumn } from "@/utils/constants";
import TableBody from "@/components/TableBody";
import { useCallback } from "react";

export default function Table({ filterPayments }) {
  const renderCell = useCallback((payment, columnKey) => {
    const cellValue = payment[columnKey];
    switch (columnKey) {
      case "reference":
        return <p className="text-sm">{payment?.reference}</p>;
      case "service":
        return <p className="text-sm">{payment?.bookingId?.serviceType}</p>;
      case "paymentMethod":
        return <p className="text-sm">{payment?.paymentMethod}</p>;
      case "paidAt":
        return (
          <p className="text-sm">
            {new Date(payment?.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        );
      case "amount":
        return <p> &#x20A6; {payment?.amount || 0}</p>;
      default:
        return cellValue;
    }
  }, []);
  return (
    <>
      <TableBody
        tableColumns={userPaymentOrdersColumn}
        tableData={filterPayments}
        renderCell={renderCell}
      />
    </>
  );
}
