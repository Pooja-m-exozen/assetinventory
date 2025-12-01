"use client";

import { useState, useEffect, useCallback } from "react";
import { Briefcase, Clock, Image as ImageIcon, Trash2, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import {
  getCompanyInfo,
  updateCompanyInfo,
  uploadCompanyLogo,
  deleteCompanyLogo,
  deleteCompany,
  deleteAssetData,
  type CompanyInfo as CompanyInfoType,
} from "@/lib/api/company-info";

export default function CompanyInfoPage() {
  const [formData, setFormData] = useState({
    company: "",
    organizationType: "",
    country: "",
    address: "",
    aptSuite: "",
    city: "",
    state: "",
    postalCode: "",
    timezone: "",
    currency: "",
    dateFormat: "",
    financialYearMonth: "",
    financialYearDay: "",
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isDeletingLogo, setIsDeletingLogo] = useState(false);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);
  const [isDeletingAssetData, setIsDeletingAssetData] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [showDeleteAssetDataModal, setShowDeleteAssetDataModal] = useState(false);
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([]);

  // Fetch company info on mount
  const fetchCompanyInfo = useCallback(async () => {
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

      const response = await getCompanyInfo();
      const data = response.data;

      setFormData({
        company: data.company || "",
        organizationType: data.organizationType || "",
        country: data.country || "",
        address: data.address || "",
        aptSuite: data.aptSuite || "",
        city: data.city || "",
        state: data.state || "",
        postalCode: data.postalCode || "",
        timezone: data.timezone || "",
        currency: data.currency || "",
        dateFormat: data.dateFormat || "",
        financialYearMonth: data.financialYearMonth || "January",
        financialYearDay: data.financialYearDay || "1",
      });

      if (data.logoUrl) {
        setLogoUrl(data.logoUrl);
      }
    } catch (err) {
      console.error("Error fetching company info:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch company information");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanyInfo();
  }, [fetchCompanyInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
    setSuccess(null);
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.company.trim()) {
      errors.company = "Company name is required";
    }
    if (!formData.organizationType) {
      errors.organizationType = "Organization type is required";
    }
    if (!formData.country) {
      errors.country = "Country is required";
    }
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      errors.city = "City is required";
    }
    if (!formData.state.trim()) {
      errors.state = "State is required";
    }
    if (!formData.postalCode.trim()) {
      errors.postalCode = "Postal code is required";
    }
    if (!formData.timezone) {
      errors.timezone = "Timezone is required";
    }
    if (!formData.currency) {
      errors.currency = "Currency is required";
    }
    if (!formData.dateFormat) {
      errors.dateFormat = "Date format is required";
    }
    if (!formData.financialYearMonth) {
      errors.financialYearMonth = "Financial year month is required";
    }
    if (!formData.financialYearDay) {
      errors.financialYearDay = "Financial year day is required";
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
      setError(null);
      setSuccess(null);

      await updateCompanyInfo({
        company: formData.company.trim(),
        organizationType: formData.organizationType,
        country: formData.country,
        address: formData.address.trim(),
        aptSuite: formData.aptSuite.trim() || undefined,
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        timezone: formData.timezone,
        currency: formData.currency,
        dateFormat: formData.dateFormat,
        financialYearMonth: formData.financialYearMonth,
        financialYearDay: formData.financialYearDay,
      });

      setSuccess("Company information updated successfully");
      await fetchCompanyInfo();
    } catch (err) {
      console.error("Error updating company info:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to update company information";
      
      // Try to parse validation errors
      if (err instanceof Error && (err as any).details) {
        setFormErrors((err as any).details);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleLogoUpload(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleLogoUpload(file);
    }
  };

  const handleLogoUpload = async (file: File) => {
    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      setIsUploadingLogo(true);
      setError(null);
      setSuccess(null);

      const response = await uploadCompanyLogo(file);
      setLogoUrl(response.data.logoUrl || null);
      setSuccess("Logo uploaded successfully");
    } catch (err) {
      console.error("Error uploading logo:", err);
      setError(err instanceof Error ? err.message : "Failed to upload logo");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (!confirm("Are you sure you want to delete the company logo?")) {
      return;
    }

    try {
      setIsDeletingLogo(true);
      setError(null);
      setSuccess(null);

      await deleteCompanyLogo();
      setLogoUrl(null);
      setSuccess("Logo deleted successfully");
    } catch (err) {
      console.error("Error deleting logo:", err);
      setError(err instanceof Error ? err.message : "Failed to delete logo");
    } finally {
      setIsDeletingLogo(false);
    }
  };

  const handleDeleteCompany = async () => {
    const confirmMessage = "Are you sure you want to delete your company account, ALL user accounts and ALL asset data? This operation is IRREVOCABLE!";
    if (!confirm(confirmMessage)) {
      return;
    }

    const doubleConfirm = prompt("Type 'DELETE' to confirm this action:");
    if (doubleConfirm !== "DELETE") {
      return;
    }

    try {
      setIsDeletingCompany(true);
      setError(null);

      await deleteCompany();
      alert("Company account deleted successfully. You will be logged out.");
      // Redirect to login or clear session
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Error deleting company:", err);
      setError(err instanceof Error ? err.message : "Failed to delete company");
    } finally {
      setIsDeletingCompany(false);
    }
  };

  const handleDeleteAssetData = async () => {
    if (selectedDataTypes.length === 0) {
      alert("Please select at least one data type to delete");
      return;
    }

    const confirmMessage = `Are you sure you want to delete the following data types: ${selectedDataTypes.join(", ")}? This operation is IRREVOCABLE!`;
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setIsDeletingAssetData(true);
      setError(null);
      setSuccess(null);

      await deleteAssetData(selectedDataTypes);
      setSuccess(`Successfully deleted ${selectedDataTypes.length} data type(s)`);
      setShowDeleteAssetDataModal(false);
      setSelectedDataTypes([]);
    } catch (err) {
      console.error("Error deleting asset data:", err);
      setError(err instanceof Error ? err.message : "Failed to delete asset data");
    } finally {
      setIsDeletingAssetData(false);
    }
  };

  const dataTypes = [
    { id: "assets", label: "Assets" },
    { id: "sites", label: "Sites" },
    { id: "locations", label: "Locations" },
    { id: "categories", label: "Categories" },
    { id: "departments", label: "Departments" },
    { id: "contracts", label: "Contracts" },
    { id: "insurances", label: "Insurances" },
    { id: "funds", label: "Funds" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6 flex items-center">
        <Briefcase className="mr-2 h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Company Information</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 flex items-center text-green-800">
          <CheckCircle className="mr-2 h-5 w-5 shrink-0" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Company Details Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-orange-50 p-3">
                  <Briefcase className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Company details</h5>
                  <p className="text-sm text-gray-600">Provide the name and site of the main office.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm font-semibold text-gray-900">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.company ? "border-red-300" : "border-gray-300"
                    }`}
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                  {formErrors.company && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.company}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="organizationType" className="mb-2 block text-sm font-semibold text-gray-900">
                    Organization Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.organizationType ? "border-red-300" : "border-gray-300"
                    }`}
                    id="organizationType"
                    name="organizationType"
                    value={formData.organizationType}
                    onChange={handleChange}
                  >
                    <option value="">Select Organization Type</option>
                    <option value="Small Business">Small Business</option>
                    <option value="Medium Enterprise">Medium Enterprise</option>
                    <option value="Large Enterprise">Large Enterprise</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  {formErrors.organizationType && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.organizationType}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="country" className="mb-2 block text-sm font-semibold text-gray-900">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.country ? "border-red-300" : "border-gray-300"
                    }`}
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                  </select>
                  {formErrors.country && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.country}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="address" className="mb-2 block text-sm font-semibold text-gray-900">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.address ? "border-red-300" : "border-gray-300"
                    }`}
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.address}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="aptSuite" className="mb-2 block text-sm font-semibold text-gray-900">
                    Apt./Suite
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    id="aptSuite"
                    name="aptSuite"
                    value={formData.aptSuite}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="city" className="mb-2 block text-sm font-semibold text-gray-900">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.city ? "border-red-300" : "border-gray-300"
                    }`}
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {formErrors.city && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.city}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="state" className="mb-2 block text-sm font-semibold text-gray-900">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.state ? "border-red-300" : "border-gray-300"
                    }`}
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  {formErrors.state && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.state}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="postalCode" className="mb-2 block text-sm font-semibold text-gray-900">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.postalCode ? "border-red-300" : "border-gray-300"
                    }`}
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                  />
                  {formErrors.postalCode && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.postalCode}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Timezone & Currency Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-orange-50 p-3">
                  <Clock className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Timezone & Currency</h5>
                  <p className="text-sm text-gray-600">Adjust the settings to fit your company's local timezone, currency, and date format.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="timezone" className="mb-2 block text-sm font-semibold text-gray-900">
                    Timezone <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.timezone ? "border-red-300" : "border-gray-300"
                    }`}
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                  >
                    <option value="">Select Timezone</option>
                    <option value="(GMT +5:30) Sri Jayawardenepura">(GMT +5:30) Sri Jayawardenepura</option>
                    <option value="(GMT +0:00) UTC">(GMT +0:00) UTC</option>
                    <option value="(GMT -5:00) Eastern Time">(GMT -5:00) Eastern Time</option>
                  </select>
                  {formErrors.timezone && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.timezone}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="currency" className="mb-2 block text-sm font-semibold text-gray-900">
                    Currency Symbol <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.currency ? "border-red-300" : "border-gray-300"
                    }`}
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="">Select Currency</option>
                    <option value="India Rupee (INR ₹)">India Rupee (INR ₹)</option>
                    <option value="US Dollar (USD $)">US Dollar (USD $)</option>
                    <option value="Euro (EUR €)">Euro (EUR €)</option>
                    <option value="British Pound (GBP £)">British Pound (GBP £)</option>
                  </select>
                  {formErrors.currency && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.currency}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="dateFormat" className="mb-2 block text-sm font-semibold text-gray-900">
                    Date format <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      formErrors.dateFormat ? "border-red-300" : "border-gray-300"
                    }`}
                    id="dateFormat"
                    name="dateFormat"
                    value={formData.dateFormat}
                    onChange={handleChange}
                  >
                    <option value="">Select Date Format</option>
                    <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                    <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                    <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                  </select>
                  {formErrors.dateFormat && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.dateFormat}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-900">
                    Financial Year begins on <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      className={`flex-1 rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        formErrors.financialYearMonth ? "border-red-300" : "border-gray-300"
                      }`}
                      id="financialYearMonth"
                      name="financialYearMonth"
                      value={formData.financialYearMonth}
                      onChange={handleChange}
                    >
                      <option value="">Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                    <select
                      className={`w-20 rounded border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        formErrors.financialYearDay ? "border-red-300" : "border-gray-300"
                      }`}
                      id="financialYearDay"
                      name="financialYearDay"
                      value={formData.financialYearDay}
                      onChange={handleChange}
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                        <option key={day} value={day.toString()}>{day}</option>
                      ))}
                    </select>
                  </div>
                  {(formErrors.financialYearMonth || formErrors.financialYearDay) && (
                    <p className="mt-1 text-xs text-red-600">
                      {formErrors.financialYearMonth || formErrors.financialYearDay}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Logo Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-orange-50 p-3">
                  <ImageIcon className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Company Logo</h5>
                  <p className="text-sm text-gray-600">Upload your organization's logo to make this space your own.</p>
                </div>
              </div>
              {logoUrl && (
                <div className="mb-4 flex items-center gap-4">
                  <img src={logoUrl} alt="Company Logo" className="h-24 w-24 rounded object-contain border border-gray-200" />
                  <button
                    type="button"
                    className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    onClick={handleDeleteLogo}
                    disabled={isDeletingLogo}
                  >
                    {isDeletingLogo ? (
                      <>
                        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Logo"
                    )}
                  </button>
                </div>
              )}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex min-h-[150px] items-center justify-center rounded border-2 border-dashed p-5 text-center ${
                  isDragging ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-50"
                }`}
              >
                {isUploadingLogo ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="mb-2 h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-600">Drop your image here or click to browse</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      onChange={handleFileInput}
                      className="hidden"
                      id="logoInput"
                    />
                    <label
                      htmlFor="logoInput"
                      className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Choose File
                    </label>
                  </div>
                )}
              </div>
              <p className="mt-2 text-center text-xs text-gray-500">Only (JPG, GIF, PNG) are allowed. Maximum file size: 5MB</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mb-4 flex justify-end gap-2">
            <button
              type="submit"
              className="rounded bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

          {/* Delete Company and Close Account Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-red-50 p-3">
                  <Trash2 className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Delete Company and Close Account</h5>
                  <p className="mb-2 text-sm text-gray-600">
                    This operation will delete your company account, ALL user accounts and ALL asset data. This operation is irrevocable.
                  </p>
                  <p className="text-sm text-gray-600">
                    If you want to just delete asset data, go to the 'Delete Asset Data' section below.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleDeleteCompany}
                disabled={isDeletingCompany}
              >
                {isDeletingCompany ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Company, User Accounts and ALL Data"
                )}
              </button>
            </div>
          </div>

          {/* Delete Asset Data Section */}
          <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-start">
                <div className="mr-3 rounded bg-orange-50 p-3">
                  <Trash2 className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h5 className="mb-2 text-lg font-semibold text-gray-900">Delete Asset Data</h5>
                  <p className="text-sm text-gray-600">
                    You can delete data related to assets, sites and locations, categories, departments, contracts, insurances and funds. This operation is irrevocable.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="rounded bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                onClick={() => setShowDeleteAssetDataModal(true)}
              >
                Select Data
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Delete Asset Data Modal */}
      {showDeleteAssetDataModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Select Data to Delete</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowDeleteAssetDataModal(false);
                  setSelectedDataTypes([]);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 space-y-2">
              {dataTypes.map((type) => (
                <label key={type.id} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 rounded border-gray-300"
                    checked={selectedDataTypes.includes(type.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDataTypes([...selectedDataTypes, type.id]);
                      } else {
                        setSelectedDataTypes(selectedDataTypes.filter((id) => id !== type.id));
                      }
                    }}
                  />
                  <span className="text-sm text-gray-900">{type.label}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowDeleteAssetDataModal(false);
                  setSelectedDataTypes([]);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleDeleteAssetData}
                disabled={isDeletingAssetData || selectedDataTypes.length === 0}
              >
                {isDeletingAssetData ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Selected"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}