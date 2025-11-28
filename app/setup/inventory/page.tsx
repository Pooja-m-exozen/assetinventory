"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, Key, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import {
  getInventorySettings,
  updateInventorySettings,
  updateInventoryFieldLabel,
  type InventoryField as InventoryFieldType,
} from "@/lib/api/inventory";

export default function InventoryPage() {
  const [inventoryEnabled, setInventoryEnabled] = useState(true);
  const [selectAllFields, setSelectAllFields] = useState(false);
  const [inventoryFields, setInventoryFields] = useState<InventoryFieldType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [labelModalOpen, setLabelModalOpen] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [savingLabel, setSavingLabel] = useState(false);

  // Fetch inventory settings from API
  const fetchInventorySettings = useCallback(async () => {
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

      const response = await getInventorySettings();
      const settings = response.data;
      
      setInventoryEnabled(settings.inventoryEnabled ?? false);
      setInventoryFields(settings.fields || []);
      
      // Update select all state
      const allEnabled = settings.fields?.every(field => field.enabled) ?? false;
      setSelectAllFields(allEnabled);
    } catch (err) {
      console.error("Error fetching inventory settings:", err);
      // If 404, use defaults (settings haven't been set yet)
      if (err instanceof Error && (err as any).status === 404) {
        setInventoryEnabled(false);
        setInventoryFields([]);
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch inventory settings");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventorySettings();
  }, [fetchInventorySettings]);

  // Update select all when fields change
  useEffect(() => {
    if (inventoryFields.length > 0) {
      const allEnabled = inventoryFields.every(field => field.enabled);
      setSelectAllFields(allEnabled);
    }
  }, [inventoryFields]);

  const handleFieldToggle = (id: string) => {
    const field = inventoryFields.find(f => f.id === id);
    if (field?.isRequired) {
      setError("Required fields cannot be disabled");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setInventoryFields(inventoryFields.map(field => 
      field.id === id ? { ...field, enabled: !field.enabled } : field
    ));
  };

  const handleSelectAllFields = () => {
    const newValue = !selectAllFields;
    setSelectAllFields(newValue);
    
    // Only enable/disable non-required fields
    setInventoryFields(inventoryFields.map(field => 
      field.isRequired ? field : { ...field, enabled: newValue }
    ));
  };

  const handleDataRequiredChange = (id: string, value: "yes" | "optional") => {
    setInventoryFields(inventoryFields.map(field => 
      field.id === id ? { ...field, dataRequired: value } : field
    ));
  };

  const handleCustomizeLabel = (field: InventoryFieldType) => {
    setLabelInput(field.customizeLabel);
    setLabelModalOpen(field.id);
  };

  const handleSaveLabel = async () => {
    if (!labelModalOpen || !labelInput.trim()) {
      return;
    }

    try {
      setSavingLabel(true);
      setError(null);

      await updateInventoryFieldLabel(labelModalOpen, labelInput.trim());
      
      // Update local state
      setInventoryFields(inventoryFields.map(field =>
        field.id === labelModalOpen ? { ...field, customizeLabel: labelInput.trim() } : field
      ));
      
      setLabelModalOpen(null);
      setLabelInput("");
      setSuccess("Label updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update label");
    } finally {
      setSavingLabel(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Ensure required fields are enabled
    const requiredFields = inventoryFields.filter(f => f.isRequired);
    const disabledRequired = requiredFields.filter(f => !f.enabled);
    
    if (disabledRequired.length > 0) {
      setError("Required fields cannot be disabled");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await updateInventorySettings({
        inventoryEnabled,
        fields: inventoryFields.map(field => ({
          id: field.id,
          enabled: field.enabled,
          dataRequired: field.dataRequired,
        })),
      });
      
      setSuccess("Inventory settings updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating inventory settings:", err);
      setError(err instanceof Error ? err.message : "Failed to update inventory settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to fetched values
    fetchInventorySettings();
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 flex items-center">
        <Package className="mr-2 h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Enable Inventory Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-900">
                  Enable Inventory:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="inventory-enabled"
                      checked={inventoryEnabled}
                      onChange={() => setInventoryEnabled(true)}
                      className="mr-2 cursor-pointer"
                      disabled={saving}
                    />
                    <span className="text-sm text-gray-900">Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="inventory-enabled"
                      checked={!inventoryEnabled}
                      onChange={() => setInventoryEnabled(false)}
                      className="mr-2 cursor-pointer"
                      disabled={saving}
                    />
                    <span className="text-sm text-gray-900">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Item Fields Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-orange-50 p-3">
                  <Package className="h-6 w-6 text-orange-500" />
                </div>
                <div className="grow">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Inventory Item Fields</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Fill in the appropriate fields for your inventory. <strong>Inventory Tag ID</strong>, <strong>Description</strong>, and <strong>Unit of Measurement</strong> are the only required fields. Check the boxes next to the field names you want to include.
                  </p>
                </div>
              </div>

              {inventoryFields.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p>No inventory fields found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-orange-50">
                        <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectAllFields}
                              onChange={handleSelectAllFields}
                              className="cursor-pointer rounded border-gray-300"
                              disabled={saving}
                            />
                            <span>Field name</span>
                          </div>
                        </th>
                        <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-900">Customize Label</th>
                        <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-900">Label Suggestions</th>
                        <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-900">Data Example</th>
                        <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-900">Data Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryFields.map((field) => (
                        <tr key={field.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="border border-gray-200 px-3 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.enabled}
                                onChange={() => handleFieldToggle(field.id)}
                                disabled={field.isRequired || saving}
                                className="cursor-pointer rounded border-gray-300 disabled:opacity-50"
                                title={field.isRequired ? "Required field cannot be disabled" : ""}
                              />
                              <span className="text-sm text-gray-900">
                                {field.name}
                                {field.isRequired && <span className="text-red-500"> *</span>}
                                {field.isKey && (
                                  <Key className="ml-1 inline h-3.5 w-3.5 text-orange-500" />
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="border border-gray-200 px-3 py-3">
                            <button
                              type="button"
                              className="rounded border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                              onClick={() => handleCustomizeLabel(field)}
                              disabled={saving}
                            >
                              {field.customizeLabel}
                            </button>
                          </td>
                          <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">
                            {field.labelSuggestions}
                          </td>
                          <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">
                            {field.dataExample}
                          </td>
                          <td className="border border-gray-200 px-3 py-3">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name={`required-${field.id}`}
                                  checked={field.dataRequired === "yes"}
                                  onChange={() => handleDataRequiredChange(field.id, "yes")}
                                  className="mr-2 cursor-pointer"
                                  disabled={saving}
                                />
                                <span className="text-sm text-gray-900">Yes</span>
                              </label>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name={`required-${field.id}`}
                                  checked={field.dataRequired === "optional"}
                                  onChange={() => handleDataRequiredChange(field.id, "optional")}
                                  className="mr-2 cursor-pointer"
                                  disabled={saving}
                                />
                                <span className="text-sm text-gray-900">Optional</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={handleCancel}
              disabled={saving || loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              disabled={saving || loading}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      )}

      {/* Customize Label Modal */}
      {labelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Customize Label
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setLabelModalOpen(null);
                  setLabelInput("");
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Custom Label
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Enter custom label"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500">
                {labelInput.length}/100 characters
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setLabelModalOpen(null);
                  setLabelInput("");
                }}
                disabled={savingLabel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSaveLabel}
                disabled={savingLabel || !labelInput.trim()}
              >
                {savingLabel ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
