import { useQuery } from "@tanstack/react-query";
import { getOrdersRevenue } from "@/api/admin";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams } from "react-router";
import { dashboardCards } from "@/utils/constants";
import { DashboardCardSkeleton } from "@/components/Skeleton";
import DashboardCard from "@/components/DashboardCard";
import usePaginate from "@/hooks/usePaginate";
import Table from "./Table";
import Paginate from "@/components/Paginate";
import Filter from "./Filter";

export default function Revenue() {
  const { accessToken } = useAuth();
  const [searchParams] = useSearchParams();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["getOrdersRevenue", searchParams.toString()],
    queryFn: () => getOrdersRevenue(searchParams, accessToken),
  });
  const {
    isPaidTotal,
    totalRevenue,
    getPayDelivery,
    getPayPaystack,
    getPayments,
    pagination,
  } = data?.data?.data || {};

  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: pagination?.totalPages || 1,
    hasMore: pagination?.hasMore || false,
    currentPage: pagination?.currentPage || 1,
  });
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-xl font-bold mb-10">Revenues</h1>
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
              total={isPaidTotal}
              color={dashboardCards[0].color}
              image={dashboardCards[1].image}
              text={"Paid Orders"}
              id={dashboardCards[0].id}
            />
            <DashboardCard
              total={totalRevenue}
              color={dashboardCards[1].color}
              image={dashboardCards[1].image}
              text={"Total Revenue"}
              id={dashboardCards[1].id}
            />
            <DashboardCard
              total={getPayDelivery}
              color={dashboardCards[2].color}
              image={dashboardCards[1].image}
              text={"Pay on Delivery"}
              id={dashboardCards[1].id}
            />
            <DashboardCard
              total={getPayPaystack}
              color={dashboardCards[3].color}
              image={dashboardCards[1].image}
              text={"Pay with Paystack"}
              id={dashboardCards[1].id}
            />
          </div>
          <>
            <div className="my-10 flex justify-between items-center">
              <h1 className="text-lg font-bold">Recent Activites</h1>
              <Filter />
            </div>
            <Table payments={getPayments} />
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
