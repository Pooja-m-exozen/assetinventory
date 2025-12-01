const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface Asset {
  id: number;
  description: string;
  assetTagId: string;
  purchasedFrom?: string;
  purchaseDate?: string;
  brand?: string;
  cost?: number;
  model?: string;
  capacity?: string;
  serialNo?: string;
  site: string;
  location: string;
  category: string;
  department: string;
  photoUrl?: string;
  depreciableAsset: boolean;
  depreciableCost?: number;
  assetLife?: number;
  salvageValue: number;
  depreciationMethod?: string;
  dateAcquired?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
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

export interface CreateAssetData {
  description: string;
  assetTagId: string;
  purchasedFrom?: string;
  purchaseDate?: string;
  brand?: string;
  cost?: number;
  model?: string;
  capacity?: string;
  serialNo?: string;
  site: string;
  location: string;
  category: string;
  department: string;
  depreciableAsset: boolean;
  depreciableCost?: number;
  assetLife?: number;
  salvageValue?: number;
  depreciationMethod?: string;
  dateAcquired?: string;
}

export interface UpdateAssetData {
  description?: string;
  assetTagId?: string;
  purchasedFrom?: string;
  purchaseDate?: string;
  brand?: string;
  cost?: number;
  model?: string;
  capacity?: string;
  serialNo?: string;
  site?: string;
  location?: string;
  category?: string;
  department?: string;
  depreciableAsset?: boolean;
  depreciableCost?: number;
  assetLife?: number;
  salvageValue?: number;
  depreciationMethod?: string;
  dateAcquired?: string;
}

export interface DropdownOption {
  id: number;
  value: string;
  label: string;
  type: "site" | "location" | "category" | "department";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDropdownOptionData {
  type: "site" | "location" | "category" | "department";
  value: string;
  label?: string;
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
    "Content-Type": "application/json",
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
      const errorData = await response.json();
      
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
        errorDetails = errorData.error.details || null;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch (e) {
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage = text;
      }
    }
    
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
      errorMessage = "Session expired. Please login again.";
    }
    
    const error = new Error(errorMessage) as Error & { details?: any };
    if (errorDetails) {
      error.details = errorDetails;
    }
    throw error;
  }

  return response.json();
};

// Get assets list with pagination and search
export const getAssets = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  searchField: string = "all",
  site?: string,
  location?: string,
  category?: string,
  department?: string
): Promise<PaginatedResponse<Asset>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
    params.append("searchField", searchField);
  }

  if (site) {
    params.append("site", site);
  }

  if (location) {
    params.append("location", location);
  }

  if (category) {
    params.append("category", category);
  }

  if (department) {
    params.append("department", department);
  }

  return apiRequest<PaginatedResponse<Asset>>(`/v1/assets?${params}`);
};

// Get single asset by ID
export const getAsset = async (id: number): Promise<{ data: Asset }> => {
  return apiRequest<{ data: Asset }>(`/v1/assets/${id}`);
};

// Create new asset
export const createAsset = async (
  assetData: CreateAssetData
): Promise<{ data: Asset; message: string }> => {
  return apiRequest<{ data: Asset; message: string }>("/v1/assets", {
    method: "POST",
    body: JSON.stringify(assetData),
  });
};

// Update asset
export const updateAsset = async (
  id: number,
  assetData: UpdateAssetData
): Promise<{ data: Asset; message: string }> => {
  return apiRequest<{ data: Asset; message: string }>(`/v1/assets/${id}`, {
    method: "PUT",
    body: JSON.stringify(assetData),
  });
};

// Delete asset
export const deleteAsset = async (id: number): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(`/v1/assets/${id}`, {
    method: "DELETE",
  });
};

// Bulk delete assets
export const bulkDeleteAssets = async (
  ids: number[]
): Promise<{
  message: string;
  deletedCount: number;
  failedCount: number;
  failedIds: number[];
  errors?: { [key: number]: string };
}> => {
  return apiRequest(`/v1/assets/bulk`, {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
};

// Upload asset photo
export const uploadAssetPhoto = async (
  assetId: number,
  file: File
): Promise<{ message: string; photoUrl: string }> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(`${API_BASE_URL}/v1/assets/${assetId}/photo`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({
      error: {
        code: "UNKNOWN_ERROR",
        message: `HTTP ${response.status}: ${response.statusText}`,
      },
    }));
    throw new Error(errorData.error.message || "Photo upload failed");
  }

  return response.json();
};

// Delete asset photo
export const deleteAssetPhoto = async (assetId: number): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(`/v1/assets/${assetId}/photo`, {
    method: "DELETE",
  });
};

// Get dropdown options
export const getDropdownOptions = async (
  type: "site" | "location" | "category" | "department"
): Promise<{ data: DropdownOption[] }> => {
  return apiRequest<{ data: DropdownOption[] }>(`/v1/assets/dropdowns/${type}`);
};

// Create dropdown option
export const createDropdownOption = async (
  optionData: CreateDropdownOptionData
): Promise<{ data: DropdownOption; message: string }> => {
  return apiRequest<{ data: DropdownOption; message: string }>("/v1/assets/dropdowns", {
    method: "POST",
    body: JSON.stringify(optionData),
  });
};

// Import assets from file
export const importAssets = async (
  file: File
): Promise<{
  message: string;
  totalRows: number;
  importedCount: number;
  failedCount: number;
  errors?: Array<{ row: number; assetTagId: string; error: string }>;
}> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/v1/assets/import`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({
      error: {
        code: "UNKNOWN_ERROR",
        message: `HTTP ${response.status}: ${response.statusText}`,
      },
    }));
    throw new Error(errorData.error.message || "Import failed");
  }

  return response.json();
};

// Export assets
export const exportAssets = async (
  format: "csv" | "xlsx" = "csv",
  search: string = "",
  searchField: string = "all",
  site?: string,
  location?: string,
  category?: string,
  department?: string
): Promise<Blob> => {
  const token = getAuthToken();
  const params = new URLSearchParams({
    format,
  });

  if (search) {
    params.append("search", search);
    params.append("searchField", searchField);
  }

  if (site) {
    params.append("site", site);
  }

  if (location) {
    params.append("location", location);
  }

  if (category) {
    params.append("category", category);
  }

  if (department) {
    params.append("department", department);
  }

  const response = await fetch(`${API_BASE_URL}/v1/assets/export?${params}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Export failed");
  }

  return response.blob();
};

