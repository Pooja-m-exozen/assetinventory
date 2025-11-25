"use client";

import { useState } from "react";
import { ImageIcon, Upload, Search } from "lucide-react";

interface ImageItem {
  id: number;
  url: string;
  name: string;
  assignedTo: string;
}

export default function ImageGalleryPage() {
  const [activeTab, setActiveTab] = useState("your-uploads");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const images: ImageItem[] = [
    {
      id: 1,
      url: "/api/placeholder/200/200",
      name: "Logo",
      assignedTo: "unassigned"
    }
  ];

  const filteredImages = images.filter(image => {
    if (activeFilter === "all") return true;
    if (activeFilter === "assigned-assets") return image.assignedTo === "asset";
    if (activeFilter === "assigned-inventory") return image.assignedTo === "inventory";
    if (activeFilter === "unassigned") return image.assignedTo === "unassigned";
    return true;
  });

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <ImageIcon className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
          <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Image Gallery</h1>
        </div>
        <button type="button" className="btn text-white d-flex align-items-center" style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '8px 16px' }}>
          <Upload style={{ width: '16px', height: '16px', marginRight: '8px' }} />
          Upload
        </button>
      </div>

      {/* Main Content Card */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          {/* Tabs */}
          <div className="d-flex gap-3 mb-4" style={{ borderBottom: '2px solid #E0E0E0' }}>
            <button
              type="button"
              onClick={() => setActiveTab("your-uploads")}
              className="btn"
              style={{
                border: 'none',
                borderBottom: activeTab === "your-uploads" ? '3px solid #FF8C00' : '3px solid transparent',
                borderRadius: '0',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: activeTab === "your-uploads" ? '#FF8C00' : '#666',
                fontWeight: activeTab === "your-uploads" ? '600' : 'normal',
                fontSize: '14px'
              }}
            >
              Your Uploads
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("stock-images")}
              className="btn"
              style={{
                border: 'none',
                borderBottom: activeTab === "stock-images" ? '3px solid #FF8C00' : '3px solid transparent',
                borderRadius: '0',
                padding: '8px 16px',
                backgroundColor: 'transparent',
                color: activeTab === "stock-images" ? '#FF8C00' : '#666',
                fontWeight: activeTab === "stock-images" ? '600' : 'normal',
                fontSize: '14px'
              }}
            >
              Stock Images
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="flex-grow-1 position-relative">
              <Search className="position-absolute" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#666' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
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
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: activeFilter === "all" ? '#FF8C00' : '#FFFFFF',
                color: activeFilter === "all" ? '#FFFFFF' : '#000',
                border: '1px solid #D0D0D0',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '14px'
              }}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: activeFilter === "assigned-assets" ? '#FF8C00' : '#FFFFFF',
                color: activeFilter === "assigned-assets" ? '#FFFFFF' : '#000',
                border: '1px solid #D0D0D0',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '14px'
              }}
              onClick={() => setActiveFilter("assigned-assets")}
            >
              Assigned to Assets
            </button>
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: activeFilter === "assigned-inventory" ? '#FF8C00' : '#FFFFFF',
                color: activeFilter === "assigned-inventory" ? '#FFFFFF' : '#000',
                border: '1px solid #D0D0D0',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '14px'
              }}
              onClick={() => setActiveFilter("assigned-inventory")}
            >
              Assigned to Inventory
            </button>
            <button
              type="button"
              className="btn"
              style={{
                backgroundColor: activeFilter === "unassigned" ? '#FF8C00' : '#FFFFFF',
                color: activeFilter === "unassigned" ? '#FFFFFF' : '#000',
                border: '1px solid #D0D0D0',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '14px'
              }}
              onClick={() => setActiveFilter("unassigned")}
            >
              unassigned
            </button>
          </div>

          {/* Image Grid */}
          {filteredImages.length === 0 ? (
            <div className="text-center py-5">
              <p style={{ fontSize: '16px', color: '#666' }}>No images found.</p>
            </div>
          ) : (
            <div className="row g-3">
              {filteredImages.map((image) => (
                <div key={image.id} className="col-md-2 col-sm-4 col-6">
                  <div
                    className="position-relative"
                    style={{
                      aspectRatio: '1',
                      border: '1px solid #E0E0E0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      backgroundColor: '#F5F5F5'
                    }}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {!image.url || image.url.includes('placeholder') && (
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#F5F5F5'
                        }}
                      >
                        <ImageIcon style={{ width: '48px', height: '48px', color: '#CCC' }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
