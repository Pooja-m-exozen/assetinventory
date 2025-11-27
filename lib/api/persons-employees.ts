const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface PersonEmployee {
  id: number;
  name: string;
  employeeId: string;
  title: string;
  phone: string;
  email: string;
  site: string;
  location: string;
  department: string;
  notes: string;
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

export interface CreatePersonEmployeeData {
  name: string;
  employeeId: string;
  title: string;
  phone?: string;
  email: string;
  site?: string;
  location?: string;
  department?: string;
  notes?: string;
}

export interface UpdatePersonEmployeeData {
  name?: string;
  employeeId?: string;
  title?: string;
  phone?: string;
  email?: string;
  site?: string;
  location?: string;
  department?: string;
  notes?: string;
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
      
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
        errorDetails = errorData.error;
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
    
    // Create error with details attached
    const error = new Error(errorMessage) as Error & { details?: any };
    if (errorDetails) {
      error.details = errorDetails;
    }
    throw error;
  }

  return response.json();
};

// Get persons/employees list with pagination and search
export const getPersonsEmployees = async (
  page: number = 1,
  limit: number = 10,
  search: string = "",
  searchField: string = "all"
): Promise<PaginatedResponse<PersonEmployee>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append("search", search);
    params.append("searchField", searchField);
  }

  return apiRequest<PaginatedResponse<PersonEmployee>>(`/v1/persons-employees?${params}`);
};

// Get single person/employee by ID
export const getPersonEmployee = async (id: number): Promise<{ data: PersonEmployee }> => {
  return apiRequest<{ data: PersonEmployee }>(`/v1/persons-employees/${id}`);
};

// Create new person/employee
export const createPersonEmployee = async (
  personData: CreatePersonEmployeeData
): Promise<{ data: PersonEmployee; message: string }> => {
  return apiRequest<{ data: PersonEmployee; message: string }>("/v1/persons-employees", {
    method: "POST",
    body: JSON.stringify(personData),
  });
};

// Update person/employee
export const updatePersonEmployee = async (
  id: number,
  personData: UpdatePersonEmployeeData
): Promise<{ data: PersonEmployee; message: string }> => {
  return apiRequest<{ data: PersonEmployee; message: string }>(`/v1/persons-employees/${id}`, {
    method: "PUT",
    body: JSON.stringify(personData),
  });
};

// Delete person/employee
export const deletePersonEmployee = async (id: number): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(`/v1/persons-employees/${id}`, {
    method: "DELETE",
  });
};

// Bulk delete persons/employees
export const bulkDeletePersonsEmployees = async (
  ids: number[]
): Promise<{
  message: string;
  deletedCount: number;
  failedCount: number;
  failedIds: number[];
  errors?: { [key: number]: string };
}> => {
  return apiRequest(`/v1/persons-employees/bulk`, {
    method: "DELETE",
    body: JSON.stringify({ ids }),
  });
};

// Import persons/employees from file
export const importPersonsEmployees = async (
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

  const response = await fetch(`${API_BASE_URL}/v1/persons-employees/import`, {
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

// Export persons/employees
export const exportPersonsEmployees = async (
  format: "csv" | "xlsx" = "csv",
  search: string = "",
  searchField: string = "all"
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

  // Try the export endpoint - if it fails with "not found", it might be a routing issue
  // where "export" is being treated as an ID. We'll try the primary endpoint first.
  let url = `${API_BASE_URL}/v1/persons-employees/export?${params}`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: format === "xlsx" 
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
        : "text/csv",
    },
  });

  // If we get a 404 and the error mentions "export" as an ID, try alternative endpoint
  if (!response.ok && response.status === 404) {
    try {
      const errorData = await response.json();
      if (errorData.error?.message?.includes("export") && errorData.error?.message?.includes("not found")) {
        // Try alternative endpoint structure
        url = `${API_BASE_URL}/v1/persons-employees/export-data?${params}`;
        response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: format === "xlsx" 
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
    let errorDetails: any = null;
    
    try {
      const errorData = await response.json();
      errorDetails = errorData;
      
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
        errorDetails = errorData.error;
      }
    } catch (e) {
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage = text;
      } else {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
    }
    
    // Check if the error is about "export" being treated as an ID
    if (errorMessage.includes("not found") && errorMessage.includes("export")) {
      errorMessage = "Export endpoint not found. Please check API configuration or contact support.";
    }
    
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
      errorMessage = "Session expired. Please login again.";
    }
    
    // Attach error details to the error object
    const error = new Error(errorMessage) as Error & { details?: any };
    if (errorDetails) {
      error.details = errorDetails;
    }
    throw error;
  }

  // Check content type
  const contentType = response.headers.get("content-type") || "";
  
  // Validate that we got a file response
  const isExcel = contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
                   contentType.includes("application/vnd.ms-excel");
  const isCsv = contentType.includes("text/csv");
  
  if (!isExcel && !isCsv) {
    // If response is not a file, it might be an error JSON
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
  return apiRequest("/v1/persons-employees/columns");
};

// Update column configuration
export const updateColumnConfiguration = async (
  columns: Array<{
    key: string;
    visible: boolean;
    order: number;
  }>
): Promise<{ message: string }> => {
  return apiRequest("/v1/persons-employees/columns", {
    method: "PUT",
    body: JSON.stringify({ columns }),
  });
};

