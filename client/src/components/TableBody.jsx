
export default function TableBody({ tableColumns, tableData, renderCell }) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead className="bg-base-100">
          <tr>
            <th>#</th>
            {tableColumns.map((item) => (
              <th className="text-md font-semibold" key={item.uid}>
                {item.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.length > 0 ? (
            <>
              {tableData.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-base-300 border-gray-300"
                >
                  <td>{index + 1}</td>
                  {tableColumns.map((col) => (
                    <td key={col.uid}>
                      {renderCell ? renderCell(item, col.uid) : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          ) : (
            <tr>
              <td
                className="h-24 text-center text-white"
                colSpan={tableColumns.length + 1}
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
