"use client";

import { useState, useEffect, useCallback } from "react";
import { Grid, Calendar, Link2, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import {
  getTableOptions,
  updateTableOptions,
  type TableOptions as TableOptionsType,
} from "@/lib/api/table-options";

export default function TableOptionsPage() {
  const [assetDepreciation, setAssetDepreciation] = useState(true);
  const [depreciationMethod, setDepreciationMethod] = useState<"straight-line" | "declining-balance" | "sum-of-years" | "units-of-production">("declining-balance");
  const [calculationFrequency, setCalculationFrequency] = useState<"monthly" | "quarterly" | "annually">("monthly");
  const [enableContracts, setEnableContracts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch table options from API
  const fetchTableOptions = useCallback(async () => {
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

      const response = await getTableOptions();
      const options = response.data;
      
      setAssetDepreciation(options.assetDepreciation ?? false);
      setDepreciationMethod(options.depreciationMethod || "declining-balance");
      setCalculationFrequency(options.calculationFrequency || "monthly");
      setEnableContracts(options.enableContracts ?? false);
    } catch (err) {
      console.error("Error fetching table options:", err);
      // If 404, use defaults (options haven't been set yet)
      if (err instanceof Error && (err as any).status === 404) {
        setAssetDepreciation(false);
        setDepreciationMethod("declining-balance");
        setCalculationFrequency("monthly");
        setEnableContracts(false);
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch table options");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTableOptions();
  }, [fetchTableOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (assetDepreciation && !depreciationMethod) {
      setError("Depreciation method is required when asset depreciation is enabled");
      return;
    }
    if (assetDepreciation && !calculationFrequency) {
      setError("Calculation frequency is required when asset depreciation is enabled");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const updateData: any = {
        assetDepreciation,
        enableContracts,
      };

      if (assetDepreciation) {
        updateData.depreciationMethod = depreciationMethod;
        updateData.calculationFrequency = calculationFrequency;
      } else {
        updateData.depreciationMethod = null;
        updateData.calculationFrequency = null;
      }

      await updateTableOptions(updateData);
      setSuccess("Table options updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error updating table options:", err);
      setError(err instanceof Error ? err.message : "Failed to update table options");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to fetched values
    fetchTableOptions();
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 flex items-center">
        <Grid className="mr-2 h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Table Options</h1>
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

      {/* Introduction */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm p-6">
        <p className="text-sm text-gray-600 leading-relaxed">
          AssetTiger lets you decide how comprehensive you want your system. Use these options to fashion your ideal asset tracking and create more reports.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Depreciation Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-orange-50 p-3">
                  <Calendar className="h-6 w-6 text-orange-500" />
                </div>
                <div className="grow">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Depreciation</h5>
                  <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                    Depreciation is used to expense the cost of your assets over their useful life. If you would like to track the depreciation of assets, select Yes and define your default depreciation method and calculation frequency.
                  </p>
                  
                  <div className="mb-3">
                    <div className="mb-3 flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-900">
                        Asset Depreciation:
                      </label>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="assetDepreciation"
                            checked={assetDepreciation}
                            onChange={() => setAssetDepreciation(true)}
                            className="mr-2 cursor-pointer"
                            disabled={saving}
                          />
                          <span className="text-sm text-gray-900">Yes</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="assetDepreciation"
                            checked={!assetDepreciation}
                            onChange={() => setAssetDepreciation(false)}
                            className="mr-2 cursor-pointer"
                            disabled={saving}
                          />
                          <span className="text-sm text-gray-900">No</span>
                        </label>
                      </div>
                    </div>

                    {assetDepreciation && (
                      <>
                        <div className="mb-3">
                          <label className="mb-2 block text-sm font-medium text-gray-900">
                            Default Depreciation Method
                          </label>
                          <p className="mb-2 text-xs text-gray-600">
                            Select the default depreciation method to be used for most assets. You still have the option to override and choose another depreciation method when creating assets.
                          </p>
                          <select
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={depreciationMethod}
                            onChange={(e) => setDepreciationMethod(e.target.value as any)}
                            disabled={saving}
                          >
                            <option value="straight-line">Straight Line</option>
                            <option value="declining-balance">Declining Balance</option>
                            <option value="sum-of-years">Sum of Years</option>
                            <option value="units-of-production">Units of Production</option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="mb-2 block text-sm font-medium text-gray-900">
                            Calculation Frequency
                          </label>
                          <select
                            className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={calculationFrequency}
                            onChange={(e) => setCalculationFrequency(e.target.value as any)}
                            disabled={saving}
                          >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                            <option value="annually">Annually</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contracts / Licenses Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-orange-50 p-3">
                  <Link2 className="h-6 w-6 text-orange-500" />
                </div>
                <div className="grow">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Contracts / Licenses</h5>
                  <p className="mb-4 text-sm text-gray-600 leading-relaxed">
                    If your assets are under a contract or certain agreement you want to consider activating this option. Software licenses can also be managed under this option.
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-900">
                      Enable Contracts:
                    </label>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="enableContracts"
                          checked={enableContracts}
                          onChange={() => setEnableContracts(true)}
                          className="mr-2 cursor-pointer"
                          disabled={saving}
                        />
                        <span className="text-sm text-gray-900">Yes</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="enableContracts"
                          checked={!enableContracts}
                          onChange={() => setEnableContracts(false)}
                          className="mr-2 cursor-pointer"
                          disabled={saving}
                        />
                        <span className="text-sm text-gray-900">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
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
    </div>
  );
}
