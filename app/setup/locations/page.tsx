"use client";

import { useState, useEffect, useCallback } from "react";
import { Navigation, List, Plus, Upload, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUp, X, Loader2, AlertCircle, Search } from "lucide-react";
import {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  bulkDeleteLocations,
  importLocations,
  type Location as LocationType,
  type PaginatedResponse,
} from "@/lib/api/locations";
import {
  getSites,
  type Site as SiteType,
} from "@/lib/api/sites";

export default function LocationsPage() {
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSiteId, setSelectedSiteId] = useState<number | string | null>(null);
  const [locations, setLocations] = useState<LocationType[]>([]);
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
  const [editingLocation, setEditingLocation] = useState<LocationType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState({
    location: "",
    siteId: "",
    description: "",
  });

  // Fetch sites for dropdown
  const fetchSites = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          return;
        }
      }

      const response: PaginatedResponse<SiteType> = await getSites(1, 100, "");
      setSites(response.data || []);
      
      // Set first site as selected if none selected
      if (!selectedSiteId && response.data && response.data.length > 0) {
        setSelectedSiteId(response.data[0].id);
      }
    } catch (err) {
      console.error("Error fetching sites:", err);
    }
  }, [selectedSiteId]);

  // Fetch locations from API
  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setLocations([]);
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

      if (!selectedSiteId) {
        setLocations([]);
        setPagination({
          totalRecords: 0,
          totalPages: 0,
          startRecord: 0,
          endRecord: 0,
        });
        setLoading(false);
        return;
      }

      const response: PaginatedResponse<LocationType> = await getLocations(
        currentPage,
        recordsPerPage,
        searchQuery,
        selectedSiteId
      );
      setLocations(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch locations");
      setLocations([]);
      setPagination({
        totalRecords: 0,
        totalPages: 0,
        startRecord: 0,
        endRecord: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, recordsPerPage, searchQuery, selectedSiteId]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchLocations();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, recordsPerPage, selectedSiteId]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(locations.map(loc => loc.id));
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
    if (!confirm("Are you sure you want to delete this location?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteLocation(id);
      await fetchLocations();
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete location");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select locations to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} location(s)?`)) {
      return;
    }

    try {
      setIsDeleting(-1);
      await bulkDeleteLocations(selectedRows);
      await fetchLocations();
      setSelectedRows([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete locations");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleAddNew = () => {
    if (!selectedSiteId) {
      alert("Please select a site first");
      return;
    }
    setFormData({
      location: "",
      siteId: selectedSiteId.toString(),
      description: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (location: LocationType) => {
    setFormData({
      location: location.location,
      siteId: location.siteId.toString(),
      description: location.description || "",
    });
    setFormErrors({});
    setIsEditMode(true);
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingLocation(null);
    setFormData({
      location: "",
      siteId: selectedSiteId?.toString() || "",
      description: "",
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.location.trim()) {
      errors.location = "Location name is required";
    } else if (formData.location.trim().length < 2) {
      errors.location = "Location name must be at least 2 characters";
    } else if (formData.location.trim().length > 255) {
      errors.location = "Location name must be less than 255 characters";
    }

    if (!formData.siteId) {
      errors.siteId = "Site is required";
    }

    if (formData.description && formData.description.length > 1000) {
      errors.description = "Description must be less than 1000 characters";
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

      if (isEditMode && editingLocation) {
        await updateLocation(editingLocation.id, {
          location: formData.location.trim(),
          siteId: Number(formData.siteId),
          description: formData.description.trim() || undefined,
        });
      } else {
        await createLocation({
          location: formData.location.trim(),
          siteId: Number(formData.siteId),
          description: formData.description.trim() || undefined,
        });
      }

      await fetchLocations();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving location:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to save location";
      
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
      const result = await importLocations(file);
      await fetchLocations();
      alert(`Import completed: ${result.importedCount} of ${result.totalRows} locations imported successfully.${result.failedCount > 0 ? ` ${result.failedCount} failed.` : ""}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to import locations");
    } finally {
      setIsImporting(false);
      // Reset file input
      e.target.value = "";
    }
  };

  const selectedSite = sites.find(s => s.id === selectedSiteId);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <Navigation className="mr-2 h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* List of Locations Section */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="mb-4 flex items-start">
            <div className="mr-3 rounded bg-orange-50 p-3">
              <List className="h-6 w-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h5 className="mb-2 text-lg font-semibold text-gray-900">List of Locations</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                You may also add Locations. Locations are a subset of Sites. For example, the Site may be a building or address. The Location may be a specific room, office or floor within the Site. Select a Site and add your list of Locations here.
              </p>
            </div>
          </div>

          {/* Site Selection */}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-gray-900">
              Select a Site: <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full rounded border-2 border-red-500 px-3 py-2 text-sm font-medium focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-500"
              value={selectedSiteId?.toString() || ""}
              onChange={(e) => setSelectedSiteId(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">-- Select a Site --</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.site} {site.city ? `- ${site.city}, ${site.state || ""}, ${site.country || ""}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Search and Action Buttons */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full rounded border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={!selectedSiteId}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                onClick={handleAddNew}
                disabled={loading || !selectedSiteId}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Location
              </button>
              <label className="flex cursor-pointer items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                <Upload className="mr-2 h-4 w-4" />
                Import Locations
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleImport}
                  className="hidden"
                  disabled={isImporting || !selectedSiteId}
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
                disabled={!selectedSiteId}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">locations</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1 || !selectedSiteId}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="rounded bg-orange-500 px-3 py-1 text-sm font-medium text-white min-w-[32px]">
                {currentPage}
              </button>
              <button
                className="rounded border border-gray-300 bg-white p-1 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage >= (pagination?.totalPages ?? 0) || !selectedSiteId}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Locations Table */}
          {!selectedSiteId ? (
            <div className="py-12 text-center text-gray-500">
              <Navigation className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg">Please select a site to view locations.</p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : locations.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <List className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg">No locations found.</p>
              <p className="mt-2 text-sm">Create a new location to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === locations.length && locations.length > 0}
                        onChange={handleSelectAll}
                        className="mr-2 rounded border-gray-300"
                      />
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">
                      <div className="flex items-center">
                        Location
                        <ArrowUp className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Description</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Edit</th>
                    <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-700">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {locations.map((location) => (
                    <tr key={location.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="border border-gray-200 px-3 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(location.id)}
                          onChange={() => handleSelectRow(location.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="border border-gray-200 px-3 py-3 text-sm">
                        <span className="font-medium text-gray-900">{location.location}</span>
                        {location.assetCount !== undefined && location.assetCount > 0 && (
                          <div className="mt-1">
                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                              {location.assetCount} asset(s)
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">
                        {location.description ? (
                          <span className="line-clamp-2" title={location.description}>{location.description}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="border border-gray-200 px-3 py-3">
                        <button
                          type="button"
                          className="flex items-center rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                          onClick={() => handleEdit(location)}
                        >
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </button>
                      </td>
                      <td className="border border-gray-200 px-3 py-3">
                        <button
                          type="button"
                          className="flex items-center rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          onClick={() => handleDelete(location.id)}
                          disabled={isDeleting === location.id || (location.assetCount !== undefined && location.assetCount > 0)}
                          title={location.assetCount !== undefined && location.assetCount > 0 ? "Cannot delete location with assets" : ""}
                        >
                          {isDeleting === location.id ? (
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
          {!loading && selectedSiteId && locations.length > 0 && (
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

      {/* Add/Edit Location Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditMode ? "Edit Location" : "Add New Location"}
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
                    Site <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.siteId ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.siteId}
                    onChange={(e) => {
                      setFormData({ ...formData, siteId: e.target.value });
                      if (formErrors.siteId) {
                        setFormErrors({ ...formErrors, siteId: "" });
                      }
                    }}
                    disabled={isEditMode}
                  >
                    <option value="">-- Select a Site --</option>
                    {sites.map((site) => (
                      <option key={site.id} value={site.id}>
                        {site.site} {site.city ? `- ${site.city}, ${site.state || ""}, ${site.country || ""}` : ""}
                      </option>
                    ))}
                  </select>
                  {formErrors.siteId && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.siteId}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Location Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.location ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.location}
                    onChange={(e) => {
                      setFormData({ ...formData, location: e.target.value });
                      if (formErrors.location) {
                        setFormErrors({ ...formErrors, location: "" });
                      }
                    }}
                    placeholder="Enter location name"
                  />
                  {formErrors.location && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.location}</p>
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
                    placeholder="Enter location description"
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
