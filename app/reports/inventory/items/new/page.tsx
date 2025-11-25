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
  List,
} from "lucide-react";
import { useState } from "react";

interface InventoryItem {
  id: string;
  inventoryTagId: string;
  description: string;
  unit: string;
  stock: number;
}

const dummyInventoryItems: InventoryItem[] = [
  {
    id: "1",
    inventoryTagId: "EXO/2025/CGB-WT-01",
    description: "Walkie Talkie",
    unit: "",
    stock: 2,
  },
];

export default function InventoryItemsNewReportPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<"inventory" | "search">("inventory");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const totalRecords = dummyInventoryItems.length;
  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const paginatedItems = dummyInventoryItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Setup Inventory Items Report
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
            onClick={() => setActiveTab("inventory")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-colors bg-gray-100 dark:bg-gray-700",
              activeTab === "inventory"
                ? "text-orange-600 dark:text-orange-500 border-b-2 border-orange-600 dark:border-orange-500"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          >
            <List className="h-4 w-4" />
            Inventory Items Report
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
                Items
              </span>
            </div>
            <div className="flex items-center gap-2">
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
                    <div className="flex items-center gap-1">
                      <span>Inventory Tag ID</span>
                      <button onClick={() => handleSort("inventoryTagId")} className="hover:text-gray-700 dark:hover:text-gray-300">
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
                      <span>Unit</span>
                      <button onClick={() => handleSort("unit")} className="hover:text-gray-700 dark:hover:text-gray-300">
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <span>Stock</span>
                      <button onClick={() => handleSort("stock")} className="hover:text-gray-700 dark:hover:text-gray-300">
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <a
                        href="#"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                      >
                        {item.inventoryTagId}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {item.unit || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {item.stock}
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
