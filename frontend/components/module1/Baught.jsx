import React from 'react';

const Baught = ({ 
  value = "52 BOI", 
  label = "Business Operations Index",
  valueColor = "text-blue-600",
  labelColor = "text-gray-600",
  bgColor = "bg-white",
  hoverScale = "hover:scale-105"
}) => {
  return (
    <div className={`${bgColor} rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 ${hoverScale}`}>
      <div className={`text-4xl font-bold ${valueColor} mb-2`}>{value}</div>
      <div className={`text-sm ${labelColor}`}>{label}</div>
    </div>
  );
};

export default Baught;