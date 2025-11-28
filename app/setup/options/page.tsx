"use client";

import { useState, useEffect, useCallback } from "react";
import { List, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  getOptionsSettings,
  updateOptionsSettings,
} from "@/lib/api/options";

export default function OptionsPage() {
  const [automaticAssetTags, setAutomaticAssetTags] = useState(false);
  const [checkInReminderEmail, setCheckInReminderEmail] = useState(false);
  const [leaseReturnReminderEmail, setLeaseReturnReminderEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch options settings from API
  const fetchOptionsSettings = useCallback(async () => {
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

      const response = await getOptionsSettings();
      const settings = response.data;
      
      setAutomaticAssetTags(settings.automaticAssetTags ?? false);
      setCheckInReminderEmail(settings.checkInReminderEmail ?? false);
      setLeaseReturnReminderEmail(settings.leaseReturnReminderEmail ?? false);
    } catch (err) {
      console.error("Error fetching options settings:", err);
      // If 404, use defaults (settings haven't been set yet)
      if (err instanceof Error && (err as any).status === 404) {
        setAutomaticAssetTags(false);
        setCheckInReminderEmail(false);
        setLeaseReturnReminderEmail(false);
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch options settings");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptionsSettings();
  }, [fetchOptionsSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await updateOptionsSettings({
        automaticAssetTags,
        checkInReminderEmail,
        leaseReturnReminderEmail,
      });

      setSuccess("Options saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving options:", err);
      setError(err instanceof Error ? err.message : "Failed to save options");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to fetched values
    fetchOptionsSettings();
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 flex items-center">
        <List className="mr-2 h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Options</h1>
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
          {/* Introduction */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                To tailor the site to your specifications, we've added some options for you to work with.
              </p>
            </div>
          </div>

          {/* Asset Tagging Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <h5 className="mb-3 text-lg font-semibold text-gray-900">Asset Tagging</h5>
              <div className="mb-2 flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={automaticAssetTags}
                  onChange={(e) => setAutomaticAssetTags(e.target.checked)}
                  className="mt-1 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={saving}
                />
                <span className="text-sm font-medium text-gray-900">
                  Automatic asset tags
                </span>
              </div>
              <p className="ml-6 text-sm text-gray-600 leading-relaxed">
                Automatically assign asset tags when you create a new asset or duplicate an existing asset.
              </p>
            </div>
          </div>

          {/* Reminder Emails Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <h5 className="mb-3 text-lg font-semibold text-gray-900">Reminder Emails</h5>
              <div className="flex flex-col gap-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkInReminderEmail}
                    onChange={(e) => setCheckInReminderEmail(e.target.checked)}
                    className="mr-2 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={saving}
                  />
                  <span className="text-sm text-gray-900">
                    Check-in Reminder Email
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={leaseReturnReminderEmail}
                    onChange={(e) => setLeaseReturnReminderEmail(e.target.checked)}
                    className="mr-2 h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={saving}
                  />
                  <span className="text-sm text-gray-900">
                    Lease Return Reminder Email
                  </span>
                </label>
              </div>
            </div>
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
  );
}
