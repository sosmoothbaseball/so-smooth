export const AGE_GROUPS = ["10U", "11U", "12U", "14U"] as const;

export function ageGroupOptions(current?: string) {
  if (current && !AGE_GROUPS.includes(current as (typeof AGE_GROUPS)[number])) {
    return [current, ...AGE_GROUPS];
  }
  return [...AGE_GROUPS];
}
