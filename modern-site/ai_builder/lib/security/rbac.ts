/**
 * Role-Based Access Control (RBAC)
 * P0 Feature 5: Enhanced Security - RBAC
 */

export type Role = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'
export type Permission = 
  | 'read:project'
  | 'write:project'
  | 'delete:project'
  | 'deploy:project'
  | 'manage:collaborators'
  | 'manage:settings'
  | 'read:all'
  | 'write:all'
  | 'admin:all'

export interface RolePermissions {
  role: Role
  permissions: Permission[]
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    'read:project',
    'write:project',
    'delete:project',
    'deploy:project',
    'manage:collaborators',
    'manage:settings',
    'read:all',
    'write:all'
  ],
  admin: [
    'read:project',
    'write:project',
    'deploy:project',
    'manage:collaborators',
    'read:all',
    'write:all',
    'admin:all'
  ],
  editor: [
    'read:project',
    'write:project',
    'deploy:project'
  ],
  viewer: [
    'read:project'
  ],
  guest: []
}

export interface ProjectAccess {
  userId: string
  projectId: string
  role: Role
  grantedAt: Date
  grantedBy?: string
}

/**
 * Check if user has permission
 */
export function hasPermission(userRole: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || []
  return permissions.includes(permission)
}

/**
 * Check if user can perform action on project
 */
export function canPerformAction(
  userRole: Role,
  action: Permission,
  projectOwnerId?: string,
  userId?: string
): boolean {
  // Owner always has all permissions
  if (projectOwnerId === userId) {
    return true
  }

  return hasPermission(userRole, action)
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || []
}

/**
 * Check if role can be assigned by current user
 */
export function canAssignRole(assignerRole: Role, targetRole: Role): boolean {
  const roleHierarchy: Record<Role, number> = {
    owner: 5,
    admin: 4,
    editor: 3,
    viewer: 2,
    guest: 1
  }

  const assignerLevel = roleHierarchy[assignerRole] || 0
  const targetLevel = roleHierarchy[targetRole] || 0

  // Can only assign roles lower than or equal to your own
  return assignerLevel >= targetLevel && assignerRole !== 'guest'
}

/**
 * Validate role
 */
export function isValidRole(role: string): role is Role {
  return role in ROLE_PERMISSIONS
}





