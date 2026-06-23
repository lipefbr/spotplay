'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Shuffle,
  Heart,
  BadgeCheck,
  Users,
  Clock,
  MoreHorizontal,
  Pause,
  ArrowLeft,
  Music2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAppStore } from '@/stores/app-store';
import { usePlayerStore } from '@/stores/app-store';
import { mockArtists, mockSongs, mockPlaylists } from '@/lib/mock-data';
import { formatPlayCount, formatDuration } from '@/lib/asaas';
import type { SongType, ArtistType } from '@/types';

export default function ArtistView() {
  const { selectedArtistId, setView, setSelectedPlaylistId } = useAppStore();
  const { currentSong, isPlaying, setQueue, togglePlay } = usePlayerStore();
  const [isFollowed, setIsFollowed] = useState(false);

  const artist = useMemo(
    () => mockArtists.find((a) => a.id === selectedArtistId),
    [selectedArtistId]
  );

  const artistSongs = useMemo(
    () => mockSongs.filter((s) => s.artistId === selectedArtistId),
    [selectedArtistId]
  );

  const relatedArtists = useMemo(
    () => mockArtists.filter((a) => a.id !== selectedArtistId).slice(0, 6),
    [selectedArtistId]
  );

  const artistAlbums = useMemo(() => {
    const albumIds = new Set<string>();
    return artistSongs
      .filter((s) => {
        if (s.albumId && !albumIds.has(s.albumId)) {
          albumIds.add(s.albumId);
          return true;
        }
        return false;
      })
      .map((s) => ({
        id: s.albumId || '',
        title: s.albumName || '',
        coverUrl: s.coverUrl,
        artistName: s.artistName,
      }));
  }, [artistSongs]);

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Artista não encontrado</p>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (artistSongs.length > 0) {
      setQueue(artistSongs);
    }
  };

  const handlePlaySong = (song: SongType, index: number) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setQueue(artistSongs, index);
    }
  };

  const isCurrentArtist = artistSongs.some((s) => s.id === currentSong?.id);

  return (
    <div className="pb-8">
      {/* Hero Banner */}
      <div className="relative h-56 sm:h-72 lg:h-80 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={artist.banner}
            alt={artist.stageName}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-black/30"
            onClick={() => setView('home')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Artist Info */}
        <div className="absolute bottom-6 left-4 right-4 z-10 lg:left-6">
          <div className="flex items-center gap-2 mb-2">
            {artist.verified && (
              <BadgeCheck className="h-6 w-6 text-emerald-400 fill-emerald-400" />
            )}
            <span className="text-xs text-gray-300">Artista Verificado</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 lg:text-5xl">
            {artist.stageName}
          </h1>
          <p className="text-sm text-gray-300">
            {formatPlayCount(artist.monthlyListeners)} ouvintes mensais
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 px-4 py-4 lg:px-6">
        <Button
          size="lg"
          className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-transform h-12 px-8"
          onClick={handlePlayAll}
        >
          {isCurrentArtist && isPlaying ? (
            <Pause className="h-5 w-5 mr-2" fill="white" />
          ) : (
            <Play className="h-5 w-5 mr-2 ml-0.5" fill="white" />
          )}
          Play
        </Button>
        <Button
          variant="outline"
          size="lg"
          className={`rounded-full border-2 ${
            isFollowed
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
              : 'border-gray-600 text-white hover:border-white'
          }`}
          onClick={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? 'Seguindo' : 'Seguir'}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Popular Songs */}
      <div className="px-4 lg:px-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Populares</h2>
        <div className="space-y-0.5">
          {artistSongs.slice(0, 5).map((song, index) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className={`group flex items-center gap-3 rounded-md px-2 py-2 transition-colors hover:bg-gray-800/60 ${
                  isCurrent ? 'bg-gray-800/40' : ''
                }`}
              >
                {/* Number / Play */}
                <div className="w-6 flex items-center justify-end">
                  <span className={`text-xs group-hover:hidden ${isCurrent ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {isCurrent && isPlaying ? (
                      <Music2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hidden group-hover:flex text-white hover:text-emerald-400"
                    onClick={() => handlePlaySong(song, index)}
                  >
                    <Play className="h-3.5 w-3.5" fill="currentColor" />
                  </Button>
                </div>

                {/* Cover + Title */}
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                    {song.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate">{song.albumName}</p>
                </div>

                {/* Play Count */}
                <span className="text-xs text-gray-400 hidden sm:block">
                  {formatPlayCount(song.playCount)}
                </span>

                {/* Duration */}
                <span className="text-xs text-gray-400 w-10 text-right">
                  {formatDuration(song.duration)}
                </span>

                {/* Like */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 opacity-0 group-hover:opacity-100 ${song.isLiked ? 'text-emerald-400 opacity-100' : 'text-gray-400 hover:text-emerald-400'}`}
                >
                  <Heart className={`h-3.5 w-3.5 ${song.isLiked ? 'fill-emerald-400' : ''}`} />
                </Button>
              </motion.div>
            );
          })}
        </div>

        {artistSongs.length > 5 && (
          <Button variant="ghost" className="text-sm text-gray-400 hover:text-white mt-2">
            Mostrar mais
          </Button>
        )}
      </div>

      {/* Albums */}
      {artistAlbums.length > 0 && (
        <div className="px-4 lg:px-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Álbuns</h2>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {artistAlbums.map((album) => (
                <motion.div
                  key={album.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Card className="group w-40 shrink-0 cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50 sm:w-44">
                    <div className="relative mb-3 aspect-square overflow-hidden rounded-md">
                      <img
                        src={album.coverUrl}
                        alt={album.title}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500 shadow-lg opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                          <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-white truncate">{album.title}</p>
                    <p className="text-xs text-gray-400 mt-1">Álbum</p>
                  </Card>
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {/* Related Artists */}
      <div className="px-4 lg:px-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Artistas Relacionados</h2>
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {relatedArtists.map((relArtist) => (
              <motion.div
                key={relArtist.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Card
                  className="group w-36 shrink-0 cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50 sm:w-40"
                  onClick={() => {
                    useAppStore.getState().setSelectedArtistId(relArtist.id);
                    useAppStore.getState().setView('artist');
                  }}
                >
                  <div className="relative mb-3 flex justify-center">
                    <Avatar className="h-28 w-28 sm:h-32 sm:w-32">
                      <AvatarImage src={relArtist.avatar} alt={relArtist.stageName} />
                      <AvatarFallback className="bg-emerald-700 text-white text-lg">
                        {relArtist.stageName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {relArtist.verified && (
                      <BadgeCheck className="absolute bottom-0 right-4 h-5 w-5 text-emerald-400 fill-emerald-400" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-white truncate text-center">{relArtist.stageName}</p>
                  <p className="text-xs text-gray-400 text-center mt-1">Artista</p>
                </Card>
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* About */}
      {artist.bio && (
        <div className="px-4 lg:px-6 mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Sobre</h2>
          <Card className="border-0 bg-gray-800/50 p-5 max-w-2xl">
            <p className="text-sm text-gray-300 mb-3">{artist.bio}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {formatPlayCount(artist.monthlyListeners)} ouvintes
              </div>
              <div className="flex items-center gap-1">
                <Music2 className="h-3.5 w-3.5" />
                {formatPlayCount(artist.totalPlays)} plays
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
