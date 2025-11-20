"use client";

import { useState } from "react";
import { Download } from "lucide-react";

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
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Download className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Export Tables</h1>
      </div>

      {/* Main Content Card */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Step Indicator */}
          <h5 className="mb-3 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Step 1: Select Table</h5>

          {/* Export Table Dropdown */}
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
              Export Table
            </label>
            <select
              className="form-select"
              value={exportTable}
              onChange={(e) => setExportTable(e.target.value)}
              style={{
                borderRadius: '4px',
                border: '1px solid #D0D0D0',
                padding: '8px 12px',
                fontSize: '14px',
                maxWidth: '300px'
              }}
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
            <button
              type="button"
              className="btn text-white d-flex align-items-center"
              onClick={handleExport}
              disabled={!exportTable}
              style={{
                backgroundColor: exportTable ? '#28A745' : '#6C757D',
                borderRadius: '4px',
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: exportTable ? 'pointer' : 'not-allowed'
              }}
            >
              <Download style={{ width: '18px', height: '18px', marginRight: '8px' }} />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

