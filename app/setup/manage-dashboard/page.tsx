"use client";

import { useState, useEffect, useCallback } from "react";
import { Settings, Play, Award, AlertTriangle, DollarSign, ShoppingCart, Wrench, Trash2, Heart, Plane, Package, TrendingUp, Calendar, BarChart3, PieChart, Table, Edit, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  getDashboardConfiguration,
  updateDashboardConfiguration,
  type DashboardWidget as DashboardWidgetType,
  type DashboardChart as DashboardChartType,
} from "@/lib/api/dashboard";

// Icon mapping for widgets
const widgetIconMap: { [key: string]: any } = {
  "number-of": TrendingUp,
  "broken": AlertTriangle,
  "value-of": DollarSign,
  "available": Package,
  "sold": ShoppingCart,
  "checked-out": TrendingUp,
  "warranty": Award,
  "lost-missing": AlertTriangle,
  "net-asset-value": DollarSign,
  "purchases": ShoppingCart,
  "under-repair": Wrench,
  "disposed": Trash2,
  "donated": Heart,
  "leased": Plane,
};

// Icon mapping for charts
const chartIconMap: { [key: string]: any } = {
  "reservations": Calendar,
  "asset-value-category": PieChart,
  "asset-value-category-selected": BarChart3,
  "alerts": Calendar,
  "feeds": Table,
  "asset-value-dept": BarChart3,
};

interface Widget {
  id: string;
  name: string;
  icon: any;
  color: string;
}

interface Chart {
  id: string;
  name: string;
  type: "pie" | "bar" | "calendar" | "table";
  icon: any;
  color: string;
}

