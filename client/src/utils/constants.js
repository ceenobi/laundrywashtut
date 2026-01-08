import {
  Banknote,
  CircleUser,
  CreditCard,
  LayoutDashboard,
  NotepadText,
  ShoppingCart,
  Truck,
  Users,
} from "lucide-react";

export const serviceTypeData = [
  "Wash and fold",
  "Dry cleaning",
  "Ironing and pressing",
];
export const pickUpTimeData = ["10:00 AM", "12:00 PM", "2:00 PM"];

export const itemQty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const itemsPerCost = {
  shirt: 900,
  trouser: 700,
  senator: 1200,
  native: 900,
  duvet: 1500,
  specialItem: 2000,
};

export const ITEM_KEYS = [
  "shirt",
  "trouser",
  "native",
  "senator",
  "duvet",
  "specialItem",
];

export const payOptions = [
  {
    id: 1,
    label: "Pay with Paystack",
    icon: CreditCard,
  },
  {
    id: 2,
    label: "Pay on Delivery",
    icon: Banknote,
  },
];

export const profileLinks = [
  {
    id: 1,
    label: "Personal Information",
    icon: CircleUser,
    path: "/profile",
  },
  {
    id: 2,
    label: "Orders",
    icon: NotepadText,
    path: "/profile/orders",
  },
  {
    id: 3,
    label: "Payments",
    icon: Banknote,
    path: "/profile/payments",
  },
];

export const userBookingOrdersColumn = [
  { name: "ORDER ID", uid: "orderId" },
  { name: "SERVICE", uid: "service" },
  { name: "PICKUP DATE", uid: "pickUpDate" },
  { name: "STATUS", uid: "status" },
  { name: "TOTAL", uid: "total" },
];

export const userPaymentOrdersColumn = [
  { name: "REFERENCE", uid: "reference" },
  { name: "SERVICE", uid: "service" },
  { name: "PAYMENT METHOD", uid: "paymentMethod" },
  { name: "PAID AT", uid: "paidAt" },
  { name: "AMOUNT", uid: "amount" },
];

export const orderStatusColors = {
  active: "bg-yellow-200 text-yellow-700",
  "in-progress": "bg-blue-200 text-blue-700",
  completed: "bg-green-200 text-green-700",
  canceled: "bg-red-200 text-red-700",
};

export const paymentStatusColors = {
  pending: "bg-yellow-200 text-yellow-700",
  confirmed: "bg-green-200 text-green-700",
  canceled: "bg-red-200 text-red-700",
};

export const adminLinks = [
  {
    id: 1,
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    label: "Orders",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    id: 3,
    label: "Revenue",
    path: "/admin/revenue",
    icon: Banknote,
  },
  {
    id: 4,
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    id: 5,
    label: "Deliveries",
    path: "/admin/deliveries",
    icon: Truck,
  },
];

export const dashboardCards = [
  {
    id: 1,
    image: "/cart.png",
    color: "bg-[#897527]",
  },
  {
    id: 2,
    image: "/cash.png",
    color: "bg-[#7C4191]",
  },
  {
    id: 3,
    image: "/user.png",
    color: "bg-[#43868A]",
  },
  {
    id: 4,
    image: "/user.png",
    color: "bg-red-500",
  },
];

export const formatCurrency = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const adminActivitiesColumn = [
  { name: "ACTIVITY", uid: "activity" },
  { name: "SERVICE", uid: "service" },
  { name: "DATE", uid: "createdAt" },
  { name: "PAID", uid: "paidAt" },
  { name: "STATUS", uid: "status" },
  { name: "AMOUNT", uid: "amount" },
  // { name: "ACTION", uid: "action" },
];

export const adminUsersColumn = [
  { name: "NAME", uid: "fullname" },
  { name: "EMAIL", uid: "email" },
  { name: "PHONE", uid: "phone" },
  { name: "ACTION", uid: "action" },
];

export const adminOrdersColumn = [
  { name: "CLIENT", uid: "client" },
  { name: "SERVICE", uid: "service" },
  { name: "DATE", uid: "createdAt" },
  { name: "PAID", uid: "isPaid" },
  { name: "STATUS", uid: "status" },
  { name: "AMOUNT", uid: "amount" },
  { name: "DELIVERY", uid: "isDelivered" },
  { name: "ACTION", uid: "action" },
];

export const revenueOrdersColumn = [
  { name: "REFERENCE", uid: "reference" },
  { name: "CLIENT", uid: "client" },
  { name: "AMOUNT", uid: "amount" },
  { name: "STATUS", uid: "status" },
  { name: "PAYMENT METHOD", uid: "paymentMethod" },
  { name: "PAID AT", uid: "paidAt" },
];
