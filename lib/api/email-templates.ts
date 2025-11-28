const API_BASE_URL = "https://digitalasset.zenapi.co.in/api";

export interface EmailTemplateBody {
  greeting: string;
  intro: string;
  intro2?: string;
  tableColumns: string[];
  notes: string;
  closing: string;
  disclaimer?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  showSignature: boolean;
  body: EmailTemplateBody;
  updatedAt?: string;
  updatedBy?: number | string;
}

export interface MasterTemplateSettings {
  replyToEnabled: boolean;
  replyToEmail: string;
  logoOption: "assettiger-logo" | "company-logo" | "company-name";
  signature: string;
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

export interface UpdateEmailTemplateData {
  subject?: string;
  showSignature?: boolean;
  body?: Partial<EmailTemplateBody>;
}

export interface UpdateMasterTemplateData {
  replyToEnabled?: boolean;
  replyToEmail?: string;
  logoOption?: "assettiger-logo" | "company-logo" | "company-name";
  signature?: string;
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

// Get all email templates
export const getEmailTemplates = async (): Promise<{ data: EmailTemplate[] }> => {
  const endpoint = `/v1/email-templates`;
  return apiRequest<{ data: EmailTemplate[] }>(endpoint);
};

// Get a specific email template
export const getEmailTemplate = async (templateId: string): Promise<{ data: EmailTemplate }> => {
  const endpoint = `/v1/email-templates/${templateId}`;
  return apiRequest<{ data: EmailTemplate }>(endpoint);
};

// Update an email template
export const updateEmailTemplate = async (
  templateId: string,
  data: UpdateEmailTemplateData
): Promise<{ data: EmailTemplate }> => {
  const endpoint = `/v1/email-templates/${templateId}`;
  return apiRequest<{ data: EmailTemplate }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Get master template settings
export const getMasterTemplateSettings = async (): Promise<{ data: MasterTemplateSettings }> => {
  const endpoint = `/v1/email-templates/master-settings`;
  return apiRequest<{ data: MasterTemplateSettings }>(endpoint);
};

// Update master template settings
export const updateMasterTemplateSettings = async (
  data: UpdateMasterTemplateData
): Promise<{ data: MasterTemplateSettings }> => {
  const endpoint = `/v1/email-templates/master-settings`;
  return apiRequest<{ data: MasterTemplateSettings }>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Reset email template to default
export const resetEmailTemplate = async (templateId: string): Promise<{ data: EmailTemplate }> => {
  const endpoint = `/v1/email-templates/${templateId}/reset`;
  return apiRequest<{ data: EmailTemplate }>(endpoint, {
    method: "POST",
  });
};

