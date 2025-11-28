const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface ListAsset {
  id: string;
  assetTagId: string;
  description: string;
  brand?: string;
  purchaseDate?: string;
  status: "Available" | "Broken" | "Checked-out" | "Sold" | "Disposed" | string;
  serialNo?: string;
  capacity?: string;
  imageUrl?: string;
  imageType?: string;
  [key: string]: any; // For additional custom fields
}

export interface ListWarranty {
  id: string;
  active: boolean;
  assetTagId: string;
  description: string;
  lengthMonths: number;
  expires: string;
  notes?: string;
  assetId?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number | string;
  updatedBy?: number | string;
}

export interface ListMaintenance {
  id: string;
  status: "Scheduled" | "In progress" | "On Hold" | "Cancelled" | "Completed";
  expires: string; // Due date
  assetTagId: string;
  description: string;
  title: string;
  maintenanceDetail: string;
  maintenanceBy?: string;
  dateCompleted?: string;
  maintenanceCost?: number | string;
  repeating?: boolean;
  frequency?: "Daily" | "Weekly" | "Monthly" | string;
  recurOnEvery?: string;
  assetId?: string;
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

export interface CreateWarrantyData {
  assetId: string;
  lengthMonths?: number;
  expirationDate: string;
  notes?: string;
}

export interface UpdateWarrantyData {
  lengthMonths?: number;
  expirationDate?: string;
  notes?: string;
  active?: boolean;
}

export interface CreateMaintenanceData {
  assetId: string;
  title: string;
  details?: string;
  dueDate?: string;
  maintenanceBy?: string;
  maintenanceStatus?: "Scheduled" | "In progress" | "On Hold" | "Cancelled" | "Completed";
  dateCompleted?: string;
  maintenanceCost?: number | string;
  repeating?: boolean;
  frequency?: "Daily" | "Weekly" | "Monthly";
  recurOnEvery?: string;
}

export interface UpdateMaintenanceData {
  title?: string;
  details?: string;
  dueDate?: string;
  maintenanceBy?: string;
  maintenanceStatus?: "Scheduled" | "In progress" | "On Hold" | "Cancelled" | "Completed";
  dateCompleted?: string;
  maintenanceCost?: number | string;
  repeating?: boolean;
  frequency?: "Daily" | "Weekly" | "Monthly";
  recurOnEvery?: string;
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

// ============ ASSETS LIST API ============

// Get assets list with pagination, sorting, and filtering
export const getAssetsList = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder: "asc" | "desc" = "asc",
  search?: string,
  status?: string
): Promise<PaginatedResponse<ListAsset>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
  }

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  if (status) {
    params.append("status", status);
  }

  const endpoint = `/v1/lists/assets?${params}`;
  return apiRequest<PaginatedResponse<ListAsset>>(endpoint);
};

// Export assets to Excel/CSV
export const exportAssetsList = async (
  format: "csv" | "xlsx" = "csv",
  sortBy?: string,
  sortOrder: "asc" | "desc" = "asc",
  search?: string,
  status?: string
): Promise<Blob> => {
  const params = new URLSearchParams({
    format,
  });

  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
  }

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  if (status) {
    params.append("status", status);
  }

  const token = getAuthToken();
  const url = `${API_BASE_URL}/v1/lists/assets/export?${params}`;

  const response = await fetch(url, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to export assets: ${response.statusText}`);
  }

  return response.blob();
};

// ============ WARRANTIES LIST API ============

// Get warranties list with pagination, sorting, and filtering
export const getWarrantiesList = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder: "asc" | "desc" = "asc",
  filter?: "all" | "active" | "expired",
  search?: string
): Promise<PaginatedResponse<ListWarranty>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
  }

  if (filter && filter !== "all") {
    params.append("filter", filter);
  }

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  const endpoint = `/v1/lists/warranties?${params}`;
  return apiRequest<PaginatedResponse<ListWarranty>>(endpoint);
};

// Get warranty by ID
export const getWarranty = async (id: string): Promise<{ data: ListWarranty }> => {
  const endpoint = `/v1/lists/warranties/${id}`;
  return apiRequest<{ data: ListWarranty }>(endpoint);
};

// Create warranty
export const createWarranty = async (data: CreateWarrantyData): Promise<{ data: ListWarranty }> => {
  const endpoint = `/v1/lists/warranties`;
  return apiRequest<{ data: ListWarranty }>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update warranty
export const updateWarranty = async (
  id: string,
  data: UpdateWarrantyData
): Promise<{ data: ListWarranty }> => {
  const endpoint = `/v1/lists/warranties/${id}`;
  return apiRequest<{ data: ListWarranty }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete warranty
export const deleteWarranty = async (id: string): Promise<{ message: string }> => {
  const endpoint = `/v1/lists/warranties/${id}`;
  return apiRequest<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

// Export warranties to Excel/CSV
export const exportWarrantiesList = async (
  format: "csv" | "xlsx" = "csv",
  sortBy?: string,
  sortOrder: "asc" | "desc" = "asc",
  filter?: "all" | "active" | "expired",
  search?: string
): Promise<Blob> => {
  const params = new URLSearchParams({
    format,
  });

  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
  }

  if (filter && filter !== "all") {
    params.append("filter", filter);
  }

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  const token = getAuthToken();
  const url = `${API_BASE_URL}/v1/lists/warranties/export?${params}`;

  const response = await fetch(url, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to export warranties: ${response.statusText}`);
  }

  return response.blob();
};

