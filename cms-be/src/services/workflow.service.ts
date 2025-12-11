import { 
  ScriptWorkflowStage, 
  VideoWorkflowStage, 
  SCRIPT_WORKFLOW_PROGRESSION, 
  VIDEO_WORKFLOW_PROGRESSION 
} from '../config/permissions.js';

/**
 * Workflow Enforcement Service
 * 
 * Ensures content follows the correct workflow progression:
 * - Script: DRAFT → MEDICAL → BRAND → DOCTOR → LOCKED
 * - Video: DRAFT → BRAND → MEDICAL → DOCTOR → LOCKED → PUBLISHED
 */

export class WorkflowService {
  /**
   * Validate if content can move to the next stage
   */
  static canMoveToNextStage(
    currentStage: ScriptWorkflowStage | VideoWorkflowStage,
    contentType: 'script' | 'video'
  ): { canMove: boolean; nextStage: string | null; error?: string } {
    if (contentType === 'script') {
      const nextStage = SCRIPT_WORKFLOW_PROGRESSION[currentStage as ScriptWorkflowStage];
      return {
        canMove: nextStage !== null,
        nextStage,
        error: nextStage === null ? 'Content is already at final stage' : undefined
      };
    } else {
      const nextStage = VIDEO_WORKFLOW_PROGRESSION[currentStage as VideoWorkflowStage];
      return {
        canMove: nextStage !== null,
        nextStage,
        error: nextStage === null ? 'Content is already at final stage' : undefined
      };
    }
  }

  /**
   * Validate workflow stage transition
   */
  static validateStageTransition(
    fromStage: ScriptWorkflowStage | VideoWorkflowStage,
    toStage: ScriptWorkflowStage | VideoWorkflowStage,
    contentType: 'script' | 'video'
  ): { isValid: boolean; error?: string } {
    const progression = contentType === 'script' 
      ? SCRIPT_WORKFLOW_PROGRESSION 
      : VIDEO_WORKFLOW_PROGRESSION;

    const expectedNextStage = progression[fromStage as any];

    if (expectedNextStage === null) {
      return {
        isValid: false,
        error: 'Content is at final stage and cannot be moved further'
      };
    }

    if (toStage !== expectedNextStage) {
      return {
        isValid: false,
        error: `Invalid stage transition. Expected: ${expectedNextStage}, Got: ${toStage}`
      };
    }

    return { isValid: true };
  }

  /**
   * Check if content can be edited at current stage
   */
  static canEditContent(stage: ScriptWorkflowStage | VideoWorkflowStage): boolean {
    return stage !== ScriptWorkflowStage.LOCKED && stage !== VideoWorkflowStage.LOCKED && stage !== VideoWorkflowStage.PUBLISHED;
  }

  /**
   * Check if content can be published (videos only)
   */
  static canPublishVideo(stage: VideoWorkflowStage): boolean {
    return stage === VideoWorkflowStage.LOCKED;
  }

  /**
   * Get required role permissions for stage approval
   */
  static getRequiredApprovalPermission(
    stage: ScriptWorkflowStage | VideoWorkflowStage,
    contentType: 'script' | 'video'
  ): string {
    const permissionSuffix = contentType === 'script' ? 'script' : 'video';
    
    switch (stage) {
      case ScriptWorkflowStage.MEDICAL:
      case VideoWorkflowStage.MEDICAL:
        return `approve_${permissionSuffix}`;
      case ScriptWorkflowStage.BRAND:
      case VideoWorkflowStage.BRAND:
        return `approve_${permissionSuffix}`;
      case ScriptWorkflowStage.DOCTOR:
      case VideoWorkflowStage.DOCTOR:
        return `approve_${permissionSuffix}`;
      default:
        return `approve_${permissionSuffix}`;
    }
  }
}