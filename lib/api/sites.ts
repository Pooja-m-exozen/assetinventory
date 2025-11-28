const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface Site {
  id: number | string;
  site: string;
  description?: string;
  address: string;
  aptSuite?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  locationCount?: number; // Number of locations in this site (read-only)
  assetCount?: number; // Number of assets in this site (read-only)
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number | string;
  updatedBy?: number | string;
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

export interface CreateSiteData {
  site: string;
  description?: string;
  address: string;
  aptSuite?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface UpdateSiteData {
  site?: string;
  description?: string;
  address?: string;
  aptSuite?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
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

// Get sites list with pagination and search
export const getSites = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<PaginatedResponse<Site>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  const endpoint = `/v1/sites?${params}`;
  return apiRequest<PaginatedResponse<Site>>(endpoint);
};

// Get single site by ID
export const getSite = async (id: number | string): Promise<{ data: Site }> => {
  const endpoint = `/v1/sites/${id}`;
  return apiRequest<{ data: Site }>(endpoint);
};

// Create site
export const createSite = async (data: CreateSiteData): Promise<{ data: Site }> => {
  const endpoint = `/v1/sites`;
  return apiRequest<{ data: Site }>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update site
export const updateSite = async (
  id: number | string,
  data: UpdateSiteData
): Promise<{ data: Site }> => {
  const endpoint = `/v1/sites/${id}`;
  return apiRequest<{ data: Site }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete site
export const deleteSite = async (id: number | string): Promise<{ message: string }> => {
  const endpoint = `/v1/sites/${id}`;
  return apiRequest<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

// Bulk delete sites
export const bulkDeleteSites = async (
  ids: (number | string)[]
): Promise<{ message: string; deletedCount: number }> => {
  try {
    const endpoint = `/v1/sites/bulk-delete`;
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
          await deleteSite(id);
          deletedCount++;
        } catch (deleteErr) {
          errors.push(`Failed to delete site ${id}`);
        }
      }

      if (deletedCount > 0) {
        return { message: `Deleted ${deletedCount} site(s)`, deletedCount };
      } else {
        throw new Error(errors.join(", ") || "Failed to delete sites");
      }
    }
    throw err;
  }
};

// Import sites from file
export const importSites = async (
  file: File
): Promise<{
  message: string;
  totalRows: number;
  importedCount: number;
  failedCount: number;
  errors?: Array<{ row: number; site: string; error: string }>;
}> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/v1/sites/import`, {
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

// Export sites
export const exportSites = async (
  format: "csv" | "xlsx" = "xlsx"
): Promise<Blob> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const params = new URLSearchParams({
    format,
  });

  let url = `${API_BASE_URL}/v1/sites/export?${params}`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:
        format === "xlsx"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "text/csv",
    },
  });

  // If we get a 404 and the error mentions "export" as an ID, try alternative endpoint
  if (!response.ok && response.status === 404) {
    try {
      const errorData = await response.json();
      if (
        errorData.error?.message?.includes("export") &&
        errorData.error?.message?.includes("not found")
      ) {
        url = `${API_BASE_URL}/v1/sites/export-data?${params}`;
        response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              format === "xlsx"
                ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : "text/csv",
          },
        });
      }
    } catch (e) {
      // Continue with original response
    }
  }

  if (!response.ok) {
    let errorMessage = "Export failed";

    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch (e) {
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage = text;
      } else {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
    }

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
      errorMessage = "Session expired. Please login again.";
    }

    throw new Error(errorMessage);
  }

  const blob = await response.blob();

  if (!blob || blob.size === 0) {
    throw new Error("Export file is empty or invalid");
  }

  return blob;
};

