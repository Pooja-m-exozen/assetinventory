"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, HelpCircle, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import {
  exportTable,
  getExportFileName,
  type ExportTableType,
  type ExportFormat,
} from "@/lib/api/export";

export default function ExportPage() {
  const [exportTableType, setExportTableType] = useState<ExportTableType | "">("");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("xlsx");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const tableOptions = [
    { value: "", label: "- select -" },
    { value: "assets", label: "Assets" },
    { value: "persons-employees", label: "Persons/Employees" },
    { value: "customers", label: "Customers" },
    { value: "maintenance", label: "Maintenance" },
    { value: "warranties", label: "Warranties" },
    { value: "contracts", label: "Contracts" },
    { value: "users", label: "Users" },
    { value: "security-groups", label: "Security Groups" },
  ];

  const formatOptions = [
    { value: "xlsx", label: "Excel (.xlsx)" },
    { value: "csv", label: "CSV (.csv)" },
  ];

  const handleExport = async () => {
    if (!exportTableType) {
      setError("Please select a table to export");
      return;
    }

    try {
      setIsExporting(true);
      setError(null);
      setSuccess(false);

      const blob = await exportTable(exportTableType as ExportTableType, exportFormat);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getExportFileName(exportTableType as ExportTableType, exportFormat);
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Export error:", err);
      setError(err instanceof Error ? err.message : "Failed to export table");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <Download className="h-6 w-6 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Export Tables
          </h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
            <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-4 flex items-center text-green-800">
            <CheckCircle className="mr-2 h-5 w-5 shrink-0" />
            <span className="text-sm">Export completed successfully! File download started.</span>
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          {/* Step Indicator */}
          <h5 className="mb-4 font-semibold text-lg text-gray-900" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Step 1: Select Table and Format
          </h5>

          {/* Export Table Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Export Table <span className="text-red-500">*</span>
            </label>
            <select
              value={exportTableType}
              onChange={(e) => {
                setExportTableType(e.target.value as ExportTableType | "");
                setError(null);
              }}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              disabled={isExporting}
            >
              {tableOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Format Dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Export Format <span className="text-red-500">*</span>
            </label>
            <select
              value={exportFormat}
              onChange={(e) => {
                setExportFormat(e.target.value as ExportFormat);
                setError(null);
              }}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              disabled={isExporting}
            >
              {formatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <div className="mt-6">
            <Button
              onClick={handleExport}
              disabled={!exportTableType || isExporting}
              className={`flex items-center gap-2 ${
                exportTableType && !isExporting
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white`}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {isExporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Export
                </>
              )}
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              <strong>Note:</strong> The export will include all records from the selected table. 
              Large exports may take a few moments to process. The file will automatically download when ready.
            </p>
          </div>
        </div>
      </div>

      {/* Need Help Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          title="Need Help?"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
