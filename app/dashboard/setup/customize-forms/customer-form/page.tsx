"use client";

import { useState } from "react";
import { Users, HelpCircle } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "dropdown" | "textarea";
  required?: boolean;
  placeholder?: string;
  value?: string;
}

export default function CustomerFormPage() {
  const [fields, setFields] = useState<FormField[]>([
    { id: "full-name", label: "Full Name", type: "text", required: true },
    { id: "company", label: "Company", type: "text" },
    { id: "address1", label: "Address1", type: "text" },
    { id: "address2", label: "Address2", type: "text" },
    { id: "city", label: "City", type: "text" },
    { id: "state", label: "State", type: "text" },
    { id: "zip", label: "Zip", type: "text" },
    { id: "country", label: "Country", type: "dropdown", placeholder: "Select Country" },
    { id: "phone", label: "Phone", type: "tel" },
    { id: "cell", label: "Cell", type: "tel" },
    { id: "email", label: "Email", type: "email" },
    { id: "notes", label: "Notes", type: "textarea" }
  ]);

  const handleFieldChange = (id: string, value: string) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", fields);
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Users className="me-2" style={{ color: '#A52A2A', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Customize Customer Form</h1>
      </div>

      {/* Instructions */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            AssetTiger allows you to customize the way your data should be shown and entered for an individual customer. You can move fields to place more important items at the top for easy reading.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex flex-column" style={{ gap: '16px' }}>
              {fields.map((field) => (
                <div key={field.id} className="d-flex align-items-center">
                  <label className="form-label mb-0 me-4" style={{ fontSize: '14px', color: '#000', fontWeight: '500', minWidth: '120px', textAlign: 'right' }}>
                    {field.label}
                    {field.required && <span style={{ color: '#DC3545' }}> *</span>}
                  </label>
                  <div className="flex-grow-1">
                    {field.type === "dropdown" ? (
                      <select
                        value={field.value || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className="form-select"
                        style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                      >
                        <option value="">{field.placeholder}</option>
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={field.value || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        rows={3}
                        className="form-control"
                        style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px', resize: 'vertical' }}
                      />
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
                </div>
              ))}
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
