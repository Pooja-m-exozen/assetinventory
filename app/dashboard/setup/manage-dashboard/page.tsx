"use client";

import { useState } from "react";
import { Settings, Play, HelpCircle, Award, AlertTriangle, DollarSign, ShoppingCart, Wrench, Trash2, Heart, Plane, Package, TrendingUp, Calendar, BarChart3, PieChart, Table, Edit } from "lucide-react";

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
  const [columns, setColumns] = useState(activeTab === "widgets" ? 6 : 3);
  const [availableWidgets, setAvailableWidgets] = useState<Widget[]>([
    { id: "warranty", name: "Warranty vs...", icon: Award, color: "#EF4444" },
    { id: "lost-missing", name: "Lost / Missing", icon: AlertTriangle, color: "#4ADE80" },
    { id: "net-asset-value", name: "Net Asset Val...", icon: DollarSign, color: "#14B8A6" },
    { id: "purchases", name: "Purchases in ...", icon: ShoppingCart, color: "#A855F7" },
    { id: "under-repair", name: "Under Repair", icon: Wrench, color: "#F97316" },
    { id: "disposed", name: "Disposed", icon: Trash2, color: "#6B7280" },
    { id: "donated", name: "Donated", icon: Heart, color: "#EAB308" },
    { id: "leased", name: "Leased", icon: Plane, color: "#FB923C" }
  ]);

  const [selectedWidgets, setSelectedWidgets] = useState<Widget[]>([
    { id: "number-of", name: "Number of Assets", icon: TrendingUp, color: "#3B82F6" },
    { id: "broken", name: "Broken", icon: AlertTriangle, color: "#A855F7" },
    { id: "value-of", name: "Value of Assets", icon: DollarSign, color: "#EF4444" },
    { id: "available", name: "Available Assets", icon: Package, color: "#22C55E" },
    { id: "sold", name: "Sold", icon: ShoppingCart, color: "#60A5FA" },
    { id: "checked-out", name: "Checked-out", icon: TrendingUp, color: "#F87171" }
  ]);

  const [availableCharts, setAvailableCharts] = useState<Chart[]>([
    { id: "asset-value-category", name: "Asset Value by Category", type: "pie", icon: PieChart, color: "#3B82F6" },
    { id: "feeds", name: "Feeds", type: "table", icon: Table, color: "#6B7280" },
    { id: "asset-value-dept", name: "Asset Value by Department", type: "bar", icon: BarChart3, color: "#2563EB" }
  ]);

  const [selectedCharts, setSelectedCharts] = useState<Chart[]>([
    { id: "reservations", name: "Reservations", type: "calendar", icon: Calendar, color: "#22C55E" },
    { id: "asset-value-category-selected", name: "Asset Value by Category", type: "bar", icon: BarChart3, color: "#3B82F6" },
    { id: "alerts", name: "ALERTS", type: "calendar", icon: Calendar, color: "#EF4444" }
  ]);

  const [chartSizes, setChartSizes] = useState<{ [key: string]: number }>({
    reservations: 1,
    "asset-value-category-selected": 1,
    alerts: 1
  });

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
    setColumns(tab === "widgets" ? 6 : 3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dashboard saved", {
      widgets: selectedWidgets,
      charts: selectedCharts,
      columns,
      chartSizes
    });
  };

  const getGridClass = () => {
    if (activeTab === "widgets") {
      const colClass = columns === 1 ? "col-12" : columns === 2 ? "col-6" : columns === 3 ? "col-4" : columns === 4 ? "col-3" : "col-2";
      return `row g-3`;
    } else {
      const colClass = columns === 1 ? "col-12" : columns === 2 ? "col-6" : "col-4";
      return `row g-3`;
    }
  };

  const getItemColClass = () => {
    if (activeTab === "widgets") {
      return columns === 1 ? "col-12" : columns === 2 ? "col-6" : columns === 3 ? "col-4" : columns === 4 ? "col-3" : "col-2";
    } else {
      return columns === 1 ? "col-12" : columns === 2 ? "col-6" : "col-4";
    }
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Settings className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
          <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Manage Dashboard</h1>
        </div>
        <div className="d-flex align-items-center" style={{ gap: '12px' }}>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn text-white"
            style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '8px 16px', fontSize: '14px' }}
          >
            Save changes
          </button>
          <button
            type="button"
            className="btn text-white d-flex align-items-center"
            style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '8px 16px', fontSize: '14px', gap: '8px' }}
          >
            <Play style={{ width: '16px', height: '16px' }} />
            How it works?
          </button>
          <div className="d-flex align-items-center ms-3" style={{ gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>Columns:</span>
            <div className="d-flex align-items-center" style={{ gap: '12px' }}>
              {(activeTab === "widgets" ? [1, 2, 3, 4, 6] : [1, 2, 3]).map((num) => (
                <label key={num} className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="columns"
                    checked={columns === num}
                    onChange={() => setColumns(num)}
                    style={{ marginRight: '6px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: '#000' }}>{num}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex align-items-center mb-3" style={{ borderBottom: '2px solid #E0E0E0', gap: '16px' }}>
        <button
          type="button"
          onClick={() => handleTabChange("widgets")}
          className="btn p-0 border-0 bg-transparent"
          style={{
            paddingBottom: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: activeTab === "widgets" ? '#000' : '#666',
            borderBottom: activeTab === "widgets" ? '2px solid #FF8C00' : '2px solid transparent',
            borderRadius: '0',
            marginBottom: '-2px'
          }}
        >
          Widgets
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("charts")}
          className="btn p-0 border-0 bg-transparent"
          style={{
            paddingBottom: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: activeTab === "charts" ? '#000' : '#666',
            borderBottom: activeTab === "charts" ? '2px solid #FF8C00' : '2px solid transparent',
            borderRadius: '0',
            marginBottom: '-2px'
          }}
        >
          Charts
        </button>
      </div>

      {/* Instructions */}
      <p className="text-muted mb-4" style={{ fontSize: '14px', color: '#666' }}>
        To activate a {activeTab === "widgets" ? "widget" : "chart"} drag it to the 'Selected {activeTab === "widgets" ? "Widgets" : "Charts"}' section. To deactivate, drag it back.
      </p>

      {/* Main Content */}
      <div className="row g-4">
        {/* Available Section */}
        <div className="col-md-6">
          <div className="card" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
            <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
              <h5 className="card-title mb-4 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>
                Available {activeTab === "widgets" ? "Widgets" : "Charts"}
              </h5>
              <div className={activeTab === "widgets" ? "row g-3" : "d-flex flex-column"} style={activeTab === "charts" ? { gap: '12px' } : {}}>
                {activeTab === "widgets" ? (
                  availableWidgets.map((widget) => {
                    const Icon = widget.icon;
                    return (
                      <div key={widget.id} className="col-6">
                        <div
                          onClick={() => handleMoveToSelected(widget.id, "widget")}
                          className="card position-relative"
                          style={{ border: '1px solid #E0E0E0', borderRadius: '4px', cursor: 'pointer', padding: '16px' }}
                        >
                          <div
                            className="rounded d-flex align-items-center justify-content-center mb-2"
                            style={{ width: '40px', height: '40px', backgroundColor: widget.color }}
                          >
                            <Icon style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                          </div>
                          <p className="mb-0" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                            {widget.name}
                          </p>
                          <Edit
                            className="position-absolute"
                            style={{ width: '14px', height: '14px', color: '#999', bottom: '8px', right: '8px' }}
                          />
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
                        className="card"
                        style={{ border: '1px solid #E0E0E0', borderRadius: '4px', cursor: 'pointer', padding: '16px' }}
                      >
                        <div className="d-flex align-items-center mb-3" style={{ gap: '12px' }}>
                          <div
                            className="rounded d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px', backgroundColor: chart.color }}
                          >
                            <Icon style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                          </div>
                          <p className="mb-0" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                            {chart.name}
                          </p>
                        </div>
                        <div
                          className="rounded d-flex align-items-center justify-content-center"
                          style={{ height: '120px', backgroundColor: '#F5F5F5' }}
                        >
                          <Icon style={{ width: '48px', height: '48px', color: '#999' }} />
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
        <div className="col-md-6">
          <div className="card" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
            <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
              <h5 className="card-title mb-4 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>
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
                          className="card position-relative"
                          style={{ border: '1px solid #E0E0E0', borderRadius: '4px', cursor: 'pointer', padding: '16px' }}
                        >
                          <div
                            className="rounded d-flex align-items-center justify-content-center mb-2"
                            style={{ width: '40px', height: '40px', backgroundColor: widget.color }}
                          >
                            <Icon style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                          </div>
                          <p className="mb-0" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                            {widget.name}
                          </p>
                          <Edit
                            className="position-absolute"
                            style={{ width: '14px', height: '14px', color: '#999', bottom: '8px', right: '8px' }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  selectedCharts.map((chart) => {
                    const Icon = chart.icon;
                    return (
                      <div key={chart.id} className={getItemColClass()}>
                        <div
                          className="card"
                          style={{ border: '1px solid #E0E0E0', borderRadius: '4px', padding: '16px' }}
                        >
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center" style={{ gap: '12px' }}>
                              <div
                                className="rounded d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px', backgroundColor: chart.color }}
                              >
                                <Icon style={{ width: '20px', height: '20px', color: '#FFFFFF' }} />
                              </div>
                              <p className="mb-0" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                                {chart.name}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleMoveToAvailable(chart.id, "chart")}
                              className="btn p-0 border-0"
                              style={{ fontSize: '20px', color: '#999', lineHeight: '1' }}
                            >
                              ×
                            </button>
                          </div>
                          <div
                            className="rounded d-flex align-items-center justify-content-center mb-3"
                            style={{ height: '120px', backgroundColor: '#F5F5F5' }}
                          >
                            <Icon style={{ width: '48px', height: '48px', color: '#999' }} />
                          </div>
                          <div className="d-flex" style={{ gap: '8px' }}>
                            {[1, 2, 3].map((size) => (
                              <button
                                key={size}
                                type="button"
                                onClick={() => handleChartSizeChange(chart.id, size)}
                                className="btn btn-sm"
                                style={{
                                  borderRadius: '4px',
                                  padding: '4px 12px',
                                  fontSize: '12px',
                                  backgroundColor: chartSizes[chart.id] === size ? '#FF8C00' : '#F5F5F5',
                                  color: chartSizes[chart.id] === size ? '#FFFFFF' : '#000',
                                  border: 'none'
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
    </div>
  );
}
