"use client";

import { useState } from "react";
import { Grid3x3, List, Plus, Upload, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";

interface Department {
  id: number;
  department: string;
}

export default function DepartmentsPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const departments: Department[] = [
    { id: 1, department: "Asset" },
    { id: 2, department: "Computer Equipment" },
    { id: 3, department: "IT" }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(departments.map(dept => dept.id));
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

  const totalRecords = departments.length;
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Grid3x3 className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Departments</h1>
      </div>

      {/* List of Departments Section */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="d-flex align-items-start mb-4">
            <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
              <List style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>List of Departments</h5>
              <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Add departments that own or house the particular assets. Make them as broad or as specific as you want. Departments can be 'Accounting', 'Marketing', or 'Executive'. Customize to your particular need.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mb-4">
            <button type="button" className="btn text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '8px 16px' }}>
              <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Add New Department
            </button>
            <button type="button" className="btn btn-secondary d-flex align-items-center" style={{ borderRadius: '4px', padding: '8px 16px' }}>
              <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Import Departments
            </button>
          </div>

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
              <span style={{ fontSize: '14px', color: '#666' }}>departments</span>
            </div>
            <div className="d-flex align-items-center gap-1">
              <button 
                className="btn btn-sm" 
                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              <button 
                className="btn btn-sm text-white" 
                style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '4px 12px', minWidth: '32px' }}
              >
                {currentPage}
              </button>
              <button 
                className="btn btn-sm" 
                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px' }}
                disabled={currentPage * recordsPerPage >= totalRecords}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>

          {/* Departments Table */}
          <div className="table-responsive">
            <table className="table table-bordered" style={{ marginBottom: '0' }}>
              <thead style={{ backgroundColor: '#FFF5E6' }}>
                <tr>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Department
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600' }}>Edit</th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600' }}>Delete</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr key={department.id}>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>
                      <div className="d-flex align-items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.includes(department.id)}
                          onChange={() => handleSelectRow(department.id)}
                          style={{ marginRight: '8px' }}
                        />
                        {department.department}
                      </div>
                    </td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px' }}>
                      <button className="btn btn-sm text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
                        <Edit style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                        Edit
                      </button>
                    </td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px' }}>
                      <button className="btn btn-sm text-white d-flex align-items-center" style={{ backgroundColor: '#DC3545', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
                        <Trash2 style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                        Delete
                      </button>
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
            <div className="d-flex align-items-center gap-1">
              <button 
                className="btn btn-sm" 
                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                <ChevronLeft style={{ width: '16px', height: '16px' }} />
              </button>
              <button 
                className="btn btn-sm text-white" 
                style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '4px 12px', minWidth: '32px' }}
              >
                {currentPage}
              </button>
              <button 
                className="btn btn-sm" 
                style={{ borderRadius: '4px', border: '1px solid #D0D0D0', padding: '4px 8px' }}
                disabled={currentPage * recordsPerPage >= totalRecords}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                <ChevronRight style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
