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
} from "lucide-react";
import { useState } from "react";

interface MaintenanceHistory {
  id: string;
  scheduleDate: string;
  title: string;
  maintenanceBy: string;
  maintenanceStatus: "Scheduled" | "Completed" | "Cancelled";
  completionDate: string;
  maintenanceCost: string;
}

interface Asset {
  id: string;
  assetTagId: string;
  purchaseCost: string;
  description: string;
  location: string;
  site: string;
}

const assetTags = ["EXO/2025/CGB-WTP-01", "EXO/2025/CGB-WTP-D01", "EXO/2025/CGB-WTP-D02"];

const dummyAsset: Asset = {
  id: "1",
  assetTagId: "EXO/2025/CGB-WTP-01",
  purchaseCost: "₹12,000.00",
  description: "Water Treatment Plant 200 KLD",
  location: "Common Area",
  site: "Casagrand Boulevard",
};

const dummyMaintenanceHistory: MaintenanceHistory[] = [
  {
    id: "1",
    scheduleDate: "11/20/2025",
    title: "Testing",
    maintenanceBy: "Pooja",
    maintenanceStatus: "Scheduled",
    completionDate: "",
    maintenanceCost: "₹1,000.00",
  },
  {
    id: "2",
    scheduleDate: "",
    title: "",
    maintenanceBy: "",
    maintenanceStatus: "Scheduled",
    completionDate: "",
    maintenanceCost: "₹1,000.00",
  },
];

export default function MaintenanceReportsHistoryByAssetTagPage() {
  const [selectedAssetTag, setSelectedAssetTag] = useState("EXO/2025/CGB-WTP-01");

  const currentAssetIndex = assetTags.indexOf(selectedAssetTag);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Report Asset Maintenance History by Asset Tag
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

        {/* Asset Tag Selection and Action Bar */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              AssetTag:
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (currentAssetIndex > 0) {
                    setSelectedAssetTag(assetTags[currentAssetIndex - 1]);
                  }
                }}
                disabled={currentAssetIndex === 0}
                className={cn(
                  "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                  currentAssetIndex === 0 && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <select
                value={selectedAssetTag}
                onChange={(e) => setSelectedAssetTag(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                {assetTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (currentAssetIndex < assetTags.length - 1) {
                    setSelectedAssetTag(assetTags[currentAssetIndex + 1]);
                  }
                }}
                disabled={currentAssetIndex === assetTags.length - 1}
                className={cn(
                  "p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700",
                  currentAssetIndex === assetTags.length - 1 && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
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

        {/* Asset Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-4 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Asset Tag: {dummyAsset.assetTagId}
            </h2>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex">
                  <div className="w-1/3 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Purchase Cost
                  </div>
                  <div className="w-2/3 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    {dummyAsset.purchaseCost}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Description
                  </div>
                  <div className="w-2/3 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    {dummyAsset.description}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <div className="w-1/3 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Location
                  </div>
                  <div className="w-2/3 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    {dummyAsset.location}
                  </div>
                </div>
                <div className="flex">
                  <div className="w-1/3 bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Site
                  </div>
                  <div className="w-2/3 bg-white dark:bg-gray-800 px-4 py-2 text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    {dummyAsset.site}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance History Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50 dark:bg-yellow-900/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Schedule date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Maintenance By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Maintenance Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Completion Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Maintenance Cost
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {dummyMaintenanceHistory.map((maintenance) => (
                  <tr key={maintenance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {maintenance.scheduleDate || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {maintenance.title || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {maintenance.maintenanceBy || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {maintenance.maintenanceStatus}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {maintenance.completionDate || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      {maintenance.maintenanceCost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

