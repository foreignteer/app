'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { UserRole } from '@/lib/types/user';

export function useRole() {
  const { user, firebaseUser } = useAuth();
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!firebaseUser) {
        setRole('user');
        setLoading(false);
        return;
      }

      if (user?.role) {
        setRole(user.role);
        setLoading(false);
        return;
      }

      // Fallback: get role from token claims
      try {
        const idTokenResult = await firebaseUser.getIdTokenResult();
        setRole((idTokenResult.claims.role as UserRole) || 'user');
      } catch (error) {
        console.error('Error fetching role:', error);
        setRole('user');
      }
      setLoading(false);
    }

    fetchRole();
  }, [firebaseUser, user]);

  return {
    role,
    loading,
    isAdmin: role === 'admin',
    isNGO: role === 'ngo',
    isUser: role === 'user',
  };
}
