"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileText,
  Search,
  FileSpreadsheet,
  Upload,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Pencil,
  X,
  Calendar,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  getWarrantiesList,
  getWarranty,
  createWarranty,
  updateWarranty,
  deleteWarranty,
  exportWarrantiesList,
  importWarranties,
  type ListWarranty,
} from "@/lib/api/lists";

interface Warranty {
  id: string;
  active: boolean;
  assetTagId: string;
  description: string;
  lengthMonths: number;
  expires: string;
  notes: string;
}

export default function ListOfWarrantiesPage() {
  const [warranties, setWarranties] = useState<ListWarranty[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<string | null>("expires");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<"all" | "active" | "expired">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "view">("edit");
  const [activeTab, setActiveTab] = useState<"warranty" | "asset">("warranty");
  const [selectedWarranty, setSelectedWarranty] = useState<ListWarranty | null>(null);
  const [formData, setFormData] = useState({
    lengthMonths: "",
    expirationDate: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    startRecord: 0,
    endRecord: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch warranties from API
  const fetchWarranties = useCallback(async () => {
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

      const response = await getWarrantiesList(
        currentPage,
        itemsPerPage,
        sortColumn || undefined,
        sortDirection,
        filter,
        undefined // search query - can be added later
      );

      setWarranties(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching warranties:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch warranties");
      setWarranties([]);
      setPagination({
        totalRecords: 0,
        totalPages: 0,
        startRecord: 0,
        endRecord: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, sortColumn, sortDirection, filter]);

  useEffect(() => {
    fetchWarranties();
  }, [fetchWarranties]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  const handleExportToExcel = async () => {
    try {
      setExporting(true);
      setError(null);

      const blob = await exportWarrantiesList(
        "csv",
        sortColumn || undefined,
        sortDirection,
        filter,
        undefined
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `warranties_export_${new Date().toISOString().split("T")[0]}.csv`;
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting warranties:", err);
      setError(err instanceof Error ? err.message : "Failed to export warranties");
    } finally {
      setExporting(false);
    }
  };

  const handleImportWarranties = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImporting(true);
      setError(null);
      setSuccess(null);

      const result = await importWarranties(file);

      setSuccess(`Import completed: ${result.importedCount} imported, ${result.failedCount} failed`);
      setTimeout(() => setSuccess(null), 5000);

      if (result.errors && result.errors.length > 0) {
        console.error("Import errors:", result.errors);
        setError(`Some rows failed: ${result.errors.map(e => `Row ${e.row}: ${e.error}`).join(", ")}`);
      }

      // Refresh the list
      fetchWarranties();
    } catch (err) {
      console.error("Error importing warranties:", err);
      setError(err instanceof Error ? err.message : "Failed to import warranties");
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const convertDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [month, day, year] = dateStr.split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const handleEdit = async (warranty: ListWarranty) => {
    try {
      // Fetch full warranty details
      const response = await getWarranty(warranty.id);
      const fullWarranty = response.data;
      
      setSelectedWarranty(fullWarranty);
      setModalMode("edit");
      setFormData({
        lengthMonths: fullWarranty.lengthMonths.toString(),
        expirationDate: convertDate(fullWarranty.expires),
        notes: fullWarranty.notes || "",
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching warranty:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch warranty details");
    }
  };

  const handleView = async (warranty: ListWarranty) => {
    try {
      // Fetch full warranty details
      const response = await getWarranty(warranty.id);
      const fullWarranty = response.data;
      
      setSelectedWarranty(fullWarranty);
      setModalMode("view");
      setActiveTab("warranty");
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error fetching warranty:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch warranty details");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedWarranty(null);
    setFormData({
      lengthMonths: "",
      expirationDate: "",
      notes: "",
    });
    setActiveTab("warranty");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedWarranty) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await updateWarranty(selectedWarranty.id, {
        lengthMonths: formData.lengthMonths ? parseInt(formData.lengthMonths) : undefined,
        expirationDate: formData.expirationDate || undefined,
        notes: formData.notes || undefined,
      });

      setSuccess("Warranty updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
      handleCloseModal();
      fetchWarranties();
    } catch (err) {
      console.error("Error updating warranty:", err);
      setError(err instanceof Error ? err.message : "Failed to update warranty");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedWarranty) return;

    if (!confirm("Are you sure you want to delete this warranty?")) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await deleteWarranty(selectedWarranty.id);

      setSuccess("Warranty deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
      handleCloseModal();
      fetchWarranties();
    } catch (err) {
      console.error("Error deleting warranty:", err);
      setError(err instanceof Error ? err.message : "Failed to delete warranty");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Asset Warranty Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '20px' }}
              >
                Asset Warranty
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs - Only show in view mode */}
            {modalMode === "view" && (
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab("warranty")}
                  className={cn(
                    "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === "warranty"
                      ? "border-yellow-500 text-gray-900 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Warranty Details
                </button>
                <button
                  onClick={() => setActiveTab("asset")}
                  className={cn(
                    "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === "asset"
                      ? "border-yellow-500 text-gray-900 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  Asset Details
                </button>
              </div>
            )}

            {/* Modal Content */}
            {modalMode === "edit" ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Length Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Length
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    name="lengthMonths"
                    value={formData.lengthMonths}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    min="1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white whitespace-nowrap"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    Months
                  </Button>
                </div>
              </div>

              {/* Expiration Date Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Expiration Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="expirationDate"
                    value={formData.expirationDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 pr-10"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Notes Field */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 resize-y"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
            ) : (
              /* View Mode Content */
              <div className="p-6">
                {activeTab === "warranty" && selectedWarranty && (
                  <div className="bg-yellow-50 rounded-lg border border-yellow-200 overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b border-yellow-200">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50 w-1/3" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                            Length
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                            {selectedWarranty.lengthMonths} months
                          </td>
                        </tr>
                        <tr className="border-b border-yellow-200">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                            Expiration Date
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                            {selectedWarranty.expires}
                          </td>
                        </tr>
                        <tr className="border-b border-yellow-200">
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                            Notes
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                            {selectedWarranty.notes || "-"}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                            Created by
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                            Shivanya DN
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === "asset" && selectedWarranty && (
                  <div className="p-6 bg-white">
                    <div className="flex gap-6">
                      {/* Asset Image */}
                      <div className="w-48 h-48 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                        <div className="grid grid-cols-2 gap-2 p-3 w-full h-full">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="bg-gray-300 rounded border border-gray-400 flex items-center justify-center"
                            >
                              <div className="w-6 h-6 bg-gray-400 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Asset Details Table */}
                      <div className="flex-1 rounded-lg border border-yellow-200 overflow-hidden bg-yellow-50">
                        <table className="w-full">
                          <tbody>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50 w-1/3" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Asset Tag ID
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                {selectedWarranty.assetTagId || '-'}
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Description
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                {selectedWarranty.description || '-'}
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Purchase Date
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                11/19/2025
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Purchased from
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Kirloskar
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Cost
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                ₹12000.00
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Brand
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Kirloskar
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Model
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                NA
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Serial No
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                NA
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Site
                              </td>
                              <td className="px-4 py-3 text-sm bg-white">
                                <a href="#" className="text-blue-600 hover:underline" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                  Casagrand Boulevard
                                </a>
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Location
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Common Area
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Category
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Asset
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Sub Category
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Asset
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Department
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                -
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Assigned to
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                -
                              </td>
                            </tr>
                            <tr className="border-b border-yellow-200">
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Status
                              </td>
                              <td className="px-4 py-3 bg-white">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                  Available
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 text-sm font-medium text-gray-700 bg-yellow-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Reservation
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 bg-white" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                                Nov 19 to 20, 2025 <a href="#" className="text-blue-600 hover:underline">Pooja</a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* View Mode Footer */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 mt-6 px-6 pb-6">
                  <Button
                    type="button"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    More Details
                  </Button>
                  <Button
                    type="button"
                    onClick={handleCloseModal}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="p-6">
          {/* Title Row */}
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '20px' }}>
              Warranties
            </h1>
          </div>

          {/* Search and Action Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors",
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 border-yellow-500"
                )}
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                List of Warranties
              </button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Search className="h-4 w-4 text-white" />
                <span style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>Search Criteria</span>
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleExportToExcel}
                className="flex items-center gap-2 border-gray-300"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                disabled={exporting || loading}
              >
                {exporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4" />
                    <span>Export to Excel</span>
                  </>
                )}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={handleImportWarranties}
                className="flex items-center gap-2 border-gray-300"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                disabled={importing || loading}
              >
                {importing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Import Warranties</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-gray-300"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Settings className="h-4 w-4" />
                <span>Setup Columns</span>
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 bg-yellow-500 text-gray-900 hover:bg-yellow-600">
                  {currentPage}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.totalPages || loading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Display Options */}
          <div className="flex items-center gap-2">
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              disabled={loading}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Warranties
            </span>
          </div>
        </div>
      </div>

      {/* Main Content - Table */}
      <div className="p-6">
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

        {/* Instructional Text */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
          Link warranties to specific assets by choosing View next to the warranty you wish to edit. Then, add the required information.
        </p>

        {/* Filter Section */}
        <div className="mb-4">
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value as "all" | "active" | "expired");
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            disabled={loading}
          >
            <option value="all">All Warranties</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      Active
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("assetTagId")}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      Asset Tag ID
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("description")}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      Description
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("lengthMonths")}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      Length (months)
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("expires")}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      Expires
                      {sortColumn === "expires" && (
                        <span className={cn("text-yellow-500", sortDirection === "asc" ? "rotate-180" : "")}>
                          ↑
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort("notes")}
                      className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                      style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    >
                      Notes
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      Action
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {warranties.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      No warranties found
                    </td>
                  </tr>
                ) : (
                  warranties.map((warranty) => (
                  <tr key={warranty.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    <td className="px-4 py-4">
                      {warranty.active ? (
                        <span className="text-green-600 dark:text-green-400">✓</span>
                      ) : (
                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href="#"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {warranty.assetTagId}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <a
                        href="#"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {warranty.description}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="text-sm text-gray-900 dark:text-gray-100"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {warranty.lengthMonths} months
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="text-sm text-red-600 dark:text-red-400"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {warranty.expires}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className="text-sm text-gray-900 dark:text-gray-100"
                        style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                      >
                        {warranty.notes || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(warranty)}
                          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(warranty)}
                          className="border-gray-300 dark:border-gray-600 flex items-center gap-1"
                          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
              Showing {pagination.startRecord} to {pagination.endRecord} of {pagination.totalRecords} records
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 bg-yellow-500 text-gray-900 hover:bg-yellow-600">
                {currentPage}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pagination.totalPages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
