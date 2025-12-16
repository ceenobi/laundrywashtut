import axiosClient from "@/utils/axiosClient";

export const createBooking = async ({ formData, accessToken }) => {
  return await axiosClient.post("/booking/create", formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getBookings = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") || "active";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  params.append("status", status);
  return await axiosClient.get(`/booking/get?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
