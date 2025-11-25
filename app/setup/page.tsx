"use client";

import { Button } from "@/components/ui/button";
import { Settings, Briefcase, MapPin, List, Grid3x3, Database, CalendarCheck, Grid, Package, LayoutDashboard, FileCheck, Mail, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  const setupItems = [
    { href: "/setup/company-info", label: "Company Info.", icon: Briefcase, description: "Manage company information" },
    { href: "/setup/sites", label: "Sites", icon: MapPin, description: "Manage sites" },
    { href: "/setup/locations", label: "Locations", icon: MapPin, description: "Manage locations" },
    { href: "/setup/categories", label: "Categories", icon: List, description: "Manage categories" },
    { href: "/setup/departments", label: "Departments", icon: Grid3x3, description: "Manage departments" },
    { href: "/setup/databases", label: "Databases", icon: Database, description: "Database management" },
    { href: "/setup/events", label: "Events", icon: CalendarCheck, description: "Manage events" },
    { href: "/setup/table-options", label: "Table Options", icon: Grid, description: "Configure table options" },
    { href: "/setup/inventory", label: "Inventory", icon: Package, description: "Inventory settings" },
    { href: "/setup/options", label: "Options", icon: List, description: "System options" },
    { href: "/setup/manage-dashboard", label: "Manage Dashboard", icon: LayoutDashboard, description: "Customize dashboard" },
    { href: "/setup/customize-forms", label: "Customize Forms", icon: FileCheck, description: "Customize form fields" },
    { href: "/setup/customize-emails", label: "Customize Emails", icon: Mail, description: "Customize email templates" },
  ];

  return (
    <div className="p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Setup
            </h1>
          </div>
        </div>

        {/* Setup Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {setupItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    {item.label}
                  </h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  {item.description}
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

