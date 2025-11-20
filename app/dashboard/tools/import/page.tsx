"use client";

import { useState } from "react";
import { Upload, Cloud, FileText } from "lucide-react";

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
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Cloud className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Import Wizard</h1>
      </div>

      {/* Main Content Card */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Step Indicator */}
          <h5 className="mb-3 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Step 1: Upload File</h5>

          {/* Instructions */}
          <p className="text-muted mb-4" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            Import assets using an Excel spreadsheet. Download our template, fill it in, and upload. Also download 'Field Limits Info' to make sure your data is within character limits for all fields. There is no limit on the number of assets you can have. But you can import up to <strong>5,000 records</strong> in one spreadsheet.
          </p>

          <p className="text-muted mb-4" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            If you need assistance in uploading your assets, please feel free to email your spreadsheet to <a href="mailto:info@assettiger.com" style={{ color: '#FF8C00' }}>info@assettiger.com</a>. We'll take care of the rest.
          </p>

          {/* Import To Dropdown */}
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
              Import To
            </label>
            <select
              className="form-select"
              value={importTo}
              onChange={(e) => setImportTo(e.target.value)}
              style={{
                borderRadius: '4px',
                border: '1px solid #D0D0D0',
                padding: '8px 12px',
                fontSize: '14px',
                maxWidth: '300px'
              }}
            >
              <option value="Assets">Assets</option>
              <option value="Persons/Employees">Persons/Employees</option>
              <option value="Customers">Customers</option>
            </select>
          </div>

          {/* Download Buttons */}
          <div className="d-flex gap-2 mb-4">
            <button
              type="button"
              className="btn d-flex align-items-center"
              onClick={handleDownloadTemplate}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000',
                border: '1px solid #D0D0D0',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              <Cloud style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Download Template
            </button>
            <button
              type="button"
              className="btn d-flex align-items-center"
              onClick={handleDownloadFieldLimits}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#000',
                border: '1px solid #D0D0D0',
                borderRadius: '4px',
                padding: '8px 16px',
                fontSize: '14px'
              }}
            >
              <Cloud style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Download Field Limits
            </button>
          </div>

          {/* File Selection */}
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
              Select File <span style={{ color: '#DC3545' }}>*</span>
            </label>
            <div className="d-flex align-items-center gap-2">
              <input
                type="file"
                id="fileInput"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label
                htmlFor="fileInput"
                className="btn"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginBottom: '0'
                }}
              >
                Choose File
              </label>
              <span style={{ fontSize: '14px', color: '#666' }}>
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>
          </div>

          {/* Upload Button */}
          <div className="mt-4">
            <button
              type="button"
              className="btn text-white d-flex align-items-center"
              onClick={handleUploadFile}
              disabled={!selectedFile}
              style={{
                backgroundColor: selectedFile ? '#28A745' : '#6C757D',
                borderRadius: '4px',
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: '500',
                border: 'none',
                cursor: selectedFile ? 'pointer' : 'not-allowed'
              }}
            >
              <Upload style={{ width: '18px', height: '18px', marginRight: '8px' }} />
              Upload File
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

