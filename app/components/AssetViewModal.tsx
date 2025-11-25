"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Pencil,
  ChevronDown,
  Settings,
  HelpCircle,
} from "lucide-react";

interface Asset {
  id: string;
  assetTagId: string;
  description: string;
  brand: string;
  purchaseDate: string;
  status: "Available" | "Broken";
  serialNo: string;
  capacity: string;
  cost?: string;
  model?: string;
  site?: string;
  location?: string;
  category?: string;
  department?: string;
  assignedTo?: string;
  reservation?: string;
  reservationPerson?: string;
  purchasedFrom?: string;
  depreciableCost?: string;
  salvageValue?: string;
  dateAcquired?: string;
  assetLife?: string;
  depreciationMethod?: string;
  dateCreated?: string;
  createdBy?: string;
  imageUrl?: string;
}

interface AssetViewModalProps {
  asset: Asset | null;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const tabs = [
  "Details",
  "Events",
  "Photos",
  "Docs.",
  "Depreciation",
  "Warranty",
  "Linking",
  "Maint.",
  "Reserve",
  "Audit",
  "History",
];

export default function AssetViewModal({
  asset,
  onBack,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: AssetViewModalProps) {
  const [activeTab, setActiveTab] = useState("Details");

  if (!asset) return null;

  return (
    <div className="h-screen bg-white dark:bg-gray-900 overflow-hidden flex flex-col relative">
      <div className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-500" />
            <h2
              id="asset-view-title"
              className="text-xl font-bold text-gray-900 dark:text-gray-50"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '20px' }}
            >
              Asset View
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={!hasPrev}
              className="text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Prev.
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!hasNext}
              className="text-gray-700 dark:text-gray-300"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Asset Title */}
        <h3
          className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}
        >
          {asset.description}
        </h3>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit Asset
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
          >
            More Actions
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Asset Image and Summary Section */}
        <div className="mb-6">
          {/* Asset Image */}
          <div className="mb-6">
            <div className="w-full max-w-2xl h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              {asset.imageUrl ? (
                <img
                  src={asset.imageUrl}
                  alt={asset.description}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="grid grid-cols-3 gap-4 p-4 w-full h-full">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-gray-300 dark:bg-gray-600 rounded border border-gray-400 dark:border-gray-500 flex items-center justify-center"
                    >
                      <div className="w-8 h-8 bg-gray-400 dark:bg-gray-500 rounded"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Table Layout */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  {/* Left Column - Asset Specifics */}
                  <td className="align-top pr-8">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Asset Tag ID</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2">{asset.assetTagId}</td>
                        </tr>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Purchase Date</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2">{asset.purchaseDate}</td>
                        </tr>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Cost</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2">
                            {asset.cost || "₹12,000.00"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Brand</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2">{asset.brand || "Kirloskar"}</td>
                        </tr>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Model</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2">{asset.model || "NA"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                  
                  {/* Right Column - Location, Status & Reservation */}
                  <td className="align-top">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Site</td>
                          <td className="text-sm font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline py-2">
                            {asset.site || "Casagrand Boulevard"}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Location</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2">{asset.location || "Common Area"}</td>
                        </tr>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Category</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2">{asset.category || "Asset"}</td>
                        </tr>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Department</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2">{asset.department || "Asset"}</td>
                        </tr>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4">Assigned to</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2">{asset.assignedTo || "-"}</td>
                        </tr>
                        <tr>
                          <td className={cn(
                            "text-sm text-gray-700 dark:text-gray-400 py-2 pr-4",
                            asset.status === "Available"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-red-100 dark:bg-red-900"
                          )}>Status</td>
                          <td className={cn(
                            "text-sm font-medium py-2",
                            asset.status === "Available"
                              ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                              : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                          )}>
                            {asset.status}
                          </td>
                        </tr>
                        <tr>
                          <td className="text-sm text-gray-700 dark:text-gray-400 py-2 pr-4 align-top">Reservation</td>
                          <td className="text-sm font-medium text-gray-900 dark:text-gray-100 py-2 text-right">
                            <div>{asset.reservation || "Nov 19 to 20, 2025"}</div>
                            <div className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                              {asset.reservationPerson || "Pooja"}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab
                    ? "border-yellow-500 text-gray-900 dark:text-gray-50"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
                )}
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content - Details */}
        {activeTab === "Details" && (
          <div>
            <h4
              className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Asset Details
            </h4>

            <div className="space-y-6">
              {/* Miscellaneous Section */}
              <div>
                <h5
                  className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                >
                  Miscellaneous:
                </h5>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Serial No</label>
                    <input
                      type="text"
                      value={asset.serialNo || "NA"}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchased from</label>
                    <input
                      type="text"
                      value={asset.purchasedFrom || "Kirloskar"}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Custom fields Section */}
              <div>
                <h5
                  className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                >
                  Custom fields:
                </h5>
                <div className="space-y-1.5 max-w-md">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</label>
                  <input
                    type="text"
                    value={asset.capacity || ""}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
              </div>

              {/* Depreciation Section */}
              <div>
                <h5
                  className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                >
                  Depreciation:
                </h5>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Depreciable Cost</label>
                      <input
                        type="text"
                        value={asset.depreciableCost || "₹12,000.00"}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Life (months)</label>
                      <input
                        type="text"
                        value={asset.assetLife || "12"}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salvage Value</label>
                      <input
                        type="text"
                        value={asset.salvageValue || "₹500.00"}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Depr. Method</label>
                      <input
                        type="text"
                        value={asset.depreciationMethod || "Declining Balance"}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5 max-w-md">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Acquired</label>
                    <input
                      type="text"
                      value={asset.dateAcquired || "11/20/2025"}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Creation Section */}
              <div>
                <h5
                  className="text-sm font-semibold text-gray-900 dark:text-gray-50 mb-4"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                >
                  Creation:
                </h5>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Created</label>
                    <input
                      type="text"
                      value={asset.dateCreated || "11/19/2025 02:29 AM"}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created by</label>
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {asset.createdBy || "Shivanya DN"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs Content */}
        {activeTab !== "Details" && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p>Content for {activeTab} tab will be displayed here.</p>
          </div>
        )}
      </div>
      
      {/* Need Help Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-10">
        <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2 shadow-lg">
          <HelpCircle className="h-4 w-4" />
          Need Help?
        </Button>
      </div>
    </div>
  );
}

