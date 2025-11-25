"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, HelpCircle } from "lucide-react";

export default function ExportPage() {
  const [exportTable, setExportTable] = useState("");

  const handleExport = () => {
    if (exportTable) {
      // Add export functionality
      console.log("Export table:", exportTable);
    }
  };

  const tableOptions = [
    { value: "", label: "- select -" },
    { value: "assets", label: "Assets" },
    { value: "persons-employees", label: "Persons/Employees" },
    { value: "customers", label: "Customers" },
    { value: "maintenance", label: "Maintenance" },
    { value: "warranties", label: "Warranties" },
    { value: "contracts", label: "Contracts" },
  ];

  return (
    <div className="p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <Download className="h-6 w-6 text-orange-600 dark:text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
            Export Tables
          </h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4">
          {/* Step Indicator */}
          <h5 className="mb-3 font-semibold text-lg text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Step 1: Select Table
          </h5>

          {/* Export Table Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Export Table
            </label>
            <select
              value={exportTable}
              onChange={(e) => setExportTable(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 max-w-xs"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {tableOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <div className="mt-4">
            <Button
              onClick={handleExport}
              disabled={!exportTable}
              className={`flex items-center gap-2 ${exportTable ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 cursor-not-allowed'}`}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Need Help Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
