"use client";

import { Phone, MapPin, Mail, Settings } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Phone className="me-2" style={{ color: '#DC2626', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '20px', color: '#000' }}>
          Contact Us
        </h1>
      </div>

      {/* Technical Support Section */}
      <div className="card mb-4" style={{ border: '1px solid #FFFFFF', borderRadius: '0', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="d-flex align-items-start">
            <Settings className="me-3" style={{ color: '#FFD700', width: '24px', height: '24px', flexShrink: 0, marginTop: '2px' }} />
            <div className="flex-1">
              <h2 className="mb-2 fw-bold" style={{ fontSize: '16px', color: '#000', marginBottom: '8px' }}>
                Technical Support
              </h2>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#000', marginBottom: '0' }}>
                We love hearing from our customers. If you have any questions about AssetExozen, please call or email us. Please include your AssetExozen account number-it lets us resolve your request faster and more accurately.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Cards */}
      <div className="row g-3 mb-4">
        {/* Address Card */}
        <div className="col-md-4">
          <div className="card h-100" style={{ border: '1px solid #FFFFFF', borderRadius: '0', boxShadow: 'none' }}>
            <div className="card-body text-center" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
              <MapPin className="mb-3" style={{ color: '#FFD700', width: '32px', height: '32px', margin: '0 auto 12px' }} />
              <h3 className="mb-2 fw-bold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
                Address
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#000', marginBottom: '0' }}>
                25/1, 4th Floor, SKIP House, Museum Rd,<br />
                near Brigade Tower, Shanthala Nagar,<br />
                Ashok Nagar, Bengaluru, Karnataka 560025
              </p>
            </div>
          </div>
        </div>

        {/* Contact Support Card */}
        <div className="col-md-4">
          <div className="card h-100" style={{ border: '1px solid #FFFFFF', borderRadius: '0', boxShadow: 'none' }}>
            <div className="card-body text-center" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
              <Phone className="mb-3" style={{ color: '#FFD700', width: '32px', height: '32px', margin: '0 auto 12px' }} />
              <h3 className="mb-2 fw-bold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
                Contact Support
              </h3>
              <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                <p style={{ marginBottom: '4px' }}>
                  <a href="tel:08041651888" style={{ color: '#0066FF', textDecoration: 'none' }}>
                    080 4165 1888
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Card */}
        <div className="col-md-4">
          <div className="card h-100" style={{ border: '1px solid #FFFFFF', borderRadius: '0', boxShadow: 'none' }}>
            <div className="card-body text-center" style={{ padding: '24px', backgroundColor: '#FFFFFF' }}>
              <Mail className="mb-3" style={{ color: '#FFD700', width: '32px', height: '32px', margin: '0 auto 12px' }} />
              <h3 className="mb-2 fw-bold" style={{ fontSize: '14px', color: '#000', marginBottom: '8px' }}>
                Email
              </h3>
              <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#000', marginBottom: '0' }}>
                <a href="mailto:support@exozen.co.in" style={{ color: '#0066FF', textDecoration: 'none', wordBreak: 'break-all' }}>
                  support@exozen.co.in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="card" style={{ border: '1px solid #FFFFFF', borderRadius: '0', boxShadow: 'none' }}>
        <div className="card-body p-0">
          <div className="w-100" style={{ height: '500px', position: 'relative' }}>
            <iframe
              src="https://www.google.com/maps?q=25/1,+4th+Floor,+SKIP+House,+Museum+Rd,+near+Brigade+Tower,+Shanthala+Nagar,+Ashok+Nagar,+Bengaluru,+Karnataka+560025&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="AssetExozen Office Location"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
