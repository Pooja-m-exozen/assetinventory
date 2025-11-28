"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, UserCheck, Send, ThumbsDown, Wrench, Link2, Trash2, Heart, Loader2, AlertCircle } from "lucide-react";
import {
  getEvents,
  updateEvent,
  type Event as EventType,
} from "@/lib/api/events";

// Icon mapping for events
const eventIcons: { [key: string]: any } = {
  "check-out": UserCheck,
  "lease": Send,
  "lost-found": ThumbsDown,
  "repair": Wrench,
  "broken": Link2,
  "dispose": Trash2,
  "donate": Heart,
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
        if (!token) {
          setError("Please login to access this page");
          setEvents([]);
          setLoading(false);
          return;
        }
      }

      const response = await getEvents();
      setEvents(response.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleEventToggle = async (id: string, enabled: boolean) => {
    try {
      setUpdatingIds(prev => new Set(prev).add(id));
      setError(null);

      const updatedEvent = await updateEvent(id, { enabled });
      
      // Update the event in the local state
      setEvents(events.map((event) => 
        event.id === id ? updatedEvent.data : event
      ));
    } catch (err) {
      console.error("Error updating event:", err);
      setError(err instanceof Error ? err.message : "Failed to update event");
      // Revert the change on error
      await fetchEvents();
    } finally {
      setUpdatingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div className="mb-6 flex items-center">
        <Calendar className="mr-2 h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 flex items-center text-red-800">
          <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Asset-related Events Section */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <div className="mb-4 flex items-start">
            <div className="mr-3 rounded bg-orange-50 p-3">
              <Calendar className="h-6 w-6 text-orange-500" />
            </div>
            <div className="grow">
              <h5 className="mb-2 text-lg font-semibold text-gray-900">Asset-related Events</h5>
              <p className="text-sm text-gray-600 leading-relaxed">
                Do you want to register these events for the assets?
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : events.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-lg">No events found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const Icon = eventIcons[event.id] || Calendar;
                const isUpdating = updatingIds.has(event.id);
                
                return (
                  <div key={event.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="mt-1 rounded bg-gray-50 p-2">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>

                      {/* Content */}
                      <div className="grow">
                        <div className="mb-3 flex items-center gap-3 flex-wrap">
                          <h6 className="text-base font-semibold text-gray-900">
                            {event.name}:
                          </h6>

                          {/* Enable/Disable Radio Buttons */}
                          <div className="flex items-center gap-4">
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`enabled-${event.id}`}
                                checked={event.enabled}
                                onChange={() => handleEventToggle(event.id, true)}
                                disabled={isUpdating}
                                className="mr-2 cursor-pointer disabled:opacity-50"
                              />
                              <span className="text-sm text-gray-900">Yes</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                              <input
                                type="radio"
                                name={`enabled-${event.id}`}
                                checked={!event.enabled}
                                onChange={() => handleEventToggle(event.id, false)}
                                disabled={isUpdating}
                                className="mr-2 cursor-pointer disabled:opacity-50"
                              />
                              <span className="text-sm text-gray-900">No</span>
                            </label>
                            {isUpdating && (
                              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mb-3 flex gap-2 flex-wrap">
                          {event.setupButton && (
                            <button
                              type="button"
                              className="rounded bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
                            >
                              {event.setupButton}
                            </button>
                          )}
                          {event.customizeButton && (
                            <button
                              type="button"
                              className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                            >
                              {event.customizeButton}
                            </button>
                          )}
                          {event.secondarySetupButton && (
                            <button
                              type="button"
                              className="rounded bg-orange-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-600"
                            >
                              {event.secondarySetupButton}
                            </button>
                          )}
                          {event.secondaryCustomizeButton && (
                            <button
                              type="button"
                              className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                            >
                              {event.secondaryCustomizeButton}
                            </button>
                          )}
                        </div>

                        {/* Description */}
                        {event.description && (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
