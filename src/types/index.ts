// ===== CORE TYPES =====

export type UserRole = 'free' | 'premium' | 'creator' | 'moderator' | 'admin';
export type UserPlan = 'free' | 'premium_individual' | 'premium_duo' | 'premium_familia' | 'premium_estudante';
export type ContentStatus = 'pending' | 'approved' | 'rejected' | 'removed';
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';
export type PaymentMethod = 'pix' | 'credit_card' | 'debit_card';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due';
export type AdType = 'audio' | 'video' | 'banner' | 'popup' | 'fullscreen';
export type AlbumType = 'album' | 'single' | 'ep';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type WithdrawalStatus = 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';

// ===== APP VIEW TYPES =====

export type AppView = 
  | 'landing' 
  | 'home' 
  | 'search' 
  | 'library' 
  | 'playlist' 
  | 'album' 
  | 'artist' 
  | 'podcasts'
  | 'lives'
  | 'premium'
  | 'admin'
  | 'creator'
  | 'profile'
  | 'settings';

// ===== SONG =====

export interface SongType {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumName?: string;
  duration: number;
  audioUrl: string;
  coverUrl?: string;
  lyrics?: string;
  syncedLyrics?: string;
  genre?: string;
  mood?: string;
  playCount: number;
  likeCount: number;
  isExplicit: boolean;
  status: ContentStatus;
  releaseDate?: string;
  isLiked?: boolean;
}

// ===== ARTIST =====

export interface ArtistType {
  id: string;
  userId: string;
  stageName: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  genre?: string;
  country?: string;
  verified: boolean;
  monthlyListeners: number;
  totalPlays: number;
  isFollowed?: boolean;
}

// ===== ALBUM =====

export interface AlbumType {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  coverUrl?: string;
  type: AlbumType;
  genre?: string;
  releaseDate?: string;
  songs?: SongType[];
}

// ===== PLAYLIST =====

export interface PlaylistType {
  id: string;
  userId: string;
  userName: string;
  name: string;
  description?: string;
  coverUrl?: string;
  isPublic: boolean;
  isCollaborative: boolean;
  playCount: number;
  songs?: SongType[];
  songCount?: number;
  tags?: string[];
}

// ===== PODCAST =====

export interface PodcastType {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description?: string;
  coverUrl?: string;
  category?: string;
  isExclusive: boolean;
  episodes?: PodcastEpisodeType[];
}

export interface PodcastEpisodeType {
  id: string;
  podcastId: string;
  title: string;
  description?: string;
  audioUrl: string;
  duration: number;
  thumbnail?: string;
  playCount: number;
  season?: number;
  episode?: number;
  isExclusive: boolean;
  releaseDate?: string;
}

// ===== LIVE STREAM =====

export interface LiveStreamType {
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
  startedAt?: string;
  viewerCount: number;
  maxViewers: number;
}

// ===== USER =====

export interface UserType {
  id: string;
  email: string;
  name?: string;
  username?: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  plan: UserPlan;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

// ===== SUBSCRIPTION =====

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

// ===== PLAYER STATE =====

export interface PlayerState {
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
}

// ===== NOTIFICATION =====

export interface NotificationType {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ===== CHAT MESSAGE =====

export interface ChatMessageType {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  message: string;
  isSuper: boolean;
  createdAt: string;
}

// ===== ANALYTICS =====

export interface AnalyticsData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

// ===== ASASS =====

export interface AsaasPaymentResponse {
  id: string;
  status: string;
  pixCode?: string;
  pixQrCode?: string;
  invoiceUrl?: string;
}

export interface AsaasCustomerResponse {
  id: string;
  name: string;
  email: string;
}
