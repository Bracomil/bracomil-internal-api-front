// src/types/permissions.ts
export const PERMISSIONS = {
    BANK_RETURNS_READ: 'bank-returns:read',
    BANK_RETURNS_SETTLE: 'bank-returns:settle',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];