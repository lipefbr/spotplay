import type { SongType, ArtistType, PlaylistType, PodcastType, LiveStreamType, SubscriptionPlan } from '@/types';

// ===== MOCK SONGS =====

export const mockSongs: SongType[] = [
  {
    id: 's1', title: 'Noites de São Paulo', artistId: 'a1', artistName: 'Lucas Mendes',
    albumId: 'al1', albumName: 'Urbanidade', duration: 234, audioUrl: '/audio/s1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'MPB', playCount: 1523456, likeCount: 89012, isExplicit: false, status: 'approved',
    releaseDate: '2025-03-15', isLiked: false
  },
  {
    id: 's2', title: 'Céu Aberto', artistId: 'a2', artistName: 'Marina Silva',
    albumId: 'al2', albumName: 'Horizonte', duration: 198, audioUrl: '/audio/s2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    genre: 'Sertanejo', playCount: 2345678, likeCount: 123456, isExplicit: false, status: 'approved',
    releaseDate: '2025-01-20', isLiked: true
  },
  {
    id: 's3', title: 'Ritmo da Cidade', artistId: 'a3', artistName: 'DJ Thunder',
    albumId: 'al3', albumName: 'Beats Brasil', duration: 267, audioUrl: '/audio/s3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    genre: 'Eletrônica', playCount: 987654, likeCount: 67890, isExplicit: false, status: 'approved',
    releaseDate: '2025-02-10', isLiked: false
  },
  {
    id: 's4', title: 'Saudade Boa', artistId: 'a1', artistName: 'Lucas Mendes',
    albumId: 'al1', albumName: 'Urbanidade', duration: 212, audioUrl: '/audio/s4.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'MPB', playCount: 876543, likeCount: 54321, isExplicit: false, status: 'approved',
    releaseDate: '2025-03-15', isLiked: false
  },
  {
    id: 's5', title: 'Brisa Tropical', artistId: 'a4', artistName: 'Ana Costa',
    albumId: 'al4', albumName: 'Paraíso', duration: 245, audioUrl: '/audio/s5.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    genre: 'Reggae', playCount: 1234567, likeCount: 78901, isExplicit: false, status: 'approved',
    releaseDate: '2025-04-01', isLiked: true
  },
  {
    id: 's6', title: 'Amanhecer', artistId: 'a2', artistName: 'Marina Silva',
    albumId: 'al2', albumName: 'Horizonte', duration: 189, audioUrl: '/audio/s6.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    genre: 'Sertanejo', playCount: 3456789, likeCount: 234567, isExplicit: false, status: 'approved',
    releaseDate: '2025-01-20', isLiked: false
  },
  {
    id: 's7', title: 'Neon Lights', artistId: 'a3', artistName: 'DJ Thunder',
    albumId: 'al3', albumName: 'Beats Brasil', duration: 301, audioUrl: '/audio/s7.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    genre: 'Eletrônica', playCount: 765432, likeCount: 45678, isExplicit: true, status: 'approved',
    releaseDate: '2025-02-10', isLiked: false
  },
  {
    id: 's8', title: 'Mar de Emoções', artistId: 'a5', artistName: 'Pedro Almeida',
    albumId: 'al5', albumName: 'Profundo', duration: 278, audioUrl: '/audio/s8.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop',
    genre: 'Pop', playCount: 5678901, likeCount: 345678, isExplicit: false, status: 'approved',
    releaseDate: '2024-11-15', isLiked: true
  },
  {
    id: 's9', title: 'Raízes', artistId: 'a6', artistName: 'Capoeira Soul',
    albumId: 'al6', albumName: 'Tradição', duration: 256, audioUrl: '/audio/s9.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
    genre: 'Afro-Brasileiro', playCount: 432109, likeCount: 34567, isExplicit: false, status: 'approved',
    releaseDate: '2025-05-01', isLiked: false
  },
  {
    id: 's10', title: 'Sol e Lua', artistId: 'a4', artistName: 'Ana Costa',
    albumId: 'al4', albumName: 'Paraíso', duration: 223, audioUrl: '/audio/s10.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    genre: 'Reggae', playCount: 654321, likeCount: 56789, isExplicit: false, status: 'approved',
    releaseDate: '2025-04-01', isLiked: false
  },
  {
    id: 's11', title: 'Fuga Perfeita', artistId: 'a7', artistName: 'Rafael Torres',
    albumId: 'al7', albumName: 'Escapadas', duration: 210, audioUrl: '/audio/s11.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=300&h=300&fit=crop',
    genre: 'Rock', playCount: 890123, likeCount: 67890, isExplicit: false, status: 'approved',
    releaseDate: '2025-06-10', isLiked: false
  },
  {
    id: 's12', title: 'Dança Comigo', artistId: 'a8', artistName: 'Isabela Ferreira',
    albumId: 'al8', albumName: 'Fogo', duration: 195, audioUrl: '/audio/s12.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=300&fit=crop',
    genre: 'Funk', playCount: 4567890, likeCount: 234567, isExplicit: true, status: 'approved',
    releaseDate: '2025-05-20', isLiked: true
  },
];

