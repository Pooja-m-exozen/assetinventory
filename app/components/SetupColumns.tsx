"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SetupColumnsProps {
  selectedColumns: Record<string, boolean>;
  onColumnsChange: (columns: Record<string, boolean>) => void;
  onBack?: () => void;
}

const columnCategories = {
  "Asset fields": [
    { key: "assetPhoto", label: "Asset Photo", defaultChecked: true },
    { key: "assetTagId", label: "Asset Tag ID", defaultChecked: true },
    { key: "brand", label: "Brand", defaultChecked: false },
    { key: "cost", label: "Cost", defaultChecked: false },
    { key: "createdBy", label: "Created by", defaultChecked: false },
    { key: "dateCreated", label: "Date Created", defaultChecked: false },
    { key: "description", label: "Description", defaultChecked: true },
    { key: "model", label: "Model", defaultChecked: false },
    { key: "purchaseDate", label: "Purchase Date", defaultChecked: true },
    { key: "purchasedFrom", label: "Purchased from", defaultChecked: false },
    { key: "relation", label: "Relation", defaultChecked: false },
    { key: "reservation", label: "Reservation", defaultChecked: false },
    { key: "serialNo", label: "Serial No", defaultChecked: true },
    { key: "transactAsWhole", label: "Transact as a whole", defaultChecked: false },
  ],
  "Asset Custom fields": [
    { key: "capacity", label: "Capacity", defaultChecked: true },
  ],
  "Depreciation fields": [
    { key: "assetLife", label: "Asset Life (months)", defaultChecked: false },
    { key: "bookValue", label: "Book Value", defaultChecked: false },
    { key: "dateAcquired", label: "Date Acquired", defaultChecked: false },
    { key: "depreciableAsset", label: "Depreciable Asset", defaultChecked: false },
    { key: "depreciableCost", label: "Depreciable Cost", defaultChecked: false },
    { key: "depreciationMethod", label: "Depreciation Method", defaultChecked: false },
    { key: "salvageValue", label: "Salvage Value", defaultChecked: false },
  ],
  "Linking fields": [
    { key: "category", label: "Category", defaultChecked: false },
    { key: "department", label: "Department", defaultChecked: false },
    { key: "location", label: "Location", defaultChecked: false },
    { key: "site", label: "Site", defaultChecked: false },
  ],
  "Event fields": [
    { key: "assignedTo", label: "Assigned to", defaultChecked: false },
    { key: "eventDate", label: "Event Date", defaultChecked: false },
    { key: "eventDueDate", label: "Event Due Date", defaultChecked: false },
    { key: "eventNotes", label: "Event Notes", defaultChecked: false },
    { key: "leasedTo", label: "Leased to", defaultChecked: false },
    { key: "status", label: "Status", defaultChecked: true },
  ],
};

export default function SetupColumns({
  selectedColumns,
  onColumnsChange,
  onBack,
}: SetupColumnsProps) {
  const [localColumns, setLocalColumns] = useState(selectedColumns);
  const router = useRouter();

  useEffect(() => {
    setLocalColumns(selectedColumns);
  }, [selectedColumns]);

  const handleCheckboxChange = (key: string) => {
    setLocalColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onColumnsChange(localColumns);
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="p-6">
        {/* Title Row */}
        <div className="mb-4">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-50" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '16px' }}>
            List of Assets
          </h1>
        </div>

        {/* Section Header */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
            &gt; Select Table Columns
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
            Check the columns you want to see in the table.
          </p>
        </div>

        {/* Column Categories */}
        <div className="space-y-4">
          {Object.entries(columnCategories).map(([category, columns]) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                {category}:
              </h3>
              <div className="space-y-1 ml-4">
                {columns.map((column) => (
                  <label
                    key={column.key}
                    className="flex items-center gap-2 cursor-pointer py-1"
                  >
                    <input
                      type="checkbox"
                      checked={localColumns[column.key] || false}
                      onChange={() => handleCheckboxChange(column.key)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
                      {column.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onBack || (() => router.back())} className="text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white text-sm" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', fontSize: '14px' }}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

