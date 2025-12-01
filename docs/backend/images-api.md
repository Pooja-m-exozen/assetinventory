# Images API Documentation

## Overview
This document describes the backend API endpoints required for the Image Gallery management page (`/tools/image-gallery`).

## Base URL
```
/api/v1/images
```

## Authentication
All endpoints require authentication via Bearer token:
```
Authorization: Bearer <token>
```

---

## Data Models

### Image Model
```typescript
interface Image {
  id: number | string;              // Unique identifier
  url: string;                       // Full image URL (required)
  thumbnailUrl?: string;             // Thumbnail URL (optional, for grid view)
  name: string;                      // Image name (required)
  description?: string;               // Image description (optional, max 500 chars)
  fileSize?: number;                  // File size in bytes (optional)
  width?: number;                     // Image width in pixels (optional)
  height?: number;                    // Image height in pixels (optional)
  mimeType?: string;                  // MIME type (e.g., "image/jpeg") (optional)
  assignedTo: "asset" | "inventory" | "unassigned";  // Assignment status (required)
  assignedToId?: number | string;     // ID of assigned asset/inventory item (optional)
  assignedToName?: string;             // Name of assigned asset/inventory item (optional)
  uploadDate: string;                  // Upload date (ISO 8601 timestamp)
  uploadBy: string;                    // Name of user who uploaded (read-only)
  uploadById?: number | string;        // ID of user who uploaded (read-only)
  isStockImage?: boolean;              // Whether this is a stock image (default: false)
  createdAt?: string;                 // ISO 8601 timestamp
  updatedAt?: string;                 // ISO 8601 timestamp
}
```

### Image Details Model
```typescript
interface ImageDetails {
  id: number | string;
  url: string;
  thumbnailUrl?: string;
  name: string;
  description?: string;
  fileSize: number;
  width: number;
  height: number;
  mimeType: string;
  assignedTo: "asset" | "inventory" | "unassigned";
  assignedToId?: number | string;
  assignedToName?: string;
  uploadDate: string;
  uploadBy: string;
  uploadById: number | string;
  isStockImage: boolean;
  createdAt?: string;
  updatedAt?: string;
}
```

### Pagination Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    recordsPerPage: number;
    totalRecords: number;
    totalPages: number;
    startRecord: number;
    endRecord: number;
  };
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

### 1. Get Images List

**Endpoint:** `GET /api/v1/images`

**Description:** Retrieve a paginated list of images with optional search and filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 50 | Records per page (10, 25, 50, 100) |
| `search` | string | No | - | Search query string (searches in name, description) |
| `assignedTo` | string | No | - | Filter by assignment: "asset", "inventory", "unassigned" |
| `isStockImage` | boolean | No | false | Filter by stock images (true) or user uploads (false) |

**Request Example:**
```http
GET /api/v1/images?page=1&limit=50&assignedTo=unassigned&isStockImage=false
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "url": "https://example.com/images/logo.jpg",
      "thumbnailUrl": "https://example.com/images/thumbnails/logo_thumb.jpg",
      "name": "Logo",
      "description": "Company logo",
      "fileSize": 245760,
      "width": 1920,
      "height": 1080,
      "mimeType": "image/jpeg",
      "assignedTo": "unassigned",
      "uploadDate": "2024-01-15T10:30:00Z",
      "uploadBy": "John Doe",
      "uploadById": 1,
      "isStockImage": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "recordsPerPage": 50,
    "totalRecords": 25,
    "totalPages": 1,
    "startRecord": 1,
    "endRecord": 25
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

// 500 Internal Server Error
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An error occurred while fetching images"
  }
}
```

---

### 2. Get Single Image

**Endpoint:** `GET /api/v1/images/:id`

**Description:** Retrieve a single image by ID with full details.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Image ID |

**Request Example:**
```http
GET /api/v1/images/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "url": "https://example.com/images/logo.jpg",
    "thumbnailUrl": "https://example.com/images/thumbnails/logo_thumb.jpg",
    "name": "Logo",
    "description": "Company logo",
    "fileSize": 245760,
    "width": 1920,
    "height": 1080,
    "mimeType": "image/jpeg",
    "assignedTo": "unassigned",
    "uploadDate": "2024-01-15T10:30:00Z",
    "uploadBy": "John Doe",
    "uploadById": 1,
    "isStockImage": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Image with ID 1 not found"
  }
}
```

---

### 3. Upload Image

**Endpoint:** `POST /api/v1/images`

**Description:** Upload a new image file.

**Request Body:** `multipart/form-data`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | The image file to upload (JPEG, PNG, GIF, WebP, max 10MB) |
| `description` | string | No | Image description (max 500 chars) |

**Request Example:**
```http
POST /api/v1/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [binary image data]
description: "Company logo"
```

**Response Example (201 Created):**
```json
{
  "data": {
    "id": 1,
    "url": "https://example.com/images/logo.jpg",
    "thumbnailUrl": "https://example.com/images/thumbnails/logo_thumb.jpg",
    "name": "logo.jpg",
    "description": "Company logo",
    "fileSize": 245760,
    "width": 1920,
    "height": 1080,
    "mimeType": "image/jpeg",
    "assignedTo": "unassigned",
    "uploadDate": "2024-01-15T10:30:00Z",
    "uploadBy": "John Doe",
    "uploadById": 1,
    "isStockImage": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
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
      "file": "File is required"
    }
  }
}

// 400 Bad Request - Invalid file type
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid file type. Allowed types: JPEG, PNG, GIF, WebP"
  }
}

// 413 Payload Too Large
{
  "error": {
    "code": "FILE_TOO_LARGE",
    "message": "File size exceeds maximum allowed size (10MB)"
  }
}
```

