# Events API Documentation

## Overview
This document describes the backend API endpoints required for the Events management page (`/setup/events`). Events are asset-related event types that can be enabled or disabled for tracking purposes.

## Base URL
```
/api/v1/events
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Event Model
```typescript
interface Event {
  id: string;                        // Unique identifier (e.g., "check-out", "lease", "repair")
  name: string;                      // Event name (e.g., "Check-out assets", "Lease assets")
  enabled: boolean;                  // Whether the event is enabled (default: true)
  description?: string;               // Event description (optional)
  setupButton?: string;              // Setup button label (optional, e.g., "Setup 'Check out'")
  customizeButton?: string;          // Customize button label (optional, e.g., "Customize Form")
  secondarySetupButton?: string;     // Secondary setup button label (optional)
  secondaryCustomizeButton?: string; // Secondary customize button label (optional)
  createdAt?: string;                // ISO 8601 timestamp
  updatedAt?: string;                // ISO 8601 timestamp
  createdBy?: number | string;       // User ID who created the record
  updatedBy?: number | string;       // User ID who last updated the record
}
```

### Error Response
```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

---

## API Endpoints

### 1. Get All Events

**Endpoint:** `GET /api/v1/events`

**Description:** Retrieve all available asset-related events.

**Request Example:**
```http
GET /api/v1/events
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": "check-out",
      "name": "Check-out assets",
      "enabled": true,
      "description": "Assets are 'checked out' or 'assigned to' individuals. Enter individuals in 'Advanced > Persons/Employees' table.",
      "setupButton": "Setup 'Check out'",
      "customizeButton": "Customize Form",
      "secondarySetupButton": "Setup 'Check in'",
      "secondaryCustomizeButton": "Customize Form",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": "lease",
      "name": "Lease assets",
      "enabled": true,
      "description": "Assets are 'leased' or 'rented/loaned' to customers. Maintain a list of customers in the 'Advanced > Customers' table.",
      "setupButton": "Setup 'Lease'",
      "customizeButton": "Customize Form",
      "secondarySetupButton": "Setup 'Lease return'",
      "secondaryCustomizeButton": "Customize Form",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": "lost-found",
      "name": "Lost/Found assets",
      "enabled": true,
      "description": "",
      "setupButton": "Setup 'Lost / Missing'",
      "customizeButton": "Customize Form",
      "secondarySetupButton": "Setup 'Found'",
      "secondaryCustomizeButton": "Customize Form",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": "repair",
      "name": "Repair assets",
      "enabled": true,
      "description": "",
      "setupButton": "Setup 'Repair'",
      "customizeButton": "Customize Form",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": "broken",
      "name": "Broken assets",
      "enabled": true,
      "description": "",
      "setupButton": "Setup 'Broken'",
      "customizeButton": "Customize Form",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": "dispose",
      "name": "Dispose assets",
      "enabled": true,
      "description": "",
      "setupButton": "Setup 'Dispose'",
      "customizeButton": "Customize Form",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": "donate",
      "name": "Donate assets",
      "enabled": true,
      "description": "",
      "setupButton": "Setup 'Donate'",
      "customizeButton": "Customize Form",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "createdBy": 1,
      "updatedBy": 1
    }
  ]
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}

// 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while fetching events"
  }
}
```

---

### 2. Get Single Event

**Endpoint:** `GET /api/v1/events/:id`

**Description:** Retrieve a single event by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Event ID (e.g., "check-out", "lease") |

**Request Example:**
```http
GET /api/v1/events/check-out
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "check-out",
    "name": "Check-out assets",
    "enabled": true,
    "description": "Assets are 'checked out' or 'assigned to' individuals. Enter individuals in 'Advanced > Persons/Employees' table.",
    "setupButton": "Setup 'Check out'",
    "customizeButton": "Customize Form",
    "secondarySetupButton": "Setup 'Check in'",
    "secondaryCustomizeButton": "Customize Form",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "createdBy": 1,
    "updatedBy": 1
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Event with ID 'check-out' not found"
  }
}
```

---

### 3. Update Event

**Endpoint:** `PUT /api/v1/events/:id`

**Description:** Update an event (primarily used to enable/disable events).

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Event ID |

**Request Body:**
```json
{
  "enabled": false,              // Optional, enable/disable the event
  "description": "Updated description"  // Optional, update description
}
```

