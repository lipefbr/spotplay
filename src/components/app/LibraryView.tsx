'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Plus,
  Heart,
  Music2,
  Disc3,
  Mic2,
  Podcast,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/stores/app-store';
import { usePlayerStore } from '@/stores/app-store';
import {
  mockSongs,
  mockArtists,
  mockPlaylists,
  mockPodcasts,
} from '@/lib/mock-data';
import { formatPlayCount, formatDuration } from '@/lib/asaas';

export default function LibraryView() {
  const { setSelectedPlaylistId, setSelectedArtistId, setView } = useAppStore();
  const { setQueue } = usePlayerStore();

  const likedSongs = useMemo(() => mockSongs.filter((s) => s.isLiked), []);
  const followedArtists = useMemo(() => mockArtists.slice(0, 4), []);

  return (
    <div className="px-4 pt-2 pb-8 lg:px-6">
      <h1 className="text-2xl font-bold text-white mb-6">Sua Biblioteca</h1>

      <Tabs defaultValue="playlists" className="w-full">
        <TabsList className="bg-gray-800/50 mb-6 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger
            value="playlists"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm"
          >
            Playlists
          </TabsTrigger>
          <TabsTrigger
            value="liked"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm"
          >
            Curtidas
          </TabsTrigger>
          <TabsTrigger
            value="albums"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm"
          >
            Álbuns
          </TabsTrigger>
          <TabsTrigger
            value="artists"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm"
          >
            Artistas
          </TabsTrigger>
          <TabsTrigger
            value="podcasts"
            className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-400 text-xs sm:text-sm"
          >
            Podcasts
          </TabsTrigger>
        </TabsList>

        {/* Playlists Tab */}
        <TabsContent value="playlists">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {/* Create Playlist Card */}
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
              <Card className="flex cursor-pointer flex-col items-center justify-center border-0 bg-gray-800/30 p-6 transition-colors hover:bg-gray-700/30 aspect-square">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-700 mb-3">
                  <Plus className="h-6 w-6 text-emerald-400" />
                </div>
                <p className="text-sm font-semibold text-white">Criar Playlist</p>
              </Card>
            </motion.div>

            {mockPlaylists.map((playlist) => (
              <motion.div
                key={playlist.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card
                  className="group cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50"
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
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                      <Button
                        size="icon"
                        className="h-10 w-10 rounded-full bg-emerald-500 text-white shadow-lg opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQueue(mockSongs);
                        }}
                      >
                        <Play className="h-4 w-4 ml-0.5" fill="white" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{playlist.name}</p>
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {playlist.songCount || 0} músicas
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Liked Songs Tab */}
        <TabsContent value="liked">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-700 to-blue-300">
                <Heart className="h-8 w-8 text-white" fill="white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Músicas Curtidas</h2>
                <p className="text-sm text-gray-400">{likedSongs.length} músicas</p>
              </div>
              <Button
                className="ml-auto rounded-full bg-emerald-500 text-white hover:bg-emerald-600"
                onClick={() => setQueue(likedSongs)}
              >
                <Play className="h-4 w-4 mr-2" fill="white" /> Play
              </Button>
            </div>
          </div>
          <div className="space-y-1">
            {likedSongs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-gray-800/60"
              >
                <span className="w-6 text-right text-xs text-gray-500 group-hover:hidden">
                  {index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hidden group-hover:flex hover:text-emerald-400"
                  onClick={() => setQueue([song, ...likedSongs.filter((s) => s.id !== song.id)])}
                >
                  <Play className="h-3 w-3" />
                </Button>
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{song.title}</p>
                  <p className="text-xs text-gray-400 truncate">{song.artistName}</p>
                </div>
                <span className="text-xs text-gray-400">{formatDuration(song.duration)}</span>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Albums Tab */}
        <TabsContent value="albums">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mockSongs.slice(0, 8).reduce((acc: { albumId: string; albumName: string; coverUrl?: string }[], song) => {
              if (!acc.find((a) => a.albumId === song.albumId)) {
                acc.push({ albumId: song.albumId || '', albumName: song.albumName || '', coverUrl: song.coverUrl });
              }
              return acc;
            }, []).map((album) => (
              <motion.div
                key={album.albumId}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card className="group cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                    <img
                      src={album.coverUrl}
                      alt={album.albumName}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500 shadow-lg opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                        <Disc3 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{album.albumName}</p>
                  <p className="text-xs text-gray-400 mt-1">Álbum</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Artists Tab */}
        <TabsContent value="artists">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {followedArtists.map((artist) => (
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
                  <div className="flex justify-center mb-3">
                    <Avatar className="h-24 w-24 sm:h-28 sm:w-28">
                      <AvatarImage src={artist.avatar} alt={artist.stageName} />
                      <AvatarFallback className="bg-emerald-700 text-white text-lg">
                        {artist.stageName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <p className="text-sm font-semibold text-white truncate text-center">{artist.stageName}</p>
                  <p className="text-xs text-gray-400 text-center mt-1">
                    {formatPlayCount(artist.monthlyListeners)} ouvintes
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Podcasts Tab */}
        <TabsContent value="podcasts">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {mockPodcasts.map((podcast) => (
              <motion.div
                key={podcast.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card className="group cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50">
                  <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                    <img
                      src={podcast.coverUrl}
                      alt={podcast.title}
                      className="h-full w-full object-cover"
                    />
                    {podcast.isExclusive && (
                      <Badge className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px]">
                        Exclusivo
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white truncate">{podcast.title}</p>
                  <p className="text-xs text-gray-400 truncate mt-1">{podcast.artistName}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
