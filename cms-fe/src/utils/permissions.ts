/**
 * Frontend Permission Utilities
 * 
 * Helper functions to check user permissions and show/hide UI elements
 */

export type Permission = 
  | 'create_user'
  | 'edit_user'
  | 'deactivate_user'
  | 'assign_role'
  | 'view_logs'
  | 'view_analytics'
  | 'force_move_workflow'
  | 'unlock_content'
  | 'assign_topic'
  | 'review_script'
  | 'comment_script'
  | 'approve_script'
  | 'reject_script'
  | 'review_video'
  | 'comment_video'
  | 'approve_video'
  | 'reject_video'
  | 'view_script_versions'
  | 'view_doctor_profiles'
  | 'upload_pointers'
  | 'request_script_changes'
  | 'request_video_changes'
  | 'view_own_content'
  | 'view_assigned_topics'
  | 'view_doctor_notes'
  | 'upload_script'
  | 'upload_script_revision'
  | 'upload_video'
  | 'view_approval_chain'
  | 'view_content'
  | 'comment'
  | 'publish_content'
  | 'edit_metadata';

/**
 * Check if user has a specific permission
 */
export function hasPermission(permission: Permission): boolean {
  try {
    const permissions = localStorage.getItem('permissions');
    if (!permissions) return false;
    
    const userPermissions: Permission[] = JSON.parse(permissions);
    return userPermissions.includes(permission);
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(permission));
}

/**
 * Get all user permissions
 */
export function getUserPermissions(): Permission[] {
  try {
    const permissions = localStorage.getItem('permissions');
    return permissions ? JSON.parse(permissions) : [];
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}

/**
 * Check if user is Super Admin (has override permissions)
 */
export function isSuperAdmin(): boolean {
  return hasPermission('force_move_workflow') && hasPermission('unlock_content');
}