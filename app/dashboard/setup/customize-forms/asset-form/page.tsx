"use client";

import { useState } from "react";
import { Users, Play, HelpCircle, GripVertical, Minus, Pencil, Calendar, IndianRupee } from "lucide-react";

export default function AssetFormPage() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Users className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
          <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Customize Asset Form</h1>
        </div>
        <button
          type="button"
          className="btn text-white d-flex align-items-center"
          style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '8px 16px', fontSize: '14px', gap: '8px' }}
        >
          <Play style={{ width: '16px', height: '16px' }} />
          How it works?
        </button>
      </div>

      {/* Instructions */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            AssetTiger allows you to customize the way your data should be shown and entered for an individual asset. You can move fields to place more important items at the top, or group them within certain section for easy reading. Additionally, you can create your own group of fields and move items into it. Lastly you can move each section up and down for easy viewing as well. Make AssetTiger work for you. Click on green button on top to watch the video 'How it works?'.
          </p>
        </div>
      </div>

      {/* Asset Details Section */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Section Header Controls */}
          <div className="d-flex align-items-center mb-3" style={{ gap: '8px' }}>
            <button
              type="button"
              className="btn btn-sm p-1"
              style={{ backgroundColor: '#F5F5F5', border: '1px solid #D0D0D0', borderRadius: '4px', minWidth: '28px', height: '28px' }}
            >
              <GripVertical style={{ width: '14px', height: '14px', color: '#666' }} />
            </button>
            <button
              type="button"
              className="btn btn-sm p-1"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ backgroundColor: '#F5F5F5', border: '1px solid #D0D0D0', borderRadius: '4px', minWidth: '28px', height: '28px' }}
            >
              <Minus style={{ width: '14px', height: '14px', color: '#666' }} />
            </button>
          </div>

          {/* Section Title and Edit Button */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <h5 className="card-title mb-0 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Asset Details</h5>
            <button
              type="button"
              className="btn text-white d-flex align-items-center"
              style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '6px 12px', fontSize: '14px', gap: '6px' }}
            >
              <Pencil style={{ width: '14px', height: '14px' }} />
              Edit
            </button>
          </div>

          {/* Section Content */}
          {isExpanded && (
            <>
              <div className="row g-4 mb-4">
                {/* Left Column */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                      Description <span style={{ color: '#DC3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                      Asset Tag ID <span style={{ color: '#DC3545' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                      Purchase Date
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        placeholder="MM/dd/yyyy"
                        className="form-control"
                        style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px', paddingRight: '40px' }}
                      />
                      <button
                        type="button"
                        className="btn p-0 position-absolute"
                        style={{ right: '8px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent' }}
                      >
                        <Calendar style={{ width: '18px', height: '18px', color: '#666' }} />
                      </button>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                      Cost
                    </label>
                    <div className="input-group">
                      <span className="input-group-text" style={{ backgroundColor: '#F5F5F5', border: '1px solid #D0D0D0', borderRadius: '4px 0 0 4px', fontSize: '14px', color: '#000' }}>
                        ₹ India Rupee
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        style={{ borderRadius: '0 4px 4px 0', border: '1px solid #D0D0D0', borderLeft: 'none', padding: '8px 12px', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                      Purchased from
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                      Brand
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                      Model
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                      Serial No
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Drop Zones */}
              <div className="mb-3" style={{ border: '2px dashed #87CEEB', borderRadius: '4px', backgroundColor: '#E0F6FF', padding: '40px', textAlign: 'center' }}>
                <p className="mb-0" style={{ fontSize: '14px', color: '#666' }}>Drop here</p>
              </div>
              <div className="mb-3" style={{ border: '2px dashed #87CEEB', borderRadius: '4px', backgroundColor: '#E0F6FF', padding: '40px', textAlign: 'center' }}>
                <p className="mb-0" style={{ fontSize: '14px', color: '#666' }}>Drop here</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
