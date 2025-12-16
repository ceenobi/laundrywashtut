import LazySpinner from "@/components/LazySpinner";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PrivateRoute, PublicRoute } from "./ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";

const RootLayout = lazy(() => import("@/layouts/RootLayout"));
const AuthLayout = lazy(() => import("@/layouts/AuthLayout"));
const RecoverLayout = lazy(() => import("@/layouts/RecoverLayout"));
const ProfileLayout = lazy(() => import("@/layouts/ProflleLayout"));
const AdminLayout = lazy(() => import("@/layouts/AdminLayout"));

const Register = lazy(() => import("@/pages/register"));
const Login = lazy(() => import("@/pages/login"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const ResetPassword = lazy(() => import("@/pages/reset-password"));
const Home = lazy(() => import("@/pages/home"));
const VerifyEmail = lazy(() => import("@/pages/verify-email/VerifyEmail"));
const CheckVerification = lazy(() => import("@/pages/verify-email"));
const BookLaundry = lazy(() => import("@/pages/book-laundry"));
const BookingSummary = lazy(() => import("@/pages/booking-summary"));
const PaymentOptions = lazy(() => import("@/pages/payment-options"));
const Orders = lazy(() => import("@/pages/orders"));
const Profile = lazy(() => import("@/pages/profile"));
const Payments = lazy(() => import("@/pages/payments"));
const Dashboard = lazy(() => import("@/pages/dashboard/admin"));
const AdminUsers = lazy(() => import("@/pages/dashboard/admin-users"));
const AdminOrders = lazy(() => import("@/pages/dashboard/orders"));
const AdminRevenues = lazy(() => import("@/pages/dashboard/revenue"));

export default function AppRoutes() {
  const { accessToken } = useAuth();
  const routes = [
    {
      path: "/",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <RootLayout />
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazySpinner />}>
              <Home />
            </Suspense>
          ),
        },
        {
          path: "book-laundry",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <PrivateRoute accessToken={accessToken}>
                <BookLaundry />
              </PrivateRoute>
            </Suspense>
          ),
          children: [
            {
              path: "booking-summary",
              element: (
                <Suspense fallback={<LazySpinner />}>
                  <PrivateRoute accessToken={accessToken}>
                    <BookingSummary />
                  </PrivateRoute>
                </Suspense>
              ),
            },
            {
              path: "payment-options/:bookingId",
              element: (
                <Suspense fallback={<LazySpinner />}>
                  <PrivateRoute accessToken={accessToken}>
                    <PaymentOptions />
                  </PrivateRoute>
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "profile",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <PrivateRoute accessToken={accessToken}>
                <ProfileLayout />
              </PrivateRoute>
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: (
                <PrivateRoute accessToken={accessToken}>
                  <Profile />
                </PrivateRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <PrivateRoute accessToken={accessToken}>
                  <Orders />
                </PrivateRoute>
              ),
            },
            {
              path: "payments",
              element: (
                <PrivateRoute accessToken={accessToken}>
                  <Payments />
                </PrivateRoute>
              ),
            },
          ],
        },
      ],
    },
    {
      element: (
        <Suspense fallback={<LazySpinner />}>
          <PublicRoute accessToken={accessToken}>
            <AuthLayout />
          </PublicRoute>
        </Suspense>
      ),
      children: [
        {
          path: "register",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <Register />
            </Suspense>
          ),
        },
        {
          path: "login",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <Login />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "auth",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <PublicRoute accessToken={accessToken}>
            <RecoverLayout />
          </PublicRoute>
        </Suspense>
      ),
      children: [
        {
          path: "forgot-password",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <ForgotPassword />
            </Suspense>
          ),
        },
        {
          path: "reset-password",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <ResetPassword />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "verify-email/:userId/:verifyTokenLink",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <PrivateRoute accessToken={accessToken}>
            <VerifyEmail />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      path: "verify-email",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <PrivateRoute accessToken={accessToken}>
            <CheckVerification />
          </PrivateRoute>
        </Suspense>
      ),
    },
    {
      path: "admin",
      element: (
        <Suspense fallback={<LazySpinner />}>
          <PrivateRoute accessToken={accessToken}>
            <AdminLayout />
          </PrivateRoute>
        </Suspense>
      ),
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<LazySpinner />}>
              <PrivateRoute accessToken={accessToken}>
                <Dashboard />
              </PrivateRoute>
            </Suspense>
          ),
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <PrivateRoute accessToken={accessToken}>
                <AdminUsers />
              </PrivateRoute>
            </Suspense>
          ),
        },
        {
          path: "orders",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <PrivateRoute accessToken={accessToken}>
                <AdminOrders />
              </PrivateRoute>
            </Suspense>
          ),
        },
        {
          path: "revenue",
          element: (
            <Suspense fallback={<LazySpinner />}>
              <PrivateRoute accessToken={accessToken}>
                <AdminRevenues />
              </PrivateRoute>
            </Suspense>
          ),
        },
      ],
    },
  ];
  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}
