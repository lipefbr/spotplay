import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppView, SongType, UserType } from '@/types';

// ===== APP NAVIGATION STORE =====

interface AppState {
  view: AppView;
  setView: (view: AppView) => void;
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (val: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
  selectedArtistId: string | null;
  setSelectedArtistId: (id: string | null) => void;
  selectedAlbumId: string | null;
  setSelectedAlbumId: (id: string | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (val: boolean) => void;
  showMobileMenu: boolean;
  setShowMobileMenu: (val: boolean) => void;
  _hasHydrated: boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      view: 'landing',
      setView: (view) => set({ view }),
      user: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      isAuthenticated: false,
      setIsAuthenticated: (val) => set({ isAuthenticated: val }),
      showAuthModal: false,
      setShowAuthModal: (val) => set({ showAuthModal: val }),
      authMode: 'login',
      setAuthMode: (mode) => set({ authMode: mode }),
      selectedPlaylistId: null,
      setSelectedPlaylistId: (id) => set({ selectedPlaylistId: id }),
      selectedArtistId: null,
      setSelectedArtistId: (id) => set({ selectedArtistId: id }),
      selectedAlbumId: null,
      setSelectedAlbumId: (id) => set({ selectedAlbumId: id }),
      sidebarCollapsed: false,
      setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
      showMobileMenu: false,
      setShowMobileMenu: (val) => set({ showMobileMenu: val }),
      _hasHydrated: false,
    }),
    {
      name: 'soundflow-auth',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return undefined as any;
      }),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        view: state.isAuthenticated ? state.view : undefined,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);

// ===== PLAYER STORE =====

interface PlayerStoreState {
  currentSong: SongType | null;
  queue: SongType[];
  queueIndex: number;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  isMuted: boolean;
  showFullPlayer: boolean;
  playerMinimized: boolean;
  songsPlayedSinceAd: number;
  isAdPlaying: boolean;

  setCurrentSong: (song: SongType) => void;
  setQueue: (songs: SongType[], startIndex?: number) => void;
  togglePlay: () => void;
  setIsPlaying: (val: boolean) => void;
  setVolume: (vol: number) => void;
  setProgress: (prog: number) => void;
  setDuration: (dur: number) => void;
  nextSong: () => void;
  prevSong: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleMute: () => void;
  setShowFullPlayer: (val: boolean) => void;
  togglePlayerMinimized: () => void;
  clearPlayer: () => void;
  incrementSongsPlayed: () => void;
  setIsAdPlaying: (val: boolean) => void;
  resetAdCounter: () => void;
}

export const usePlayerStore = create<PlayerStoreState>()(
  persist(
    (set, get) => ({
      currentSong: null,
      queue: [],
      queueIndex: -1,
      isPlaying: false,
      volume: 0.7,
      progress: 0,
      duration: 0,
      shuffle: false,
      repeat: 'none',
      isMuted: false,
      showFullPlayer: false,
      playerMinimized: false,
      songsPlayedSinceAd: 0,
      isAdPlaying: false,

      setCurrentSong: (song) => set({ currentSong: song }),
      setQueue: (songs, startIndex = 0) => set({
        queue: songs,
        queueIndex: startIndex,
        currentSong: songs[startIndex] || null,
        isPlaying: true,
      }),
      togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),
      setIsPlaying: (val) => set({ isPlaying: val }),
      setVolume: (vol) => set({ volume: vol, isMuted: vol === 0 }),
      setProgress: (prog) => set({ progress: prog }),
      setDuration: (dur) => set({ duration: dur }),
      nextSong: () => {
        const { queue, queueIndex, shuffle, repeat } = get();
        if (queue.length === 0) return;

        if (repeat === 'one') {
          set({ progress: 0 });
          return;
        }

        let nextIndex: number;
        if (shuffle) {
          nextIndex = Math.floor(Math.random() * queue.length);
        } else {
          nextIndex = queueIndex + 1;
          if (nextIndex >= queue.length) {
            if (repeat === 'all') {
              nextIndex = 0;
            } else {
              set({ isPlaying: false });
              return;
            }
          }
        }
        set({ queueIndex: nextIndex, currentSong: queue[nextIndex], progress: 0 });
      },
      prevSong: () => {
        const { queue, queueIndex, progress } = get();
        if (queue.length === 0) return;
        if (progress > 3) {
          set({ progress: 0 });
          return;
        }
        const prevIndex = Math.max(0, queueIndex - 1);
        set({ queueIndex: prevIndex, currentSong: queue[prevIndex], progress: 0 });
      },
      toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),
      toggleRepeat: () => set((s) => ({
        repeat: s.repeat === 'none' ? 'all' : s.repeat === 'all' ? 'one' : 'none',
      })),
      toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),
      setShowFullPlayer: (val) => set({ showFullPlayer: val }),
      togglePlayerMinimized: () => set((s) => ({ playerMinimized: !s.playerMinimized })),
      clearPlayer: () => set({
        currentSong: null,
        queue: [],
        queueIndex: -1,
        isPlaying: false,
        progress: 0,
        duration: 0,
        showFullPlayer: false,
        playerMinimized: false,
        songsPlayedSinceAd: 0,
        isAdPlaying: false,
      }),
      incrementSongsPlayed: () => set((s) => ({ songsPlayedSinceAd: s.songsPlayedSinceAd + 1 })),
      setIsAdPlaying: (val) => set({ isAdPlaying: val }),
      resetAdCounter: () => set({ songsPlayedSinceAd: 0 }),
    }),
    {
      name: 'soundflow-player',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return undefined as any;
      }),
      partialize: (state) => ({
        currentSong: state.currentSong,
        queue: state.queue,
        queueIndex: state.queueIndex,
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
        isMuted: state.isMuted,
        playerMinimized: state.playerMinimized,
        songsPlayedSinceAd: state.songsPlayedSinceAd,
      }),
      // On rehydrate, always start paused with progress reset
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isPlaying = false;
          state.progress = 0;
        }
      },
    }
  )
);

// ===== SEARCH STORE =====

interface SearchState {
  query: string;
  results: {
    songs: SongType[];
    artists: { id: string; name: string; avatar?: string; verified: boolean }[];
    playlists: { id: string; name: string; coverUrl?: string; songCount: number }[];
    podcasts: { id: string; title: string; coverUrl?: string }[];
  };
  isSearching: boolean;
  activeTab: 'all' | 'songs' | 'artists' | 'playlists' | 'podcasts';
  setQuery: (q: string) => void;
  setResults: (results: SearchState['results']) => void;
  setIsSearching: (val: boolean) => void;
  setActiveTab: (tab: SearchState['activeTab']) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: { songs: [], artists: [], playlists: [], podcasts: [] },
  isSearching: false,
  activeTab: 'all',
  setQuery: (q) => set({ query: q }),
  setResults: (results) => set({ results }),
  setIsSearching: (val) => set({ isSearching: val }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
