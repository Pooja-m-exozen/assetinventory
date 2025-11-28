"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Upload, Search, ChevronLeft, ChevronRight, ArrowUp, Eye, X, Loader2, AlertCircle, Trash2, Download } from "lucide-react";
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  bulkDeleteDocuments,
  getDocument,
  downloadDocument,
  type Document as DocumentType,
  type PaginatedResponse,
  type DocumentDetails,
} from "@/lib/api/documents";

export default function DocumentsGalleryPage() {
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    startRecord: 0,
    endRecord: 0,
  });
  const [isDeleting, setIsDeleting] = useState<number | string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentDetails | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState<number | string | null>(null);
  
  // Upload form
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    description: "",
  });
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>({});

  // Fetch documents from API
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setDocuments([]);
          setPagination({
            totalRecords: 0,
            totalPages: 0,
            startRecord: 0,
            endRecord: 0,
          });
          setLoading(false);
          return;
        }
      }

      const response: PaginatedResponse<DocumentType> = await getDocuments(
        currentPage,
        recordsPerPage,
        searchQuery,
        searchField
      );
      setDocuments(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch documents");
      setDocuments([]);
      setPagination({
        totalRecords: 0,
        totalPages: 0,
        startRecord: 0,
        endRecord: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, recordsPerPage, searchQuery, searchField]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchDocuments();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchField]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchField, recordsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(documents.map(doc => doc.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number | string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteDocument(id);
      await fetchDocuments();
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete document");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select documents to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} document(s)?`)) {
      return;
    }

    try {
      setIsDeleting(-1);
      await bulkDeleteDocuments(selectedRows);
      await fetchDocuments();
      setSelectedRows([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete documents");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpload = async () => {
    setUploadErrors({});
    
    if (!uploadForm.file) {
      setUploadErrors({ file: "Please select a file" });
      return;
    }
    if (!uploadForm.description.trim()) {
      setUploadErrors({ description: "Description is required" });
      return;
    }

    try {
      setIsUploading(true);
      await uploadDocument({
        file: uploadForm.file,
        description: uploadForm.description.trim(),
      });
      await fetchDocuments();
      setIsUploadModalOpen(false);
      setUploadForm({ file: null, description: "" });
      setUploadErrors({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload document";
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewDetails = async (id: number | string) => {
    try {
      setLoading(true);
      const response = await getDocument(id);
      setSelectedDocument(response.data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load document details");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id: number | string, fileName: string) => {
    try {
      setIsDownloading(id);
      const blob = await downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to download document");
    } finally {
      setIsDownloading(null);
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="mr-2 h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Documents Gallery</h1>
        </div>
        <button
          type="button"
          className="flex items-center rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          onClick={() => setIsUploadModalOpen(true)}
          disabled={loading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Document
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      {/* Main Content Card */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          {/* Section Title & Description */}
          <div className="mb-4">
            <h5 className="mb-2 text-lg font-semibold text-gray-900">Manage Documents</h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              Easily keep your documents accessible. Assign documents to specific assets by viewing the details of the individual documents and attaching them.
            </p>
          </div>

          {/* Search Section */}
          <div className="mb-4 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full rounded border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search File Name, Description or Keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {selectedRows.length > 0 && (
              <button
                type="button"
                className="flex items-center rounded border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                onClick={handleBulkDelete}
                disabled={isDeleting === -1}
              >
                {isDeleting === -1 ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected ({selectedRows.length})
                  </>
                )}
              </button>
            )}
          </div>

          {/* Table Controls Top */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">Documents</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded bg-orange-500 px-3 py-1 text-sm font-medium text-white min-w-[32px]">
                {currentPage}
              </button>
              <button
                className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage >= pagination.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Documents Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              No documents found. Upload a document to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-orange-50">
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.length === documents.length && documents.length > 0}
                          onChange={handleSelectAll}
                          className="mr-2 rounded border-gray-300"
                        />
                        File Name
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">
                      <div className="flex items-center">
                        Description
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">
                      <div className="flex items-center">
                        File Type
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">
                      <div className="flex items-center">
                        Upload Date
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">
                      <div className="flex items-center">
                        Assets Attached
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">
                      <div className="flex items-center">
                        Inventory Items Attached
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">
                      <div className="flex items-center">
                        Upload By
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document) => (
                    <tr key={document.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-3 text-sm">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(document.id)}
                            onChange={() => handleSelectRow(document.id)}
                            className="mr-2 rounded border-gray-300"
                          />
                          <button
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={() => handleDownload(document.id, document.fileName)}
                            disabled={isDownloading === document.id}
                          >
                            {isDownloading === document.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              document.fileName
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-900">{document.description}</td>
                      <td className="border border-gray-200 px-3 py-3 text-sm">
                        <div className="flex items-center">
                          <FileText className="mr-1.5 h-4 w-4 text-red-500" />
                          {document.fileType}
                        </div>
                      </td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{formatDate(document.uploadDate)}</td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{document.assetsAttached}</td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{document.inventoryItemsAttached}</td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{document.uploadBy}</td>
                      <td className="border border-gray-200 px-3 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="flex items-center rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                            onClick={() => handleViewDetails(document.id)}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            Details
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(document.id)}
                            disabled={isDeleting === document.id}
                          >
                            {isDeleting === document.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Summary */}
          {!loading && documents.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {pagination.startRecord} to {pagination.endRecord} of {pagination.totalRecords} records
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="rounded bg-orange-500 px-3 py-1 text-sm font-medium text-white min-w-[32px]">
                  {currentPage}
                </button>
                <button
                  className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadForm({ file: null, description: "" });
                  setUploadErrors({});
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setUploadForm({ ...uploadForm, file: file || null });
                    if (uploadErrors.file) {
                      setUploadErrors({ ...uploadErrors, file: "" });
                    }
                  }}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                />
                {uploadErrors.file && (
                  <p className="mt-1 text-xs text-red-600">{uploadErrors.file}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) => {
                    setUploadForm({ ...uploadForm, description: e.target.value });
                    if (uploadErrors.description) {
                      setUploadErrors({ ...uploadErrors, description: "" });
                    }
                  }}
                  placeholder="Enter document description"
                />
                {uploadErrors.description && (
                  <p className="mt-1 text-xs text-red-600">{uploadErrors.description}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadForm({ file: null, description: "" });
                  setUploadErrors({});
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {isDetailsModalOpen && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Document Details</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedDocument(null);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">File Name</label>
                <p className="mt-1 text-sm text-gray-900">{selectedDocument.fileName}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Description</label>
                <p className="mt-1 text-sm text-gray-900">{selectedDocument.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">File Type</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDocument.fileType}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">File Size</label>
                  <p className="mt-1 text-sm text-gray-900">{formatFileSize(selectedDocument.fileSize)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Upload Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(selectedDocument.uploadDate)}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Upload By</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDocument.uploadBy}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Assets Attached</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDocument.assetsAttached}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Inventory Items Attached</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedDocument.inventoryItemsAttached}</p>
                </div>
              </div>
              {selectedDocument.attachedAssets && selectedDocument.attachedAssets.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-700">Attached Assets</label>
                  <div className="mt-2 space-y-1">
                    {selectedDocument.attachedAssets.map((asset) => (
                      <div key={asset.id} className="rounded bg-gray-50 p-2 text-sm">
                        {asset.assetId} - {asset.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedDocument.attachedInventoryItems && selectedDocument.attachedInventoryItems.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-700">Attached Inventory Items</label>
                  <div className="mt-2 space-y-1">
                    {selectedDocument.attachedInventoryItems.map((item) => (
                      <div key={item.id} className="rounded bg-gray-50 p-2 text-sm">
                        {item.itemId} - {item.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => handleDownload(selectedDocument.id, selectedDocument.fileName)}
                disabled={isDownloading === selectedDocument.id}
              >
                {isDownloading === selectedDocument.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </button>
              <button
                type="button"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedDocument(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
