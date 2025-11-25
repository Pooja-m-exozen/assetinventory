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
  X,
  Search,
} from "lucide-react";
import { useState } from "react";

interface Asset {
  id: string;
  assetTagId: string;
  relation: "Parent" | "Child";
  description: string;
  status: string;
  assignedTo: string;
  purchaseDate: string;
  cost: string;
}

const dummyAssets: Asset[] = [
  {
    id: "1",
    assetTagId: "EXO/2025/CGB-WTP-01",
    relation: "Parent",
    description: "Water Treatment Plant 200 KLD",
    status: "Available",
    assignedTo: "",
    purchaseDate: "11/19/2025",
    cost: "₹12,000.00",
  },
  {
    id: "2",
    assetTagId: "EXO/2025/CGB-WTP-D01",
    relation: "Child",
    description: "Dosing-1",
    status: "Broken",
    assignedTo: "",
    purchaseDate: "11/19/2025",
    cost: "",
  },
  {
    id: "3",
    assetTagId: "EXO/2025/CGB-WTP-D02",
    relation: "Child",
    description: "Dosing-2",
    status: "Available",
    assignedTo: "",
    purchaseDate: "11/19/2025",
    cost: "",
  },
  {
    id: "4",
    assetTagId: "EXO/2025/CGB-WTP-FFP01",
    relation: "Child",
    description: "Filter Feed Pump 1",
    status: "Available",
    assignedTo: "",
    purchaseDate: "11/19/2025",
    cost: "",
  },
  {
    id: "5",
    assetTagId: "EXO/2025/CGB-WTP-FFP02",
    relation: "Child",
    description: "Filter Feed Pump-2",
    status: "Available",
    assignedTo: "",
    purchaseDate: "11/19/2025",
    cost: "",
  },
];

export default function AssetReportsByLinkedAssetsPage() {
  const [selectedAsset, setSelectedAsset] = useState("EXO/2025/CGB-WTP-01");
  const [assetInput, setAssetInput] = useState("EXO/2025/CGB-W...");

  // Calculate total cost
  const totalCost = dummyAssets.reduce((sum, asset) => {
    if (asset.cost) {
      const costValue = parseFloat(asset.cost.replace(/[₹,]/g, ""));
      return sum + (isNaN(costValue) ? 0 : costValue);
    }
    return sum;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Report Assets by Linking
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

        {/* Filter and Action Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Asset:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={assetInput}
                  onChange={(e) => setAssetInput(e.target.value)}
                  className="px-3 py-1.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', width: '200px' }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {assetInput && (
                    <button
                      onClick={() => setAssetInput("")}
                      className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  )}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
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
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50 dark:bg-yellow-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Asset Tag ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Relation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Assigned to
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Purchase Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dummyAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      <a
                        href="#"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {asset.assetTagId}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.relation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.assignedTo || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.purchaseDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {asset.cost || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              ₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Need Help Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
