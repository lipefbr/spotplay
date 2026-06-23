'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  Library,
  Plus,
  Music2,
  Heart,
  Crown,
  Settings,
  Menu,
  Radio,
  Shield,
  Mic2,
  LogOut,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAppStore } from '@/stores/app-store';
import { mockPlaylists } from '@/lib/mock-data';

// Role-based nav visibility
const ROLE_ACCESS: Record<string, string[]> = {
  free: ['home', 'search', 'library', 'premium', 'lives', 'podcasts'],
  premium: ['home', 'search', 'library', 'premium', 'lives', 'podcasts'],
  creator: ['home', 'search', 'library', 'premium', 'lives', 'podcasts', 'creator'],
  moderator: ['home', 'search', 'library', 'premium', 'lives', 'podcasts', 'admin'],
  admin: ['home', 'search', 'library', 'premium', 'lives', 'podcasts', 'admin', 'creator'],
};

const allNavItems = [
  { id: 'home', label: 'Início', icon: Home, group: 'main' },
  { id: 'search', label: 'Buscar', icon: Search, group: 'main' },
  { id: 'library', label: 'Sua Biblioteca', icon: Library, group: 'main' },
  { id: 'premium', label: 'Premium', icon: Crown, group: 'extra' },
  { id: 'lives', label: 'Lives', icon: Radio, group: 'extra' },
  { id: 'podcasts', label: 'Podcasts', icon: Mic2, group: 'extra' },
  { id: 'admin', label: 'Admin', icon: Shield, group: 'special' },
  { id: 'creator', label: 'Criador', icon: Mic2, group: 'special' },
];

