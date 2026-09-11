export const AGE_GROUPS = ["8U", "9U", "10U", "11U", "12U", "13U", "14U", "15U", "16U", "18U"] as const;

export function ageGroupOptions(current?: string) {
  if (current && !AGE_GROUPS.includes(current as (typeof AGE_GROUPS)[number])) {
    return [current, ...AGE_GROUPS];
  }
  return [...AGE_GROUPS];
}
