"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flag, List, Search, FileSpreadsheet, Upload, Settings, ChevronLeft, ChevronRight, ArrowUpDown, HelpCircle, Clock } from "lucide-react";
import { useState } from "react";

interface Maintenance {
  id: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  expires: string;
  assetTagId: string;
  description: string;
  title: string;
  maintenanceDetail: string;
}

const dummyMaintenances: Maintenance[] = [];

export default function MaintenanceOverduePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState<"list" | "search">("list");

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const totalRecords = dummyMaintenances.length;
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const paginatedMaintenances = dummyMaintenances.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportToExcel = () => {
    console.log("Exporting to Excel...");
  };

  const handleImportMaintenance = () => {
    console.log("Importing maintenance...");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {/* Title Row */}
          <div className="flex items-center gap-2 mb-4">
            <Flag className="h-5 w-5 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '20px' }}>
              Maintenance Overdue
            </h1>
          </div>

          {/* Tabs and Action Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setActiveTab("list")}
                className={cn(
                  "flex items-center gap-2",
                  activeTab === "list"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <List className="h-4 w-4" />
                <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>List of Maintenance Overdue</span>
              </Button>
              <Button
                onClick={() => setActiveTab("search")}
                className={cn(
                  "flex items-center gap-2",
                  activeTab === "search"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-50"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Search className="h-4 w-4" />
                <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>Search Criteria</span>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExportToExcel}
                className="flex items-center gap-2 border-gray-300"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>Export to Excel</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleImportMaintenance}
                className="flex items-center gap-2 border-gray-300"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Upload className="h-4 w-4" />
                <span>Import Maintenance</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Settings className="h-4 w-4" />
                <span>Setup Columns</span>
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
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={cn(
                    "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                    (currentPage === totalPages || totalPages === 0) && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Dropdown */}
          <div className="mb-4">
            <select
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <option value="overdue">Maintenance Overdue</option>
              <option value="all">All Maintenances</option>
            </select>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Assets that are more than 7 days overdue for maintenance (as indicated by 'overdue time').
            </p>
          </div>

          {/* Display Options */}
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Maintenances
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
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      Status
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("expires")}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      Expires
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
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
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      Title
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("maintenanceDetail")}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      Maintenance Detail
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedMaintenances.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-20 text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        No maintenances available.
                      </p>
                    </td>
                  </tr>
                ) : (
                  paginatedMaintenances.map((maintenance) => (
                    <tr key={maintenance.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span
                            className="text-sm text-gray-900 dark:text-gray-100"
                            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                          >
                            {maintenance.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="text-sm text-gray-900 dark:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          {maintenance.expires}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <a
                          href="#"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          {maintenance.assetTagId}
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="text-sm text-gray-900 dark:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          {maintenance.description}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="text-sm text-gray-900 dark:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          {maintenance.title}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className="text-sm text-gray-900 dark:text-gray-100"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          {maintenance.maintenanceDetail}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
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
                disabled={currentPage === totalPages || totalPages === 0}
                className={cn(
                  "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                  (currentPage === totalPages || totalPages === 0) && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Need Help Button */}
      <div className="fixed bottom-6 right-6">
        <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
