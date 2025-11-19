"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Settings,
  Users,
  AlertCircle,
  Package,
  Coins,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Clock,
  Shield,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
          Dashboard dashboard & statistics
        </h1>
        <Button variant="outline" size="default" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span>Manage Dashboard</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Number of Active Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Number of Active A...
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">5</div>
          </CardContent>
        </Card>

        {/* Broken */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Broken
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">1</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹0</p>
          </CardContent>
        </Card>

        {/* Total Inventory Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Inventory Items
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">1</div>
          </CardContent>
        </Card>

        {/* Value of Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Value of Assets
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <Coins className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">₹12,000</div>
          </CardContent>
        </Card>
      </div>

      {/* Reservations and Asset Value Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-gray-900 dark:text-gray-50">NOVEMBER 2025</span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-1">
                <Button variant="default" size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xs px-3 py-1 h-7">
                  month
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                  week
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                  day
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                  list
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Calendar dates - simplified version */}
              <div className="grid grid-cols-7 gap-1">
                {[26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6].map((date, index) => {
                  const isHighlighted = date === 19 || date === 20;
                  const isPrevMonth = index < 6;
                  const isNextMonth = index >= 35;
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center text-sm rounded",
                        isPrevMonth || isNextMonth ? "text-gray-400" : "text-gray-900 dark:text-gray-50",
                        isHighlighted && "bg-yellow-500 text-gray-900 font-semibold"
                      )}
                    >
                      <span>{date}</span>
                      {isHighlighted && (
                        <span className="text-xs mt-0.5">+1 more</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Value by Category */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Asset Value by Category</CardTitle>
              <div className="flex gap-1">
                <Button variant="default" size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xs px-3 py-1 h-7">
                  VERT
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1 h-7">
                  HORZ
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Chart placeholder */}
            <div className="h-64 flex items-end justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 bg-blue-500 rounded-t" style={{ height: '200px' }}></div>
                <span className="text-xs text-gray-600 dark:text-gray-400 transform -rotate-90 whitespace-nowrap">Asset</span>
              </div>
              <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400">
                <div>₹11001</div>
                <div>₹11000.8</div>
                <div>₹11000.6</div>
                <div>₹11000.4</div>
                <div>₹11000.2</div>
                <div>₹11000</div>
                <div>₹10999.8</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Alert</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="default" className="bg-blue-500 hover:bg-blue-600 text-white">
              Assets Due
            </Button>
            <Button variant="default" className="bg-purple-500 hover:bg-purple-600 text-white">
              Maintenance Due
            </Button>
            <Button variant="default" className="bg-red-500 hover:bg-red-600 text-white">
              Warranty Expiring
            </Button>
            <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
              Lease Expiring
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

