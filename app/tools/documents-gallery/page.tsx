"use client";

import { useState } from "react";
import { FileText, Upload, Search, ChevronLeft, ChevronRight, ArrowUp, Eye } from "lucide-react";

interface Document {
  id: number;
  fileName: string;
  description: string;
  fileType: string;
  uploadDate: string;
  assetsAttached: number;
  inventoryItemsAttached: number;
  uploadBy: string;
}

export default function DocumentsGalleryPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const documents: Document[] = [
    {
      id: 1,
      fileName: "assetdetail_36985319.pdf",
      description: "Dosing",
      fileType: "Adobe PDF",
      uploadDate: "11/19/2025",
      assetsAttached: 1,
      inventoryItemsAttached: 0,
      uploadBy: "Shivanya DN"
    }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(documents.map(doc => doc.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const totalRecords = documents.length;
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <FileText className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
          <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Documents Gallery</h1>
        </div>
        <button type="button" className="btn text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '8px 16px' }}>
          <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          Upload Document
        </button>
      </div>

      {/* Main Content Card */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Section Title & Description */}
          <div className="mb-4">
            <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Manage Documents</h5>
            <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              Easily keep your documents accessible. Assign documents to specific assets by viewing the details of the individual documents and attaching them.
            </p>
          </div>

          {/* Search Section */}
          <div className="d-flex gap-3 mb-4">
            <div className="flex-grow-1 position-relative">
              <Search className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#666' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search File Name, Description or Keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  paddingLeft: '36px', 
                  borderRadius: '4px', 
                  border: '1px solid #D0D0D0', 
                  fontSize: '14px',
                  height: '38px'
                }}
              />
            </div>
          </div>

          {/* Table Controls Top */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <select 
                className="form-select" 
                style={{ width: 'auto', borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px', fontSize: '14px' }}
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span style={{ fontSize: '14px', color: '#666' }}>Documents</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <button 
                className="btn btn-sm" 
                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              <button 
                className="btn btn-sm text-white" 
                style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '4px 12px', minWidth: '32px' }}
              >
                {currentPage}
              </button>
              <button 
                className="btn btn-sm" 
                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px' }}
                disabled={currentPage * recordsPerPage >= totalRecords}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>

          {/* Documents Table */}
          <div className="table-responsive">
            <table className="table table-bordered" style={{ marginBottom: '0' }}>
              <thead style={{ backgroundColor: '#FFF5E6' }}>
                <tr>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      File Name
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Description
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      File Type
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Upload Date
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Assets Attached
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Inventory Items Attached
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Upload By
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ border: '1px solid #D0D0D0', padding: '40px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                      No documents found.
                    </td>
                  </tr>
                ) : (
                  documents.map((document) => (
                    <tr key={document.id}>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>
                        <a 
                          href="#" 
                          style={{ color: '#0066CC', textDecoration: 'none' }}
                          onClick={(e) => {
                            e.preventDefault();
                            // Handle file download/view
                          }}
                        >
                          {document.fileName}
                        </a>
                      </td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{document.description}</td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>
                        <div className="d-flex align-items-center">
                          <FileText style={{ width: '16px', height: '16px', marginRight: '6px', color: '#DC3545' }} />
                          {document.fileType}
                        </div>
                      </td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{document.uploadDate}</td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{document.assetsAttached}</td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{document.inventoryItemsAttached}</td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{document.uploadBy}</td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px' }}>
                        <button className="btn btn-sm text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
                          <Eye style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Summary */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div style={{ fontSize: '14px', color: '#666' }}>
              Showing {startRecord} to {endRecord} of {totalRecords} records
            </div>
            <div className="d-flex align-items-center gap-1">
              <button 
                className="btn btn-sm" 
                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              <button 
                className="btn btn-sm text-white" 
                style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '4px 12px', minWidth: '32px' }}
              >
                {currentPage}
              </button>
              <button 
                className="btn btn-sm" 
                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px' }}
                disabled={currentPage * recordsPerPage >= totalRecords}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
