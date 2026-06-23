'use client';

import { Music2, Shield, ArrowLeft } from 'lucide-react';
import AdminPanel from '@/components/admin/AdminPanel';

interface AuthState {
  isAdmin: boolean;
  loaded: boolean;
}

// Module-level cache so the result is stable across renders
let _authCache: AuthState | null = null;

function getAdminAuth(): AuthState {
  if (_authCache) return _authCache;
  if (typeof window === 'undefined') return { isAdmin: false, loaded: false };
  try {
    const raw = localStorage.getItem('soundflow-auth');
    if (raw) {
      const parsed = JSON.parse(raw);
      const state = parsed?.state;
      if (state?.isAuthenticated && state?.user?.role === 'admin') {
        _authCache = { isAdmin: true, loaded: true };
        return _authCache;
      }
    }
  } catch {
    // ignore parse errors
  }
  _authCache = { isAdmin: false, loaded: true };
  return _authCache;
}

export default function AdminPage() {
  // Compute once on first client render; cached at module level so it's stable
  const authState = typeof window !== 'undefined' ? getAdminAuth() : { isAdmin: false, loaded: false };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/5 bg-gray-950/95 backdrop-blur-xl flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
            <Music2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">SoundFlow Admin</span>
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
