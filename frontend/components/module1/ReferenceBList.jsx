import React, { useMemo } from "react";

export default function ReferenceBList({ rows, selectedRef, onSelectRef }) {
  // Extract unique ReferenceB values from current filtered rows
  const referenceBValues = useMemo(() => {
    const unique = new Set();
    rows.forEach((r) => {
      const ref = String(r.ReferenceB || "").trim();
      if (ref && ref !== "N/A" && ref !== "NA" && ref !== "0") {
        unique.add(ref);
      }
    });
    return [...unique];
  }, [rows]);

  if (referenceBValues.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-500 italic">
        No ReferenceB values found.
      </div>
    );
  }

  return (
    <div className="p-4 bg-[var(--card)] rounded-lg shadow border border-[var(--border)]">
      <h3 className="text-md font-semibold mb-3 text-[var(--foreground)]">
        Reference B List
      </h3>
      <ul className="space-y-1 text-sm">
        {referenceBValues.map((ref, i) => {
          const isActive = selectedRef === ref;
          return (
            <li
              key={i}
              onClick={() => onSelectRef(isActive ? null : ref)}
              className={`px-3 py-1 rounded cursor-pointer transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-50 hover:bg-blue-50 text-[var(--foreground)]"
              }`}
            >
              {ref}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
