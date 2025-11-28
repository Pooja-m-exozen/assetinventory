"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Search,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  ExternalLink,
  CheckSquare,
  List,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import SetupColumns from "@/app/components/SetupColumns";
import AssetViewModal from "@/app/components/AssetViewModal";
import {
  getAssetsList,
  exportAssetsList,
  type ListAsset,
} from "@/lib/api/lists";

interface Asset {
  id: string;
  assetTagId: string;
  description: string;
  brand: string;
  purchaseDate: string;
  status: "Available" | "Broken";
  serialNo: string;
  capacity: string;
  imageType?: string;
}

export default function ListOfAssetsPage() {
  const [assets, setAssets] = useState<ListAsset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>("purchaseDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showSetupColumns, setShowSetupColumns] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<Record<string, boolean>>({
    assetPhoto: true,
    assetTagId: true,
    brand: false,
    description: true,
    purchaseDate: true,
    serialNo: true,
    capacity: true,
    status: true,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    startRecord: 0,
    endRecord: 0,
  });

  // Fetch assets from API
  const fetchAssets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setLoading(false);
          return;
        }
      }

      const response = await getAssetsList(
        currentPage,
        itemsPerPage,
        sortColumn || undefined,
        sortDirection,
        searchQuery || undefined,
        statusFilter || undefined
      );

      setAssets(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch assets");
      setAssets([]);
      setPagination({
        totalRecords: 0,
        totalPages: 0,
        startRecord: 0,
        endRecord: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, sortColumn, sortDirection, searchQuery, statusFilter]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page on sort
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page
  };

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      setError(null);

      const blob = await exportAssetsList(
        "csv",
        sortColumn || undefined,
        sortDirection,
        searchQuery || undefined,
        statusFilter || undefined
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `assets_export_${new Date().toISOString().split("T")[0]}.csv`;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting assets:", err);
      setError(err instanceof Error ? err.message : "Failed to export assets");
    } finally {
      setExporting(false);
    }
  };

  // Show Setup Columns page if toggled
  if (showSetupColumns) {
    return (
      <SetupColumns
        selectedColumns={selectedColumns}
        onColumnsChange={(columns) => {
          setSelectedColumns(columns);
          setShowSetupColumns(false);
        }}
        onBack={() => setShowSetupColumns(false)}
      />
    );
  }

  const handleViewAsset = (asset: ListAsset) => {
    const assetForModal: Asset = {
      id: asset.id,
      assetTagId: asset.assetTagId,
      description: asset.description,
      brand: asset.brand || "",
      purchaseDate: asset.purchaseDate || "",
      status: asset.status as "Available" | "Broken",
      serialNo: asset.serialNo || "",
      capacity: asset.capacity || "",
      imageType: asset.imageType,
    };
    setSelectedAsset(assetForModal);
  };

  const handleBackToList = () => {
    setSelectedAsset(null);
  };

  const handlePrevAsset = () => {
    if (!selectedAsset) return;
    const currentIndex = assets.findIndex((a) => a.id === selectedAsset.id);
    if (currentIndex > 0) {
      const asset = assets[currentIndex - 1];
      const assetForModal: Asset = {
        id: asset.id,
        assetTagId: asset.assetTagId,
        description: asset.description,
        brand: asset.brand || "",
        purchaseDate: asset.purchaseDate || "",
        status: asset.status as "Available" | "Broken",
        serialNo: asset.serialNo || "",
        capacity: asset.capacity || "",
        imageType: asset.imageType,
      };
      setSelectedAsset(assetForModal);
    } else if (currentPage > 1) {
      // Load previous page
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextAsset = () => {
    if (!selectedAsset) return;
    const currentIndex = assets.findIndex((a) => a.id === selectedAsset.id);
    if (currentIndex < assets.length - 1) {
      const asset = assets[currentIndex + 1];
      const assetForModal: Asset = {
        id: asset.id,
        assetTagId: asset.assetTagId,
        description: asset.description,
        brand: asset.brand || "",
        purchaseDate: asset.purchaseDate || "",
        status: asset.status as "Available" | "Broken",
        serialNo: asset.serialNo || "",
        capacity: asset.capacity || "",
        imageType: asset.imageType,
      };
      setSelectedAsset(assetForModal);
    } else if (currentPage < pagination.totalPages) {
      // Load next page
      setCurrentPage(currentPage + 1);
    }
  };

  const getCurrentAssetIndex = () => {
    if (!selectedAsset) return -1;
    return assets.findIndex((a) => a.id === selectedAsset.id);
  };

  // Show Asset View if an asset is selected
  if (selectedAsset) {
    return (
      <AssetViewModal
        asset={selectedAsset}
        onBack={handleBackToList}
        onPrev={handlePrevAsset}
        onNext={handleNextAsset}
        hasPrev={getCurrentAssetIndex() > 0 || currentPage > 1}
        hasNext={getCurrentAssetIndex() < assets.length - 1 || currentPage < pagination.totalPages}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {/* Title Row */}
          <div className="flex items-center gap-2 mb-4">
            <List className="h-5 w-5 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '20px' }}>
              List of Assets
            </h1>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
              <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
              {error}
            </div>
          )}

          {/* Search and Action Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2 border-gray-300">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>Search Assets</span>
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
                <Search className="h-4 w-4 text-white" />
                <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>Search Criteria</span>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleExportToExcel}
                disabled={exporting || loading}
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Export to Excel</span>
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowSetupColumns(true)}>
                <Settings className="h-4 w-4" />
                <span>Setup Columns</span>
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 bg-yellow-500 text-gray-900 hover:bg-yellow-600">
                  {currentPage}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              disabled={loading}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              assets
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Table */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <CheckSquare className="h-4 w-4 text-gray-400" />
                    </th>
                    {selectedColumns.assetPhoto && (
                      <th className="px-4 py-3 text-left">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Asset Photo
                        </span>
                      </th>
                    )}
                    {selectedColumns.assetTagId && (
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("assetTagId")}
                          className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          Asset Tag ID
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    )}
                    {selectedColumns.description && (
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("description")}
                          className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          Description
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    )}
                    {selectedColumns.brand && (
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("brand")}
                          className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          Brand
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    )}
                    {selectedColumns.purchaseDate && (
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("purchaseDate")}
                          className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          Purchase Date
                          {sortColumn === "purchaseDate" && (
                            <span className={cn("text-yellow-500", sortDirection === "asc" ? "rotate-180" : "")}>
                              ↑
                            </span>
                          )}
                        </button>
                      </th>
                    )}
                    {selectedColumns.status && (
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          Status
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    )}
                    {selectedColumns.serialNo && (
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("serialNo")}
                          className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          Serial No
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    )}
                    {selectedColumns.capacity && (
                      <th className="px-4 py-3 text-left">
                        <button
                          onClick={() => handleSort("capacity")}
                          className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          Capacity
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </th>
                    )}
                    <th className="px-4 py-3 text-left">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Action
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {assets.length === 0 ? (
                    <tr>
                      <td colSpan={Object.values(selectedColumns).filter(Boolean).length + 2} className="px-4 py-8 text-center text-gray-500">
                        No assets found
                      </td>
                    </tr>
                  ) : (
                    assets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <td className="px-4 py-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        {selectedColumns.assetTagId && (
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                {asset.assetTagId}
                              </span>
                              <ExternalLink className="h-3 w-3 text-gray-400" />
                            </div>
                          </td>
                        )}
                        {selectedColumns.description && (
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                              {asset.description}
                            </span>
                          </td>
                        )}
                        {selectedColumns.brand && (
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                              {asset.brand || "-"}
                            </span>
                          </td>
                        )}
                        {selectedColumns.purchaseDate && (
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                              {asset.purchaseDate || "-"}
                            </span>
                          </td>
                        )}
                        {selectedColumns.status && (
                          <td className="px-4 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                asset.status === "Available"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              )}
                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                            >
                              {asset.status}
                            </span>
                          </td>
                        )}
                        {selectedColumns.serialNo && (
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                              {asset.serialNo || "-"}
                            </span>
                          </td>
                        )}
                        {selectedColumns.capacity && (
                          <td className="px-4 py-4">
                            <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                              {asset.capacity || "-"}
                            </span>
                          </td>
                        )}
                        <td className="px-4 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleViewAsset(asset)}
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Showing {pagination.startRecord} to {pagination.endRecord} of {pagination.totalRecords} records
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 bg-yellow-500 text-gray-900 hover:bg-yellow-600">
                  {currentPage}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
