"use client";

import { useState } from "react";
import { Briefcase, Clock, Image as ImageIcon, Trash2 } from "lucide-react";

export default function CompanyInfoPage() {
  const [formData, setFormData] = useState({
    company: "Exozen",
    organizationType: "Large Enterprise",
    country: "India",
    address: "25/1, 4th Floor, SKIP House, Museum Rd, near Brigade",
    aptSuite: "",
    city: "Banglore",
    state: "Karnataka",
    postalCode: "560025",
    timezone: "(GMT +5:30) Sri Jayawardenepura",
    currency: "India Rupee (INR ₹)",
    dateFormat: "MM/dd/yyyy",
    financialYearMonth: "January",
    financialYearDay: "1",
  });

  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Briefcase className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Company Information</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Company Details Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-start mb-4">
              <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
                <Briefcase style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
              </div>
              <div className="flex-grow-1">
                <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Company details</h5>
                <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666' }}>Provide the name and site of the main office.</p>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="company" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Company <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="organizationType" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Organization Type <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="organizationType"
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleChange}
                  required
                >
                  <option value="Small Business">Small Business</option>
                  <option value="Medium Enterprise">Medium Enterprise</option>
                  <option value="Large Enterprise">Large Enterprise</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="country" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Country <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="address" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Address <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="aptSuite" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Apt./Suite
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="aptSuite"
                  name="aptSuite"
                  value={formData.aptSuite}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="city" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  City <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="state" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  State <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="postalCode" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Postal Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Timezone & Currency Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-start mb-3">
              <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '8px' }}>
                <Clock style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
              </div>
              <div className="flex-grow-1">
                <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Timezone & Currency</h5>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Adjust the settings to fit your company's local timezone, currency, and date format.</p>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="timezone" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Timezone <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  required
                >
                  <option value="(GMT +5:30) Sri Jayawardenepura">(GMT +5:30) Sri Jayawardenepura</option>
                  <option value="(GMT +0:00) UTC">(GMT +0:00) UTC</option>
                  <option value="(GMT -5:00) Eastern Time">(GMT -5:00) Eastern Time</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="currency" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Currency Symbol <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  required
                >
                  <option value="India Rupee (INR ₹)">India Rupee (INR ₹)</option>
                  <option value="US Dollar (USD $)">US Dollar (USD $)</option>
                  <option value="Euro (EUR €)">Euro (EUR €)</option>
                  <option value="British Pound (GBP £)">British Pound (GBP £)</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="dateFormat" className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Date format <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                  id="dateFormat"
                  name="dateFormat"
                  value={formData.dateFormat}
                  onChange={handleChange}
                  required
                >
                  <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                  <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                  <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                  Financial Year begins on <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-2">
                  <select
                    className="form-select flex-grow-1"
                    id="financialYearMonth"
                    name="financialYearMonth"
                    value={formData.financialYearMonth}
                    onChange={handleChange}
                    required
                  >
                    <option value="January">January</option>
                    <option value="February">February</option>
                    <option value="March">March</option>
                    <option value="April">April</option>
                    <option value="May">May</option>
                    <option value="June">June</option>
                    <option value="July">July</option>
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                    <option value="November">November</option>
                    <option value="December">December</option>
                  </select>
                  <select
                    className="form-select"
                    style={{ borderRadius: '4px', border: '1px solid #D0D0D0', width: '80px', padding: '8px 12px', fontSize: '14px' }}
                    id="financialYearDay"
                    name="financialYearDay"
                    value={formData.financialYearDay}
                    onChange={handleChange}
                    required
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day.toString()}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Logo Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-start mb-3">
              <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '8px' }}>
                <ImageIcon style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
              </div>
              <div className="flex-grow-1">
                <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Company Logo</h5>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Upload your organization's logo to make this space your own.</p>
              </div>
            </div>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="border border-2 border-dashed p-5 text-center"
              style={{
                backgroundColor: isDragging ? '#FFF5E6' : '#F8F9FA',
                borderColor: isDragging ? '#FF8C00' : '#D0D0D0',
                minHeight: '150px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px'
              }}
            >
              <p className="text-muted mb-0" style={{ fontSize: '14px' }}>Drop your image here</p>
            </div>
            <p className="text-muted text-center mt-2 mb-0" style={{ fontSize: '12px' }}>Only (JPG, GIF, PNG) are allowed</p>
            <div className="d-flex gap-2 mt-3">
              <button type="button" className="btn btn-secondary" style={{ borderRadius: '4px', padding: '8px 16px' }}>Cancel</button>
              <button type="submit" className="btn text-white" style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '8px 16px' }}>Submit</button>
            </div>
          </div>
        </div>

        {/* Delete Company and Close Account Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-start mb-3">
              <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFE6E6', borderRadius: '8px' }}>
                <Trash2 style={{ color: '#DC3545', width: '24px', height: '24px' }} />
              </div>
              <div className="flex-grow-1">
                <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Delete Company and Close Account</h5>
                <p className="text-muted mb-2" style={{ fontSize: '14px' }}>
                  This operation will delete your company account, ALL user accounts and ALL asset data from AssetTiger. This operation is irrevocable.
                </p>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                  If you want to just delete asset data, go the 'Delete Asset Data' section below.
                </p>
              </div>
            </div>
            <button type="button" className="btn text-white" style={{ backgroundColor: '#DC3545', borderRadius: '4px', padding: '8px 16px' }}>
              Delete Company, User Accounts and ALL Data
            </button>
          </div>
        </div>

        {/* Delete Asset Data Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-start mb-3">
              <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '8px' }}>
                <Trash2 style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
              </div>
              <div className="flex-grow-1">
                <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Delete Asset Data</h5>
                <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                  You can delete data related to assets, sites and locations, categories, departments, contracts, insurances and funds. This operation is irrevocable.
                </p>
              </div>
            </div>
            <button type="button" className="btn text-white" style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '8px 16px' }}>
              Select Data
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}