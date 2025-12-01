const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface Event {
  id: string;
  name: string;
  enabled: boolean;
  description?: string;
  setupButton?: string;
  customizeButton?: string;
  secondarySetupButton?: string;
  secondaryCustomizeButton?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number | string;
  updatedBy?: number | string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface UpdateEventData {
  enabled?: boolean;
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

// Get all events
export const getEvents = async (): Promise<{ data: Event[] }> => {
  const endpoint = `/v1/events`;
  return apiRequest<{ data: Event[] }>(endpoint);
};

// Get single event by ID
export const getEvent = async (id: string): Promise<{ data: Event }> => {
  const endpoint = `/v1/events/${id}`;
  return apiRequest<{ data: Event }>(endpoint);
};

// Update event (primarily for enabling/disabling)
export const updateEvent = async (
  id: string,
  data: UpdateEventData
): Promise<{ data: Event }> => {
  const endpoint = `/v1/events/${id}`;
  return apiRequest<{ data: Event }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Bulk update events
export const bulkUpdateEvents = async (
  updates: Array<{ id: string; enabled: boolean }>
): Promise<{ data: Event[] }> => {
  const endpoint = `/v1/events/bulk-update`;
  return apiRequest<{ data: Event[] }>(endpoint, {
    method: "PUT",
    body: JSON.stringify({ updates }),
  });
};

