# Role-Based Access Control (RBAC) Implementation

## Overview
This document describes the strict RBAC implementation for Practo Hub CMS, following the technical specifications exactly as defined in the CTO documents.

## Architecture

### 1. Permissions Configuration (`/src/config/permissions.ts`)
- Central configuration file defining all roles and their exact permissions
- No assumptions or extra permissions beyond documented requirements
- Includes workflow stage definitions and progression rules

### 2. RBAC Middleware (`/src/middlewares/checkPermission.ts`)
- Validates user permissions for each API endpoint
- Returns 403 Forbidden if user lacks required permission
- Logs permission checks for audit purposes

### 3. Workflow Enforcement (`/src/services/workflow.service.ts`)
- Enforces strict workflow progression rules
- Prevents skipping stages or invalid transitions
- Validates editing permissions based on content stage

## Role Permissions

### SUPER_ADMIN
- `create_user` - Create new users
- `edit_user` - Edit user information
- `deactivate_user` - Activate/deactivate users
- `assign_role` - Change user roles
- `view_logs` - Access system logs
- `view_analytics` - View system analytics
- `force_move_workflow` - Emergency workflow override
- `unlock_content` - Unlock locked content

### MEDICAL_REVIEWER
- `assign_topic` - Assign topics to content
- `review_script` - Review script content
- `comment_script` - Add comments to scripts
- `approve_script` - Approve scripts in medical stage
- `reject_script` - Reject scripts in medical stage
- `review_video` - Review video content
- `comment_video` - Add comments to videos
- `approve_video` - Approve videos in medical stage
- `reject_video` - Reject videos in medical stage
- `view_script_versions` - View script version history
- `view_doctor_profiles` - Access doctor profiles

### BRAND_REVIEWER
- `review_script` - Review script content
- `comment_script` - Add comments to scripts
- `approve_script` - Approve scripts in brand stage
- `reject_script` - Reject scripts in brand stage
- `review_video` - Review video content
- `comment_video` - Add comments to videos
- `approve_video` - Approve videos in brand stage
- `reject_video` - Reject videos in brand stage

### DOCTOR_CREATOR
- `upload_pointers` - Upload content pointers
- `approve_script` - Approve scripts in doctor stage
- `request_script_changes` - Request script modifications
- `approve_video` - Approve videos in doctor stage
- `request_video_changes` - Request video modifications
- `view_own_content` - View own created content

### AGENCY_POC
- `view_assigned_topics` - View assigned topics
- `view_doctor_notes` - Access doctor notes
- `upload_script` - Upload script content
- `upload_script_revision` - Upload script revisions
- `upload_video` - Upload video content

### CONTENT_APPROVER
- `approve_script` - Approve script content
- `reject_script` - Reject script content
- `approve_video` - Approve video content
- `reject_video` - Reject video content
- `view_approval_chain` - View approval workflow

### VIEWER
- `view_content` - View published content
- `comment` - Add comments to content

### PUBLISHER
- `publish_content` - Publish approved content
- `edit_metadata` - Edit content metadata

## Workflow Rules

### Script Workflow
```
DRAFT → MEDICAL → BRAND → DOCTOR → LOCKED
```

### Video Workflow
```
DRAFT → BRAND → MEDICAL → DOCTOR → LOCKED → PUBLISHED
```

### Enforcement Rules
1. **Sequential Progression**: Content must move through stages in order
2. **Role-Based Approval**: Only users with appropriate permissions can approve at each stage
3. **Lock Protection**: Locked content cannot be edited (except by Super Admin override)
4. **Publish Requirements**: Videos can only be published from LOCKED stage

## API Endpoints

### User Management (RBAC Protected)
- `POST /api/users/create` - Requires `create_user`
- `GET /api/users` - Requires `view_analytics`
- `POST /api/users/update-status` - Requires `deactivate_user`
- `POST /api/users/update-role` - Requires `assign_role`

### Super Admin Overrides
- `POST /api/users/force-move-workflow` - Requires `force_move_workflow`
- `POST /api/users/unlock-content` - Requires `unlock_content`

## Frontend Integration

### Permission Checking
```typescript
import { hasPermission } from '@/utils/permissions';

// Check single permission
if (hasPermission('create_user')) {
  // Show create user button
}

// Check multiple permissions
if (hasAnyPermission(['approve_script', 'reject_script'])) {
  // Show approval actions
}
```

### Login Response
```json
{
  "success": true,
  "token": "jwt_token",
  "role": "SUPER_ADMIN",
  "name": "User Name",
  "email": "user@example.com",
  "permissions": [
    "create_user",
    "edit_user",
    "deactivate_user",
    "assign_role",
    "view_logs",
    "view_analytics",
    "force_move_workflow",
    "unlock_content"
  ]
}
```

## Security Considerations

1. **Backend Validation**: All permission checks happen on the backend
2. **Frontend UI**: Permissions only control UI visibility, not security
3. **Audit Logging**: All permission checks and overrides are logged
4. **Token Validation**: JWT tokens include user role for validation
5. **Middleware Chain**: Authentication → Permission Check → Controller

## Implementation Notes

- No role inheritance or permission groups
- Exact permissions as specified in technical documents
- No additional permissions or assumptions
- Strict workflow enforcement with Super Admin overrides only
- Frontend permissions stored in localStorage for UI control
- Backend permissions validated on every API call