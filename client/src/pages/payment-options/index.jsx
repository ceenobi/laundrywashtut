import { useAuth } from "@/hooks/useAuth";
import { payOptions } from "@/utils/constants";
import { ChevronRight, Loader } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPayment } from "@/api/payment";
import { toast } from "react-toastify";
import Paystack from "@/components/Paystack";
import Modal from "@/components/Modal";
import { safeRemoveItem } from "@/utils/storage";

export default function PaymentOptions() {
  const [selectPayment, setSelectPayment] = useState("Pay on Delivery");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPaystack, setShowPaystack] = useState(false);
  const { accessToken, bookingForm, setBookingForm } = useAuth();
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const path = location.pathname.split("/")[2];

  const mutation = useMutation({
    mutationFn: createPayment,
    onSuccess: (res) => {
      toast.success(res.data.message || "Payment successful");
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      safeRemoveItem("laundryBookingForm");
      setBookingForm(null);
      setIsModalOpen(true);
    },
    onError: (error) => {
      import.meta.env.DEV && console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          "Failed to place booking"
      );
    },
  });

  const makePayment = async () => {
    if (selectPayment === "Pay on Delivery") {
      const formData = {
        amount: bookingForm?.total,
        reference: new Date().getTime().toString(),
        paymentMethod: selectPayment,
      };
      mutation.mutate({ bookingId, formData, accessToken });
    } else {
      setShowPaystack(true);
    }
  };

  return (
    <>
      <div className="space-y-20 py-10">
        <div className="container mx-auto pt-20 lg:pt-24 pb-4 text-white space-y-4 px-4">
          <div className="flex gap-3 items-center">
            <h1
              className="text-lg lg:text-3xl font-semibold cursor-pointer"
              onClick={() => navigate(-1)}
            >
              Book Laundry
            </h1>
            <ChevronRight />
            <h1
              className={`text-lg lg:text-3xl font-semibold ${
                path ? "text-indigoLight" : ""
              }`}
            >
              Payment Options
            </h1>
          </div>
          <div className="my-10 max-w-[500px] mx-auto text-white text-start">
            <h1 className="my-4 text-xl font-semibold">
              Select Payment Options
            </h1>
            {payOptions.map((item) => (
              <div
                key={item.id}
                className="px-4 py-6 bg-laundryDark rounded-xl flex justify-between items-center mb-6"
              >
                <div className="flex items-center gap-2">
                  <item.icon />
                  <p>{item.label}</p>
                </div>
                <input
                  type="radio"
                  name="radio-1"
                  className="radio"
                  checked={selectPayment === item.label}
                  value={item.label}
                  onChange={(e) => setSelectPayment(e.target.value)}
                />
              </div>
            ))}
            <div className="max-w-[700px] mx-auto my-10 grid md:grid-cols-2 gap-4 md:gap-6">
              <button
                className="btn btn-lg bg-transparent text-white w-full rounded-full border border-white"
                onClick={() => navigate("/book-laundry")}
              >
                Cancel
              </button>
              <button
                className="btn btn-lg bg-indigoLight text-white w-full rounded-full border-0"
                onClick={makePayment}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Loader className="animate-spin mr-2" /> Proceed
                  </>
                ) : (
                  "Proceed"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPaystack && (
        <Paystack
          bookingId={bookingId}
          total={bookingForm?.total}
          setIsModalOpen={setIsModalOpen}
          onClose={() => setShowPaystack(false)}
          selectPayment={selectPayment}
        />
      )}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          id="createPaymentModal"
          classname="bg-laundryDark p-4 rounded-xl shadow-lg w-[90%] max-w-[400px] mx-auto"
          showClose
          onClose={() => setIsModalOpen(false)}
        >
          <div className="my-6 flex flex-col justify-center items-center px-4">
            <img src="/Group.png" alt="success" className="w-[100px]" />
            <div className="mt-4 text-center">
              <h1 className="text-2xl">
                {selectPayment === "Pay on Delivery"
                  ? "Your payment has been scheduled"
                  : "Your pick-up payment has been made successfully!"}
              </h1>
              <p className="text-sm">
                You will be notified once dispatch is on its way
              </p>
              <div className="mt-6 grid grid-cols-1 gap-2 md:gap-4">
                <button
                  className="btn btn-lg bg-transparent text-white w-full rounded-full border border-white"
                  onClick={() => navigate("/profile/orders?status=in-progress")}
                >
                  View orders
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="btn btn-lg bg-indigoLight text-white w-full rounded-full border-0"
                >
                  Back to home
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
