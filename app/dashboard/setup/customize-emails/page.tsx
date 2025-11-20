"use client";

import { useState } from "react";
import { Mail, HelpCircle, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Pencil } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  showSignature: boolean;
  body: string;
}

export default function CustomizeEmailsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("check-out-email");
  const [emailSubject, setEmailSubject] = useState("Asset Checkout");
  const [showSignature, setShowSignature] = useState(true);
  const [emailBody, setEmailBody] = useState(`Dear «Name»,

This is a confirmation email. The following items are in your possession:

[TABLE: Asset Tag ID | Description]

Notes: «Check-out Notes»

Thank you.`);

  const emailCategories = [
    {
      title: "Check Out/Check In Emails",
      templates: [
        { id: "check-out-email", name: "Check Out Email" },
        { id: "check-in-email", name: "Check In Email" },
        { id: "upcoming-asset-due-email", name: "Upcoming Asset Due Email" },
        { id: "asset-past-due-email", name: "Asset Past Due Email" },
        { id: "reserve-to-person-email", name: "Reserve To Person Email" }
      ]
    },
    {
      title: "Lease/Lease Return Emails",
      templates: [
        { id: "lease-email", name: "Lease Email" },
        { id: "lease-return-email", name: "Lease Return Email" },
        { id: "lease-return-due-email", name: "Lease Return Due Email" },
        { id: "lease-return-past-due-email", name: "Lease Return Past Due Email" },
        { id: "reserve-to-customer-email", name: "Reserve To Customer Email" }
      ]
    },
    {
      title: "Setup",
      templates: [
        { id: "master-template", name: "Master Template" }
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email template saved", { selectedTemplate, emailSubject, showSignature, emailBody });
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Mail className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Customize Emails</h1>
      </div>

      <div className="row g-4">
        {/* Left Panel - Email Type Sub-navigation */}
        <div className="col-md-3">
          <div className="card" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
            <div className="card-body p-0" style={{ backgroundColor: '#FFFFFF' }}>
              {emailCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div className="p-3 border-bottom" style={{ borderColor: '#E0E0E0' }}>
                    <h6 className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#000' }}>{category.title}</h6>
                  </div>
                  {category.templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className="p-3 border-bottom cursor-pointer"
                      style={{
                        borderColor: '#E0E0E0',
                        backgroundColor: selectedTemplate === template.id ? '#FFF5E6' : '#FFFFFF',
                        borderLeft: selectedTemplate === template.id ? '4px solid #FF8C00' : 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: '#000' }}>{template.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Email Template Editor */}
        <div className="col-md-9">
          <form onSubmit={handleSubmit}>
            <div className="card" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
              <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
                {/* Email Subject */}
                <div className="mb-4">
                  <label className="form-label mb-2 fw-semibold" style={{ fontSize: '14px', color: '#000' }}>
                    Email Subject:
                  </label>
                  <p className="text-muted mb-2" style={{ fontSize: '12px', color: '#666' }}>
                    Text that will appear in the email subject line.
                  </p>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="form-control"
                    style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  />
                </div>

                {/* Show Signature */}
                <div className="mb-4">
                  <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={showSignature}
                      onChange={(e) => setShowSignature(e.target.checked)}
                      style={{ marginRight: '8px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '14px', color: '#000' }}>Show Signature</span>
                  </label>
                </div>

                {/* Email Body */}
                <div className="mb-4">
                  <label className="form-label mb-2 fw-semibold" style={{ fontSize: '14px', color: '#000' }}>
                    Email Body:
                  </label>
                  
                  {/* Formatting Toolbar */}
                  <div className="d-flex align-items-center mb-2 p-2" style={{ backgroundColor: '#F5F5F5', borderRadius: '4px', gap: '8px' }}>
                    <button type="button" className="btn btn-sm p-1" style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <Bold style={{ width: '16px', height: '16px', color: '#666' }} />
                    </button>
                    <button type="button" className="btn btn-sm p-1" style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <Italic style={{ width: '16px', height: '16px', color: '#666' }} />
                    </button>
                    <button type="button" className="btn btn-sm p-1" style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <Underline style={{ width: '16px', height: '16px', color: '#666' }} />
                    </button>
                    <div style={{ width: '1px', height: '20px', backgroundColor: '#D0D0D0', margin: '0 4px' }}></div>
                    <button type="button" className="btn btn-sm p-1" style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <AlignLeft style={{ width: '16px', height: '16px', color: '#666' }} />
                    </button>
                    <button type="button" className="btn btn-sm p-1" style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <AlignCenter style={{ width: '16px', height: '16px', color: '#666' }} />
                    </button>
                    <button type="button" className="btn btn-sm p-1" style={{ backgroundColor: 'transparent', border: 'none' }}>
                      <AlignRight style={{ width: '16px', height: '16px', color: '#666' }} />
                    </button>
                    <div style={{ width: '1px', height: '20px', backgroundColor: '#D0D0D0', margin: '0 4px' }}></div>
                    <button type="button" className="btn btn-sm p-1 d-flex align-items-center" style={{ backgroundColor: 'transparent', border: 'none', gap: '4px' }}>
                      <Type style={{ width: '16px', height: '16px', color: '#666' }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>AA</span>
                    </button>
                  </div>

                  {/* Email Content Editor */}
                  <div className="p-4" style={{ border: '1px solid #D0D0D0', borderRadius: '4px', backgroundColor: '#FFFFFF', minHeight: '400px' }}>
                    {/* Logo Placeholder */}
                    <div className="mb-3 p-4 text-center" style={{ border: '2px dashed #D0D0D0', borderRadius: '4px', backgroundColor: '#F9F9F9' }}>
                      <span style={{ fontSize: '14px', color: '#999' }}>Your Logo Goes Here</span>
                    </div>

                    {/* Email Content */}
                    <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.6' }}>
                      <p className="mb-2">Dear «Name»,</p>
                      <p className="mb-3">This is a confirmation email. The following items are in your possession:</p>
                      
                      {/* Table */}
                      <div className="mb-3">
                        <table className="table table-bordered mb-2" style={{ borderColor: '#D0D0D0', fontSize: '14px' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#FFF5E6' }}>
                              <th style={{ borderColor: '#D0D0D0', padding: '8px', fontWeight: '500' }}>Asset Tag ID</th>
                              <th style={{ borderColor: '#D0D0D0', padding: '8px', fontWeight: '500' }}>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ borderColor: '#D0D0D0', padding: '8px' }}>Sample</td>
                              <td style={{ borderColor: '#D0D0D0', padding: '8px' }}>Sample</td>
                            </tr>
                          </tbody>
                        </table>
                        <a href="#" className="d-inline-flex align-items-center" style={{ color: '#0066CC', textDecoration: 'underline', fontSize: '14px', gap: '4px' }}>
                          <Pencil style={{ width: '14px', height: '14px' }} />
                          Edit Table
                        </a>
                      </div>

                      <p className="mb-2">Notes: «Check-out Notes»</p>
                      <p className="mb-2">Thank you.</p>
                      <p className="mb-0">This e-mail address does not accept incoming mail.</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end" style={{ gap: '12px' }}>
                  <button
                    type="button"
                    className="btn"
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #D0D0D0', 
                      borderRadius: '4px', 
                      padding: '8px 16px',
                      color: '#000'
                    }}
                  >
                    Reset
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
                </div>
              </div>
            </div>
          </form>
        </div>
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

