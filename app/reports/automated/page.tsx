"use client";

import { Mail } from "lucide-react";

export default function AutomatedReportsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-6 w-6" style={{ color: '#8B4513' }} />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
            Automated Report
          </h1>
        </div>

        {/* White Content Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Panel Header - Heading and Message on Same Line */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              List of Automated Reports
            </h2>
            <p className="text-base font-bold text-green-800 dark:text-green-700" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              No automated report has been added.
            </p>
          </div>

          {/* Empty State Area - Part of the same white panel */}
          <div className="bg-white dark:bg-gray-800 min-h-[400px]">
            {/* This area will show the list of reports when they are added */}
          </div>
        </div>
      </div>
    </div>
  );
}

