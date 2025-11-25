"use client";

import { Button } from "@/components/ui/button";
import { Briefcase, User, Users, ShieldCheck, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function AdvancedPage() {
  const advancedItems = [
    { href: "/advanced/persons-employees", label: "Persons/Employees", icon: User, description: "Manage persons and employees" },
    { href: "/advanced/customers", label: "Customers", icon: Users, description: "Manage customer information" },
    { href: "/advanced/users", label: "Users", icon: Users, description: "Manage system users" },
    { href: "/advanced/security-groups", label: "Security Groups", icon: ShieldCheck, description: "Manage security groups and permissions" },
  ];

  return (
    <div className="p-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Advanced
            </h1>
          </div>
        </div>

        {/* Advanced Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advancedItems.map((item) => {
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

