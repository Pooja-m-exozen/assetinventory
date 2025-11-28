const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface OptionsSettings {
  automaticAssetTags: boolean;
  checkInReminderEmail: boolean;
  leaseReturnReminderEmail: boolean;
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

export interface UpdateOptionsSettingsData {
  automaticAssetTags?: boolean;
  checkInReminderEmail?: boolean;
  leaseReturnReminderEmail?: boolean;
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

// Get options settings
export const getOptionsSettings = async (): Promise<{ data: OptionsSettings }> => {
  const endpoint = `/v1/options/settings`;
  return apiRequest<{ data: OptionsSettings }>(endpoint);
};

// Update options settings
export const updateOptionsSettings = async (
  data: UpdateOptionsSettingsData
): Promise<{ data: OptionsSettings }> => {
  const endpoint = `/v1/options/settings`;
  return apiRequest<{ data: OptionsSettings }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

