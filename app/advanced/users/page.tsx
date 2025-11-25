"use client";

import { useState } from "react";
import { User, Plus, List } from "lucide-react";

interface UserData {
  id: number;
  name: string;
  groupName: string;
  jobTitle: string;
  email: string;
  phone: string;
  role: string;
}

export default function UsersPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const users: UserData[] = [
    {
      id: 1,
      name: "Shivanya DN",
      groupName: "",
      jobTitle: "",
      email: "shivanya.dn@exozen.in",
      phone: "",
      role: "Administrator"
    }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(users.map(user => user.id));
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

  const totalRecords = users.length;
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <User className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
          <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Users</h1>
        </div>
        <button type="button" className="btn text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '8px 16px' }}>
          <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          Add New User
        </button>
      </div>

      {/* Main Content Card */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Section Title & Description */}
          <div className="d-flex align-items-start mb-4">
            <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
              <List style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>List of Users</h5>
              <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Create new users who will be able to access your AssetTiger system. You can decide each user's privileges and what they can and can't do within your account.
              </p>
            </div>
          </div>

          {/* Table Controls Top */}
          {users.length > 0 && (
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
                <span style={{ fontSize: '14px', color: '#666' }}>users</span>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="table-responsive">
            <table className="table table-bordered" style={{ marginBottom: '0' }}>
              <thead style={{ backgroundColor: '#FFF5E6' }}>
                <tr>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    Name
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    Group Name
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    Job title
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    Email
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    Phone
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ border: '1px solid #D0D0D0', padding: '40px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>
                        <div className="d-flex align-items-center">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.includes(user.id)}
                            onChange={() => handleSelectRow(user.id)}
                            style={{ marginRight: '8px' }}
                          />
                          <User style={{ width: '16px', height: '16px', marginRight: '8px', color: '#666' }} />
                          <span style={{ marginRight: '8px' }}>{user.name}</span>
                          {user.role && (
                            <span 
                              className="badge"
                              style={{ 
                                backgroundColor: '#FFC107', 
                                color: '#000', 
                                fontSize: '12px', 
                                padding: '4px 8px', 
                                borderRadius: '4px',
                                fontWeight: '500'
                              }}
                            >
                              {user.role}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', color: '#666' }}>
                        {user.groupName || '-'}
                      </td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', color: '#666' }}>
                        {user.jobTitle || '-'}
                      </td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>
                        {user.email}
                      </td>
                      <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', color: '#666' }}>
                        {user.phone || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Summary */}
          {users.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <div style={{ fontSize: '14px', color: '#666' }}>
                Showing {startRecord} to {endRecord} of {totalRecords} records
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
