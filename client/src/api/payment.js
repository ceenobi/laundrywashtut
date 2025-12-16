import axiosClient from "@/utils/axiosClient";

export const createPayment = async ({ bookingId, formData, accessToken }) => {
  return await axiosClient.post(`/payment/create/${bookingId}`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getPayments = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") || "pending";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  params.append("status", status);
  return await axiosClient.get(`/payment/get?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
