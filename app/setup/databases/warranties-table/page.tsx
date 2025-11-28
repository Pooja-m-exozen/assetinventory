"use client";

import { useState, useEffect, useCallback } from "react";
import { Database, Key, Shield, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  getDatabaseTableConfiguration,
  updateDatabaseTableConfiguration,
  type DatabaseField,
} from "@/lib/api/database-tables";

export default function WarrantiesTablePage() {
  const [standardFields, setStandardFields] = useState<DatabaseField[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch database table configuration from API
  const fetchTableConfiguration = useCallback(async () => {
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

      const response = await getDatabaseTableConfiguration("warranties");
      const config = response.data;
      
      setStandardFields(config.fields || []);
    } catch (err) {
      console.error("Error fetching database table configuration:", err);
      if (err instanceof Error && (err as any).status === 404) {
        setStandardFields([]);
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch database table configuration");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTableConfiguration();
  }, [fetchTableConfiguration]);

  const handleStandardFieldChange = (id: string, fieldType: "enabled" | "required", value: boolean) => {
    const field = standardFields.find(f => f.id === id);
    if (fieldType === "enabled" && field?.isSystemField && !value) {
      setError("System fields cannot be disabled");
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (fieldType === "required" && field?.isSystemField && !value) {
      setError("System fields cannot be made optional");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setStandardFields(
      standardFields.map((field) =>
        field.id === id
          ? { ...field, [fieldType]: value }
          : field
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setStandardFields(
      standardFields.map((field) => ({
        ...field,
        enabled: field.isSystemField ? true : checked,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const systemFields = standardFields.filter(f => f.isSystemField);
    const disabledSystem = systemFields.filter(f => !f.enabled);
    
    if (disabledSystem.length > 0) {
      setError("System fields cannot be disabled");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await updateDatabaseTableConfiguration("warranties", {
        fields: standardFields.map((field, index) => ({
          id: field.id,
          enabled: field.enabled,
          required: field.required,
          order: index + 1,
        })),
      });
      
      setSuccess("Database table configuration saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving database table configuration:", err);
      setError(err instanceof Error ? err.message : "Failed to save database table configuration");
    } finally {
      setSaving(false);
    }
  };

  const allSelected = standardFields.every(field => field.enabled);

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 flex items-center">
        <Database className="mr-2 h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Database Warranty</h1>
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
          {/* Warranty Standard Fields Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-orange-50 p-3">
                  <Shield className="h-6 w-6 text-orange-500" />
                </div>
                <div className="grow">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Warranty Standard Fields</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Select the fields you would like to use for the warranty table.
                  </p>
                </div>
              </div>

              {standardFields.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <Shield className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <p>No database fields found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-900">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="mr-2 cursor-pointer rounded border-gray-300"
                            disabled={saving}
                          />
                          Field name
                        </th>
                        <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-900">Data Required</th>
                        <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-900">Description</th>
                        <th className="border border-gray-200 px-3 py-3 text-left text-xs font-semibold text-gray-900">Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standardFields.map((field) => (
                        <tr key={field.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="border border-gray-200 px-3 py-3">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={field.enabled}
                                onChange={(e) => handleStandardFieldChange(field.id, "enabled", e.target.checked)}
                                disabled={field.isSystemField || saving}
                                className="mr-2 cursor-pointer rounded border-gray-300 disabled:opacity-50"
                                title={field.isSystemField ? "System field cannot be disabled" : ""}
                              />
                              <span className="text-sm text-gray-900">
                                {field.name}
                                {field.isSystemField && (
                                  <>
                                    <span className="ml-1 text-red-500">*</span>
                                    {field.isKeyField && (
                                      <Key className="ml-1 inline h-3.5 w-3.5 text-orange-500" />
                                    )}
                                  </>
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="border border-gray-200 px-3 py-3">
                            {!field.hasNoRadioButtons ? (
                              <div className="flex items-center gap-4">
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`required-${field.id}`}
                                    checked={field.required}
                                    onChange={() => handleStandardFieldChange(field.id, "required", true)}
                                    disabled={field.isSystemField || saving}
                                    className="mr-2 cursor-pointer disabled:opacity-50"
                                  />
                                  <span className="text-sm text-gray-900">Yes</span>
                                </label>
                                <label className="flex items-center cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`required-${field.id}`}
                                    checked={!field.required}
                                    onChange={() => handleStandardFieldChange(field.id, "required", false)}
                                    disabled={field.isSystemField || saving}
                                    className="mr-2 cursor-pointer disabled:opacity-50"
                                  />
                                  <span className="text-sm text-gray-900">Optional</span>
                                </label>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                          <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{field.description || "-"}</td>
                          <td className="border border-gray-200 px-3 py-3 text-sm text-gray-600">{field.example || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Warranty Custom Fields Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-orange-50 p-3">
                  <Shield className="h-6 w-6 text-orange-500" />
                </div>
                <div className="grow">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Warranty Custom Fields</h5>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Add custom fields to join the standard fields that we provided.
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="rounded bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
                  disabled={saving || loading}
                >
                  + Add Custom Field
                </button>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              onClick={() => fetchTableConfiguration()}
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
    </div>
  );
}
