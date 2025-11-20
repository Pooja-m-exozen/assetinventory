"use client";

import { useState } from "react";
import { List } from "lucide-react";

export default function OptionsPage() {
  const [automaticAssetTags, setAutomaticAssetTags] = useState(false);
  const [checkInReminderEmail, setCheckInReminderEmail] = useState(false);
  const [leaseReturnReminderEmail, setLeaseReturnReminderEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", {
      automaticAssetTags,
      checkInReminderEmail,
      leaseReturnReminderEmail
    });
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <List className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Options</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Introduction */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
              To tailor the site to your specifications, we've added some options for you to work with.
            </p>
          </div>
        </div>

        {/* Asset Tagging Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <h5 className="card-title mb-3 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Asset Tagging</h5>
            <div className="d-flex align-items-start gap-2 mb-2">
              <input
                type="checkbox"
                checked={automaticAssetTags}
                onChange={(e) => setAutomaticAssetTags(e.target.checked)}
                style={{ marginTop: '4px', cursor: 'pointer' }}
              />
              <span className="fw-medium" style={{ fontSize: '14px', color: '#000' }}>
                Automatic asset tags
              </span>
            </div>
            <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', marginLeft: '24px' }}>
              Automatically assign asset tags when you create a new asset or duplicate an existing asset.
            </p>
          </div>
        </div>

        {/* Reminder Emails Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <h5 className="card-title mb-3 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Reminder Emails</h5>
            <div className="d-flex flex-column gap-3">
              <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checkInReminderEmail}
                  onChange={(e) => setCheckInReminderEmail(e.target.checked)}
                  style={{ marginRight: '8px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: '#000' }}>
                  Check-in Reminder Email
                </span>
              </label>
              <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={leaseReturnReminderEmail}
                  onChange={(e) => setLeaseReturnReminderEmail(e.target.checked)}
                  style={{ marginRight: '8px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', color: '#000' }}>
                  Lease Return Reminder Email
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn"
            onClick={() => window.history.back()}
            style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #D0D0D0', 
              borderRadius: '4px', 
              padding: '8px 16px',
              color: '#000'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn text-white"
            style={{ 
              backgroundColor: '#FF8C00', 
              borderRadius: '4px', 
              padding: '8px 16px'
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
