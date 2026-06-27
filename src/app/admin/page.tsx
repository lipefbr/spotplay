'use client';

import { useSyncExternalStore } from 'react';
import { Music2, Shield, ArrowLeft } from 'lucide-react';
import AdminPanel from '@/components/admin/AdminPanel';

// Subscribe to storage events (no-op since we only read once)
const emptySubscribe = () => () => {};

// Cached snapshots to avoid infinite loop with useSyncExternalStore
const _serverSnapshot: { isAdmin: boolean; loaded: boolean } = { isAdmin: false, loaded: false };
let _clientSnapshot: { isAdmin: boolean; loaded: boolean } | null = null;

/** Reset the cached auth snapshot (call on logout before redirect) */
export function resetAdminAuthCache() {
  _clientSnapshot = null;
}

function getAdminAuthSnapshot(): { isAdmin: boolean; loaded: boolean } {
  if (_clientSnapshot) return _clientSnapshot;
  try {
    const raw = localStorage.getItem('soundflow-auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      const state = parsed?.state;
      if (state?.isAuthenticated && (state?.user?.role === 'admin' || state?.user?.role === 'moderator')) {
        _clientSnapshot = { isAdmin: true, loaded: true };
        return _clientSnapshot;
      }
    }
  } catch {
    // ignore parse errors
  }
  _clientSnapshot = { isAdmin: false, loaded: true };
  return _clientSnapshot;
}

export default function AdminPage() {
  // useSyncExternalStore: server returns { loaded: false }, client reads localStorage (cached)
  const authState = useSyncExternalStore(
    emptySubscribe,
    getAdminAuthSnapshot,
    () => _serverSnapshot
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/5 bg-gray-950/95 backdrop-blur-xl flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <Music2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">SpotiPlay Admin</span>
          <span className="hidden sm:inline text-sm text-amber-400 font-medium">Painel Administrativo</span>
        </div>
        <a
          href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Voltar ao App</span>
        </a>
      </header>

      {/* Non-admin warning banner */}
      {authState.loaded && !authState.isAdmin && (
        <div className="fixed top-14 left-0 right-0 z-40 bg-red-500/10 border-b border-red-500/30 px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-4 w-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">
              Acesso restrito — Este painel é exclusivo para administradores.
            </span>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      <div className={authState.loaded && !authState.isAdmin ? 'pt-24' : 'pt-14'}>
        <AdminPanel />
      </div>
    </div>
  );
}
