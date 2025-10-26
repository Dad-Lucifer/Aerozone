import React, { useMemo } from "react";
import { motion, useAnimation } from "motion/react";

// Magnet component
const Magnet = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}) => {
  const controls = useAnimation();

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
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={{
          normal: {
            scale: 1,
            rotate: 0,
            y: 0,
          },
          animate: {
            scale: [1, 1.04, 1],
            rotate: [0, -8, 8, -8, 0],
            y: [0, -2, 0],
            transition: {
              duration: 0.6,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
            },
          },
        }}
        animate={controls}
      >
        <path d="m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15" />
        <path d="m5 8 4 4" />
        <path d="m12 15 4 4" />
      </motion.svg>
    </div>
  );
};

export default function Filters({ filters, setFilters, applyFilters, rows }) {
  const { search, refStart, refEnd } = filters;

  return (
    <div className="mb-4 p-4">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        {/* General Search */}
        <input
          type="text"
          placeholder="🔍 Search"
          value={search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full md:w-64 px-3 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 bg-[var(--background)] text-[var(--foreground)] text-sm"
        />

        {/* ReferenceB Start */}
        <input
          type="number"
          placeholder="Ref B Start"
          value={refStart}
          onChange={(e) => setFilters({ ...filters, refStart: e.target.value })}
          className="w-full md:w-40 px-3 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 bg-[var(--background)] text-[var(--foreground)] text-sm"
        />

        {/* ReferenceB End */}
        <input
          type="number"
          placeholder="Ref B End"
          value={refEnd}
          onChange={(e) => setFilters({ ...filters, refEnd: e.target.value })}
          className="w-full md:w-40 px-3 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 transition-all duration-300 bg-[var(--background)] text-[var(--foreground)] text-sm"
        />

        {/* Search Button with Magnet Icon Only */}
        <button
          onClick={applyFilters}
          className="flex items-center justify-center bg-[var(--primary)] hover:opacity-90 text-[var(--primary-foreground)] p-2 rounded-full shadow-md transition"
        >
          <Magnet stroke="var(--primary-foreground)" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}