// ===== MOCK ARTISTS =====

export const mockArtists: ArtistType[] = [
  {
    id: 'a1', userId: 'u1', stageName: 'Lucas Mendes',
    avatar: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&h=300&fit=crop',
    bio: 'Cantor e compositor de MPB com mais de 10 anos de carreira', genre: 'MPB',
    country: 'BR', verified: true, monthlyListeners: 2500000, totalPlays: 45000000
  },
  {
    id: 'a2', userId: 'u2', stageName: 'Marina Silva',
    avatar: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=300&fit=crop',
    bio: 'A voz do sertanejo moderno', genre: 'Sertanejo',
    country: 'BR', verified: true, monthlyListeners: 5800000, totalPlays: 120000000
  },
  {
    id: 'a3', userId: 'u3', stageName: 'DJ Thunder',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=300&fit=crop',
    bio: 'DJ e produtor de música eletrônica', genre: 'Eletrônica',
    country: 'BR', verified: true, monthlyListeners: 1200000, totalPlays: 20000000
  },
  {
    id: 'a4', userId: 'u4', stageName: 'Ana Costa',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=300&fit=crop',
    bio: 'Reggae brasileiro com alma caribenha', genre: 'Reggae',
    country: 'BR', verified: false, monthlyListeners: 890000, totalPlays: 12000000
  },
  {
    id: 'a5', userId: 'u5', stageName: 'Pedro Almeida',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=300&fit=crop',
    bio: 'Pop brasileiro que toca o coração', genre: 'Pop',
    country: 'BR', verified: true, monthlyListeners: 8900000, totalPlays: 200000000
  },
  {
    id: 'a6', userId: 'u6', stageName: 'Capoeira Soul',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=300&fit=crop',
    bio: 'Música afro-brasileira contemporânea', genre: 'Afro-Brasileiro',
    country: 'BR', verified: false, monthlyListeners: 340000, totalPlays: 5000000
  },
  {
    id: 'a7', userId: 'u7', stageName: 'Rafael Torres',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=800&h=300&fit=crop',
    bio: 'Rock brasileiro com atitude', genre: 'Rock',
    country: 'BR', verified: true, monthlyListeners: 1500000, totalPlays: 25000000
  },
  {
    id: 'a8', userId: 'u8', stageName: 'Isabela Ferreira',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    banner: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&h=300&fit=crop',
    bio: 'Rainha do funk brasileiro', genre: 'Funk',
    country: 'BR', verified: true, monthlyListeners: 12000000, totalPlays: 350000000
  },
];

// ===== MOCK PLAYLISTS =====

