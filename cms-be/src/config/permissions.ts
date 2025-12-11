/**
 * Role-Based Access Control (RBAC) Configuration
 * 
 * Defines exact permissions for each role as per Practo Hub CMS technical documents.
 * No assumptions or extra permissions beyond what's documented.
 */

export type Permission = 
  // Super Admin permissions
  | 'create_user'
  | 'edit_user'
  | 'deactivate_user'
  | 'assign_role'
  | 'view_logs'
  | 'view_analytics'
  | 'force_move_workflow'
  | 'unlock_content'
  
  // Medical Reviewer permissions
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
  
  // Brand Reviewer permissions (subset of Medical Reviewer)
  // Doctor Creator permissions
  | 'upload_pointers'
  | 'request_script_changes'
  | 'request_video_changes'
  | 'view_own_content'
  
  // Agency POC permissions
  | 'view_assigned_topics'
  | 'view_doctor_notes'
  | 'upload_script'
  | 'upload_script_revision'
  | 'upload_video'
  
  // Content Approver permissions
  | 'view_approval_chain'
  
  // Viewer permissions
  | 'view_content'
  | 'comment'
  
  // Publisher permissions
  | 'publish_content'
  | 'edit_metadata';

export type Role = 
  | 'SUPER_ADMIN'
  | 'MEDICAL_REVIEWER'
  | 'BRAND_REVIEWER'
  | 'DOCTOR_CREATOR'
  | 'AGENCY_POC'
  | 'CONTENT_APPROVER'
  | 'VIEWER'
  | 'PUBLISHER';

/**
 * Role permissions mapping as defined in technical documents
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'create_user',
    'edit_user',
    'deactivate_user',
    'assign_role',
    'view_logs',
    'view_analytics',
    'force_move_workflow',
    'unlock_content'
  ],

  MEDICAL_REVIEWER: [
    'assign_topic',
    'review_script',
    'comment_script',
    'approve_script',
    'reject_script',
    'review_video',
    'comment_video',
    'approve_video',
    'reject_video',
    'view_script_versions',
    'view_doctor_profiles'
  ],

  BRAND_REVIEWER: [
    'review_script',
    'comment_script',
    'approve_script',
    'reject_script',
    'review_video',
    'comment_video',
    'approve_video',
    'reject_video'
  ],

  DOCTOR_CREATOR: [
    'upload_pointers',
    'approve_script',
    'request_script_changes',
    'approve_video',
    'request_video_changes',
    'view_own_content'
  ],

  AGENCY_POC: [
    'view_assigned_topics',
    'view_doctor_notes',
    'upload_script',
    'upload_script_revision',
    'upload_video'
  ],

  CONTENT_APPROVER: [
    'approve_script',
    'reject_script',
    'approve_video',
    'reject_video',
    'view_approval_chain'
  ],

  VIEWER: [
    'view_content',
    'comment'
  ],

  PUBLISHER: [
    'publish_content',
    'edit_metadata'
  ]
};

/**
 * Workflow stages for content management
 */
export enum ScriptWorkflowStage {
  DRAFT = 'DRAFT',
  MEDICAL = 'MEDICAL',
  BRAND = 'BRAND',
  DOCTOR = 'DOCTOR',
  LOCKED = 'LOCKED'
}

export enum VideoWorkflowStage {
  DRAFT = 'DRAFT',
  BRAND = 'BRAND',
  MEDICAL = 'MEDICAL',
  DOCTOR = 'DOCTOR',
  LOCKED = 'LOCKED',
  PUBLISHED = 'PUBLISHED'
}

/**
 * Workflow progression rules
 */
export const SCRIPT_WORKFLOW_PROGRESSION: Record<ScriptWorkflowStage, ScriptWorkflowStage | null> = {
  [ScriptWorkflowStage.DRAFT]: ScriptWorkflowStage.MEDICAL,
  [ScriptWorkflowStage.MEDICAL]: ScriptWorkflowStage.BRAND,
  [ScriptWorkflowStage.BRAND]: ScriptWorkflowStage.DOCTOR,
  [ScriptWorkflowStage.DOCTOR]: ScriptWorkflowStage.LOCKED,
  [ScriptWorkflowStage.LOCKED]: null
};

export const VIDEO_WORKFLOW_PROGRESSION: Record<VideoWorkflowStage, VideoWorkflowStage | null> = {
  [VideoWorkflowStage.DRAFT]: VideoWorkflowStage.BRAND,
  [VideoWorkflowStage.BRAND]: VideoWorkflowStage.MEDICAL,
  [VideoWorkflowStage.MEDICAL]: VideoWorkflowStage.DOCTOR,
  [VideoWorkflowStage.DOCTOR]: VideoWorkflowStage.LOCKED,
  [VideoWorkflowStage.LOCKED]: VideoWorkflowStage.PUBLISHED,
  [VideoWorkflowStage.PUBLISHED]: null
};