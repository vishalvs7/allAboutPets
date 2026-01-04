// src/lib/utils/roleGuard.ts
import { User } from "@/lib/types/user";

/**
 * Checks if a user has one of the allowed roles.
 * @param user - The logged in user object from Firestore
 * @param allowedRoles - Array of roles allowed for this page
 * @returns true if user has permission, false otherwise
 */
export function hasRoleAccess(user: User | null, allowedRoles: string[]): boolean {
  if (!user) return false; // not logged in
  return allowedRoles.includes(user.role);
}