interface SidebarContentProps {
  view: string;
  selectedPlaylistId: string | null;
  userRole: string;
  userName: string;
  userAvatar?: string;
  userPlan: string;
  onNavClick: (navId: string) => void;
  onPlaylistClick: (playlistId: string) => void;
  onLikedClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

function SidebarContent({
  view,
  selectedPlaylistId,
  userRole,
  userName,
  userAvatar,
  userPlan,
  onNavClick,
  onPlaylistClick,
  onLikedClick,
  onProfileClick,
  onLogout,
}: SidebarContentProps) {
  const userPlaylists = useMemo(() => mockPlaylists.slice(0, 5), []);

  // Filter nav items based on role
  const allowedViews = ROLE_ACCESS[userRole] || ROLE_ACCESS.free;
  const filteredNav = useMemo(() =>
    allNavItems.filter((item) => allowedViews.includes(item.id)),
    [allowedViews]
  );

  const mainItems = filteredNav.filter((i) => i.group === 'main');
  const extraItems = filteredNav.filter((i) => i.group === 'extra');
  const specialItems = filteredNav.filter((i) => i.group === 'special');

  const planLabel = userPlan === 'free' ? 'Plano Free' : 'Premium';
  const roleLabel = userRole === 'admin' ? 'Admin' : userRole === 'creator' ? 'Criador' : userRole === 'moderator' ? 'Moderador' : null;

  return (
    <div className="flex h-full flex-col bg-gray-950">
      {/* Logo - fixed at top */}
      <div className="flex items-center gap-3 px-6 py-5 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
          <Music2 className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">SoundFlow</span>
      </div>

      {/* Scrollable nav items */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">

      {/* Main Navigation */}
      <nav className="px-3 pb-2">
        {mainItems.map((item) => {
          const isActive = view === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
              }`}
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <item.icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : ''}`} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400"
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Extra Nav */}
      {extraItems.length > 0 && (
        <nav className="px-3 pb-2">
          {extraItems.map((item) => {
            const isActive = view === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className={`flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ x: 2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-emerald-400' : ''}`} />
                {item.label}
              </motion.button>
            );
          })}
        </nav>
      )}

      {/* Special Nav (Admin/Creator) - only shown if role allows */}
      {specialItems.length > 0 && (
        <>
          <Separator className="bg-gray-800 mx-3" />
          <nav className="px-3 py-2">
            {specialItems.map((item) => {
              const isActive = view === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavClick(item.id)}
                  className={`flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
                  }`}
                  whileHover={{ x: 2 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : ''}`} />
                  {item.label}
                  {item.id === 'admin' && (
                    <Badge className="ml-auto bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0">
                      {userRole === 'admin' ? 'Admin' : 'Mod'}
                    </Badge>
                  )}
                  {item.id === 'creator' && (
                    <Badge className="ml-auto bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] px-1.5 py-0">
                      Studio
                    </Badge>
                  )}
                </motion.button>
              );
            })}
          </nav>
        </>
      )}

      <Separator className="bg-gray-800 mx-3" />

      {/* Playlists */}
      <div className="flex items-center justify-between px-6 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Playlists
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-emerald-400" onClick={() => onPlaylistClick('new')}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-0.5 pb-4">
          <button
            onClick={onLikedClick}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-purple-700 to-blue-300">
              <Heart className="h-4 w-4 text-white" fill="white" />
            </div>
            <span>Músicas Curtidas</span>
          </button>

          {userPlaylists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => onPlaylistClick(playlist.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:text-white ${
                selectedPlaylistId === playlist.id ? 'text-emerald-400' : 'text-gray-400'
              }`}
            >
              {playlist.coverUrl ? (
                <img src={playlist.coverUrl} alt={playlist.name} className="h-8 w-8 rounded object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800">
                  <Music2 className="h-4 w-4 text-gray-500" />
                </div>
              )}
              <span className="truncate">{playlist.name}</span>
            </button>
          ))}

          <button onClick={() => onPlaylistClick('new')} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:text-emerald-400">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800">
              <Plus className="h-4 w-4" />
            </div>
            <span>Criar Playlist</span>
          </button>
        </div>
      </ScrollArea>
      </div>{/* end scrollable area */}

      {/* User Profile - fixed at bottom */}
      <div className="border-t border-gray-800 p-3 shrink-0">
        <button
          onClick={onProfileClick}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-800"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback className="bg-emerald-600 text-white text-xs">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              {userRole === 'admin' && <BadgeCheck className="h-3.5 w-3.5 text-amber-400 fill-amber-400 shrink-0" />}
            </div>
            <div className="flex items-center gap-1">
              <p className={`text-xs ${userPlan !== 'free' ? 'text-emerald-400' : 'text-gray-400'}`}>
                {planLabel}
              </p>
              {roleLabel && (
                <>
                  <span className="text-gray-600 text-xs">•</span>
                  <p className="text-xs text-amber-400">{roleLabel}</p>
                </>
              )}
            </div>
          </div>
          <Settings className="h-4 w-4 text-gray-500" />
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:text-red-400 mt-1"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { view, setView, selectedPlaylistId, setSelectedPlaylistId, showMobileMenu, setShowMobileMenu, user, setUser, setIsAuthenticated } = useAppStore();

  const handleNavClick = (navId: string) => {
    if (navId === 'admin') {
      window.open('/admin', '_blank');
      setShowMobileMenu(false);
      return;
    }
    setView(navId as any);
    setShowMobileMenu(false);
  };

  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setView('playlist');
    setShowMobileMenu(false);
  };

  const handleLikedClick = () => {
    setSelectedPlaylistId('liked');
    setView('playlist');
    setShowMobileMenu(false);
  };

  const handleProfileClick = () => {
    setView('profile');
    setShowMobileMenu(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setView('landing');
    setShowMobileMenu(false);
  };

  const sidebarProps = {
    view,
    selectedPlaylistId,
    userRole: user?.role || 'free',
    userName: user?.name || 'Usuário',
    userAvatar: user?.avatar,
    userPlan: user?.plan || 'free',
    onNavClick: handleNavClick,
    onPlaylistClick: handlePlaylistClick,
    onLikedClick: handleLikedClick,
    onProfileClick: handleProfileClick,
    onLogout: handleLogout,
  };

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-col border-r border-gray-800 fixed left-0 top-0 bottom-0 z-40">
        <SidebarContent {...sidebarProps} />
      </aside>

      <div className="lg:hidden fixed top-3 left-3 z-[60]">
        <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-gray-900/80 backdrop-blur-sm text-white hover:bg-gray-800">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-gray-950 border-gray-800 z-[70]">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent {...sidebarProps} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
