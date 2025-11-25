"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Mail,
  Download,
  Printer,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface DeletedInventoryItem {
  id: string;
  inventoryTagId: string;
  description: string;
  unit: string;
  stock: string;
  deletedBy: string;
  deletedOn: string;
}

const dummyDeletedItems: DeletedInventoryItem[] = [
  {
    id: "1",
    inventoryTagId: "12es",
    description: "aa",
    unit: "Battery",
    stock: "5 Battery",
    deletedBy: "Shivanya DN",
    deletedOn: "11/19/2025 02:21 AM",
  },
];

export default function DeletedInventoryItemsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [filterResult, setFilterResult] = useState("Last 7 Days");
  const [deletedBy, setDeletedBy] = useState("Any");
  const [showExportMenu, setShowExportMenu] = useState(false);

  const totalRecords = dummyDeletedItems.length;
  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const paginatedItems = dummyDeletedItems.slice(
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
              Report Deleted Inventory Items
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Mail className="h-4 w-4" />
              Automated Report
            </Button>
            <Button
              className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Settings className="h-4 w-4" />
              Setup
            </Button>
          </div>
        </div>

        {/* Filters and Controls Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center gap-6 flex-wrap">
            {/* Filter Result */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Filter result:
              </label>
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Last 90 Days">Last 90 Days</option>
                <option value="All Time">All Time</option>
              </select>
            </div>

            {/* Deleted By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Deleted By:
              </label>
              <select
                value={deletedBy}
                onChange={(e) => setDeletedBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <option value="Any">Any</option>
                <option value="Shivanya DN">Shivanya DN</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="flex items-center gap-2 ml-auto">
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
                Item
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>

            {/* Pagination */}
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

        {/* Content Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50 dark:bg-yellow-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Inventory Tag ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Unit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Deleted By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Deleted On
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
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {item.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {item.deletedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {item.deletedOn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
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
