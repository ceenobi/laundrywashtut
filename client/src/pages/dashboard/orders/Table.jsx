import { adminOrdersColumn, orderStatusColors } from "@/utils/constants";
import TableBody from "@/components/TableBody";
import { useCallback } from "react";
import { CheckCheck, Truck } from "lucide-react";
import { updatePaymentStatus, updateOrderDelivery } from "@/api/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function Table({ orders }) {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const paymentMutation = useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: (res) => {
      toast.success(res.data.message || "payment update success");
      queryClient.invalidateQueries({ queryKey: ["getAllOrders"] });
    },
    onError: (error) => {
      import.meta.env.DEV && console.error(error);
      toast.error(
        error?.response?.data ||
          error?.response?.data?.message ||
          "Something went wrong"
      );
    },
  });

  const deliveryMutation = useMutation({
    mutationFn: updateOrderDelivery,
    onSuccess: (res) => {
      toast.success(res.data.message || "delivery status success");
      queryClient.invalidateQueries({ queryKey: ["getAllOrders"] });
    },
    onError: (error) => {
      import.meta.env.DEV && console.error(error);
      toast.error(
        error?.response?.data ||
          error?.response?.data?.message ||
          "Something went wrong"
      );
    },
  });

  const renderCell = useCallback(
    (order, columnKey) => {
      const paymentFn = async () => {
        paymentMutation.mutate({ bookingId: order?._id, accessToken });
      };
      const deliveryFn = async () => {
        deliveryMutation.mutate({ bookingId: order?._id, accessToken });
      };
      const cellValue = order[columnKey];
      switch (columnKey) {
        case "client":
          return <p className="text-sm">{order?.userId?.fullname}</p>;
        case "service":
          return <p className="text-sm">{order?.serviceType}</p>;
        case "createdAt":
          return (
            <p className="text-sm">
              {new Date(order?.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              {order?.pickUp?.time}
            </p>
          );
        case "isPaid":
          return (
            <p className="text-sm">{order?.isPaid ? "Paid" : "Not Paid"}</p>
          );
        case "status":
          return (
            <div
              className={`capitalize badge font-semibold text-sm ${
                orderStatusColors[order?.status]
              }`}
            >
              {order?.status}
            </div>
          );
        case "amount":
          return <p> &#x20A6; {order?.total || 0}</p>;
        case "isDelivered":
          return (
            <div
              className={`capitalize badge font-semibold text-sm ${
                order?.isDelivered
                  ? "bg-green-200 text-green-700"
                  : "bg-yellow-200 text-yellow-700"
              }`}
            >
              {order?.isDelivered ? "Delivered" : "Not Delivered"}
            </div>
          );
        case "action":
          return (
            <div className="flex gap-4 items-center">
              <div
                className="tooltip tooltip-primary tooltip-left cursor-pointer"
                data-tip={order?.isPaid ? "Paid" : "Mark order as paid"}
              >
                <CheckCheck
                  className={`${
                    order?.isPaid ? "text-green-500" : "text-yellow-500"
                  }`}
                  onClick={paymentFn}
                />
              </div>
              <div
                className="tooltip tooltip-primary tooltip-left cursor-pointer"
                data-tip={
                  order?.isDelivered
                    ? "Mark as Not delivered"
                    : "Mark as Delivered"
                }
                onClick={deliveryFn}
                disabled={order?.isDelivered}
              >
                <Truck
                  className={`${
                    order?.isDelivered ? "text-green-500" : "text-red-500"
                  }`}
                />
              </div>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [paymentMutation, accessToken, deliveryMutation]
  );

  return (
    <>
      <TableBody
        tableColumns={adminOrdersColumn}
        tableData={orders}
        renderCell={renderCell}
      />
    </>
  );
}
