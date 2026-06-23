'use client';

import { useSyncExternalStore } from 'react';
import AdminPanel from '@/components/admin/AdminPanel';

const emptySubscribe = () => () => {};

function checkAdminAuth(): { isAuth: boolean; loaded: boolean } {
  if (typeof window === 'undefined') return { isAuth: false, loaded: false };
  try {
    const raw = localStorage.getItem('soundflow-auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      const state = parsed?.state;
      if (state?.isAuthenticated && (state?.user?.role === 'admin' || state?.user?.role === 'moderator')) {
        return { isAuth: true, loaded: true };
      }
    }
  } catch {
    // ignore parse errors
  }
  return { isAuth: false, loaded: true };
}

export default function AdminPage() {
  // Use useSyncExternalStore to avoid lint error with useEffect+setState
  const authState = useSyncExternalStore(
    emptySubscribe,
    () => checkAdminAuth(),
    () => ({ isAuth: false, loaded: false })
  );

  if (!authState.loaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Verificando autenticação...</div>
      </div>
    );
  }

  if (!authState.isAuth) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-gray-400 mb-4">Você precisa ser admin para acessar esta página.</p>
          <a href="/" className="text-emerald-400 hover:underline">Voltar ao SoundFlow</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminPanel />
    </div>
  );
}
