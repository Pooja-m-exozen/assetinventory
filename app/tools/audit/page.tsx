"use client";

import { useState, useEffect, useCallback } from "react";
import { PenTool, Plus, Settings, X, Loader2, AlertCircle, Edit, Trash2, Check, ChevronLeft, ChevronRight } from "lucide-react";
import {
  getAudits,
  createAudit,
  updateAudit,
  deleteAudit,
  addAssetsToAudit,
  getSites,
  getLocations,
  getAssets,
  getAssetCategories,
  getAssetsByIds,
  type Audit as AuditType,
  type Site,
  type Location,
  type Asset,
} from "@/lib/api/audits";

export default function AuditPage() {
  const [auditName, setAuditName] = useState("");
  const [auditSite, setAuditSite] = useState("");
  const [auditLocation, setAuditLocation] = useState("");
  const [category, setCategory] = useState("all");
  const [assetIds, setAssetIds] = useState("");
  
  // Data states
  const [audits, setAudits] = useState<AuditType[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<{ id: number | string; name: string }[]>([]);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false);
  const [isManageAuditsModalOpen, setIsManageAuditsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshingAssets, setIsRefreshingAssets] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | string | null>(null);
  
  // Manage audits modal states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  const [editingAudit, setEditingAudit] = useState<AuditType | null>(null);
  
  // New audit form
  const [newAuditForm, setNewAuditForm] = useState({
    name: "",
    siteId: "",
    locationId: "",
  });
  
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Fetch audits
  const fetchAudits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAudits(1, 100);
      setAudits(response.data || []);
    } catch (err) {
      console.error("Error fetching audits:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch audits");
      setAudits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch sites
  const fetchSites = useCallback(async () => {
    try {
      const response = await getSites();
      setSites(response.data || []);
    } catch (err) {
      console.error("Error fetching sites:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch sites");
    }
  }, []);

  // Fetch locations
  const fetchLocations = useCallback(async (siteId?: number | string) => {
    try {
      const response = await getLocations(siteId);
      setLocations(response.data || []);
    } catch (err) {
      console.error("Error fetching locations:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch locations");
    }
  }, []);

  // Fetch asset categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await getAssetCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  // Fetch assets
  const fetchAssets = useCallback(async () => {
    if (!auditSite || !auditLocation) {
      setAssets([]);
      return;
    }

    try {
      setIsRefreshingAssets(true);
      const categoryId = category !== "all" ? category : undefined;
      const response = await getAssets(1, 100, categoryId, auditSite, auditLocation);
      setAssets(response.data || []);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch assets");
      setAssets([]);
    } finally {
      setIsRefreshingAssets(false);
    }
  }, [auditSite, auditLocation, category]);

  useEffect(() => {
    fetchAudits();
    fetchSites();
    fetchCategories();
  }, [fetchAudits, fetchSites, fetchCategories]);

  useEffect(() => {
    if (auditSite) {
      fetchLocations(auditSite);
      setAuditLocation(""); // Reset location when site changes
    } else {
      setLocations([]);
      setAuditLocation("");
    }
  }, [auditSite, fetchLocations]);

  const handleNewAudit = () => {
    setNewAuditForm({ name: "", siteId: "", locationId: "" });
    setFormErrors({});
    setIsNewAuditModalOpen(true);
  };

  const handleManageAudits = () => {
    fetchAudits();
    setIsManageAuditsModalOpen(true);
  };

  const handleRefreshList = () => {
    fetchAssets();
  };

  const handleAddAssetsToAudit = async () => {
    if (!auditName) {
      alert("Please select an audit first");
      return;
    }

    if (!assetIds.trim()) {
      alert("Please enter asset IDs");
      return;
    }

    // Parse asset IDs from textarea (comma separated or line separated)
    const ids = assetIds
      .split(/[,\n]/)
      .map(id => id.trim())
      .filter(id => id.length > 0);

    if (ids.length === 0) {
      alert("Please enter valid asset IDs");
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedAudit = audits.find(a => String(a.id) === String(auditName));
      if (!selectedAudit) {
        alert("Selected audit not found");
        return;
      }

      // Try to get assets by IDs first to validate
      try {
        await getAssetsByIds(ids);
      } catch (err) {
        console.warn("Some asset IDs may not exist, continuing anyway");
      }

      await addAssetsToAudit({
        auditId: selectedAudit.id,
        assetIds: ids,
      });

      alert(`Successfully added ${ids.length} asset(s) to audit`);
      setAssetIds("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add assets to audit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAudit = async () => {
    setFormErrors({});
    
    if (!newAuditForm.name.trim()) {
      setFormErrors({ name: "Audit name is required" });
      return;
    }
    if (!newAuditForm.siteId) {
      setFormErrors({ siteId: "Site is required" });
      return;
    }
    if (!newAuditForm.locationId) {
      setFormErrors({ locationId: "Location is required" });
      return;
    }

    try {
      setIsSubmitting(true);
      await createAudit({
        name: newAuditForm.name.trim(),
        siteId: newAuditForm.siteId,
        locationId: newAuditForm.locationId,
        status: "draft",
      });
      await fetchAudits();
      setIsNewAuditModalOpen(false);
      setNewAuditForm({ name: "", siteId: "", locationId: "" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create audit";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAudit = (audit: AuditType) => {
    setEditingAudit(audit);
    setNewAuditForm({
      name: audit.name,
      siteId: String(audit.siteId),
      locationId: String(audit.locationId),
    });
    setFormErrors({});
    setIsNewAuditModalOpen(true);
  };

  const handleUpdateAudit = async () => {
    if (!editingAudit) return;

    setFormErrors({});
    
    if (!newAuditForm.name.trim()) {
      setFormErrors({ name: "Audit name is required" });
      return;
    }
    if (!newAuditForm.siteId) {
      setFormErrors({ siteId: "Site is required" });
      return;
    }
    if (!newAuditForm.locationId) {
      setFormErrors({ locationId: "Location is required" });
      return;
    }

    try {
      setIsSubmitting(true);
      await updateAudit(editingAudit.id, {
        name: newAuditForm.name.trim(),
        siteId: newAuditForm.siteId,
        locationId: newAuditForm.locationId,
      });
      await fetchAudits();
      setIsNewAuditModalOpen(false);
      setEditingAudit(null);
      setNewAuditForm({ name: "", siteId: "", locationId: "" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update audit";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAudit = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this audit?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteAudit(id);
      await fetchAudits();
      if (String(auditName) === String(id)) {
        setAuditName("");
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete audit");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const paginatedAudits = audits.slice(
      (currentPage - 1) * recordsPerPage,
      currentPage * recordsPerPage
    );
    if (e.target.checked) {
      setSelectedRows(paginatedAudits.map(audit => audit.id));
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

  const paginatedAudits = audits.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );
  const totalPages = Math.ceil(audits.length / recordsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <PenTool className="mr-2 h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Audit</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      {/* Main Content Card */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          {/* Step 1: Set Audit Name */}
          <div className="mb-8">
            <h5 className="mb-3 text-lg font-semibold text-gray-900">Step 1: Set Audit Name</h5>
            <p className="mb-4 text-sm text-gray-600 leading-relaxed">
              Start a new audit or update an ongoing audit.
            </p>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex-1 max-w-md">
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Audit Name <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={auditName}
                  onChange={(e) => setAuditName(e.target.value)}
                  disabled={loading}
                >
                  <option value="">-- Select Audit Name --</option>
                  {audits.map((audit) => (
                    <option key={audit.id} value={String(audit.id)}>
                      {audit.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={handleNewAudit}
                disabled={loading}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Audit
              </button>
              <button
                type="button"
                className="flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={handleManageAudits}
                disabled={loading}
              >
                <Settings className="mr-2 h-4 w-4" />
                Manage Audits
              </button>
            </div>
          </div>

          {/* Step 2: Audit Site and Location */}
          <div className="mb-8">
            <h5 className="mb-3 text-lg font-semibold text-gray-900">Step 2: Audit Site and Location</h5>
            <p className="mb-4 text-sm text-gray-600 leading-relaxed">
              Select the desired audit Site and Location.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Audit Site <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={auditSite}
                  onChange={(e) => setAuditSite(e.target.value)}
                  disabled={loading || !auditName}
                >
                  <option value="">Select Site</option>
                  {sites.map((site) => (
                    <option key={site.id} value={String(site.id)}>
                      {site.site}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Audit Location <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={auditLocation}
                  onChange={(e) => setAuditLocation(e.target.value)}
                  disabled={loading || !auditSite}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={String(location.id)}>
                      {location.location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Add Assets to List */}
          <div>
            <h5 className="mb-3 text-lg font-semibold text-gray-900">Step 3: Add Assets to List</h5>
            <p className="mb-4 text-sm text-gray-600 leading-relaxed">
              Add assets to the list for the above selected Audit Site and Location.
            </p>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Category
                  </label>
                  <select
                    className="max-w-xs rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={loading || !auditLocation}
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                  Optionally you can filter the results by selecting a category.
                </p>
                <button
                  type="button"
                  className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  onClick={handleRefreshList}
                  disabled={loading || isRefreshingAssets || !auditLocation}
                >
                  {isRefreshingAssets ? (
                    <>
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    "Refresh List"
                  )}
                </button>
                {assets.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    Found {assets.length} asset(s) matching the criteria.
                  </div>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Asset IDs
                </label>
                <textarea
                  className="w-full rounded border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={assetIds}
                  onChange={(e) => setAssetIds(e.target.value)}
                  placeholder="If you have a list of assets to audit, enter Asset IDs comma separated or one entry in each line."
                  rows={8}
                  disabled={loading || !auditName}
                />
                <button
                  type="button"
                  className="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleAddAssetsToAudit}
                  disabled={loading || isSubmitting || !auditName || !assetIds.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 inline h-4 w-4" />
                      Add Assets to Audit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Audit Modal */}
      {isNewAuditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingAudit ? "Edit Audit" : "New Audit"}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setIsNewAuditModalOpen(false);
                  setEditingAudit(null);
                  setNewAuditForm({ name: "", siteId: "", locationId: "" });
                  setFormErrors({});
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Audit Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={newAuditForm.name}
                  onChange={(e) => setNewAuditForm({ ...newAuditForm, name: e.target.value })}
                  placeholder="Enter audit name"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Site <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={newAuditForm.siteId}
                  onChange={(e) => {
                    setNewAuditForm({ ...newAuditForm, siteId: e.target.value, locationId: "" });
                    if (e.target.value) {
                      fetchLocations(e.target.value);
                    }
                  }}
                >
                  <option value="">Select Site</option>
                  {sites.map((site) => (
                    <option key={site.id} value={String(site.id)}>
                      {site.site}
                    </option>
                  ))}
                </select>
                {formErrors.siteId && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.siteId}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Location <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={newAuditForm.locationId}
                  onChange={(e) => setNewAuditForm({ ...newAuditForm, locationId: e.target.value })}
                  disabled={!newAuditForm.siteId}
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={String(location.id)}>
                      {location.location}
                    </option>
                  ))}
                </select>
                {formErrors.locationId && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.locationId}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsNewAuditModalOpen(false);
                  setEditingAudit(null);
                  setNewAuditForm({ name: "", siteId: "", locationId: "" });
                  setFormErrors({});
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={editingAudit ? handleUpdateAudit : handleCreateAudit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    {editingAudit ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingAudit ? "Update" : "Create"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Audits Modal */}
      {isManageAuditsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Manage Audits</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setIsManageAuditsModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : audits.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No audits found. Create a new audit to get started.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                          <input
                            type="checkbox"
                            checked={selectedRows.length === paginatedAudits.length && paginatedAudits.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Site</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Location</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAudits.map((audit) => (
                        <tr key={audit.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(audit.id)}
                              onChange={() => handleSelectRow(audit.id)}
                              className="rounded border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">{audit.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{audit.siteName || "-"}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{audit.locationName || "-"}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                              audit.status === "completed" ? "bg-green-100 text-green-800" :
                              audit.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                              audit.status === "cancelled" ? "bg-red-100 text-red-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {audit.status || "draft"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditAudit(audit)}
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteAudit(audit.id)}
                                disabled={isDeleting === audit.id}
                              >
                                {isDeleting === audit.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * recordsPerPage + 1} to {Math.min(currentPage * recordsPerPage, audits.length)} of {audits.length} audits
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
