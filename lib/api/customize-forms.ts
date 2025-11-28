const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface FormField {
  id: string;
  name: string;
  required: boolean;
  enabled: boolean;
  description?: string;
  example?: string;
  isSystemField?: boolean;
  order?: number;
  customizeLabel?: string;
  fieldType?: string;
}

export interface FormConfiguration {
  formType: "assets" | "customers" | "persons-employees" | "inventory";
  fields: FormField[];
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

export interface UpdateFormConfigurationData {
  fields?: Array<{
    id: string;
    enabled?: boolean;
    required?: boolean;
    order?: number;
    customizeLabel?: string;
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

// Get form configuration for a specific form type
export const getFormConfiguration = async (
  formType: "assets" | "customers" | "persons-employees" | "inventory"
): Promise<{ data: FormConfiguration }> => {
  const endpoint = `/v1/forms/${formType}/configuration`;
  return apiRequest<{ data: FormConfiguration }>(endpoint);
};

// Update form configuration
export const updateFormConfiguration = async (
  formType: "assets" | "customers" | "persons-employees" | "inventory",
  data: UpdateFormConfigurationData
): Promise<{ data: FormConfiguration }> => {
  const endpoint = `/v1/forms/${formType}/configuration`;
  return apiRequest<{ data: FormConfiguration }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Update form field label
export const updateFormFieldLabel = async (
  formType: "assets" | "customers" | "persons-employees" | "inventory",
  fieldId: string,
  customizeLabel: string
): Promise<{ data: FormField }> => {
  const endpoint = `/v1/forms/${formType}/fields/${fieldId}/label`;
  return apiRequest<{ data: FormField }>(endpoint, {
    method: "PUT",
    body: JSON.stringify({ customizeLabel }),
  });
};

