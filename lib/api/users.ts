const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  role: string;
  securityGroupId: number;
  groupName: string;
  status: string;
  lastLogin?: string;
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

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  jobTitle?: string;
  role?: string;
  securityGroupId: number;
  status?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  jobTitle?: string;
  role?: string;
  securityGroupId?: number;
  status?: string;
}

export interface SecurityGroupOption {
  id: number;
  name: string;
  description: string;
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
      errorDetails = errorData;

      // Log full error response for debugging
      console.error("API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });

      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
        errorDetails = errorData.error;
        
        // If there's a code, include it in the message
        if (errorData.error.code) {
          errorMessage = `[${errorData.error.code}] ${errorMessage}`;
        }
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch (e) {
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage = text;
        console.error("API Error (text):", text);
      } else {
        console.error("API Error (no body):", response.status, response.statusText);
      }
    }

    // Clear token on unauthorized errors
    if (response.status === 401 || errorMessage.toLowerCase().includes("unauthorized") || errorMessage.toLowerCase().includes("token failed")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
      errorMessage = "Session expired or unauthorized. Please log in again.";
    }

    // Create error with details attached
    const error = new Error(errorMessage) as Error & { details?: any; response?: Response };
    if (errorDetails) {
      error.details = errorDetails;
    }
    error.response = response;
    throw error;
  }

  return response.json();
};

// Get users list with pagination and search
export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  searchField: string = "all",
  status?: string,
  securityGroupId?: number
): Promise<PaginatedResponse<User>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
    params.append("searchField", searchField);
  }

  if (status) {
    params.append("status", status);
  }

  if (securityGroupId) {
    params.append("securityGroupId", securityGroupId.toString());
  }

  return apiRequest<PaginatedResponse<User>>(`/v1/users?${params}`);
};

// Get single user by ID
export const getUser = async (id: number): Promise<{ data: User }> => {
  return apiRequest<{ data: User }>(`/v1/users/${id}`);
};

// Create user
export const createUser = async (data: CreateUserData): Promise<{ message: string; data: User }> => {
  // Log the data being sent (for debugging)
  console.log("Creating user with data:", { ...data, password: "***" });
  
  try {
    const result = await apiRequest<{ message: string; data: User }>("/v1/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
    console.log("User created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

// Update user
export const updateUser = async (id: number, data: UpdateUserData): Promise<{ message: string; data: User }> => {
  return apiRequest<{ message: string; data: User }>(`/v1/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete user
export const deleteUser = async (id: number): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(`/v1/users/${id}`, {
    method: "DELETE",
  });
};

// Bulk delete users
export const bulkDeleteUsers = async (ids: number[]): Promise<{ message: string; deletedCount: number; failedCount: number }> => {
  return apiRequest<{ message: string; deletedCount: number; failedCount: number }>("/v1/users/bulk", {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
};

// Reset user password
export const resetUserPassword = async (
  id: number,
  newPassword: string,
  sendEmail: boolean = true
): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(`/v1/users/${id}/reset-password`, {
    method: "POST",
    body: JSON.stringify({ newPassword, sendEmail }),
  });
};

// Update user status
export const updateUserStatus = async (id: number, status: string): Promise<{ message: string; data: Partial<User> }> => {
  return apiRequest<{ message: string; data: Partial<User> }>(`/v1/users/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

// Assign user to security group
export const assignUserToSecurityGroup = async (
  id: number,
  securityGroupId: number
): Promise<{ message: string; data: Partial<User> }> => {
  return apiRequest<{ message: string; data: Partial<User> }>(`/v1/users/${id}/security-group`, {
    method: "PUT",
    body: JSON.stringify({ securityGroupId }),
  });
};

// Get available security groups
export const getSecurityGroupsForUsers = async (): Promise<{ data: SecurityGroupOption[] }> => {
  return apiRequest<{ data: SecurityGroupOption[] }>("/v1/users/security-groups");
};

// Import users from file
export const importUsers = async (
  file: File
): Promise<{
  message: string;
  totalRows: number;
  importedCount: number;
  failedCount: number;
  errors?: Array<{ row: number; email: string; error: string }>;
}> => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/v1/users/import`, {
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

// Export users
export const exportUsers = async (
  format: "csv" | "xlsx" = "csv",
  search: string = "",
  searchField: string = "all",
  status?: string,
  securityGroupId?: number
): Promise<Blob> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const params = new URLSearchParams({
    format,
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
    params.append("searchField", searchField || "all");
  }

  if (status) {
    params.append("status", status);
  }

  if (securityGroupId) {
    params.append("securityGroupId", securityGroupId.toString());
  }

  const url = `${API_BASE_URL}/v1/users/export?${params}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv",
    },
  });

  if (!response.ok) {
    let errorMessage = "Export failed";

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
      }
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

  const contentType = response.headers.get("content-type") || "";

  const isExcel = contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
    contentType.includes("application/vnd.ms-excel");
  const isCsv = contentType.includes("text/csv");

  if (!isExcel && !isCsv) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error?.message || "Invalid export response");
    } catch (e) {
      if (e instanceof Error && !e.message.includes("JSON")) {
        throw e;
      }
      throw new Error(`Unexpected response type: ${contentType}. Expected Excel or CSV file.`);
    }
  }

  return response.blob();
};

