# Dashboard API Documentation

## Overview
This document describes the backend API endpoints required for the Dashboard management page (`/setup/manage-dashboard`). The dashboard configuration controls which widgets and charts are displayed and their layout.

## Base URL
```
/api/v1/dashboard
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### DashboardWidget Model
```typescript
interface DashboardWidget {
  id: string;                        // Unique widget identifier (e.g., "number-of", "broken", "warranty")
  name: string;                     // Widget display name (e.g., "Number of Assets", "Broken")
  color: string;                    // Hex color code for widget icon (e.g., "#3B82F6")
  order?: number;                   // Display order (optional, for sorting)
}
```

### DashboardChart Model
```typescript
interface DashboardChart {
  id: string;                        // Unique chart identifier (e.g., "reservations", "asset-value-category")
  name: string;                     // Chart display name (e.g., "Reservations", "Asset Value by Category")
  type: "pie" | "bar" | "calendar" | "table";  // Chart type
  color: string;                    // Hex color code for chart icon (e.g., "#22C55E")
  size?: number;                    // Chart size multiplier: 1, 2, or 3 (optional, default: 1)
  order?: number;                   // Display order (optional, for sorting)
}
```

### DashboardConfiguration Model
```typescript
interface DashboardConfiguration {
  widgetColumns: number;             // Number of columns for widgets layout (1-6)
  chartColumns: number;              // Number of columns for charts layout (1-3)
  selectedWidgets: DashboardWidget[]; // Widgets currently displayed on dashboard
  selectedCharts: DashboardChart[];  // Charts currently displayed on dashboard
  availableWidgets: DashboardWidget[]; // Widgets available but not selected
  availableCharts: DashboardChart[];  // Charts available but not selected
  updatedAt?: string;                // ISO 8601 timestamp
  updatedBy?: number | string;        // User ID who last updated the configuration
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

### 1. Get Dashboard Configuration

**Endpoint:** `GET /api/v1/dashboard/configuration`

**Description:** Retrieve current dashboard configuration including selected widgets, charts, column layouts, and chart sizes.

**Request Example:**
```http
GET /api/v1/dashboard/configuration
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "widgetColumns": 6,
    "chartColumns": 3,
    "selectedWidgets": [
      {
        "id": "number-of",
        "name": "Number of Assets",
        "color": "#3B82F6",
        "order": 1
      },
      {
        "id": "broken",
        "name": "Broken",
        "color": "#A855F7",
        "order": 2
      },
      {
        "id": "value-of",
        "name": "Value of Assets",
        "color": "#EF4444",
        "order": 3
      },
      {
        "id": "available",
        "name": "Available Assets",
        "color": "#22C55E",
        "order": 4
      },
      {
        "id": "sold",
        "name": "Sold",
        "color": "#60A5FA",
        "order": 5
      },
      {
        "id": "checked-out",
        "name": "Checked-out",
        "color": "#F87171",
        "order": 6
      }
    ],
    "selectedCharts": [
      {
        "id": "reservations",
        "name": "Reservations",
        "type": "calendar",
        "color": "#22C55E",
        "size": 1,
        "order": 1
      },
      {
        "id": "asset-value-category-selected",
        "name": "Asset Value by Category",
        "type": "bar",
        "color": "#3B82F6",
        "size": 1,
        "order": 2
      },
      {
        "id": "alerts",
        "name": "ALERTS",
        "type": "calendar",
        "color": "#EF4444",
        "size": 1,
        "order": 3
      }
    ],
    "availableWidgets": [
      {
        "id": "warranty",
        "name": "Warranty vs...",
        "color": "#EF4444"
      },
      {
        "id": "lost-missing",
        "name": "Lost / Missing",
        "color": "#4ADE80"
      },
      {
        "id": "net-asset-value",
        "name": "Net Asset Val...",
        "color": "#14B8A6"
      },
      {
        "id": "purchases",
        "name": "Purchases in ...",
        "color": "#A855F7"
      },
      {
        "id": "under-repair",
        "name": "Under Repair",
        "color": "#F97316"
      },
      {
        "id": "disposed",
        "name": "Disposed",
        "color": "#6B7280"
      },
      {
        "id": "donated",
        "name": "Donated",
        "color": "#EAB308"
      },
      {
        "id": "leased",
        "name": "Leased",
        "color": "#FB923C"
      }
    ],
    "availableCharts": [
      {
        "id": "asset-value-category",
        "name": "Asset Value by Category",
        "type": "pie",
        "color": "#3B82F6"
      },
      {
        "id": "feeds",
        "name": "Feeds",
        "type": "table",
        "color": "#6B7280"
      },
      {
        "id": "asset-value-dept",
        "name": "Asset Value by Department",
        "type": "bar",
        "color": "#2563EB"
      }
    ],
    "updatedAt": "2024-01-20T10:30:00Z",
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

// 404 Not Found (if configuration hasn't been set yet)
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Dashboard configuration not found"
  }
}
```

**Note:** If dashboard configuration doesn't exist, the backend should return default values with predefined widgets and charts.

---

### 2. Update Dashboard Configuration

**Endpoint:** `PUT /api/v1/dashboard/configuration`

**Description:** Update dashboard configuration including selected widgets, charts, column layouts, and chart sizes.

**Request Body:**
```json
{
  "widgetColumns": 6,                // Optional, number 1-6
  "chartColumns": 3,                // Optional, number 1-3
  "selectedWidgets": [              // Optional, array of widget IDs with order
    {
      "id": "number-of",
      "order": 1
    },
    {
      "id": "broken",
      "order": 2
    }
  ],
  "selectedCharts": [               // Optional, array of chart IDs with size and order
    {
      "id": "reservations",
      "size": 1,
      "order": 1
    },
    {
      "id": "asset-value-category-selected",
      "size": 2,
      "order": 2
    }
  ]
}
```

**Request Example:**
```http
PUT /api/v1/dashboard/configuration
Authorization: Bearer <token>
Content-Type: application/json

{
  "widgetColumns": 6,
  "chartColumns": 3,
  "selectedWidgets": [
    { "id": "number-of", "order": 1 },
    { "id": "broken", "order": 2 },
    { "id": "value-of", "order": 3 },
    { "id": "available", "order": 4 },
    { "id": "sold", "order": 5 },
    { "id": "checked-out", "order": 6 }
  ],
  "selectedCharts": [
    { "id": "reservations", "size": 1, "order": 1 },
    { "id": "asset-value-category-selected", "size": 1, "order": 2 },
    { "id": "alerts", "size": 1, "order": 3 }
  ]
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "widgetColumns": 6,
    "chartColumns": 3,
    "selectedWidgets": [
      {
        "id": "number-of",
        "name": "Number of Assets",
        "color": "#3B82F6",
        "order": 1
      },
      {
        "id": "broken",
        "name": "Broken",
        "color": "#A855F7",
        "order": 2
      },
      {
        "id": "value-of",
        "name": "Value of Assets",
        "color": "#EF4444",
        "order": 3
      },
      {
        "id": "available",
        "name": "Available Assets",
        "color": "#22C55E",
        "order": 4
      },
      {
        "id": "sold",
        "name": "Sold",
        "color": "#60A5FA",
        "order": 5
      },
      {
        "id": "checked-out",
        "name": "Checked-out",
        "color": "#F87171",
        "order": 6
      }
    ],
    "selectedCharts": [
      {
        "id": "reservations",
        "name": "Reservations",
        "type": "calendar",
        "color": "#22C55E",
        "size": 1,
        "order": 1
      },
      {
        "id": "asset-value-category-selected",
        "name": "Asset Value by Category",
        "type": "bar",
        "color": "#3B82F6",
        "size": 1,
        "order": 2
      },
      {
        "id": "alerts",
        "name": "ALERTS",
        "type": "calendar",
        "color": "#EF4444",
        "size": 1,
        "order": 3
      }
    ],
    "availableWidgets": [
      {
        "id": "warranty",
        "name": "Warranty vs...",
        "color": "#EF4444"
      },
      {
        "id": "lost-missing",
        "name": "Lost / Missing",
        "color": "#4ADE80"
      },
      {
        "id": "net-asset-value",
        "name": "Net Asset Val...",
        "color": "#14B8A6"
      },
      {
        "id": "purchases",
        "name": "Purchases in ...",
        "color": "#A855F7"
      },
      {
        "id": "under-repair",
        "name": "Under Repair",
        "color": "#F97316"
      },
      {
        "id": "disposed",
        "name": "Disposed",
        "color": "#6B7280"
      },
      {
        "id": "donated",
        "name": "Donated",
        "color": "#EAB308"
      },
      {
        "id": "leased",
        "name": "Leased",
        "color": "#FB923C"
      }
    ],
    "availableCharts": [
      {
        "id": "asset-value-category",
        "name": "Asset Value by Category",
        "type": "pie",
        "color": "#3B82F6"
      },
      {
        "id": "feeds",
        "name": "Feeds",
        "type": "table",
        "color": "#6B7280"
      },
      {
        "id": "asset-value-dept",
        "name": "Asset Value by Department",
        "type": "bar",
        "color": "#2563EB"
      }
    ],
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
      "widgetColumns": "Widget columns must be between 1 and 6",
      "chartColumns": "Chart columns must be between 1 and 3",
      "selectedWidgets[0].id": "Widget ID is required",
      "selectedCharts[0].size": "Chart size must be 1, 2, or 3"
    }
  }
}
```

---

### 3. Get Available Widgets

**Endpoint:** `GET /api/v1/dashboard/widgets/available`

**Description:** Get list of all available widgets that can be added to the dashboard.

**Request Example:**
```http
GET /api/v1/dashboard/widgets/available
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": "number-of",
      "name": "Number of Assets",
      "color": "#3B82F6"
    },
    {
      "id": "broken",
      "name": "Broken",
      "color": "#A855F7"
    },
    {
      "id": "value-of",
      "name": "Value of Assets",
      "color": "#EF4444"
    },
    {
      "id": "available",
      "name": "Available Assets",
      "color": "#22C55E"
    },
    {
      "id": "sold",
      "name": "Sold",
      "color": "#60A5FA"
    },
    {
      "id": "checked-out",
      "name": "Checked-out",
      "color": "#F87171"
    },
    {
      "id": "warranty",
      "name": "Warranty vs...",
      "color": "#EF4444"
    },
    {
      "id": "lost-missing",
      "name": "Lost / Missing",
      "color": "#4ADE80"
    },
    {
      "id": "net-asset-value",
      "name": "Net Asset Val...",
      "color": "#14B8A6"
    },
    {
      "id": "purchases",
      "name": "Purchases in ...",
      "color": "#A855F7"
    },
    {
      "id": "under-repair",
      "name": "Under Repair",
      "color": "#F97316"
    },
    {
      "id": "disposed",
      "name": "Disposed",
      "color": "#6B7280"
    },
    {
      "id": "donated",
      "name": "Donated",
      "color": "#EAB308"
    },
    {
      "id": "leased",
      "name": "Leased",
      "color": "#FB923C"
    }
  ]
}
```

---

### 4. Get Available Charts

**Endpoint:** `GET /api/v1/dashboard/charts/available`

**Description:** Get list of all available charts that can be added to the dashboard.

**Request Example:**
```http
GET /api/v1/dashboard/charts/available
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": "reservations",
      "name": "Reservations",
      "type": "calendar",
      "color": "#22C55E"
    },
    {
      "id": "asset-value-category",
      "name": "Asset Value by Category",
      "type": "pie",
      "color": "#3B82F6"
    },
    {
      "id": "asset-value-category-selected",
      "name": "Asset Value by Category",
      "type": "bar",
      "color": "#3B82F6"
    },
    {
      "id": "alerts",
      "name": "ALERTS",
      "type": "calendar",
      "color": "#EF4444"
    },
    {
      "id": "feeds",
      "name": "Feeds",
      "type": "table",
      "color": "#6B7280"
    },
    {
      "id": "asset-value-dept",
      "name": "Asset Value by Department",
      "type": "bar",
      "color": "#2563EB"
    }
  ]
}
```

---

## Validation Rules

### Widget Columns
- Must be an integer between 1 and 6
- Determines grid layout for widgets (1 = full width, 6 = 6 columns)

### Chart Columns
- Must be an integer between 1 and 3
- Determines grid layout for charts (1 = full width, 3 = 3 columns)

### Selected Widgets
- Array of widget objects
- Each widget must have a valid `id` that exists in available widgets
- `order` is optional but recommended for consistent display
- Widgets not in `selectedWidgets` are considered available

### Selected Charts
- Array of chart objects
- Each chart must have a valid `id` that exists in available charts
- `size` must be 1, 2, or 3 (default: 1)
- `order` is optional but recommended for consistent display
- Charts not in `selectedCharts` are considered available

### Chart Size
- Must be 1, 2, or 3
- 1 = standard size (1 column width)
- 2 = double size (2 columns width)
- 3 = triple size (3 columns width)

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

### Example 1: Get and update dashboard configuration

```javascript
// 1. Get current configuration
const response = await getDashboardConfiguration();
console.log(response.data);

// 2. Update configuration
await updateDashboardConfiguration({
  widgetColumns: 4,
  chartColumns: 2,
  selectedWidgets: [
    { id: "number-of", order: 1 },
    { id: "broken", order: 2 }
  ],
  selectedCharts: [
    { id: "reservations", size: 2, order: 1 }
  ]
});
```

### Example 2: Change chart size

```javascript
await updateDashboardConfiguration({
  selectedCharts: [
    { id: "reservations", size: 3, order: 1 } // Make chart 3x size
  ]
});
```

### Example 3: Reorder widgets

```javascript
await updateDashboardConfiguration({
  selectedWidgets: [
    { id: "value-of", order: 1 },    // Move to first position
    { id: "number-of", order: 2 },
    { id: "broken", order: 3 }
  ]
});
```

---

## Notes

1. **Widget/Chart IDs:**
   - Widget and chart IDs are predefined strings
   - These IDs are used as unique identifiers and should not be changed
   - IDs are case-sensitive

2. **Available vs Selected:**
   - The backend should automatically calculate which widgets/charts are available
   - Available = All widgets/charts minus selected widgets/charts
   - When a widget/chart is moved from selected to available, it should be removed from selected and added to available

3. **Partial Updates:**
   - The API supports partial updates
   - Only provided fields will be updated
   - Other fields will remain unchanged

4. **Default Configuration:**
   - If no configuration exists, backend should return sensible defaults
   - Default widget columns: 6
   - Default chart columns: 3
   - Default chart size: 1

5. **Order Management:**
   - Order determines display sequence
   - Lower order numbers appear first
   - If order is not provided, widgets/charts should maintain their current order

6. **User-Specific Configuration:**
   - Dashboard configuration should be user-specific
   - Each user can have their own dashboard layout
   - Configuration is tied to the authenticated user

7. **Icon Mapping:**
   - Frontend maps widget/chart IDs to icons
   - Backend only needs to store IDs, names, colors, and metadata
   - Icon rendering is handled by the frontend

