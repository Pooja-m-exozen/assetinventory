"use client";

import { useState, useEffect, useCallback } from "react";
import { List, Plus, Upload, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUp, X, Loader2, AlertCircle, Search } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  bulkDeleteCategories,
  importCategories,
  type Category as CategoryType,
  type PaginatedResponse,
} from "@/lib/api/categories";

export default function CategoriesPage() {
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    startRecord: 0,
    endRecord: 0,
  });
  const [isDeleting, setIsDeleting] = useState<number | string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState({
    category: "",
    description: "",
  });

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setCategories([]);
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

      const response: PaginatedResponse<CategoryType> = await getCategories(
        currentPage,
        recordsPerPage,
        searchQuery
      );
      setCategories(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch categories");
      setCategories([]);
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
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchCategories();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, recordsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(categories.map(cat => cat.id));
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
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteCategory(id);
      await fetchCategories();
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select categories to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} category(s)?`)) {
      return;
    }

    try {
      setIsDeleting(-1);
      await bulkDeleteCategories(selectedRows);
      await fetchCategories();
      setSelectedRows([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete categories");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddNew = () => {
    setFormData({ category: "", description: "" });
    setFormErrors({});
    setIsEditMode(false);
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: CategoryType) => {
    setFormData({
      category: category.category,
      description: category.description || "",
    });
    setFormErrors({});
    setIsEditMode(true);
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingCategory(null);
    setFormData({ category: "", description: "" });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.category.trim()) {
      errors.category = "Category name is required";
    } else if (formData.category.trim().length < 2) {
      errors.category = "Category name must be at least 2 characters";
    } else if (formData.category.trim().length > 255) {
      errors.category = "Category name must be less than 255 characters";
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

      if (isEditMode && editingCategory) {
        await updateCategory(editingCategory.id, {
          category: formData.category.trim(),
          description: formData.description.trim() || undefined,
        });
      } else {
        await createCategory({
          category: formData.category.trim(),
          description: formData.description.trim() || undefined,
        });
      }

      await fetchCategories();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving category:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save category";
      
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
      const result = await importCategories(file);
      await fetchCategories();
      alert(`Import completed: ${result.importedCount} of ${result.totalRows} categories imported successfully.${result.failedCount > 0 ? ` ${result.failedCount} failed.` : ""}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to import categories");
    } finally {
      setIsImporting(false);
      // Reset file input
      e.target.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <List className="mr-2 h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      {/* List of Categories Section */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="mb-4 flex items-start">
            <div className="mr-3 rounded bg-orange-50 p-3">
              <List className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h5 className="mb-2 text-lg font-semibold text-gray-900">List of Categories</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Add the type of groups of assets. To start with, commonly used categories have already been created for you. Make them as broad or as specific as you want. Categories can be 'laptops and printers', 'equipment', or 'chairs'. Customize to your particular need.
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
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                onClick={handleAddNew}
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Category
              </button>
              <label className="flex cursor-pointer items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Upload className="mr-2 h-4 w-4" />
                Import Categories
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
              <span className="text-sm text-gray-600">categories</span>
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
                disabled={currentPage >= pagination.totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Categories Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <List className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg">No categories found.</p>
              <p className="mt-2 text-sm">Create a new category to get started.</p>
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
                          checked={selectedRows.length === categories.length && categories.length > 0}
                          onChange={handleSelectAll}
                          className="mr-2 rounded border-gray-300"
                        />
                        Category
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">Edit</th>
                    <th className="border border-gray-200 bg-orange-500 px-3 py-3 text-left text-xs font-semibold text-white">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-3 text-sm">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedRows.includes(category.id)}
                            onChange={() => handleSelectRow(category.id)}
                            className="mr-2 rounded border-gray-300"
                          />
                          <span className="font-medium text-gray-900">{category.category}</span>
                          {category.assetCount !== undefined && category.assetCount > 0 && (
                            <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                              {category.assetCount} asset(s)
                            </span>
                          )}
                        </div>
                        {category.description && (
                          <p className="ml-6 mt-1 text-xs text-gray-500">{category.description}</p>
                        )}
                      </td>
                      <td className="border border-gray-200 px-3 py-3">
                        <button
                          type="button"
                          className="flex items-center rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </button>
                      </td>
                      <td className="border border-gray-200 px-3 py-3">
                        <button
                          type="button"
                          className="flex items-center rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          onClick={() => handleDelete(category.id)}
                          disabled={isDeleting === category.id || (category.assetCount !== undefined && category.assetCount > 0)}
                          title={category.assetCount && category.assetCount > 0 ? "Cannot delete category with assigned assets" : ""}
                        >
                          {isDeleting === category.id ? (
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
          {!loading && categories.length > 0 && (
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
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditMode ? "Edit Category" : "Add New Category"}
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
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      if (formErrors.category) {
                        setFormErrors({ ...formErrors, category: "" });
                      }
                    }}
                    placeholder="Enter category name"
                  />
                  {formErrors.category && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.category}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Description (Optional)
                  </label>
                  <textarea
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (formErrors.description) {
                        setFormErrors({ ...formErrors, description: "" });
                      }
                    }}
                    placeholder="Enter category description"
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
    </div>
  );
}