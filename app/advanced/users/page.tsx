"use client";

import { useState, useEffect, useCallback } from "react";
import { User, Plus, List, Edit, Trash2, X, Loader2, AlertCircle, Search, ChevronLeft, ChevronRight, Upload, FileSpreadsheet, Mail, Phone, Briefcase, Shield, Eye, Menu } from "lucide-react";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  bulkDeleteUsers,
  importUsers,
  exportUsers,
  getSecurityGroupsForUsers,
  resetUserPassword,
  updateUserStatus,
  assignUserToSecurityGroup,
  type User as UserType,
  type PaginatedResponse,
  type SecurityGroupOption,
  type CreateUserData,
} from "@/lib/api/users";

export default function UsersPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalRecords: 0,
    totalPages: 0,
    startRecord: 0,
    endRecord: 0,
  });
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSearchCriteriaOpen, setIsSearchCriteriaOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [securityGroups, setSecurityGroups] = useState<SecurityGroupOption[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    jobTitle: "",
    role: "",
    securityGroupId: 0,
    status: "active",
  });
  const [searchCriteria, setSearchCriteria] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    groupName: "",
  });

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setUsers([]);
          setPagination({
            totalRecords: 0,
            totalPages: 0,
            startRecord: 0,
            endRecord: 0,
          });
          setLoading(false);
          return;
        }
      }

      const response: PaginatedResponse<UserType> = await getUsers(
        currentPage,
        recordsPerPage,
        searchQuery,
        searchField
      );
      setUsers(response.data || []);
      setPagination({
        totalRecords: response.pagination?.totalRecords || 0,
        totalPages: response.pagination?.totalPages || 0,
        startRecord: response.pagination?.startRecord || 0,
        endRecord: response.pagination?.endRecord || 0,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);

      if (errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("token") ||
          errorMessage.toLowerCase().includes("session expired")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
        }
      }

      setUsers([]);
      setPagination({
        totalRecords: 0,
        totalPages: 0,
        startRecord: 0,
        endRecord: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, recordsPerPage, searchQuery, searchField]);

  // Fetch security groups for dropdown
  const fetchSecurityGroups = useCallback(async () => {
    try {
      const response = await getSecurityGroupsForUsers();
      setSecurityGroups(response.data || []);
    } catch (err) {
      console.error("Failed to fetch security groups:", err);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchSecurityGroups();
  }, [fetchUsers, fetchSecurityGroups]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchUsers();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, searchField]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, searchField, recordsPerPage]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(users.map(user => user.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      setIsDeleting(id);
      await deleteUser(id);
      await fetchUsers();
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select users to delete");
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedRows.length} user(s)?`)) {
      return;
    }

    try {
      setIsDeleting(-1);
      await bulkDeleteUsers(selectedRows);
      await fetchUsers();
      setSelectedRows([]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete users");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const result = await importUsers(file);
      alert(`Import completed: ${result.importedCount} imported, ${result.failedCount} failed`);
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to import users");
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);

      // Try API export first
      try {
        const blob = await exportUsers("xlsx", searchQuery, searchField);
        if (blob && blob.size > 0) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `users_${new Date().toISOString().split('T')[0]}.xlsx`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, 100);
          return;
        }
      } catch (apiError) {
        console.log("API export failed, using client-side export:", apiError);
      }

      // Client-side export fallback
      if (users.length === 0) {
        throw new Error("No data available to export");
      }

      const headers = ["Name", "Email", "Phone", "Job Title", "Role", "Group Name", "Status"];
      const csvRows = [
        headers.join(","),
        ...users.map((user) => {
          const row = [
            `"${(user.name || "").replace(/"/g, '""')}"`,
            `"${(user.email || "").replace(/"/g, '""')}"`,
            `"${(user.phone || "").replace(/"/g, '""')}"`,
            `"${(user.jobTitle || "").replace(/"/g, '""')}"`,
            `"${(user.role || "").replace(/"/g, '""')}"`,
            `"${(user.groupName || "").replace(/"/g, '""')}"`,
            `"${(user.status || "").replace(/"/g, '""')}"`
          ];
          return row.join(",");
        })
      ];

      const csvContent = csvRows.join("\n");
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to export users";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsExporting(false);
    }
  };

  const handleAddNew = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      jobTitle: "",
      role: "",
      securityGroupId: securityGroups.length > 0 ? securityGroups[0].id : 0,
      status: "active",
    });
    setFormErrors({});
    setIsEditMode(false);
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserType) => {
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      jobTitle: user.jobTitle || "",
      role: user.role || "",
      securityGroupId: user.securityGroupId || 0,
      status: user.status || "active",
    });
    setFormErrors({});
    setIsEditMode(true);
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      jobTitle: "",
      role: "",
      securityGroupId: securityGroups.length > 0 ? securityGroups[0].id : 0,
      status: "active",
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        errors.email = "Please enter a valid email address";
      }
    }

    if (!isEditMode && !formData.password.trim()) {
      errors.password = "Password is required";
    } else if (!isEditMode && formData.password.trim()) {
      const password = formData.password.trim();
      if (password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      } else {
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
          errors.password = "Password must contain uppercase, lowercase, number, and special character";
        }
      }
    }

    if (!formData.securityGroupId || formData.securityGroupId === 0) {
      errors.securityGroupId = "Security group is required";
    }

    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,20}$/;
      const cleanedPhone = formData.phone.trim().replace(/[\s\-\(\)]/g, '');
      if (cleanedPhone.length < 7 || cleanedPhone.length > 15) {
        errors.phone = "Phone number must be between 7 and 15 digits";
      } else if (!phoneRegex.test(formData.phone.trim())) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === "securityGroupId" ? Number(value) : value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setFormErrors({});

      let cleanedPhone = formData.phone.trim();
      if (cleanedPhone) {
        cleanedPhone = cleanedPhone.replace(/[\s\-\(\)]/g, '');
        if (!cleanedPhone.startsWith('+')) {
          cleanedPhone = cleanedPhone.replace(/\D/g, '');
        }
      }

      if (isEditMode && editingUser) {
        const userData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          ...(cleanedPhone && { phone: cleanedPhone }),
          ...(formData.jobTitle.trim() && { jobTitle: formData.jobTitle.trim() }),
          ...(formData.role.trim() && { role: formData.role.trim() }),
          securityGroupId: formData.securityGroupId,
          status: formData.status,
        };
        await updateUser(editingUser.id, userData);
      } else {
        // Ensure password meets requirements
        const password = formData.password.trim();
        if (password.length < 8) {
          setFormErrors({ password: "Password must be at least 8 characters" });
          return;
        }
        
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
          setFormErrors({ password: "Password must contain uppercase, lowercase, number, and special character" });
          return;
        }

        // Validate securityGroupId
        if (!formData.securityGroupId || formData.securityGroupId === 0) {
          setFormErrors({ securityGroupId: "Please select a security group" });
          return;
        }

        // Verify security group exists in the list
        const selectedGroup = securityGroups.find(g => g.id === formData.securityGroupId);
        if (!selectedGroup) {
          setFormErrors({ securityGroupId: "Selected security group is invalid. Please refresh and try again." });
          return;
        }

        // Build user data object - ensure all required fields are present
        const userData: CreateUserData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: password,
          securityGroupId: formData.securityGroupId,
          status: (formData.status || "active") as "active" | "inactive" | "suspended", // Always include status
        };

        // Only include optional fields if they have values
        if (cleanedPhone && cleanedPhone.length > 0) {
          userData.phone = cleanedPhone;
        }
        if (formData.jobTitle.trim()) {
          userData.jobTitle = formData.jobTitle.trim();
        }
        if (formData.role.trim()) {
          userData.role = formData.role.trim();
        }
        
        // Log the data being sent (without password for security)
        console.log("Creating user with data:", { ...userData, password: "***" });
        console.log("Security Group ID:", formData.securityGroupId);
        console.log("Available security groups:", securityGroups);
        
        await createUser(userData);
      }

      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      console.error("Error creating/updating user:", err);
      
      const errorWithDetails = err as Error & { details?: any; response?: Response };

      // Log full error details for debugging
      if (errorWithDetails.details) {
        console.error("Error details:", errorWithDetails.details);
      }

      // Check for validation errors in details
      if (errorWithDetails.details) {
        // Structure: { error: { code, message, details: { field: "error" } } }
        if (errorWithDetails.details.error && errorWithDetails.details.error.details) {
          const validationErrors = errorWithDetails.details.error.details;
          const apiErrors: { [key: string]: string } = {};

          Object.keys(validationErrors).forEach((field) => {
            apiErrors[field] = validationErrors[field];
          });

          setFormErrors(apiErrors);
          return;
        }
        
        // Structure: { details: { field: "error" } }
        if (errorWithDetails.details.details) {
          const validationErrors = errorWithDetails.details.details;
          const apiErrors: { [key: string]: string } = {};

          Object.keys(validationErrors).forEach((field) => {
            apiErrors[field] = validationErrors[field];
          });

          setFormErrors(apiErrors);
          return;
        }
        
        // Structure: { error: { code, message } } - INTERNAL_ERROR case
        if (errorWithDetails.details.error) {
          const errorObj = errorWithDetails.details.error;
          const errorCode = errorObj.code || "";
          const errorMsg = errorObj.message || "";
          
          // For INTERNAL_ERROR, provide helpful guidance
          if (errorCode === "INTERNAL_ERROR" || errorMsg.includes("INTERNAL_ERROR") || errorMsg.includes("internal error")) {
            let helpfulMessage = "An error occurred while creating the user. ";
            helpfulMessage += "Please verify:\n";
            helpfulMessage += "• Password meets requirements (min 8 chars, uppercase, lowercase, number, special character)\n";
            helpfulMessage += "• Email is valid and not already in use\n";
            helpfulMessage += "• Security group is selected\n";
            helpfulMessage += "• All required fields are filled";
            
            setFormErrors({ submit: helpfulMessage });
            return;
          }
        }
      }

      // Parse error message for specific field errors
      const errorMessage = err instanceof Error ? err.message : "Failed to save user";
      
      // Check for common error patterns
      if (errorMessage.includes("password") && (errorMessage.includes("weak") || errorMessage.includes("requirement"))) {
        setFormErrors({ password: "Password does not meet security requirements. Must be at least 8 characters with uppercase, lowercase, number, and special character." });
      } else if (errorMessage.includes("email") && (errorMessage.includes("already exists") || errorMessage.includes("duplicate"))) {
        setFormErrors({ email: "Email already exists. Please use a different email address." });
      } else if (errorMessage.includes("securityGroupId") || errorMessage.includes("security group")) {
        setFormErrors({ securityGroupId: "Please select a valid security group." });
      } else if (errorMessage.includes("INTERNAL_ERROR") || errorMessage.includes("internal error")) {
        setFormErrors({ submit: "An error occurred while creating the user. Please check all required fields and try again. Make sure the password meets requirements (min 8 chars, uppercase, lowercase, number, special character)." });
      } else {
        setFormErrors({ submit: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchCriteriaApply = () => {
    const criteria = Object.entries(searchCriteria)
      .filter(([_, value]) => value.trim())
      .map(([key, value]) => `${key}:${value.trim()}`)
      .join(" ");

    setSearchQuery(criteria);
    setSearchField("all");
    setCurrentPage(1);
    setIsSearchCriteriaOpen(false);
  };

  const handleSearchCriteriaReset = () => {
    setSearchCriteria({
      name: "",
      email: "",
      phone: "",
      jobTitle: "",
      groupName: "",
    });
    setSearchQuery("");
    setSearchField("all");
    setCurrentPage(1);
  };

  const totalRecords = pagination.totalRecords;
  const startRecord = pagination.startRecord || (currentPage - 1) * recordsPerPage + 1;
  const endRecord = pagination.endRecord || Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header with Title and Pagination */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-gray-600 cursor-pointer" />
          <h1 className="text-xl font-semibold text-gray-900">List of Users</h1>
        </div>
        {pagination.totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <span className="px-3 py-1 bg-yellow-400 text-gray-900 font-medium rounded">
              {currentPage}
            </span>
            <button
              className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages || loading}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="p-4">
          {/* Control Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button 
              type="button" 
              className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors"
              onClick={handleAddNew}
            >
              <Plus className="w-4 h-4" />
              <span>Add New User</span>
            </button>
            <button 
              type="button" 
              className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors"
              onClick={() => setIsSearchCriteriaOpen(true)}
            >
              <Search className="w-4 h-4" />
              <span>Search Criteria</span>
            </button>
            <select 
              className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={recordsPerPage}
              onChange={(e) => {
                setRecordsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="10">10 users</option>
              <option value="25">25 users</option>
              <option value="50">50 users</option>
              <option value="100">100 users</option>
            </select>
            <button 
              type="button" 
              className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded border border-gray-300 text-sm font-medium transition-colors disabled:opacity-50"
              onClick={handleExport}
              disabled={isExporting || loading}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Export to Excel</span>
                </>
              )}
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded border border-gray-300 text-sm font-medium transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{isImporting ? "Importing..." : "Import"}</span>
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleImport}
                className="hidden"
                disabled={isImporting}
              />
            </label>
            {selectedRows.length > 0 && (
              <button 
                type="button" 
                className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                onClick={handleBulkDelete}
                disabled={isDeleting === -1}
              >
                {isDeleting === -1 ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4" />
                    <span>Delete ({selectedRows.length})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Create new users who will be able to access your AssetTiger system. You can decide each user's privileges and what they can and can't do within your account.
            </p>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Name, Email or Phone"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="all">All Fields</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="jobTitle">Job Title</option>
              <option value="groupName">Group Name</option>
            </select>
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-sm text-gray-600">Loading users...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-sm text-gray-600 mb-4">
                {searchQuery ? "Try adjusting your search criteria" : "Get started by adding your first user"}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddNew}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              )}
            </div>
          )}

          {/* Users Table */}
          {!loading && !error && users.length > 0 && (
            <>
              {/* Table Controls Top */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <select 
                    className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={recordsPerPage}
                    onChange={(e) => {
                      setRecordsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loading}
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1.5 text-sm text-gray-700">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={currentPage === pagination.totalPages || loading}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.length === users.length && users.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                        Group Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                        Job Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 border-r border-gray-200">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.includes(user.id)}
                            onChange={() => handleSelectRow(user.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="font-medium">{user.name}</span>
                            {user.role && (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                                {user.role}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span>{user.groupName || "-"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                          {user.jobTitle || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                          {user.phone ? (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{user.phone}</span>
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button 
                              className="flex items-center gap-1 px-2 py-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                              onClick={() => handleEdit(user)}
                              title="View/Edit"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>
                            <button 
                              className="flex items-center gap-1 px-2 py-1 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                              onClick={() => handleEdit(user)}
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                            <button 
                              className="flex items-center gap-1 px-2 py-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                              onClick={() => handleDelete(user.id)}
                              disabled={isDeleting === user.id}
                              title="Delete"
                            >
                              {isDeleting === user.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4" />
                                  <span>Delete</span>
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Summary */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium text-gray-900">{startRecord}</span> to{" "}
                  <span className="font-medium text-gray-900">{endRecord}</span> of{" "}
                  <span className="font-medium text-gray-900">{totalRecords}</span> records
                </div>
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1 || loading}
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="px-3 py-1 bg-yellow-400 text-gray-900 font-medium rounded">
                      {currentPage}
                    </span>
                    <button
                      className="px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                      disabled={currentPage === pagination.totalPages || loading}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? "Edit User" : "Add New User"}
                </h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                aria-label="Close modal"
                disabled={isSubmitting}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              {formErrors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span className="text-red-800 text-sm">{formErrors.submit}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Name <span className="text-red-500">*</span></span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                    disabled={isSubmitting}
                  />
                  {formErrors.name && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>Email <span className="text-red-500">*</span></span>
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                    disabled={isSubmitting}
                  />
                  {formErrors.email && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                {/* Password */}
                {!isEditMode && (
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      <span>Password <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        formErrors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter password (min 8 chars: uppercase, lowercase, number, special char)"
                      disabled={isSubmitting}
                    />
                    {formErrors.password && (
                      <p className="mt-1.5 text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>
                )}

                {/* Phone */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>Phone</span>
                    </div>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                    disabled={isSubmitting}
                  />
                  {formErrors.phone && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                {/* Job Title */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>Job Title</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter job title"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <span>Role</span>
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter role (e.g., Administrator)"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Security Group */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span>Security Group <span className="text-red-500">*</span></span>
                    </div>
                  </label>
                  <select
                    name="securityGroupId"
                    value={formData.securityGroupId}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.securityGroupId ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  >
                    <option value={0}>Select Security Group</option>
                    {securityGroups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.securityGroupId && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.securityGroupId}</p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <span>Status</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    disabled={isSubmitting}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : (
                    <span>{isEditMode ? "Update User" : "Create User"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Criteria Modal */}
      {isSearchCriteriaOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsSearchCriteriaOpen(false);
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Search Criteria</h2>
              </div>
              <button
                onClick={() => setIsSearchCriteriaOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Name</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={searchCriteria.name}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by name"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span>Email</span>
                    </div>
                  </label>
                  <input
                    type="email"
                    value={searchCriteria.email}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by email"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>Phone</span>
                    </div>
                  </label>
                  <input
                    type="tel"
                    value={searchCriteria.phone}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by phone"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>Job Title</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={searchCriteria.jobTitle}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, jobTitle: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by job title"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-gray-500" />
                      <span>Group Name</span>
                    </div>
                  </label>
                  <input
                    type="text"
                    value={searchCriteria.groupName}
                    onChange={(e) => setSearchCriteria(prev => ({ ...prev, groupName: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Search by group name"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleSearchCriteriaReset}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSearchCriteriaApply}
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
                >
                  Apply Search
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
