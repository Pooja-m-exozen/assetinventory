"use client";

import { useState } from "react";
import { Grid, Calendar, Link2 } from "lucide-react";

export default function TableOptionsPage() {
  const [assetDepreciation, setAssetDepreciation] = useState(true);
  const [depreciationMethod, setDepreciationMethod] = useState("declining-balance");
  const [calculationFrequency, setCalculationFrequency] = useState("monthly");
  const [enableContracts, setEnableContracts] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", { assetDepreciation, depreciationMethod, calculationFrequency, enableContracts });
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Grid className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Table Options</h1>
      </div>

      {/* Introduction */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            AssetTiger lets you decide how comprehensive you want your system. Use these options to fashion your ideal asset tracking and create more reports.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Depreciation Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-start mb-4">
              <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
                <Calendar style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
              </div>
              <div className="flex-grow-1">
                <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Depreciation</h5>
                <p className="text-muted mb-4" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  Depreciation is used to expense the cost of your assets over their useful life. If you would like to track the depreciation of assets, select Yes and define your default depreciation method and calculation frequency.
                </p>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <label className="mb-0 fw-medium" style={{ fontSize: '14px', color: '#000' }}>
                      Asset Depreciation:
                    </label>
                    <div className="d-flex align-items-center gap-4">
                      <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="assetDepreciation"
                          checked={assetDepreciation}
                          onChange={() => setAssetDepreciation(true)}
                          style={{ marginRight: '6px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px', color: '#000' }}>Yes</span>
                      </label>
                      <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="assetDepreciation"
                          checked={!assetDepreciation}
                          onChange={() => setAssetDepreciation(false)}
                          style={{ marginRight: '6px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '14px', color: '#000' }}>No</span>
                      </label>
                    </div>
                  </div>

                  {assetDepreciation && (
                    <>
                      <div className="mb-3">
                        <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                          Default Depreciation Method
                        </label>
                        <p className="text-muted mb-2" style={{ fontSize: '12px', color: '#666' }}>
                          Select the default depreciation method to be used for most assets. You still have the option to override and choose another depreciation method when creating assets.
                        </p>
                        <select
                          className="form-select"
                          value={depreciationMethod}
                          onChange={(e) => setDepreciationMethod(e.target.value)}
                          style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                        >
                          <option value="straight-line">Straight Line</option>
                          <option value="declining-balance">Declining Balance</option>
                          <option value="sum-of-years">Sum of Years</option>
                          <option value="units-of-production">Units of Production</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label mb-2" style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>
                          Calculation Frequency
                        </label>
                        <select
                          className="form-select"
                          value={calculationFrequency}
                          onChange={(e) => setCalculationFrequency(e.target.value)}
                          style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '8px 12px', fontSize: '14px' }}
                        >
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annually">Annually</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contracts / Licenses Section */}
        <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
          <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-start mb-4">
              <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
                <Link2 style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
              </div>
              <div className="flex-grow-1">
                <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Contracts / Licenses</h5>
                <p className="text-muted mb-4" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                  If your assets are under a contract or certain agreement you want to consider activating this option. Software licenses can also be managed under this option.
                </p>
                
                <div className="d-flex align-items-center gap-3">
                  <label className="mb-0 fw-medium" style={{ fontSize: '14px', color: '#000' }}>
                    Enable Contracts:
                  </label>
                  <div className="d-flex align-items-center gap-4">
                    <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="enableContracts"
                        checked={enableContracts}
                        onChange={() => setEnableContracts(true)}
                        style={{ marginRight: '6px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', color: '#000' }}>Yes</span>
                    </label>
                    <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="enableContracts"
                        checked={!enableContracts}
                        onChange={() => setEnableContracts(false)}
                        style={{ marginRight: '6px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '14px', color: '#000' }}>No</span>
                    </label>
                  </div>
                </div>
              </div>
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