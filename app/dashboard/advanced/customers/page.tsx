"use client";

import { useState } from "react";
import { Users, Plus, Upload, Settings, Search } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export default function CustomersPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");

  const customers: Customer[] = [];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(customers.map(customer => customer.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const totalRecords = customers.length;
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Users className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Customers</h1>
      </div>

      {/* Main Content Card */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Action Buttons */}
          <div className="d-flex gap-2 mb-4 justify-content-end">
            <button type="button" className="btn text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '8px 16px' }}>
              <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Add New Customers
            </button>
          </div>
          <div className="d-flex gap-2 mb-4 justify-content-end">
            <button type="button" className="btn btn-secondary d-flex align-items-center" style={{ borderRadius: '4px', padding: '8px 16px', backgroundColor: '#6C757D', color: '#fff', border: 'none' }}>
              <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Import Customers
            </button>
            <button type="button" className="btn btn-secondary d-flex align-items-center" style={{ borderRadius: '4px', padding: '8px 16px', backgroundColor: '#6C757D', color: '#fff', border: 'none' }}>
              <Settings style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Setup Columns
            </button>
          </div>

          {/* Section Title & Description */}
          <div className="d-flex align-items-start mb-4">
            <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
              <Users style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>List of Customers</h5>
              <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Manage your customers. After you add customers, you can lease assets to them.
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="d-flex gap-3 mb-4">
            <div className="flex-grow-1 position-relative">
              <Search className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#666' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Name, Email or Compar"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  paddingLeft: '36px', 
                  borderRadius: '4px', 
                  border: '1px solid #D0D0D0', 
                  fontSize: '14px',
                  height: '38px'
                }}
              />
            </div>
            <select
              className="form-select"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              style={{ 
                width: 'auto', 
                minWidth: '200px',
                borderRadius: '4px', 
                border: '1px solid #D0D0D0', 
                padding: '8px 12px', 
                fontSize: '14px',
                height: '38px'
              }}
            >
              <option value="all">Search in fields</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="company">Company</option>
            </select>
          </div>

          {/* Empty State */}
          {customers.length === 0 && (
            <div className="text-center py-5">
              <p style={{ fontSize: '16px', color: '#28A745', fontWeight: '500' }}>No Customer found.</p>
            </div>
          )}

          {/* Table - Only show if there are customers */}
          {customers.length > 0 && (
            <>
              {/* Table Controls Top */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-2">
                  <select 
                    className="form-select" 
                    style={{ width: 'auto', borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px', fontSize: '14px' }}
                    value={recordsPerPage}
                    onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  <span style={{ fontSize: '14px', color: '#666' }}>Customers</span>
                </div>
              </div>

              {/* Customers Table */}
              <div className="table-responsive">
                <table className="table table-bordered" style={{ marginBottom: '0' }}>
                  <thead style={{ backgroundColor: '#FFF5E6' }}>
                    <tr>
                      <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                        Name
                      </th>
                      <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                        Email
                      </th>
                      <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                        Phone
                      </th>
                      <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                        Company
                      </th>
                      <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id}>
                        <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>
                          <div className="d-flex align-items-center">
                            <input 
                              type="checkbox" 
                              checked={selectedRows.includes(customer.id)}
                              onChange={() => handleSelectRow(customer.id)}
                              style={{ marginRight: '8px' }}
                            />
                            {customer.name}
                          </div>
                        </td>
                        <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{customer.email}</td>
                        <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{customer.phone}</td>
                        <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{customer.company}</td>
                        <td style={{ border: '1px solid #D0D0D0', padding: '12px' }}>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
                              Edit
                            </button>
                            <button className="btn btn-sm text-white d-flex align-items-center" style={{ backgroundColor: '#DC3545', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Summary */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Showing {startRecord} to {endRecord} of {totalRecords} records
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

