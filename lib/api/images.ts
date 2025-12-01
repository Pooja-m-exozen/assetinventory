const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface Image {
  id: number | string;
  url: string;
  thumbnailUrl?: string;
  name: string;
  description?: string;
  fileSize?: number;
  width?: number;
  height?: number;
  mimeType?: string;
  assignedTo: "asset" | "inventory" | "unassigned";
  assignedToId?: number | string;
  assignedToName?: string;
  uploadDate: string;
  uploadBy: string;
  uploadById?: number | string;
  isStockImage?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    recordsPerPage: number;
    totalRecords: number;
    totalPages: number;
    startRecord: number;
    endRecord: number;
  };
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface CreateImageData {
  file: File;
  description?: string;
}

export interface UpdateImageData {
  name?: string;
  description?: string;
}

export interface ImageDetails {
  id: number | string;
  url: string;
  thumbnailUrl?: string;
  name: string;
  description?: string;
  fileSize: number;
  width: number;
  height: number;
  mimeType: string;
  assignedTo: "asset" | "inventory" | "unassigned";
  assignedToId?: number | string;
  assignedToName?: string;
  uploadDate: string;
  uploadBy: string;
  uploadById: number | string;
  isStockImage: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get authentication token from localStorage or session
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    const localToken = localStorage.getItem("authToken");
    const sessionToken = sessionStorage.getItem("authToken");
    return localToken || sessionToken;
  }
  return null;
};

// API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetails: any = null;

    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
      errorDetails = errorData.error?.details;
    } catch {
      // If error response is not JSON, use status text
    }

    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.details = errorDetails;
    throw error;
  }

  return response.json();
};

// Get images list with pagination and filters
export const getImages = async (
  page: number = 1,
  limit: number = 50,
  search: string = "",
  filter: "all" | "assigned-assets" | "assigned-inventory" | "unassigned" = "all",
  imageType: "your-uploads" | "stock-images" = "your-uploads"
): Promise<PaginatedResponse<Image>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  if (filter !== "all") {
    if (filter === "assigned-assets") {
      params.append("assignedTo", "asset");
    } else if (filter === "assigned-inventory") {
      params.append("assignedTo", "inventory");
    } else if (filter === "unassigned") {
      params.append("assignedTo", "unassigned");
    }
  }

  if (imageType === "stock-images") {
    params.append("isStockImage", "true");
  } else {
    params.append("isStockImage", "false");
  }

  const endpoint = `/v1/images?${params}`;
  return apiRequest<PaginatedResponse<Image>>(endpoint);
};

// Get single image by ID
export const getImage = async (id: number | string): Promise<{ data: ImageDetails }> => {
  const endpoint = `/v1/images/${id}`;
  return apiRequest<{ data: ImageDetails }>(endpoint);
};

// Upload image
export const uploadImage = async (data: CreateImageData): Promise<{ data: Image }> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/v1/images`;

  const formData = new FormData();
  formData.append("file", data.file);
  if (data.description) {
    formData.append("description", data.description);
  }

  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    let errorDetails: any = null;

    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
      errorDetails = errorData.error?.details;
    } catch {
      // If error response is not JSON, use status text
    }

    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.details = errorDetails;
    throw error;
  }

  return response.json();
};

// Update image
export const updateImage = async (
  id: number | string,
  data: UpdateImageData
): Promise<{ data: Image }> => {
  const endpoint = `/v1/images/${id}`;
  return apiRequest<{ data: Image }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete image
export const deleteImage = async (id: number | string): Promise<{ message: string }> => {
  const endpoint = `/v1/images/${id}`;
  return apiRequest<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

// Bulk delete images
export const bulkDeleteImages = async (
  ids: (number | string)[]
): Promise<{ message: string; deletedCount: number }> => {
  try {
    const endpoint = `/v1/images/bulk-delete`;
    return apiRequest<{ message: string; deletedCount: number }>(endpoint, {
      method: "POST",
      body: JSON.stringify({ ids }),
    });
  } catch (err: any) {
    // Fallback to individual deletes if bulk endpoint fails
    if (err.message?.includes("bulk") || err.message?.includes("not found")) {
      let deletedCount = 0;
      const errors: string[] = [];

      for (const id of ids) {
        try {
          await deleteImage(id);
          deletedCount++;
        } catch (deleteErr) {
          errors.push(`Failed to delete image ${id}`);
        }
      }

      if (deletedCount > 0) {
        return { message: `Deleted ${deletedCount} image(s)`, deletedCount };
      } else {
        throw new Error(errors.join(", ") || "Failed to delete images");
      }
    }
    throw err;
  }
};

// Attach image to asset
export const attachImageToAsset = async (
  imageId: number | string,
  assetId: number | string
): Promise<{ data: Image; message: string }> => {
  const endpoint = `/v1/images/${imageId}/attach-asset`;
  return apiRequest<{ data: Image; message: string }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ assetId }),
  });
};

// Attach image to inventory item
export const attachImageToInventoryItem = async (
  imageId: number | string,
  itemId: number | string
): Promise<{ data: Image; message: string }> => {
  const endpoint = `/v1/images/${imageId}/attach-inventory-item`;
  return apiRequest<{ data: Image; message: string }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ itemId }),
  });
};

// Detach image from asset
export const detachImageFromAsset = async (
  imageId: number | string
): Promise<{ data: Image; message: string }> => {
  const endpoint = `/v1/images/${imageId}/detach-asset`;
  return apiRequest<{ data: Image; message: string }>(endpoint, {
    method: "POST",
  });
};

// Detach image from inventory item
export const detachImageFromInventoryItem = async (
  imageId: number | string
): Promise<{ data: Image; message: string }> => {
  const endpoint = `/v1/images/${imageId}/detach-inventory-item`;
  return apiRequest<{ data: Image; message: string }>(endpoint, {
    method: "POST",
  });
};

