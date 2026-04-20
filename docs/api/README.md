# API Documentation

This section provides comprehensive documentation for the Job Referral Network System's REST API, including endpoints, authentication, and usage examples.

## Table of Contents

### [Authentication Endpoints](./auth.md)
- User registration and login
- JWT token management
- OAuth integration
- Session management

### [Jobs Endpoints](./jobs.md)
- Job creation and management
- Search and filtering
- Application tracking
- Analytics endpoints

### [Referrals Endpoints](./referrals.md)
- Referral request workflow
- Status management
- Communication endpoints
- Statistics and reporting

### [Users Endpoints](./users.md)
- Profile management
- User settings
- Activity tracking
- Relationship management

## API Overview

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.refnet.com/api
```

### Authentication
The API uses JWT-based authentication with access and refresh tokens:

```javascript
// Access Token (15 minutes)
Authorization: Bearer <access_token>

// Refresh Token (7 days - HTTP-only cookie)
Cookie: refreshToken=<refresh_token>
```

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { /* Response data */ },
  "message": "Operation completed successfully",
  "pagination": { /* For paginated responses */ }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* Additional error details */ }
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|-------|
| Authentication | 5 requests | 15 minutes |
| Job Search | 100 requests | 1 hour |
| Referral Requests | 10 requests | 1 hour |
| Profile Updates | 20 requests | 1 hour |

## HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful request |
| 201 | Created | Resource created |
| 204 | No Content | Successful deletion |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource conflict |
| 422 | Unprocessable Entity | Validation error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## Error Handling

### Error Response Structure

```json
{
  "success": false,
  "error": "Validation error",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### Common Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `VALIDATION_ERROR` | Input validation failed | Check request body |
| `AUTHENTICATION_REQUIRED` | No valid token provided | Login again |
| `INSUFFICIENT_PERMISSIONS` | User lacks required role | Contact admin |
| `RESOURCE_NOT_FOUND` | Requested resource doesn't exist | Check resource ID |
| `DUPLICATE_RESOURCE` | Resource already exists | Use different identifier |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Wait and retry |

## Request/Response Examples

### Authentication Flow

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "FRESHER"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Access protected endpoint
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer <access_token>"
```

### Job Management

```bash
# Create job (HR only)
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Frontend Developer",
    "description": "We are looking for a talented frontend developer...",
    "company": "TechCorp",
    "location": "San Francisco, CA",
    "requiredSkills": ["React", "TypeScript", "CSS"],
    "domain": "Frontend Development",
    "salaryMin": 80000,
    "salaryMax": 120000,
    "experienceLevel": "MID",
    "jobType": "FULL_TIME"
  }'

# Search jobs
curl -X GET "http://localhost:5000/api/jobs?skills=React&location=San%20Francisco" \
  -H "Authorization: Bearer <access_token>"
```

### Referral Workflow

```bash
# Request referral
curl -X POST http://localhost:5000/api/referrals \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "job-uuid",
    "referrerId": "professional-uuid",
    "message": "I am very interested in this position...",
    "priority": "NORMAL"
  }'

# Update referral status
curl -X PATCH http://localhost:5000/api/referrals/referral-uuid/status \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACCEPTED",
    "responseMessage": "I would be happy to refer you!"
  }'
```

## Real-time Events

The API supports real-time events via WebSocket connections:

### Connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-access-token'
  }
});
```

### Event Types

```javascript
// Listen for new referral requests
socket.on('referral_requested', (data) => {
  console.log('New referral request:', data);
});

// Listen for status updates
socket.on('referral_updated', (data) => {
  console.log('Referral status changed:', data);
});

// Listen for new messages
socket.on('new_message', (data) => {
  console.log('New message:', data);
});
```

## Pagination

Paginated endpoints use cursor-based pagination:

```json
{
  "success": true,
  "data": [
    { /* Item 1 */ },
    { /* Item 2 */ }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10,
    "hasNext": true,
    "hasPrev": false,
    "nextCursor": "eyJpZCI6IjEyMyJ9"
  }
}
```

### Pagination Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Integer | 1 | Page number |
| `limit` | Integer | 10 | Items per page (max 100) |
| `cursor` | String | null | Cursor for next page |

## Search and Filtering

Many endpoints support advanced search and filtering:

### Common Parameters

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `search` | String | "React" | Full-text search |
| `skills` | Array | ["React","Node"] | Skill filtering |
| `location` | String | "San Francisco" | Location filter |
| `company` | String | "TechCorp" | Company filter |
| `domain` | String | "Frontend" | Domain filter |
| `status` | String | "ACTIVE" | Status filter |
| `sortBy` | String | "createdAt" | Sort field |
| `sortOrder` | String | "desc" | Sort direction |

### Example Search

```bash
curl -X GET "http://localhost:5000/api/jobs?search=developer&skills=React&location=San%20Francisco&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer <access_token>"
```

## File Uploads

File uploads use multipart/form-data:

```bash
# Upload resume
curl -X POST http://localhost:5000/api/users/upload-resume \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@resume.pdf"
```

### File Upload Limits

| File Type | Max Size | Allowed Formats |
|-----------|----------|----------------|
| Resume | 5MB | PDF, DOC, DOCX |
| Profile Image | 2MB | JPG, PNG, GIF |
| Company Logo | 1MB | JPG, PNG, SVG |

## API Versioning

The API supports versioning via URL paths:

```
Current Version: /api/v1/
Previous Version: /api/v0/ (deprecated)
```

### Version Headers

```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "API-Version: 1.0" \
  -H "Authorization: Bearer <access_token>"
```

## Testing the API

### Using Postman

Import the Postman collection:
```json
{
  "info": {
    "name": "Job Referral Network API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    }
  ]
}
```

### Using cURL

```bash
# Health check
curl http://localhost:5000/

# API health
curl http://localhost:5000/api/health

# Database health
curl http://localhost:5000/api/health/database
```

## SDK and Client Libraries

### JavaScript/TypeScript

```javascript
import { RefNetAPI } from '@refnet/api-client';

const api = new RefNetAPI({
  baseURL: 'http://localhost:5000/api',
  token: 'your-access-token'
});

// Use the API
const jobs = await api.jobs.search({ skills: ['React'] });
const user = await api.users.getProfile();
```

### Python

```python
from refnet_api import RefNetClient

client = RefNetClient(
    base_url='http://localhost:5000/api',
    token='your-access-token'
)

# Use the API
jobs = client.jobs.search(skills=['React'])
user = client.users.get_profile()
```

## API Best Practices

### Authentication
- Always use HTTPS in production
- Store refresh tokens securely
- Implement token refresh logic
- Handle token expiration gracefully

### Error Handling
- Always check the `success` field
- Implement retry logic for rate limits
- Log errors for debugging
- Provide user-friendly error messages

### Performance
- Use pagination for large datasets
- Implement caching for frequently accessed data
- Use appropriate HTTP methods
- Minimize payload sizes

### Security
- Validate all input data
- Sanitize user-generated content
- Implement rate limiting
- Use secure cookie settings

---

This API documentation provides comprehensive information for integrating with the Job Referral Network System. For specific endpoint details, refer to the individual API section documentation.
