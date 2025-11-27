const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface SecurityGroup {
  id: number;
  name: string;
  description: string;
  activeUsers: number;
  permissions?: {
    [key: string]: boolean;
  };
  isSystemGroup?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
  updatedBy?: number;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface CreateSecurityGroupData {
  name: string;
  description: string;
  permissions?: {
    [key: string]: boolean;
  };
}

export interface UpdateSecurityGroupData {
  name?: string;
  description?: string;
  permissions?: {
    [key: string]: boolean;
  };
}

export interface DuplicateSecurityGroupData {
  name: string;
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

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      }
    } catch (e) {
      const text = await response.text().catch(() => "");
      if (text) {
        errorMessage = text;
      }
    }

    // Clear token on unauthorized errors
    if (response.status === 401 || errorMessage.toLowerCase().includes("unauthorized") || errorMessage.toLowerCase().includes("token failed")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
      }
      throw new Error("Session expired or unauthorized. Please log in again.");
    }
    throw new Error(errorMessage || "An error occurred");
  }

  return response.json();
};

// Get security groups list
export const getSecurityGroups = async (
  includeSystemGroups: boolean = true,
  includePermissions: boolean = false
): Promise<{ data: SecurityGroup[] }> => {
  const params = new URLSearchParams();
  if (includeSystemGroups !== undefined) {
    params.append("includeSystemGroups", includeSystemGroups.toString());
  }
  if (includePermissions) {
    params.append("includePermissions", "true");
  }

  const queryString = params.toString();
  return apiRequest<{ data: SecurityGroup[] }>(`/v1/security-groups${queryString ? `?${queryString}` : ""}`);
};

// Get single security group by ID
export const getSecurityGroup = async (
  id: number,
  includePermissions: boolean = true
): Promise<{ data: SecurityGroup }> => {
  const params = new URLSearchParams();
  if (includePermissions) {
    params.append("includePermissions", "true");
  }

  const queryString = params.toString();
  return apiRequest<{ data: SecurityGroup }>(`/v1/security-groups/${id}${queryString ? `?${queryString}` : ""}`);
};

// Create security group
export const createSecurityGroup = async (
  data: CreateSecurityGroupData
): Promise<{ message: string; data: SecurityGroup }> => {
  return apiRequest<{ message: string; data: SecurityGroup }>("/v1/security-groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update security group
export const updateSecurityGroup = async (
  id: number,
  data: UpdateSecurityGroupData
): Promise<{ message: string; data: SecurityGroup }> => {
  return apiRequest<{ message: string; data: SecurityGroup }>(`/v1/security-groups/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Duplicate security group
export const duplicateSecurityGroup = async (
  id: number,
  data: DuplicateSecurityGroupData
): Promise<{ message: string; data: SecurityGroup }> => {
  return apiRequest<{ message: string; data: SecurityGroup }>(`/v1/security-groups/${id}/duplicate`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Delete security group
export const deleteSecurityGroup = async (id: number): Promise<{ message: string }> => {
  return apiRequest<{ message: string }>(`/v1/security-groups/${id}`, {
    method: "DELETE",
  });
};

