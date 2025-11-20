"use client";

import { useState } from "react";
import { PenTool, Plus, Settings } from "lucide-react";

export default function AuditPage() {
  const [auditName, setAuditName] = useState("");
  const [auditSite, setAuditSite] = useState("");
  const [auditLocation, setAuditLocation] = useState("");
  const [category, setCategory] = useState("all");
  const [assetIds, setAssetIds] = useState("");

  const handleNewAudit = () => {
    // Add new audit functionality
    console.log("New audit");
  };

  const handleManageAudits = () => {
    // Add manage audits functionality
    console.log("Manage audits");
  };

  const handleRefreshList = () => {
    // Add refresh list functionality
    console.log("Refresh list");
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <PenTool className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Audit</h1>
      </div>

      {/* Main Content Card */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          
          {/* Step 1: Set Audit Name */}
          <div className="mb-5">
            <h5 className="mb-3 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Step 1: Set Audit Name</h5>
            <p className="text-muted mb-3" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              Start a new audit or update an ongoing audit.
            </p>
            <div className="d-flex align-items-center gap-3 mb-3">
              <div className="flex-grow-1" style={{ maxWidth: '400px' }}>
                <label className="form-label fw-semibold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
                  Audit Name <span style={{ color: '#DC3545' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={auditName}
                  onChange={(e) => setAuditName(e.target.value)}
                  style={{
                    borderRadius: '4px',
                    border: '1px solid #D0D0D0',
                    padding: '8px 12px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">-- Select Audit Name --</option>
                  <option value="audit1">Audit 1</option>
                  <option value="audit2">Audit 2</option>
                </select>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn d-flex align-items-center"
                onClick={handleNewAudit}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontSize: '14px'
                }}
              >
                <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                New Audit
              </button>
              <button
                type="button"
                className="btn d-flex align-items-center"
                onClick={handleManageAudits}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#000',
                  border: '1px solid #D0D0D0',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  fontSize: '14px'
                }}
              >
                <Settings style={{ width: '16px', height: '16px', marginRight: '8px' }} />
                Manage Audits
              </button>
            </div>
          </div>

          {/* Step 2: Audit Site and Location */}
          <div className="mb-5">
            <h5 className="mb-3 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Step 2: Audit Site and Location</h5>
            <p className="text-muted mb-3" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              Select the desired audit Site and Location.
            </p>
            <div className="row gap-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
                  Audit Site <span style={{ color: '#DC3545' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={auditSite}
                  onChange={(e) => setAuditSite(e.target.value)}
                  style={{
                    borderRadius: '4px',
                    border: '1px solid #D0D0D0',
                    padding: '8px 12px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Site</option>
                  <option value="site1">Site 1</option>
                  <option value="site2">Site 2</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
                  Audit Location <span style={{ color: '#DC3545' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={auditLocation}
                  onChange={(e) => setAuditLocation(e.target.value)}
                  style={{
                    borderRadius: '4px',
                    border: '1px solid #D0D0D0',
                    padding: '8px 12px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Location</option>
                  <option value="location1">Location 1</option>
                  <option value="location2">Location 2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Add Assets to List */}
          <div>
            <h5 className="mb-3 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Step 3: Add Assets to List</h5>
            <p className="text-muted mb-3" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              Add assets to the list for the above selected Audit Site and Location.
            </p>
            <div className="row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
                    Category
                  </label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      borderRadius: '4px',
                      border: '1px solid #D0D0D0',
                      padding: '8px 12px',
                      fontSize: '14px',
                      maxWidth: '300px'
                    }}
                  >
                    <option value="all">All Categories</option>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                  </select>
                </div>
                <p className="text-muted mb-3" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  Optionally you can filter the results by selecting a category.
                </p>
                <button
                  type="button"
                  className="btn"
                  onClick={handleRefreshList}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#000',
                    border: '1px solid #D0D0D0',
                    borderRadius: '4px',
                    padding: '8px 16px',
                    fontSize: '14px'
                  }}
                >
                  Refresh List
                </button>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
                  Asset IDs
                </label>
                <textarea
                  className="form-control"
                  value={assetIds}
                  onChange={(e) => setAssetIds(e.target.value)}
                  placeholder="If you have a list of assets to audit, enter Asset IDs comma separated or one entry in each line."
                  rows={8}
                  style={{
                    borderRadius: '4px',
                    border: '1px solid #D0D0D0',
                    padding: '12px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

