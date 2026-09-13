export const PHONE_REQUIRED_MESSAGE = "Add a phone number coaches can use to reach you.";

export function normalizePhone(value: string) {
  return value.trim();
}

export function phoneLooksValid(value: string) {
  return normalizePhone(value).replace(/\D/g, "").length >= 10;
}
