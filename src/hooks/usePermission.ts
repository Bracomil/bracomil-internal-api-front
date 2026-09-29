import { useAuth } from '../context/AuthContext';
import type { Permission } from '../types/permissions';

export function usePermission() {
    const { user } = useAuth();

    function can(permission: Permission): boolean {
        return user?.permissions?.includes(permission) ?? false;
    }

    function canAny(permissions: Permission[]): boolean {
        return permissions.some((p) => can(p));
    }

    function canAll(permissions: Permission[]): boolean {
        return permissions.every((p) => can(p));
    }

    return { can, canAny, canAll };
}