"use client";

import { useState } from "react";
import { Mail, HelpCircle, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Pencil, ChevronDown, ChevronRight, Info, Settings } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  showSignature: boolean;
  body: string;
}

interface EmailTemplateData {
  subject: string;
  body: {
    greeting: string;
    intro: string;
    intro2?: string;
    tableColumns: string[];
    notes: string;
    closing: string;
    disclaimer?: string;
  };
}

const emailTemplates: { [key: string]: EmailTemplateData } = {
  "check-out-email": {
    subject: "Asset Checkout",
    body: {
      greeting: "Dear «Name»,",
      intro: "This is a confirmation email. The following items are in your possession:",
      tableColumns: ["Asset Tag ID", "Description"],
      notes: "Notes: «Check-out Notes»",
      closing: "Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  },
  "check-in-email": {
    subject: "Check-in Complete",
    body: {
      greeting: "Dear «Name»,",
      intro: "This is to confirm that the following items checked out to you have been returned:",
      tableColumns: ["Asset Tag ID", "Description", "Check-out Date", "Due date"],
      notes: "Notes: «Check-in Notes»",
      closing: "Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  },
  "upcoming-asset-due-email": {
    subject: "Upcoming Asset Check-in",
    body: {
      greeting: "Dear «Name»,",
      intro: "As a reminder, the equipment in your possession needs to be returned on or before «Due Date».",
      intro2: "The items you checked out are as follows:",
      tableColumns: ["Description", "Asset Tag ID", "Due date", "Check-out Date", "Assigned to"],
      notes: "",
      closing: "Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  },
  "asset-past-due-email": {
    subject: "Asset Past Due",
    body: {
      greeting: "Dear «Name»,",
      intro: "This is a reminder that the following items are past due and need to be returned immediately:",
      tableColumns: ["Description", "Asset Tag ID", "Due date", "Check-out Date", "Assigned to"],
      notes: "",
      closing: "Please return these items as soon as possible. Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  },
  "reserve-to-person-email": {
    subject: "Asset Reserved",
    body: {
      greeting: "Dear «Name»,",
      intro: "The following items have been reserved for you:",
      tableColumns: ["Description", "Asset Tag ID", "Reserved Date", "Reserved Until"],
      notes: "Notes: «Reservation Notes»",
      closing: "Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  },
  "lease-email": {
    subject: "Asset Lease",
    body: {
      greeting: "Dear «Name»,",
      intro: "This is a confirmation email. The following items are in your possession:",
      tableColumns: ["Asset Tag ID", "Description"],
      notes: "Notes: «Lease Notes»",
      closing: "Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  },
  "lease-return-email": {
    subject: "Lease Return Complete",
    body: {
      greeting: "Dear «Name»,",
      intro: "This is to confirm that the following leased items have been returned:",
      tableColumns: ["Asset Tag ID", "Description", "Lease Date", "Return Date"],
      notes: "Notes: «Lease Return Notes»",
      closing: "Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  },
  "lease-return-due-email": {
    subject: "Lease Return Due",
    body: {
      greeting: "Dear «Name»,",
      intro: "As a reminder, the following leased items need to be returned on or before «Due Date»:",
      intro2: "The items currently leased to you are as follows:",
      tableColumns: ["Description", "Asset Tag ID", "Due date", "Lease Date", "Assigned to"],
      notes: "",
      closing: "Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  },
  "lease-return-past-due-email": {
    subject: "Lease Return Past Due",
    body: {
      greeting: "Dear «Name»,",
      intro: "This is a reminder that the following leased items are past due and need to be returned immediately:",
      tableColumns: ["Description", "Asset Tag ID", "Due date", "Lease Date", "Assigned to"],
      notes: "",
      closing: "Please return these items as soon as possible. Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  },
  "reserve-to-customer-email": {
    subject: "Asset Reserved",
    body: {
      greeting: "Dear «Name»,",
      intro: "The following items have been reserved for you:",
      tableColumns: ["Description", "Asset Tag ID", "Reserved Date", "Reserved Until"],
      notes: "Notes: «Reservation Notes»",
      closing: "Thank you.",
      disclaimer: "This e-mail address does not accept incoming mail."
    }
  }
};

export default function CustomizeEmailsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("check-out-email");
  const [emailSubject, setEmailSubject] = useState(emailTemplates["check-out-email"]?.subject || "Asset Checkout");
  const [showSignature, setShowSignature] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    "check-out-check-in": true,
    "lease-lease-return": false,
    "setup": false
  });
  
  // Master Template state
  const [replyToEnabled, setReplyToEnabled] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState("");
  const [logoOption, setLogoOption] = useState("company-logo");
  const [signature, setSignature] = useState("");

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = emailTemplates[templateId];
    if (template) {
      setEmailSubject(template.subject);
    }
    // Expand Setup category if master-template is selected
    if (templateId === "master-template") {
      setExpandedCategories(prev => ({
        ...prev,
        "setup": true
      }));
    }
  };

  const currentTemplate = emailTemplates[selectedTemplate] || emailTemplates["check-out-email"];
  const isMasterTemplate = selectedTemplate === "master-template";

  const emailCategories = [
    {
      key: "check-out-check-in",
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
      key: "lease-lease-return",
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
      key: "setup",
      title: "Setup",
      templates: [
        { id: "master-template", name: "Master Template" }
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email template saved", { selectedTemplate, emailSubject, showSignature });
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <div className="position-relative me-2">
          <Mail style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
          <Settings style={{ color: '#FF8C00', width: '12px', height: '12px', position: 'absolute', bottom: '-2px', right: '-2px' }} />
        </div>
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Customize Emails</h1>
      </div>

      <div className="row g-4">
        {/* Left Panel - Email Type Sub-navigation */}
        <div className="col-md-3">
          <div className="card" style={{ border: '1px solid #E0E0E0', borderRadius: '0', boxShadow: 'none' }}>
            <div className="card-body p-0" style={{ backgroundColor: '#F5F5F5' }}>
              {emailCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <div 
                    className="p-3 border-bottom d-flex align-items-center justify-content-between" 
                    style={{ 
                      borderColor: '#E0E0E0',
                      backgroundColor: '#F5F5F5',
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleCategory(category.key)}
                  >
                    <h6 className="mb-0 fw-semibold" style={{ fontSize: '14px', color: '#000' }}>{category.title}</h6>
                    {expandedCategories[category.key] ? (
                      <ChevronDown style={{ width: '16px', height: '16px', color: '#666' }} />
                    ) : (
                      <ChevronRight style={{ width: '16px', height: '16px', color: '#666' }} />
                    )}
                  </div>
                  {expandedCategories[category.key] && category.templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateChange(template.id)}
                      className="p-3 border-bottom cursor-pointer"
                      style={{
                        borderColor: '#E0E0E0',
                        backgroundColor: selectedTemplate === template.id ? '#FF8C00' : '#F5F5F5',
                        color: selectedTemplate === template.id ? '#FFFFFF' : '#000',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>{template.name}</span>
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
            <div className="card" style={{ border: '1px solid #E0E0E0', borderRadius: '0', boxShadow: 'none' }}>
              <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
                {isMasterTemplate ? (
                  <>
                    {/* Reply To Email */}
                    <div className="mb-4">
                      <label className="d-flex align-items-center mb-2" style={{ cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={replyToEnabled}
                          onChange={(e) => setReplyToEnabled(e.target.checked)}
                          style={{ marginRight: '8px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px', color: '#000' }}>Reply To Email:</span>
                      </label>
                      <input
                        type="email"
                        value={replyToEmail}
                        onChange={(e) => setReplyToEmail(e.target.value)}
                        disabled={!replyToEnabled}
                        className="form-control"
                        placeholder="Enter reply-to email address"
                        style={{ borderRadius: '0', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px', backgroundColor: replyToEnabled ? '#FFFFFF' : '#F5F5F5' }}
                      />
                    </div>

                    {/* Logo Selection */}
                    <div className="mb-4">
                      <label className="form-label mb-3 fw-semibold" style={{ fontSize: '14px', color: '#000' }}>
                        Logo:
                      </label>
                      <div className="mb-3">
                        <label className="d-flex align-items-center mb-2" style={{ cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="logoOption"
                            value="assettiger-logo"
                            checked={logoOption === "assettiger-logo"}
                            onChange={(e) => setLogoOption(e.target.value)}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '14px', color: '#000' }}>AssetExozen Logo</span>
                        </label>
                        <label className="d-flex align-items-center mb-2" style={{ cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="logoOption"
                            value="company-logo"
                            checked={logoOption === "company-logo"}
                            onChange={(e) => setLogoOption(e.target.value)}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '14px', color: '#000' }}>Company Logo</span>
                        </label>
                        <label className="d-flex align-items-center mb-2" style={{ cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name="logoOption"
                            value="company-name"
                            checked={logoOption === "company-name"}
                            onChange={(e) => setLogoOption(e.target.value)}
                            style={{ marginRight: '8px', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: '14px', color: '#000' }}>Company Name</span>
                        </label>
                      </div>
                      <div className="p-4 text-center" style={{ border: '2px dashed #D0D0D0', borderRadius: '4px', backgroundColor: '#F9F9F9' }}>
                        <span style={{ fontSize: '14px', color: '#999' }}>Your Logo Goes Here</span>
                      </div>
                    </div>

                    {/* Signature */}
                    <div className="mb-4">
                      <label className="form-label mb-2 fw-semibold" style={{ fontSize: '14px', color: '#000' }}>
                        Signature:
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

                      {/* Signature Text Area */}
                      <textarea
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        className="form-control"
                        rows={8}
                        placeholder="Enter your email signature..."
                        style={{ borderRadius: '0', border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', minHeight: '200px' }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Email Subject */}
                    <div className="mb-4">
                      <label className="form-label mb-2 fw-semibold d-flex align-items-center" style={{ fontSize: '14px', color: '#000', gap: '8px' }}>
                        Email Subject:
                      </label>
                      <div className="d-flex align-items-center mb-2" style={{ gap: '8px' }}>
                        <Info style={{ width: '16px', height: '16px', color: '#666' }} />
                        <p className="mb-0" style={{ fontSize: '12px', color: '#666' }}>
                          Text that will appear in the email subject line.
                        </p>
                      </div>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="form-control"
                        style={{ borderRadius: '0', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
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
                  <div className="p-4 position-relative" style={{ border: '1px solid #D0D0D0', borderRadius: '0', backgroundColor: '#FFFFFF', minHeight: '400px' }}>
                    {/* Logo Placeholder - Top Right */}
                    <div className="position-absolute" style={{ top: '16px', right: '16px', border: '2px dashed #D0D0D0', borderRadius: '4px', backgroundColor: '#F9F9F9', padding: '16px 24px' }}>
                      <span style={{ fontSize: '14px', color: '#999' }}>Your Logo Goes Here</span>
                    </div>

                    {/* Email Content */}
                    <div style={{ fontSize: '14px', color: '#000', lineHeight: '1.6', paddingTop: '60px' }}>
                      <p className="mb-2">{currentTemplate.body.greeting}</p>
                      <p className="mb-3">{currentTemplate.body.intro}</p>
                      {currentTemplate.body.intro2 && (
                        <p className="mb-3">{currentTemplate.body.intro2}</p>
                      )}
                      
                      {/* Table */}
                      <div className="mb-3">
                        <table className="table table-bordered mb-2" style={{ borderColor: '#D0D0D0', fontSize: '14px', width: '100%' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#FFFACD' }}>
                              {currentTemplate.body.tableColumns.map((column, index) => (
                                <th key={index} style={{ borderColor: '#D0D0D0', padding: '8px', fontWeight: '500' }}>
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {currentTemplate.body.tableColumns.map((column, index) => (
                                <td key={index} style={{ borderColor: '#D0D0D0', padding: '8px' }}>
                                  {column === "Check-out Date" || column === "Due date" || column === "Reserved Date" || column === "Reserved Until" || column === "Lease Date" || column === "Return Date" ? "01/15/2015" : "Sample"}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                        <a href="#" className="d-inline-flex align-items-center" style={{ color: '#0066CC', textDecoration: 'underline', fontSize: '14px', gap: '4px' }}>
                          <Pencil style={{ width: '14px', height: '14px' }} />
                          Edit Table
                        </a>
                      </div>

                      {currentTemplate.body.notes && (
                        <p className="mb-2">{currentTemplate.body.notes}</p>
                      )}
                      <p className="mb-2">{currentTemplate.body.closing}</p>
                      {currentTemplate.body.disclaimer && (
                        <p className="mb-0">{currentTemplate.body.disclaimer}</p>
                      )}
                    </div>
                  </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="d-flex justify-content-end" style={{ gap: '12px' }}>
                  <button
                    type="button"
                    className="btn"
                    style={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '1px solid #D0D0D0', 
                      borderRadius: '0', 
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
                      borderRadius: '0', 
                      padding: '8px 16px',
                      border: 'none'
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
                      borderRadius: '0', 
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
