"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Save,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
  MoreVertical,
} from "lucide-react";
import { useState } from "react";

interface Asset {
  id: string;
  assetTagId: string;
  description: string;
  brand: string;
  purchaseDate: string;
  cost: string;
  status: "Available" | "Broken";
  imageType?: string;
}

const dummyAssets: Asset[] = [
  {
    id: "1",
    assetTagId: "EXO/2025/CGB-WTP-D02",
    description: "Dosing-2",
    brand: "",
    purchaseDate: "11/19/2025",
    cost: "",
    status: "Available",
    imageType: "orange-compressor",
  },
  {
    id: "2",
    assetTagId: "EXO/2025/CGB-WTP-D01",
    description: "Dosing-1",
    brand: "",
    purchaseDate: "11/19/2025",
    cost: "",
    status: "Broken",
    imageType: "orange-compressor",
  },
  {
    id: "3",
    assetTagId: "EXO/2025/CGB-WTP-FFP02",
    description: "Filter Feed Pump-2",
    brand: "",
    purchaseDate: "11/19/2025",
    cost: "",
    status: "Available",
    imageType: "blue-pump",
  },
  {
    id: "4",
    assetTagId: "EXO/2025/CGB-WTP-FFP01",
    description: "Filter Feed Pump 1",
    brand: "",
    purchaseDate: "11/19/2025",
    cost: "",
    status: "Available",
    imageType: "blue-pump",
  },
  {
    id: "5",
    assetTagId: "EXO/2025/CGB-WTP-01",
    description: "Water Treatment Plant 200 KLD",
    brand: "Kirloskar",
    purchaseDate: "11/19/2025",
    cost: "₹12,000.00",
    status: "Available",
    imageType: "white-plant",
  },
];

export default function PPPReportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<"ppp" | "search">("ppp");
  const [showMoreActions, setShowMoreActions] = useState(false);

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
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const paginatedAssets = dummyAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getAssetImage = (imageType?: string) => {
    switch (imageType) {
      case "orange-compressor":
        return "https://via.placeholder.com/40x40/FF8C00/FFFFFF?text=AC";
      case "blue-pump":
        return "https://via.placeholder.com/40x40/0066CC/FFFFFF?text=FP";
      case "white-plant":
        return "https://via.placeholder.com/40x40/CCCCCC/000000?text=WT";
      default:
        return "https://via.placeholder.com/40x40/CCCCCC/000000?text=AS";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Setup Custom Report
            </h1>
          </div>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          >
            <Save className="h-4 w-4" />
            Save Report
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab("ppp")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-gray-100 dark:bg-gray-700",
              activeTab === "ppp"
                ? "text-orange-600 dark:text-orange-500 border-b-2 border-orange-600 dark:border-orange-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          >
            <FileText className="h-4 w-4" />
            ppp
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
              activeTab === "search"
                ? "text-green-600 dark:text-green-500 border-b-2 border-green-600 dark:border-green-500"
                : "bg-green-500 hover:bg-green-600 text-white"
            )}
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          >
            <Search className="h-4 w-4" />
            Search Criteria
          </button>
        </div>

        {/* Content Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Table Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  <MoreVertical className="h-4 w-4" />
                  More Actions
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Settings className="h-4 w-4" />
                Setup Columns
              </Button>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={cn(
                    "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                    currentPage === 1 && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm font-medium" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={cn(
                    "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                    currentPage === totalPages && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50 dark:bg-yellow-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {/* Empty column for images */}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Asset Tag ID</span>
                      <button onClick={() => handleSort("assetTagId")} className="hover:text-gray-700 dark:hover:text-gray-300">
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Description</span>
                      <button onClick={() => handleSort("description")} className="hover:text-gray-700 dark:hover:text-gray-300">
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Brand</span>
                      <button onClick={() => handleSort("brand")} className="hover:text-gray-700 dark:hover:text-gray-300">
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Purchase Date</span>
                      <button onClick={() => handleSort("purchaseDate")} className="hover:text-gray-700 dark:hover:text-gray-300">
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Cost</span>
                      <button onClick={() => handleSort("cost")} className="hover:text-gray-700 dark:hover:text-gray-300">
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <button onClick={() => handleSort("status")} className="hover:text-gray-700 dark:hover:text-gray-300">
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={getAssetImage(asset.imageType)}
                        alt={asset.description}
                        className="w-10 h-10 rounded object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href="#"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                      >
                        {asset.assetTagId}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.brand || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.purchaseDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.cost || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-medium rounded",
                          asset.status === "Available"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        )}
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Showing {startRecord} to {endRecord} of {totalRecords} records
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                  currentPage === 1 && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <span className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm font-medium" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                  currentPage === totalPages && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
