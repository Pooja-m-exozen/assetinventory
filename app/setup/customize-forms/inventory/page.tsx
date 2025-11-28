"use client";

import { useState, useEffect, useCallback } from "react";
import { FileCheck, HelpCircle, Key, Loader2, CheckCircle, AlertCircle, X } from "lucide-react";
import {
  getFormConfiguration,
  updateFormConfiguration,
  updateFormFieldLabel,
  type FormField,
} from "@/lib/api/customize-forms";

export default function SetupCustomizeFormsInventoryPage() {
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectAllFields, setSelectAllFields] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState("");
  const [savingLabel, setSavingLabel] = useState(false);

  // Fetch form configuration from API
  const fetchFormConfiguration = useCallback(async () => {
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

      const response = await getFormConfiguration("inventory");
      const config = response.data;
      
      setFields(config.fields || []);
      
      // Update select all state
      const allEnabled = (config.fields || []).every(field => field.enabled);
      setSelectAllFields(allEnabled);
    } catch (err) {
      console.error("Error fetching form configuration:", err);
      // If 404, use defaults (configuration hasn't been set yet)
      if (err instanceof Error && (err as any).status === 404) {
        // Set default fields
        setFields([]);
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch form configuration");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormConfiguration();
  }, [fetchFormConfiguration]);

  // Update select all when fields change
  useEffect(() => {
    if (fields.length > 0) {
      const allEnabled = fields.every(field => field.enabled);
      setSelectAllFields(allEnabled);
    }
  }, [fields]);

  const handleFieldToggle = (id: string) => {
    const field = fields.find(f => f.id === id);
    if (field?.isSystemField) {
      setError("System fields cannot be disabled");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setFields(fields.map(field => 
      field.id === id ? { ...field, enabled: !field.enabled } : field
    ));
  };

  const handleSelectAllFields = () => {
    const newValue = !selectAllFields;
    setSelectAllFields(newValue);
    
    // Only enable/disable non-system fields
    setFields(fields.map(field => 
      field.isSystemField ? field : { ...field, enabled: newValue }
    ));
  };

  const handleRequiredChange = (id: string, value: boolean) => {
    const field = fields.find(f => f.id === id);
    if (field?.isSystemField && !value) {
      setError("System fields cannot be made optional");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setFields(fields.map(field => 
      field.id === id ? { ...field, required: value } : field
    ));
  };

  const handleCustomizeLabel = (field: FormField) => {
    setLabelInput(field.customizeLabel || field.name);
    setLabelModalOpen(field.id);
  };

  const handleSaveLabel = async () => {
    if (!labelModalOpen || !labelInput.trim()) {
      return;
    }

    try {
      setSavingLabel(true);
      setError(null);

      await updateFormFieldLabel("inventory", labelModalOpen, labelInput.trim());
      
      // Update local state
      setFields(fields.map(field =>
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
    
    // Validation: Ensure system fields are enabled
    const systemFields = fields.filter(f => f.isSystemField);
    const disabledSystem = systemFields.filter(f => !f.enabled);
    
    if (disabledSystem.length > 0) {
      setError("System fields cannot be disabled");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await updateFormConfiguration("inventory", {
        fields: fields.map((field, index) => ({
          id: field.id,
          enabled: field.enabled,
          required: field.required,
          order: index + 1,
        })),
      });
      
      setSuccess("Form configuration saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving form configuration:", err);
      setError(err instanceof Error ? err.message : "Failed to save form configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to fetched values
    fetchFormConfiguration();
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="p-6 relative" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileCheck className="h-6 w-6 text-orange-600 dark:text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              Customize Forms - Inventory
            </h1>
          </div>
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
            {/* Content Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Customize which fields appear in the inventory form and whether they are required or optional. System fields cannot be disabled.
              </p>

              {fields.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <FileCheck className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p>No form fields found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-orange-50 dark:bg-gray-700">
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">
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
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">Customize Label</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">Required</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">Description</th>
                        <th className="border border-gray-200 dark:border-gray-600 px-3 py-3 text-left text-xs font-semibold text-gray-900 dark:text-gray-100">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field) => (
                        <tr key={field.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={field.enabled}
                                onChange={() => handleFieldToggle(field.id)}
                                disabled={field.isSystemField || saving}
                                className="cursor-pointer rounded border-gray-300 disabled:opacity-50"
                                title={field.isSystemField ? "System field cannot be disabled" : ""}
                              />
                              <span className="text-sm text-gray-900 dark:text-gray-100">
                                {field.customizeLabel || field.name}
                                {field.isSystemField && (
                                  <Key className="ml-1 inline h-3.5 w-3.5 text-orange-500" />
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-3">
                            <button
                              type="button"
                              className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                              onClick={() => handleCustomizeLabel(field)}
                              disabled={saving}
                            >
                              {field.customizeLabel || field.name}
                            </button>
                          </td>
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-3">
                            <div className="flex items-center gap-4">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name={`required-${field.id}`}
                                  checked={field.required}
                                  onChange={() => handleRequiredChange(field.id, true)}
                                  disabled={field.isSystemField || saving}
                                  className="mr-2 cursor-pointer disabled:opacity-50"
                                />
                                <span className="text-sm text-gray-900 dark:text-gray-100">Yes</span>
                              </label>
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="radio"
                                  name={`required-${field.id}`}
                                  checked={!field.required}
                                  onChange={() => handleRequiredChange(field.id, false)}
                                  disabled={field.isSystemField || saving}
                                  className="mr-2 cursor-pointer disabled:opacity-50"
                                />
                                <span className="text-sm text-gray-900 dark:text-gray-100">Optional</span>
                              </label>
                            </div>
                          </td>
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {field.description || "-"}
                          </td>
                          <td className="border border-gray-200 dark:border-gray-600 px-3 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {field.example || "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Action Buttons */}
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
                  "Save"
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Need Help Button */}
      <div className="fixed bottom-6 right-6">
        <button
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-colors"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
          aria-label="Need Help?"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>

      {/* Customize Label Modal */}
      {labelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Customize Label
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => {
                  setLabelModalOpen(null);
                  setLabelInput("");
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-gray-900 dark:text-gray-100">
                Custom Label
              </label>
              <input
                type="text"
                className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Enter custom label"
                maxLength={100}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {labelInput.length}/100 characters
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
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
