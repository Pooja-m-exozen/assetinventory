"use client";

import { useState } from "react";
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
  TrendingUp,
  ArrowRight,
  CalendarCheck,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [chartView, setChartView] = useState<"VERT" | "HORZ">("VERT");
  
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase();
  
  // Chart data
  const chartData = [
    { category: "Electronics", value: 11000, color: "blue" },
    { category: "Furniture", value: 8500, color: "green" },
    { category: "Vehicles", value: 12500, color: "yellow" },
    { category: "Equipment", value: 6500, color: "purple" },
    { category: "Tools", value: 3200, color: "orange" },
  ];

  const maxValue = Math.max(...chartData.map(item => item.value));
  const minValue = Math.min(...chartData.map(item => item.value));
  const valueRange = maxValue - minValue;
  
  // Generate Y-axis labels
  const yAxisLabels = [];
  const steps = 6;
  for (let i = steps; i >= 0; i--) {
    const value = minValue + (valueRange / steps) * i;
    yAxisLabels.push(Math.round(value));
  }
  
  // Generate calendar dates for current month
  const getCalendarDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const dates = [];
    
    // Previous month dates
    for (let i = firstDay - 1; i >= 0; i--) {
      dates.push({ date: daysInPrevMonth - i, isPrevMonth: true, isNextMonth: false });
    }
    
    // Current month dates
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({ date: i, isPrevMonth: false, isNextMonth: false });
    }
    
    // Next month dates to fill the grid
    const remaining = 42 - dates.length;
    for (let i = 1; i <= remaining; i++) {
      dates.push({ date: i, isPrevMonth: false, isNextMonth: true });
    }
    
    return dates;
  };

  const calendarDates = getCalendarDates();
  const today = currentDate.getDate();
  
  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; hover: string; text: string; gradient: string } } = {
      blue: {
        bg: "bg-blue-500",
        hover: "hover:bg-blue-600",
        text: "text-blue-600 dark:text-blue-400",
        gradient: "from-blue-500 to-blue-400"
      },
      green: {
        bg: "bg-green-500",
        hover: "hover:bg-green-600",
        text: "text-green-600 dark:text-green-400",
        gradient: "from-green-500 to-green-400"
      },
      yellow: {
        bg: "bg-yellow-500",
        hover: "hover:bg-yellow-600",
        text: "text-yellow-600 dark:text-yellow-400",
        gradient: "from-yellow-500 to-yellow-400"
      },
      purple: {
        bg: "bg-purple-500",
        hover: "hover:bg-purple-600",
        text: "text-purple-600 dark:text-purple-400",
        gradient: "from-purple-500 to-purple-400"
      },
      orange: {
        bg: "bg-orange-500",
        hover: "hover:bg-orange-600",
        text: "text-orange-600 dark:text-orange-400",
        gradient: "from-orange-500 to-orange-400"
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
            Dashboard & Statistics
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of your asset management system
          </p>
        </div>
        <Button variant="outline" size="default" className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Settings className="h-4 w-4" />
          <span>Manage Dashboard</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Number of Active Assets */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Assets
            </CardTitle>
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">5</div>
              <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="h-3 w-3" />
                <span>+2</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total active assets</p>
          </CardContent>
        </Card>

        {/* Broken */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Broken Assets
            </CardTitle>
            <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shadow-sm">
              <AlertCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">1</div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Value: ₹0</p>
          </CardContent>
        </Card>

        {/* Total Inventory Items */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Inventory Items
            </CardTitle>
            <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shadow-sm">
              <Package className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">1</div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total items in inventory</p>
          </CardContent>
        </Card>

        {/* Value of Assets */}
        <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Asset Value
            </CardTitle>
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center shadow-sm">
              <Coins className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-50">₹12,000</div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Total value of all assets</p>
          </CardContent>
        </Card>
      </div>

      {/* Reservations and Asset Value Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservations */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Reservations
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-semibold text-gray-900 dark:text-gray-50 text-sm">{currentMonth}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-1">
                <Button variant="default" size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 text-xs px-3 py-1.5 h-7">
                  Month
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1.5 h-7 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Week
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1.5 h-7 hover:bg-gray-100 dark:hover:bg-gray-800">
                  Day
                </Button>
                <Button variant="outline" size="sm" className="text-xs px-3 py-1.5 h-7 hover:bg-gray-100 dark:hover:bg-gray-800">
                  List
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
              {/* Days of week */}
              <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-gray-600 dark:text-gray-400 text-center pb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="py-1">{day}</div>
                ))}
              </div>

              {/* Calendar dates */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDates.map((item, index) => {
                  const isHighlighted = item.date === 19 || item.date === 20;
                  const isToday = !item.isPrevMonth && !item.isNextMonth && item.date === today;
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "aspect-square flex flex-col items-center justify-center text-sm rounded-md transition-colors",
                        item.isPrevMonth || item.isNextMonth 
                          ? "text-gray-400 dark:text-gray-600" 
                          : "text-gray-900 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                        isToday && "ring-2 ring-blue-500 dark:ring-blue-400",
                        isHighlighted && !item.isPrevMonth && !item.isNextMonth && "bg-yellow-500 text-gray-900 font-semibold hover:bg-yellow-600"
                      )}
                    >
                      <span>{item.date}</span>
                      {isHighlighted && !item.isPrevMonth && !item.isNextMonth && (
                        <span className="text-xs mt-0.5">+1</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Value by Category */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
                Asset Value by Category
              </CardTitle>
              <div className="flex gap-1">
                <Button 
                  variant={chartView === "VERT" ? "default" : "outline"}
                  size="sm" 
                  className={cn(
                    "text-xs px-3 py-1.5 h-7 transition-colors",
                    chartView === "VERT" 
                      ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setChartView("VERT")}
                >
                  VERT
                </Button>
                <Button 
                  variant={chartView === "HORZ" ? "default" : "outline"}
                  size="sm" 
                  className={cn(
                    "text-xs px-3 py-1.5 h-7 transition-colors",
                    chartView === "HORZ" 
                      ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setChartView("HORZ")}
                >
                  HORZ
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {chartView === "VERT" ? (
              /* Vertical Bar Chart */
              <div className="space-y-4">
                <div className="flex items-end justify-between gap-3 h-64 pb-8">
                  {/* Y-axis labels */}
                  <div className="flex flex-col justify-between h-full text-xs text-gray-500 dark:text-gray-400 font-medium min-w-[60px]">
                    {yAxisLabels.map((label, index) => (
                      <div key={index} className="text-right">₹{label.toLocaleString()}</div>
                    ))}
                  </div>
                  
                  {/* Chart bars */}
                  <div className="flex-1 flex items-end justify-between gap-2 h-full">
                    {chartData.map((item, index) => {
                      const heightPercent = ((item.value - minValue) / valueRange) * 100;
                      const colorClasses = getColorClasses(item.color);
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full group relative">
                          <div className="w-full flex flex-col items-center justify-end h-full relative">
                            {/* Bar */}
                            <div
                              className={cn(
                                "w-full rounded-t-lg shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden",
                                `bg-gradient-to-t ${colorClasses.gradient}`,
                                colorClasses.hover
                              )}
                              style={{ height: `${heightPercent}%`, minHeight: '20px' }}
                            >
                              {/* Value label on hover */}
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                  ₹{item.value.toLocaleString()}
                                </div>
                              </div>
                              {/* Value inside bar if space allows */}
                              {heightPercent > 20 && (
                                <div className="h-full flex items-start justify-center pt-2">
                                  <span className="text-white text-xs font-semibold">₹{(item.value / 1000).toFixed(1)}k</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Category label */}
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center leading-tight mt-1">
                            {item.category}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Categories:</span>
                  {chartData.map((item, index) => {
                    const colorClasses = getColorClasses(item.color);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded", colorClasses.bg)}></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{item.category}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Horizontal Bar Chart */
              <div className="space-y-4">
                <div className="space-y-4">
                  {chartData.map((item, index) => {
                    const widthPercent = ((item.value - minValue) / valueRange) * 100;
                    const colorClasses = getColorClasses(item.color);
                    return (
                      <div key={index} className="group">
                        <div className="flex items-center gap-3">
                          {/* Category label */}
                          <div className="w-24 text-xs font-medium text-gray-600 dark:text-gray-400 text-right">
                            {item.category}
                          </div>
                          
                          {/* Bar container */}
                          <div className="flex-1 relative">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                              <div
                                className={cn(
                                  "h-full rounded-full shadow-sm transition-all duration-300 cursor-pointer relative flex items-center justify-end pr-2",
                                  `bg-gradient-to-r ${colorClasses.gradient}`,
                                  colorClasses.hover
                                )}
                                style={{ width: `${widthPercent}%`, minWidth: '40px' }}
                              >
                                <span className="text-white text-xs font-semibold">₹{item.value.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Value label */}
                          <div className="w-20 text-xs font-semibold text-gray-900 dark:text-gray-50 text-right">
                            ₹{item.value.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* X-axis labels */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-24"></div>
                  <div className="flex-1 flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {yAxisLabels.map((label, index) => (
                      <div key={index}>₹{label.toLocaleString()}</div>
                    )).reverse()}
                  </div>
                  <div className="w-20"></div>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Categories:</span>
                  {chartData.map((item, index) => {
                    const colorClasses = getColorClasses(item.color);
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded", colorClasses.bg)}></div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{item.category}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/alerts/assets-past-due">
              <Button 
                variant="default" 
                className="w-full bg-blue-500 hover:bg-blue-600 text-white h-auto py-4 flex flex-col items-center gap-2 transition-all hover:shadow-md"
              >
                <CalendarCheck className="h-6 w-6" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Assets Past Due</span>
                  <span className="text-xs opacity-90">3 items</span>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/alerts/maintenance-due">
              <Button 
                variant="default" 
                className="w-full bg-purple-500 hover:bg-purple-600 text-white h-auto py-4 flex flex-col items-center gap-2 transition-all hover:shadow-md"
              >
                <Wrench className="h-6 w-6" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Maintenance Due</span>
                  <span className="text-xs opacity-90">2 items</span>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/alerts/warranties-expiring">
              <Button 
                variant="default" 
                className="w-full bg-red-500 hover:bg-red-600 text-white h-auto py-4 flex flex-col items-center gap-2 transition-all hover:shadow-md"
              >
                <ShieldCheck className="h-6 w-6" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Warranty Expiring</span>
                  <span className="text-xs opacity-90">1 item</span>
                </div>
              </Button>
            </Link>
            <Link href="/dashboard/alerts/leases-expiring">
              <Button 
                variant="default" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white h-auto py-4 flex flex-col items-center gap-2 transition-all hover:shadow-md"
              >
                <Clock className="h-6 w-6" />
                <div className="flex flex-col items-center">
                  <span className="font-semibold">Lease Expiring</span>
                  <span className="text-xs opacity-90">0 items</span>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

