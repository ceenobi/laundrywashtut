import { useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getBookings } from "@/api/booking";
import { SkeletonTable } from "@/components/Skeleton";
import Table from "./Table";
import usePaginate from "@/hooks/usePaginate";
import Paginate from "@/components/Paginate";

export default function Orders() {
  const tabs = ["Active", "In-Progress", "Completed", "Canceled"];
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = (searchParams.get("status") || "active").toLowerCase();
  const initialTab =
    tabs.find((tab) => tab.toLowerCase() === statusParam) || "Active";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { accessToken } = useAuth();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["userBookings", searchParams.toString()],
    queryFn: () => getBookings(searchParams, accessToken),
  });

  const { bookings, pagination } = data?.data?.data || {};

  const { handlePageChange, totalPages, hasMore, currentPage } = usePaginate({
    totalPages: pagination?.totalPages || 1,
    hasMore: pagination?.hasMore || false,
    currentPage: pagination?.currentPage || 1,
  });

  const handleTabSwitch = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ status: tabName.toLowerCase(), page: 1 });
  };

  return (
    <div className="px-4">
      <div role="tablist" className="tabs tabs-bordered">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            className={`tab ${
              activeTab === tab ? "tab-active border-b border-indigoLight" : ""
            }`}
            onClick={() => handleTabSwitch(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {isPending ? (
          <SkeletonTable />
        ) : isError ? (
          <>
            <div role="alert" className="alert alert-error alert-soft">
              <span>
                Error!{" "}
                {error?.response?.data?.message ||
                  error?.response?.data ||
                  "Failed to fetch bookings"}
              </span>
            </div>
          </>
        ) : (
          <>
            {activeTab === "Active" && <Table filterBookings={bookings} />}
            {activeTab === "In-Progress" && <Table filterBookings={bookings} />}
            {activeTab === "Completed" && <Table filterBookings={bookings} />}
            {activeTab === "Canceled" && <Table filterBookings={bookings} />}
            <Paginate
              totalPages={totalPages}
              hasMore={hasMore}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              totalItems={pagination?.total}
            />
          </>
        )}
      </div>
    </div>
  );
}
