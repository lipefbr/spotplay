'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Play,
  Clock,
  Music2,
  BadgeCheck,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/app-store';
import { usePlayerStore } from '@/stores/app-store';
import { useSearchStore } from '@/stores/app-store';
import {
  mockSongs,
  mockArtists,
  mockPlaylists,
  mockPodcasts,
  genres,
} from '@/lib/mock-data';
import { formatDuration, formatPlayCount } from '@/lib/asaas';
import type { SongType } from '@/types';

export default function SearchView() {
  const { setSelectedPlaylistId, setSelectedArtistId, setView } = useAppStore();
  const { setQueue } = usePlayerStore();
  const { query, setQuery, results, setResults, isSearching, setIsSearching, activeTab, setActiveTab } = useSearchStore();

  // Simulate search with mock data
  const performSearch = useCallback((q: string) => {
    if (!q.trim()) {
      setResults({ songs: [], artists: [], playlists: [], podcasts: [] });
      return;
    }

    setIsSearching(true);
    const lower = q.toLowerCase();

    // Simulate delay
    setTimeout(() => {
      const songs = mockSongs.filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.artistName.toLowerCase().includes(lower)
      );
      const artists = mockArtists
        .filter((a) => a.stageName.toLowerCase().includes(lower))
        .map((a) => ({
          id: a.id,
          name: a.stageName,
          avatar: a.avatar,
          verified: a.verified,
        }));
      const playlists = mockPlaylists
        .filter(
          (p) =>
            p.name.toLowerCase().includes(lower) ||
            (p.description && p.description.toLowerCase().includes(lower))
        )
        .map((p) => ({
          id: p.id,
          name: p.name,
          coverUrl: p.coverUrl,
          songCount: p.songCount || 0,
        }));
      const podcasts = mockPodcasts
        .filter(
          (p) =>
            p.title.toLowerCase().includes(lower) ||
            p.artistName.toLowerCase().includes(lower)
        )
        .map((p) => ({
          id: p.id,
          title: p.title,
          coverUrl: p.coverUrl,
        }));

      setResults({ songs, artists, playlists, podcasts });
      setIsSearching(false);
    }, 300);
  }, [setResults, setIsSearching]);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const hasResults = results.songs.length > 0 || results.artists.length > 0 || results.playlists.length > 0 || results.podcasts.length > 0;
  const showResults = query.trim().length > 0;

  const handlePlaySong = (song: SongType) => {
    setQueue([song, ...mockSongs.filter((s) => s.id !== song.id).slice(0, 9)]);
  };

  const tabs = [
    { id: 'all' as const, label: 'Tudo' },
    { id: 'songs' as const, label: 'Músicas' },
    { id: 'artists' as const, label: 'Artistas' },
    { id: 'playlists' as const, label: 'Playlists' },
    { id: 'podcasts' as const, label: 'Podcasts' },
  ];

  return (
    <div className="px-4 pt-2 pb-8 lg:px-6">
      {/* Search Input */}
      <div className="relative mb-6 max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="O que você quer ouvir?"
          className="h-12 rounded-full border-0 bg-gray-800 pl-12 pr-10 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-emerald-500"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-white"
            onClick={() => setQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!showResults ? (
          /* Browse Categories */
          <motion.div
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Navegar por categorias</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {genres.map((genre) => (
                <motion.div
                  key={genre.name}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card className={`relative h-24 cursor-pointer border-0 overflow-hidden bg-gradient-to-br ${genre.color} sm:h-28`}>
                    <div className="absolute inset-0 flex items-end p-3">
                      <span className="text-sm font-bold text-white drop-shadow-lg">{genre.name}</span>
                    </div>
                    <img
                      src={genre.image}
                      alt={genre.name}
                      className="absolute right-0 top-0 h-16 w-16 rotate-12 translate-x-3 -translate-y-1 rounded-md opacity-40 object-cover"
                    />
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Search Results */
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-6">
              <TabsList className="bg-gray-800/50">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-400"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {isSearching ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : !hasResults ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Music2 className="h-12 w-12 text-gray-600 mb-4" />
                <p className="text-lg font-semibold text-white">Nenhum resultado encontrado</p>
                <p className="text-sm text-gray-400 mt-1">
                  Tente buscar por outra coisa
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Songs - show in "all" or "songs" */}
                {(activeTab === 'all' || activeTab === 'songs') && results.songs.length > 0 && (
                  <div>
                    {activeTab === 'all' && (
                      <h3 className="text-lg font-bold text-white mb-3">Músicas</h3>
                    )}
                    <div className="space-y-1">
                      {results.songs.slice(0, activeTab === 'all' ? 4 : undefined).map((song) => (
                        <motion.div
                          key={song.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-gray-800/60"
                        >
                          <div className="relative h-10 w-10 shrink-0">
                            <img
                              src={song.coverUrl}
                              alt={song.title}
                              className="h-full w-full rounded object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100">
                              <Play className="h-4 w-4 text-white" fill="white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{song.title}</p>
                            <p className="text-xs text-gray-400 truncate">
                              {song.artistName} • {song.albumName}
                            </p>
                          </div>
                          {song.isExplicit && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-gray-600 text-gray-400">
                              E
                            </Badge>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatDuration(song.duration)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-emerald-400"
                            onClick={() => handlePlaySong(song)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artists - show in "all" or "artists" */}
                {(activeTab === 'all' || activeTab === 'artists') && results.artists.length > 0 && (
                  <div>
                    {activeTab === 'all' && (
                      <h3 className="text-lg font-bold text-white mb-3">Artistas</h3>
                    )}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.artists.slice(0, activeTab === 'all' ? 4 : undefined).map((artist) => (
                        <motion.div
                          key={artist.id}
                          whileHover={{ scale: 1.03 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Card
                            className="cursor-pointer border-0 bg-gray-800/50 p-4 transition-colors hover:bg-gray-700/50"
                            onClick={() => {
                              setSelectedArtistId(artist.id);
                              setView('artist');
                            }}
                          >
                            <div className="relative mb-3 flex justify-center">
                              <Avatar className="h-24 w-24">
                                <AvatarImage src={artist.avatar} alt={artist.name} />
                                <AvatarFallback className="bg-emerald-700 text-white">
                                  {artist.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {artist.verified && (
                                <BadgeCheck className="absolute bottom-0 right-8 h-5 w-5 text-emerald-400 fill-emerald-400" />
                              )}
                            </div>
                            <p className="text-sm font-semibold text-white truncate text-center">{artist.name}</p>
                            <p className="text-xs text-gray-400 text-center mt-1">Artista</p>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Playlists - show in "all" or "playlists" */}
                {(activeTab === 'all' || activeTab === 'playlists') && results.playlists.length > 0 && (
                  <div>
                    {activeTab === 'all' && (
                      <h3 className="text-lg font-bold text-white mb-3">Playlists</h3>
                    )}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.playlists.slice(0, activeTab === 'all' ? 4 : undefined).map((playlist) => (
                        <motion.div
                          key={playlist.id}
                          whileHover={{ scale: 1.03 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Card
                            className="cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50"
                            onClick={() => {
                              setSelectedPlaylistId(playlist.id);
                              setView('playlist');
                            }}
                          >
                            <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                              <img
                                src={playlist.coverUrl}
                                alt={playlist.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <p className="text-sm font-semibold text-white truncate">{playlist.name}</p>
                            <p className="text-xs text-gray-400 mt-1">{playlist.songCount} músicas</p>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Podcasts - show in "all" or "podcasts" */}
                {(activeTab === 'all' || activeTab === 'podcasts') && results.podcasts.length > 0 && (
                  <div>
                    {activeTab === 'all' && (
                      <h3 className="text-lg font-bold text-white mb-3">Podcasts</h3>
                    )}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                      {results.podcasts.map((podcast) => (
                        <motion.div
                          key={podcast.id}
                          whileHover={{ scale: 1.03 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        >
                          <Card className="cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50">
                            <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                              <img
                                src={podcast.coverUrl}
                                alt={podcast.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <p className="text-sm font-semibold text-white truncate">{podcast.title}</p>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
