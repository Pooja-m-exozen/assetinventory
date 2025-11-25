"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Package,
  Calendar,
  HelpCircle,
  Plus,
  Upload,
  X,
} from "lucide-react";

export default function AddInventoryItemPage() {
  const [formData, setFormData] = useState({
    description: "",
    inventoryTagId: "",
    unit: "",
    notes: "",
    category: "Asset",
    openingDate: "2025-11-20",
    quantity: "0",
    poNo: "",
    openingNotes: "",
  });
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setFormData((prev) => ({ ...prev, category: newCategory.trim() }));
      setNewCategory("");
      setIsCategoryModalOpen(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png'];
      if (validTypes.includes(file.type)) {
        setSelectedFile(file);
        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid image file (JPG, GIF, or PNG)');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Package className="h-6 w-6" style={{ color: '#8B4513' }} />
          <h1
            className="text-2xl font-bold text-gray-900 dark:text-gray-50"
            style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '24px' }}
          >
            Add an Inventory Item
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inventory Item Details Section */}
          <div className="space-y-4">
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-gray-50"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Inventory Item Details
            </h2>
            <div className="space-y-4">
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Inventory Tag ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="inventoryTagId"
                    value={formData.inventoryTagId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unit
                  </label>
                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    eg. cable, toner, lbs., bottle, etc.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-y"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Section */}
          <div className="space-y-4">
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-gray-50"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Category
            </h2>
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
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm flex items-center gap-1 transition-colors"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                >
                  <Plus className="h-4 w-4 text-orange-500" />
                  New
                </button>
              </div>
            </div>
          </div>

          {/* Opening Balance Section */}
          <div className="space-y-4">
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-gray-50"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Opening Balance
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Opening Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="openingDate"
                    value={formData.openingDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 pr-10"
                    style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  PO No.
                </label>
                <input
                  type="text"
                  name="poNo"
                  value={formData.poNo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  name="openingNotes"
                  value={formData.openingNotes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-y"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                />
              </div>
            </div>
          </div>

          {/* Inventory Item Photo Section */}
          <div className="space-y-4">
            <h2
              className="text-lg font-semibold text-gray-900 dark:text-gray-50"
              style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '18px' }}
            >
              Inventory Item Photo
            </h2>
            <div className="space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/gif,image/png"
                className="hidden"
              />
              <Button
                type="button"
                onClick={handleChooseFile}
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              {selectedFile && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                    Selected: {selectedFile.name}
                  </p>
                  {filePreview && (
                    <div className="mt-2">
                      <img
                        src={filePreview}
                        alt="Preview"
                        className="max-w-xs max-h-48 rounded-md border border-gray-300"
                      />
                    </div>
                  )}
                </div>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
                Only (JPG, GIF, PNG) are allowed.
              </p>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-white"
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
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-4 py-3 flex items-center gap-2 shadow-lg"
          style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
        >
          <HelpCircle className="h-5 w-5" />
          <span className="text-sm font-medium">Need Help?</span>
        </Button>
      </div>

      {/* Add Category Modal */}
      {isCategoryModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCategoryModalOpen(false);
              setNewCategory("");
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2
                className="text-xl font-bold text-gray-900"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '20px' }}
              >
                Add a Category
              </h2>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setNewCategory("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <p
                className="text-sm text-gray-600 leading-relaxed"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                If you want to add a new category of assets, you're in the right spot. Add a category for <strong className="font-semibold text-gray-900">computer equipment</strong>, <strong className="font-semibold text-gray-900">wireless keyboards</strong>, or any assets you're working with.
              </p>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCategory.trim()) {
                      handleAddCategory();
                    }
                    if (e.key === 'Escape') {
                      setIsCategoryModalOpen(false);
                      setNewCategory("");
                    }
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setNewCategory("");
                }}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddCategory}
                className="bg-yellow-500 hover:bg-yellow-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}
                disabled={!newCategory.trim()}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

