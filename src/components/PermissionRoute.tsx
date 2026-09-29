// src/components/PermissionRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { usePermission } from '../hooks/usePermission';
import type { Permission } from '../types/permissions';

interface PermissionRouteProps {
    /** Permissões exigidas */
    permissions: Permission[];
    /** 'any' = basta uma | 'all' = precisa de todas */
    mode?: 'any' | 'all';
    /** Pra onde redirecionar se não tiver permissão */
    redirectTo?: string;
}

export function PermissionRoute({ permissions, mode = 'any', redirectTo = '/', }: PermissionRouteProps) {
    const { canAny, canAll } = usePermission();
    const location = useLocation();

    const allowed = mode === 'any' ? canAny(permissions) : canAll(permissions);

    if (!allowed) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <Outlet />;
}