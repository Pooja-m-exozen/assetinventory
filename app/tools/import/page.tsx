"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Cloud, HelpCircle, Loader2, AlertCircle, CheckCircle, Download } from "lucide-react";
import {
  importData,
  downloadTemplate,
  downloadFieldLimits,
  getTemplateFileName,
  getFieldLimitsFileName,
  type ImportTableType,
} from "@/lib/api/import";

export default function ImportPage() {
  const [importTo, setImportTo] = useState<ImportTableType>("assets");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);
  const [isDownloadingFieldLimits, setIsDownloadingFieldLimits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    message: string;
    totalRows: number;
    importedCount: number;
    failedCount: number;
    errors?: Array<{ row: number; [key: string]: any; error: string }>;
  } | null>(null);

  const tableOptions = [
    { value: "assets", label: "Assets" },
    { value: "persons-employees", label: "Persons/Employees" },
    { value: "customers", label: "Customers" },
    { value: "users", label: "Users" },
    { value: "maintenance", label: "Maintenance" },
    { value: "warranties", label: "Warranties" },
    { value: "contracts", label: "Contracts" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      const validExtensions = [".xlsx", ".xls", ".csv"];
      const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        setError("Please select a valid Excel or CSV file (.xlsx, .xls, .csv)");
        return;
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloadingTemplate(true);
      setError(null);
      const blob = await downloadTemplate(importTo, "xlsx");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getTemplateFileName(importTo, "xlsx");
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download template");
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleDownloadFieldLimits = async () => {
    try {
      setIsDownloadingFieldLimits(true);
      setError(null);
      const blob = await downloadFieldLimits(importTo, "pdf");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getFieldLimitsFileName(importTo, "pdf");
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download field limits");
    } finally {
      setIsDownloadingFieldLimits(false);
    }
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      setError("Please select a file to import");
      return;
    }

    try {
      setIsImporting(true);
      setError(null);
      setSuccess(null);

      const result = await importData(importTo, selectedFile);
      
      setSuccess(result);
      
      // Reset file selection after successful import
      setSelectedFile(null);
      // Reset file input
      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } catch (err) {
      console.error("Import error:", err);
      setError(err instanceof Error ? err.message : "Failed to import file");
      setSuccess(null);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <Cloud className="h-6 w-6 text-orange-600" />
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Import Wizard
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
          <div className="mb-4 rounded-lg bg-green-50 p-4">
            <div className="flex items-center text-green-800 mb-2">
              <CheckCircle className="mr-2 h-5 w-5 shrink-0" />
              <span className="text-sm font-semibold">{success.message}</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>Total Rows: {success.totalRows}</p>
              <p>Successfully Imported: {success.importedCount}</p>
              {success.failedCount > 0 && (
                <p className="text-red-600">Failed: {success.failedCount}</p>
              )}
            </div>
            {success.errors && success.errors.length > 0 && (
              <div className="mt-3 max-h-48 overflow-y-auto">
                <p className="text-xs font-semibold text-green-800 mb-1">Errors:</p>
                <div className="space-y-1">
                  {success.errors.slice(0, 10).map((err, idx) => (
                    <p key={idx} className="text-xs text-red-600">
                      Row {err.row}: {err.error}
                    </p>
                  ))}
                  {success.errors.length > 10 && (
                    <p className="text-xs text-gray-600">
                      ... and {success.errors.length - 10} more errors
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
          {/* Step Indicator */}
          <h5 className="mb-3 font-semibold text-lg text-gray-900" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Step 1: Upload File
          </h5>

          {/* Instructions */}
          <p className="text-sm text-gray-600 mb-4 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Import data using an Excel or CSV spreadsheet. Download our template, fill it in, and upload. Also download 'Field Limits Info' to make sure your data is within character limits for all fields. You can import up to <strong>5,000 records</strong> in one spreadsheet.
          </p>

          {/* Import To Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Import To <span className="text-red-500">*</span>
            </label>
            <select
              value={importTo}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "assets" || value === "persons-employees" || value === "customers" || value === "users" || value === "maintenance" || value === "warranties" || value === "contracts") {
                  setImportTo(value);
                  setError(null);
                  setSuccess(null);
                  setSelectedFile(null);
                }
              }}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              disabled={isImporting}
            >
              {tableOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              disabled={isDownloadingTemplate || isImporting}
              className="flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {isDownloadingTemplate ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Template
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadFieldLimits}
              disabled={isDownloadingFieldLimits || isImporting}
              className="flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {isDownloadingFieldLimits ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Field Limits
                </>
              )}
            </Button>
          </div>

          {/* File Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Select File <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="fileInput"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={isImporting}
              />
              <label
                htmlFor="fileInput"
                className={`px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-md text-sm cursor-pointer hover:bg-gray-50 ${
                  isImporting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Choose File
              </label>
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: Excel (.xlsx, .xls) or CSV (.csv). Maximum file size: 10MB
            </p>
          </div>

          {/* Upload Button */}
          <div className="mt-6">
            <Button
              onClick={handleUploadFile}
              disabled={!selectedFile || isImporting}
              className={`flex items-center gap-2 ${
                selectedFile && !isImporting
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-400 cursor-not-allowed'
              } text-white`}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload File
                </>
              )}
            </Button>
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
