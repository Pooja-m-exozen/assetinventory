# Options API Documentation

## Overview
This document describes the backend API endpoints required for the Options management page (`/setup/options`). Options settings control various system behaviors like automatic asset tagging and reminder email preferences.

## Base URL
```
/api/v1/options
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### OptionsSettings Model
```typescript
interface OptionsSettings {
  automaticAssetTags: boolean;          // Whether to automatically assign asset tags
  checkInReminderEmail: boolean;        // Whether to send check-in reminder emails
  leaseReturnReminderEmail: boolean;    // Whether to send lease return reminder emails
  updatedAt?: string;                   // ISO 8601 timestamp
  updatedBy?: number | string;           // User ID who last updated the record
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

### 1. Get Options Settings

**Endpoint:** `GET /api/v1/options/settings`

**Description:** Retrieve current options settings including automatic asset tags and reminder email preferences.

**Request Example:**
```http
GET /api/v1/options/settings
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "automaticAssetTags": false,
    "checkInReminderEmail": true,
    "leaseReturnReminderEmail": true,
    "updatedAt": "2024-01-15T10:30:00Z",
    "updatedBy": 1
  }
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

// 404 Not Found (if settings haven't been set yet)
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Options settings not found"
  }
}
```

**Note:** If options settings don't exist, the backend should return default values:
- `automaticAssetTags`: `false`
- `checkInReminderEmail`: `false`
- `leaseReturnReminderEmail`: `false`

---

### 2. Update Options Settings

**Endpoint:** `PUT /api/v1/options/settings`

**Description:** Update options settings including automatic asset tags and reminder email preferences.

**Request Body:**
```json
{
  "automaticAssetTags": true,           // Optional, boolean
  "checkInReminderEmail": false,        // Optional, boolean
  "leaseReturnReminderEmail": true      // Optional, boolean
}
```

**Request Example:**
```http
PUT /api/v1/options/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "automaticAssetTags": true,
  "checkInReminderEmail": false,
  "leaseReturnReminderEmail": true
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "automaticAssetTags": true,
    "checkInReminderEmail": false,
    "leaseReturnReminderEmail": true,
    "updatedAt": "2024-01-20T11:00:00Z",
    "updatedBy": 1
  }
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
      "automaticAssetTags": "automaticAssetTags must be a boolean value",
      "checkInReminderEmail": "checkInReminderEmail must be a boolean value",
      "leaseReturnReminderEmail": "leaseReturnReminderEmail must be a boolean value"
    }
  }
}
```

---

## Validation Rules

### Automatic Asset Tags
- Boolean value (`true` or `false`)
- When enabled, asset tags are automatically assigned when:
  - Creating a new asset
  - Duplicating an existing asset
- When disabled, users must manually assign asset tags

### Check-in Reminder Email
- Boolean value (`true` or `false`)
- When enabled, system sends reminder emails for:
  - Assets that are checked out and approaching due date
  - Overdue check-ins
- Email frequency and timing should be configurable (separate setting)

### Lease Return Reminder Email
- Boolean value (`true` or `false`)
- When enabled, system sends reminder emails for:
  - Leased assets approaching return date
  - Overdue lease returns
- Email frequency and timing should be configurable (separate setting)

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

### Example 1: Get and update options settings

```javascript
// 1. Get current settings
const response = await getOptionsSettings();
console.log(response.data);

// 2. Update settings
await updateOptionsSettings({
  automaticAssetTags: true,
  checkInReminderEmail: false,
  leaseReturnReminderEmail: true
});
```

### Example 2: Enable automatic asset tags only

```javascript
await updateOptionsSettings({
  automaticAssetTags: true
});
```

### Example 3: Disable all reminder emails

```javascript
await updateOptionsSettings({
  checkInReminderEmail: false,
  leaseReturnReminderEmail: false
});
```

---

## Notes

1. **Default Values:**
   - All options default to `false` if not set
   - Backend should return defaults when settings don't exist (404)

2. **Partial Updates:**
   - The API supports partial updates
   - Only provided fields will be updated
   - Other fields will remain unchanged

3. **System-wide Impact:**
   - Changes to options settings affect the entire system
   - Automatic asset tags affect asset creation workflow
   - Reminder email settings affect email notification system

4. **User-Specific vs System-wide:**
   - Options can be either user-specific or system-wide
   - If user-specific, each user can have their own preferences
   - If system-wide, changes affect all users
   - Implementation should be consistent with system architecture

5. **Automatic Asset Tags:**
   - When enabled, system generates unique asset tags automatically
   - Tag format should be configurable (separate setting)
   - Tags should be unique across the system

6. **Reminder Emails:**
   - Email settings control whether reminders are sent
   - Email content, timing, and frequency are separate configurations
   - Users should be able to opt-out even if system-wide setting is enabled

7. **Audit Trail:**
   - `updatedAt` and `updatedBy` fields track when and who made changes
   - Useful for auditing and troubleshooting

