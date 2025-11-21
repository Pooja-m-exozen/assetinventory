"use client";

import { useState } from "react";
import { Users, HelpCircle, Calendar } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "date";
  required?: boolean;
  placeholder?: string;
  value?: string;
  order: number;
}

export default function WarrantyFormPage() {
  const [fields, setFields] = useState<FormField[]>([
    { id: "length", label: "Length", type: "text", order: 1 },
    { id: "expiration-date", label: "Expiration Date", type: "date", required: true, placeholder: "MM/dd/yyyy", order: 2 },
    { id: "notes", label: "Notes", type: "textarea", order: 3 }
  ]);

  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [dragOverField, setDragOverField] = useState<string | null>(null);

  const handleFieldChange = (id: string, value: string) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, value } : field
    ));
  };

  const handleDragStart = (e: React.DragEvent, fieldId: string) => {
    setDraggedField(fieldId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, fieldId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverField(fieldId);
  };

  const handleDragLeave = () => {
    setDragOverField(null);
  };

  const handleDrop = (e: React.DragEvent, targetFieldId: string) => {
    e.preventDefault();
    
    if (!draggedField || draggedField === targetFieldId) {
      setDraggedField(null);
      setDragOverField(null);
      return;
    }

    const dragged = fields.find(f => f.id === draggedField);
    const target = fields.find(f => f.id === targetFieldId);

    if (!dragged || !target) {
      setDraggedField(null);
      setDragOverField(null);
      return;
    }

    // Reorder fields
    const sortedFields = [...fields].sort((a, b) => a.order - b.order);
    const draggedIndex = sortedFields.findIndex(f => f.id === draggedField);
    const targetIndex = sortedFields.findIndex(f => f.id === targetFieldId);

    const newFields = [...sortedFields];
    const [removed] = newFields.splice(draggedIndex, 1);
    newFields.splice(targetIndex, 0, removed);

    // Update order values
    const updatedFields = newFields.map((field, index) => ({
      ...field,
      order: index + 1
    }));

    setFields(updatedFields);
    setDraggedField(null);
    setDragOverField(null);
  };

  const handleDragEnd = () => {
    setDraggedField(null);
    setDragOverField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", fields);
  };

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Users className="me-2" style={{ color: '#A52A2A', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Customize Warranty Form</h1>
      </div>

      <form id="warranty-form" onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '0', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Instructions */}
            <div className="mb-4">
              <p className="mb-0" style={{ fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
                AssetExozen allows you to customize the way your data should be shown and entered for an individual warranty. You can move fields to place more important items at the top for easy reading.
              </p>
            </div>

            <div className="d-flex flex-column" style={{ gap: '16px' }}>
              {sortedFields.map((field) => (
                <div 
                  key={field.id} 
                  className="d-flex align-items-center"
                  draggable
                  onDragStart={(e) => handleDragStart(e, field.id)}
                  onDragOver={(e) => handleDragOver(e, field.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, field.id)}
                  onDragEnd={handleDragEnd}
                  style={{
                    opacity: draggedField === field.id ? 0.5 : 1,
                    border: dragOverField === field.id ? '2px dashed #FF8C00' : '2px solid transparent',
                    padding: dragOverField === field.id ? '12px' : '0',
                    borderRadius: '0',
                    cursor: 'move',
                    transition: 'all 0.2s'
                  }}
                >
                  <label className="form-label mb-0 me-4" style={{ fontSize: '14px', color: '#000', fontWeight: 'normal', minWidth: '160px', textAlign: 'right' }}>
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
                        style={{ borderRadius: '0', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px', resize: 'vertical' }}
                      />
                    ) : field.type === "date" ? (
                      <div className="position-relative">
                        <input
                          type="text"
                          value={field.value || ""}
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={field.placeholder}
                          className="form-control"
                          style={{ borderRadius: '0', border: '1px solid #D0D0D0', padding: '8px 12px', paddingRight: '40px', fontSize: '14px' }}
                        />
                        <button
                          type="button"
                          className="btn p-0 position-absolute"
                          style={{ right: '8px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent' }}
                        >
                          <Calendar style={{ width: '18px', height: '18px', color: '#666' }} />
                        </button>
                      </div>
                    ) : (
                      <input
                        type={field.type}
                        value={field.value || ""}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="form-control"
                        style={{ borderRadius: '0', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </form>

      {/* Form Actions */}
      <div className="d-flex justify-content-end" style={{ gap: '12px' }}>
        <button
          type="button"
          className="btn"
          onClick={() => window.history.back()}
          style={{ 
            backgroundColor: '#FFFFFF', 
            border: '1px solid #D0D0D0', 
            borderRadius: '0', 
            padding: '8px 16px',
            color: '#000'
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn"
          style={{ 
            backgroundColor: '#FF8C00', 
            borderRadius: '0', 
            padding: '8px 16px',
            border: 'none',
            color: '#000'
          }}
        >
          Save
        </button>
      </div>

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

