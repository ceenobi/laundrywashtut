import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export function PublicRoute({ children, accessToken }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  useEffect(() => {
    if (accessToken) {
      navigate(from, {
        state: { from: location },
        replace: true,
      });
    }
  }, [accessToken, from, location, navigate]);

  return children;
}

export function PrivateRoute({ children, accessToken }) {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/login";
  useEffect(() => {
    if (!accessToken) {
      navigate(from, {
        state: { from: location },
        replace: true,
      });
    }
  }, [accessToken, from, location, navigate]);

  return children;
}
