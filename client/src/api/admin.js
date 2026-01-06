import axiosClient from "@/utils/axiosClient";

export const dashboardStats = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  params.append("status", status);
  if (query) params.append("query", query);
  if (status) params.append("status", status);
  return await axiosClient.get(`/admin/stats?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllUsers = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  return await axiosClient.get(`/admin/get_users?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getAllOrders = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const time = searchParams.get("time") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (query) params.append("query", query);
  if (status) params.append("status", status);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (time) params.append("time", time);
  return await axiosClient.get(`/admin/get_orders?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateOrderDelivery = async ({ bookingId, accessToken }) => {
  return await axiosClient.patch(
    `/admin/update_delivery_status/${bookingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const updatePaymentStatus = async ({ bookingId, accessToken }) => {
  return await axiosClient.patch(
    `/admin/update_payment_status/${bookingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export const getOrdersRevenue = async (searchParams, accessToken) => {
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const query = searchParams.get("query") || "";
  const status = searchParams.get("status") || "";
  const paymentMethod = searchParams.get("paymentMethod") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  params.append("status", status);
  params.append("paymentMethod", paymentMethod);
  params.append("startDate", startDate);
  params.append("endDate", endDate);
  if (query) params.append("query", query);
  if (status) params.append("status", status);
  if (paymentMethod) params.append("paymentMethod", paymentMethod);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  return await axiosClient.get(`/admin/revenue_stats?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
