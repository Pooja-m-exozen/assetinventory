"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, List, Plus, Upload, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUp, X, Loader2, AlertCircle, Search } from "lucide-react";
import {
  getSites,
  createSite,
  updateSite,
  deleteSite,
  bulkDeleteSites,
  importSites,
  type Site as SiteType,
  type PaginatedResponse,
} from "@/lib/api/sites";

export default function SitesPage() {
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [sites, setSites] = useState<SiteType[]>([]);
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
  const [editingSite, setEditingSite] = useState<SiteType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState({
    site: "",
    description: "",
    address: "",
    aptSuite: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  // Fetch sites from API
  const fetchSites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setSites([]);
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

      const response: PaginatedResponse<SiteType> = await getSites(
        currentPage,
        recordsPerPage,
        searchQuery
      );
      setSites(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching sites:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch sites");
      setSites([]);
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
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchSites();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, recordsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(sites.map(site => site.id));
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
    if (!confirm("Are you sure you want to delete this site?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteSite(id);
      await fetchSites();
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete site");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select sites to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} site(s)?`)) {
      return;
    }

    try {
      setIsDeleting(-1);
      await bulkDeleteSites(selectedRows);
      await fetchSites();
      setSelectedRows([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete sites");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddNew = () => {
    setFormData({
      site: "",
      description: "",
      address: "",
      aptSuite: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setEditingSite(null);
    setIsModalOpen(true);
  };

  const handleEdit = (site: SiteType) => {
    setFormData({
      site: site.site,
      description: site.description || "",
      address: site.address,
      aptSuite: site.aptSuite || "",
      city: site.city,
      state: site.state,
      zip: site.zip,
      country: site.country,
    });
    setFormErrors({});
    setIsEditMode(true);
    setEditingSite(site);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingSite(null);
    setFormData({
      site: "",
      description: "",
      address: "",
      aptSuite: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.site.trim()) {
      errors.site = "Site name is required";
    } else if (formData.site.trim().length < 2) {
      errors.site = "Site name must be at least 2 characters";
    } else if (formData.site.trim().length > 255) {
      errors.site = "Site name must be less than 255 characters";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    } else if (formData.address.trim().length > 500) {
      errors.address = "Address must be less than 500 characters";
    }

    if (!formData.city.trim()) {
      errors.city = "City is required";
    } else if (formData.city.trim().length > 100) {
      errors.city = "City must be less than 100 characters";
    }

    if (!formData.state.trim()) {
      errors.state = "State is required";
    } else if (formData.state.trim().length > 100) {
      errors.state = "State must be less than 100 characters";
    }

    if (!formData.zip.trim()) {
      errors.zip = "ZIP/Postal code is required";
    } else if (formData.zip.trim().length > 20) {
      errors.zip = "ZIP/Postal code must be less than 20 characters";
    }

    if (!formData.country.trim()) {
      errors.country = "Country is required";
    } else if (formData.country.trim().length > 100) {
      errors.country = "Country must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 1000) {
      errors.description = "Description must be less than 1000 characters";
    }

    if (formData.aptSuite && formData.aptSuite.length > 100) {
      errors.aptSuite = "Apt./Suite must be less than 100 characters";
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

      if (isEditMode && editingSite) {
        await updateSite(editingSite.id, {
          site: formData.site.trim(),
          description: formData.description.trim() || undefined,
          address: formData.address.trim(),
          aptSuite: formData.aptSuite.trim() || undefined,
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim(),
          country: formData.country.trim(),
        });
      } else {
        await createSite({
          site: formData.site.trim(),
          description: formData.description.trim() || undefined,
          address: formData.address.trim(),
          aptSuite: formData.aptSuite.trim() || undefined,
          city: formData.city.trim(),
          state: formData.state.trim(),
          zip: formData.zip.trim(),
          country: formData.country.trim(),
        });
      }

      await fetchSites();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving site:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save site";
      
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
      const result = await importSites(file);
      await fetchSites();
      alert(`Import completed: ${result.importedCount} of ${result.totalRows} sites imported successfully.${result.failedCount > 0 ? ` ${result.failedCount} failed.` : ""}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to import sites");
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
        <MapPin className="mr-2 h-6 w-6 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* List of Sites Section */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="mb-4 flex items-start">
            <div className="mr-3 rounded bg-orange-50 p-3">
              <List className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h5 className="mb-2 text-lg font-semibold text-gray-900">List of Sites</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                You can enter multiple Sites. For example, the Site may be a building or address. This means that you can better track each asset that is assigned to a given Site. A detailed Site makes it easy to find and count each asset.
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
                placeholder="Search sites..."
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
                Add New Site
              </button>
              <label className="flex cursor-pointer items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Upload className="mr-2 h-4 w-4" />
                Import Sites
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
              <span className="text-sm text-gray-600">sites</span>
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

          {/* Sites Table */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : sites.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg">No sites found.</p>
              <p className="mt-2 text-sm">Create a new site to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === sites.length && sites.length > 0}
                        onChange={handleSelectAll}
                        className="mr-2 rounded border-gray-300"
                      />
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">
                      <div className="flex items-center">
                        Site
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Address</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Apt. / Suite</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">City</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">State</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Zip</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Country</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Edit</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {sites.map((site) => (
                    <tr key={site.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(site.id)}
                          onChange={() => handleSelectRow(site.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="border border-gray-200 px-3 py-3 text-sm">
                        <span className="font-medium text-gray-900">{site.site}</span>
                        {(site.locationCount !== undefined && site.locationCount > 0) || (site.assetCount !== undefined && site.assetCount > 0) ? (
                          <div className="mt-1 flex gap-2">
                            {site.locationCount !== undefined && site.locationCount > 0 && (
                              <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                {site.locationCount} location(s)
                              </span>
                            )}
                            {site.assetCount !== undefined && site.assetCount > 0 && (
                              <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                                {site.assetCount} asset(s)
                              </span>
                            )}
                          </div>
                        ) : null}
                      </td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">
                        {site.description ? (
                          <span className="line-clamp-2" title={site.description}>{site.description}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">
                        <span className="line-clamp-2" title={site.address}>{site.address}</span>
                      </td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{site.aptSuite || "-"}</td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{site.city}</td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{site.state}</td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{site.zip}</td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{site.country}</td>
                      <td className="border border-gray-200 px-3 py-3">
                        <button
                          type="button"
                          className="flex items-center rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                          onClick={() => handleEdit(site)}
                        >
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </button>
                      </td>
                      <td className="border border-gray-200 px-3 py-3">
                        <button
                          type="button"
                          className="flex items-center rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          onClick={() => handleDelete(site.id)}
                          disabled={isDeleting === site.id || (site.locationCount !== undefined && site.locationCount > 0) || (site.assetCount !== undefined && site.assetCount > 0)}
                          title={(site.locationCount !== undefined && site.locationCount > 0) || (site.assetCount !== undefined && site.assetCount > 0) ? "Cannot delete site with locations or assets" : ""}
                        >
                          {isDeleting === site.id ? (
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
          {!loading && sites.length > 0 && (
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

      {/* Add/Edit Site Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditMode ? "Edit Site" : "Add New Site"}
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
                    Site Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.site ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.site}
                    onChange={(e) => {
                      setFormData({ ...formData, site: e.target.value });
                      if (formErrors.site) {
                        setFormErrors({ ...formErrors, site: "" });
                      }
                    }}
                    placeholder="Enter site name"
                  />
                  {formErrors.site && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.site}</p>
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
                    placeholder="Enter site description"
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.address ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (formErrors.address) {
                        setFormErrors({ ...formErrors, address: "" });
                      }
                    }}
                    placeholder="Enter street address"
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      Apt./Suite (Optional)
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        formErrors.aptSuite ? "border-red-300" : "border-gray-300"
                      }`}
                      value={formData.aptSuite}
                      onChange={(e) => {
                        setFormData({ ...formData, aptSuite: e.target.value });
                        if (formErrors.aptSuite) {
                          setFormErrors({ ...formErrors, aptSuite: "" });
                        }
                      }}
                      placeholder="Apt./Suite"
                    />
                    {formErrors.aptSuite && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.aptSuite}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        formErrors.city ? "border-red-300" : "border-gray-300"
                      }`}
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        if (formErrors.city) {
                          setFormErrors({ ...formErrors, city: "" });
                        }
                      }}
                      placeholder="Enter city"
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        formErrors.state ? "border-red-300" : "border-gray-300"
                      }`}
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ ...formData, state: e.target.value });
                        if (formErrors.state) {
                          setFormErrors({ ...formErrors, state: "" });
                        }
                      }}
                      placeholder="Enter state"
                    />
                    {formErrors.state && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-900">
                      ZIP/Postal Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        formErrors.zip ? "border-red-300" : "border-gray-300"
                      }`}
                      value={formData.zip}
                      onChange={(e) => {
                        setFormData({ ...formData, zip: e.target.value });
                        if (formErrors.zip) {
                          setFormErrors({ ...formErrors, zip: "" });
                        }
                      }}
                      placeholder="Enter ZIP/Postal code"
                    />
                    {formErrors.zip && (
                      <p className="mt-1 text-xs text-red-600">{formErrors.zip}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.country ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.country}
                    onChange={(e) => {
                      setFormData({ ...formData, country: e.target.value });
                      if (formErrors.country) {
                        setFormErrors({ ...formErrors, country: "" });
                      }
                    }}
                    placeholder="Enter country"
                  />
                  {formErrors.country && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.country}</p>
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