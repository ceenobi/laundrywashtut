import axiosClient from "@/utils/axiosClient";

export const registerUser = async (formData) => {
  return await axiosClient.post("/user/create", formData);
};
export const loginUser = async (formData) => {
  return await axiosClient.post("/user/login", formData);
};

export const getAuthUser = async (accessToken) => {
  return await axiosClient.get("/user/get", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const refreshAccessToken = async () => {
  return await axiosClient.post(
    "/user/refresh-token",
    {},
    {
      withCredentials: true, //ensure cookies is sent along with request
    }
  );
};

export const forgotPassword = async (formData) => {
  return await axiosClient.post("/user/forgot-password", formData);
};

export const resetPassword = async (formData) => {
  return await axiosClient.patch(
    `/user/reset-password?userId=${formData.userId}&token=${formData.token}`,
    formData
  );
};

export const logoutUser = async (accessToken) => {
  return await axiosClient.post(
    "/user/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    {
      withCredentials: true,
    }
  );
};

export const resendVerifyToken = async (accessToken) => {
  return await axiosClient.post(
    "/user/resend-token",
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
export const verifyToken = async ({ userId, verifyTokenLink, accessToken }) => {
  return await axiosClient.patch(
    `/user/verify/${userId}/${verifyTokenLink}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
export const updateProfile = async ({ formData, accessToken }) => {
  return await axiosClient.patch(`/user/update-user`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const uploadAvatar = async ({ formData, accessToken }) => {
  return await axiosClient.patch(`/user/upload-avatar`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
