"use client";

import { useState } from "react";
import { Database, Key, FileText } from "lucide-react";

interface StandardField {
  id: string;
  name: string;
  required: boolean;
  description: string;
  example: string;
  enabled: boolean;
  isSystemField?: boolean;
  hasNoRadioButtons?: boolean;
}

export default function ContractTablePage() {
  const [standardFields, setStandardFields] = useState<StandardField[]>([
    {
      id: "contract-title",
      name: "Contract Title",
      required: true,
      description: "Title of Contract",
      example: "Notebooks Annual Contract",
      enabled: true,
      isSystemField: true,
    },
    {
      id: "description",
      name: "Description",
      required: false,
      description: "Description of the contract.",
      example: "Maintenance Contract for Marketing department Notebooks",
      enabled: true,
    },
    {
      id: "hyperlink",
      name: "Hyperlink",
      required: false,
      description: "HyperLink of Contract",
      example: "https://www.example.com",
      enabled: true,
    },
    {
      id: "contract-no",
      name: "Contract No.",
      required: false,
      description: "Contract number",
      example: "AMC984763",
      enabled: true,
    },
    {
      id: "cost",
      name: "Cost",
      required: false,
      description: "Cost of the contract",
      example: "$499.95",
      enabled: true,
    },
    {
      id: "start-date",
      name: "Start Date",
      required: true,
      description: "Start date of the contract",
      example: "7/4/2020",
      enabled: true,
      isSystemField: true,
    },
    {
      id: "end-date",
      name: "End Date",
      required: true,
      description: "End date of the contract",
      example: "7/3/2021",
      enabled: true,
      isSystemField: true,
    },
    {
      id: "no-end-date",
      name: "No End Date",
      required: false,
      description: "Check if contract has no end date",
      example: "No",
      enabled: true,
      hasNoRadioButtons: true,
    },
    {
      id: "vendor",
      name: "Vendor",
      required: false,
      description: "Vendor name",
      example: "CompuByte Computer Services",
      enabled: true,
    },
    {
      id: "contract-person",
      name: "Contract Person",
      required: false,
      description: "Person responsible for the contract",
      example: "James Brown",
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
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Database Contract</h1>
      </div>

      {/* Contract Standard Fields Section */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="d-flex align-items-start mb-4">
            <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
              <FileText style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Contract Standard Fields</h5>
              <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Select the fields you would like to use for the contract table.
              </p>
            </div>
          </div>

          {/* Contract Standard Fields Table */}
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
                            <Key style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#666' }} />
                          </>
                        )}
                      </div>
                    </td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px' }}>
                      {!field.hasNoRadioButtons ? (
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
                      ) : (
                        <span style={{ fontSize: '14px', color: '#666' }}>-</span>
                      )}
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
    </div>
  );
}