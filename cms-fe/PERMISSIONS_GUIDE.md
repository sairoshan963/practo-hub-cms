# Frontend Permissions Guide

## Available Permissions

### Super Admin
- `create_user` - Create new users
- `edit_user` - Edit user information  
- `deactivate_user` - Activate/deactivate users
- `assign_role` - Change user roles
- `view_logs` - Access system logs
- `view_analytics` - View system analytics
- `force_move_workflow` - Emergency workflow override
- `unlock_content` - Unlock locked content

### Medical Reviewer
- `assign_topic` - Assign topics to content
- `review_script` - Review script content
- `comment_script` - Add comments to scripts
- `approve_script` - Approve scripts
- `reject_script` - Reject scripts
- `review_video` - Review video content
- `comment_video` - Add comments to videos
- `approve_video` - Approve videos
- `reject_video` - Reject videos
- `view_script_versions` - View script versions
- `view_doctor_profiles` - Access doctor profiles

### Brand Reviewer
- `review_script`, `comment_script`, `approve_script`, `reject_script`
- `review_video`, `comment_video`, `approve_video`, `reject_video`

### Doctor Creator
- `upload_pointers` - Upload content pointers
- `approve_script` - Approve scripts
- `request_script_changes` - Request script changes
- `approve_video` - Approve videos
- `request_video_changes` - Request video changes
- `view_own_content` - View own content

### Agency POC
- `view_assigned_topics` - View assigned topics
- `view_doctor_notes` - Access doctor notes
- `upload_script` - Upload scripts
- `upload_script_revision` - Upload script revisions
- `upload_video` - Upload videos

### Content Approver
- `approve_script`, `reject_script`, `approve_video`, `reject_video`
- `view_approval_chain` - View approval workflow

### Viewer
- `view_content` - View published content
- `comment` - Add comments

### Publisher
- `publish_content` - Publish content
- `edit_metadata` - Edit content metadata

## How to Use

```tsx
import { hasPermission, hasAnyPermission } from '@/utils/permissions';

// Show button only if user has permission
{hasPermission('create_user') && (
  <button>Create User</button>
)}

// Show if user has any of these permissions
{hasAnyPermission(['approve_script', 'reject_script']) && (
  <div>Approval Actions</div>
)}

// Check in component logic
const canCreateUser = hasPermission('create_user');
if (canCreateUser) {
  // Show create user form
}
```

## Examples

See these files for usage examples:
- `/src/app/super_admin/dashboard/page.tsx` - Permission-based buttons
- `/src/utils/permissions.ts` - All helper functions