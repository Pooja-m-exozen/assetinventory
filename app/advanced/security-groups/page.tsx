"use client";

import { useState, useEffect, useCallback } from "react";
import { Shield, Plus, Edit, Copy, Trash2, X, Loader2, AlertCircle, Menu, Users } from "lucide-react";
import {
  getSecurityGroups,
  createSecurityGroup,
  updateSecurityGroup,
  duplicateSecurityGroup,
  deleteSecurityGroup,
  type SecurityGroup,
} from "@/lib/api/security-groups";

export default function SecurityGroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [securityGroups, setSecurityGroups] = useState<SecurityGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SecurityGroup | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isDuplicating, setIsDuplicating] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [duplicateName, setDuplicateName] = useState("");

  // Fetch security groups from API
  const fetchSecurityGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setSecurityGroups([]);
          setLoading(false);
          return;
        }
      }

      const response = await getSecurityGroups(true, false);
      setSecurityGroups(response.data || []);
      
      // Set first group as selected if none selected
      if (!selectedGroup && response.data && response.data.length > 0) {
        setSelectedGroup(response.data[0].id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch security groups";
      setError(errorMessage);

      if (errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("token") ||
          errorMessage.toLowerCase().includes("session expired")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("authToken");
          sessionStorage.removeItem("authToken");
        }
      }

      setSecurityGroups([]);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  useEffect(() => {
    fetchSecurityGroups();
  }, [fetchSecurityGroups]);

  const handleAddNew = () => {
    setFormData({
      name: "",
      description: "",
    });
    setFormErrors({});
    setIsEditMode(false);
    setEditingGroup(null);
    setIsModalOpen(true);
  };

  const handleEditGroup = () => {
    if (!selectedGroup) return;

    const group = securityGroups.find(g => g.id === selectedGroup);
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
      });
      setFormErrors({});
      setIsEditMode(true);
      setEditingGroup(group);
      setIsModalOpen(true);
    }
  };

  const handleDuplicateGroup = async () => {
    if (!selectedGroup) return;

    const group = securityGroups.find(g => g.id === selectedGroup);
    if (!group) return;

    const newName = prompt(`Enter a name for the duplicate of "${group.name}":`);
    if (!newName || !newName.trim()) {
      return;
    }

    try {
      setIsDuplicating(selectedGroup);
      await duplicateSecurityGroup(selectedGroup, { name: newName.trim() });
      await fetchSecurityGroups();
      alert("Security group duplicated successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to duplicate security group");
    } finally {
      setIsDuplicating(null);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;

    const group = securityGroups.find(g => g.id === selectedGroup);
    if (!group) return;

    if (group.isSystemGroup) {
      alert("Cannot delete system-defined security groups");
      return;
    }

    if (group.activeUsers > 0) {
      alert(`Cannot delete security group with ${group.activeUsers} active user(s). Please reassign users first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete "${group.name}"?`)) {
      return;
    }

    try {
      setIsDeleting(selectedGroup);
      await deleteSecurityGroup(selectedGroup);
      await fetchSecurityGroups();
      setSelectedGroup(null);
      alert("Security group deleted successfully");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete security group");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingGroup(null);
    setFormData({
      name: "",
      description: "",
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Group name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Group name must be at least 2 characters";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Group name must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      errors.description = "Group description is required";
    } else if (formData.description.trim().length > 500) {
      errors.description = "Group description must be less than 500 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

      const groupData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      if (isEditMode && editingGroup) {
        if (editingGroup.isSystemGroup) {
          alert("Cannot modify system-defined security groups");
          return;
        }
        await updateSecurityGroup(editingGroup.id, groupData);
      } else {
        await createSecurityGroup(groupData);
      }

      await fetchSecurityGroups();
      handleCloseModal();
    } catch (err) {
      const errorWithDetails = err as Error & { details?: any };

      if (errorWithDetails.details && errorWithDetails.details.details) {
        const validationErrors = errorWithDetails.details.details;
        const apiErrors: { [key: string]: string } = {};

        Object.keys(validationErrors).forEach((field) => {
          apiErrors[field] = validationErrors[field];
        });

        setFormErrors(apiErrors);
        return;
      }

      const errorMessage = err instanceof Error ? err.message : "Failed to save security group";
      setFormErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header with Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Menu className="w-5 h-5 text-gray-600 cursor-pointer" />
          <h1 className="text-xl font-semibold text-gray-900">Security Groups</h1>
        </div>
        <button 
          type="button" 
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
          onClick={handleAddNew}
        >
          <Plus className="w-4 h-4" />
          <span>Create New Group</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        <div className="p-4">
          {/* Description */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Decide which parts of AssetTiger you want accessible to your users by assigning them to Security Groups. You can use and edit the predetermined groups or you can create your own custom security groups.
            </p>
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
              <p className="text-sm text-gray-600">Loading security groups...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && securityGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No security groups found</h3>
              <p className="text-sm text-gray-600 mb-4">Get started by creating your first security group</p>
              <button
                onClick={handleAddNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Create Security Group
              </button>
            </div>
          )}

          {/* Security Groups Table */}
          {!loading && !error && securityGroups.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200 w-12"></th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Group Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Group Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Active Users
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {securityGroups.map((group) => (
                    <tr 
                      key={group.id} 
                      className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedGroup === group.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedGroup(group.id)}
                    >
                      <td className="px-4 py-3 border-r border-gray-200">
                        <input
                          type="radio"
                          name="securityGroup"
                          checked={selectedGroup === group.id}
                          onChange={() => setSelectedGroup(group.id)}
                          className="cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{group.name}</span>
                          {group.isSystemGroup && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                              System
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                        {group.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span>{group.activeUsers} User{group.activeUsers !== 1 ? 's' : ''}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Action Buttons */}
          {!loading && !error && securityGroups.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-gray-200">
              <button 
                type="button" 
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleEditGroup}
                disabled={!selectedGroup || isDeleting !== null || isDuplicating !== null}
              >
                <Edit className="w-4 h-4" />
                <span>Edit Group</span>
              </button>
              <button 
                type="button" 
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDuplicateGroup}
                disabled={!selectedGroup || isDeleting !== null || isDuplicating !== null}
              >
                {isDuplicating === selectedGroup ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Duplicating...</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Duplicate Group</span>
                  </>
                )}
              </button>
              <button 
                type="button" 
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDeleteGroup}
                disabled={!selectedGroup || isDeleting !== null || isDuplicating !== null || Boolean(selectedGroup && securityGroups.find(g => g.id === selectedGroup)?.isSystemGroup)}
              >
                {isDeleting === selectedGroup ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Group</span>
                  </>
                )}
              </button>
              {selectedGroup && (
                <div className="ml-auto text-sm text-gray-600">
                  {securityGroups.find(g => g.id === selectedGroup)?.isSystemGroup && (
                    <span className="text-yellow-600 font-medium">System group - cannot be deleted</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Security Group Modal */}
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
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? "Edit Security Group" : "Create New Security Group"}
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

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <span>Group Name <span className="text-red-500">*</span></span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter group name"
                    disabled={isSubmitting || (isEditMode && editingGroup?.isSystemGroup)}
                  />
                  {formErrors.name && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    <span>Group Description <span className="text-red-500">*</span></span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-2.5 border rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      formErrors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter group description"
                    disabled={isSubmitting || (isEditMode && editingGroup?.isSystemGroup)}
                  />
                  {formErrors.description && (
                    <p className="mt-1.5 text-sm text-red-600">{formErrors.description}</p>
                  )}
                </div>

                {isEditMode && editingGroup?.isSystemGroup && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> This is a system-defined security group. Some fields cannot be modified.
                    </p>
                  </div>
                )}
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
                  disabled={isSubmitting || (isEditMode && editingGroup?.isSystemGroup)}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{isEditMode ? "Updating..." : "Creating..."}</span>
                    </>
                  ) : (
                    <span>{isEditMode ? "Update Group" : "Create Group"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
