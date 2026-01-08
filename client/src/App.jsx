import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./store/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { detectCookiesBlocked } from "./utils/cookieCheck";
import CookieBanner from "./components/CookieBanner";

const queryClient = new QueryClient();

function App() {
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  useEffect(() => {
    const checkCookies = () => {
      const blocked = detectCookiesBlocked();
      setShowCookieBanner(blocked);
    };
    // Check immediately
    checkCookies();
    // Check periodically (every 30 seconds) in case user enables cookies
    const interval = setInterval(checkCookies, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {showCookieBanner && (
        <CookieBanner onDismiss={() => setShowCookieBanner(false)} />
      )}
      {showCookieBanner && <div className="h-20" />}
      <ToastContainer position="bottom-center" />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
