"use client";

import { Button } from "@/components/ui/button";
import {
  FileText,
  Mail,
  Settings,
  HelpCircle,
} from "lucide-react";

export default function AuditReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Audit Reports
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

        {/* Content Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Available Audit Reports
            </h2>
          </div>

          {/* Empty State Area */}
          <div className="bg-white dark:bg-gray-800 min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <p className="text-base font-bold text-green-800 dark:text-green-700 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Select an audit report from the sidebar to view details.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Available reports: By Asset Tag, By Audit Date, By Site/Location, Non-Audited Assets, Location Discrepancy, By Funding, and Non-Audited Funding.
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

