const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export type ExportTableType = 
  | "assets"
  | "persons-employees"
  | "customers"
  | "maintenance"
  | "warranties"
  | "contracts"
  | "users"
  | "security-groups";

export type ExportFormat = "csv" | "xlsx";

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

// Export table data
export const exportTable = async (
  tableType: ExportTableType,
  format: ExportFormat = "xlsx",
  search?: string,
  searchField?: string,
  additionalParams?: Record<string, string | number>
): Promise<Blob> => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Authentication required. Please login again.");
  }

  const params = new URLSearchParams({
    format,
  });

  if (search && search.trim()) {
    params.append("search", search.trim());
    if (searchField) {
      params.append("searchField", searchField);
    }
  }

  // Add any additional parameters (e.g., status, securityGroupId, etc.)
  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  // Map table type to API endpoint
  const endpointMap: Record<ExportTableType, string> = {
    assets: "/v1/assets/export",
    "persons-employees": "/v1/persons-employees/export",
    customers: "/v1/customers/export",
    maintenance: "/v1/maintenance/export",
    warranties: "/v1/warranties/export",
    contracts: "/v1/contracts/export",
    users: "/v1/users/export",
    "security-groups": "/v1/security-groups/export",
  };

  const endpoint = endpointMap[tableType];
  if (!endpoint) {
    throw new Error(`Export not supported for table type: ${tableType}`);
  }

  // Try the primary export endpoint
  let url = `${API_BASE_URL}${endpoint}?${params}`;
  let response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept:
        format === "xlsx"
          ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          : "text/csv",
    },
  });

  // If we get a 404 and the error mentions the table type as an ID, try alternative endpoint
  if (!response.ok && response.status === 404) {
    try {
      const errorData = await response.json();
      if (
        errorData.error?.message?.includes("export") &&
        errorData.error?.message?.includes("not found")
      ) {
        // Try alternative endpoint structure (e.g., /export-data)
        const alternativeEndpoint = endpoint.replace("/export", "/export-data");
        url = `${API_BASE_URL}${alternativeEndpoint}?${params}`;
        response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept:
              format === "xlsx"
                ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                : "text/csv",
          },
        });
      }
    } catch (e) {
      // Continue with original response
    }
  }

  if (!response.ok) {
    let errorMessage = "Export failed";

    try {
      const errorData: ErrorResponse = await response.json();
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch (e) {
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

  const contentType = response.headers.get("content-type") || "";
  const isExcel =
    contentType.includes("spreadsheet") ||
    contentType.includes("excel") ||
    format === "xlsx";

  const blob = await response.blob();

  // Validate blob
  if (!blob || blob.size === 0) {
    throw new Error("Export file is empty or invalid");
  }

  return blob;
};

// Get available export formats for a table
export const getAvailableFormats = (tableType: ExportTableType): ExportFormat[] => {
  // All tables support both CSV and Excel
  return ["csv", "xlsx"];
};

// Get export file name
export const getExportFileName = (
  tableType: ExportTableType,
  format: ExportFormat
): string => {
  const date = new Date().toISOString().split("T")[0];
  const extension = format === "xlsx" ? "xlsx" : "csv";
  return `${tableType}_export_${date}.${extension}`;
};

