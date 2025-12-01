const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface InventoryField {
  id: string;
  name: string;
  isRequired: boolean;
  isKey?: boolean;
  enabled: boolean;
  customizeLabel: string;
  labelSuggestions: string;
  dataExample: string;
  dataRequired: "yes" | "optional";
}

export interface InventorySettings {
  inventoryEnabled: boolean;
  fields: InventoryField[];
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

export interface UpdateInventorySettingsData {
  inventoryEnabled?: boolean;
  fields?: Array<{
    id: string;
    enabled?: boolean;
    customizeLabel?: string;
    dataRequired?: "yes" | "optional";
  }>;
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

// Get inventory settings
export const getInventorySettings = async (): Promise<{ data: InventorySettings }> => {
  const endpoint = `/v1/inventory/settings`;
  return apiRequest<{ data: InventorySettings }>(endpoint);
};

// Update inventory settings
export const updateInventorySettings = async (
  data: UpdateInventorySettingsData
): Promise<{ data: InventorySettings }> => {
  const endpoint = `/v1/inventory/settings`;
  return apiRequest<{ data: InventorySettings }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Update inventory field label
export const updateInventoryFieldLabel = async (
  fieldId: string,
  customizeLabel: string
): Promise<{ data: InventoryField }> => {
  const endpoint = `/v1/inventory/fields/${fieldId}/label`;
  return apiRequest<{ data: InventoryField }>(endpoint, {
    method: "PUT",
    body: JSON.stringify({ customizeLabel }),
  });
};

