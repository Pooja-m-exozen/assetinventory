"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, HelpCircle, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Type, Pencil, ChevronDown, ChevronRight, Info, Settings, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import {
  getEmailTemplates,
  getEmailTemplate,
  updateEmailTemplate,
  getMasterTemplateSettings,
  updateMasterTemplateSettings,
  resetEmailTemplate,
  type EmailTemplate as EmailTemplateType,
  type EmailTemplateBody,
} from "@/lib/api/email-templates";

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
  const [emailSubject, setEmailSubject] = useState("Asset Checkout");
  const [showSignature, setShowSignature] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    "check-out-check-in": true,
    "lease-lease-return": false,
    "setup": false
  });
  
  // Master Template state
  const [replyToEnabled, setReplyToEnabled] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState("");
  const [logoOption, setLogoOption] = useState<"assettiger-logo" | "company-logo" | "company-name">("company-logo");
  const [signature, setSignature] = useState("");

  // API state
  const [templates, setTemplates] = useState<{ [key: string]: EmailTemplateBody & { subject: string; showSignature: boolean } }>({});
  const [currentTemplateData, setCurrentTemplateData] = useState<EmailTemplateBody & { subject: string; showSignature: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Fetch all email templates
  const fetchEmailTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setLoading(false);
          return;
        }
      }

      const response = await getEmailTemplates();
      const templatesMap: { [key: string]: EmailTemplateBody & { subject: string; showSignature: boolean } } = {};
      
      response.data.forEach((template: EmailTemplateType) => {
        templatesMap[template.id] = {
          subject: template.subject,
          showSignature: template.showSignature,
          ...template.body,
        };
      });

      setTemplates(templatesMap);
      
      // Set initial template if available
      if (templatesMap[selectedTemplate]) {
        setCurrentTemplateData(templatesMap[selectedTemplate]);
        setEmailSubject(templatesMap[selectedTemplate].subject);
        setShowSignature(templatesMap[selectedTemplate].showSignature);
      }
    } catch (err) {
      console.error("Error fetching email templates:", err);
      // If 404, use defaults from local object
      if (err instanceof Error && (err as any).status === 404) {
        const fallbackTemplates: { [key: string]: EmailTemplateBody & { subject: string; showSignature: boolean } } = {};
        Object.keys(emailTemplates).forEach(key => {
          fallbackTemplates[key] = {
            subject: emailTemplates[key].subject,
            showSignature: true,
            ...emailTemplates[key].body,
          };
        });
        setTemplates(fallbackTemplates);
        if (fallbackTemplates[selectedTemplate]) {
          setCurrentTemplateData(fallbackTemplates[selectedTemplate]);
          setEmailSubject(fallbackTemplates[selectedTemplate].subject);
        }
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch email templates");
        // Fallback to local templates
        const fallbackTemplates: { [key: string]: EmailTemplateBody & { subject: string; showSignature: boolean } } = {};
        Object.keys(emailTemplates).forEach(key => {
          fallbackTemplates[key] = {
            subject: emailTemplates[key].subject,
            showSignature: true,
            ...emailTemplates[key].body,
          };
        });
        setTemplates(fallbackTemplates);
        if (fallbackTemplates[selectedTemplate]) {
          setCurrentTemplateData(fallbackTemplates[selectedTemplate]);
          setEmailSubject(fallbackTemplates[selectedTemplate].subject);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate]);

  // Fetch master template settings
  const fetchMasterTemplateSettings = useCallback(async () => {
    try {
      const response = await getMasterTemplateSettings();
      const settings = response.data;
      
      setReplyToEnabled(settings.replyToEnabled ?? false);
      setReplyToEmail(settings.replyToEmail ?? "");
      setLogoOption(settings.logoOption ?? "company-logo");
      setSignature(settings.signature ?? "");
    } catch (err) {
      console.error("Error fetching master template settings:", err);
      // If 404, use defaults (already set in state)
    }
  }, []);

  useEffect(() => {
    fetchEmailTemplates();
    fetchMasterTemplateSettings();
  }, []);

  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    
    // Expand Setup category if master-template is selected
    if (templateId === "master-template") {
      setExpandedCategories(prev => ({
        ...prev,
        "setup": true
      }));
      return;
    }

    // Fetch template data
    if (templates[templateId]) {
      setCurrentTemplateData(templates[templateId]);
      setEmailSubject(templates[templateId].subject);
      setShowSignature(templates[templateId].showSignature);
    } else {
      try {
        const response = await getEmailTemplate(templateId);
        const template = response.data;
        const templateData = {
          subject: template.subject,
          showSignature: template.showSignature,
          ...template.body,
        };
        setTemplates(prev => ({ ...prev, [templateId]: templateData }));
        setCurrentTemplateData(templateData);
        setEmailSubject(template.subject);
        setShowSignature(template.showSignature);
      } catch (err) {
        console.error("Error fetching template:", err);
        // Fallback to local template if available
        if (emailTemplates[templateId]) {
          const fallbackData: EmailTemplateBody & { subject: string; showSignature: boolean } = {
            subject: emailTemplates[templateId].subject,
            showSignature: true,
            ...emailTemplates[templateId].body,
          };
          setCurrentTemplateData(fallbackData);
          setEmailSubject(fallbackData.subject);
        }
      }
    }
  };

  const getCurrentTemplate = (): EmailTemplateBody & { subject: string; showSignature: boolean } => {
    if (currentTemplateData) {
      return currentTemplateData;
    }
    if (emailTemplates[selectedTemplate]) {
      return {
        subject: emailTemplates[selectedTemplate].subject,
        showSignature: true,
        ...emailTemplates[selectedTemplate].body,
      };
    }
    const defaultTemplate = emailTemplates["check-out-email"];
    return {
      subject: defaultTemplate.subject,
      showSignature: true,
      ...defaultTemplate.body,
    };
  };
  
  const currentTemplate = getCurrentTemplate();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      if (isMasterTemplate) {
        // Save master template settings
        await updateMasterTemplateSettings({
          replyToEnabled,
          replyToEmail: replyToEnabled ? replyToEmail : undefined,
          logoOption,
          signature,
        });
        setSuccess("Master template settings saved successfully!");
      } else {
        // Save email template
        await updateEmailTemplate(selectedTemplate, {
          subject: emailSubject,
          showSignature,
          body: {
            greeting: currentTemplate.greeting,
            intro: currentTemplate.intro,
            intro2: currentTemplate.intro2,
            tableColumns: currentTemplate.tableColumns,
            notes: currentTemplate.notes,
            closing: currentTemplate.closing,
            disclaimer: currentTemplate.disclaimer,
          },
        });
        
        // Update local state
        const updatedTemplate: EmailTemplateBody & { subject: string; showSignature: boolean } = {
          subject: emailSubject,
          showSignature,
          greeting: currentTemplate.greeting,
          intro: currentTemplate.intro,
          intro2: currentTemplate.intro2,
          tableColumns: currentTemplate.tableColumns,
          notes: currentTemplate.notes,
          closing: currentTemplate.closing,
          disclaimer: currentTemplate.disclaimer,
        };
        setTemplates(prev => ({ ...prev, [selectedTemplate]: updatedTemplate }));
        setCurrentTemplateData(updatedTemplate);
        
        setSuccess("Email template saved successfully!");
      }
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error saving template:", err);
      setError(err instanceof Error ? err.message : "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (isMasterTemplate) {
      // Reset master template settings
      await fetchMasterTemplateSettings();
      setSuccess("Master template settings reset!");
    } else {
      try {
        setSaving(true);
        const response = await resetEmailTemplate(selectedTemplate);
        const template = response.data;
        const templateData = {
          subject: template.subject,
          showSignature: template.showSignature,
          ...template.body,
        };
        setTemplates(prev => ({ ...prev, [selectedTemplate]: templateData }));
        setCurrentTemplateData(templateData);
        setEmailSubject(template.subject);
        setShowSignature(template.showSignature);
        setSuccess("Template reset to default!");
      } catch (err) {
        console.error("Error resetting template:", err);
        setError(err instanceof Error ? err.message : "Failed to reset template");
      } finally {
        setSaving(false);
      }
    }
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="mb-6 flex items-center">
        <div className="relative mr-2">
          <Mail className="h-6 w-6 text-orange-500" />
          <Settings className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-orange-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Customize Emails</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-green-50 p-4 flex items-center text-green-800">
          <CheckCircle className="mr-2 h-5 w-5 shrink-0" />
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (

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
                            onChange={(e) => setLogoOption(e.target.value as "assettiger-logo" | "company-logo" | "company-name")}
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
                            onChange={(e) => setLogoOption(e.target.value as "assettiger-logo" | "company-logo" | "company-name")}
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
                            onChange={(e) => setLogoOption(e.target.value as "assettiger-logo" | "company-logo" | "company-name")}
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
                      <p className="mb-2">{currentTemplate.greeting}</p>
                      <p className="mb-3">{currentTemplate.intro}</p>
                      {currentTemplate.intro2 && (
                        <p className="mb-3">{currentTemplate.intro2}</p>
                      )}
                      
                      {/* Table */}
                      <div className="mb-3">
                        <table className="table table-bordered mb-2" style={{ borderColor: '#D0D0D0', fontSize: '14px', width: '100%' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#FFFACD' }}>
                              {currentTemplate.tableColumns.map((column: string, index: number) => (
                                <th key={index} style={{ borderColor: '#D0D0D0', padding: '8px', fontWeight: '500' }}>
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {currentTemplate.tableColumns.map((column: string, index: number) => (
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

                      {currentTemplate.notes && (
                        <p className="mb-2">{currentTemplate.notes}</p>
                      )}
                      <p className="mb-2">{currentTemplate.closing}</p>
                      {currentTemplate.disclaimer && (
                        <p className="mb-0">{currentTemplate.disclaimer}</p>
                      )}
                    </div>
                  </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={handleReset}
                    disabled={saving || loading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="rounded bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                    disabled={saving || loading}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    onClick={() => window.history.back()}
                    disabled={saving || loading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      )}

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
