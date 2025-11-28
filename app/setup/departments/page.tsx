"use client";

import { useState, useEffect, useCallback } from "react";
import { Grid3x3, Plus, Upload, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUp, X, Loader2, AlertCircle, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  bulkDeleteDepartments,
  importDepartments,
  type Department as DepartmentType,
  type PaginatedResponse,
} from "@/lib/api/departments";

export default function SetupDepartmentsPage() {
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    totalRecords: number;
    totalPages: number;
    startRecord: number;
    endRecord: number;
  }>({
    totalRecords: 0,
    totalPages: 0,
    startRecord: 0,
    endRecord: 0,
  });
  const [isDeleting, setIsDeleting] = useState<number | string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState({
    department: "",
    description: "",
  });

  // Fetch departments from API
  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setDepartments([]);
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

      const response: PaginatedResponse<DepartmentType> = await getDepartments(
        currentPage,
        recordsPerPage,
        searchQuery
      );
      setDepartments(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch departments");
      setDepartments([]);
      setPagination({
        totalRecords: 0,
        totalPages: 0,
        startRecord: 0,
        endRecord: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, recordsPerPage, searchQuery]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchDepartments();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, recordsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(departments.map(dept => dept.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number | string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteDepartment(id);
      await fetchDepartments();
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete department");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select departments to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} department(s)?`)) {
      return;
    }

    try {
      setIsDeleting(-1);
      await bulkDeleteDepartments(selectedRows);
      await fetchDepartments();
      setSelectedRows([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete departments");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddNew = () => {
    setFormData({ department: "", description: "" });
    setFormErrors({});
    setIsEditMode(false);
    setEditingDepartment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (department: DepartmentType) => {
    setFormData({
      department: department.department,
      description: department.description || "",
    });
    setFormErrors({});
    setIsEditMode(true);
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingDepartment(null);
    setFormData({ department: "", description: "" });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.department.trim()) {
      errors.department = "Department name is required";
    } else if (formData.department.trim().length < 2) {
      errors.department = "Department name must be at least 2 characters";
    } else if (formData.department.trim().length > 255) {
      errors.department = "Department name must be less than 255 characters";
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFormErrors({});

      if (isEditMode && editingDepartment) {
        await updateDepartment(editingDepartment.id, {
          department: formData.department.trim(),
          description: formData.description.trim() || undefined,
        });
      } else {
        await createDepartment({
          department: formData.department.trim(),
          description: formData.description.trim() || undefined,
        });
      }

      await fetchDepartments();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving department:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save department";
      
      // Try to parse validation errors
      if (err instanceof Error && (err as any).details) {
        setFormErrors((err as any).details);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validExtensions = [".xlsx", ".xls", ".csv"];
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      alert("Please select a valid Excel or CSV file (.xlsx, .xls, .csv)");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    try {
      setIsImporting(true);
      setError(null);
      const result = await importDepartments(file);
      await fetchDepartments();
      alert(`Import completed: ${result.importedCount} of ${result.totalRows} departments imported successfully.${result.failedCount > 0 ? ` ${result.failedCount} failed.` : ""}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to import departments");
    } finally {
      setIsImporting(false);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="p-6 relative min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Grid3x3 className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}>
              Departments
            </h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
            <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {/* List of Departments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-4 flex items-start">
            <div className="mr-3 rounded bg-orange-50 p-3">
              <Grid3x3 className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h5 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-50">List of Departments</h5>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Add departments to organize your employees and assets. Departments help you categorize and filter data by organizational structure. Examples include IT, HR, Finance, Operations, etc.
              </p>
            </div>
          </div>

          {/* Search and Action Buttons */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full rounded border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                onClick={handleAddNew}
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Department
              </button>
              <label className="flex cursor-pointer items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Upload className="mr-2 h-4 w-4" />
                Import Departments
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleImport}
                  className="hidden"
                  disabled={isImporting}
                />
              </label>
              {selectedRows.length > 0 && (
                <button
                  type="button"
                  className="flex items-center rounded border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                  onClick={handleBulkDelete}
                  disabled={isDeleting === -1}
                >
                  {isDeleting === -1 ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected ({selectedRows.length})
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Table Controls Top */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                className="rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={recordsPerPage}
                onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">departments</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded bg-orange-500 px-3 py-1 text-sm font-medium text-white min-w-[32px]">
                {currentPage}
              </button>
              <button
                className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage >= (pagination?.totalPages ?? 0)}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Departments Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : departments.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Grid3x3 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg">No departments found.</p>
              <p className="mt-2 text-sm">Create a new department to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-orange-50">
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.length === departments.length && departments.length > 0}
                          onChange={handleSelectAll}
                          className="mr-2 rounded border-gray-300"
                        />
                        Department
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">Edit</th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department) => (
                    <tr key={department.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-3 text-sm">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(department.id)}
                            onChange={() => handleSelectRow(department.id)}
                            className="mr-2 rounded border-gray-300"
                          />
                          <span className="font-medium text-gray-900">{department.department}</span>
                          {(department.employeeCount !== undefined && department.employeeCount > 0) || (department.assetCount !== undefined && department.assetCount > 0) ? (
                            <div className="ml-2 flex gap-2">
                              {department.employeeCount !== undefined && department.employeeCount > 0 && (
                                <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                  {department.employeeCount} employee(s)
                                </span>
                              )}
                              {department.assetCount !== undefined && department.assetCount > 0 && (
                                <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                  {department.assetCount} asset(s)
                                </span>
                              )}
                            </div>
                          ) : null}
                        </div>
                        {department.description && (
                          <p className="ml-6 mt-1 text-xs text-gray-500">{department.description}</p>
                        )}
                      </td>
                      <td className="border border-gray-200 px-3 py-3">
                        <button
                          type="button"
                          className="flex items-center rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                          onClick={() => handleEdit(department)}
                        >
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </button>
                      </td>
                      <td className="border border-gray-200 px-3 py-3">
                        <button
                          type="button"
                          className="flex items-center rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          onClick={() => handleDelete(department.id)}
                          disabled={isDeleting === department.id || (department.employeeCount !== undefined && department.employeeCount > 0) || (department.assetCount !== undefined && department.assetCount > 0)}
                          title={(department.employeeCount !== undefined && department.employeeCount > 0) || (department.assetCount !== undefined && department.assetCount > 0) ? "Cannot delete department with employees or assets" : ""}
                        >
                          {isDeleting === department.id ? (
                            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="mr-1 h-3.5 w-3.5" />
                          )}
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Summary */}
          {!loading && departments.length > 0 && (
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {pagination.startRecord} to {pagination.endRecord} of {pagination.totalRecords} records
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="rounded bg-orange-500 px-3 py-1 text-sm font-medium text-white min-w-[32px]">
                  {currentPage}
                </button>
                <button
                  className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage >= (pagination?.totalPages ?? 0)}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditMode ? "Edit Department" : "Add New Department"}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={handleCloseModal}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.department ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.department}
                    onChange={(e) => {
                      setFormData({ ...formData, department: e.target.value });
                      if (formErrors.department) {
                        setFormErrors({ ...formErrors, department: "" });
                      }
                    }}
                    placeholder="Enter department name"
                  />
                  {formErrors.department && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.department}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Description (Optional)
                  </label>
                  <textarea
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.description ? "border-red-300" : "border-gray-300"
                    }`}
                    rows={3}
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) {
                        setFormErrors({ ...formErrors, description: "" });
                      }
                    }}
                    placeholder="Enter department description"
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    isEditMode ? "Update" : "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
