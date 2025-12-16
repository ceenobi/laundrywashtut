import { ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Paginate({
  currentPage,
  totalPages,
  hasMore,
  handlePageChange,
}) {
  return (
    <div className="flex justify-center md:justify-between items-center py-4">
      <p className="hidden md:block">
        {currentPage} of {totalPages} pages
      </p>
      <div className="join rounded-lg">
        <button
          className={`join-item btn ${
            currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange("first")}
        >
          <ChevronsLeft />
        </button>
        <button
          className={`join-item btn ${
            currentPage === 1
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
          disabled={currentPage === 1}
          onClick={() => handlePageChange("prev")}
        >
          prev
        </button>
        <button className="join-item btn bg-indigoLightn text-white">
          {currentPage}
        </button>
        <button
          className={`join-item btn ${
            !hasMore ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          disabled={!hasMore}
          onClick={() => handlePageChange("next")}
        >
          next
        </button>
        <button
          className={`join-item btn ${
            !hasMore ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          disabled={!hasMore}
          onClick={() => handlePageChange("last")}
        >
          <ChevronsRight />
        </button>
      </div>
    </div>
  );
}
