import { AuthContext } from "@/hooks/useAuth";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { getAuthUser, logoutUser, refreshAccessToken } from "@/api/auth";
import { useCallback, useState, useEffect } from "react";
import LazySpinner from "@/components/LazySpinner";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("laundryBookingToken") || null;
  });
  const [user, setUser] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [bookingForm, setBookingForm] = useState(() => {
    const persistedState = localStorage.getItem("laundryBookingForm");
    return persistedState ? JSON.parse(persistedState) : null;
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.setItem("laundryBookingToken", accessToken);
  }, [accessToken]);

  const refreshTokenAction = useCallback(async () => {
    try {
      const res = await refreshAccessToken();
      if (res?.status === 200 && res.data?.data) {
        setAccessToken(res.data.data);
        return res.data.data;
      }
      setAccessToken(null);
      setUser(null);
      return null;
    } catch (error) {
      import.meta.env.DEV && console.error("Error refreshing token:", error);
      setAccessToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let needsRefresh = false;
    try {
      const decodedToken = jwtDecode(accessToken);
      const expirationTime = decodedToken?.exp ?? 0;
      const currentTime = Date.now();
      const refreshBuffer = 2 * 60 * 1000;
      const msUntilExpiry = expirationTime * 1000 - currentTime;
      if (msUntilExpiry <= refreshBuffer) {
        needsRefresh = true;
      }
    } catch {
      needsRefresh = true;
    }

    if (needsRefresh) {
      refreshTokenAction();
      return;
    }

    // If token is valid & not expiring soon, fetch user
    setIsAuthenticating(true);
    async function fetchUser() {
      try {
        const res = await getAuthUser(accessToken);
        if (res.status === 200) {
          setUser(res.data.data);
        }
      } catch (error) {
        console.error(error);
        await refreshTokenAction();
      } finally {
        setIsAuthenticating(false);
      }
    }

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Logout successful");
      queryClient.clear();
      setAccessToken(null);
      setUser(null);
    },
    onError: (err) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  const handleLogout = async () => mutation.mutate(accessToken);

  if (isAuthenticating) {
    return <LazySpinner />;
  }

  const contextValue = {
    accessToken,
    user,
    setAccessToken,
    setUser,
    bookingForm,
    setBookingForm,
    handleLogout,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
