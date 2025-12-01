const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface DashboardWidget {
  id: string;
  name: string;
  color: string;
  order?: number;
}

export interface DashboardChart {
  id: string;
  name: string;
  type: "pie" | "bar" | "calendar" | "table";
  color: string;
  size?: number; // 1, 2, or 3
  order?: number;
}

export interface DashboardConfiguration {
  widgetColumns: number; // 1-6
  chartColumns: number; // 1-3
  selectedWidgets: DashboardWidget[];
  selectedCharts: DashboardChart[];
  availableWidgets: DashboardWidget[];
  availableCharts: DashboardChart[];
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

export interface UpdateDashboardConfigurationData {
  widgetColumns?: number;
  chartColumns?: number;
  selectedWidgets?: Array<{ id: string; order?: number }>;
  selectedCharts?: Array<{ id: string; size?: number; order?: number }>;
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

// Get dashboard configuration
export const getDashboardConfiguration = async (): Promise<{ data: DashboardConfiguration }> => {
  const endpoint = `/v1/dashboard/configuration`;
  return apiRequest<{ data: DashboardConfiguration }>(endpoint);
};

// Update dashboard configuration
export const updateDashboardConfiguration = async (
  data: UpdateDashboardConfigurationData
): Promise<{ data: DashboardConfiguration }> => {
  const endpoint = `/v1/dashboard/configuration`;
  return apiRequest<{ data: DashboardConfiguration }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Get available widgets (all possible widgets)
export const getAvailableWidgets = async (): Promise<{ data: DashboardWidget[] }> => {
  const endpoint = `/v1/dashboard/widgets/available`;
  return apiRequest<{ data: DashboardWidget[] }>(endpoint);
};

// Get available charts (all possible charts)
export const getAvailableCharts = async (): Promise<{ data: DashboardChart[] }> => {
  const endpoint = `/v1/dashboard/charts/available`;
  return apiRequest<{ data: DashboardChart[] }>(endpoint);
};

