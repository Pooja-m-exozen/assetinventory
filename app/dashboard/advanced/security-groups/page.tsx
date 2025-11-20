"use client";

import { useState } from "react";
import { Shield, Plus, Edit, Copy, Trash2 } from "lucide-react";

interface SecurityGroup {
  id: number;
  name: string;
  description: string;
  activeUsers: number;
}

export default function SecurityGroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState<number>(3); // Viewer Group selected by default

  const securityGroups: SecurityGroup[] = [
    {
      id: 1,
      name: "Admin. Group",
      description: "Administrative group has complete rights.",
      activeUsers: 0
    },
    {
      id: 2,
      name: "Manager Group",
      description: "Manager group has most rights except admin. rights.",
      activeUsers: 0
    },
    {
      id: 3,
      name: "Viewer Group",
      description: "Viewer group has viewing rights only.",
      activeUsers: 0
    }
  ];

  const handleEditGroup = () => {
    if (selectedGroup) {
      console.log("Edit group:", selectedGroup);
      // Add edit functionality here
    }
  };

  const handleDuplicateGroup = () => {
    if (selectedGroup) {
      console.log("Duplicate group:", selectedGroup);
      // Add duplicate functionality here
    }
  };

  const handleDeleteGroup = () => {
    if (selectedGroup) {
      console.log("Delete group:", selectedGroup);
      // Add delete functionality here
    }
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Shield className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
          <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Security Groups</h1>
        </div>
        <button type="button" className="btn text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '8px 16px' }}>
          <Plus style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          Create a New Group
        </button>
      </div>

      {/* Main Content Card */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Description */}
          <p className="text-muted mb-4" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
            Decide which parts of AssetTiger you want accessible to your users by assigning them to Security Groups. You can use and edit the predetermined groups or you can create your own custom security groups.
          </p>

          {/* Security Groups Table */}
          <div className="table-responsive">
            <table className="table table-bordered" style={{ marginBottom: '0' }}>
              <thead style={{ backgroundColor: '#FFF5E6' }}>
                <tr>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00', width: '50px' }}></th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    Group Name
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    Group Description
                  </th>
                  <th style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '600', backgroundColor: '#FF8C00' }}>
                    Active Users
                  </th>
                </tr>
              </thead>
              <tbody>
                {securityGroups.map((group) => (
                  <tr key={group.id}>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', textAlign: 'center' }}>
                      <input
                        type="radio"
                        name="securityGroup"
                        checked={selectedGroup === group.id}
                        onChange={() => setSelectedGroup(group.id)}
                        style={{ cursor: 'pointer' }}
                      />
                    </td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', fontWeight: '500' }}>
                      {group.name}
                    </td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', color: '#666' }}>
                      {group.description}
                    </td>
                    <td style={{ border: '1px solid #D0D0D0', padding: '12px', fontSize: '14px', color: '#666' }}>
                      {group.activeUsers} User{group.activeUsers !== 1 ? 's' : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-2 mt-4">
            <button 
              type="button" 
              className="btn d-flex align-items-center" 
              onClick={handleEditGroup}
              disabled={!selectedGroup}
              style={{ 
                backgroundColor: '#FFC107', 
                color: '#000', 
                borderRadius: '4px', 
                padding: '8px 16px',
                border: 'none',
                fontWeight: '500'
              }}
            >
              <Edit style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Edit Group
            </button>
            <button 
              type="button" 
              className="btn d-flex align-items-center" 
              onClick={handleDuplicateGroup}
              disabled={!selectedGroup}
              style={{ 
                backgroundColor: '#000', 
                color: '#fff', 
                borderRadius: '4px', 
                padding: '8px 16px',
                border: 'none',
                fontWeight: '500'
              }}
            >
              <Copy style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Duplicate Group
            </button>
            <button 
              type="button" 
              className="btn d-flex align-items-center" 
              onClick={handleDeleteGroup}
              disabled={!selectedGroup}
              style={{ 
                backgroundColor: '#DC3545', 
                color: '#fff', 
                borderRadius: '4px', 
                padding: '8px 16px',
                border: 'none',
                fontWeight: '500'
              }}
            >
              <Trash2 style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              Delete Group
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

