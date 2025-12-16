import DashboardCard from "@/components/DashboardCard";
import { dashboardCards } from "@/utils/constants";
import { dashboardStats } from "@/api/admin";
import { DashboardCardSkeleton } from "@/components/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import Table from "./Table";
import usePaginate from "@/hooks/usePaginate";
import Paginate from "@/components/Paginate";
import Filter from "./Filter";

export default function Dashboard() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["dashboardStats", searchParams.toString()],
    queryFn: () => dashboardStats(searchParams, accessToken),
  });
  const {
    ordersCount,
    usersCount,
    paymentsTotal,
    recentActivities,
    pagination,
  } = data?.data?.data || {};

  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: pagination?.totalPages || 1,
    hasMore: pagination?.hasMore || false,
    currentPage: pagination?.page || 1,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-10">Dashboard</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardCard
              total={ordersCount}
              color={dashboardCards[0].color}
              image={dashboardCards[0].image}
              text={"Orders"}
              id={dashboardCards[0].id}
            />
            <DashboardCard
              total={usersCount}
              color={dashboardCards[1].color}
              image={dashboardCards[1].image}
              text={"Users"}
              id={dashboardCards[1].id}
            />
            <DashboardCard
              total={paymentsTotal}
              color={dashboardCards[2].color}
              image={dashboardCards[2].image}
              text={"Revenue"}
              id={dashboardCards[2].id}
            />
          </div>
          <>
            <div className="my-10 flex justify-between items-center">
              <h1 className="text-lg font-bold">Recent Activites</h1>
              <Filter />
            </div>
            <Table recentActivities={recentActivities} />
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
