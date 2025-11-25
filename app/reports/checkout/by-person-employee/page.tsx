"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Mail,
  Settings,
  Download,
  Printer,
  HelpCircle,
  ChevronDown,
  X,
  User,
} from "lucide-react";
import { useState } from "react";

export default function CheckoutReportsByPersonEmployeePage() {
  const [reportType, setReportType] = useState("Current Status");
  const [selectedPerson, setSelectedPerson] = useState("Pooja");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Report Check-Out by Persons
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

        {/* Report Configuration and Action Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Report Type:
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  <option value="Current Status">Current Status</option>
                  <option value="History">History</option>
                  <option value="All">All</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  <User className="h-4 w-4" />
                  Person:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={selectedPerson}
                    onChange={(e) => setSelectedPerson(e.target.value)}
                    className="px-3 py-1.5 pr-8 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', width: '200px' }}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {selectedPerson && (
                      <button
                        onClick={() => setSelectedPerson("")}
                        className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                      >
                        <X className="h-3 w-3 text-gray-400" />
                      </button>
                    )}
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
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

          {/* Report Content Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            {selectedPerson && (
              <div className="mb-4">
                <p className="text-sm text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Person: <span className="font-bold">{selectedPerson}</span>
                </p>
              </div>
            )}
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                No assets assigned to this Person.
              </p>
            </div>
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
