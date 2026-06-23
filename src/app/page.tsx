'use client';

import { useMemo, useEffect, useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, Heart, Music2, Maximize2, Minimize2, ChevronDown,
  Mic2, ListMusic,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore, usePlayerStore } from '@/stores/app-store';
import { formatDuration, formatPlayCount } from '@/lib/asaas';
import { mockLiveStreams, mockSongs, mockPodcasts } from '@/lib/mock-data';

import LandingPage from '@/components/landing/LandingPage';
import AuthModal from '@/components/landing/AuthModal';
import Sidebar from '@/components/app/Sidebar';
import HomeView from '@/components/app/HomeView';
import SearchView from '@/components/app/SearchView';
import LibraryView from '@/components/app/LibraryView';
import PremiumView from '@/components/app/PremiumView';
import PlaylistView from '@/components/app/PlaylistView';
import ArtistView from '@/components/app/ArtistView';
import AdminPanel from '@/components/admin/AdminPanel';
import CreatorPanel from '@/components/creator/CreatorPanel';

// ===== PLAYER BAR =====
function PlayerBar() {
  const {
    currentSong, isPlaying, togglePlay, nextSong, prevSong,
    progress, duration, volume, shuffle, repeat, isMuted,
    toggleShuffle, toggleRepeat, toggleMute, setVolume, setProgress,
    showFullPlayer, setShowFullPlayer,
  } = usePlayerStore();

  if (!currentSong) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-gray-950/95 backdrop-blur-xl">
      {/* Progress Bar */}
      <div
        className="h-1 w-full bg-gray-800 cursor-pointer group"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          setProgress(percent * duration);
        }}
      >
        <div
          className="h-full bg-emerald-500 transition-all group-hover:bg-emerald-400"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center h-[72px] px-3 sm:px-4">
        {/* Song Info */}
        <div className="flex items-center gap-3 w-[30%] min-w-0">
          <Avatar className="h-12 w-12 rounded-md shrink-0">
            <AvatarImage src={currentSong.coverUrl} alt={currentSong.title} />
            <AvatarFallback className="bg-emerald-700 text-white rounded-md">
              <Music2 className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 hidden sm:block">
            <p className="text-sm font-medium text-white truncate">{currentSong.title}</p>
            <p className="text-xs text-gray-400 truncate">{currentSong.artistName}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 shrink-0 hidden sm:flex ${currentSong.isLiked ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Heart className={`h-4 w-4 ${currentSong.isLiked ? 'fill-emerald-400' : ''}`} />
          </Button>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-1 w-[40%]">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 hidden sm:flex ${shuffle ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
              onClick={toggleShuffle}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={prevSong}>
              <SkipBack className="h-4 w-4" fill="currentColor" />
            </Button>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-white text-gray-900 hover:scale-105 transition-transform shadow-lg"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5 ml-0.5" fill="currentColor" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={nextSong}>
              <SkipForward className="h-4 w-4" fill="currentColor" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 hidden sm:flex ${repeat !== 'none' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
              onClick={toggleRepeat}
            >
              {repeat === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </Button>
          </div>
          <div className="hidden sm:flex items-center gap-2 w-full max-w-lg text-xs text-gray-400">
            <span className="w-10 text-right">{formatDuration(progress)}</span>
            <Slider
              value={[progressPercent]}
              max={100}
              step={0.1}
              className="flex-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-emerald-400 [&_[role=slider]]:border-0"
              onValueChange={(v) => setProgress((v[0] / 100) * duration)}
            />
            <span className="w-10">{formatDuration(duration)}</span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center justify-end gap-2 w-[30%]">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hidden md:flex">
            <Mic2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hidden md:flex">
            <ListMusic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white hidden sm:flex"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <div className="hidden sm:flex w-24 items-center">
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-emerald-400 [&_[role=slider]]:border-0"
              onValueChange={(v) => setVolume(v[0] / 100)}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={() => setShowFullPlayer(!showFullPlayer)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ===== FULL PLAYER OVERLAY =====
function FullPlayer() {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong, progress, duration, showFullPlayer, setShowFullPlayer } = usePlayerStore();

  if (!showFullPlayer || !currentSong) return null;

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      className="fixed inset-0 z-[60] bg-gray-950 flex flex-col items-center justify-center p-6"
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
        onClick={() => setShowFullPlayer(false)}
      >
        <ChevronDown className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Avatar className="h-72 w-72 rounded-lg shadow-2xl">
          <AvatarImage src={currentSong.coverUrl} alt={currentSong.title} />
          <AvatarFallback className="bg-emerald-700 text-white h-72 w-72 rounded-lg">
            <Music2 className="h-20 w-20" />
          </AvatarFallback>
        </Avatar>

        <div className="text-center w-full">
          <h2 className="text-2xl font-bold text-white">{currentSong.title}</h2>
          <p className="text-gray-400 mt-1">{currentSong.artistName}</p>
        </div>

        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-gray-400 w-10 text-right">{formatDuration(progress)}</span>
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden cursor-pointer">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="text-xs text-gray-400 w-10">{formatDuration(duration)}</span>
        </div>

        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="h-12 w-12 text-gray-400 hover:text-white" onClick={prevSong}>
            <SkipBack className="h-6 w-6" fill="currentColor" />
          </Button>
          <Button
            size="icon"
            className="h-16 w-16 rounded-full bg-white text-gray-900 hover:scale-105 transition-transform shadow-xl"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-7 w-7" fill="currentColor" /> : <Play className="h-7 w-7 ml-1" fill="currentColor" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 text-gray-400 hover:text-white" onClick={nextSong}>
            <SkipForward className="h-6 w-6" fill="currentColor" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ===== LIVES VIEW =====
function LivesView() {
  const { setView } = useAppStore();
  return (
    <div className="px-4 pt-2 pb-8 lg:px-6">
      <h1 className="text-2xl font-bold text-white mb-6">Lives Agora</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockLiveStreams.map((stream) => (
          <motion.div key={stream.id} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <div className="group cursor-pointer overflow-hidden rounded-xl bg-gray-800/50 transition-colors hover:bg-gray-700/50">
              <div className="relative aspect-video">
                <img src={stream.thumbnail} alt={stream.title} className="h-full w-full object-cover" />
                {stream.isLive && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> AO VIVO
                  </span>
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                  {formatPlayCount(stream.viewerCount)} assistindo
                </div>
              </div>
              <div className="p-4">
                <p className="text-base font-semibold text-white">{stream.title}</p>
                <p className="text-sm text-gray-400 mt-1">{stream.artistName}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ===== PODCASTS VIEW =====
function PodcastsView() {
  return (
    <div className="px-4 pt-2 pb-8 lg:px-6">
      <h1 className="text-2xl font-bold text-white mb-6">Podcasts</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {mockPodcasts.map((podcast) => (
          <div key={podcast.id} className="group cursor-pointer">
            <div className="aspect-square overflow-hidden rounded-lg mb-2">
              <img src={podcast.coverUrl} alt={podcast.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <p className="text-sm font-semibold text-white truncate">{podcast.title}</p>
            <p className="text-xs text-gray-400 truncate">{podcast.artistName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== PROFILE VIEW =====
function ProfileView() {
  const { user } = useAppStore();
  return (
    <div className="px-4 pt-2 pb-8 lg:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
            <AvatarFallback className="bg-emerald-700 text-white text-3xl h-32 w-32">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-white">{user?.name || 'Usuário'}</h1>
          <p className="text-gray-400">@{user?.username || 'user'} • {user?.plan === 'free' ? 'Plano Free' : 'Premium'}</p>
        </div>
      </div>
    </div>
  );
}

// ===== MAIN APP =====
export default function Home() {
  const {
    view, setView, user, setUser, isAuthenticated, setIsAuthenticated,
    showAuthModal, setShowAuthModal, authMode, setAuthMode,
  } = useAppStore();
  const { currentSong, setQueue, setDuration, setProgress, isPlaying, setIsPlaying } = usePlayerStore();

  // Simulate song progress
  useEffect(() => {
    if (!isPlaying || !currentSong) return;
    const interval = setInterval(() => {
      setProgress(1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, setProgress]);

  // Handle login
  const handleLogin = useCallback(() => {
    setUser({
      id: 'u1',
      email: 'user@soundflow.com',
      name: 'Usuário SoundFlow',
      username: 'soundflow_user',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      role: 'free',
      plan: 'free',
      isVerified: true,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
    setIsAuthenticated(true);
    setView('home');
  }, [setUser, setIsAuthenticated, setView]);

  // Handle get started
  const handleGetStarted = useCallback(() => {
    setAuthMode('register');
    setShowAuthModal(true);
  }, [setAuthMode, setShowAuthModal]);

  // Auto-set duration when song changes
  useEffect(() => {
    if (currentSong) {
      setDuration(currentSong.duration);
    }
  }, [currentSong, setDuration]);

  // Main content based on view
  const mainContent = useMemo(() => {
    switch (view) {
      case 'home': return <HomeView />;
      case 'search': return <SearchView />;
      case 'library': return <LibraryView />;
      case 'premium': return <PremiumView />;
      case 'playlist': return <PlaylistView />;
      case 'artist': return <ArtistView />;
      case 'lives': return <LivesView />;
      case 'podcasts': return <PodcastsView />;
      case 'profile': return <ProfileView />;
      case 'admin': return <AdminPanel />;
      case 'creator': return <CreatorPanel />;
      default: return <HomeView />;
    }
  }, [view]);

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950">
        <LandingPage onGetStarted={handleGetStarted} />
        <AuthModal
          open={showAuthModal}
          onOpenChange={(open) => {
            setShowAuthModal(open);
            if (open) {
              // If opening, set mode based on context
            } else {
              // If closing, go to home if authenticated
              if (isAuthenticated) setView('home');
            }
          }}
          mode={authMode}
        />
        {/* Quick demo login button */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={handleLogin}
            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 rounded-full px-6"
          >
            Entrar como Demo
          </Button>
        </div>
      </div>
    );
  }

  // App view
  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="pt-12 lg:pt-0"
            >
              {mainContent}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Player Bar */}
      <PlayerBar />

      {/* Full Player Overlay */}
      <AnimatePresence>
        {usePlayerStore.getState().showFullPlayer && <FullPlayer />}
      </AnimatePresence>

      {/* Auth Modal for logged in users */}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        mode={authMode}
      />
    </div>
  );
}
