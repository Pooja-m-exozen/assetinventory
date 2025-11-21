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
  column: "left" | "right" | "full";
  order: number;
}

export default function ContractFormPage() {
  const [fields, setFields] = useState<FormField[]>([
    { id: "contract-title", label: "Contract/License Title", type: "text", required: true, column: "full", order: 1 },
    { id: "description", label: "Description", type: "textarea", column: "full", order: 2 },
    { id: "hyperlink", label: "Hyperlink", type: "text", value: "http://www.example.com", column: "full", order: 3 },
    { id: "contract-no", label: "Contract No.", type: "text", column: "left", order: 1 },
    { id: "cost", label: "Cost", type: "currency", column: "left", order: 2 },
    { id: "start-date", label: "Start Date", type: "date", required: true, placeholder: "MM/dd/yyyy", column: "left", order: 3 },
    { id: "end-date", label: "End Date", type: "date", required: true, placeholder: "MM/dd/yyyy", column: "left", order: 4 },
    { id: "no-end-date", label: "No end date", type: "checkbox", checked: false, column: "left", order: 5 },
    { id: "vendor", label: "Vendor", type: "text", column: "right", order: 1 },
    { id: "contact-person", label: "Contact Person", type: "text", column: "right", order: 2 },
    { id: "phone", label: "Phone", type: "text", column: "right", order: 3 },
    { id: "no-of-licenses", label: "No. of Licenses", type: "text", column: "right", order: 4 },
    { id: "contract-is-for-software", label: "Contract is for software", type: "checkbox", checked: false, column: "right", order: 5 }
  ]);

  const [draggedField, setDraggedField] = useState<string | null>(null);
  const [dragOverField, setDragOverField] = useState<string | null>(null);

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

    // Only allow reordering within the same column type
    if (dragged.column !== target.column) {
      setDraggedField(null);
      setDragOverField(null);
      return;
    }

    // Reorder fields
    const columnFields = fields.filter(f => f.column === dragged.column).sort((a, b) => a.order - b.order);
    const draggedIndex = columnFields.findIndex(f => f.id === draggedField);
    const targetIndex = columnFields.findIndex(f => f.id === targetFieldId);

    const newColumnFields = [...columnFields];
    const [removed] = newColumnFields.splice(draggedIndex, 1);
    newColumnFields.splice(targetIndex, 0, removed);

    // Update order values
    const updatedFields = fields.map(field => {
      if (field.column === dragged.column) {
        const newIndex = newColumnFields.findIndex(f => f.id === field.id);
        return { ...field, order: newIndex + 1 };
      }
      return field;
    });

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

  const fullWidthFields = fields.filter(f => f.column === "full").sort((a, b) => a.order - b.order);
  const leftFields = fields.filter(f => f.column === "left").sort((a, b) => a.order - b.order);
  const rightFields = fields.filter(f => f.column === "right").sort((a, b) => a.order - b.order);

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Users className="me-2" style={{ color: '#A52A2A', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Customize Contract Form</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form Fields */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '0', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            {/* Instructions */}
            <div className="mb-4">
              <p className="mb-0" style={{ fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
                AssetExozen allows you to customize the way your data should be shown and entered for a contract. You can move fields to place more important items at the top for easy reading.
              </p>
            </div>
            {/* Full Width Fields */}
            <div className="mb-4">
              <div className="d-flex flex-column" style={{ gap: '16px' }}>
                {fullWidthFields.map((field: FormField) => (
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
                      borderRadius: dragOverField === field.id ? '4px' : '0',
                      cursor: 'move',
                      transition: 'all 0.2s'
                    }}
                  >
                    {field.type === "textarea" ? (
                      <>
                        <label className="form-label mb-0 me-4" style={{ fontSize: '14px', color: '#000', fontWeight: 'normal', minWidth: '160px', textAlign: 'right' }}>
                          {field.label}
                          {field.required && <span style={{ color: '#DC3545' }}> *</span>}
                        </label>
                        <div className="flex-grow-1">
                          <textarea
                            value={field.value || ""}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            rows={3}
                            className="form-control"
                            style={{ borderRadius: '0', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px', resize: 'vertical' }}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <label className="form-label mb-0 me-4" style={{ fontSize: '14px', color: '#000', fontWeight: 'normal', minWidth: '160px', textAlign: 'right' }}>
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
                            style={{ borderRadius: '0', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="row g-4">
              {/* Left Column */}
              <div className="col-md-6">
                <div className="d-flex flex-column" style={{ gap: '16px' }}>
                  {leftFields.map((field) => (
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
                        borderRadius: dragOverField === field.id ? '4px' : '0',
                        cursor: 'move',
                        transition: 'all 0.2s'
                      }}
                    >
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
                              <div className="d-flex align-items-center" style={{ gap: '8px' }}>
                                <button
                                  type="button"
                                  className="btn"
                                  style={{ 
                                    backgroundColor: '#F5F5F5', 
                                    border: '1px solid #D0D0D0', 
                                    borderRadius: '0', 
                                    padding: '8px 12px',
                                    fontSize: '16px',
                                    color: '#000',
                                    minWidth: '50px'
                                  }}
                                >
                                  ₹
                                </button>
                                <input
                                  type="text"
                                  value={field.value || "India Rupee"}
                                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                  className="form-control"
                                  style={{ borderRadius: '0', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
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
                        borderRadius: dragOverField === field.id ? '4px' : '0',
                        cursor: 'move',
                        transition: 'all 0.2s'
                      }}
                    >
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
                          <label className="form-label mb-0 me-4" style={{ fontSize: '14px', color: '#000', fontWeight: 'normal', minWidth: '160px', textAlign: 'right' }}>
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
              borderRadius: '0', 
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
              borderRadius: '0', 
              padding: '8px 16px',
              border: 'none'
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