export const mockPlaylists: PlaylistType[] = [
  {
    id: 'p1', userId: 'u0', userName: 'SpotiPlay', name: 'Hits do Momento',
    description: 'As músicas mais tocadas da semana',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    isPublic: true, isCollaborative: false, playCount: 567890,
    songCount: 50, tags: ['hits', 'pop', 'brasil']
  },
  {
    id: 'p2', userId: 'u0', userName: 'SpotiPlay', name: 'Chill Brasil',
    description: 'Relaxe com o melhor da música brasileira',
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    isPublic: true, isCollaborative: false, playCount: 345678,
    songCount: 35, tags: ['chill', 'relax', 'mpb']
  },
  {
    id: 'p3', userId: 'u0', userName: 'SpotiPlay', name: 'Treino Intenso',
    description: 'Energia máxima para seu treino',
    coverUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
    isPublic: true, isCollaborative: false, playCount: 890123,
    songCount: 45, tags: ['treino', 'energia', 'funk']
  },
  {
    id: 'p4', userId: 'u0', userName: 'SpotiPlay', name: 'Sertanejo Top',
    description: 'O melhor do sertanejo universitário',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    isPublic: true, isCollaborative: false, playCount: 1234567,
    songCount: 60, tags: ['sertanejo', 'brasil']
  },
  {
    id: 'p5', userId: 'u0', userName: 'SpotiPlay', name: 'Noite Eletrônica',
    description: 'Beats para a noite',
    coverUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=300&fit=crop',
    isPublic: true, isCollaborative: false, playCount: 456789,
    songCount: 40, tags: ['eletrônica', 'night', 'dance']
  },
  {
    id: 'p6', userId: 'u0', userName: 'SpotiPlay', name: 'Acústico Café',
    description: 'Música acústica para o café da manhã',
    coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300&h=300&fit=crop',
    isPublic: true, isCollaborative: false, playCount: 234567,
    songCount: 30, tags: ['acústico', 'café', 'manhã']
  },
];

// ===== MOCK PODCASTS =====

export const mockPodcasts: PodcastType[] = [
  {
    id: 'pod1', artistId: 'a1', artistName: 'Lucas Mendes',
    title: 'Conversas de Bastidores',
    description: 'Entrevistas e bastidores da música brasileira',
    coverUrl: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=300&fit=crop',
    category: 'Música', isExclusive: false,
    episodes: [
      { id: 'ep1', podcastId: 'pod1', title: 'A Origem do MPB Moderno', description: 'Como o MPB se reinventou nos anos 2000', audioUrl: '/audio/podcast-ep1.mp3', duration: 2340, playCount: 45200, season: 1, episode: 1, isExclusive: false, releaseDate: '2025-06-15' },
      { id: 'ep2', podcastId: 'pod1', title: 'Backstage no Rock in Rio', description: 'O que rola nos bastidores do maior festival', audioUrl: '/audio/podcast-ep2.mp3', duration: 3120, playCount: 38700, season: 1, episode: 2, isExclusive: false, releaseDate: '2025-06-22' },
      { id: 'ep3', podcastId: 'pod1', title: 'Produtores que Mudaram o Jogo', description: 'Entrevista com grandes produtores musicais', audioUrl: '/audio/podcast-ep3.mp3', duration: 2760, playCount: 29100, season: 1, episode: 3, isExclusive: false, releaseDate: '2025-06-29' },
    ],
  },
  {
    id: 'pod2', artistId: 'a5', artistName: 'Pedro Almeida',
    title: 'Vozes do Pop',
    description: 'Análise semanal do mundo pop',
    coverUrl: 'https://images.unsplash.com/photo-1505739998589-00fc191ce01d?w=300&h=300&fit=crop',
    category: 'Entretenimento', isExclusive: true,
    episodes: [
      { id: 'ep4', podcastId: 'pod2', title: 'O Fenômeno K-Pop no Brasil', description: 'Como o K-Pop conquistou o Brasil', audioUrl: '/audio/podcast-ep4.mp3', duration: 1980, playCount: 62300, season: 1, episode: 1, isExclusive: true, releaseDate: '2025-06-10' },
      { id: 'ep5', podcastId: 'pod2', title: 'Taylor Swift e a Indústria', description: 'O impacto de Taylor Swift na música', audioUrl: '/audio/podcast-ep5.mp3', duration: 2540, playCount: 55800, season: 1, episode: 2, isExclusive: true, releaseDate: '2025-06-17' },
    ],
  },
  {
    id: 'pod3', artistId: 'a8', artistName: 'Isabela Ferreira',
    title: 'Funk Stories',
    description: 'Histórias do movimento funk carioca',
    coverUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=300&h=300&fit=crop',
    category: 'Cultura', isExclusive: true,
    episodes: [
      { id: 'ep6', podcastId: 'pod3', title: 'Das Favelas pro Mundo', description: 'A jornada do funk brasileiro', audioUrl: '/audio/podcast-ep6.mp3', duration: 2880, playCount: 71400, season: 1, episode: 1, isExclusive: true, releaseDate: '2025-06-12' },
      { id: 'ep7', podcastId: 'pod3', title: 'MCs que Fizeram História', description: 'Os grandes nomes do funk nacional', audioUrl: '/audio/podcast-ep7.mp3', duration: 2220, playCount: 48900, season: 1, episode: 2, isExclusive: true, releaseDate: '2025-06-19' },
    ],
  },
  {
    id: 'pod4', artistId: 'a2', artistName: 'Marina Silva',
    title: 'Sons do Brasil',
    description: 'Explorando os ritmos brasileiros',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    category: 'Cultura', isExclusive: false,
    episodes: [
      { id: 'ep8', podcastId: 'pod4', title: 'Samba: A Raiz de Tudo', description: 'A história do samba e sua influência', audioUrl: '/audio/podcast-ep8.mp3', duration: 2640, playCount: 33500, season: 1, episode: 1, isExclusive: false, releaseDate: '2025-06-08' },
      { id: 'ep9', podcastId: 'pod4', title: 'Bossa Nova Eterna', description: 'O charme da bossa nova', audioUrl: '/audio/podcast-ep9.mp3', duration: 1800, playCount: 27200, season: 1, episode: 2, isExclusive: false, releaseDate: '2025-06-20' },
    ],
  },
  {
    id: 'pod5', artistId: 'a3', artistName: 'DJ Thunder',
    title: 'Bateu a Hora',
    description: 'Podcast ao vivo sobre música eletrônica e festas',
    coverUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    category: 'Eletrônica', isExclusive: false,
    episodes: [
      { id: 'ep10', podcastId: 'pod5', title: 'AO VIVO - Neon Party Special', description: 'Set ao vivo do DJ Thunder direto da Neon Party', audioUrl: '/audio/podcast-ep10.mp3', duration: 3600, playCount: 89200, season: 1, episode: 1, isExclusive: false, releaseDate: '2025-06-23' },
      { id: 'ep11', podcastId: 'pod5', title: 'Como Produzir um Hit', description: 'Dicas de produção musical eletrônica', audioUrl: '/audio/podcast-ep11.mp3', duration: 2100, playCount: 41600, season: 1, episode: 2, isExclusive: false, releaseDate: '2025-06-25' },
    ],
  },
];

