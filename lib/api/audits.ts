const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface Audit {
  id: number | string;
  name: string;
  siteId: number | string;
  siteName: string;
  locationId: number | string;
  locationName: string;
  status: string; // "draft", "in-progress", "completed", "cancelled"
  assetCount?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number | string;
  updatedBy?: number | string;
}

export interface Site {
  id: number | string;
  site: string;
  city?: string;
  state?: string;
  country?: string;
  address?: string;
}

export interface Location {
  id: number | string;
  location: string;
  siteId?: number | string;
  siteName?: string;
}

export interface Asset {
  id: number | string;
  assetId: string;
  name: string;
  category?: string;
  categoryId?: number | string;
  siteId?: number | string;
  siteName?: string;
  locationId?: number | string;
  locationName?: string;
  status?: string;
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

export interface CreateAuditData {
  name: string;
  siteId: number | string;
  locationId: number | string;
  status?: string;
}

export interface UpdateAuditData {
  name?: string;
  siteId?: number | string;
  locationId?: number | string;
  status?: string;
}

export interface AddAssetsToAuditData {
  auditId: number | string;
  assetIds: (number | string)[];
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

// ============ AUDITS API ============

// Get audits list
export const getAudits = async (
  page: number = 1,
  limit: number = 100,
  search: string = "",
  status?: string
): Promise<PaginatedResponse<Audit>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  if (status) {
    params.append("status", status);
  }

  const endpoint = `/v1/audits?${params}`;
  return apiRequest<PaginatedResponse<Audit>>(endpoint);
};

// Get single audit by ID
export const getAudit = async (id: number | string): Promise<{ data: Audit }> => {
  const endpoint = `/v1/audits/${id}`;
  return apiRequest<{ data: Audit }>(endpoint);
};

// Create new audit
export const createAudit = async (data: CreateAuditData): Promise<{ data: Audit }> => {
  const endpoint = `/v1/audits`;
  return apiRequest<{ data: Audit }>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update audit
export const updateAudit = async (
  id: number | string,
  data: UpdateAuditData
): Promise<{ data: Audit }> => {
  const endpoint = `/v1/audits/${id}`;
  return apiRequest<{ data: Audit }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete audit
export const deleteAudit = async (id: number | string): Promise<{ message: string }> => {
  const endpoint = `/v1/audits/${id}`;
  return apiRequest<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

// Add assets to audit
export const addAssetsToAudit = async (
  data: AddAssetsToAuditData
): Promise<{ data: Audit; message: string }> => {
  const endpoint = `/v1/audits/${data.auditId}/assets`;
  return apiRequest<{ data: Audit; message: string }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ assetIds: data.assetIds }),
  });
};

// ============ SITES API ============

// Get sites list
export const getSites = async (): Promise<{ data: Site[] }> => {
  const endpoint = `/v1/sites`;
  return apiRequest<{ data: Site[] }>(endpoint);
};

// Get single site by ID
export const getSite = async (id: number | string): Promise<{ data: Site }> => {
  const endpoint = `/v1/sites/${id}`;
  return apiRequest<{ data: Site }>(endpoint);
};

// ============ LOCATIONS API ============

// Get locations list (optionally filtered by site)
export const getLocations = async (
  siteId?: number | string
): Promise<{ data: Location[] }> => {
  const params = new URLSearchParams();
  if (siteId) {
    params.append("siteId", siteId.toString());
  }
  const endpoint = `/v1/locations${params.toString() ? `?${params}` : ""}`;
  return apiRequest<{ data: Location[] }>(endpoint);
};

// Get single location by ID
export const getLocation = async (id: number | string): Promise<{ data: Location }> => {
  const endpoint = `/v1/locations/${id}`;
  return apiRequest<{ data: Location }>(endpoint);
};

// ============ ASSETS API ============

// Get assets list with filters
export const getAssets = async (
  page: number = 1,
  limit: number = 100,
  categoryId?: number | string,
  siteId?: number | string,
  locationId?: number | string,
  search?: string
): Promise<PaginatedResponse<Asset>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (categoryId) {
    params.append("categoryId", categoryId.toString());
  }

  if (siteId) {
    params.append("siteId", siteId.toString());
  }

  if (locationId) {
    params.append("locationId", locationId.toString());
  }

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  const endpoint = `/v1/assets?${params}`;
  return apiRequest<PaginatedResponse<Asset>>(endpoint);
};

// Get asset categories
export const getAssetCategories = async (): Promise<{ data: { id: number | string; name: string }[] }> => {
  const endpoint = `/v1/assets/categories`;
  return apiRequest<{ data: { id: number | string; name: string }[] }>(endpoint);
};

// Get assets by IDs (for asset IDs textarea input)
export const getAssetsByIds = async (
  assetIds: (number | string)[]
): Promise<{ data: Asset[] }> => {
  const endpoint = `/v1/assets/by-ids`;
  return apiRequest<{ data: Asset[] }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ assetIds }),
  });
};

