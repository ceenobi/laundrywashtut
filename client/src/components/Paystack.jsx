import PaystackPop from "@paystack/inline-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createPayment } from "@/api/payment";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useRef, useCallback } from "react";

export default function Paystack({
  bookingId,
  total,
  setIsModalOpen,
  onClose,
  selectPayment,
}) {
  const { user, accessToken, setBookingForm } = useAuth();
  const queryClient = useQueryClient();
  const paystackInstanceRef = useRef(null);
  const hasOpenedRef = useRef(false);

  const mutation = useMutation({
    mutationFn: createPayment,
    onSuccess: (res) => {
      toast.success(res.data.message || "Payment successful");
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      localStorage.removeItem("laundryBookingForm");
      setBookingForm(null);
      setIsModalOpen(true);
      if (onClose) onClose();
    },
    onError: (error) => {
      import.meta.env.DEV && console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to create payment"
      );
    },
  });

  const handlePaystackSuccessAction = useCallback(
    (transaction) => {
      const formData = {
        amount: total,
        reference: transaction,
        paymentMethod: selectPayment,
      };
      mutation.mutate({ bookingId, formData, accessToken });
    },
    [total, selectPayment, mutation, bookingId, accessToken]
  );

  const handlePaystackCloseAction = useCallback(() => {
    toast.info("Ended Paystack session");
    // Reset Paystack component when user closes
    if (onClose) onClose();
  }, [onClose]);

  useEffect(() => {
    // Prevent opening multiple times
    if (hasOpenedRef.current) return;

    // Initialize Paystack instance once
    if (!paystackInstanceRef.current) {
      paystackInstanceRef.current = new PaystackPop();
    }

    // Configure and open Paystack checkout
    const config = {
      email: user?.email,
      amount: total * 100, // Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      onSuccess: (transaction) =>
        handlePaystackSuccessAction(transaction?.reference),
      onCancel: handlePaystackCloseAction,
      onError: () => {
        toast.error("Something went wrong");
        if (onClose) onClose();
      },
    };

    // Only open checkout if we have valid data
    if (user?.email && total > 0) {
      hasOpenedRef.current = true;
      paystackInstanceRef.current.checkout(config);
    }

    // Cleanup: reset flag when component unmounts
    return () => {
      hasOpenedRef.current = false;
    };
  }, [
    user?.email,
    total,
    handlePaystackSuccessAction,
    handlePaystackCloseAction,
    onClose,
  ]);

  return null;
}
