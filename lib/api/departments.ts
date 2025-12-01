const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface Department {
  id: number | string;
  department: string;
  description?: string;
  employeeCount?: number; // Number of employees in this department (read-only)
  assetCount?: number; // Number of assets assigned to this department (read-only)
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

export interface CreateDepartmentData {
  department: string;
  description?: string;
}

export interface UpdateDepartmentData {
  department?: string;
  description?: string;
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

// Get departments list with pagination and search
export const getDepartments = async (
  page: number = 1,
  limit: number = 10,
  search: string = ""
): Promise<PaginatedResponse<Department>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
  }

  const endpoint = `/v1/departments?${params}`;
  return apiRequest<PaginatedResponse<Department>>(endpoint);
};

// Get single department by ID
export const getDepartment = async (id: number | string): Promise<{ data: Department }> => {
  const endpoint = `/v1/departments/${id}`;
  return apiRequest<{ data: Department }>(endpoint);
};

// Create department
export const createDepartment = async (data: CreateDepartmentData): Promise<{ data: Department }> => {
  const endpoint = `/v1/departments`;
  return apiRequest<{ data: Department }>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update department
export const updateDepartment = async (
  id: number | string,
  data: UpdateDepartmentData
): Promise<{ data: Department }> => {
  const endpoint = `/v1/departments/${id}`;
  return apiRequest<{ data: Department }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete department
export const deleteDepartment = async (id: number | string): Promise<{ message: string }> => {
  const endpoint = `/v1/departments/${id}`;
  return apiRequest<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

// Bulk delete departments
export const bulkDeleteDepartments = async (
  ids: (number | string)[]
): Promise<{ message: string; deletedCount: number }> => {
  try {
    const endpoint = `/v1/departments/bulk-delete`;
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
          await deleteDepartment(id);
          deletedCount++;
        } catch (deleteErr) {
          errors.push(`Failed to delete department ${id}`);
        }
      }

      if (deletedCount > 0) {
        return { message: `Deleted ${deletedCount} department(s)`, deletedCount };
      } else {
        throw new Error(errors.join(", ") || "Failed to delete departments");
      }
    }
    throw err;
  }
};

// Import departments from file
export const importDepartments = async (
  file: File
): Promise<{
  message: string;
  totalRows: number;
  importedCount: number;
  failedCount: number;
  errors?: Array<{ row: number; department: string; error: string }>;
}> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/v1/departments/import`, {
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

// Export departments
export const exportDepartments = async (
  format: "csv" | "xlsx" = "xlsx"
): Promise<Blob> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const params = new URLSearchParams({
    format,
  });

  let url = `${API_BASE_URL}/v1/departments/export?${params}`;
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
        url = `${API_BASE_URL}/v1/departments/export-data?${params}`;
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

