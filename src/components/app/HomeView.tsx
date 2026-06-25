'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  ChevronRight,
  Radio,
  BadgeCheck,
  Podcast,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useAppStore } from '@/stores/app-store';
import { usePlayerStore } from '@/stores/app-store';
import {
  mockSongs,
  mockArtists,
  mockPlaylists,
  mockPodcasts,
  mockLiveStreams,
  genres,
} from '@/lib/mock-data';
import { formatPlayCount } from '@/lib/asaas';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function HorizontalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs uppercase tracking-wider">
          Ver tudo <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-4">
          {children}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}

function PlaylistCard({ playlist, onClick }: { playlist: typeof mockPlaylists[0]; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        className="group relative w-40 shrink-0 cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50 sm:w-44"
        onClick={onClick}
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
              onClick={(e) => { e.stopPropagation(); }}
            >
              <Play className="h-4 w-4 ml-0.5" fill="white" />
            </Button>
          </div>
        </div>
        <p className="text-sm font-semibold text-white truncate">{playlist.name}</p>
        <p className="text-xs text-gray-400 truncate mt-1">{playlist.description}</p>
      </Card>
    </motion.div>
  );
}

function ArtistCard({ artist, onClick }: { artist: typeof mockArtists[0]; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        className="group w-36 shrink-0 cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50 sm:w-40"
        onClick={onClick}
      >
        <div className="relative mb-3 flex justify-center">
          <Avatar className="h-28 w-28 sm:h-32 sm:w-32">
            <AvatarImage src={artist.avatar} alt={artist.stageName} />
            <AvatarFallback className="bg-emerald-700 text-white text-lg">
              {artist.stageName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {artist.verified && (
            <BadgeCheck className="absolute bottom-0 right-4 h-5 w-5 text-emerald-400 fill-emerald-400" />
          )}
        </div>
        <p className="text-sm font-semibold text-white truncate text-center">{artist.stageName}</p>
        <p className="text-xs text-gray-400 text-center mt-1">Artista</p>
      </Card>
    </motion.div>
  );
}

function QuickPlayCard({ playlist, onClick }: { playlist: typeof mockPlaylists[0]; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex items-center gap-3 rounded-md bg-gray-800/60 transition-colors hover:bg-gray-700/60 overflow-hidden group"
      onClick={onClick}
    >
      <img
        src={playlist.coverUrl}
        alt={playlist.name}
        className="h-12 w-12 shrink-0 object-cover sm:h-14 sm:w-14"
      />
      <span className="flex-1 text-left text-xs font-semibold text-white truncate pr-2 sm:text-sm">{playlist.name}</span>
      <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 shadow-lg">
          <Play className="h-3.5 w-3.5 text-white ml-0.5" fill="white" />
        </div>
      </div>
    </motion.button>
  );
}

function GenreCard({ genre }: { genre: typeof genres[0] }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className={`relative h-28 w-36 shrink-0 cursor-pointer border-0 overflow-hidden bg-gradient-to-br ${genre.color} sm:w-40`}>
        <div className="absolute inset-0 flex items-end p-3">
          <span className="text-sm font-bold text-white drop-shadow-lg">{genre.name}</span>
        </div>
        <img
          src={genre.image}
          alt={genre.name}
          className="absolute right-0 top-0 h-20 w-20 rotate-12 translate-x-4 -translate-y-2 rounded-md opacity-40 object-cover"
        />
      </Card>
    </motion.div>
  );
}

