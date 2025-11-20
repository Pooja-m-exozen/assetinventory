"use client";

import { useState } from "react";
import { Users, HelpCircle, Calendar } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date" | "checkbox" | "currency";
  required?: boolean;
  placeholder?: string;
  value?: string;
  checked?: boolean;
  column: "left" | "right";
}

export default function ContractFormPage() {
  const [fields, setFields] = useState<FormField[]>([
    { id: "contract-title", label: "Contract/License Title", type: "text", required: true, column: "left" },
    { id: "description", label: "Description", type: "textarea", column: "left" },
    { id: "hyperlink", label: "Hyperlink", type: "text", value: "http://www.example.com", column: "left" },
    { id: "contract-no", label: "Contract No.", type: "text", column: "left" },
    { id: "cost", label: "Cost", type: "currency", column: "left" },
    { id: "start-date", label: "Start Date", type: "date", required: true, placeholder: "MM/dd/yyyy", column: "left" },
    { id: "end-date", label: "End Date", type: "date", required: true, placeholder: "MM/dd/yyyy", column: "left" },
    { id: "no-end-date", label: "No end date", type: "checkbox", checked: false, column: "left" },
    { id: "vendor", label: "Vendor", type: "text", column: "right" },
    { id: "contact-person", label: "Contact Person", type: "text", column: "right" },
    { id: "phone", label: "Phone", type: "text", column: "right" },
    { id: "no-of-licenses", label: "No. of Licenses", type: "text", column: "right" },
    { id: "contract-is-for-software", label: "Contract is for software", type: "checkbox", checked: false, column: "right" }
  ]);

  const handleFieldChange = (id: string, value: string | boolean) => {
    setFields(fields.map(field => {
      if (field.id === id) {
        if (field.type === "checkbox") {
          return { ...field, checked: value as boolean };
        }
        return { ...field, value: value as string };
      }
      return field;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", fields);
  };

  const leftFields = fields.filter(f => f.column === "left");
  const rightFields = fields.filter(f => f.column === "right");

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Users className="me-2" style={{ color: '#A52A2A', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Customize Contract Form</h1>
      </div>

      {/* Instructions */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            AssetTiger allows you to customize the way your data should be shown and entered for a contract. You can move fields to place more important items at the top for easy reading.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="row g-4">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="d-flex flex-column" style={{ gap: '16px' }}>
                  {leftFields.map((field) => (
                    <div key={field.id} className="d-flex align-items-center">
                      {field.type === "checkbox" ? (
                        <>
                          <div style={{ minWidth: '160px' }}></div>
                          <div className="flex-grow-1">
                            <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={field.checked || false}
                                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                                style={{ marginRight: '8px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '14px', color: '#000' }}>{field.label}</span>
                            </label>
                          </div>
                        </>
                      ) : (
                        <>
                          <label className="form-label mb-0 me-4" style={{ fontSize: '14px', color: '#000', fontWeight: '500', minWidth: '160px', textAlign: 'right' }}>
                            {field.label}
                            {field.required && <span style={{ color: '#DC3545' }}> *</span>}
                          </label>
                          <div className="flex-grow-1">
                            {field.type === "textarea" ? (
                              <textarea
                                value={field.value || ""}
                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                rows={3}
                                className="form-control"
                                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px', resize: 'vertical' }}
                              />
                            ) : field.type === "date" ? (
                              <div className="position-relative">
                                <input
                                  type="text"
                                  value={field.value || ""}
                                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="form-control"
                                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', paddingRight: '40px', fontSize: '14px' }}
                                />
                                <button
                                  type="button"
                                  className="btn p-0 position-absolute"
                                  style={{ right: '8px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent' }}
                                >
                                  <Calendar style={{ width: '18px', height: '18px', color: '#666' }} />
                                </button>
                              </div>
                            ) : field.type === "currency" ? (
                              <div className="input-group">
                                <span className="input-group-text" style={{ backgroundColor: '#F5F5F5', border: '1px solid #D0D0D0', borderRadius: '4px 0 0 4px', fontSize: '14px', color: '#000' }}>
                                  ₹ India Rupee
                                </span>
                                <input
                                  type="text"
                                  value={field.value || ""}
                                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                  className="form-control"
                                  style={{ borderRadius: '0 4px 4px 0', border: '1px solid #D0D0D0', borderLeft: 'none', padding: '8px 12px', fontSize: '14px' }}
                                />
                              </div>
                            ) : (
                              <input
                                type={field.type}
                                value={field.value || ""}
                                onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                placeholder={field.placeholder}
                                className="form-control"
                                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                              />
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="col-md-6">
                <div className="d-flex flex-column" style={{ gap: '16px' }}>
                  {rightFields.map((field) => (
                    <div key={field.id} className="d-flex align-items-center">
                      {field.type === "checkbox" ? (
                        <>
                          <div style={{ minWidth: '160px' }}></div>
                          <div className="flex-grow-1">
                            <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={field.checked || false}
                                onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                                style={{ marginRight: '8px', cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: '14px', color: '#000' }}>{field.label}</span>
                            </label>
                          </div>
                        </>
                      ) : (
                        <>
                          <label className="form-label mb-0 me-4" style={{ fontSize: '14px', color: '#000', fontWeight: '500', minWidth: '160px', textAlign: 'right' }}>
                            {field.label}
                            {field.required && <span style={{ color: '#DC3545' }}> *</span>}
                          </label>
                          <div className="flex-grow-1">
                            <input
                              type={field.type}
                              value={field.value || ""}
                              onChange={(e) => handleFieldChange(field.id, e.target.value)}
                              placeholder={field.placeholder}
                              className="form-control"
                              style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="d-flex justify-content-end" style={{ gap: '12px' }}>
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

      {/* Need Help Button */}
      <div className="fixed-bottom position-fixed" style={{ bottom: '24px', right: '24px', zIndex: 1000 }}>
        <button
          className="btn text-white d-flex align-items-center"
          style={{ 
            backgroundColor: '#28A745', 
            borderRadius: '50px', 
            padding: '12px 20px',
            gap: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
          aria-label="Need Help?"
        >
          <HelpCircle style={{ width: '20px', height: '20px' }} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Need Help?</span>
        </button>
      </div>
    </div>
  );
}

