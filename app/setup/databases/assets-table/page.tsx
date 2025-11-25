"use client";

import { useState } from "react";
import { Database, Key } from "lucide-react";

interface StandardField {
  id: string;
  name: string;
  required: boolean;
  description: string;
  example: string;
  enabled: boolean;
  isSystemField?: boolean;
}

export default function AssetsTablePage() {
  const [standardFields, setStandardFields] = useState<StandardField[]>([
    {
      id: "asset-tag-id",
      name: "Asset Tag ID",
      required: true,
      description: "This field holds the unique asset id number that your company assigns to identify each asset. These are generally sequentially numbered labels with barcodes.",
      example: "A-1001",
      enabled: true,
      isSystemField: true,
    },
    {
      id: "asset-description",
      name: "Asset Description",
      required: true,
      description: "Description of the asset",
      example: "HP - Envy Desktop - 12GB Memory - 2TB Hard Drive",
      enabled: true,
      isSystemField: true,
    },
    {
      id: "purchase-date",
      name: "Purchase Date",
      required: false,
      description: "Date asset was purchased",
      example: "08/22/2014",
      enabled: true,
    },
    {
      id: "cost",
      name: "Cost",
      required: false,
      description: "Cost of the asset",
      example: "₹225.75",
      enabled: true,
    },
    {
      id: "purchased-from",
      name: "Purchased from",
      required: false,
      description: "Vendor/Supplier name",
      example: "Amazon",
      enabled: true,
    },
    {
      id: "brand",
      name: "Brand",
      required: false,
      description: "Manufacturer of the asset",
      example: "HP",
      enabled: true,
    },
    {
      id: "model",
      name: "Model",
      required: false,
      description: "Model name of the asset",
      example: "Envy",
      enabled: true,
    },
    {
      id: "serial-no",
      name: "Serial No",
      required: false,
      description: "Manufacturer's serial number",
      example: "HG9C3X",
      enabled: true,
    },
  ]);

  const handleStandardFieldChange = (id: string, fieldType: "enabled" | "required", value: boolean) => {
    setStandardFields(
      standardFields.map((field) =>
        field.id === id
          ? { ...field, [fieldType]: value }
          : field
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setStandardFields(
      standardFields.map((field) => ({
        ...field,
        enabled: field.isSystemField ? true : checked,
      }))
    );
  };

  const allSelected = standardFields.every(field => field.enabled);

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Database className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Database Assets</h1>
      </div>

      {/* Asset Database Fields Section */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="d-flex align-items-start mb-4">
            <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
              <Database style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Asset Database Fields</h5>
              <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Fill in the appropriate fields for your assets. <strong>Asset Tag ID</strong> and <strong>Asset Description</strong> are the only required fields. Check the boxes next to the field names you want to include.
              </p>
            </div>
          </div>

          {/* Asset Database Fields Table */}
          <div className="table-responsive">
            <table className="table table-bordered" style={{ marginBottom: '0' }}>
              <thead style={{ backgroundColor: '#F8F9FA' }}>
                <tr>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600' }}>
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      style={{ marginRight: '8px' }}
                    />
                    Field name
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600' }}>Data Required</th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600' }}>Description</th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600' }}>Example</th>
                </tr>
              </thead>
              <tbody>
                {standardFields.map((field) => (
                  <tr key={field.id}>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          checked={field.enabled}
                          onChange={(e) => handleStandardFieldChange(field.id, "enabled", e.target.checked)}
                          disabled={field.isSystemField}
                          style={{ marginRight: '8px' }}
                        />
                        {field.name}
                        {field.isSystemField && (
                          <>
                            <span className="text-danger ms-1">*</span>
                            {field.id === "asset-tag-id" && (
                              <Key style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#666' }} />
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px' }}>
                      <div className="d-flex align-items-center gap-4">
                        <label className="d-flex align-items-center" style={{ cursor: field.isSystemField ? 'not-allowed' : 'pointer' }}>
                          <input
                            type="radio"
                            name={`required-${field.id}`}
                            checked={field.required}
                            onChange={() => handleStandardFieldChange(field.id, "required", true)}
                            disabled={field.isSystemField}
                            style={{ marginRight: '6px', cursor: field.isSystemField ? 'not-allowed' : 'pointer' }}
                          />
                          <span style={{ fontSize: '14px', color: '#000' }}>Yes</span>
                        </label>
                        <label className="d-flex align-items-center" style={{ cursor: field.isSystemField ? 'not-allowed' : 'pointer' }}>
                          <input
                            type="radio"
                            name={`required-${field.id}`}
                            checked={!field.required}
                            onChange={() => handleStandardFieldChange(field.id, "required", false)}
                            disabled={field.isSystemField}
                            style={{ marginRight: '6px', cursor: field.isSystemField ? 'not-allowed' : 'pointer' }}
                          />
                          <span style={{ fontSize: '14px', color: '#000' }}>Optional</span>
                        </label>
                      </div>
                    </td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', color: '#666' }}>{field.description}</td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', color: '#666' }}>{field.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Asset Custom Fields Section */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="d-flex align-items-start mb-4">
            <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
              <Database style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Asset Custom Fields</h5>
              <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Add custom fields to join the standard fields that we provided. Feel free to get creative.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}