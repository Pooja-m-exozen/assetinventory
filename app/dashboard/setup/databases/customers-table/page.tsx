"use client";

import { useState } from "react";
import { Database, Key, Users } from "lucide-react";

interface StandardField {
  id: string;
  name: string;
  required: boolean;
  description: string;
  example: string;
  enabled: boolean;
  isSystemField?: boolean;
}

export default function CustomersTablePage() {
  const [standardFields, setStandardFields] = useState<StandardField[]>([
    {
      id: "full-name",
      name: "Full Name",
      required: true,
      description: "Full name of the customer",
      example: "Jane Doe",
      enabled: true,
      isSystemField: true,
    },
    {
      id: "email",
      name: "Email",
      required: false,
      description: "Email of the customer",
      example: "janedoe@example.com",
      enabled: true,
    },
    {
      id: "company",
      name: "Company",
      required: false,
      description: "Customer's company name",
      example: "Jane Doe Company",
      enabled: true,
    },
    {
      id: "address",
      name: "Address",
      required: false,
      description: "All address fields of the customer",
      example: "",
      enabled: true,
    },
    {
      id: "phone",
      name: "Phone",
      required: false,
      description: "Phone number of the customer",
      example: "(555) 123-4567",
      enabled: true,
    },
    {
      id: "mobile-phone",
      name: "Mobile Phone",
      required: false,
      description: "Mobile Cell of the customer",
      example: "(123) 456-7890",
      enabled: true,
    },
    {
      id: "notes",
      name: "Notes",
      required: false,
      description: "Text area for notes",
      example: "Leases equipment for 12 months.",
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
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Database Customers</h1>
      </div>

      {/* Customers Standard Fields Section */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="d-flex align-items-start mb-4">
            <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
              <Users style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Customers Standard Fields</h5>
              <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Customers are the individuals or organizations to whom you lease out your equipment. Select the fields you would like to use for your customers.
              </p>
            </div>
          </div>

          {/* Customers Standard Fields Table */}
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
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', color: '#666' }}>{field.example || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Key Field Section */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="d-flex align-items-start mb-3">
            <Key className="me-2" style={{ color: '#FF8C00', width: '20px', height: '20px', marginTop: '2px' }} />
            <div className="flex-grow-1">
              <h5 className="mb-2 fw-semibold" style={{ fontSize: '16px', color: '#000' }}>Key Field (Unique Identifier)</h5>
              <p className="text-muted mb-2" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Select the key field that you would like to use as a unique identifier. The key field should have unique values in the system.
              </p>
              <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                For example, if you select 'Full Name' as a key field, you cannot have two customers with the name 'John Doe'. To make them unique, you may have to name them 'John Doe' and 'John Doe 2'.
              </p>
              <p className="text-muted mb-0 mt-2" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                As an alternative, use 'Email' as a key field since email is always unique for each customer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