export default function ManageDashboardPage() {
  const [activeTab, setActiveTab] = useState<"widgets" | "charts">("widgets");
  const [widgetColumns, setWidgetColumns] = useState(6);
  const [chartColumns, setChartColumns] = useState(3);
  const [availableWidgets, setAvailableWidgets] = useState<Widget[]>([]);
  const [selectedWidgets, setSelectedWidgets] = useState<Widget[]>([]);
  const [availableCharts, setAvailableCharts] = useState<Chart[]>([]);
  const [selectedCharts, setSelectedCharts] = useState<Chart[]>([]);
  const [chartSizes, setChartSizes] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Helper to convert API widget to local widget with icon
  const apiWidgetToWidget = (apiWidget: DashboardWidgetType): Widget => ({
    ...apiWidget,
    icon: widgetIconMap[apiWidget.id] || Package,
  });

  // Helper to convert API chart to local chart with icon
  const apiChartToChart = (apiChart: DashboardChartType): Chart => ({
    ...apiChart,
    icon: chartIconMap[apiChart.id] || BarChart3,
  });

  // Fetch dashboard configuration from API
  const fetchDashboardConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setLoading(false);
          return;
        }
      }

      const response = await getDashboardConfiguration();
      const config = response.data;

      setWidgetColumns(config.widgetColumns ?? 6);
      setChartColumns(config.chartColumns ?? 3);

      // Convert API widgets to local widgets with icons
      const selectedWidgetsWithIcons = (config.selectedWidgets || []).map(apiWidgetToWidget);
      const availableWidgetsWithIcons = (config.availableWidgets || []).map(apiWidgetToWidget);

      setSelectedWidgets(selectedWidgetsWithIcons);
      setAvailableWidgets(availableWidgetsWithIcons);

      // Convert API charts to local charts with icons
      const selectedChartsWithIcons = (config.selectedCharts || []).map(apiChartToChart);
      const availableChartsWithIcons = (config.availableCharts || []).map(apiChartToChart);

      setSelectedCharts(selectedChartsWithIcons);
      setAvailableCharts(availableChartsWithIcons);

      // Set chart sizes
      const sizes: { [key: string]: number } = {};
      (config.selectedCharts || []).forEach(chart => {
        if (chart.size) {
          sizes[chart.id] = chart.size;
        }
      });
      setChartSizes(sizes);
    } catch (err) {
      console.error("Error fetching dashboard configuration:", err);
      // If 404, use defaults (configuration hasn't been set yet)
      if (err instanceof Error && (err as any).status === 404) {
        // Set default values
        setWidgetColumns(6);
        setChartColumns(3);
        setSelectedWidgets([]);
        setAvailableWidgets([]);
        setSelectedCharts([]);
        setAvailableCharts([]);
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard configuration");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardConfiguration();
  }, [fetchDashboardConfiguration]);

  const columns = activeTab === "widgets" ? widgetColumns : chartColumns;

  const handleMoveToSelected = (id: string, type: "widget" | "chart") => {
    if (type === "widget") {
      const widget = availableWidgets.find(w => w.id === id);
      if (widget) {
        setAvailableWidgets(availableWidgets.filter(w => w.id !== id));
        setSelectedWidgets([...selectedWidgets, widget]);
      }
    } else {
      const chart = availableCharts.find(c => c.id === id);
      if (chart) {
        setAvailableCharts(availableCharts.filter(c => c.id !== id));
        setSelectedCharts([...selectedCharts, chart]);
        setChartSizes({ ...chartSizes, [chart.id]: 1 });
      }
    }
  };

  const handleMoveToAvailable = (id: string, type: "widget" | "chart") => {
    if (type === "widget") {
      const widget = selectedWidgets.find(w => w.id === id);
      if (widget) {
        setSelectedWidgets(selectedWidgets.filter(w => w.id !== id));
        setAvailableWidgets([...availableWidgets, widget]);
      }
    } else {
      const chart = selectedCharts.find(c => c.id === id);
      if (chart) {
        setSelectedCharts(selectedCharts.filter(c => c.id !== id));
        setAvailableCharts([...availableCharts, chart]);
        const newSizes = { ...chartSizes };
        delete newSizes[chart.id];
        setChartSizes(newSizes);
      }
    }
  };

  const handleChartSizeChange = (chartId: string, size: number) => {
    setChartSizes({ ...chartSizes, [chartId]: size });
  };

  const handleTabChange = (tab: "widgets" | "charts") => {
    setActiveTab(tab);
  };

  const handleColumnChange = (num: number) => {
    if (activeTab === "widgets") {
      setWidgetColumns(num);
    } else {
      setChartColumns(num);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await updateDashboardConfiguration({
        widgetColumns,
        chartColumns,
        selectedWidgets: selectedWidgets.map((widget, index) => ({
          id: widget.id,
          order: index + 1,
        })),
        selectedCharts: selectedCharts.map((chart, index) => ({
          id: chart.id,
          size: chartSizes[chart.id] || 1,
          order: index + 1,
        })),
      });

      setSuccess("Dashboard configuration saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving dashboard configuration:", err);
      setError(err instanceof Error ? err.message : "Failed to save dashboard configuration");
    } finally {
      setSaving(false);
    }
  };

  const getGridClass = () => {
    return `flex flex-wrap gap-3`;
  };

  const getItemColClass = () => {
    if (activeTab === "widgets") {
      const width = widgetColumns === 1 ? "w-full" : widgetColumns === 2 ? "w-[calc(50%-6px)]" : widgetColumns === 3 ? "w-[calc(33.333%-8px)]" : widgetColumns === 4 ? "w-[calc(25%-9px)]" : widgetColumns === 6 ? "w-[calc(16.666%-10px)]" : "w-[calc(50%-6px)]";
      return width;
    } else {
      const width = chartColumns === 1 ? "w-full" : chartColumns === 2 ? "w-[calc(50%-6px)]" : "w-[calc(33.333%-8px)]";
      return width;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Settings className="mr-2 h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Manage Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            <Play className="h-4 w-4" />
            How it works?
          </button>
          <div className="ml-3 flex items-center gap-3">
            <span className="text-sm font-medium text-gray-900">Columns:</span>
            <div className="flex items-center gap-3">
              {(activeTab === "widgets" ? [1, 2, 3, 4, 6] : [1, 2, 3]).map((num) => (
                <label key={num} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="columns"
                    checked={columns === num}
                    onChange={() => handleColumnChange(num)}
                    className="mr-2 cursor-pointer"
                    disabled={saving || loading}
                  />
                  <span className="text-sm text-gray-900">{num}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 flex items-center text-green-800">
          <CheckCircle className="mr-2 h-5 w-5 shrink-0" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-3 flex items-center border-b-2 border-gray-200 gap-4">
        <button
          type="button"
          onClick={() => handleTabChange("widgets")}
          className="border-0 bg-transparent pb-3 text-sm font-medium transition-colors"
          style={{
            color: activeTab === "widgets" ? '#000' : '#666',
            borderBottom: activeTab === "widgets" ? '2px solid #FF8C00' : '2px solid transparent',
            marginBottom: '-2px'
          }}
        >
          Widgets
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("charts")}
          className="border-0 bg-transparent pb-3 text-sm font-medium transition-colors"
          style={{
            color: activeTab === "charts" ? '#000' : '#666',
            borderBottom: activeTab === "charts" ? '2px solid #FF8C00' : '2px solid transparent',
            marginBottom: '-2px'
          }}
        >
          Charts
        </button>
      </div>

      {/* Instructions */}
      <p className="mb-4 text-sm text-gray-600">
        To activate a {activeTab === "widgets" ? "widget" : "chart"} drag it to the 'Selected {activeTab === "widgets" ? "Widgets" : "Charts"}' section. To deactivate, drag it back.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Available Section */}
          <div>
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-6">
                <h5 className="mb-4 text-lg font-semibold text-gray-900">
                  Available {activeTab === "widgets" ? "Widgets" : "Charts"}
                </h5>
                <div className={activeTab === "widgets" ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3"}>
                  {activeTab === "widgets" ? (
                    availableWidgets.map((widget) => {
                      const Icon = widget.icon;
                      return (
                        <div key={widget.id}>
                          <div
                            onClick={() => handleMoveToSelected(widget.id, "widget")}
                            className="relative cursor-pointer rounded border border-gray-200 bg-white p-4 hover:bg-gray-50"
                          >
                            <div
                              className="mb-2 flex h-10 w-10 items-center justify-center rounded"
                              style={{ backgroundColor: widget.color }}
                            >
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {widget.name}
                            </p>
                            <Edit className="absolute bottom-2 right-2 h-3.5 w-3.5 text-gray-400" />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    availableCharts.map((chart) => {
                      const Icon = chart.icon;
                      return (
                        <div
                          key={chart.id}
                          onClick={() => handleMoveToSelected(chart.id, "chart")}
                          className="cursor-pointer rounded border border-gray-200 bg-white p-4 hover:bg-gray-50"
                        >
                          <div className="mb-3 flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded"
                              style={{ backgroundColor: chart.color }}
                            >
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {chart.name}
                            </p>
                          </div>
                          <div className="flex h-[120px] items-center justify-center rounded bg-gray-50">
                            <Icon className="h-12 w-12 text-gray-400" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Section */}
          <div>
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="p-6">
                <h5 className="mb-4 text-lg font-semibold text-gray-900">
                  Selected {activeTab === "widgets" ? "Widgets" : "Charts"}
                </h5>
                <div className={getGridClass()}>
                  {activeTab === "widgets" ? (
                    selectedWidgets.map((widget) => {
                      const Icon = widget.icon;
                      return (
                        <div key={widget.id} className={getItemColClass()}>
                          <div
                            onClick={() => handleMoveToAvailable(widget.id, "widget")}
                            className="relative cursor-pointer rounded border border-gray-200 bg-white p-4 hover:bg-gray-50"
                          >
                            <div
                              className="mb-2 flex h-10 w-10 items-center justify-center rounded"
                              style={{ backgroundColor: widget.color }}
                            >
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {widget.name}
                            </p>
                            <Edit className="absolute bottom-2 right-2 h-3.5 w-3.5 text-gray-400" />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    selectedCharts.map((chart) => {
                      const Icon = chart.icon;
                      return (
                        <div key={chart.id} className={getItemColClass()}>
                          <div className="rounded border border-gray-200 bg-white p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className="flex h-10 w-10 items-center justify-center rounded"
                                  style={{ backgroundColor: chart.color }}
                                >
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <p className="text-sm font-medium text-gray-900">
                                  {chart.name}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleMoveToAvailable(chart.id, "chart")}
                                className="text-xl leading-none text-gray-400 hover:text-gray-600"
                              >
                                ×
                              </button>
                            </div>
                            <div className="mb-3 flex h-[120px] items-center justify-center rounded bg-gray-50">
                              <Icon className="h-12 w-12 text-gray-400" />
                            </div>
                            <div className="flex gap-2">
                              {[1, 2, 3].map((size) => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => handleChartSizeChange(chart.id, size)}
                                  className="rounded px-3 py-1 text-xs font-medium transition-colors"
                                  style={{
                                    backgroundColor: chartSizes[chart.id] === size ? '#FF8C00' : '#F5F5F5',
                                    color: chartSizes[chart.id] === size ? '#FFFFFF' : '#000',
                                  }}
                                >
                                  {size}x
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
