"use client";

import { useState } from "react";
import { Package, Key } from "lucide-react";

interface InventoryField {
  id: string;
  name: string;
  isRequired: boolean;
  isKey?: boolean;
  enabled: boolean;
  customizeLabel: string;
  labelSuggestions: string;
  dataExample: string;
  dataRequired: "yes" | "optional";
}

export default function InventoryPage() {
  const [inventoryEnabled, setInventoryEnabled] = useState(true);
  const [selectAllFields, setSelectAllFields] = useState(false);

  const [inventoryFields, setInventoryFields] = useState<InventoryField[]>([
    {
      id: "inventory-tag-id",
      name: "Inventory Tag ID",
      isRequired: true,
      isKey: true,
      enabled: true,
      customizeLabel: "Inventory",
      labelSuggestions: "Tag ID, SKU",
      dataExample: "INV-1001",
      dataRequired: "yes"
    },
    {
      id: "description",
      name: "Description",
      isRequired: true,
      enabled: true,
      customizeLabel: "Descriptic",
      labelSuggestions: "Title",
      dataExample: "Heavy-Duty Metal Asset Tags",
      dataRequired: "yes"
    },
    {
      id: "unit",
      name: "Unit",
      isRequired: true,
      enabled: true,
      customizeLabel: "Unit",
      labelSuggestions: "Unit of Measurement",
      dataExample: "pcs",
      dataRequired: "yes"
    },
    {
      id: "stock",
      name: "Stock",
      isRequired: false,
      enabled: false,
      customizeLabel: "Stock",
      labelSuggestions: "Stock-in-hand",
      dataExample: "The total quantity in stock is calculated",
      dataRequired: "optional"
    }
  ]);

  const handleFieldToggle = (id: string) => {
    setInventoryFields(inventoryFields.map(field => 
      field.id === id ? { ...field, enabled: !field.enabled } : field
    ));
  };

  const handleSelectAllFields = () => {
    const newValue = !selectAllFields;
    setSelectAllFields(newValue);
    setInventoryFields(inventoryFields.map(field => ({ ...field, enabled: newValue })));
  };

  const handleDataRequiredChange = (id: string, value: "yes" | "optional") => {
    setInventoryFields(inventoryFields.map(field => 
      field.id === id ? { ...field, dataRequired: value } : field
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { inventoryEnabled, inventoryFields });
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Package className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Inventory</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Enable Inventory Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center gap-3">
              <label className="mb-0 fw-medium" style={{ fontSize: '14px', color: '#000' }}>
                Enable Inventory:
              </label>
              <div className="d-flex align-items-center gap-4">
                <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="inventory-enabled"
                    checked={inventoryEnabled}
                    onChange={() => setInventoryEnabled(true)}
                    style={{ marginRight: '6px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: '#000' }}>Yes</span>
                </label>
                <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="inventory-enabled"
                    checked={!inventoryEnabled}
                    onChange={() => setInventoryEnabled(false)}
                    style={{ marginRight: '6px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', color: '#000' }}>No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Item Fields Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-start mb-4">
              <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
                <Package style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
              </div>
              <div className="flex-grow-1">
                <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Inventory Item Fields</h5>
                <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  Fill in the appropriate fields for your inventory. <strong>Inventory Tag ID</strong>, <strong>Description</strong>, and <strong>Unit of Measurement</strong> are the only required fields. Check the boxes next to the field names you want to include.
                </p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered mb-0" style={{ borderColor: '#E0E0E0' }}>
                <thead>
                  <tr style={{ backgroundColor: '#FFF5E6' }}>
                    <th style={{ borderColor: '#E0E0E0', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#000' }}>
                      <div className="d-flex align-items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectAllFields}
                          onChange={handleSelectAllFields}
                          style={{ cursor: 'pointer' }}
                        />
                        <span>Field name</span>
                      </div>
                    </th>
                    <th style={{ borderColor: '#E0E0E0', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#000' }}>Customize Label</th>
                    <th style={{ borderColor: '#E0E0E0', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#000' }}>Label Suggestions</th>
                    <th style={{ borderColor: '#E0E0E0', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#000' }}>Data Example</th>
                    <th style={{ borderColor: '#E0E0E0', padding: '12px', fontSize: '14px', fontWeight: '600', color: '#000' }}>Data Required</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryFields.map((field) => (
                    <tr key={field.id}>
                      <td style={{ borderColor: '#E0E0E0', padding: '12px' }}>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.enabled}
                            onChange={() => handleFieldToggle(field.id)}
                            style={{ cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '14px', color: '#000' }}>
                            {field.name}
                            {field.isRequired && <span style={{ color: '#DC3545' }}> *</span>}
                            {field.isKey && (
                              <Key style={{ width: '14px', height: '14px', display: 'inline-block', marginLeft: '4px', color: '#FF8C00', verticalAlign: 'middle' }} />
                            )}
                          </span>
                        </div>
                      </td>
                      <td style={{ borderColor: '#E0E0E0', padding: '12px' }}>
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{ 
                            backgroundColor: '#F8F9FA', 
                            border: '1px solid #D0D0D0', 
                            borderRadius: '4px', 
                            padding: '4px 12px',
                            fontSize: '14px',
                            color: '#000'
                          }}
                        >
                          {field.customizeLabel}
                        </button>
                      </td>
                      <td style={{ borderColor: '#E0E0E0', padding: '12px', fontSize: '14px', color: '#666' }}>
                        {field.labelSuggestions}
                      </td>
                      <td style={{ borderColor: '#E0E0E0', padding: '12px', fontSize: '14px', color: '#666' }}>
                        {field.dataExample}
                      </td>
                      <td style={{ borderColor: '#E0E0E0', padding: '12px' }}>
                        <div className="d-flex align-items-center gap-4">
                          <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name={`required-${field.id}`}
                              checked={field.dataRequired === "yes"}
                              onChange={() => handleDataRequiredChange(field.id, "yes")}
                              style={{ marginRight: '6px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#000' }}>Yes</span>
                          </label>
                          <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name={`required-${field.id}`}
                              checked={field.dataRequired === "optional"}
                              onChange={() => handleDataRequiredChange(field.id, "optional")}
                              style={{ marginRight: '6px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#000' }}>Optional</span>
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-secondary" style={{ borderRadius: '4px', padding: '8px 16px' }}>Cancel</button>
          <button type="submit" className="btn text-white" style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '8px 16px' }}>Submit</button>
        </div>
      </form>
    </div>
  );
}
