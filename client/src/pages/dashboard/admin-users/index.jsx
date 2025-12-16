import { getAllUsers } from "@/api/admin";
import DashboardCard from "@/components/DashboardCard";
import Paginate from "@/components/Paginate";
import { useAuth } from "@/hooks/useAuth";
import usePaginate from "@/hooks/usePaginate";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import Table from "./Table";
import { DashboardCardSkeleton } from "@/components/Skeleton";
import { dashboardCards } from "@/utils/constants";

export default function AdminUsers() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["getAllUsers", searchParams.toString()],
    queryFn: () => getAllUsers(searchParams, accessToken),
  });
  const { users, totalUsers, recentUsers, pagination } = data?.data?.data || {};
  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: pagination?.totalPages || 1,
    hasMore: pagination?.hasMore || false,
    currentPage: pagination?.currentPage || 1,
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-10">Users</h1>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DashboardCard
              total={totalUsers}
              color={dashboardCards[0].color}
              image={dashboardCards[2].image}
              text={"Total Users"}
              id={dashboardCards[0].id}
            />
            <DashboardCard
              total={recentUsers}
              color={dashboardCards[1].color}
              image={dashboardCards[2].image}
              text={"Recent Users"}
              id={dashboardCards[1].id}
            />
          </div>
          <div className="my-10">
            <Table users={users} />
            <Paginate
              totalPages={totalPages}
              hasMore={hasMore}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              totalItems={pagination?.total}
            />
          </div>
        </>
      )}
    </div>
  );
}
