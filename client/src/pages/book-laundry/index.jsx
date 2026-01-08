import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateBookingSchema } from "@/utils/formValidate";
import { useForm, useWatch } from "react-hook-form";
import {
  itemQty,
  pickUpTimeData,
  serviceTypeData,
  itemsPerCost,
  ITEM_KEYS
} from "@/utils/constants";
import SelectField from "@/components/SelectField";
import FormField from "@/components/FormField";
import { toast } from "react-toastify";
import { useNavigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { safeRemoveItem, safeSetItem } from "@/utils/storage";

export default function BookLaundry() {
  const { bookingForm, setBookingForm } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(validateBookingSchema),
    defaultValues: {
      serviceType: bookingForm?.serviceType || "",
      pickUpAddress: bookingForm?.pickUpAddress || "",
      pickUpPhone: bookingForm?.pickUpPhone || "",
      date: bookingForm?.date || "",
      time: bookingForm?.time || "",
      deliveryAddress: bookingForm?.deliveryAddress || "",
      deliveryPhone: bookingForm?.deliveryPhone || "",
      shirt: bookingForm?.shirt || "",
      trouser: bookingForm?.trouser || "",
      senator: bookingForm?.senator || "",
      native: bookingForm?.native || "",
      duvet: bookingForm?.duvet || "",
      specialItem: bookingForm?.specialItem || "",
      total: bookingForm?.total || "",
    },
  });

  const watchedItems = useWatch({
    control,
    name: ITEM_KEYS,
  });

  useEffect(() => {
    const total = ITEM_KEYS.reduce((sum, key, index) => {
      const qty = Number(watchedItems?.[index]) || 0;
      const unitPrice = itemsPerCost[key] || 0;
      return sum + qty * unitPrice;
    }, 0);
    setValue("total", total, { shouldValidate: true });
  }, [watchedItems, setValue]);

  const cancelForm = () => {
    setBookingForm(null);
    safeRemoveItem("laundryBookingForm");
    reset();
  };

  const onSubmit = async (data) => {
    if (
      !data.pickUpPhone.startsWith("+234") ||
      !data.deliveryPhone.startsWith("+234")
    ) {
      toast.warning(
        "Ensure Pick up and delivery phone begins with intl format"
      );
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(data.date);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      toast.warning("Pick up date cannot be in the past");
      return;
    }
    const items = {
      shirt: data.shirt,
      trouser: data.trouser,
      native: data.native,
      senator: data.senator,
      duvet: data.duvet,
      specialItem: data.specialItem,
    };
    const hasAtLeastOneItem = Object.values(items).some(
      (value) => value !== undefined && value !== "" && Number(value) > 0
    );

    if (!hasAtLeastOneItem) {
      toast.warning("Select at least one item quantity to proceed");
      return;
    }
    safeSetItem("laundryBookingForm", JSON.stringify(data));
    setBookingForm(data);
    navigate("/book-laundry/booking-summary");
  };

  return (
    <>
      {path === "/book-laundry" ? (
        <div className="space-y-20 py-10">
          <div className="pt-20 lg:pt-24 pb-4 text-center text-white space-y-4 px-4 sm:px-0">
            <h1 className="text-3xl lg:text-3xl font-semibold">
              Book Laundry Pick-Up
            </h1>
            <div className="p-4 rounded-xl shadow w-full max-w-[700px] mx-auto text-white text-start">
              <form
                className="flex flex-col gap-2 w-full"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="w-full space-y-6">
                  <div className="bg-laundryDark p-4 rounded-xl">
                    <h1>Service Type</h1>
                    <SelectField
                      label=""
                      id="serviceType"
                      register={register}
                      name="serviceType"
                      placeholder="select service type"
                      data={serviceTypeData}
                      errors={errors}
                    />
                  </div>
                  <div className="bg-laundryDark p-4 rounded-xl space-y-4">
                    <h1>Pick-up Information</h1>
                    <FormField
                      label="Address"
                      type="text"
                      placeholder="Enter address"
                      id="address"
                      register={register}
                      errors={errors}
                      name="pickUpAddress"
                    />
                    <FormField
                      label="Phone Number"
                      type="tel"
                      placeholder="+2340000000000"
                      id="phone"
                      register={register}
                      errors={errors}
                      name="pickUpPhone"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        label="PickUp Date"
                        id="pickUpDate"
                        register={register}
                        name="date"
                        placeholder="Date"
                        errors={errors}
                        type="date"
                      />
                      <SelectField
                        label="PickUp Time"
                        id="pickupTime"
                        register={register}
                        name="time"
                        placeholder="Select Time"
                        data={pickUpTimeData}
                        errors={errors}
                      />
                    </div>
                  </div>
                  <div className="bg-laundryDark p-4 rounded-xl space-y-4">
                    <h1>Delivery Information</h1>
                    <FormField
                      label="Address"
                      type="text"
                      placeholder="Enter delivery address"
                      id="fullname"
                      register={register}
                      errors={errors}
                      name="deliveryAddress"
                    />
                    <FormField
                      label="Phone Number"
                      type="tel"
                      placeholder="+2340000000000"
                      id="phone"
                      register={register}
                      errors={errors}
                      name="deliveryPhone"
                    />
                  </div>
                  <div className="bg-laundryDark p-4 rounded-xl space-y-4">
                    <h1>Add Item</h1>
                    <div className="grid md:grid-cols-3 gap-4">
                      <SelectField
                        label="Shirt (900 per item)"
                        id="shirt"
                        register={register}
                        name="shirt"
                        placeholder="select qty"
                        data={itemQty}
                        errors={errors}
                      />
                      <SelectField
                        label="Trouser (700 per item)"
                        id="trouser"
                        register={register}
                        name="trouser"
                        placeholder="select qty"
                        data={itemQty}
                        errors={errors}
                      />
                      <SelectField
                        label="Senator (1200 per item)"
                        id="senator"
                        register={register}
                        name="senator"
                        placeholder="select qty"
                        data={itemQty}
                        errors={errors}
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <SelectField
                        label="Native (900 per item)"
                        id="native"
                        register={register}
                        name="native"
                        placeholder="select qty"
                        data={itemQty}
                        errors={errors}
                      />
                      <SelectField
                        label="Duvet (1500 per item)"
                        id="duvet"
                        register={register}
                        name="duvet"
                        placeholder="select qty"
                        data={itemQty}
                        errors={errors}
                      />
                      <SelectField
                        label="Special Item (2000 per item)"
                        id="specialItem"
                        register={register}
                        name="specialItem"
                        placeholder="select qty"
                        data={itemQty}
                        errors={errors}
                      />
                    </div>
                  </div>
                  <div className="bg-laundryDark p-4 rounded-xl space-y-4">
                    <h1>Pricing</h1>
                    <FormField
                      label="Total Price"
                      type="number"
                      placeholder="&#x20A6; 0.00"
                      id="total"
                      register={register}
                      errors={errors?.total}
                      name="total"
                    />
                  </div>
                </div>
                <div className="mt-4 grid md:grid-cols-2 gap-4 md:gap-6">
                  <button
                    type="submit"
                    className="btn btn-lg bg-transparent text-white w-full rounded-full border border-white"
                    onClick={cancelForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-lg bg-indigoLight text-white w-full rounded-full border-0"
                  >
                    Proceed to summary
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}