function LiveCard({ stream, onClick }: { stream: typeof mockLiveStreams[0]; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        className="group w-64 shrink-0 cursor-pointer border-0 bg-gray-800/50 overflow-hidden transition-colors hover:bg-gray-700/50 sm:w-72"
        onClick={onClick}
      >
        <div className="relative aspect-video">
          <img
            src={stream.thumbnail}
            alt={stream.title}
            className="h-full w-full object-cover"
          />
          {stream.isLive && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white text-[10px] px-2">
              <Radio className="h-3 w-3 mr-1" /> AO VIVO
            </Badge>
          )}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
            {formatPlayCount(stream.viewerCount)} assistindo
          </div>
          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-colors">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500 shadow-lg opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
              <Play className="h-4 w-4 text-white ml-0.5" fill="white" />
            </div>
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-white truncate">{stream.title}</p>
          <p className="text-xs text-gray-400 mt-1">{stream.artistName}</p>
          <button
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-red-700 transition-colors"
            onClick={(e) => { e.stopPropagation(); onClick(); }}
          >
            <Radio className="h-3 w-3" /> Ouvir Ao Vivo
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

export default function HomeView() {
  const { setView, setSelectedPlaylistId, setSelectedArtistId } = useAppStore();
  const { setQueue } = usePlayerStore();

  const greeting = useMemo(() => getGreeting(), []);
  const quickPlayItems = useMemo(() => mockPlaylists.slice(0, 6), []);
  const madeForYou = useMemo(() => mockPlaylists, []);
  const newReleases = useMemo(() => mockPlaylists.slice(0, 5), []);
  const popularArtists = useMemo(() => mockArtists.slice(0, 6), []);

  const handlePlayPlaylist = (playlist: typeof mockPlaylists[0]) => {
    if (playlist.songs && playlist.songs.length > 0) {
      setQueue(playlist.songs);
    } else {
      setQueue(mockSongs.slice(0, 5));
    }
  };

  return (
    <div className="px-4 pt-2 pb-8 lg:px-6">
      {/* Greeting */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-white mb-6 lg:text-3xl"
      >
        {greeting}
      </motion.h1>

      {/* Quick Play Cards */}
      <div className="grid grid-cols-2 gap-2 mb-8 sm:grid-cols-3">
        {quickPlayItems.map((playlist) => (
          <QuickPlayCard
            key={playlist.id}
            playlist={playlist}
            onClick={() => {
              setSelectedPlaylistId(playlist.id);
              setView('playlist');
            }}
          />
        ))}
      </div>

      {/* Feito para Você */}
      <HorizontalSection title="Feito para Você">
        {madeForYou.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onClick={() => {
              setSelectedPlaylistId(playlist.id);
              setView('playlist');
            }}
          />
        ))}
      </HorizontalSection>

      {/* Lançamentos */}
      <HorizontalSection title="Lançamentos">
        {newReleases.map((playlist, i) => (
          <PlaylistCard
            key={playlist.id}
            playlist={{
              ...playlist,
              name: ['Noites de São Paulo', 'Céu Aberto', 'Ritmo da Cidade', 'Brisa Tropical', 'Mar de Emoções'][i] || playlist.name,
              coverUrl: mockSongs[i]?.coverUrl || playlist.coverUrl,
            }}
            onClick={() => {
              setSelectedPlaylistId(playlist.id);
              setView('playlist');
            }}
          />
        ))}
      </HorizontalSection>

      {/* Artistas Populares */}
      <HorizontalSection title="Artistas Populares">
        {popularArtists.map((artist) => (
          <ArtistCard
            key={artist.id}
            artist={artist}
            onClick={() => {
              setSelectedArtistId(artist.id);
              setView('artist');
            }}
          />
        ))}
      </HorizontalSection>

      {/* Podcasts em Destaque */}
      <HorizontalSection title="Podcasts em Destaque">
        {mockPodcasts.map((podcast) => (
          <motion.div
            key={podcast.id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Card className="group w-40 shrink-0 cursor-pointer border-0 bg-gray-800/50 p-3 transition-colors hover:bg-gray-700/50 sm:w-44">
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
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-emerald-500 shadow-lg opacity-0 transition-all translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                    <Podcast className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold text-white truncate">{podcast.title}</p>
              <p className="text-xs text-gray-400 truncate mt-1">{podcast.artistName}</p>
            </Card>
          </motion.div>
        ))}
      </HorizontalSection>

      {/* Lives Agora */}
      <HorizontalSection title="Lives Agora">
        {mockLiveStreams.map((stream) => (
          <LiveCard
            key={stream.id}
            stream={stream}
            onClick={() => {
              setQueue(mockSongs, 0);
            }}
          />
        ))}
      </HorizontalSection>

      {/* Gêneros */}
      <HorizontalSection title="Gêneros">
        {genres.map((genre) => (
          <GenreCard key={genre.name} genre={genre} />
        ))}
      </HorizontalSection>
    </div>
  );
}
