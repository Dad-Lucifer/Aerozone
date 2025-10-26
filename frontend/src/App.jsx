// src/App.js

import React, { useEffect, useRef } from "react";
import './App.css';
// REMOVE THE NAVBAR IMPORT FROM HERE
// import Navbar from "../components/module1/Navbar"; 

import DataPage from "../pages/DataPage";
import Home from "../pages/Home";
import PdfJson from "../pages/PdfJson";
import DataPage2 from "../pages/DataPage2";
import Module2Page from "../pages/Module2Page";
import { Routes, Route } from "react-router-dom";
import Lenis from "@studio-freight/lenis";

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => t,
      smooth: true,
      direction: "vertical",
      gestureDirection: "vertical",
      smoothTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="relative z-10 min-h-screen w-full">
        {/* The Navbar component has been REMOVED from here */}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/data" element={<DataPage />} />
          <Route path="/pdf-to-json" element={<PdfJson />} />
          <Route path="/data2" element={<DataPage2 />} />
          <Route path="/Module2" element={<Module2Page />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;