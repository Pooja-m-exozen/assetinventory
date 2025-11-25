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
} from "lucide-react";
import { useState } from "react";
import SetupColumns from "@/app/components/SetupColumns";
import AssetViewModal from "@/app/components/AssetViewModal";

interface Asset {
  id: string;
  assetTagId: string;
  description: string;
  brand: string;
  purchaseDate: string;
  status: "Available" | "Broken";
  serialNo: string;
  capacity: string;
  imageType?: string; // For different dummy image types
}

const dummyAssets: Asset[] = [
  {
    id: "1",
    assetTagId: "EXO/2025/CGB-WTP-01",
    description: "Water Treatment Plant 200 KLD",
    brand: "Kirloskar",
    purchaseDate: "11/19/2025",
    status: "Available",
    serialNo: "NA",
    capacity: "",
    imageType: "grid",
  },
  {
    id: "2",
    assetTagId: "EXO/2025/CGB-WTP-D01",
    description: "Dosing-1",
    brand: "",
    purchaseDate: "11/19/2025",
    status: "Broken",
    serialNo: "241114ED1022",
    capacity: "6LPH",
    imageType: "pump",
  },
  {
    id: "3",
    assetTagId: "EXO/2025/CGB-WTP-D02",
    description: "Dosing-2",
    brand: "",
    purchaseDate: "11/19/2025",
    status: "Available",
    serialNo: "241113ED1072",
    capacity: "6LPH",
    imageType: "pump",
  },
  {
    id: "4",
    assetTagId: "EXO/2025/CGB-WTP-FFP01",
    description: "Filter Feed Pump 1",
    brand: "",
    purchaseDate: "11/19/2025",
    status: "Available",
    serialNo: "A23Z8Z002943",
    capacity: "3.7HP",
    imageType: "blue-pump",
  },
  {
    id: "5",
    assetTagId: "EXO/2025/CGB-WTP-FFP02",
    description: "Filter Feed Pump-2",
    brand: "",
    purchaseDate: "11/19/2025",
    status: "Available",
    serialNo: "A23Z8Z002920",
    capacity: "3.7HP",
    imageType: "blue-pump",
  },
];

export default function ListOfAssetsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>("purchaseDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
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

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const totalRecords = dummyAssets.length;
  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);

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

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleBackToList = () => {
    setSelectedAsset(null);
  };

  const handlePrevAsset = () => {
    if (!selectedAsset) return;
    const currentIndex = dummyAssets.findIndex((a) => a.id === selectedAsset.id);
    if (currentIndex > 0) {
      setSelectedAsset(dummyAssets[currentIndex - 1]);
    }
  };

  const handleNextAsset = () => {
    if (!selectedAsset) return;
    const currentIndex = dummyAssets.findIndex((a) => a.id === selectedAsset.id);
    if (currentIndex < dummyAssets.length - 1) {
      setSelectedAsset(dummyAssets[currentIndex + 1]);
    }
  };

  const getCurrentAssetIndex = () => {
    if (!selectedAsset) return -1;
    return dummyAssets.findIndex((a) => a.id === selectedAsset.id);
  };

  // Show Asset View if an asset is selected
  if (selectedAsset) {
    return (
      <AssetViewModal
        asset={selectedAsset}
        onBack={handleBackToList}
        onPrev={handlePrevAsset}
        onNext={handleNextAsset}
        hasPrev={getCurrentAssetIndex() > 0}
        hasNext={getCurrentAssetIndex() < dummyAssets.length - 1 && getCurrentAssetIndex() >= 0}
      />
    );
  }

  const handleExportToExcel = () => {
    // Create CSV content
    const headers = Object.entries(selectedColumns)
      .filter(([_, selected]) => selected)
      .map(([key]) => {
        const columnMap: Record<string, string> = {
          assetPhoto: "Asset Photo",
          assetTagId: "Asset Tag ID",
          brand: "Brand",
          description: "Description",
          purchaseDate: "Purchase Date",
          serialNo: "Serial No",
          capacity: "Capacity",
          status: "Status",
        };
        return columnMap[key] || key;
      });

    const rows = dummyAssets.map((asset) => {
      return Object.entries(selectedColumns)
        .filter(([_, selected]) => selected)
        .map(([key]) => {
          const valueMap: Record<string, string> = {
            assetPhoto: "",
            assetTagId: asset.assetTagId,
            brand: asset.brand || "",
            description: asset.description,
            purchaseDate: asset.purchaseDate,
            serialNo: asset.serialNo,
            capacity: asset.capacity || "",
            status: asset.status,
          };
          return valueMap[key] || "";
        });
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `assets_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <Button variant="outline" className="flex items-center gap-2" onClick={handleExportToExcel}>
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export to Excel</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowSetupColumns(true)}>
                <Settings className="h-4 w-4" />
                <span>Setup Columns</span>
              </Button>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 bg-yellow-500 text-gray-900 hover:bg-yellow-600">
                  1
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
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
                {dummyAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-4 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.assetTagId}
                        </span>
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {asset.description}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {asset.brand || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {asset.purchaseDate}
                      </span>
                    </td>
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
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {asset.serialNo}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {asset.capacity || "-"}
                      </span>
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Showing {startRecord} to {endRecord} of {totalRecords} records
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 bg-yellow-500 text-gray-900 hover:bg-yellow-600">
                1
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