// ===== MOCK LIVE STREAMS =====

export const mockLiveStreams: LiveStreamType[] = [
  {
    id: 'live1', artistId: 'a2', artistName: 'Marina Silva',
    title: 'Acústico ao Vivo - Horizonte Tour',
    description: 'Show acústico especial para os fãs',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=225&fit=crop',
    isLive: true, isScheduled: false, viewerCount: 12543, maxViewers: 15000
  },
  {
    id: 'live2', artistId: 'a3', artistName: 'DJ Thunder',
    title: 'DJ Set - Neon Party',
    description: 'Set exclusivo de música eletrônica',
    thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=225&fit=crop',
    isLive: true, isScheduled: false, viewerCount: 8934, maxViewers: 10000
  },
  {
    id: 'live3', artistId: 'a5', artistName: 'Pedro Almeida',
    title: 'Lançamento do Novo Álbum',
    description: 'Evento de lançamento com performances ao vivo',
    thumbnail: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=225&fit=crop',
    isLive: false, isScheduled: true, scheduledAt: '2025-07-01T20:00:00Z', viewerCount: 0, maxViewers: 0
  },
];

// ===== SUBSCRIPTION PLANS =====

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free', name: 'Free', price: 0, period: 'monthly',
    features: [
      'Ouvir músicas com anúncios',
      'Criar playlists',
      'Curtir músicas',
      'Seguir artistas',
      'Reprodução aleatória',
    ]
  },
  {
    id: 'premium_individual', name: 'Premium Individual', price: 21.90, period: 'monthly',
    features: [
      'Sem anúncios',
      'Download offline',
      'Qualidade máxima',
      'Reprodução em segundo plano',
      'Pular músicas ilimitadamente',
      'Áudio Hi-Fi',
      'IA DJ e recomendações',
    ],
    popular: true,
  },
  {
    id: 'premium_duo', name: 'Premium Duo', price: 29.90, period: 'monthly',
    features: [
      '2 contas Premium',
      'Todas as funcionalidades Premium',
      'Duo Mix compartilhado',
      'Playlist colaborativa',
    ]
  },
  {
    id: 'premium_familia', name: 'Premium Família', price: 39.90, period: 'monthly',
    features: [
      'Até 6 contas Premium',
      'Todas as funcionalidades Premium',
      'Family Mix compartilhado',
      'Controle parental',
      'Playlist colaborativa',
    ]
  },
  {
    id: 'premium_estudante', name: 'Premium Estudante', price: 11.95, period: 'monthly',
    features: [
      '50% de desconto',
      'Todas as funcionalidades Premium',
      'Verificação estudantil',
    ]
  },
];

