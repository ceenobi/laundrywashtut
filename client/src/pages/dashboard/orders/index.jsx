import { getAllOrders } from "@/api/admin";
import DashboardCard from "@/components/DashboardCard";
import Paginate from "@/components/Paginate";
import { useAuth } from "@/hooks/useAuth";
import usePaginate from "@/hooks/usePaginate";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import Table from "./Table";
import { DashboardCardSkeleton } from "@/components/Skeleton";
import { dashboardCards } from "@/utils/constants";
import Filter from "./Filter";

export default function Orders() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["getAllOrders", searchParams.toString()],
    queryFn: () => getAllOrders(searchParams, accessToken),
  });
  const {
    activeOrders,
    inProgressOrders,
    completedOrders,
    canceledOrders,
    orders,
    pagination,
  } = data?.data?.data || {};
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: pagination?.totalPages || 1,
    hasMore: pagination?.hasMore || false,
    currentPage: pagination?.currentPage || 1,
  });
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-10">Orders</h1>
      {isPending ? (
        <DashboardCardSkeleton />
      ) : isError ? (
        <div role="alert" className="alert alert-error alert-soft">
          <span>
            Error!{" "}
            {error?.response?.data?.message ||
              error?.response?.data ||
              "Failed to fetch data"}
          </span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              total={activeOrders}
              color={dashboardCards[0].color}
              image={dashboardCards[0].image}
              text={"Active"}
              id={dashboardCards[0].id}
            />
            <DashboardCard
              total={inProgressOrders}
              color={dashboardCards[1].color}
              image={dashboardCards[0].image}
              text={"InProgress"}
              id={dashboardCards[1].id}
            />
            <DashboardCard
              total={completedOrders}
              color={dashboardCards[2].color}
              image={dashboardCards[0].image}
              text={"Completed"}
              id={dashboardCards[1].id}
            />
            <DashboardCard
              total={canceledOrders}
              color={dashboardCards[3].color}
              image={dashboardCards[0].image}
              text={"Canceled"}
              id={dashboardCards[1].id}
            />
          </div>
          <>
            <div className="my-10 flex justify-between items-center">
              <h1 className="text-lg font-bold">Recent Activites</h1>
              <Filter />
            </div>
            <Table orders={orders} />
            <Paginate
              totalPages={totalPages}
              hasMore={hasMore}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              totalItems={pagination?.total}
            />
          </>
        </>
      )}
    </div>
  );
}
