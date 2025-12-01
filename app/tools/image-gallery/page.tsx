"use client";

import { useState, useEffect, useCallback } from "react";
import { ImageIcon, Upload, Search, X, Loader2, AlertCircle, Trash2, Eye } from "lucide-react";
import {
  getImages,
  uploadImage,
  deleteImage,
  bulkDeleteImages,
  getImage,
  type Image as ImageType,
  type PaginatedResponse,
  type ImageDetails,
} from "@/lib/api/images";

export default function ImageGalleryPage() {
  const [activeTab, setActiveTab] = useState<"your-uploads" | "stock-images">("your-uploads");
  const [activeFilter, setActiveFilter] = useState<"all" | "assigned-assets" | "assigned-inventory" | "unassigned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    startRecord: 0,
    endRecord: 0,
  });
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageDetails | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | string | null>(null);
  const [selectedRows, setSelectedRows] = useState<(number | string)[]>([]);
  
  // Upload form
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    description: "",
  });
  const [uploadErrors, setUploadErrors] = useState<{ [key: string]: string }>({});

  // Fetch images from API
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setImages([]);
          setPagination({
            totalRecords: 0,
            totalPages: 0,
            startRecord: 0,
            endRecord: 0,
          });
          setLoading(false);
          return;
        }
      }

      const response: PaginatedResponse<ImageType> = await getImages(
        currentPage,
        50, // Show 50 images per page for grid view
        searchQuery,
        activeFilter,
        activeTab
      );
      setImages(response.data || []);
      setPagination(response.pagination);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch images");
      setImages([]);
      setPagination({
        totalRecords: 0,
        totalPages: 0,
        startRecord: 0,
        endRecord: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, activeFilter, activeTab]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchImages();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter, activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, activeTab]);

  const handleUpload = async () => {
    setUploadErrors({});
    
    if (!uploadForm.file) {
      setUploadErrors({ file: "Please select an image file" });
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(uploadForm.file.type)) {
      setUploadErrors({ file: "Please select a valid image file (JPEG, PNG, GIF, or WebP)" });
      return;
    }

    // Validate file size (max 10MB)
    if (uploadForm.file.size > 10 * 1024 * 1024) {
      setUploadErrors({ file: "File size must be less than 10MB" });
      return;
    }

    try {
      setIsUploading(true);
      await uploadImage({
        file: uploadForm.file,
        description: uploadForm.description.trim() || undefined,
      });
      await fetchImages();
      setIsUploadModalOpen(false);
      setUploadForm({ file: null, description: "" });
      setUploadErrors({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image";
      alert(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteImage(id);
      await fetchImages();
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete image");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select images to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} image(s)?`)) {
      return;
    }

    try {
      setIsDeleting(-1);
      await bulkDeleteImages(selectedRows);
      await fetchImages();
      setSelectedRows([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete images");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleViewDetails = async (id: number | string) => {
    try {
      setLoading(true);
      const response = await getImage(id);
      setSelectedImage(response.data);
      setIsDetailsModalOpen(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to load image details");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectImage = (id: number | string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <ImageIcon className="mr-2 h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Image Gallery</h1>
        </div>
        <button
          type="button"
          className="flex items-center rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          onClick={() => setIsUploadModalOpen(true)}
          disabled={loading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      {selectedRows.length > 0 && (
        <div className="mb-4 rounded-lg bg-blue-50 p-4 flex items-center justify-between">
          <span className="text-sm text-blue-800">
            {selectedRows.length} image(s) selected
          </span>
          <button
            type="button"
            className="flex items-center rounded border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            onClick={handleBulkDelete}
            disabled={isDeleting === -1}
          >
            {isDeleting === -1 ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </>
            )}
          </button>
        </div>
      )}

      {/* Main Content Card */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          {/* Tabs */}
          <div className="mb-4 flex gap-3 border-b-2 border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("your-uploads")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "your-uploads"
                  ? "border-b-3 border-orange-500 text-orange-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{
                borderBottom: activeTab === "your-uploads" ? "3px solid #FF8C00" : "3px solid transparent",
              }}
            >
              Your Uploads
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("stock-images")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "stock-images"
                  ? "border-b-3 border-orange-500 text-orange-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{
                borderBottom: activeTab === "stock-images" ? "3px solid #FF8C00" : "3px solid transparent",
              }}
            >
              Stock Images
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                className="w-full rounded border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(["all", "assigned-assets", "assigned-inventory", "unassigned"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`rounded border px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeFilter === filter
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter === "all" ? "All" : 
                   filter === "assigned-assets" ? "Assigned to Assets" :
                   filter === "assigned-inventory" ? "Assigned to Inventory" :
                   "Unassigned"}
                </button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : images.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg">No images found.</p>
              <p className="mt-2 text-sm">Upload an image to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-gray-100 transition-shadow hover:shadow-md"
                  onClick={() => handleViewDetails(image.id)}
                >
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(image.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectImage(image.id);
                    }}
                    className="absolute left-2 top-2 z-10 rounded border-gray-300"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {image.thumbnailUrl || image.url ? (
                    <img
                      src={image.thumbnailUrl || image.url}
                      alt={image.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="truncate text-xs text-white">{image.name}</p>
                  </div>
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      className="rounded bg-white p-1.5 text-gray-700 shadow hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(image.id);
                      }}
                      title="View Details"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="rounded bg-white p-1.5 text-red-600 shadow hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(image.id);
                      }}
                      disabled={isDeleting === image.id}
                      title="Delete"
                    >
                      {isDeleting === image.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && images.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {pagination.startRecord} to {pagination.endRecord} of {pagination.totalRecords} images
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="rounded bg-orange-500 px-3 py-1 text-sm font-medium text-white">
                  {currentPage} / {pagination.totalPages}
                </span>
                <button
                  className="rounded border border-gray-300 bg-white px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                  disabled={currentPage >= pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Image Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Upload Image</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadForm({ file: null, description: "" });
                  setUploadErrors({});
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Image File <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    setUploadForm({ ...uploadForm, file: file || null });
                    if (uploadErrors.file) {
                      setUploadErrors({ ...uploadErrors, file: "" });
                    }
                  }}
                />
                {uploadErrors.file && (
                  <p className="mt-1 text-xs text-red-600">{uploadErrors.file}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Supported formats: JPEG, PNG, GIF, WebP (Max 10MB)</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Description (Optional)
                </label>
                <textarea
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={3}
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  placeholder="Enter image description"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadForm({ file: null, description: "" });
                  setUploadErrors({});
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Details Modal */}
      {isDetailsModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Image Details</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedImage(null);
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="w-full rounded-lg border border-gray-200"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedImage.name}</p>
                </div>
                {selectedImage.description && (
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedImage.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Dimensions</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedImage.width} × {selectedImage.height} px
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">File Size</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {(selectedImage.fileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Upload Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedImage.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Upload By</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedImage.uploadBy}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedImage.assignedTo === "asset" && "Assigned to Asset"}
                    {selectedImage.assignedTo === "inventory" && "Assigned to Inventory Item"}
                    {selectedImage.assignedTo === "unassigned" && "Unassigned"}
                  </p>
                  {selectedImage.assignedToName && (
                    <p className="mt-1 text-xs text-gray-600">{selectedImage.assignedToName}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setSelectedImage(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
