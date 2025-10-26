import React, { useEffect, useState } from "react";
import UploadForm from "../components/module1/UploadForm";
import DataTable from "../components/module1/DataTable";
import PieCharts from "../components/module1/PieChart";
import LineChart from "../components/module1/LineChart";
import Filters from "../components/module1/Filter";
import BarChart from "../components/module1/BarChart";
import Navbar2 from "../components/module1/Navbar2"; // Import the Navbar2 component

const DataPage = () => {
  const [rows, setRows] = useState([]);
  const [indentRows, setIndentRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredIndentRows, setFilteredIndentRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    projectCode: "",
    itemCode: "",
    description: "",
  });

  // 🔹 Fetch data ONCE
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("http://localhost:5000/api/data/get-data");
        const excelData = await res1.json();
        setRows(excelData);
        setFilteredRows(excelData);

        const res2 = await fetch("http://localhost:5000/api/data/get-indent");
        const indentData = await res2.json();
        setIndentRows(indentData);
        setFilteredIndentRows(indentData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // 🔹 Filtering Logic
  const applyFilters = () => {
    const { search, projectCode, itemCode, description } = filters;
    // ✅ split multiple search terms by comma or space
    const searchTerms = search
      .split(/[, ]+/) // split by comma or space
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean); // remove empty values

    const filterFn = (row) => {
      let ok = true;
      // ✅ Search across all fields with multiple terms
      if (searchTerms.length > 0) {
        ok =
          ok &&
          searchTerms.some((term) =>
            Object.values(row).some((val) =>
              String(val).toLowerCase().includes(term)
            )
          );
      }
      if (projectCode.trim()) {
        ok =
          ok &&
          (row.ProjectCode === projectCode || row.PROJECT_NO === projectCode);
      }
      if (itemCode.trim()) {
        ok =
          ok && (row.ItemCode === itemCode || row.ITEM_CODE === itemCode);
      }
      if (description.trim()) {
        ok =
          ok &&
          (row.ItemShortDescription ||
            row.ITEM_DESCRIPTION ||
            "").toLowerCase().includes(description.toLowerCase());
      }
      return ok;
    };
    setFilteredRows(rows.filter(filterFn));
    setFilteredIndentRows(indentRows.filter(filterFn));
  };
  console.log("LineChart rows:", indentRows);
  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      {/* Add the Navbar2 component */}
      <Navbar2 />
      
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] py-21 px-6 relative overflow-hidden transition-colors duration-300">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="w-16 h-16 border-4 border-t-transparent border-[var(--primary)] rounded-full animate-spin"></div>
            <span className="ml-4 text-black text-xl">Processing data...</span>
          </div>
        )}

        {/* Layout */}
        <div className="relative z-10 grid grid-cols-12 grid-rows-[auto_auto_auto] gap-4">
          {/* Block 1 */}
          <div className="col-span-12 min-w-fit bg-[var(--card)] p-4 rounded-xl shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <UploadForm setLoading={setLoading} />
            </div>

            <Filters
              filters={filters}
              setFilters={setFilters}
              applyFilters={applyFilters}
              rows={rows}
            />
          </div>

          {/* ✅ Put Blocks 2, 3, 4 in same row */}
          <div className="col-span-12 grid grid-cols-12 gap-2 ">
            {/* Block 4 */}
            {/* bg-[var(--card)] p-4  rounded-xl shadow-md */}
            <div className="col-span-3 max-h-[25vw] flex justify-center bg-[var(--card)]  rounded-xl shadow-md ">
              <BarChart rows={filteredRows} />
            </div>

            {/* Block 2 */}
            {/* className="col-span-4  bg-[var(--card)] 4 rounded-xl shadow-md" */}
            <div className="col-span-4 max-h-[25vw]  " >
              <PieCharts rows={filteredRows} indentRows={filteredIndentRows} />
            </div>

            {/* Block 3 */}
            {/* bg-[var(--card)] 4 rounded-xl shadow-md */}
            <div className="col-span-5 max-h-[25vw] bg-[var(--card)]  rounded-xl shadow-md ">
              <LineChart indentRows={filteredIndentRows} />
            </div>
          </div>

          {/* Block 5 */}
          <div className="col-span-12 bg-[var(--card)] p-4 rounded-xl shadow-md">
            <DataTable rows={filteredRows} indentRows={filteredIndentRows} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPage;