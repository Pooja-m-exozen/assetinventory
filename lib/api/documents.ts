const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface Document {
  id: number | string;
  fileName: string;
  description: string;
  fileType: string;
  fileSize?: number;
  fileUrl?: string;
  uploadDate: string;
  assetsAttached: number;
  inventoryItemsAttached: number;
  uploadBy: string;
  uploadById?: number | string;
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

export interface CreateDocumentData {
  file: File;
  description: string;
}

export interface UpdateDocumentData {
  description?: string;
}

export interface DocumentDetails {
  id: number | string;
  fileName: string;
  description: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  uploadDate: string;
  uploadBy: string;
  uploadById: number | string;
  assetsAttached: number;
  inventoryItemsAttached: number;
  attachedAssets?: Array<{
    id: number | string;
    assetId: string;
    name: string;
  }>;
  attachedInventoryItems?: Array<{
    id: number | string;
    itemId: string;
    name: string;
  }>;
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

// Get documents list with pagination and search
export const getDocuments = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  searchField: string = "all"
): Promise<PaginatedResponse<Document>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
    params.append("searchField", searchField || "all");
  }

  const endpoint = `/v1/documents?${params}`;
  return apiRequest<PaginatedResponse<Document>>(endpoint);
};

// Get single document by ID
export const getDocument = async (id: number | string): Promise<{ data: DocumentDetails }> => {
  const endpoint = `/v1/documents/${id}`;
  return apiRequest<{ data: DocumentDetails }>(endpoint);
};

// Upload document
export const uploadDocument = async (data: CreateDocumentData): Promise<{ data: Document }> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/v1/documents`;

  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("description", data.description);

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

// Update document
export const updateDocument = async (
  id: number | string,
  data: UpdateDocumentData
): Promise<{ data: Document }> => {
  const endpoint = `/v1/documents/${id}`;
  return apiRequest<{ data: Document }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete document
export const deleteDocument = async (id: number | string): Promise<{ message: string }> => {
  const endpoint = `/v1/documents/${id}`;
  return apiRequest<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

// Bulk delete documents
export const bulkDeleteDocuments = async (
  ids: (number | string)[]
): Promise<{ message: string; deletedCount: number }> => {
  try {
    const endpoint = `/v1/documents/bulk-delete`;
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
          await deleteDocument(id);
          deletedCount++;
        } catch (deleteErr) {
          errors.push(`Failed to delete document ${id}`);
        }
      }

      if (deletedCount > 0) {
        return { message: `Deleted ${deletedCount} document(s)`, deletedCount };
      } else {
        throw new Error(errors.join(", ") || "Failed to delete documents");
      }
    }
    throw err;
  }
};

// Download document
export const downloadDocument = async (id: number | string): Promise<Blob> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/v1/documents/${id}/download`;

  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      // If error response is not JSON, use status text
    }
    throw new Error(errorMessage);
  }

  return response.blob();
};

// Attach document to assets
export const attachDocumentToAssets = async (
  documentId: number | string,
  assetIds: (number | string)[]
): Promise<{ data: Document; message: string }> => {
  const endpoint = `/v1/documents/${documentId}/attach-assets`;
  return apiRequest<{ data: Document; message: string }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ assetIds }),
  });
};

// Attach document to inventory items
export const attachDocumentToInventoryItems = async (
  documentId: number | string,
  itemIds: (number | string)[]
): Promise<{ data: Document; message: string }> => {
  const endpoint = `/v1/documents/${documentId}/attach-inventory-items`;
  return apiRequest<{ data: Document; message: string }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ itemIds }),
  });
};

// Detach document from assets
export const detachDocumentFromAssets = async (
  documentId: number | string,
  assetIds: (number | string)[]
): Promise<{ data: Document; message: string }> => {
  const endpoint = `/v1/documents/${documentId}/detach-assets`;
  return apiRequest<{ data: Document; message: string }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ assetIds }),
  });
};

// Detach document from inventory items
export const detachDocumentFromInventoryItems = async (
  documentId: number | string,
  itemIds: (number | string)[]
): Promise<{ data: Document; message: string }> => {
  const endpoint = `/v1/documents/${documentId}/detach-inventory-items`;
  return apiRequest<{ data: Document; message: string }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ itemIds }),
  });
};

