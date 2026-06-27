'use client';

import { useMemo, useEffect, useCallback, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Volume2, VolumeX, Heart, Music2, Maximize2, ChevronDown,
  Mic2, ListMusic, ChevronUp, X, Plus, Radio, Megaphone, Headphones,
  Upload, Clock, Calendar, Bell, Crown, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppStore, usePlayerStore } from '@/stores/app-store';
import { formatDuration, formatPlayCount } from '@/lib/asaas';
import { mockLiveStreams, mockPodcasts, mockPlaylists, mockSongs } from '@/lib/mock-data';
import type { UserType, PodcastEpisodeType, SongType, LiveStreamType } from '@/types';

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

// ===== ROLE PERMISSIONS =====
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  free: ['home', 'search', 'library', 'playlist', 'artist', 'lives', 'podcasts', 'premium', 'profile'],
  premium: ['home', 'search', 'library', 'playlist', 'artist', 'lives', 'podcasts', 'premium', 'profile'],
  creator: ['home', 'search', 'library', 'playlist', 'artist', 'lives', 'podcasts', 'premium', 'profile', 'creator'],
  moderator: ['home', 'search', 'library', 'playlist', 'artist', 'lives', 'podcasts', 'premium', 'profile', 'admin'],
  admin: ['home', 'search', 'library', 'playlist', 'artist', 'lives', 'podcasts', 'premium', 'profile', 'admin', 'creator'],
};

function canAccess(role: string, view: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.free;
  return permissions.includes(view);
}

