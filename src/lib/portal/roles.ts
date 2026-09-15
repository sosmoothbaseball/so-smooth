export const STAFF_ROLES = ["coach", "owner"] as const;

export type StaffRole = (typeof STAFF_ROLES)[number];

export function isStaffRole(role: string) {
  return role === "coach" || role === "owner";
}

export function isOwnerRole(role: string) {
  return role === "owner";
}

export function isParentRole(role: string) {
  return role === "parent";
}
