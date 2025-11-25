"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  HelpCircle,
  ChevronDown,
  Image as ImageIcon,
} from "lucide-react";
import { useState } from "react";

interface Asset {
  id: string;
  assetTagId: string;
  description: string;
  purchaseDate: string;
  cost: string;
  assignedTo: string;
  category: string;
  purchasedFrom: string;
  brand: string;
  model: string;
  site: string;
  location: string;
  imageUrl?: string;
}

const dummyAssets: Asset[] = [
  {
    id: "1",
    assetTagId: "EXO/2025/CGB-WTP-01",
    description: "Water Treatment Plant 200 KLD",
    purchaseDate: "11/19/2025",
    cost: "₹12,000.00",
    assignedTo: "",
    category: "Asset",
    purchasedFrom: "Kirloskar",
    brand: "Kirloskar",
    model: "NA",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
  {
    id: "2",
    assetTagId: "EXO/2025/CGB-WTP-D01",
    description: "Dosing-1",
    purchaseDate: "11/19/2025",
    cost: "",
    assignedTo: "",
    category: "Asset",
    purchasedFrom: "",
    brand: "",
    model: "",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
  {
    id: "3",
    assetTagId: "EXO/2025/CGB-WTP-D02",
    description: "Dosing-2",
    purchaseDate: "11/19/2025",
    cost: "",
    assignedTo: "",
    category: "Asset",
    purchasedFrom: "",
    brand: "",
    model: "",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
  {
    id: "4",
    assetTagId: "EXO/2025/CGB-WTP-FFP01",
    description: "Filter Feed Pump 1",
    purchaseDate: "11/19/2025",
    cost: "",
    assignedTo: "",
    category: "Asset",
    purchasedFrom: "",
    brand: "",
    model: "",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
  {
    id: "5",
    assetTagId: "EXO/2025/CGB-WTP-FFP02",
    description: "Filter Feed Pump-2",
    purchaseDate: "11/19/2025",
    cost: "",
    assignedTo: "",
    category: "Asset",
    purchasedFrom: "",
    brand: "",
    model: "",
    site: "Casagrand Boulevard",
    location: "Common Area",
  },
];

export default function AssetReportsByTagWithPicturesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const totalRecords = dummyAssets.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const paginatedAssets = dummyAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Report Assets by Tag with Pictures
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

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-4">
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
            <Button
              variant="outline"
              className="flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Download className="h-4 w-4" />
              Export
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              <Printer className="h-4 w-4" />
              Print
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

        {/* Assets List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          {paginatedAssets.map((asset) => (
            <div key={asset.id} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0 last:pb-0">
              {/* Asset Tag Header */}
              <div className="mb-4">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Asset Tag: {asset.assetTagId}
                </p>
              </div>

              {/* Asset Content - Image and Details */}
              <div className="flex gap-6">
                {/* Asset Image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                    {asset.imageUrl ? (
                      <img
                        src={asset.imageUrl}
                        alt={asset.description}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                    )}
                  </div>
                </div>

                {/* Asset Details Table */}
                <div className="flex-1">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', width: '40%' }}>
                          Description
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.description}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Purchase Date
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.purchaseDate}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Cost
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.cost || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Assigned to
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.assignedTo || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Category
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.category}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Purchased from
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.purchasedFrom || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Brand
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.brand || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Model
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.model || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Site
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.site}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Location
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          {asset.location}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Pagination */}
        <div className="flex items-center justify-center mt-6">
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

      {/* Need Help Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
