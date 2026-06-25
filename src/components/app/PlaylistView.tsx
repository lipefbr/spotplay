'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Shuffle,
  Heart,
  Clock,
  MoreHorizontal,
  Music2,
  ArrowLeft,
  Pause,
  Plus,
  Globe,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/stores/app-store';
import { usePlayerStore } from '@/stores/app-store';
import { mockPlaylists, mockSongs } from '@/lib/mock-data';
import { formatDuration, formatPlayCount } from '@/lib/asaas';
import { useToast } from '@/hooks/use-toast';
import type { SongType } from '@/types';

// ===== CREATE PLAYLIST FORM =====
function CreatePlaylistForm() {
  const { setView, setSelectedPlaylistId } = useAppStore();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    toast({
      title: 'Playlist criada com sucesso!',
      description: `"${name}" foi adicionada à sua biblioteca.`,
    });
    setSelectedPlaylistId(null);
    setView('library');
  };

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 h-72 bg-gradient-to-b from-emerald-800/40 to-gray-950" style={{ zIndex: 0 }} />
        <div className="relative z-10 px-4 pt-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="mb-4 text-gray-400 hover:text-white"
            onClick={() => { setSelectedPlaylistId(null); setView('library'); }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-lg shadow-2xl sm:h-52 sm:w-52 bg-gray-800 flex items-center justify-center">
              <Plus className="h-16 w-16 text-emerald-400" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-600 mb-2">
                Nova Playlist
              </Badge>
              <h1 className="text-2xl font-bold text-white mb-2 lg:text-4xl">
                Criar Playlist
              </h1>
              <p className="text-sm text-gray-300">
                Monte sua playlist personalizada
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 lg:px-6 mt-6 max-w-xl">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Detalhes da Playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="playlist-name" className="text-gray-300">Nome da Playlist</Label>
                <Input
                  id="playlist-name"
                  placeholder="Ex: Minhas Favoritas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="playlist-desc" className="text-gray-300">Descrição</Label>
                <Textarea
                  id="playlist-desc"
                  placeholder="O que torna esta playlist especial?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-800/50 p-4">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">
                      {isPublic ? 'Pública' : 'Privada'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {isPublic ? 'Qualquer pessoa pode encontrar' : 'Apenas você pode ver'}
                    </p>
                  </div>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  disabled={!name.trim()}
                >
                  Criar Playlist
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onClick={() => { setSelectedPlaylistId(null); setView('library'); }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===== MAIN PLAYLIST VIEW =====
export default function PlaylistView() {
  const { selectedPlaylistId, setView } = useAppStore();
  const { currentSong, isPlaying, setQueue, togglePlay, setCurrentSong } = usePlayerStore();

  // Find playlist or use liked songs
  const playlist = useMemo(() => {
    if (selectedPlaylistId === 'liked') {
      const liked = mockSongs.filter((s) => s.isLiked);
      return {
        id: 'liked',
        name: 'Músicas Curtidas',
        description: 'Suas músicas favoritas',
        coverUrl: '',
        songs: liked,
        songCount: liked.length,
        playCount: 0,
        userName: 'Você',
        isLiked: true,
      };
    }
    const found = mockPlaylists.find((p) => p.id === selectedPlaylistId);
    if (found) {
      return {
        ...found,
        songs: mockSongs.slice(0, found.songCount || 6),
        isLiked: false,
      };
    }
    return null;
  }, [selectedPlaylistId]);

  const songs = playlist?.songs || [];
  const totalDuration = useMemo(
    () => songs.reduce((acc, s) => acc + s.duration, 0),
    [songs]
  );

  // Show create playlist form if selectedPlaylistId is 'new'
  if (selectedPlaylistId === 'new') {
    return <CreatePlaylistForm />;
  }

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Playlist não encontrada</p>
      </div>
    );
  }

  const handlePlayAll = () => {
    if (songs.length > 0) {
      setQueue(songs);
    }
  };

  const handlePlaySong = (song: SongType, index: number) => {
    if (currentSong?.id === song.id) {
      togglePlay();
    } else {
      setQueue(songs, index);
    }
  };

  const isCurrentPlaylist = songs.some((s) => s.id === currentSong?.id);

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="relative">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 h-72 bg-gradient-to-b from-emerald-800/40 to-gray-950"
          style={{ zIndex: 0 }}
        />

        <div className="relative z-10 px-4 pt-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="mb-4 text-gray-400 hover:text-white"
            onClick={() => setView('home')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            {/* Cover */}
            <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-lg shadow-2xl sm:h-52 sm:w-52">
              {selectedPlaylistId === 'liked' ? (
                <div className="h-full w-full bg-gradient-to-br from-purple-700 to-blue-300 flex items-center justify-center">
                  <Heart className="h-16 w-16 text-white" fill="white" />
                </div>
              ) : (
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <Badge variant="outline" className="text-xs text-gray-300 border-gray-600 mb-2">
                Playlist
              </Badge>
              <h1 className="text-2xl font-bold text-white mb-2 lg:text-4xl">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-sm text-gray-300 mb-3">{playlist.description}</p>
              )}
              <div className="flex items-center gap-2 justify-center sm:justify-start text-xs text-gray-400">
                <span className="font-medium text-white">{playlist.userName}</span>
                <span>•</span>
                <span>{playlist.songCount} músicas</span>
                {playlist.playCount > 0 && (
                  <>
                    <span>•</span>
                    <span>{formatPlayCount(playlist.playCount)} plays</span>
                  </>
                )}
                <span>•</span>
                <span>~{Math.floor(totalDuration / 60)} min</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              size="lg"
              className="rounded-full bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 transition-transform h-12 w-12 p-0"
              onClick={handlePlayAll}
            >
              {isCurrentPlaylist && isPlaying ? (
                <Pause className="h-5 w-5" fill="white" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" fill="white" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-400 hover:text-emerald-400"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-400 hover:text-emerald-400"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-gray-400 hover:text-white"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="px-4 lg:px-6 mt-2">
        {/* Column Headers */}
        <div className="grid grid-cols-[2rem_1fr_1fr_auto] gap-4 px-2 py-2 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-800 mb-1 sm:grid-cols-[2rem_1fr_1fr_auto]">
          <span className="text-right">#</span>
          <span>Título</span>
          <span className="hidden sm:block">Álbum</span>
          <span>
            <Clock className="h-4 w-4" />
          </span>
        </div>

        <div className="space-y-0.5">
          {songs.map((song, index) => {
            const isCurrent = currentSong?.id === song.id;
            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.02 }}
                className={`group grid grid-cols-[2rem_1fr_1fr_auto] gap-4 rounded-md px-2 py-2 transition-colors hover:bg-gray-800/60 sm:grid-cols-[2rem_1fr_1fr_auto] ${
                  isCurrent ? 'bg-gray-800/40' : ''
                }`}
                onDoubleClick={() => handlePlaySong(song, index)}
              >
                {/* Number / Play */}
                <div className="flex items-center justify-end">
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

                {/* Title & Artist */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="h-10 w-10 shrink-0 rounded object-cover"
                  />
                  <div className="min-w-0">
                    <p className={`text-sm font-medium truncate ${isCurrent ? 'text-emerald-400' : 'text-white'}`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {song.artistName}
                      {song.isExplicit && (
                        <Badge variant="outline" className="ml-1 text-[9px] px-1 py-0 border-gray-600 text-gray-400">
                          E
                        </Badge>
                      )}
                    </p>
                  </div>
                </div>

                {/* Album */}
                <div className="hidden sm:flex items-center">
                  <span className="text-xs text-gray-400 truncate">{song.albumName}</span>
                </div>

                {/* Duration & Like */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 opacity-0 group-hover:opacity-100 ${song.isLiked ? 'text-emerald-400 opacity-100' : 'text-gray-400 hover:text-emerald-400'}`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${song.isLiked ? 'fill-emerald-400' : ''}`} />
                  </Button>
                  <span className="text-xs text-gray-400 w-10 text-right">
                    {formatDuration(song.duration)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-white"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
