"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Package,
  MapPin,
  Search,
  FileSpreadsheet,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
} from "lucide-react";
import { useState } from "react";
import SetupColumns from "@/app/components/SetupColumns";
import InventoryViewModal from "@/app/components/InventoryViewModal";

interface InventoryItem {
  id: string;
  inventoryTagId: string;
  description: string;
  unit?: string;
  stock: number;
  category?: string;
  notes?: string;
  imageUrl?: string;
}

const dummyInventoryItems: InventoryItem[] = [
  {
    id: "1",
    inventoryTagId: "EXO/2025/CGB-WT-01",
    description: "Walkie Talkie",
    stock: 2,
    category: "Asset",
  },
];

export default function InventoryListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showSetupColumns, setShowSetupColumns] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(dummyInventoryItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const totalRecords = dummyInventoryItems.length;
  const startRecord = (currentPage - 1) * itemsPerPage + 1;
  const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const paginatedItems = dummyInventoryItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportToExcel = () => {
    // Handle export to Excel
    console.log("Exporting to Excel...");
  };

  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item);
  };

  const handleBackToList = () => {
    setSelectedItem(null);
  };

  const handlePrevItem = () => {
    if (!selectedItem) return;
    const currentIndex = dummyInventoryItems.findIndex((i) => i.id === selectedItem.id);
    if (currentIndex > 0) {
      setSelectedItem(dummyInventoryItems[currentIndex - 1]);
    }
  };

  const handleNextItem = () => {
    if (!selectedItem) return;
    const currentIndex = dummyInventoryItems.findIndex((i) => i.id === selectedItem.id);
    if (currentIndex < dummyInventoryItems.length - 1) {
      setSelectedItem(dummyInventoryItems[currentIndex + 1]);
    }
  };

  const getCurrentItemIndex = () => {
    if (!selectedItem) return -1;
    return dummyInventoryItems.findIndex((i) => i.id === selectedItem.id);
  };

  // Show Setup Columns page if toggled
  if (showSetupColumns) {
    return (
      <SetupColumns
        selectedColumns={{}}
        onColumnsChange={() => {
          setShowSetupColumns(false);
        }}
        onBack={() => setShowSetupColumns(false)}
      />
    );
  }

  // Show Inventory View if an item is selected
  if (selectedItem) {
    return (
      <InventoryViewModal
        item={selectedItem}
        onBack={handleBackToList}
        onPrev={handlePrevItem}
        onNext={handleNextItem}
        hasPrev={getCurrentItemIndex() > 0}
        hasNext={getCurrentItemIndex() < dummyInventoryItems.length - 1 && getCurrentItemIndex() >= 0}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-6 w-6 text-orange-500" />
          <h1
            className="text-2xl font-bold text-gray-900 dark:text-gray-50"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}
          >
            List of Inventory Items
          </h1>
        </div>

        {/* Search and Action Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span
                className="text-sm text-gray-700 dark:text-gray-300"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Search Inventory Items
              </span>
            </div>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Search className="h-4 w-4" />
              Search Criteria
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportToExcel}
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export to Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSetupColumns(true)}
              className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Settings className="h-4 w-4" />
              Setup Columns
            </Button>
          </div>
        </div>

        {/* Table Controls and Pagination (Top) */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-sm text-gray-700 dark:text-gray-300"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Show
            </span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span
              className="text-sm text-gray-700 dark:text-gray-300"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Items
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-gray-300 dark:border-gray-600"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <button
              className={cn(
                "px-3 py-1 rounded text-sm transition-colors",
                "bg-yellow-500 text-gray-900 font-medium"
              )}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {currentPage}
            </button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-300 dark:border-gray-600"
              size="sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Inventory Items Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600">
                    <input
                      type="checkbox"
                      checked={
                        paginatedItems.length > 0 &&
                        paginatedItems.every((item) => selectedItems.includes(item.id))
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("inventoryTagId")}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Inventory Tag ID
                      </span>
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("description")}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Description
                      </span>
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("unit")}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Unit
                      </span>
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("stock")}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Stock
                      </span>
                      <ArrowUpDown className="h-4 w-4 text-gray-400" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href="#"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {item.inventoryTagId}
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm text-gray-900 dark:text-gray-100"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {item.description}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm text-gray-700 dark:text-gray-300"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {item.unit || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-sm text-gray-900 dark:text-gray-100"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewItem(item)}
                        className="flex items-center gap-2 border-gray-300 dark:border-gray-600"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Summary and Pagination (Bottom) */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span
              className="text-sm text-gray-700 dark:text-gray-300"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Showing {startRecord} to {endRecord} of {totalRecords} records
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="border-gray-300 dark:border-gray-600"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <button
              className={cn(
                "px-3 py-1 rounded text-sm transition-colors",
                "bg-yellow-500 text-gray-900 font-medium"
              )}
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              {currentPage}
            </button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="border-gray-300 dark:border-gray-600"
              size="sm"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

