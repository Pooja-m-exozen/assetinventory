"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  HelpCircle,
  Plus,
  Upload,
} from "lucide-react";
import { 
  createAsset, 
  getDropdownOptions, 
  createDropdownOption,
  uploadAssetPhoto,
  type CreateAssetData,
  type DropdownOption 
} from "@/lib/api/assets";
import { useRouter } from "next/navigation";

export default function AddAssetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    description: "",
    assetTagId: "",
    purchasedFrom: "",
    purchaseDate: "",
    brand: "",
    cost: "",
    model: "",
    capacity: "",
    serialNo: "",
    site: "",
    location: "",
    category: "",
    department: "",
    depreciableAsset: "Yes",
    depreciableCost: "",
    assetLife: "",
    salvageValue: "0",
    depreciationMethod: "Declining Balance",
    dateAcquired: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState<{
    site: DropdownOption[];
    location: DropdownOption[];
    category: DropdownOption[];
    department: DropdownOption[];
  }>({
    site: [],
    location: [],
    category: [],
    department: [],
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch dropdown options on component mount
  useEffect(() => {
    const fetchDropdownOptions = async () => {
      setLoading(true);
      try {
        const [siteRes, locationRes, categoryRes, departmentRes] = await Promise.all([
          getDropdownOptions("site"),
          getDropdownOptions("location"),
          getDropdownOptions("category"),
          getDropdownOptions("department"),
        ]);

        setDropdownOptions({
          site: siteRes.data || [],
          location: locationRes.data || [],
          category: categoryRes.data || [],
          department: departmentRes.data || [],
        });
      } catch (err) {
        console.error("Error fetching dropdown options:", err);
        setError(err instanceof Error ? err.message : "Failed to load dropdown options");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownOptions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, depreciableAsset: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/gif", "image/png"];
      if (!validTypes.includes(file.type)) {
        setError("Only JPG, GIF, PNG files are allowed");
        return;
      }
      setPhotoFile(file);
      setError(null);
    }
  };

  const handleCreateNewOption = async (type: "site" | "location" | "category" | "department") => {
    const label = prompt(`Enter new ${type} name:`);
    if (!label || !label.trim()) return;

    try {
      const response = await createDropdownOption({
        type,
        value: label.trim(),
        label: label.trim(),
      });

      // Update the corresponding dropdown options
      setDropdownOptions((prev) => ({
        ...prev,
        [type]: [...prev[type], response.data],
      }));

      // Set the newly created option as selected
      setFormData((prev) => ({
        ...prev,
        [type]: response.data.value,
      }));
    } catch (err) {
      console.error(`Error creating ${type}:`, err);
      setError(err instanceof Error ? err.message : `Failed to create ${type}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const isDepreciable = formData.depreciableAsset === "Yes";

      // Validate required fields for depreciable assets
      if (isDepreciable) {
        if (!formData.depreciableCost || formData.depreciableCost.trim() === "") {
          setError("Depreciable cost is required when asset is depreciable");
          setSubmitting(false);
          return;
        }
        if (!formData.assetLife || formData.assetLife.trim() === "") {
          setError("Asset life is required when asset is depreciable");
          setSubmitting(false);
          return;
        }
        if (!formData.depreciationMethod || formData.depreciationMethod.trim() === "") {
          setError("Depreciation method is required when asset is depreciable");
          setSubmitting(false);
          return;
        }
        if (!formData.dateAcquired || formData.dateAcquired.trim() === "") {
          setError("Date acquired is required when asset is depreciable");
          setSubmitting(false);
          return;
        }
      }

      // Helper function to convert empty strings to undefined
      const toUndefined = (value: string) => (value && value.trim() !== "" ? value.trim() : undefined);
      const toNumber = (value: string) => {
        const trimmed = value?.trim();
        if (!trimmed) return undefined;
        const num = parseFloat(trimmed);
        return !isNaN(num) && isFinite(num) ? num : undefined;
      };
      const toInt = (value: string) => {
        const trimmed = value?.trim();
        if (!trimmed) return undefined;
        const num = parseInt(trimmed);
        return !isNaN(num) && isFinite(num) && num > 0 ? num : undefined;
      };

      // Prepare asset data
      const assetData: CreateAssetData = {
        description: formData.description.trim(),
        assetTagId: formData.assetTagId.trim(),
        purchasedFrom: toUndefined(formData.purchasedFrom),
        purchaseDate: toUndefined(formData.purchaseDate),
        brand: toUndefined(formData.brand),
        cost: toNumber(formData.cost),
        model: toUndefined(formData.model),
        capacity: toUndefined(formData.capacity),
        serialNo: toUndefined(formData.serialNo),
        site: formData.site.trim(),
        location: formData.location.trim(),
        category: formData.category.trim(),
        department: formData.department.trim(),
        depreciableAsset: isDepreciable,
        depreciableCost: isDepreciable ? toNumber(formData.depreciableCost) : undefined,
        assetLife: isDepreciable ? toInt(formData.assetLife) : undefined,
        salvageValue: toNumber(formData.salvageValue) ?? 0,
        depreciationMethod: isDepreciable ? formData.depreciationMethod.trim() : undefined,
        dateAcquired: isDepreciable ? formData.dateAcquired.trim() : undefined,
      };

      // Create the asset
      const response = await createAsset(assetData);
      
      // Upload photo if provided
      if (photoFile && response.data.id) {
        try {
          await uploadAssetPhoto(response.data.id, photoFile);
        } catch (photoErr) {
          console.error("Error uploading photo:", photoErr);
          // Don't fail the entire submission if photo upload fails
          setError("Asset created but photo upload failed. You can upload it later.");
        }
      }

      // Redirect to assets list or show success message
      router.push("/assets");
    } catch (err) {
      console.error("Error creating asset:", err);
      // Try to extract more detailed error message
      let errorMessage = "Failed to create asset";
      if (err instanceof Error) {
        errorMessage = err.message;
        
        // Check if there are validation details in the error
        if (err.message.includes("Validation failed")) {
          // Try to get more details from the error response
          try {
            // The error might have details attached if the API returns them
            const errorDetails = (err as any).details;
            if (errorDetails && typeof errorDetails === 'object') {
              const fieldErrors = Object.entries(errorDetails)
                .map(([field, message]) => `${field}: ${message}`)
                .join(', ');
              if (fieldErrors) {
                errorMessage = `Validation failed: ${fieldErrors}`;
              } else {
                errorMessage = "Validation failed. Please check all required fields are filled correctly.";
              }
            } else {
              errorMessage = "Validation failed. Please check all required fields are filled correctly.";
            }
          } catch (e) {
            errorMessage = "Validation failed. Please check all required fields are filled correctly.";
          }
        }
      }
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}
        >
        Add an Asset
      </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Details Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Asset Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Asset Tag ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="assetTagId"
                  value={formData.assetTagId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Purchased from
                </label>
                <input
                  type="text"
                  name="purchasedFrom"
                  value={formData.purchasedFrom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Purchase Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="purchaseDate"
                    value={formData.purchaseDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    placeholder="MM/dd/yyyy"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cost
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                    ₹
                  </span>
                  <input
                    type="text"
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    placeholder="India Rupee"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Capacity
                </label>
                <input
                  type="text"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Serial No
                </label>
                <input
                  type="text"
                  name="serialNo"
                  value={formData.serialNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
            </div>
          </div>

          {/* Site, Location, Category and Department Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Site, Location, Category and Department
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Site
                </label>
                <div className="flex items-center gap-2">
                  <select
                    name="site"
                    value={formData.site}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="">Select Site</option>
                    {dropdownOptions.site.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label || option.value}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleCreateNewOption("site")}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center gap-1 transition-colors"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <Plus className="h-4 w-4 text-orange-500" />
                    New
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <div className="flex items-center gap-2">
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="">Select Location</option>
                    {dropdownOptions.location.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label || option.value}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleCreateNewOption("location")}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center gap-1 transition-colors"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <Plus className="h-4 w-4 text-orange-500" />
                    New
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <div className="flex items-center gap-2">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="">Select Category</option>
                    {dropdownOptions.category.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label || option.value}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleCreateNewOption("category")}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center gap-1 transition-colors"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <Plus className="h-4 w-4 text-orange-500" />
                    New
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <div className="flex items-center gap-2">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="">Select Department</option>
                    {dropdownOptions.department.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.label || option.value}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleCreateNewOption("department")}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center gap-1 transition-colors"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <Plus className="h-4 w-4 text-orange-500" />
                    New
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Asset Photo Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Asset Photo
            </h2>
            <div className="space-y-2">
              <input
                type="file"
                id="photo-upload"
                accept="image/jpeg,image/jpg,image/gif,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => document.getElementById('photo-upload')?.click()}
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              {photoFile && (
                <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Selected: {photoFile.name}
                </p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Only (JPG, GIF, PNG) are allowed.
              </p>
            </div>
          </div>

          {/* Depreciation Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-4"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Depreciation
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Depreciable Asset
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="depreciableAsset"
                      value="Yes"
                      checked={formData.depreciableAsset === "Yes"}
                      onChange={() => handleRadioChange("Yes")}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      Yes
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="depreciableAsset"
                      value="No"
                      checked={formData.depreciableAsset === "No"}
                      onChange={() => handleRadioChange("No")}
                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                      No
                    </span>
                  </label>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Depreciable Cost
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                    ₹
                  </span>
                  <input
                    type="text"
                    name="depreciableCost"
                    value={formData.depreciableCost}
                    onChange={handleChange}
                    placeholder="India Rupee"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  including sales tax, freight and installation.
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Asset Life (months)
                </label>
                <input
                  type="text"
                  name="assetLife"
                  value={formData.assetLife}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Salvage Value
                </label>
                <div className="flex items-center">
                  <span className="px-3 py-2 border border-r-0 border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm">
                    ₹
                  </span>
                  <input
                    type="text"
                    name="salvageValue"
                    value={formData.salvageValue}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Depreciation Method
                </label>
                <select
                  name="depreciationMethod"
                  value={formData.depreciationMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  <option value="Declining Balance">Declining Balance</option>
                  <option value="Straight Line">Straight Line</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date Acquired
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateAcquired"
                    value={formData.dateAcquired}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                    placeholder="MM/dd/yyyy"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                  Depreciation begin date.
                </p>
              </div>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              disabled={submitting || loading}
            >
              {submitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </div>

      {/* Need Help Button - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 z-10">
        <Button
          type="button"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
