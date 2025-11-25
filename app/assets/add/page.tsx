"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Calendar,
  HelpCircle,
  Plus,
  Upload,
} from "lucide-react";

export default function AddAssetPage() {
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
    site: "Casagrand Boulev",
    location: "Common Area",
    category: "Asset",
    department: "Asset",
    depreciableAsset: "Yes",
    depreciableCost: "",
    assetLife: "",
    salvageValue: "0",
    depreciationMethod: "Declining Balance",
    dateAcquired: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({ ...prev, depreciableAsset: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="Casagrand Boulev">Casagrand Boulev</option>
                  </select>
                  <button
                    type="button"
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="Common Area">Common Area</option>
                  </select>
                  <button
                    type="button"
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="Asset">Asset</option>
                  </select>
                  <button
                    type="button"
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  >
                    <option value="Asset">Asset</option>
                  </select>
                  <button
                    type="button"
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
              <Button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
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
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
            >
              Submit
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
