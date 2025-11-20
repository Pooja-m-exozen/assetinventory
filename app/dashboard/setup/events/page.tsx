"use client";

import { useState } from "react";
import { Calendar, UserCheck, Send, ThumbsDown, Wrench, Link2, Trash2, Heart } from "lucide-react";

interface Event {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
  description: string;
  setupButton: string;
  customizeButton: string;
  secondarySetupButton?: string;
  secondaryCustomizeButton?: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "check-out",
      name: "Check-out assets",
      icon: UserCheck,
      enabled: true,
      description: "Assets are 'checked out' or 'assigned to' individuals. Enter individuals in 'Advanced > Persons/Employees' table.",
      setupButton: "Setup 'Check out'",
      customizeButton: "Customize Form",
      secondarySetupButton: "Setup 'Check in'",
      secondaryCustomizeButton: "Customize Form",
    },
    {
      id: "lease",
      name: "Lease assets",
      icon: Send,
      enabled: true,
      description: "Assets are 'leased' or 'rented/loaned' to customers. Maintain a list of customers in the 'Advanced > Customers' table.",
      setupButton: "Setup 'Lease'",
      customizeButton: "Customize Form",
      secondarySetupButton: "Setup 'Lease return'",
      secondaryCustomizeButton: "Customize Form",
    },
    {
      id: "lost-found",
      name: "Lost/Found assets",
      icon: ThumbsDown,
      enabled: true,
      description: "",
      setupButton: "Setup 'Lost / Missing'",
      customizeButton: "Customize Form",
      secondarySetupButton: "Setup 'Found'",
      secondaryCustomizeButton: "Customize Form",
    },
    {
      id: "repair",
      name: "Repair assets",
      icon: Wrench,
      enabled: true,
      description: "",
      setupButton: "Setup 'Repair'",
      customizeButton: "Customize Form",
    },
    {
      id: "broken",
      name: "Broken assets",
      icon: Link2,
      enabled: true,
      description: "",
      setupButton: "Setup 'Broken'",
      customizeButton: "Customize Form",
    },
    {
      id: "dispose",
      name: "Dispose assets",
      icon: Trash2,
      enabled: true,
      description: "",
      setupButton: "Setup 'Dispose'",
      customizeButton: "Customize Form",
    },
    {
      id: "donate",
      name: "Donate assets",
      icon: Heart,
      enabled: true,
      description: "",
      setupButton: "Setup 'Donate'",
      customizeButton: "Customize Form",
    },
  ]);

  const handleEventToggle = (id: string, enabled: boolean) => {
    setEvents(events.map((event) => (event.id === id ? { ...event, enabled } : event)));
  };

  return (
    <div className="container-fluid p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <Calendar className="me-2" style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
        <h1 className="mb-0 fw-bold" style={{ fontSize: '24px', color: '#000' }}>Events</h1>
      </div>

      {/* Asset-related Events Section */}
      <div className="card mb-4" style={{ border: '1px solid #E0E0E0', borderRadius: '4px', boxShadow: 'none' }}>
        <div className="card-body p-4" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="d-flex align-items-start mb-4">
            <div className="me-3" style={{ padding: '12px', backgroundColor: '#FFF5E6', borderRadius: '4px' }}>
              <Calendar style={{ color: '#FF8C00', width: '24px', height: '24px' }} />
            </div>
            <div className="flex-grow-1">
              <h5 className="card-title mb-2 fw-semibold" style={{ fontSize: '18px', color: '#000' }}>Asset-related Events</h5>
              <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                Do you want to register these events for the assets?
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {events.map((event) => {
              const Icon = event.icon;
              return (
                <div key={event.id} className="border-bottom pb-4 mb-4" style={{ borderBottom: '1px solid #E0E0E0' }}>
                  <div className="d-flex align-items-start gap-3">
                    {/* Icon */}
                    <div className="mt-1" style={{ padding: '8px', backgroundColor: '#F8F9FA', borderRadius: '4px' }}>
                      <Icon style={{ color: '#666', width: '20px', height: '20px' }} />
                    </div>

                    {/* Content */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                        <h6 className="mb-0 fw-semibold" style={{ fontSize: '16px', color: '#000' }}>
                          {event.name}:
                        </h6>

                        {/* Enable/Disable Radio Buttons */}
                        <div className="d-flex align-items-center gap-4">
                          <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name={`enabled-${event.id}`}
                              checked={event.enabled}
                              onChange={() => handleEventToggle(event.id, true)}
                              style={{ marginRight: '6px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#000' }}>Yes</span>
                          </label>
                          <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name={`enabled-${event.id}`}
                              checked={!event.enabled}
                              onChange={() => handleEventToggle(event.id, false)}
                              style={{ marginRight: '6px', cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '14px', color: '#000' }}>No</span>
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="d-flex gap-2 mb-3 flex-wrap">
                        <button
                          type="button"
                          className="btn text-white"
                          style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '6px 12px', fontSize: '14px' }}
                        >
                          {event.setupButton}
                        </button>
                        <button
                          type="button"
                          className="btn text-white"
                          style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '6px 12px', fontSize: '14px' }}
                        >
                          {event.customizeButton}
                        </button>
                        {event.secondarySetupButton && (
                          <>
                            <button
                              type="button"
                              className="btn text-white"
                              style={{ backgroundColor: '#FF8C00', borderRadius: '4px', padding: '6px 12px', fontSize: '14px' }}
                            >
                              {event.secondarySetupButton}
                            </button>
                            <button
                              type="button"
                              className="btn text-white"
                              style={{ backgroundColor: '#28A745', borderRadius: '4px', padding: '6px 12px', fontSize: '14px' }}
                            >
                              {event.secondaryCustomizeButton}
                            </button>
                          </>
                        )}
                      </div>

                      {/* Description */}
                      {event.description && (
                        <p className="text-muted mb-0" style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