**Request Example:**
```http
PUT /api/v1/events/check-out
Authorization: Bearer <token>
Content-Type: application/json

{
  "enabled": false
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": "check-out",
    "name": "Check-out assets",
    "enabled": false,
    "description": "Assets are 'checked out' or 'assigned to' individuals. Enter individuals in 'Advanced > Persons/Employees' table.",
    "setupButton": "Setup 'Check out'",
    "customizeButton": "Customize Form",
    "secondarySetupButton": "Setup 'Check in'",
    "secondaryCustomizeButton": "Customize Form",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T11:00:00Z",
    "createdBy": 1,
    "updatedBy": 1
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Event with ID 'check-out' not found"
  }
}

// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "enabled": "Enabled must be a boolean value"
    }
  }
}
```

---

### 4. Bulk Update Events

**Endpoint:** `PUT /api/v1/events/bulk-update`

**Description:** Update multiple events at once (useful for enabling/disabling multiple events).

**Request Body:**
```json
{
  "updates": [
    {
      "id": "check-out",
      "enabled": true
    },
    {
      "id": "lease",
      "enabled": false
    }
  ]
}
```

**Request Example:**
```http
PUT /api/v1/events/bulk-update
Authorization: Bearer <token>
Content-Type: application/json

{
  "updates": [
    {
      "id": "check-out",
      "enabled": true
    },
    {
      "id": "lease",
      "enabled": false
    }
  ]
}
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": "check-out",
      "name": "Check-out assets",
      "enabled": true,
      "description": "Assets are 'checked out' or 'assigned to' individuals. Enter individuals in 'Advanced > Persons/Employees' table.",
      "setupButton": "Setup 'Check out'",
      "customizeButton": "Customize Form",
      "secondarySetupButton": "Setup 'Check in'",
      "secondaryCustomizeButton": "Customize Form",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T11:00:00Z",
      "createdBy": 1,
      "updatedBy": 1
    },
    {
      "id": "lease",
      "name": "Lease assets",
      "enabled": false,
      "description": "Assets are 'leased' or 'rented/loaned' to customers. Maintain a list of customers in the 'Advanced > Customers' table.",
      "setupButton": "Setup 'Lease'",
      "customizeButton": "Customize Form",
      "secondarySetupButton": "Setup 'Lease return'",
      "secondaryCustomizeButton": "Customize Form",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T11:00:00Z",
      "createdBy": 1,
      "updatedBy": 1
    }
  ]
}
```

**Error Responses:**
```json
// 400 Bad Request - Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "updates": "At least one update is required",
      "updates[0].id": "Event ID is required",
      "updates[0].enabled": "Enabled must be a boolean value"
    }
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Get all events and toggle one

```javascript
// 1. Get all events
const response = await getEvents();
console.log(response.data);

// 2. Disable check-out event
await updateEvent("check-out", { enabled: false });
```

### Example 2: Bulk update events

```javascript
await bulkUpdateEvents([
  { id: "check-out", enabled: true },
  { id: "lease", enabled: false },
  { id: "repair", enabled: true }
]);
```

---

## Notes

1. **Event IDs:**
   - Event IDs are predefined strings (e.g., "check-out", "lease", "repair")
   - These IDs are used as unique identifiers and should not be changed
   - Common event IDs: "check-out", "lease", "lost-found", "repair", "broken", "dispose", "donate"

2. **Event Enable/Disable:**
   - Events can be enabled or disabled to control which asset events are available in the system
   - Disabled events will not appear in asset event workflows
   - The `enabled` field is the primary field that users will toggle

3. **Event Configuration:**
   - Events are typically pre-configured in the system
   - Users can enable/disable events but may not be able to create new event types
   - Setup and customize buttons are for configuring event-specific workflows

4. **Secondary Actions:**
   - Some events have secondary actions (e.g., "Check out" has "Check in")
   - These are represented by `secondarySetupButton` and `secondaryCustomizeButton`
   - Not all events have secondary actions

5. **Event Descriptions:**
   - Descriptions provide context about what each event does
   - Descriptions can be updated but are typically set during initial configuration

6. **Default Events:**
   - The system should have default events pre-created
   - Default events should be enabled by default
   - Users can disable events they don't need

