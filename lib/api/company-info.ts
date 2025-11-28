const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface CompanyInfo {
  id?: number | string;
  company: string;
  organizationType: string;
  country: string;
  address: string;
  aptSuite?: string;
  city: string;
  state: string;
  postalCode: string;
  timezone: string;
  currency: string;
  dateFormat: string;
  financialYearMonth: string;
  financialYearDay: string;
  logoUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface UpdateCompanyInfoData {
  company?: string;
  organizationType?: string;
  country?: string;
  address?: string;
  aptSuite?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  timezone?: string;
  currency?: string;
  dateFormat?: string;
  financialYearMonth?: string;
  financialYearDay?: string;
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

// Get company information
export const getCompanyInfo = async (): Promise<{ data: CompanyInfo }> => {
  const endpoint = `/v1/company-info`;
  return apiRequest<{ data: CompanyInfo }>(endpoint);
};

// Update company information
export const updateCompanyInfo = async (
  data: UpdateCompanyInfoData
): Promise<{ data: CompanyInfo; message: string }> => {
  const endpoint = `/v1/company-info`;
  return apiRequest<{ data: CompanyInfo; message: string }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Upload company logo
export const uploadCompanyLogo = async (file: File): Promise<{ data: CompanyInfo; message: string }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const formData = new FormData();
  formData.append("logo", file);

  const response = await fetch(`${API_BASE_URL}/v1/company-info/logo`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMessage = "Failed to upload logo";

    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
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

  return response.json();
};

// Delete company logo
export const deleteCompanyLogo = async (): Promise<{ message: string }> => {
  const endpoint = `/v1/company-info/logo`;
  return apiRequest<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

// Delete company and all data
export const deleteCompany = async (): Promise<{ message: string }> => {
  const endpoint = `/v1/company-info/delete-company`;
  return apiRequest<{ message: string }>(endpoint, {
    method: "DELETE",
  });
};

// Delete asset data
export const deleteAssetData = async (
  dataTypes: string[]
): Promise<{ message: string; deletedCount: number }> => {
  const endpoint = `/v1/company-info/delete-asset-data`;
  return apiRequest<{ message: string; deletedCount: number }>(endpoint, {
    method: "POST",
    body: JSON.stringify({ dataTypes }),
  });
};

