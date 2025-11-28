const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface DatabaseField {
  id: string;
  name: string;
  required: boolean;
  enabled: boolean;
  description?: string;
  example?: string;
  isSystemField?: boolean;
  hasNoRadioButtons?: boolean;
  order?: number;
  isKeyField?: boolean;
}

export interface DatabaseTableConfiguration {
  tableType: "assets" | "customers" | "persons-employees" | "maintenance" | "warranties" | "contracts";
  fields: DatabaseField[];
  keyField?: string; // ID of the field that is the unique identifier
  updatedAt?: string;
  updatedBy?: number | string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface UpdateDatabaseTableConfigurationData {
  fields?: Array<{
    id: string;
    enabled?: boolean;
    required?: boolean;
    order?: number;
  }>;
  keyField?: string; // Optional, ID of the field to set as key field
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

// Get database table configuration for a specific table type
export const getDatabaseTableConfiguration = async (
  tableType: "assets" | "customers" | "persons-employees" | "maintenance" | "warranties" | "contracts"
): Promise<{ data: DatabaseTableConfiguration }> => {
  const endpoint = `/v1/database-tables/${tableType}/configuration`;
  return apiRequest<{ data: DatabaseTableConfiguration }>(endpoint);
};

// Update database table configuration
export const updateDatabaseTableConfiguration = async (
  tableType: "assets" | "customers" | "persons-employees" | "maintenance" | "warranties" | "contracts",
  data: UpdateDatabaseTableConfigurationData
): Promise<{ data: DatabaseTableConfiguration }> => {
  const endpoint = `/v1/database-tables/${tableType}/configuration`;
  return apiRequest<{ data: DatabaseTableConfiguration }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