// Import warranties from file
export const importWarranties = async (file: File): Promise<{
  message: string;
  totalRows: number;
  importedCount: number;
  failedCount: number;
  errors?: Array<{ row: number; [key: string]: any; error: string }>;
}> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/v1/lists/warranties/import`;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
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

  return response.json();
};

// ============ MAINTENANCES LIST API ============

// Get maintenances list with pagination, sorting, and filtering
export const getMaintenancesList = async (
  page: number = 1,
  limit: number = 10,
  sortBy?: string,
  sortOrder: "asc" | "desc" = "asc",
  filter?: "all" | "scheduled" | "completed" | "cancelled",
  search?: string
): Promise<PaginatedResponse<ListMaintenance>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
  }

  if (filter && filter !== "all") {
    params.append("filter", filter);
  }

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  const endpoint = `/v1/lists/maintenances?${params}`;
  return apiRequest<PaginatedResponse<ListMaintenance>>(endpoint);
};

// Get maintenance by ID
export const getMaintenance = async (id: string): Promise<{ data: ListMaintenance }> => {
  const endpoint = `/v1/lists/maintenances/${id}`;
  return apiRequest<{ data: ListMaintenance }>(endpoint);
};

// Create maintenance
export const createMaintenance = async (data: CreateMaintenanceData): Promise<{ data: ListMaintenance }> => {
  const endpoint = `/v1/lists/maintenances`;
  return apiRequest<{ data: ListMaintenance }>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update maintenance
export const updateMaintenance = async (
  id: string,
  data: UpdateMaintenanceData
): Promise<{ data: ListMaintenance }> => {
  const endpoint = `/v1/lists/maintenances/${id}`;
  return apiRequest<{ data: ListMaintenance }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete maintenance
export const deleteMaintenance = async (id: string): Promise<{ message: string }> => {
  const endpoint = `/v1/lists/maintenances/${id}`;
  return apiRequest<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

// Export maintenances to Excel/CSV
export const exportMaintenancesList = async (
  format: "csv" | "xlsx" = "csv",
  sortBy?: string,
  sortOrder: "asc" | "desc" = "asc",
  filter?: "all" | "scheduled" | "completed" | "cancelled",
  search?: string
): Promise<Blob> => {
  const params = new URLSearchParams({
    format,
  });

  if (sortBy) {
    params.append("sortBy", sortBy);
    params.append("sortOrder", sortOrder);
  }

  if (filter && filter !== "all") {
    params.append("filter", filter);
  }

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  const token = getAuthToken();
  const url = `${API_BASE_URL}/v1/lists/maintenances/export?${params}`;

  const response = await fetch(url, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to export maintenances: ${response.statusText}`);
  }

  return response.blob();
};

// Import maintenances from file
export const importMaintenances = async (file: File): Promise<{
  message: string;
  totalRows: number;
  importedCount: number;
  failedCount: number;
  errors?: Array<{ row: number; [key: string]: any; error: string }>;
}> => {
  const token = getAuthToken();
  const url = `${API_BASE_URL}/v1/lists/maintenances/import`;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
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

  return response.json();
};