// ===== GENRES =====

export const genres = [
  { name: 'MPB', color: 'from-rose-500 to-orange-400', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop' },
  { name: 'Sertanejo', color: 'from-amber-500 to-yellow-400', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop' },
  { name: 'Eletrônica', color: 'from-purple-500 to-pink-400', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop' },
  { name: 'Pop', color: 'from-cyan-500 to-teal-400', image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&h=200&fit=crop' },
  { name: 'Rock', color: 'from-red-600 to-rose-500', image: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=200&h=200&fit=crop' },
  { name: 'Funk', color: 'from-green-500 to-emerald-400', image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=200&h=200&fit=crop' },
  { name: 'Reggae', color: 'from-lime-500 to-green-400', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop' },
  { name: 'Hip Hop', color: 'from-orange-600 to-amber-500', image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop' },
  { name: 'Jazz', color: 'from-violet-500 to-purple-400', image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=200&h=200&fit=crop' },
  { name: 'Clássica', color: 'from-slate-500 to-gray-400', image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=200&h=200&fit=crop' },
];

// ===== ADMIN ANALYTICS MOCK =====

export const adminAnalytics = {
  totalUsers: 124567,
  premiumUsers: 34567,
  activeUsers: 78901,
  totalRevenue: 856234.50,
  monthlyGrowth: 12.5,
  conversionRate: 27.7,
  topSongs: mockSongs.slice(0, 5).map((s, i) => ({ ...s, playCount: 597000 - i * 85000 })),
  revenueByMonth: [
    { month: 'Jan', revenue: 620000 },
    { month: 'Fev', revenue: 680000 },
    { month: 'Mar', revenue: 710000 },
    { month: 'Abr', revenue: 750000 },
    { month: 'Mai', revenue: 800000 },
    { month: 'Jun', revenue: 856234 },
  ],
  usersByMonth: [
    { month: 'Jan', users: 89000 },
    { month: 'Fev', users: 95000 },
    { month: 'Mar', users: 102000 },
    { month: 'Abr', users: 108000 },
    { month: 'Mai', users: 116000 },
    { month: 'Jun', users: 124567 },
  ],
};

// ===== CREATOR ANALYTICS MOCK =====

export const creatorAnalytics = {
  uniqueListeners: 45678,
  totalPlays: 1234567,
  totalMinutes: 567890,
  revenue: 3456.78,
  topCountries: [
    { country: 'Brasil', percentage: 78 },
    { country: 'Portugal', percentage: 12 },
    { country: 'EUA', percentage: 5 },
    { country: 'Outros', percentage: 5 },
  ],
  topDevices: [
    { device: 'Mobile', percentage: 65 },
    { device: 'Desktop', percentage: 25 },
    { device: 'Tablet', percentage: 7 },
    { device: 'Smart TV', percentage: 3 },
  ],
  monthlyPlays: [
    { month: 'Jan', plays: 150000 },
    { month: 'Fev', plays: 180000 },
    { month: 'Mar', plays: 200000 },
    { month: 'Abr', plays: 210000 },
    { month: 'Mai', plays: 240000 },
    { month: 'Jun', plays: 254567 },
  ],
};
