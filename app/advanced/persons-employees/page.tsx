"use client";

import { useState } from "react";
import { Users, Plus, Upload, Settings, Search, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";

interface PersonEmployee {
  id: number;
  name: string;
  employeeId: string;
  title: string;
  phone: string;
  email: string;
  site: string;
  location: string;
  department: string;
  notes: string;
}

export default function PersonsEmployeesPage() {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");

  const personsEmployees: PersonEmployee[] = [
    { 
      id: 1, 
      name: "Shivanya", 
      employeeId: "EFMS3295", 
      title: "Testing", 
      phone: "7338265989", 
      email: "shivanya.dn@exozen.in", 
      site: "", 
      location: "", 
      department: "IT", 
      notes: "" 
    },
    { 
      id: 2, 
      name: "Pooja", 
      employeeId: "EFMS3251", 
      title: "Testing", 
      phone: "7338265989", 
      email: "pooja.m@exozen.in", 
      site: "", 
      location: "", 
      department: "IT", 
      notes: "" 
    }
  ];

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(personsEmployees.map(person => person.id));
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

  const totalRecords = personsEmployees.length;
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  const columns = [
    "Name",
    "Employee ID",
    "Title",
    "Phone",
    "Email",
    "Site",
    "Location",
    "Department",
    "Notes",
    "Action"
  ];

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Users className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Persons/Employees</h1>
      </div>

      {/* Main Content Card */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Action Buttons */}
          <div className="d-flex gap-2 mb-4">
            <button type="button" className="btn text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '8px 16px' }}>
              <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Add New Person / Employee
            </button>
            <button type="button" className="btn btn-secondary d-flex align-items-center" style={{ borderRadius: '4px', padding: '8px 16px', backgroundColor: '#6C757D', color: '#fff', border: 'none' }}>
              <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Import Persons/Employees
            </button>
            <button type="button" className="btn btn-secondary d-flex align-items-center" style={{ borderRadius: '4px', padding: '8px 16px', backgroundColor: '#6C757D', color: '#fff', border: 'none' }}>
              <Settings style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Setup Columns
            </button>
          </div>

          {/* Description */}
          <p className="text-muted mb-4" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            Manage the persons/employees you want in the database. After you add persons/employees, you can review reports and check assets in and out.
          </p>

          {/* Search Section */}
          <div className="d-flex gap-3 mb-4">
            <div className="flex-grow-1 position-relative">
              <Search className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#666' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Name, Email or Employ"
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
              <option value="employeeId">Employee ID</option>
              <option value="title">Job Title</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
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
              <span style={{ fontSize: '14px', color: '#666' }}>Persons</span>
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

          {/* Persons/Employees Table */}
          <div className="table-responsive">
            <table className="table table-bordered" style={{ marginBottom: '0' }}>
              <thead style={{ backgroundColor: '#FFF5E6' }}>
                <tr>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Name
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Employee ID
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Title
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Phone
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Email
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Site
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Location
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Department
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    <div className="d-flex align-items-center">
                      Notes
                      <ArrowUp style={{ width: '14px', height: '14px', marginLeft: '4px', color: '#000' }} />
                    </div>
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {personsEmployees.map((person) => (
                  <tr key={person.id}>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>
                      <div className="d-flex align-items-center">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.includes(person.id)}
                          onChange={() => handleSelectRow(person.id)}
                          style={{ marginRight: '8px' }}
                        />
                        {person.name}
                      </div>
                    </td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{person.employeeId}</td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{person.title}</td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{person.phone}</td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{person.email}</td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{person.site || '-'}</td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{person.location || '-'}</td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{person.department}</td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px' }}>{person.notes || '-'}</td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px' }}>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
                          <Edit style={{ width: '14px', height: '14px', marginRight: '4px' }} />
                          Edit
                        </button>
                        <button className="btn btn-sm text-white d-flex align-items-center" style={{ backgroundColor: '#DC3545', borderRadius: '4px', padding: '4px 8px', fontSize: '12px' }}>
                          <Trash2 style={{ width: '14px', height: '14px', marginRight: '4px' }} />
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
