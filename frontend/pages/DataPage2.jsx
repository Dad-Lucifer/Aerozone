import React, { useEffect, useState } from "react";
import Filters from "../components/module1/Filter2";
import * as XLSX from "xlsx";
import DonutChart from "../components/module1/DonutChart";
import DonutChart2 from "../components/module1/DonutChart2";
import Uploadfrom2 from "../components/module1/Uploadfrom2";
import DataTable2 from "../components/module1/DataTable2";
import Navbar2 from "../components/module1/Navbar2";
import Rawmaterial from "../components/module1/Rawmaterial";
import Baught from "../components/module1/Baught";
import Yashgraph from "../components/module1/Yashgraph";
import ReferenceBList from "../components/module1/ReferenceBList";

// ZoomIcon component
const ZoomIcon = ({ width = 20, height = 20, stroke = "#6366f1" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
    <line x1="11" y1="8" x2="11" y2="14"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

const DataPage2 = () => {
  // State management
  const [rows, setRows] = useState([]);
  const [indentRows, setIndentRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [filteredIndentRows, setFilteredIndentRows] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedRef, setSelectedRef] = useState(null);


  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    refStart: "",
    refEnd: "",
  });

  // Animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prevKey) => prevKey + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Data fetching effect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataRes, indentRes] = await Promise.all([
          fetch("http://localhost:5000/api/data/get-data"),
          fetch("http://localhost:5000/api/data/get-indent")
        ]);

        const data = await dataRes.json();
        const indentData = await indentRes.json();

        setRows(data);
        setFilteredRows(data);
        setIndentRows(indentData);
        setFilteredIndentRows(indentData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Handle component click
  const handleComponentClick = (componentName) => {
    setActiveComponent(componentName);
  };

  // Handle backdrop click to close zoomed view
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setActiveComponent(null);
    }
  };

  // Process uploaded Excel
  const processExcel = async (file) => {
    if (!file) {
      alert("Please upload an Excel file first.");
      return;
    }

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setExcelData(excelJson);

      // Merge ReferenceB into rows
      const updated = rows.map((row) => {
        const match = excelJson.find((excelRow) => {
          const excelPONo = excelRow[4]; // Column E
          return String(excelPONo).trim() === String(row.PONo).trim();
        });
        return {
          ...row,
          ReferenceB: match ? match[14] : "N/A", // Column O
        };
      });

      setRows(updated);
      setFilteredRows(updated);
    } catch (err) {
      console.error("Error processing Excel:", err);
    }
  };

  // Filter helper functions
  const normalizeKey = (k = "") => String(k).replace(/\s|_|-/g, "").toLowerCase();

  const findRowValue = (row = {}, candidates = []) => {
    // Direct key matches
    for (const c of candidates) {
      if (row[c] !== undefined && row[c] !== null && String(row[c]).trim() !== "") {
        return String(row[c]).trim();
      }
    }

    // Fallback: match by normalized key
    const map = {};
    Object.keys(row).forEach((k) => {
      map[normalizeKey(k)] = k;
    });

    for (const c of candidates) {
      const nk = normalizeKey(c);
      if (map[nk]) return String(row[map[nk]]).trim();
    }

    return "";
  };

  // Apply filters
  const applyFilters = () => {
    const { search, refStart, refEnd } = filters;

    // Split and normalize search terms
    const searchTerms = String(search || "")
      .split(/[, ]+/)
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const start = parseFloat(refStart);
    const end = parseFloat(refEnd);
    const refFilterActive = !isNaN(start) || !isNaN(end);

    const filterRow = (row) => {
      let ok = true;

      // ✅ New: match selected Reference B
      if (selectedRef && String(row.ReferenceB).trim() !== String(selectedRef).trim()) {
        return false;
      }

      // Reference B numeric range filtering (existing)
      const refStr = findRowValue(row, [
        "ReferenceB",
        "REF_B",
        "Reference B",
        "Reference_B",
        "REFB",
        "Reference",
      ]);
      const refVal = refStr
        ? parseFloat(String(refStr).replace(/[^0-9.\-]/g, ""))
        : NaN;

      if (refFilterActive) {
        if (isNaN(refVal)) return false;
        if (!isNaN(start) && refVal < start) return false;
        if (!isNaN(end) && refVal > end) return false;
      }

      // Search filtering
      if (searchTerms.length > 0) {
        ok =
          ok &&
          searchTerms.some((term) =>
            Object.values(row).some((val) =>
              String(val || "").toLowerCase().includes(term)
            )
          );
      }

      return ok;
    };

    setFilteredRows(rows.filter(filterRow));
    setFilteredIndentRows(indentRows.filter(filterRow));
  };

  // Zoomed component renderer
  const renderZoomedComponent = () => {
    if (!activeComponent) return null;

    const components = {
      refBCards: <ReferenceBList />,
      donutChart: <DonutChart key={`donut-${animationKey}`} rows={filteredRows} />,
      donutChart2: <DonutChart2 key={`donut2-${animationKey}`} filteredRows={filteredRows} filteredIndentRows={filteredIndentRows} />,
      rawMaterial: <Rawmaterial
        value={`${filteredRows.length} Items`}
        label="Raw Materials"
        bgColor="bg-[var(--card)]"
        valueColor="text-[var(--primary)]"
        labelColor="text-[var(--muted-foreground)]"
      />,
      baught: <Baught
        value={`${filteredRows.length} Items`}
        label="Business Operations Index"
        bgColor="bg-[var(--card)]"
        valueColor="text-[var(--primary)]"
        labelColor="text-[var(--muted-foreground)]"
      />,
      yashgraph: <Yashgraph />,
      dataTable: <DataTable2 rows={filteredRows} indentRows={filteredIndentRows} />,
      
    };

    // Special handling for dataTable to show full width
    if (activeComponent === 'dataTable') {
      return (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-[95vw] h-[90vh] overflow-auto transform transition-all duration-300 scale-100">
            <div className="relative">
              <button
                className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600"
                onClick={() => setActiveComponent(null)}
              >
                ×
              </button>
              <div className="w-full h-full">
                <DataTable2 rows={filteredRows} indentRows={filteredIndentRows} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto transform transition-all duration-300 scale-100">
          <div className="relative">
            <button
              className="absolute -top-2 -right-2 bg-gray-200 hover:bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600"
              onClick={() => setActiveComponent(null)}
            >
              ×
            </button>
            {components[activeComponent]}
          </div>
        </div>
      </div>
    );
  };

 


  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 relative ${activeComponent ? 'overflow-hidden' : ''}`}>
      <Navbar2 />

      {/* Zoomed Component Overlay */}
      {renderZoomedComponent()}

      {/* Fixed Filter Bar */}
<div className={`fixed x-1 left-0 right-0 z-10 bg-[var(--background)] bg-opacity-95 backdrop-blur-sm shadow-sm ${activeComponent ? 'blur-sm' : ''}`}>
  <div className="flex justify-between items-center py-0.5 px-2">
    <Filters
      filters={filters}
      setFilters={setFilters}
      applyFilters={applyFilters}
      rows={rows}
    />
    
  </div>
</div>



      {/* Main Content with Top Padding for Fixed Filter */}
      <div className={`pt-16 px-6 x-30 transition-all duration-300 ${activeComponent ? 'blur-sm' : ''}`}>
        {/* Metrics Cards Section */}
        <div className="my-16 mt-20">
          {/* First Row - Rawmaterial, Baught, Yashgraph */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Uploadfrom2 onUpload={processExcel} />
            <div
              className="cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleComponentClick('rawMaterial')}
            >
              <Rawmaterial
                value={`${filteredRows.length} Items`}
                label="Raw Materials"
                bgColor="bg-[var(--card)]"
                valueColor="text-[var(--primary)]"
                labelColor="text-[var(--muted-foreground)]"
              />
            </div>
            <div
              className="cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleComponentClick('baught')}
            >
              <Baught
                value={`${filteredRows.length} Items`}
                label="Business Operations Index"
                bgColor="bg-[var(--card)]"
                valueColor="text-[var(--primary)]"
                labelColor="text-[var(--muted-foreground)]"
              />
            </div>
            <div
              className="cursor-pointer transform transition-transform hover:scale-105"
              onClick={() => handleComponentClick('yashgraph')}
            >
              <Yashgraph />
            </div>
          </div>

          {/* New Row - Three Components in Right Half Only */}
          <div className="flex justify-end mt-4">
            <div className="flex flex-row gap-4 w-1/2">
              <div
                className="flex-1 cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleComponentClick('refBCards')}
              >
                {/* ✅ ReferenceBList Section */}
                <div className="mt-4">
                  <ReferenceBList
                    rows={filteredRows}
                    selectedRef={selectedRef}
                    onSelectRef={(ref) => {
                      setSelectedRef(ref);
                      // Apply filters again after selection change
                      setTimeout(() => applyFilters(), 0);
                    }}
                  />
                </div>
              </div>
              <div
                className="flex-1 cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleComponentClick('donutChart')}
              >
                <DonutChart key={`donut-${animationKey}`} rows={filteredRows} />
              </div>
              <div
                className="flex-1 cursor-pointer transform transition-transform hover:scale-105"
                onClick={() => handleComponentClick('donutChart2')}
              >
                <DonutChart2 key={`donut2-${animationKey}`} filteredRows={filteredRows} filteredIndentRows={filteredIndentRows} />
              </div>
            </div>
          </div>

          {/* DataTable2 Component - Bottom Right Half with Zoom Button */}
          <div className="flex justify-end mt-4">
            <div className="w-1/2">
              <div className="bg-[var(--card)] p-4 rounded-xl shadow-md relative">
                <button
                  className="absolute top-2 right-2 p-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors z-10"
                  onClick={() => handleComponentClick('dataTable')}
                  title="Zoom Table"
                >
                  <ZoomIcon />
                </button>

                <DataTable2 rows={filteredRows} indentRows={filteredIndentRows} />
              </div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPage2;