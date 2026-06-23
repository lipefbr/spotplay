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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAppStore } from '@/stores/app-store';
import { mockPlaylists } from '@/lib/mock-data';

const navItems = [
  { id: 'home' as const, label: 'Início', icon: Home },
  { id: 'search' as const, label: 'Buscar', icon: Search },
  { id: 'library' as const, label: 'Sua Biblioteca', icon: Library },
];

const extraNavItems = [
  { id: 'premium' as const, label: 'Premium', icon: Crown },
  { id: 'lives' as const, label: 'Lives', icon: Radio },
  { id: 'podcasts' as const, label: 'Podcasts', icon: Mic2 },
];

const specialNavItems = [
  { id: 'admin' as const, label: 'Admin', icon: Shield },
  { id: 'creator' as const, label: 'Criador', icon: Mic2 },
];

interface SidebarContentProps {
  view: string;
  selectedPlaylistId: string | null;
  onNavClick: (navId: string) => void;
  onPlaylistClick: (playlistId: string) => void;
  onLikedClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

function SidebarContent({
  view,
  selectedPlaylistId,
  onNavClick,
  onPlaylistClick,
  onLikedClick,
  onProfileClick,
  onLogout,
}: SidebarContentProps) {
  const userPlaylists = useMemo(() => mockPlaylists.slice(0, 5), []);

  return (
    <div className="flex h-full flex-col bg-gray-950">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
          <Music2 className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">SoundFlow</span>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 pb-2">
        {navItems.map((item) => {
          const isActive = view === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-gray-400 hover:text-white'
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
      <nav className="px-3 pb-2">
        {extraNavItems.map((item) => {
          const isActive = view === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-emerald-400'
                  : 'text-gray-400 hover:text-white'
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

      <Separator className="bg-gray-800 mx-3" />

      {/* Special Nav (Admin/Creator) */}
      <nav className="px-3 pb-2">
        {specialNavItems.map((item) => {
          const isActive = view === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavClick(item.id)}
              className={`flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'text-amber-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <item.icon className={`h-4 w-4 ${isActive ? 'text-amber-400' : ''}`} />
              {item.label}
            </motion.button>
          );
        })}
      </nav>

      <Separator className="bg-gray-800 mx-3" />

      {/* Playlists */}
      <div className="flex items-center justify-between px-6 py-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Playlists
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-400 hover:text-emerald-400"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-0.5 pb-4">
          {/* Liked Songs */}
          <button
            onClick={onLikedClick}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-purple-700 to-blue-300">
              <Heart className="h-4 w-4 text-white" fill="white" />
            </div>
            <span>Músicas Curtidas</span>
          </button>

          {/* User Playlists */}
          {userPlaylists.map((playlist) => (
            <button
              key={playlist.id}
              onClick={() => onPlaylistClick(playlist.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:text-white ${
                selectedPlaylistId === playlist.id ? 'text-emerald-400' : 'text-gray-400'
              }`}
            >
              {playlist.coverUrl ? (
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="h-8 w-8 rounded object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800">
                  <Music2 className="h-4 w-4 text-gray-500" />
                </div>
              )}
              <span className="truncate">{playlist.name}</span>
            </button>
          ))}

          {/* Create Playlist */}
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:text-emerald-400">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-800">
              <Plus className="h-4 w-4" />
            </div>
            <span>Criar Playlist</span>
          </button>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="border-t border-gray-800 p-3">
        <button
          onClick={onProfileClick}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-800"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop" />
            <AvatarFallback className="bg-emerald-600 text-white text-xs">SF</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Usuário SoundFlow</p>
            <p className="text-xs text-gray-400">Plano Free</p>
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
  const { view, setView, selectedPlaylistId, setSelectedPlaylistId, showMobileMenu, setShowMobileMenu, setUser, setIsAuthenticated } = useAppStore();

  const handleNavClick = (navId: string) => {
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
    onNavClick: handleNavClick,
    onPlaylistClick: handlePlaylistClick,
    onLikedClick: handleLikedClick,
    onProfileClick: handleProfileClick,
    onLogout: handleLogout,
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-gray-800 h-full">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-3 left-3 z-40">
        <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="bg-gray-900/80 backdrop-blur-sm text-white hover:bg-gray-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-gray-950 border-gray-800">
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
