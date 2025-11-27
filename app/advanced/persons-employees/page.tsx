"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus, Upload, Settings, Search, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUp, X, Loader2, AlertCircle, FileSpreadsheet, MapPin, Eye, Mail, Phone, Building, User, Briefcase, MapPin as MapPinIcon, FileText, Menu } from "lucide-react";
import {
  getPersonsEmployees,
  createPersonEmployee,
  updatePersonEmployee,
  deletePersonEmployee,
  bulkDeletePersonsEmployees,
  importPersonsEmployees,
  exportPersonsEmployees,
  type PersonEmployee,
  type PaginatedResponse,
} from "@/lib/api/persons-employees";

export default function PersonsEmployeesPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [personsEmployees, setPersonsEmployees] = useState<PersonEmployee[]>([]);
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
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchCriteriaOpen, setIsSearchCriteriaOpen] = useState(false);
  const [isColumnSetupOpen, setIsColumnSetupOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPerson, setEditingPerson] = useState<PersonEmployee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    title: "",
    phone: "",
    email: "",
    site: "",
    location: "",
    department: "",
    notes: "",
  });
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    employeeId: "",
    title: "",
    email: "",
    phone: "",
  });

  // Fetch persons/employees from API
  const fetchPersonsEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setPersonsEmployees([]);
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
      
      const response: PaginatedResponse<PersonEmployee> = await getPersonsEmployees(
        currentPage,
        recordsPerPage,
        searchQuery,
        searchField
      );
      setPersonsEmployees(response.data || []);
      setPagination({
        totalRecords: response.pagination?.totalRecords || 0,
        totalPages: response.pagination?.totalPages || 0,
        startRecord: response.pagination?.startRecord || 0,
        endRecord: response.pagination?.endRecord || 0,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch persons/employees";
      setError(errorMessage);
      
      if (errorMessage.toLowerCase().includes("unauthorized") || 
          errorMessage.toLowerCase().includes("token") ||
          errorMessage.toLowerCase().includes("session expired")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
        }
      }
      
      setPersonsEmployees([]);
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

  useEffect(() => {
    fetchPersonsEmployees();
  }, [fetchPersonsEmployees]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchPersonsEmployees();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchField]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchField, recordsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(personsEmployees.map(person => person.id));
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
    if (!confirm("Are you sure you want to delete this person/employee?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deletePersonEmployee(id);
      await fetchPersonsEmployees();
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete person/employee");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select persons/employees to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} person(s)/employee(s)?`)) {
      return;
    }

    try {
      setIsDeleting(-1);
      await bulkDeletePersonsEmployees(selectedRows);
      await fetchPersonsEmployees();
      setSelectedRows([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete persons/employees");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const result = await importPersonsEmployees(file);
      alert(`Import completed: ${result.importedCount} imported, ${result.failedCount} failed`);
      await fetchPersonsEmployees();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to import persons/employees");
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  // Client-side export function
  const exportToCSV = (data: PersonEmployee[]) => {
    if (!data || data.length === 0) {
      throw new Error("No data to export");
    }

    // Define CSV headers
    const headers = [
      "Name",
      "Employee ID",
      "Title",
      "Phone",
      "Email",
      "Site",
      "Location",
      "Department",
      "Notes"
    ];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...data.map((person) => {
        const row = [
          `"${(person.name || "").replace(/"/g, '""')}"`,
          `"${(person.employeeId || "").replace(/"/g, '""')}"`,
          `"${(person.title || "").replace(/"/g, '""')}"`,
          `"${(person.phone || "").replace(/"/g, '""')}"`,
          `"${(person.email || "").replace(/"/g, '""')}"`,
          `"${(person.site || "").replace(/"/g, '""')}"`,
          `"${(person.location || "").replace(/"/g, '""')}"`,
          `"${(person.department || "").replace(/"/g, '""')}"`,
          `"${(person.notes || "").replace(/"/g, '""')}"`
        ];
        return row.join(",");
      })
    ];

    // Create CSV content
    const csvContent = csvRows.join("\n");
    
    // Add BOM for Excel UTF-8 support
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `persons-employees_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);
      setExportSuccess(false);
      
      let dataToExport = personsEmployees;
      
      // If there are more records than what's displayed, fetch all data
      if (pagination.totalRecords > personsEmployees.length) {
        try {
          // Try API export first (it should handle all records)
          const blob = await exportPersonsEmployees("xlsx", searchQuery, searchField);
          
          if (blob && blob.size > 0) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `persons-employees_${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
              window.URL.revokeObjectURL(url);
              document.body.removeChild(a);
            }, 100);
            
            setExportSuccess(true);
            setTimeout(() => {
              setExportSuccess(false);
            }, 3000);
            return;
          }
        } catch (apiError) {
          // If API export fails, fetch all data for client-side export
          console.log("API export failed, fetching all data for client-side export:", apiError);
          
          try {
            // Fetch all records by requesting a large page size
            const allDataResponse = await getPersonsEmployees(
              1,
              pagination.totalRecords || 10000, // Request all records
              searchQuery,
              searchField
            );
            
            if (allDataResponse.data && allDataResponse.data.length > 0) {
              dataToExport = allDataResponse.data;
            }
          } catch (fetchError) {
            console.log("Failed to fetch all data, using current page data:", fetchError);
            // Continue with current page data
          }
        }
      }
      
      // Client-side export using available data
      if (dataToExport.length === 0) {
        throw new Error("No data available to export. Please ensure data is loaded.");
      }
      
      exportToCSV(dataToExport);
      
      // Show success message
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
      }, 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export persons/employees";
      setError(errorMessage);
      setExportSuccess(false);
      
      // Show error alert
      alert(errorMessage);
      
      // If unauthorized, suggest login
      if (errorMessage.toLowerCase().includes("session expired") || 
          errorMessage.toLowerCase().includes("authentication")) {
        if (typeof window !== "undefined") {
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      employeeId: "",
      title: "",
      phone: "",
      email: "",
      site: "",
      location: "",
      department: "",
      notes: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setEditingPerson(null);
    setIsModalOpen(true);
  };

  const handleEdit = (person: PersonEmployee) => {
    setFormData({
      name: person.name || "",
      employeeId: person.employeeId || "",
      title: person.title || "",
      phone: person.phone || "",
      email: person.email || "",
      site: person.site || "",
      location: person.location || "",
      department: person.department || "",
      notes: person.notes || "",
    });
    setFormErrors({});
    setIsEditMode(true);
    setEditingPerson(person);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingPerson(null);
    setFormData({
      name: "",
      employeeId: "",
      title: "",
      phone: "",
      email: "",
      site: "",
      location: "",
      department: "",
      notes: "",
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

    if (!formData.employeeId.trim()) {
      errors.employeeId = "Employee ID is required";
    }

    if (!formData.title.trim()) {
      errors.title = "Title is required";
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
      // More lenient phone validation - allow digits, spaces, dashes, parentheses, plus sign
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
      const cleanedPhone = formData.phone.trim().replace(/[\s\-\(\)]/g, '');
      if (cleanedPhone.length < 7 || cleanedPhone.length > 15) {
        errors.phone = "Phone number must be between 7 and 15 digits";
      } else if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      // Clean phone number - remove spaces, dashes, parentheses but keep + and digits
      let cleanedPhone = formData.phone.trim();
      if (cleanedPhone) {
        // Remove spaces, dashes, parentheses, but keep + and digits
        cleanedPhone = cleanedPhone.replace(/[\s\-\(\)]/g, '');
        // If it doesn't start with +, ensure it's just digits
        if (!cleanedPhone.startsWith('+')) {
          cleanedPhone = cleanedPhone.replace(/\D/g, '');
        }
      }

      const personData = {
        name: formData.name.trim(),
        employeeId: formData.employeeId.trim(),
        title: formData.title.trim(),
        phone: cleanedPhone || undefined,
        email: formData.email.trim(),
        site: formData.site.trim() || undefined,
        location: formData.location.trim() || undefined,
        department: formData.department.trim() || undefined,
        notes: formData.notes.trim() || undefined,
      };

      if (isEditMode && editingPerson) {
        await updatePersonEmployee(editingPerson.id, personData);
      } else {
        await createPersonEmployee(personData);
      }

      await fetchPersonsEmployees();
      handleCloseModal();
    } catch (err) {
      // Handle API validation errors
      if (err instanceof Error) {
        const errorWithDetails = err as Error & { details?: any };
        
        // Check if error has details object with validation errors
        if (errorWithDetails.details && errorWithDetails.details.details) {
          const validationErrors = errorWithDetails.details.details;
          const apiErrors: { [key: string]: string } = {};
          
          // Map API validation errors to form fields
          Object.keys(validationErrors).forEach((field) => {
            apiErrors[field] = validationErrors[field];
          });
          
          setFormErrors(apiErrors);
          return;
        }
        
        // Check if error message contains field-specific errors
        if (err.message.includes("phone") && (err.message.includes("Invalid") || err.message.includes("format"))) {
          setFormErrors({ phone: "Invalid phone format. Please enter a valid phone number (e.g., 1234567890 or +1234567890)." });
        } else if (err.message.includes("email") && (err.message.includes("Invalid") || err.message.includes("format"))) {
          setFormErrors({ email: "Invalid email format. Please enter a valid email address." });
        } else if (err.message.includes("employeeId") && err.message.includes("already exists")) {
          setFormErrors({ employeeId: "Employee ID already exists. Please use a different ID." });
        } else if (err.message.includes("email") && err.message.includes("already exists")) {
          setFormErrors({ email: "Email already exists. Please use a different email address." });
        } else {
          setFormErrors({ submit: err.message });
        }
      } else {
        setFormErrors({ submit: "Failed to save person/employee" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchCriteriaApply = () => {
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
      employeeId: "",
      title: "",
      email: "",
      phone: "",
    });
    setSearchQuery("");
    setSearchField("all");
    setCurrentPage(1);
  };

  const totalRecords = pagination.totalRecords;
  const startRecord = pagination.startRecord || (currentPage - 1) * recordsPerPage + 1;
  const endRecord = pagination.endRecord || Math.min(currentPage * recordsPerPage, totalRecords);

  const columns = [
    "Name",
    "Employee ID",
    "Title",
    "Phone",
    "Email",
    "Site",
    "Location",
    "Department",
    "Notes",
    "Action"
  ];

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header with Title and Pagination */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-gray-600 cursor-pointer" />
          <h1 className="text-xl font-semibold text-gray-900">List of Persons/Employees</h1>
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="px-3 py-1 bg-yellow-400 text-gray-900 font-medium rounded">
              {currentPage}
            </span>
            <button
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages || loading}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
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
              <span>Search Persons/Employees</span>
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
              <option value="10">10 persons</option>
              <option value="25">25 persons</option>
              <option value="50">50 persons</option>
              <option value="100">100 persons</option>
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
              onClick={() => setIsColumnSetupOpen(true)}
            >
              <Settings className="w-4 h-4" />
              <span>Setup Columns</span>
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded border border-gray-300 text-sm font-medium transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{isImporting ? "Importing..." : "Import"}</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImport}
                className="hidden"
                disabled={isImporting}
              />
            </label>
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

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Name, Email or Employee ID"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="all">All Fields</option>
              <option value="name">Name</option>
              <option value="employeeId">Employee ID</option>
              <option value="title">Job Title</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          {/* Success State */}
          {exportSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-green-600 shrink-0" />
              <span className="text-green-800 text-sm font-medium">Export completed successfully! File downloaded.</span>
            </div>
          )}

          {/* Error State */}
          {error && !exportSuccess && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-sm text-gray-600">Loading persons/employees...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && personsEmployees.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No persons/employees found</h3>
              <p className="text-sm text-gray-600 mb-4">
                {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first person/employee"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Person/Employee
                </button>
              )}
            </div>
          )}

          {/* Table - Only show if there are persons/employees */}
          {!loading && !error && personsEmployees.length > 0 && (
            <>
              {/* Table Controls Top */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <select 
                    className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-700">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={currentPage === pagination.totalPages || loading}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Persons/Employees Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.length === personsEmployees.length && personsEmployees.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-1">
                          <span>Name</span>
                          <ArrowUp className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-1">
                          <span>Employee ID</span>
                          <ArrowUp className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-1">
                          <span>Title</span>
                          <ArrowUp className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-1">
                          <span>Phone</span>
                          <ArrowUp className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-1">
                          <span>Email</span>
                          <ArrowUp className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-1">
                          <span>Site</span>
                          <ArrowUp className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-1">
                          <span>Location</span>
                          <ArrowUp className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-1">
                          <span>Department</span>
                          <ArrowUp className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-1">
                          <span>Notes</span>
                          <ArrowUp className="w-3 h-3" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {personsEmployees.map((person) => (
                      <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 border-r border-gray-200">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.includes(person.id)}
                            onChange={() => handleSelectRow(person.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">{person.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{person.employeeId}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{person.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{person.phone || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{person.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{person.site || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{person.location || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{person.department || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">{person.notes || "-"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button 
                              className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                              onClick={() => handleEdit(person)}
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                            <button 
                              className="flex items-center gap-1 px-2 py-1 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                              onClick={() => handleEdit(person)}
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button 
                              className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                              onClick={() => handleDelete(person.id)}
                              disabled={isDeleting === person.id}
                              title="Delete"
                            >
                              {isDeleting === person.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </>
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
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{startRecord}</span> to{" "}
                  <span className="font-medium text-gray-900">{endRecord}</span> of{" "}
                  <span className="font-medium text-gray-900">{totalRecords}</span> records
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loading}
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="px-3 py-1 bg-yellow-400 text-gray-900 font-medium rounded">
                      {currentPage}
                    </span>
                    <button
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={currentPage === pagination.totalPages || loading}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Person/Employee Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? "Edit Person/Employee" : "Add New Person/Employee"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {formErrors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-red-800 text-sm">{formErrors.submit}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
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
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>Employee ID <span className="text-red-500">*</span></span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.employeeId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter employee ID"
                    disabled={isSubmitting}
                  />
                  {formErrors.employeeId && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.employeeId}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>Title <span className="text-red-500">*</span></span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter job title"
                    disabled={isSubmitting}
                  />
                  {formErrors.title && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.title}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
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
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                    disabled={isSubmitting}
                  />
                  {formErrors.email && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
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
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                    disabled={isSubmitting}
                  />
                  {formErrors.phone && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                {/* Site */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span>Site</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="site"
                    value={formData.site}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter site name"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-gray-500" />
                      <span>Location</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter location"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span>Department</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter department"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span>Notes</span>
                    </div>
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter additional notes"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
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
                    <span>{isEditMode ? "Update Person/Employee" : "Create Person/Employee"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by name"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>Employee ID</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={searchCriteria.employeeId}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, employeeId: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by employee ID"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>Title</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={searchCriteria.title}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by job title"
                  />
                </div>

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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by email"
                  />
                </div>

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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by phone"
                  />
                </div>
              </div>

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

      {/* Column Setup Modal */}
      {isColumnSetupOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsColumnSetupOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Setup Columns</h2>
              </div>
              <button
                onClick={() => setIsColumnSetupOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Configure which columns to display in the table. Drag and drop to reorder columns.
              </p>
              <div className="space-y-2">
                {["Name", "Employee ID", "Title", "Phone", "Email", "Site", "Location", "Department", "Notes"].map((col) => (
                  <div key={col} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex-1 text-sm text-gray-700">{col}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsColumnSetupOpen(false)}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert("Column configuration saved");
                    setIsColumnSetupOpen(false);
                  }}
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
