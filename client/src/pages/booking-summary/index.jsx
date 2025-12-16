import { useAuth } from "@/hooks/useAuth";
import { ChevronRight, Loader } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBooking } from "@/api/booking";
import { toast } from "react-toastify";
import { itemsPerCost, ITEM_KEYS } from "@/utils/constants";

export default function BookingSummary() {
  const { bookingForm, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  
  const items = {
    shirt: bookingForm?.shirt,
    trouser: bookingForm?.trouser,
    native: bookingForm?.native,
    senator: bookingForm?.senator,
    duvet: bookingForm?.duvet,
    specialItem: bookingForm?.specialItem,
  };

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (res) => {
      toast.success(res.data.message || "Booking placed successfully");
      queryClient.invalidateQueries({ queryKey: ["userBookings"] });
      navigate(`/book-laundry/payment-options/${res.data.data._id}`);
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

  const placeOrder = async () => {
    mutation.mutate({ formData: bookingForm, accessToken });
  };

  return (
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
            Book Summary
          </h1>
        </div>
        <div className="my-10 max-w-[700px] mx-auto text-white text-start">
          <h1 className="text-xl font-semibold">
            Service & Pick-Up Information
          </h1>
          <div className="my-4 w-full">
            <div className="bg-laundryDark p-4 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <p>Service</p>
                <h1 className="text-base sm:text-lg">
                  {bookingForm?.serviceType}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Address</p>
                <h1 className="text-base sm:text-lg">
                  {bookingForm?.pickUpAddress}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Phone Number</p>
                <h1 className="text-base sm:text-lg">
                  {bookingForm?.pickUpPhone}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Pick-Up Date</p>
                <h1 className="text-base sm:text-lg">
                  {bookingForm?.date &&
                    new Date(bookingForm.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Pick-Up Time</p>
                <h1 className="text-base sm:text-lg">{bookingForm?.time}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="my-10 max-w-[700px] mx-auto text-white text-start">
          <h1 className="text-xl font-semibold">Delivery Information</h1>
          <div className="my-4 w-full space-y-6">
            <div className="bg-laundryDark p-4 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <p>Address</p>
                <h1 className="text-base sm:text-lg">
                  {bookingForm?.deliveryAddress}
                </h1>
              </div>
              <div className="flex justify-between items-center">
                <p>Phone Number</p>
                <h1 className="text-base sm:text-lg">
                  {bookingForm?.pickUpPhone}
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 max-w-[700px] mx-auto text-white text-start">
          <h1 className="text-xl font-semibold">Item Information</h1>
          <div className="my-4 w-full space-y-6">
            <div className="bg-laundryDark p-4 rounded-xl space-y-4">
              {ITEM_KEYS.map((key) => {
                const quantity = items[key];
                if (!quantity || Number(quantity) < 1) return null;

                const label =
                  key === "specialItem"
                    ? "Special Item"
                    : key.charAt(0).toUpperCase() + key.slice(1);

                const pricePerItem = itemsPerCost[key];

                return (
                  <div
                    key={key}
                    className="flex justify-between items-center"
                  >
                    <p>
                      {label} (&#x20A6;
                      {pricePerItem} per item)
                    </p>
                    <h1 className="text-base sm:text-lg">{quantity}</h1>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="max-w-[700px] mx-auto text-black text-start">
          <h1 className="text-xl font-semibold">Pricing</h1>
          <div className="bg-white p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <p>Total Price</p>
              <h1 className="text-base sm:text-lg font-semibold">
                &#x20A6; {bookingForm?.total || 0}
              </h1>
            </div>
          </div>
        </div>
        <div className="max-w-[700px] mx-auto my-10 grid md:grid-cols-2 gap-4 md:gap-6">
          <button
            type="submit"
            className="btn btn-lg bg-transparent text-white w-full rounded-full border border-white"
            onClick={() => navigate("/book-laundry")}
          >
            Edit
          </button>
          <button
            type="submit"
            className="btn btn-lg bg-indigoLight text-white w-full rounded-full border-0"
            onClick={placeOrder}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader className="animate-spin mr-2" /> Confirm Booking
              </>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
