const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
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

export interface CreateCustomerData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

export interface UpdateCustomerData {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
}

// Get authentication token from localStorage or session
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    // Check localStorage first, then sessionStorage
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
    
    try {
      const errorData = await response.json();
      
      // Handle different error response formats
      if (errorData.message) {
        // Simple format: { message: "..." }
        errorMessage = errorData.message;
      } else if (errorData.error) {
        // Nested format: { error: { message: "..." } }
        errorMessage = errorData.error.message || errorMessage;
      } else if (typeof errorData === 'string') {
        // String format
        errorMessage = errorData;
      }
    } catch (e) {
      // If JSON parsing fails, use default error message
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage = text;
      }
    }
    
    // Handle unauthorized errors specifically
    if (response.status === 401) {
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
      errorMessage = "Session expired. Please login again.";
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};

// Get customers list with pagination and search
export const getCustomers = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  searchField: string = "all"
): Promise<PaginatedResponse<Customer>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
    params.append("searchField", searchField);
  }

  return apiRequest<PaginatedResponse<Customer>>(`/v1/customers?${params}`);
};

// Get single customer by ID
export const getCustomer = async (id: number): Promise<{ data: Customer }> => {
  return apiRequest<{ data: Customer }>(`/v1/customers/${id}`);
};

// Create new customer
export const createCustomer = async (
  customerData: CreateCustomerData
): Promise<{ data: Customer; message: string }> => {
  return apiRequest<{ data: Customer; message: string }>("/v1/customers", {
    method: "POST",
    body: JSON.stringify(customerData),
  });
};

// Update customer
export const updateCustomer = async (
  id: number,
  customerData: UpdateCustomerData
): Promise<{ data: Customer; message: string }> => {
  return apiRequest<{ data: Customer; message: string }>(`/v1/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(customerData),
  });
};

// Delete customer
export const deleteCustomer = async (id: number): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(`/v1/customers/${id}`, {
    method: "DELETE",
  });
};

// Bulk delete customers
export const bulkDeleteCustomers = async (
  ids: number[]
): Promise<{
  message: string;
  deletedCount: number;
  failedCount: number;
  failedIds: number[];
  errors?: { [key: number]: string };
}> => {
  return apiRequest(`/v1/customers/bulk`, {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
};

// Import customers from file
export const importCustomers = async (
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

  const response = await fetch(`${API_BASE_URL}/v1/customers/import`, {
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

// Export customers
export const exportCustomers = async (
  format: "csv" | "xlsx" = "csv",
  search: string = "",
  searchField: string = "all"
): Promise<Blob> => {
  const token = getAuthToken();
  const params = new URLSearchParams({
    format,
  });

  if (search) {
    params.append("search", search);
    params.append("searchField", searchField);
  }

  const response = await fetch(`${API_BASE_URL}/v1/customers/export?${params}`, {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Export failed");
  }

  return response.blob();
};

// Get column configuration
export const getColumnConfiguration = async (): Promise<{
  columns: Array<{
    key: string;
    label: string;
    visible: boolean;
    order: number;
    sortable: boolean;
  }>;
}> => {
  return apiRequest("/v1/customers/columns");
};

// Update column configuration
export const updateColumnConfiguration = async (
  columns: Array<{
    key: string;
    visible: boolean;
    order: number;
  }>
): Promise<{ message: string }> => {
  return apiRequest("/v1/customers/columns", {
    method: "PUT",
    body: JSON.stringify({ columns }),
  });
};
