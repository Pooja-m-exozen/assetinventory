const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface TableOptions {
  assetDepreciation: boolean;
  depreciationMethod?: "straight-line" | "declining-balance" | "sum-of-years" | "units-of-production";
  calculationFrequency?: "monthly" | "quarterly" | "annually";
  enableContracts: boolean;
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

export interface UpdateTableOptionsData {
  assetDepreciation?: boolean;
  depreciationMethod?: "straight-line" | "declining-balance" | "sum-of-years" | "units-of-production";
  calculationFrequency?: "monthly" | "quarterly" | "annually";
  enableContracts?: boolean;
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

// Get table options
export const getTableOptions = async (): Promise<{ data: TableOptions }> => {
  const endpoint = `/v1/table-options`;
  return apiRequest<{ data: TableOptions }>(endpoint);
};

// Update table options
export const updateTableOptions = async (
  data: UpdateTableOptionsData
): Promise<{ data: TableOptions }> => {
  const endpoint = `/v1/table-options`;
  return apiRequest<{ data: TableOptions }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