---

### 4. Update Image

**Endpoint:** `PUT /api/v1/images/:id`

**Description:** Update image metadata (name, description). The image file itself cannot be changed.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Image ID |

**Request Body:**
```json
{
  "name": "Updated Logo",        // Optional, max 255 chars
  "description": "Updated description"  // Optional, max 500 chars
}
```

**Request Example:**
```http
PUT /api/v1/images/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Logo",
  "description": "Updated description"
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "url": "https://example.com/images/logo.jpg",
    "name": "Updated Logo",
    "description": "Updated description",
    "assignedTo": "unassigned",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

---

### 5. Delete Image

**Endpoint:** `DELETE /api/v1/images/:id`

**Description:** Delete an image by ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Image ID |

**Request Example:**
```http
DELETE /api/v1/images/1
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "message": "Image deleted successfully"
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Image with ID 1 not found"
  }
}
```

---

### 6. Bulk Delete Images

**Endpoint:** `POST /api/v1/images/bulk-delete`

**Description:** Delete multiple images by their IDs.

**Request Body:**
```json
{
  "ids": [1, 2, 3]  // Array of image IDs
}
```

**Request Example:**
```http
POST /api/v1/images/bulk-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "ids": [1, 2, 3]
}
```

**Response Example (200 OK):**
```json
{
  "message": "Images deleted successfully",
  "deletedCount": 3
}
```

---

### 7. Attach Image to Asset

**Endpoint:** `POST /api/v1/images/:id/attach-asset`

**Description:** Attach an image to an asset.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Image ID |

**Request Body:**
```json
{
  "assetId": 1  // Asset ID to attach to
}
```

**Request Example:**
```http
POST /api/v1/images/1/attach-asset
Authorization: Bearer <token>
Content-Type: application/json

{
  "assetId": 1
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "assignedTo": "asset",
    "assignedToId": 1,
    "assignedToName": "Laptop Dell XPS 15"
  },
  "message": "Successfully attached image to asset"
}
```

---

### 8. Attach Image to Inventory Item

**Endpoint:** `POST /api/v1/images/:id/attach-inventory-item`

**Description:** Attach an image to an inventory item.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Image ID |

**Request Body:**
```json
{
  "itemId": 1  // Inventory item ID to attach to
}
```

**Request Example:**
```http
POST /api/v1/images/1/attach-inventory-item
Authorization: Bearer <token>
Content-Type: application/json

{
  "itemId": 1
}
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "assignedTo": "inventory",
    "assignedToId": 1,
    "assignedToName": "Office Chair"
  },
  "message": "Successfully attached image to inventory item"
}
```

---

### 9. Detach Image from Asset

**Endpoint:** `POST /api/v1/images/:id/detach-asset`

**Description:** Detach an image from its assigned asset.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Image ID |

**Request Example:**
```http
POST /api/v1/images/1/detach-asset
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "assignedTo": "unassigned",
    "assignedToId": null,
    "assignedToName": null
  },
  "message": "Successfully detached image from asset"
}
```

---

### 10. Detach Image from Inventory Item

**Endpoint:** `POST /api/v1/images/:id/detach-inventory-item`

**Description:** Detach an image from its assigned inventory item.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | number/string | Yes | Image ID |

**Request Example:**
```http
POST /api/v1/images/1/detach-inventory-item
Authorization: Bearer <token>
```

**Response Example (200 OK):**
```json
{
  "data": {
    "id": 1,
    "assignedTo": "unassigned",
    "assignedToId": null,
    "assignedToName": null
  },
  "message": "Successfully detached image from inventory item"
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Authentication required or invalid token |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `FILE_TOO_LARGE` | 413 | File size exceeds maximum allowed size |
| `INVALID_FILE_TYPE` | 400 | Invalid file type |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Usage Examples

### Example 1: Upload and attach image to asset

```javascript
// 1. Upload image
const image = await uploadImage({
  file: fileInput.files[0],
  description: "Asset photo"
});

// 2. Attach to asset
await attachImageToAsset(image.data.id, assetId);
```

### Example 2: Get user uploads with filters

```javascript
const images = await getImages(
  1,        // page
  50,       // limit
  "logo",   // search
  "unassigned",  // filter
  "your-uploads" // imageType
);
```

### Example 3: View image details

```javascript
const details = await getImage(1);
console.log(details.data.width, details.data.height);
```

---

## Notes

1. **File Upload Limits**:
   - Maximum file size: 10MB
   - Allowed file types: JPEG, JPG, PNG, GIF, WebP
   - File names are sanitized to prevent security issues

2. **Image Processing**:
   - Images are automatically resized/optimized on upload
   - Thumbnails are generated automatically for grid view
   - Original images are preserved

3. **Image Storage**:
   - Images are stored securely on the server
   - URLs are provided for direct access (with authentication)
   - Original file names are preserved

4. **Image Assignment**:
   - An image can be assigned to one asset or one inventory item
   - Assigning to a new asset/item automatically detaches from the previous one
   - Unassigning sets `assignedTo` to "unassigned"

5. **Stock Images**:
   - Stock images are system-provided images
   - Users cannot delete stock images
   - Stock images are marked with `isStockImage: true`

6. **Search Functionality**:
   - Search works across name and description fields
   - Search is case-insensitive
   - Partial matches are supported

7. **Pagination**:
   - Default page size is 50 (optimized for grid view)
   - Maximum page size is 100
   - Pagination metadata is included in all list responses

8. **Security**:
   - All image uploads are validated for type and size
   - Image access requires authentication
   - Users can only delete images they uploaded (unless admin)
   - Stock images are protected from deletion

