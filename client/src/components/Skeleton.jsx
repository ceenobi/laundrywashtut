export function SkeletonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
            <th>
              <div className="skeleton h-4 w-20"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 4 }).map((_, index) => (
            <tr key={index}>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
              <td>
                <div className="skeleton h-4 w-20"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DashboardCardSkeleton({ color = "bg-base-200" }) {
  return (
    <>
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className={`rounded-lg p-6 ${color} space-y-4`} key={index}>
            <div className="flex gap-2 items-center">
              <div className="skeleton size-12 rounded"></div>
              <div className="skeleton h-6 w-full"></div>
            </div>
            <div className="skeleton h-9 w-full"></div>
          </div>
        ))}
      </div>
      <SkeletonTable />
    </>
  );
}
