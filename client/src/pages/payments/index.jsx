import { getPayments } from "@/api/payment";
import { SkeletonTable } from "@/components/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import usePaginate from "@/hooks/usePaginate";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router";
import Table from "./Table";
import Paginate from "@/components/Paginate";

export default function Payments() {
  const tabs = ["Pending", "Confirmed", "Canceled"];
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = (searchParams.get("status") || "pending").toLowerCase();
  const initialTab =
    tabs.find((tab) => tab.toLowerCase() === statusParam) || "Pending";
  const [activeTab, setActiveTab] = useState(initialTab);
  const { accessToken } = useAuth();
  const { isPending, isError, error, data } = useQuery({
    queryKey: ["userPayments", searchParams.toString()],
    queryFn: () => getPayments(searchParams, accessToken),
  });
  const { payments, pagination } = data?.data?.data || {};

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
            {activeTab === "Pending" && <Table filterPayments={payments} />}
            {activeTab === "Confirmed" && <Table filterPayments={payments} />}
            {activeTab === "Canceled" && <Table filterPayments={payments} />}
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
