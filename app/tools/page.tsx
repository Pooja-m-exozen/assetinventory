"use client";

import { Button } from "@/components/ui/button";
import { Wrench, Upload, Download, FolderOpen, Image as ImageIcon, FileEdit, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ToolsPage() {
  const tools = [
    { href: "/tools/import", label: "Import", icon: Upload, description: "Import data from external sources" },
    { href: "/tools/export", label: "Export", icon: Download, description: "Export your data to various formats" },
    { href: "/tools/documents-gallery", label: "Documents Gallery", icon: FolderOpen, description: "Manage and view your documents" },
    { href: "/tools/image-gallery", label: "Image Gallery", icon: ImageIcon, description: "Browse and manage images" },
    { href: "/tools/audit", label: "Audit", icon: FileEdit, description: "Perform audits and reviews" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Tools
            </h1>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    {tool.label}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  {tool.description}
                </p>
              </Link>
            );
          })}
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

