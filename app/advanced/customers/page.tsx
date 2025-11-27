"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Upload, Settings, Search, Loader2, AlertCircle, X, Mail, Phone, Building, User, MapPin, Eye, ChevronUp, ChevronDown, FileSpreadsheet, Menu } from "lucide-react";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  bulkDeleteCustomers,
  importCustomers,
  exportCustomers,
  type Customer,
  type PaginatedResponse,
} from "@/lib/api/customers";

export default function CustomersPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    startRecord: 0,
    endRecord: 0,
  });
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchCriteriaOpen, setIsSearchCriteriaOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if token exists
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setCustomers([]);
          setPagination({
            totalRecords: 0,
            totalPages: 0,
            startRecord: 0,
            endRecord: 0,
          });
          setLoading(false);
          return;
        }
      }
      
      const response: PaginatedResponse<Customer> = await getCustomers(
        currentPage,
        recordsPerPage,
        searchQuery,
        searchField
      );
      setCustomers(response.data || []);
      setPagination({
        totalRecords: response.pagination?.totalRecords || 0,
        totalPages: response.pagination?.totalPages || 0,
        startRecord: response.pagination?.startRecord || 0,
        endRecord: response.pagination?.endRecord || 0,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch customers";
      setError(errorMessage);
      
      // If unauthorized, clear token and suggest login
      if (errorMessage.toLowerCase().includes("unauthorized") || 
          errorMessage.toLowerCase().includes("token") ||
          errorMessage.toLowerCase().includes("session expired")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
        }
      }
      
      setCustomers([]);
      setPagination({
        totalRecords: 0,
        totalPages: 0,
        startRecord: 0,
        endRecord: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, recordsPerPage, searchQuery, searchField]);

  // Fetch customers on mount and when dependencies change
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchCustomers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchField]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchField, recordsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(customers.map(customer => customer.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteCustomer(id);
      await fetchCustomers();
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete customer");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select customers to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} customer(s)?`)) {
      return;
    }

    try {
      setIsDeleting(-1);
      await bulkDeleteCustomers(selectedRows);
      await fetchCustomers();
      setSelectedRows([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete customers");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const result = await importCustomers(file);
      alert(`Import completed: ${result.importedCount} imported, ${result.failedCount} failed`);
      await fetchCustomers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to import customers");
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportCustomers("xlsx", searchQuery, searchField);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `customers_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to export customers");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSearchCriteriaApply = () => {
    // Apply search criteria
    const criteria = Object.entries(searchCriteria)
      .filter(([_, value]) => value.trim())
      .map(([key, value]) => `${key}:${value.trim()}`)
      .join(" ");
    
    setSearchQuery(criteria);
    setSearchField("all");
    setCurrentPage(1);
    setIsSearchCriteriaOpen(false);
  };

  const handleSearchCriteriaReset = () => {
    setSearchCriteria({
      name: "",
      email: "",
      phone: "",
      company: "",
    });
    setSearchQuery("");
    setSearchField("all");
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
    });
    setFormErrors({});
    setIsEditMode(true);
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFormErrors({});

      const customerData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        company: formData.company.trim() || undefined,
      };

      if (isEditMode && editingCustomer) {
        await updateCustomer(editingCustomer.id, customerData);
      } else {
        await createCustomer(customerData);
      }

      await fetchCustomers();
      handleCloseModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save customer";
      setFormErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalRecords = pagination.totalRecords;
  const startRecord = pagination.startRecord || (currentPage - 1) * recordsPerPage + 1;
  const endRecord = pagination.endRecord || Math.min(currentPage * recordsPerPage, totalRecords);

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6">
      {/* Header with Title and Pagination */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-gray-600 cursor-pointer" />
          <h1 className="text-xl font-semibold text-gray-900">List of Customers</h1>
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronUp className="w-4 h-4 text-gray-600 -rotate-90" />
            </button>
            <span className="px-3 py-1 bg-yellow-400 text-gray-900 font-medium rounded">
              {currentPage}
            </span>
            <button
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages || loading}
            >
              <ChevronUp className="w-4 h-4 text-gray-600 rotate-90" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="p-4">
          {/* Control Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button 
              type="button" 
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 text-sm font-medium transition-colors"
              onClick={handleAddNew}
            >
              <MapPin className="w-4 h-4 text-orange-500" />
              <span>Search Customers</span>
            </button>
            <button 
              type="button" 
              className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors"
              onClick={() => setIsSearchCriteriaOpen(true)}
            >
              <Search className="w-4 h-4" />
              <span>Search Criteria</span>
            </button>
            <select 
              className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="10">10 customers</option>
              <option value="25">25 customers</option>
              <option value="50">50 customers</option>
              <option value="100">100 customers</option>
            </select>
            <button 
              type="button" 
              className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50"
              onClick={handleExport}
              disabled={isExporting || loading}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export to Excel</span>
                </>
              )}
            </button>
            <button 
              type="button" 
              className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded border border-gray-300 text-sm font-medium transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Setup Columns</span>
            </button>
            {selectedRows.length > 0 && (
              <button 
                type="button" 
                className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                onClick={handleBulkDelete}
                disabled={isDeleting === -1}
              >
                {isDeleting === -1 ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Delete ({selectedRows.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <span className="text-red-800 dark:text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading customers...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && customers.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">No customers found</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first customer"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Customer
                </button>
              )}
            </div>
          )}

          {/* Table - Only show if there are customers */}
          {!loading && !error && customers.length > 0 && (
            <>
              {/* Table Controls Top */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <select 
                    className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={currentPage === pagination.totalPages || loading}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Customers Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.length === customers.length && customers.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Company</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {customers.map((customer) => (
                      <tr 
                        key={customer.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.includes(customer.id)}
                            onChange={() => handleSelectRow(customer.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="shrink-0 h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-50">{customer.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {customer.email}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            {customer.phone || <span className="text-gray-400">-</span>}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                            {customer.company || <span className="text-gray-400">-</span>}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-xs font-medium"
                              onClick={() => handleEdit(customer)}
                            >
                              Edit
                            </button>
                            <button 
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-xs font-medium disabled:opacity-50"
                              onClick={() => handleDelete(customer.id)}
                              disabled={isDeleting === customer.id}
                            >
                              {isDeleting === customer.id ? (
                                <Loader2 className="w-3 h-3 animate-spin inline" />
                              ) : (
                                "Delete"
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Summary */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-medium text-gray-900 dark:text-gray-50">{startRecord}</span> to{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-50">{endRecord}</span> of{" "}
                  <span className="font-medium text-gray-900 dark:text-gray-50">{totalRecords}</span> customers
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Criteria Modal */}
      {isSearchCriteriaOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchCriteriaOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Search Criteria</h2>
              </div>
              <button
                onClick={() => setIsSearchCriteriaOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Name</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={searchCriteria.name}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Search by name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>Email</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    value={searchCriteria.email}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Search by email"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>Phone</span>
                    </div>
                  </label>
                  <input
                    type="tel"
                    value={searchCriteria.phone}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Search by phone"
                  />
                </div>

                {/* Company Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span>Company</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={searchCriteria.company}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    placeholder="Search by company"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSearchCriteriaReset}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSearchCriteriaApply}
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Apply Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Customer Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 dark:bg-blue-600 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {isEditMode ? "Edit Customer" : "Add New Customer"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close modal"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {/* Submit Error */}
              {formErrors.submit && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                  <span className="text-red-800 dark:text-red-300 text-sm">{formErrors.submit}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Name <span className="text-red-500">*</span></span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.name 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter customer name"
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>Email <span className="text-red-500">*</span></span>
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.email 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter email address"
                    disabled={isSubmitting}
                  />
                  {formErrors.email && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>Phone</span>
                    </div>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.phone 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Enter phone number (optional)"
                    disabled={isSubmitting}
                  />
                  {formErrors.phone && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{formErrors.phone}</p>
                  )}
                </div>

                {/* Company Field */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span>Company</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter company name (optional)"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium text-sm disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : (
                    <span>{isEditMode ? "Update Customer" : "Create Customer"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
