"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Move,
  Plus,
  Search,
  X,
  Link as LinkIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Asset {
  id: string;
  assetTagId: string;
  description: string;
  status: "Available" | "Broken";
  assignedTo?: string;
  site: string;
  location: string;
  leaseTo?: string;
}

const dummyAssets: Asset[] = [
  {
    id: "1",
    assetTagId: "EXO/2025/CGB-WTP-01",
    description: "Water Treatment Plant 200 KLD",
    status: "Available",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
  {
    id: "2",
    assetTagId: "EXO/2025/CGB-WTP-D01",
    description: "Dosing-1",
    status: "Broken",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
  {
    id: "3",
    assetTagId: "EXO/2025/CGB-WTP-D02",
    description: "Dosing-2",
    status: "Available",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
  {
    id: "4",
    assetTagId: "EXO/2025/CGB-WTP-FFP01",
    description: "Filter Feed Pump 1",
    status: "Available",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
  {
    id: "5",
    assetTagId: "EXO/2025/CGB-WTP-FFP02",
    description: "Filter Feed Pump-2",
    status: "Available",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
];

export default function MovePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const filteredAssets = dummyAssets.filter(
    (asset) =>
      asset.assetTagId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssets.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(paginatedAssets.map((asset) => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectAsset = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleAddToList = () => {
    // Handle adding selected assets to list
    console.log("Selected assets:", selectedAssets);
    setIsModalOpen(false);
    setSelectedAssets([]);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Move className="h-6 w-6 text-orange-500" />
          <h1
            className="text-3xl font-bold text-gray-900 dark:text-gray-50"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '28px' }}
          >
        Move
      </h1>
        </div>

        {/* Description */}
        <p
          className="text-gray-700 dark:text-gray-300 mb-6"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '15px' }}
        >
          Relocate any number of assets in a single action. Ensure that your assets have the most comprehensive data possible by tracking their movement.
        </p>

        {/* Select Assets Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          <Plus className="h-4 w-4" />
          Select Assets
        </Button>

        {/* Selected Assets List (will appear here after selection) */}
        {selectedAssets.length > 0 && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Selected Assets ({selectedAssets.length})
            </h2>
            {/* List of selected assets will be displayed here */}
          </div>
        )}
      </div>

      {/* Select Assets Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2
                className="text-xl font-semibold text-gray-900 dark:text-gray-50"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '20px' }}
              >
                Select Assets
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Search Bar */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
                <Button
                  type="button"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Show Entries */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm text-gray-700 dark:text-gray-300"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    Show
                  </span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
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
                    entries
                  </span>
                </div>
              </div>

              {/* Assets Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-yellow-100 dark:bg-yellow-900">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600">
                        <input
                          type="checkbox"
                          checked={
                            paginatedAssets.length > 0 &&
                            paginatedAssets.every((asset) =>
                              selectedAssets.includes(asset.id)
                            )
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Asset Tag ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Assigned to
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Site
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border border-gray-300 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        Lease to
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAssets.length > 0 ? (
                      paginatedAssets.map((asset) => (
                        <tr
                          key={asset.id}
                          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                            <input
                              type="checkbox"
                              checked={selectedAssets.includes(asset.id)}
                              onChange={() => handleSelectAsset(asset.id)}
                              className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                            <div className="flex items-center gap-2">
                              <a
                                href="#"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                              >
                                {asset.assetTagId}
                              </a>
                              <LinkIcon className="h-3 w-3 text-red-500" />
                            </div>
                          </td>
                          <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                            <div className="flex items-center gap-2">
                              <a
                                href="#"
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                              >
                                {asset.description}
                              </a>
                              <LinkIcon className="h-3 w-3 text-red-500" />
                            </div>
                          </td>
                          <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                            <span
                              className={cn(
                                "text-sm",
                                asset.status === "Available"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              )}
                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                            >
                              {asset.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                            <span
                              className="text-sm text-gray-700 dark:text-gray-300"
                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                            >
                              {asset.assignedTo || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                            <a
                              href="#"
                              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                            >
                              {asset.site}
                            </a>
                          </td>
                          <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                            <span
                              className="text-sm text-gray-700 dark:text-gray-300"
                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                            >
                              {asset.location}
                            </span>
                          </td>
                          <td className="px-4 py-3 border border-gray-300 dark:border-gray-600">
                            <span
                              className="text-sm text-gray-700 dark:text-gray-300"
                              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                            >
                              {asset.leaseTo || "-"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-4 py-8 text-center text-gray-500 dark:text-gray-400"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          No data available in table
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div>
                  <span
                    className="text-sm text-gray-700 dark:text-gray-300"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredAssets.length)} of{" "}
                    {filteredAssets.length} entries
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || filteredAssets.length === 0}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "px-3 py-1 rounded text-sm transition-colors",
                        currentPage === page
                          ? "bg-yellow-500 text-gray-900 font-medium"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      )}
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      {page}
                    </button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || filteredAssets.length === 0}
                    className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddToList}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Add to List
              </Button>
            </div>
      </div>
        </div>
      )}
    </div>
  );
}
