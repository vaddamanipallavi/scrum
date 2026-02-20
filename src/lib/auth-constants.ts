export const AUTH_COOKIE_NAME = "auth_token";

export const ROLE_VALUES = ["STUDENT", "WARDEN", "ADMIN"] as const;

export type RoleValue = (typeof ROLE_VALUES)[number];
