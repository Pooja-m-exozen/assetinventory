"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Package,
  Printer,
  Pencil,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ArrowUpDown,
  Trash2,
  Mail,
  Box,
} from "lucide-react";

interface InventoryItem {
  id: string;
  inventoryTagId: string;
  description: string;
  stock: number;
  category?: string;
  notes?: string;
  imageUrl?: string;
}

interface InventoryEvent {
  eventDate: string;
  event: string;
  notes?: string;
  addToStock: number;
  removeFromStock: number;
  balance: number;
}

interface InventoryViewModalProps {
  item: InventoryItem | null;
  onBack: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

const tabs = [
  "Inventory",
  "Details",
  "Photos",
  "Docs.",
  "History",
];

const dummyInventoryEvents: InventoryEvent[] = [
  {
    eventDate: "11/19/2025",
    event: "Opening Balance",
    notes: "",
    addToStock: 2,
    removeFromStock: 0,
    balance: 2,
  },
];

export default function InventoryViewModal({
  item,
  onBack,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
}: InventoryViewModalProps) {
  const [activeTab, setActiveTab] = useState("Inventory");
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const moreActionsRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target as Node)) {
        setIsMoreActionsOpen(false);
      }
    };

    if (isMoreActionsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMoreActionsOpen]);

  if (!item) return null;

  return (
    <div className="h-screen bg-white dark:bg-gray-900 overflow-hidden flex flex-col relative">
      <div className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-orange-500" />
            <h2
              className="text-xl font-bold text-gray-900 dark:text-gray-50"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '20px' }}
            >
              Inventory Item - View
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

        {/* Item Title */}
        <h3
          className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-4"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}
        >
          {item.description}
        </h3>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <div className="relative" ref={moreActionsRef}>
            <Button
              size="sm"
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white"
            >
              More Actions
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                isMoreActionsOpen ? "rotate-180" : ""
              )} />
            </Button>
            {isMoreActionsOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 min-w-[200px]">
                <button
                  onClick={() => {
                    console.log("Add to Stock");
                    setIsMoreActionsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-md"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                >
                  <Box className="h-4 w-4 text-orange-500 shrink-0" />
                  <span className="text-gray-900 dark:text-gray-200">Add to Stock</span>
                </button>
                <button
                  onClick={() => {
                    console.log("Remove from Stock");
                    setIsMoreActionsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                >
                  <Box className="h-4 w-4 text-orange-500 shrink-0" />
                  <span className="text-gray-900 dark:text-gray-200">Remove from Stock</span>
                </button>
                <button
                  onClick={() => {
                    console.log("Stock Adjustment");
                    setIsMoreActionsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                >
                  <Box className="h-4 w-4 text-orange-500 shrink-0" />
                  <span className="text-gray-900 dark:text-gray-200">Stock Adjustment</span>
                </button>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={() => {
                    console.log("Delete");
                    setIsMoreActionsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                >
                  <Trash2 className="h-4 w-4 text-red-500 shrink-0" />
                  <span className="text-gray-900 dark:text-gray-200">Delete</span>
                </button>
                <button
                  onClick={() => {
                    console.log("Email");
                    setIsMoreActionsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors last:rounded-b-md"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}
                >
                  <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                  <span className="text-gray-900 dark:text-gray-200">Email</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Item Image and Details Section */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Image Placeholder */}
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.description}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400 dark:text-gray-500 text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  No Image
                </div>
              )}
            </div>

            {/* Item Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Inventory Tag ID
                </label>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  {item.inventoryTagId}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Stock
                </label>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  {item.stock}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Category
                </label>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  {item.category || "Asset"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Notes
                </label>
                <div className="text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  {item.notes || "-"}
                </div>
              </div>
            </div>
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

        {/* Tab Content - Inventory */}
        {activeTab === "Inventory" && (
          <div>
            <h4
              className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-4"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Inventory
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                          Event Date
                        </span>
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      Event
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      Notes
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      Add to Stock
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      Remove from Stock
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-50 border-b border-gray-200 dark:border-gray-600" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dummyInventoryEvents.map((event, index) => (
                    <tr
                      key={index}
                      className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {event.eventDate}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {event.event}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {event.notes || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {event.addToStock || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {event.removeFromStock || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                        {event.balance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other Tabs Content */}
        {activeTab !== "Inventory" && (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            <p style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Content for {activeTab} tab will be displayed here.
            </p>
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

