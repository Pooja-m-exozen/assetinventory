const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export type ImportTableType = 
  | "assets"
  | "persons-employees"
  | "customers"
  | "users"
  | "maintenance"
  | "warranties"
  | "contracts";

export interface ImportResponse {
  message: string;
  totalRows: number;
  importedCount: number;
  failedCount: number;
  errors?: Array<{
    row: number;
    [key: string]: any;
    error: string;
  }>;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
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

// Import data to a table
export const importData = async (
  tableType: ImportTableType,
  file: File
): Promise<ImportResponse> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  // Map table type to API endpoint
  const endpointMap: Record<ImportTableType, string> = {
    assets: "/v1/assets/import",
    "persons-employees": "/v1/persons-employees/import",
    customers: "/v1/customers/import",
    users: "/v1/users/import",
    maintenance: "/v1/maintenance/import",
    warranties: "/v1/warranties/import",
    contracts: "/v1/contracts/import",
  };

  const endpoint = endpointMap[tableType];
  if (!endpoint) {
    throw new Error(`Import not supported for table type: ${tableType}`);
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
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

// Download import template
export const downloadTemplate = async (
  tableType: ImportTableType,
  format: "xlsx" | "csv" = "xlsx"
): Promise<Blob> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  // Map table type to API endpoint
  const endpointMap: Record<ImportTableType, string> = {
    assets: "/v1/assets/import-template",
    "persons-employees": "/v1/persons-employees/import-template",
    customers: "/v1/customers/import-template",
    users: "/v1/users/import-template",
    maintenance: "/v1/maintenance/import-template",
    warranties: "/v1/warranties/import-template",
    contracts: "/v1/contracts/import-template",
  };

  const endpoint = endpointMap[tableType];
  if (!endpoint) {
    throw new Error(`Template download not supported for table type: ${tableType}`);
  }

  const url = `${API_BASE_URL}${endpoint}?format=${format}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv",
    },
  });

  if (!response.ok) {
    let errorMessage = "Template download failed";

    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
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

  return response.blob();
};

// Download field limits document
export const downloadFieldLimits = async (
  tableType: ImportTableType,
  format: "xlsx" | "csv" | "pdf" = "pdf"
): Promise<Blob> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  // Map table type to API endpoint
  const endpointMap: Record<ImportTableType, string> = {
    assets: "/v1/assets/field-limits",
    "persons-employees": "/v1/persons-employees/field-limits",
    customers: "/v1/customers/field-limits",
    users: "/v1/users/field-limits",
    maintenance: "/v1/maintenance/field-limits",
    warranties: "/v1/warranties/field-limits",
    contracts: "/v1/contracts/field-limits",
  };

  const endpoint = endpointMap[tableType];
  if (!endpoint) {
    throw new Error(`Field limits download not supported for table type: ${tableType}`);
  }

  const url = `${API_BASE_URL}${endpoint}?format=${format}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: format === "pdf"
        ? "application/pdf"
        : format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv",
    },
  });

  if (!response.ok) {
    let errorMessage = "Field limits download failed";

    try {
      const errorData: ErrorResponse = await response.json();
      errorMessage = errorData.error?.message || errorMessage;
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
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

  return response.blob();
};

// Get template file name
export const getTemplateFileName = (
  tableType: ImportTableType,
  format: "xlsx" | "csv" = "xlsx"
): string => {
  const tableNameMap: Record<ImportTableType, string> = {
    assets: "assets",
    "persons-employees": "persons-employees",
    customers: "customers",
    users: "users",
    maintenance: "maintenance",
    warranties: "warranties",
    contracts: "contracts",
  };
  const extension = format === "xlsx" ? "xlsx" : "csv";
  return `${tableNameMap[tableType]}_import_template.${extension}`;
};

// Get field limits file name
export const getFieldLimitsFileName = (
  tableType: ImportTableType,
  format: "xlsx" | "csv" | "pdf" = "pdf"
): string => {
  const tableNameMap: Record<ImportTableType, string> = {
    assets: "assets",
    "persons-employees": "persons-employees",
    customers: "customers",
    users: "users",
    maintenance: "maintenance",
    warranties: "warranties",
    contracts: "contracts",
  };
  const extension = format === "pdf" ? "pdf" : format === "xlsx" ? "xlsx" : "csv";
  return `${tableNameMap[tableType]}_field_limits.${extension}`;
};