// ===== MINI PLAYER BAR =====
function MiniPlayerBar() {
  const { currentSong, isPlaying, togglePlay, togglePlayerMinimized } = usePlayerStore();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 h-10 border-t border-white/5 bg-gray-950/95 backdrop-blur-xl flex items-center px-3 gap-3 lg:left-64 left-0">
      <Avatar className="h-7 w-7 rounded shrink-0">
        <AvatarImage src={currentSong.coverUrl} alt={currentSong.title} />
        <AvatarFallback className="bg-emerald-700 text-white rounded">
          <Music2 className="h-3.5 w-3.5" />
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-white truncate">{currentSong.title}</p>
        <p className="text-[10px] text-gray-400 truncate">{currentSong.artistName}</p>
      </div>
      <Button
        size="icon"
        className="h-7 w-7 rounded-full bg-white text-gray-900 hover:scale-105 transition-transform"
        onClick={togglePlay}
      >
        {isPlaying ? <Pause className="h-3.5 w-3.5" fill="currentColor" /> : <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" />}
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-white" onClick={togglePlayerMinimized}>
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ===== PLAYER BAR =====
function PlayerBar() {
  const {
    currentSong, isPlaying, togglePlay, nextSong, prevSong,
    progress, duration, volume, shuffle, repeat, isMuted,
    toggleShuffle, toggleRepeat, toggleMute, setVolume, setProgress,
    showFullPlayer, setShowFullPlayer, playerMinimized, togglePlayerMinimized, clearPlayer,
  } = usePlayerStore();

  if (!currentSong) return null;

  // Show mini player when minimized
  if (playerMinimized) {
    return <MiniPlayerBar />;
  }

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 right-0 z-50 border-t border-white/5 bg-gray-950/95 backdrop-blur-xl lg:left-64 left-0">
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

        <div className="flex flex-col items-center gap-1 w-[40%]">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className={`h-8 w-8 hidden sm:flex ${shuffle ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`} onClick={toggleShuffle}>
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={prevSong}>
              <SkipBack className="h-4 w-4" fill="currentColor" />
            </Button>
            <Button size="icon" className="h-10 w-10 rounded-full bg-white text-gray-900 hover:scale-105 transition-transform shadow-lg" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5 ml-0.5" fill="currentColor" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={nextSong}>
              <SkipForward className="h-4 w-4" fill="currentColor" />
            </Button>
            <Button variant="ghost" size="icon" className={`h-8 w-8 hidden sm:flex ${repeat !== 'none' ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`} onClick={toggleRepeat}>
              {repeat === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </Button>
          </div>
          <div className="hidden sm:flex items-center gap-2 w-full max-w-lg text-xs text-gray-400">
            <span className="w-10 text-right">{formatDuration(progress)}</span>
            <Slider value={[progressPercent]} max={100} step={0.1} className="flex-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-emerald-400 [&_[role=slider]]:border-0" onValueChange={(v) => setProgress((v[0] / 100) * duration)} />
            <span className="w-10">{formatDuration(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-1 sm:gap-2 w-[30%]">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hidden md:flex"><Mic2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hidden md:flex"><ListMusic className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hidden sm:flex" onClick={toggleMute}>
            {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <div className="hidden sm:flex w-24 items-center">
            <Slider value={[isMuted ? 0 : volume * 100]} max={100} step={1} className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-emerald-400 [&_[role=slider]]:border-0" onValueChange={(v) => setVolume(v[0] / 100)} />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={() => setShowFullPlayer(!showFullPlayer)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white" onClick={togglePlayerMinimized} title="Minimizar">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400" onClick={clearPlayer} title="Fechar">
            <X className="h-4 w-4" />
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
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }} className="fixed inset-0 z-[60] bg-gray-950 flex flex-col items-center justify-center p-6">
      <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-white" onClick={() => setShowFullPlayer(false)}>
        <ChevronDown className="h-6 w-6" />
      </Button>
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <Avatar className="h-72 w-72 rounded-lg shadow-2xl">
          <AvatarImage src={currentSong.coverUrl} alt={currentSong.title} />
          <AvatarFallback className="bg-emerald-700 text-white h-72 w-72 rounded-lg"><Music2 className="h-20 w-20" /></AvatarFallback>
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
          <Button variant="ghost" size="icon" className="h-12 w-12 text-gray-400 hover:text-white" onClick={prevSong}><SkipBack className="h-6 w-6" fill="currentColor" /></Button>
          <Button size="icon" className="h-16 w-16 rounded-full bg-white text-gray-900 hover:scale-105 transition-transform shadow-xl" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-7 w-7" fill="currentColor" /> : <Play className="h-7 w-7 ml-1" fill="currentColor" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-12 w-12 text-gray-400 hover:text-white" onClick={nextSong}><SkipForward className="h-6 w-6" fill="currentColor" /></Button>
        </div>
      </div>
    </motion.div>
  );
}

// ===== AD OVERLAY (free users - every 2 songs) =====
const AD_MESSAGES = [
  '🎧 SpotiPlay Premium — Sem anúncios, sem interrupções!',
  '🎶 Curta música sem limites — Assine o Premium!',
  '⚡ Download offline + qualidade máxima — SpotiPlay Premium',
  '🎵 Pule quantas músicas quiser — Upgrade Premium!',
];
const AD_DURATION = 15; // seconds

function AdOverlay() {
  const { isAdPlaying, setIsAdPlaying, resetAdCounter } = usePlayerStore();
  const { setView } = useAppStore();
  const adMsg = AD_MESSAGES[0]; // Deterministic for SSR
  const adStartTime = useRef<number>(0);
  const [countdown, setCountdown] = useState(AD_DURATION);

  // Tick countdown while ad is playing
  useEffect(() => {
    if (!isAdPlaying) return;
    adStartTime.current = Date.now();

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - adStartTime.current) / 1000);
      const remaining = Math.max(0, AD_DURATION - elapsed);
      setCountdown(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [isAdPlaying]);

  // When countdown reaches 0, dismiss the ad
  useEffect(() => {
    if (isAdPlaying && countdown <= 0) {
      setIsAdPlaying(false);
      resetAdCounter();
    }
  }, [isAdPlaying, countdown, setIsAdPlaying, resetAdCounter]);

  // When ad is dismissed, reset countdown for next time
  if (!isAdPlaying) {
    // Reset if needed (only runs when ad is not playing and component might re-mount)
    if (countdown !== AD_DURATION) {
      // Use microtask to avoid setState during render
      queueMicrotask(() => setCountdown(AD_DURATION));
    }
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="max-w-md w-full bg-gray-900 rounded-2xl p-8 text-center border border-white/10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 mb-4">
          <Megaphone className="h-8 w-8 text-amber-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Anúncio</h3>
        <p className="text-sm text-gray-300 mb-6">{adMsg}</p>
        <div className="relative w-full h-2 bg-gray-800 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-amber-500 transition-all duration-1000 ease-linear rounded-full"
            style={{ width: `${((AD_DURATION - countdown) / AD_DURATION) * 100}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Seu conteúdo continua em {countdown}s
        </p>
        <Button
          className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 text-sm"
          onClick={() => {
            setIsAdPlaying(false);
            resetAdCounter();
            setView('premium');
          }}
        >
          <Crown className="h-4 w-4 mr-1" /> Remover Anúncios — Premium
        </Button>
      </div>
    </motion.div>
  );
}

// ===== LIVES VIEW =====
// Unified live stream type for rendering (from mock or DB)
interface UnifiedLiveStream {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description?: string;
  thumbnail?: string;
  streamUrl?: string;
  isLive: boolean;
  isScheduled: boolean;
  scheduledAt?: string;
  viewerCount: number;
  maxViewers: number;
  source: 'db' | 'mock';
}

function LivesView() {
  const { setCurrentSong, setIsPlaying } = usePlayerStore();
  const [dbActiveLives, setDbActiveLives] = useState<UnifiedLiveStream[]>([]);
  const [dbScheduledLives, setDbScheduledLives] = useState<UnifiedLiveStream[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Fetch live streams from the database API
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/lives/active');
        if (res.ok && !cancelled) {
          const data = await res.json();
          // Map DB active lives to UnifiedLiveStream
          const active: UnifiedLiveStream[] = (data.activeLives || []).map((l: Record<string, unknown>) => ({
            id: l.id as string,
            artistId: l.artistId as string,
            artistName: (l.artist as Record<string, unknown>)?.stageName as string || 'Unknown Artist',
            title: l.title as string,
            description: l.description as string | undefined,
            thumbnail: l.thumbnail as string | undefined,
            streamUrl: l.streamUrl as string | undefined,
            isLive: l.isLive as boolean,
            isScheduled: l.isScheduled as boolean,
            scheduledAt: l.scheduledAt as string | undefined,
            viewerCount: l.viewerCount as number,
            maxViewers: l.maxViewers as number,
            source: 'db' as const,
          }));
          // Map DB scheduled lives to UnifiedLiveStream
          const scheduled: UnifiedLiveStream[] = (data.scheduledLives || []).map((l: Record<string, unknown>) => ({
            id: l.id as string,
            artistId: l.artistId as string,
            artistName: (l.artist as Record<string, unknown>)?.stageName as string || 'Unknown Artist',
            title: l.title as string,
            description: l.description as string | undefined,
            thumbnail: l.thumbnail as string | undefined,
            streamUrl: l.streamUrl as string | undefined,
            isLive: l.isLive as boolean,
            isScheduled: l.isScheduled as boolean,
            scheduledAt: l.scheduledAt as string | undefined,
            viewerCount: l.viewerCount as number,
            maxViewers: l.maxViewers as number,
            source: 'db' as const,
          }));
          if (!cancelled) {
            setDbActiveLives(active);
            setDbScheduledLives(scheduled);
          }
        }
      } catch (err) {
        console.error('Failed to fetch active lives:', err);
      }
      if (!cancelled) setLoadingDb(false);
    })();
    return () => { cancelled = true; };
  }, []);

  // Convert mock live streams to UnifiedLiveStream
  const mockActiveUnified: UnifiedLiveStream[] = mockLiveStreams
    .filter(s => s.isLive)
    .map(s => ({ ...s, source: 'mock' as const }));

  const mockScheduledUnified: UnifiedLiveStream[] = mockLiveStreams
    .filter(s => s.isScheduled)
    .map(s => ({ ...s, source: 'mock' as const }));

  // Merge: DB lives first, then mock lives
  const allActiveLives = [...dbActiveLives, ...mockActiveUnified];
  const allScheduledLives = [...dbScheduledLives, ...mockScheduledUnified];

  const handleLiveClick = (stream: UnifiedLiveStream) => {
    const liveSong: SongType = {
      id: `live-${stream.id}`,
      title: `🔴 AO VIVO — ${stream.title}`,
      artistId: stream.artistId,
      artistName: stream.artistName,
      duration: 0, // 0 = live/infinite
      audioUrl: stream.streamUrl || '/audio/live-stream.mp3',
      coverUrl: stream.thumbnail,
      playCount: stream.viewerCount,
      likeCount: 0,
      isExplicit: false,
      status: 'approved',
      genre: 'Live',
    };
    setCurrentSong(liveSong);
    setIsPlaying(true);
  };

  const totalLiveCount = allActiveLives.length;

  return (
    <div className="px-4 pt-2 pb-8 lg:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Lives Agora</h1>
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
          <span className="h-2 w-2 rounded-full bg-red-500 mr-1.5" />
          {totalLiveCount} ao vivo
        </Badge>
      </div>

      {/* Loading state */}
      {loadingDb && (
        <div className="flex items-center gap-2 text-gray-400 mb-4">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Carregando lives...</span>
        </div>
      )}

      {/* Live Now */}
      {allActiveLives.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {allActiveLives.map((stream) => (
            <motion.div key={stream.id} whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <div
                className="group cursor-pointer overflow-hidden rounded-xl bg-gray-800/50 transition-colors hover:bg-gray-700/50"
                onClick={() => handleLiveClick(stream)}
              >
                <div className="relative aspect-video">
                  {stream.thumbnail ? (
                    <img src={stream.thumbnail} alt={stream.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-900 flex items-center justify-center">
                      <Radio className="h-10 w-10 text-red-400" />
                    </div>
                  )}
                  <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> AO VIVO
                  </span>
                  {stream.source === 'db' && (
                    <span className="absolute top-2 right-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white">
                      DB
                    </span>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {formatPlayCount(stream.viewerCount)} assistindo
                  </div>
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
                    <Button
                      size="lg"
                      className="rounded-full bg-emerald-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 h-14 w-14"
                      onClick={(e) => { e.stopPropagation(); handleLiveClick(stream); }}
                    >
                      <Play className="h-6 w-6 ml-0.5" fill="white" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-base font-semibold text-white">{stream.title}</p>
                  <p className="text-sm text-gray-400 mt-1">{stream.artistName}</p>
                  <Button
                    size="sm"
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs gap-1.5"
                    onClick={(e) => { e.stopPropagation(); handleLiveClick(stream); }}
                  >
                    <Radio className="h-3.5 w-3.5" />
                    Ouvir Ao Vivo
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : !loadingDb ? (
        <div className="text-center py-12 text-gray-500">
          <Radio className="h-12 w-12 mx-auto mb-3 text-gray-600" />
          <p className="text-lg font-medium text-gray-400">Nenhuma live no momento</p>
          <p className="text-sm">Volte mais tarde para assistir lives ao vivo</p>
        </div>
      ) : null}

      {/* Scheduled Lives */}
      {allScheduledLives.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-white mb-4">Próximas Lives</h2>
          <div className="space-y-3">
            {allScheduledLives.map((stream) => (
              <div key={stream.id} className="flex items-center gap-4 rounded-xl bg-gray-800/50 p-4 hover:bg-gray-700/50 transition-colors">
                {stream.thumbnail ? (
                  <img src={stream.thumbnail} alt={stream.title} className="h-20 w-32 rounded-lg object-cover" />
                ) : (
                  <div className="h-20 w-32 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
                    <Calendar className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{stream.title}</p>
                  <p className="text-sm text-gray-400">{stream.artistName}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{stream.scheduledAt ? new Date(stream.scheduledAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Data a definir'}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0 border-gray-700 text-gray-300 hover:text-white hover:border-emerald-500">
                  <Bell className="h-4 w-4 mr-1" /> Lembrar
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ===== PODCASTS VIEW =====
function PodcastsView() {
  const { setQueue, setCurrentSong, setIsPlaying } = usePlayerStore();
  const { user, setView } = useAppStore();
  const [selectedPodcast, setSelectedPodcast] = useState<string | null>(null);
  const [uploadDialog, setUploadDialog] = useState(false);

  const playEpisode = (episode: PodcastEpisodeType, podcast: typeof mockPodcasts[0]) => {
    const episodeSong: SongType = {
      id: `pod-${episode.id}`,
      title: episode.title,
      artistId: podcast.artistId,
      artistName: `${podcast.title} • ${podcast.artistName}`,
      duration: episode.duration,
      audioUrl: episode.audioUrl,
      coverUrl: podcast.coverUrl,
      playCount: episode.playCount,
      likeCount: 0,
      isExplicit: false,
      status: 'approved',
      genre: 'Podcast',
    };
    setCurrentSong(episodeSong);
    setIsPlaying(true);
  };

  const playAllEpisodes = (podcast: typeof mockPodcasts[0]) => {
    if (!podcast.episodes || podcast.episodes.length === 0) return;
    const songs: SongType[] = podcast.episodes.map((ep) => ({
      id: `pod-${ep.id}`,
      title: ep.title,
      artistId: podcast.artistId,
      artistName: `${podcast.title} • ${podcast.artistName}`,
      duration: ep.duration,
      audioUrl: ep.audioUrl,
      coverUrl: podcast.coverUrl,
      playCount: ep.playCount,
      likeCount: 0,
      isExplicit: false,
      status: 'approved',
      genre: 'Podcast',
    }));
    setQueue(songs, 0);
  };

  const selected = mockPodcasts.find(p => p.id === selectedPodcast);

  return (
    <div className="px-4 pt-2 pb-8 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Podcasts</h1>
        {(user?.role === 'creator' || user?.role === 'admin') && (
          <Button
            className="bg-emerald-500 text-white hover:bg-emerald-600 gap-1.5"
            onClick={() => setUploadDialog(true)}
          >
            <Upload className="h-4 w-4" /> Upload Episódio
          </Button>
        )}
      </div>

      {/* Live Podcasts Banner */}
      {mockPodcasts.some(p => p.episodes?.some(ep => ep.title.includes('AO VIVO'))) && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Radio className="h-5 w-5 text-red-400" />
            Podcasts Ao Vivo
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {mockPodcasts.filter(p => p.episodes?.some(ep => ep.title.includes('AO VIVO'))).map((podcast) => {
              const liveEp = podcast.episodes?.find(ep => ep.title.includes('AO VIVO'));
              if (!liveEp) return null;
              return (
                <motion.div key={podcast.id} whileHover={{ scale: 1.02 }}>
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-red-500/20 to-gray-800/50 border border-red-500/20 cursor-pointer hover:border-red-500/40 transition-colors"
                    onClick={() => playEpisode(liveEp, podcast)}
                  >
                    <div className="relative shrink-0">
                      <img src={podcast.coverUrl} alt={podcast.title} className="h-16 w-16 rounded-lg object-cover" />
                      <span className="absolute -top-1 -right-1 flex items-center gap-1 rounded-full bg-red-600 px-1.5 py-0.5 text-[8px] font-bold text-white">
                        <span className="h-1 w-1 rounded-full bg-white animate-pulse" /> LIVE
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{liveEp.title}</p>
                      <p className="text-xs text-gray-400 truncate">{podcast.artistName}</p>
                      <p className="text-xs text-red-400 mt-1">🔴 Ao vivo agora</p>
                    </div>
                    <Button size="sm" className="shrink-0 rounded-full bg-red-600 text-white hover:bg-red-700 h-9 w-9 p-0">
                      <Play className="h-4 w-4 ml-0.5" fill="white" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Podcast Detail */}
      {selected && selected.episodes ? (
        <div className="mb-8">
          <button
            onClick={() => setSelectedPodcast(null)}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
          >
            ← Voltar aos podcasts
          </button>
          <div className="flex gap-6 mb-6">
            <img src={selected.coverUrl} alt={selected.title} className="h-40 w-40 rounded-xl object-cover shrink-0" />
            <div className="flex flex-col justify-end min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Podcast</p>
              <h2 className="text-2xl font-bold text-white mb-1">{selected.title}</h2>
              <p className="text-sm text-gray-400 mb-2">{selected.artistName} • {selected.episodes.length} episódios</p>
              <p className="text-xs text-gray-500 mb-3">{selected.description}</p>
              <div className="flex gap-2">
                <Button
                  className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 gap-1.5"
                  onClick={() => playAllEpisodes(selected)}
                >
                  <Play className="h-4 w-4" fill="white" /> Ouvir Tudo
                </Button>
              </div>
            </div>
          </div>

          {/* Episodes List */}
          <div className="space-y-2">
            {selected.episodes.map((ep, i) => (
              <div
                key={ep.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group"
                onClick={() => playEpisode(ep, selected)}
              >
                <span className="text-xs font-bold text-gray-600 w-4 text-center shrink-0">{i + 1}</span>
                <img src={selected.coverUrl} alt={ep.title} className="h-12 w-12 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-emerald-400 transition-colors">{ep.title}</p>
                  <p className="text-xs text-gray-500 truncate">{ep.description}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatDuration(ep.duration)}</span>
                    <span>{formatPlayCount(ep.playCount)} plays</span>
                    {ep.isExclusive && <span className="text-amber-400">Exclusivo</span>}
                  </div>
                </div>
                <Button size="sm" className="shrink-0 rounded-full bg-white/10 text-white hover:bg-emerald-500 h-9 w-9 p-0 opacity-0 group-hover:opacity-100 transition-all">
                  <Play className="h-4 w-4 ml-0.5" fill="white" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* All Podcasts Grid */}
          <h2 className="text-lg font-bold text-white mb-3">Todos os Podcasts</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 mb-8">
            {mockPodcasts.map((podcast) => (
              <div
                key={podcast.id}
                className="group cursor-pointer"
                onClick={() => setSelectedPodcast(podcast.id)}
              >
                <div className="aspect-square overflow-hidden rounded-lg mb-2 relative">
                  <img src={podcast.coverUrl} alt={podcast.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-emerald-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg">
                      <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                  {podcast.isExclusive && (
                    <Badge className="absolute top-2 right-2 bg-amber-500/80 text-white text-[8px]">Exclusivo</Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-white truncate">{podcast.title}</p>
                <p className="text-xs text-gray-400 truncate">{podcast.artistName}</p>
                <p className="text-xs text-gray-500">{podcast.episodes?.length || 0} episódios</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Upload Dialog */}
      {uploadDialog && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setUploadDialog(false)}>
          <div className="max-w-md w-full bg-gray-900 rounded-2xl p-6 border border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Upload de Episódio</h3>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => setUploadDialog(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Título do Episódio *</label>
                <Input placeholder="Ex: Episódio 10 - Entrevista especial" className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Podcast *</label>
                <select className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-3 py-2 text-sm">
                  <option>Selecione o podcast...</option>
                  {mockPodcasts.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Arquivo de Áudio *</label>
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Arraste o arquivo ou clique para selecionar</p>
                  <p className="text-xs text-gray-600 mt-1">MP3, WAV, M4A — Máximo 500MB</p>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Descrição</label>
                <textarea placeholder="Descreva o episódio..." className="w-full rounded-lg bg-gray-800 border-gray-700 text-white px-3 py-2 text-sm h-20 resize-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="exclusive" className="rounded border-gray-700" />
                <label htmlFor="exclusive" className="text-sm text-gray-400">Conteúdo exclusivo Premium</label>
              </div>
              <Button className="w-full rounded-full bg-emerald-500 text-white hover:bg-emerald-600">
                <Upload className="h-4 w-4 mr-1.5" /> Publicar Episódio
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== PROFILE VIEW =====
function ProfileView() {
  const { user, setView, setSelectedPlaylistId, setUser } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setSaveMsg('Selecione uma imagem válida');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setSaveMsg('Imagem muito grande (máximo 10MB)');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        setEditAvatar(data.url);
        setSaveMsg('');
      } else {
        const data = await res.json();
        setSaveMsg(data.error || 'Erro ao enviar imagem');
      }
    } catch {
      setSaveMsg('Erro ao enviar imagem');
    }
    setUploadingAvatar(false);
    // Reset input so the same file can be selected again
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, name: editName, avatar: editAvatar }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser({ ...user, name: data.user.name, avatar: data.user.avatar } as UserType);
        setSaveMsg('Perfil salvo com sucesso!');
        setEditing(false);
      } else {
        setSaveMsg('Erro ao salvar perfil');
      }
    } catch {
      setSaveMsg('Erro ao salvar perfil');
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 3000);
  };

  return (
    <div className="px-4 pt-2 pb-8 lg:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 mb-8 relative">
          <div className="relative group">
            <Avatar className="h-32 w-32">
              <AvatarImage src={editing ? editAvatar || undefined : user?.avatar} alt={user?.name || 'User'} />
              <AvatarFallback className="bg-emerald-700 text-white text-3xl h-32 w-32">
                {(user?.name || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {editing && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                onClick={() => !uploadingAvatar && avatarInputRef.current?.click()}
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <span className="text-xs text-white font-medium">📷 Trocar foto</span>
                )}
              </div>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarUpload}
            />
          </div>

          {editing ? (
            <div className="w-full max-w-sm space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Nome</label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white text-center text-lg"
                  placeholder="Seu nome"
                />
              </div>
              {editAvatar && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700">
                  <img src={editAvatar} alt="Preview" className="h-8 w-8 rounded-full object-cover" />
                  <span className="text-xs text-gray-400 truncate flex-1">{editAvatar}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-500 hover:text-red-400"
                    onClick={() => setEditAvatar('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  className="flex-1 rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
                  onClick={handleSaveProfile}
                  disabled={saving}
                >
                  {saving ? <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Salvando...</> : 'Salvar'}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-full border-gray-700 text-gray-300 hover:text-white"
                  onClick={() => { setEditing(false); setEditName(user?.name || ''); setEditAvatar(user?.avatar || ''); }}
                >
                  Cancelar
                </Button>
              </div>
              {saveMsg && (
                <p className={`text-sm text-center ${saveMsg.includes('sucesso') ? 'text-emerald-400' : 'text-red-400'}`}>{saveMsg}</p>
              )}
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white">{user?.name || 'Usuário'}</h1>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">@{user?.username || 'user'}</span>
                <span className="text-gray-600">•</span>
                <span className={`text-sm font-medium ${user?.plan === 'free' ? 'text-gray-400' : 'text-emerald-400'}`}>
                  {user?.plan === 'free' ? 'Plano Free' : 'Premium'}
                </span>
                {user?.role === 'admin' && (
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-medium">Admin</span>
                )}
                {user?.role === 'creator' && (
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-medium">Criador</span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-gray-700 text-gray-300 hover:text-white hover:border-emerald-500 gap-1.5"
                onClick={() => setEditing(true)}
              >
                ✏️ Editar Perfil
              </Button>
            </>
          )}
        </div>

        {/* Minhas Playlists */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-white mb-4">Minhas Playlists</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Músicas Curtidas Card */}
            <button
              onClick={() => {
                setSelectedPlaylistId('liked');
                setView('playlist');
              }}
              className="group cursor-pointer"
            >
              <div className="aspect-square overflow-hidden rounded-lg mb-2 flex items-center justify-center bg-gradient-to-br from-purple-700 to-blue-300 relative">
                <Heart className="h-12 w-12 text-white" fill="white" />
              </div>
              <p className="text-sm font-semibold text-white truncate">Músicas Curtidas</p>
              <p className="text-xs text-gray-400 truncate">Playlist • 12 músicas</p>
            </button>

            {/* Criar Playlist Card */}
            <button className="group cursor-pointer">
              <div className="aspect-square overflow-hidden rounded-lg mb-2 flex items-center justify-center bg-gray-800/50 border-2 border-dashed border-gray-700 hover:border-emerald-500/50 transition-colors">
                <Plus className="h-10 w-10 text-gray-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <p className="text-sm font-semibold text-gray-400 group-hover:text-emerald-400 truncate transition-colors">Criar Playlist</p>
              <p className="text-xs text-gray-500 truncate">Monte sua playlist</p>
            </button>

            {/* Mock Playlists */}
            {mockPlaylists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => {
                  setSelectedPlaylistId(playlist.id);
                  setView('playlist');
                }}
                className="group cursor-pointer"
              >
                <div className="aspect-square overflow-hidden rounded-lg mb-2">
                  {playlist.coverUrl ? (
                    <img src={playlist.coverUrl} alt={playlist.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                      <Music2 className="h-10 w-10 text-gray-600" />
                    </div>
                  )}
                </div>
                <p className="text-sm font-semibold text-white truncate">{playlist.name}</p>
                <p className="text-xs text-gray-400 truncate">{playlist.description} • {playlist.songCount || 0} músicas</p>
              </button>
            ))}
          </div>
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
  const { currentSong, setDuration, setProgress, isPlaying, songsPlayedSinceAd, incrementSongsPlayed, setIsAdPlaying } = usePlayerStore();

  // Simulate song progress
  useEffect(() => {
    if (!isPlaying || !currentSong) return;
    const interval = setInterval(() => { setProgress(1); }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, currentSong, setProgress]);

  // Track songs played and trigger ads for free users every 2 songs
  useEffect(() => {
    if (!currentSong || currentSong.genre === 'Live' || currentSong.genre === 'Podcast') return;
    // Only count when a new song starts playing
    incrementSongsPlayed();
  }, [currentSong?.id]);

  useEffect(() => {
    // Show ad every 2 songs for free plan users
    if (user?.plan !== 'free' && user?.role !== 'free') return;
    if (songsPlayedSinceAd > 0 && songsPlayedSinceAd % 2 === 0) {
      setIsAdPlaying(true);
    }
  }, [songsPlayedSinceAd, user?.plan, user?.role, setIsAdPlaying]);

  // Handle successful login from API
  const handleLoginSuccess = useCallback((user: UserType) => {
    setUser(user);
    setIsAuthenticated(true);
    setView('home');
    setShowAuthModal(false);
  }, [setUser, setIsAuthenticated, setView, setShowAuthModal]);

  // Handle get started (from landing page)
  const handleGetStarted = useCallback(() => {
    setAuthMode('register');
    setShowAuthModal(true);
  }, [setAuthMode, setShowAuthModal]);

  // Handle "Entrar" click (from landing page nav)
  const handleLoginClick = useCallback(() => {
    setAuthMode('login');
    setShowAuthModal(true);
  }, [setAuthMode, setShowAuthModal]);

  // Auto-set duration when song changes
  useEffect(() => {
    if (currentSong) setDuration(currentSong.duration);
  }, [currentSong, setDuration]);

  // Redirect if user doesn't have permission for current view
  useEffect(() => {
    if (isAuthenticated && user && !canAccess(user.role, view)) {
      setView('home');
    }
  }, [isAuthenticated, user, view, setView]);

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
      case 'admin': return user?.role === 'admin' || user?.role === 'moderator' ? <AdminPanel /> : <HomeView />;
      case 'creator': return user?.role === 'admin' || user?.role === 'creator' ? <CreatorPanel /> : <HomeView />;
      default: return <HomeView />;
    }
  }, [view, user?.role]);

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950">
        <LandingPage onGetStarted={handleGetStarted} onLogin={handleLoginClick} />
        <AuthModal
          open={showAuthModal}
          onOpenChange={(open) => {
            setShowAuthModal(open);
          }}
          mode={authMode}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  // App view
  return (
    <div className="flex h-screen flex-col bg-gray-950 text-white">
      <div className="flex flex-1 overflow-hidden lg:ml-64">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:pb-24 pb-16">
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
      <PlayerBar />
      <AdOverlay />
      <AnimatePresence>
        {usePlayerStore.getState().showFullPlayer && <FullPlayer />}
      </AnimatePresence>
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        mode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
