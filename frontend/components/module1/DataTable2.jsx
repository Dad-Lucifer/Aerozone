import React, { useState } from "react";

// FileChartColumn component included directly
const FileChartColumn = ({ 
  width = 28, 
  height = 28, 
  strokeWidth = 2, 
  stroke = "#ffffff", 
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"
          style={{
            strokeDasharray: isHovered ? "100" : "0",
            strokeDashoffset: "0",
            transition: "stroke-dasharray 0.3s ease, opacity 0.15s ease",
            opacity: isHovered ? 1 : 0.7
          }}
        />
        <path
          d="M14 2v4a2 2 0 0 0 2 2h4"
          style={{
            strokeDasharray: isHovered ? "100" : "0",
            strokeDashoffset: "0",
            transition: "stroke-dasharray 0.3s ease, opacity 0.15s ease",
            transitionDelay: isHovered ? "0.1s" : "0s",
            opacity: isHovered ? 1 : 0.7
          }}
        />
        <path
          d="M8 18v-1"
          style={{
            strokeDasharray: isHovered ? "100" : "0",
            strokeDashoffset: "0",
            transition: "stroke-dasharray 0.3s ease, opacity 0.15s ease",
            transitionDelay: isHovered ? "0.2s" : "0s",
            opacity: isHovered ? 1 : 0.7
          }}
        />
        <path
          d="M12 18v-6"
          style={{
            strokeDasharray: isHovered ? "100" : "0",
            strokeDashoffset: "0",
            transition: "stroke-dasharray 0.3s ease, opacity 0.15s ease",
            transitionDelay: isHovered ? "0.3s" : "0s",
            opacity: isHovered ? 1 : 0.7
          }}
        />
        <path
          d="M16 18v-3"
          style={{
            strokeDasharray: isHovered ? "100" : "0",
            strokeDashoffset: "0",
            transition: "stroke-dasharray 0.3s ease, opacity 0.15s ease",
            transitionDelay: isHovered ? "0.4s" : "0s",
            opacity: isHovered ? 1 : 0.7
          }}
        />
      </svg>
    </div>
  );
};

export default function DataTable2({ rows }) {
  // ✅ Column definitions (keys = your row object fields)
  const columns = [
    { key: "ReferenceB", label: "Reference B" },
    { key: "ProjectCode", label: "Project Code" },
    { key: "ItemCode", label: "Item Code" },
    { key: "ItemShortDescription", label: "Description" },
    { key: "SupplierName", label: "Supplier Name" },
    { key: "PONo", label: "PO No." },
    { key: "OrderedLineQuantity", label: "Ordered Qty" },
    { key: "UOM", label: "UOM" },
    { key: "Delivery", label: "Delivery" },
    { key: "InventoryQuantity", label: "Inventory Qty" },
    { key: "InventoryUOM", label: "Inventory UMO" },
    { key: "IndentQuantity", label: "Indent Qty" },
    { key: "IndentUOM", label: "Indent UMO" },
    { key: "IndentPlannedOrder", label: "Indent Planned Order" },
  ];

  // State for managing column visibility - First 8 columns visible by default
  const [visibleColumns, setVisibleColumns] = useState(
    Array(columns.length).fill(false).map((_, index) => index < 8)
  );
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // ✅ Remove empty rows (preserving original logic)
  const filteredRows = rows.filter((row) => {
    return Object.entries(row).some(([key, value]) => {
      if (value === null || value === undefined) return false;
      const str = String(value).trim();
      return str !== "" && str !== "0" && str.toUpperCase() !== "NA";
    });
  });

  // ✅ Copy table to clipboard (preserving original logic)
  const copyTable = () => {
    if (!filteredRows.length) return;
    const headers = columns.map((col) => col.label);
    let text = headers.join("\t") + "\n";
    filteredRows.forEach((row) => {
      text += columns.map((col) => row[col.key] ?? "").join("\t") + "\n";
    });
    navigator.clipboard
      .writeText(text)
      .then(() => alert("✅ Table copied to clipboard!"))
      .catch(() => alert("❌ Failed to copy"));
  };

  // Toggle column visibility
  const toggleColumn = (index) => {
    const newVisibleColumns = [...visibleColumns];
    newVisibleColumns[index] = !newVisibleColumns[index];
    setVisibleColumns(newVisibleColumns);
  };

  // Get visible column count
  const visibleColumnCount = visibleColumns.filter(Boolean).length;

  return (
    <div className="p-3 text-xs rounded-xl mx-auto">
      {/* Header + Buttons */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-[var(--foreground)] flex items-center">
          <span className="h-5 w-1 bg-[var(--primary)] mr-2"></span>
          DATA TABLE
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setShowColumnSelector(!showColumnSelector)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white py-2 px-2 rounded-lg text-sm flex items-center shadow-md h-10 w-13 transition"
          >
            <FileChartColumn 
              width={20} 
              height={20} 
              stroke="#ffffff" 
            />
          </button>
        </div>
      </div>

      {/* Column Selector */}
      {showColumnSelector && (
        <div className="mb-4 p-3 bg-[var(--muted)] border border-[var(--border)] rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Select Columns to Display
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setVisibleColumns(Array(columns.length).fill(true))}
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
              >
                Select All
              </button>
              <button
                onClick={() => setVisibleColumns(Array(columns.length).fill(false))}
                className="text-xs bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded"
              >
                Deselect All
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {columns.map((column, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`column-${index}`}
                  checked={visibleColumns[index]}
                  onChange={() => toggleColumn(index)}
                  className="mr-2"
                />
                <label
                  htmlFor={`column-${index}`}
                  className="text-xs text-[var(--foreground)]"
                >
                  {column.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-y-auto max-h-96">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((col, index) => {
                if (!visibleColumns[index]) return null;
                return (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumnCount}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-500 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-sm font-medium">NO DATA AVAILABLE</p>
                    <p className="text-xs mt-1">Try adjusting your filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRows.map((row, index) => (
                <tr
                  key={row.id || index}
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}
                >
                  {columns.map((col, colIndex) => {
                    if (!visibleColumns[colIndex]) return null;
                    return (
                      <td
                        key={colIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                      >
                        {row[col.key] ?? ""}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}