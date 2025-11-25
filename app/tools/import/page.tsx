"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Cloud, HelpCircle } from "lucide-react";

export default function ImportPage() {
  const [importTo, setImportTo] = useState("Assets");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    // Add download template functionality
    console.log("Download template");
  };

  const handleDownloadFieldLimits = () => {
    // Add download field limits functionality
    console.log("Download field limits");
  };

  const handleUploadFile = () => {
    if (selectedFile) {
      // Add upload functionality
      console.log("Upload file:", selectedFile.name);
    }
  };

  return (
    <div className="p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <Cloud className="h-6 w-6 text-orange-600 dark:text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
            Import Wizard
          </h1>
        </div>

        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4">
          {/* Step Indicator */}
          <h5 className="mb-3 font-semibold text-lg text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Step 1: Upload File
          </h5>

          {/* Instructions */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Import assets using an Excel spreadsheet. Download our template, fill it in, and upload. Also download 'Field Limits Info' to make sure your data is within character limits for all fields. There is no limit on the number of assets you can have. But you can import up to <strong>5,000 records</strong> in one spreadsheet.
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            If you need assistance in uploading your assets, please feel free to email your spreadsheet to <a href="mailto:info@assettiger.com" className="text-orange-600 dark:text-orange-500 hover:underline">info@assettiger.com</a>. We'll take care of the rest.
          </p>

          {/* Import To Dropdown */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Import To
            </label>
            <select
              value={importTo}
              onChange={(e) => setImportTo(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 max-w-xs"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <option value="Assets">Assets</option>
              <option value="Persons/Employees">Persons/Employees</option>
              <option value="Customers">Customers</option>
            </select>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Cloud className="h-4 w-4" />
              Download Template
            </Button>
            <Button
              variant="outline"
              onClick={handleDownloadFieldLimits}
              className="flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Cloud className="h-4 w-4" />
              Download Field Limits
            </Button>
          </div>

          {/* File Selection */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Select File <span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="fileInput"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="fileInput"
                className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Choose File
              </label>
              <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mt-4">
            <Button
              onClick={handleUploadFile}
              disabled={!selectedFile}
              className={`flex items-center gap-2 ${selectedFile ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 cursor-not-allowed'}`}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Upload className="h-4 w-4" />
              Upload File
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
