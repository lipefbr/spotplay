'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Music,
  Disc3,
  Radio,
  Activity,
  BarChart3,
  Wallet,
  Settings,
  Upload,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Headphones,
  Clock,
  DollarSign,
  Globe,
  Smartphone,
  Tablet,
  Monitor,
  Tv,
  Bell,
  ChevronRight,
  Play,
  MoreHorizontal,
  Plus,
  FileAudio,
  ImagePlus,
  CheckCircle2,
  AlertCircle,
  Download,
  CreditCard,
  RefreshCw,
  X,
  Calendar,
  Eye,
  Loader2,
  Mic,
  StopCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { creatorAnalytics, mockSongs, mockPodcasts, mockLiveStreams } from '@/lib/mock-data';
import { formatCurrency, formatPlayCount } from '@/lib/asaas';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// ===== SIDEBAR NAV ITEMS =====

type CreatorView =
  | 'dashboard'
  | 'music'
  | 'albums'
  | 'podcasts'
  | 'lives'
  | 'analytics'
  | 'financial'
  | 'settings';

const creatorNavItems: { id: CreatorView; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'music', label: 'Músicas', icon: Music },
  { id: 'albums', label: 'Álbuns', icon: Disc3 },
  { id: 'podcasts', label: 'Podcasts', icon: Radio },
  { id: 'lives', label: 'Lives', icon: Activity },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'financial', label: 'Financeiro', icon: Wallet },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

// ===== MOCK DATA =====

const mockCreatorSongs = [
  { id: 'cs1', title: 'Noites de São Paulo', album: 'Urbanidade', genre: 'MPB', plays: 1523456, status: 'published', releaseDate: '2025-03-15' },
  { id: 'cs2', title: 'Saudade Boa', album: 'Urbanidade', genre: 'MPB', plays: 876543, status: 'published', releaseDate: '2025-03-15' },
  { id: 'cs3', title: 'Amanhecer', album: 'Horizonte', genre: 'Sertanejo', plays: 3456789, status: 'published', releaseDate: '2025-01-20' },
  { id: 'cs4', title: 'Céu Aberto', album: 'Horizonte', genre: 'Sertanejo', plays: 2345678, status: 'published', releaseDate: '2025-01-20' },
  { id: 'cs5', title: 'Novo Horizonte', album: '-', genre: 'MPB', plays: 0, status: 'pending', releaseDate: '2025-07-15' },
];

const mockEarnings = [
  { month: 'Jan', streaming: 280.5, downloads: 45.2, live: 120.0, total: 445.7 },
  { month: 'Fev', streaming: 310.8, downloads: 52.1, live: 0, total: 362.9 },
  { month: 'Mar', streaming: 345.2, downloads: 48.7, live: 200.0, total: 593.9 },
  { month: 'Abr', streaming: 390.1, downloads: 55.3, live: 0, total: 445.4 },
  { month: 'Mai', streaming: 420.5, downloads: 60.8, live: 150.0, total: 631.3 },
  { month: 'Jun', streaming: 465.3, downloads: 65.2, live: 280.0, total: 810.5 },
];

const mockTransactions = [
  { id: 't1', type: 'credit', description: 'Royalties - Streaming', amount: 465.30, date: '2025-06-01', status: 'completed' },
  { id: 't2', type: 'credit', description: 'Royalties - Downloads', amount: 65.20, date: '2025-06-01', status: 'completed' },
  { id: 't3', type: 'credit', description: 'Receita Live', amount: 280.00, date: '2025-06-05', status: 'completed' },
  { id: 't4', type: 'debit', description: 'Saque realizado', amount: -500.00, date: '2025-06-10', status: 'completed' },
  { id: 't5', type: 'credit', description: 'Royalties - Streaming', amount: 420.50, date: '2025-05-01', status: 'completed' },
  { id: 't6', type: 'debit', description: 'Saque realizado', amount: -400.00, date: '2025-05-15', status: 'completed' },
];

const countryColors = ['#10b981', '#34d399', '#6ee7b7', '#374151'];
const deviceColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

// ===== COMPONENT =====

export default function CreatorPanel() {
  const [activeView, setActiveView] = useState<CreatorView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [showScheduleLiveModal, setShowScheduleLiveModal] = useState(false);
  const [scheduleLiveForm, setScheduleLiveForm] = useState({
    title: '',
    description: '',
    dateTime: '',
  });
  const [uploadForm, setUploadForm] = useState({
    title: '',
    genre: '',
    album: '',
    coverFile: null as File | null,
    audioFile: null as File | null,
    coverUrl: '',
    audioUrl: '',
    coverUploading: false,
    audioUploading: false,
    submitting: false,
  });
  const { toast } = useToast();

  // Lives state
  const [activeLive, setActiveLive] = useState<any>(null);
  const [showStartLiveModal, setShowStartLiveModal] = useState(false);
  const [startLiveForm, setStartLiveForm] = useState({ title: '', description: '' });
  const [startingLive, setStartingLive] = useState(false);
  const [endingLive, setEndingLive] = useState(false);
  const [dbLives, setDbLives] = useState<any[]>([]);
  const [loadingLives, setLoadingLives] = useState(false);

  // Podcast state
  const [showNewEpisodeModal, setShowNewEpisodeModal] = useState(false);
  const [episodeForm, setEpisodeForm] = useState({
    podcastId: '',
    title: '',
    description: '',
    audioFile: null as File | null,
    audioUrl: '',
    audioUploading: false,
    submitting: false,
  });

  // File input refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const podcastAudioInputRef = useRef<HTMLInputElement>(null);

  const data = creatorAnalytics;

  // ===== UPLOAD FILE FUNCTION =====

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
      return null;
    } catch {
      return null;
    }
  };

  // ===== FILE SELECT HANDLERS =====

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadForm((prev) => ({ ...prev, coverFile: file, coverUploading: true, coverUrl: '' }));
    const url = await uploadFile(file);
    if (url) {
      setUploadForm((prev) => ({ ...prev, coverUrl: url, coverUploading: false }));
      toast({ title: 'Capa enviada!', description: file.name });
    } else {
      setUploadForm((prev) => ({ ...prev, coverUploading: false }));
      toast({ title: 'Erro', description: 'Falha ao enviar capa', variant: 'destructive' });
    }
  };

  const handleAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadForm((prev) => ({ ...prev, audioFile: file, audioUploading: true, audioUrl: '' }));
    const url = await uploadFile(file);
    if (url) {
      setUploadForm((prev) => ({ ...prev, audioUrl: url, audioUploading: false }));
      toast({ title: 'Áudio enviado!', description: file.name });
    } else {
      setUploadForm((prev) => ({ ...prev, audioUploading: false }));
      toast({ title: 'Erro', description: 'Falha ao enviar áudio', variant: 'destructive' });
    }
  };

  // ===== SUBMIT MUSIC =====

  const handleSubmitMusic = async () => {
    if (!uploadForm.title.trim()) {
      toast({ title: 'Campo obrigatório', description: 'Informe o título da música', variant: 'destructive' });
      return;
    }
    if (!uploadForm.audioUrl) {
      toast({ title: 'Campo obrigatório', description: 'Envie o arquivo de áudio', variant: 'destructive' });
      return;
    }
    setUploadForm((prev) => ({ ...prev, submitting: true }));
    try {
      const res = await fetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: uploadForm.title,
          genre: uploadForm.genre,
          album: uploadForm.album,
          coverUrl: uploadForm.coverUrl,
          audioUrl: uploadForm.audioUrl,
          artistId: 'a1',
        }),
      });
      if (res.ok) {
        toast({ title: 'Música enviada!', description: `"${uploadForm.title}" foi enviada para revisão.` });
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          genre: '',
          album: '',
          coverFile: null,
          audioFile: null,
          coverUrl: '',
          audioUrl: '',
          coverUploading: false,
          audioUploading: false,
          submitting: false,
        });
      } else {
        const errData = await res.json();
        toast({ title: 'Erro', description: errData.error || 'Falha ao enviar música', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha ao enviar música', variant: 'destructive' });
    }
    setUploadForm((prev) => ({ ...prev, submitting: false }));
  };

  // ===== LIVE STREAM FUNCTIONS =====

  const loadLives = async () => {
    setLoadingLives(true);
    try {
      const res = await fetch('/api/lives/list?artistId=a1');
      if (res.ok) {
        const data = await res.json();
        setDbLives(data.liveStreams || []);
        setActiveLive(data.activeLive || null);
      }
    } catch {
      // silently fail
    }
    setLoadingLives(false);
  };

  useEffect(() => {
    const fetchLives = async () => {
      setLoadingLives(true);
      try {
        const res = await fetch('/api/lives/list?artistId=a1');
        if (res.ok) {
          const data = await res.json();
          setDbLives(data.liveStreams || []);
          setActiveLive(data.activeLive || null);
        }
      } catch {
        // silently fail
      }
      setLoadingLives(false);
    };
    fetchLives();
  }, []);

  const handleStartLive = async () => {
    setStartingLive(true);
    try {
      const res = await fetch('/api/lives/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistId: 'a1', title: startLiveForm.title, description: startLiveForm.description }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveLive(data.liveStream);
        setShowStartLiveModal(false);
        setStartLiveForm({ title: '', description: '' });
        toast({ title: 'Live iniciada!', description: 'Sua transmissão está ao vivo.' });
        loadLives();
      } else {
        const data = await res.json();
        toast({ title: 'Erro', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha ao iniciar live', variant: 'destructive' });
    }
    setStartingLive(false);
  };

  const handleEndLive = async () => {
    if (!activeLive) return;
    setEndingLive(true);
    try {
      const res = await fetch('/api/lives/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liveId: activeLive.id }),
      });
      if (res.ok) {
        setActiveLive(null);
        toast({ title: 'Live encerrada', description: 'Sua transmissão foi encerrada.' });
        loadLives();
      } else {
        const data = await res.json();
        toast({ title: 'Erro', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha ao encerrar live', variant: 'destructive' });
    }
    setEndingLive(false);
  };

  // ===== PODCAST EPISODE HANDLERS =====

  const handlePodcastAudioSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEpisodeForm((prev) => ({ ...prev, audioFile: file, audioUploading: true, audioUrl: '' }));
    const url = await uploadFile(file);
    if (url) {
      setEpisodeForm((prev) => ({ ...prev, audioUrl: url, audioUploading: false }));
      toast({ title: 'Áudio enviado!', description: file.name });
    } else {
      setEpisodeForm((prev) => ({ ...prev, audioUploading: false }));
      toast({ title: 'Erro', description: 'Falha ao enviar áudio do episódio', variant: 'destructive' });
    }
  };

  const handleSubmitEpisode = () => {
    if (!episodeForm.title.trim()) {
      toast({ title: 'Campo obrigatório', description: 'Informe o título do episódio', variant: 'destructive' });
      return;
    }
    if (!episodeForm.audioUrl) {
      toast({ title: 'Campo obrigatório', description: 'Envie o arquivo de áudio', variant: 'destructive' });
      return;
    }
    toast({ title: 'Episódio criado!', description: `"${episodeForm.title}" foi adicionado ao podcast.` });
    setShowNewEpisodeModal(false);
    setEpisodeForm({
      podcastId: '',
      title: '',
      description: '',
      audioFile: null,
      audioUrl: '',
      audioUploading: false,
      submitting: false,
    });
  };

  // ===== STAT CARDS =====

  const creatorStatCards = [
    {
      title: 'Ouvintes Únicos',
      value: data.uniqueListeners.toLocaleString('pt-BR'),
      change: '+18.2%',
      trend: 'up' as const,
      icon: Headphones,
      description: 'vs. mês anterior',
    },
    {
      title: 'Reproduções',
      value: formatPlayCount(data.totalPlays),
      change: '+22.5%',
      trend: 'up' as const,
      icon: Play,
      description: 'vs. mês anterior',
    },
    {
      title: 'Minutos Ouvidos',
      value: `${(data.totalMinutes / 1000).toFixed(0)}K`,
      change: '+15.8%',
      trend: 'up' as const,
      icon: Clock,
      description: 'vs. mês anterior',
    },
    {
      title: 'Receita',
      value: formatCurrency(data.revenue),
      change: '+31.2%',
      trend: 'up' as const,
      icon: DollarSign,
      description: 'vs. mês anterior',
    },
  ];

  // ===== RENDER SIDEBAR =====

  const renderSidebar = () => (
    <aside
      className={`${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 h-full`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <Music className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight">SpotiPlay</h1>
            <p className="text-gray-400 text-xs">Creator Studio</p>
          </div>
        )}
      </div>

      {/* Creator Profile */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-emerald-500/30 text-emerald-400 text-sm font-bold">
                LM
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">Lucas Mendes</p>
              <p className="text-gray-400 text-xs flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verificado
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {creatorNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">{item.label}</span>
              )}
              {isActive && !sidebarCollapsed && (
                <ChevronRight className="w-4 h-4 ml-auto text-emerald-400" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Button */}
      <div className="p-3 border-t border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full text-gray-400 hover:text-white hover:bg-gray-800"
        >
          <RefreshCw className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
          {!sidebarCollapsed && <span className="ml-2 text-xs">Recolher</span>}
        </Button>
      </div>
    </aside>
  );

  // ===== DASHBOARD VIEW =====

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {creatorStatCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-white text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-red-400" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-xs">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Monthly Plays Chart */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-base">Reproduções Mensais</CardTitle>
              <CardDescription className="text-gray-400 text-xs">
                Evolução das reproduções nos últimos 6 meses
              </CardDescription>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              +22.5%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyPlays} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPlays" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                  formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Reproduções']}
                  cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="plays"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPlays)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Countries & Top Devices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <CardTitle className="text-white text-base">Países com Mais Ouvintes</CardTitle>
            </div>
            <CardDescription className="text-gray-400 text-xs">Distribuição geográfica dos seus ouvintes</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-48 w-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topCountries}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="percentage"
                      nameKey="country"
                    >
                      {data.topCountries.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={countryColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #1f2937',
                        borderRadius: '8px',
                        color: '#f9fafb',
                      }}
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {data.topCountries.map((country, index) => (
                  <div key={country.country} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: countryColors[index] }}
                        />
                        <span className="text-gray-300 text-sm">{country.country}</span>
                      </div>
                      <span className="text-white font-semibold text-sm">{country.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${country.percentage}%`,
                          backgroundColor: countryColors[index],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Devices */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <CardTitle className="text-white text-base">Dispositivos dos Ouvintes</CardTitle>
            </div>
            <CardDescription className="text-gray-400 text-xs">Como seus fãs estão ouvindo</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="h-48 w-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topDevices}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="percentage"
                      nameKey="device"
                    >
                      {data.topDevices.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={deviceColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #1f2937',
                        borderRadius: '8px',
                        color: '#f9fafb',
                      }}
                      formatter={(value: number, name: string) => [`${value}%`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3 w-full">
                {data.topDevices.map((device, index) => {
                  const deviceIcon =
                    device.device === 'Mobile' ? Smartphone :
                    device.device === 'Desktop' ? Monitor :
                    device.device === 'Tablet' ? Tablet :
                    Tv;
                  const DeviceIcon = deviceIcon;
                  return (
                    <div key={device.device} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DeviceIcon className="w-4 h-4" style={{ color: deviceColors[index] }} />
                          <span className="text-gray-300 text-sm">{device.device}</span>
                        </div>
                        <span className="text-white font-semibold text-sm">{device.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${device.percentage}%`,
                            backgroundColor: deviceColors[index],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats: Recent Songs */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-base">Suas Músicas Recentes</CardTitle>
              <CardDescription className="text-gray-400 text-xs">Desempenho das suas últimas faixas</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
              onClick={() => setActiveView('music')}
            >
              Ver todas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Música</TableHead>
                <TableHead className="text-gray-400">Álbum</TableHead>
                <TableHead className="text-gray-400">Gênero</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400 text-right">Reproduções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCreatorSongs.slice(0, 4).map((song) => (
                <TableRow key={song.id} className="border-gray-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <Music className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-white font-medium text-sm">{song.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{song.album}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">
                      {song.genre}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs ${
                        song.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {song.status === 'published' ? 'Publicado' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-gray-300 text-sm">
                    {formatPlayCount(song.plays)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ===== MUSIC VIEW =====

  const renderMusic = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Suas Músicas</h2>
          <p className="text-gray-400 text-sm">Gerencie seu catálogo de músicas</p>
        </div>
        <Button
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Música
        </Button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <Card className="bg-gray-900 border-emerald-500/30 border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base">Upload de Música</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowUploadModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription className="text-gray-400 text-xs">
              Preencha os dados da sua nova música
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Título da Música</Label>
                <Input
                  placeholder="Ex: Noites de São Paulo"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Gênero</Label>
                <Select
                  value={uploadForm.genre}
                  onValueChange={(val) => setUploadForm({ ...uploadForm, genre: val })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="mpb">MPB</SelectItem>
                    <SelectItem value="sertanejo">Sertanejo</SelectItem>
                    <SelectItem value="eletronica">Eletrônica</SelectItem>
                    <SelectItem value="pop">Pop</SelectItem>
                    <SelectItem value="rock">Rock</SelectItem>
                    <SelectItem value="funk">Funk</SelectItem>
                    <SelectItem value="reggae">Reggae</SelectItem>
                    <SelectItem value="hiphop">Hip Hop</SelectItem>
                    <SelectItem value="jazz">Jazz</SelectItem>
                    <SelectItem value="classica">Clássica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Álbum (opcional)</Label>
              <Input
                placeholder="Ex: Urbanidade"
                value={uploadForm.album}
                onChange={(e) => setUploadForm({ ...uploadForm, album: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cover Upload */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Capa do Álbum</Label>
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}
                  className="hidden"
                  onChange={handleCoverSelect}
                />
                <div
                  className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer"
                  onClick={() => coverInputRef.current?.click()}
                >
                  {uploadForm.coverUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                      <p className="text-emerald-400 text-sm">Enviando capa...</p>
                    </div>
                  ) : uploadForm.coverFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      <p className="text-emerald-400 text-sm">{uploadForm.coverFile.name}</p>
                      <p className="text-gray-500 text-xs">Clique para trocar</p>
                    </div>
                  ) : (
                    <>
                      <ImagePlus className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Clique para enviar a capa</p>
                      <p className="text-gray-500 text-xs mt-1">JPG, PNG até 5MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Audio Upload */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Arquivo de Áudio</Label>
                <input
                  type="file"
                  accept="audio/*"
                  ref={audioInputRef}
                  className="hidden"
                  onChange={handleAudioSelect}
                />
                <div
                  className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer"
                  onClick={() => audioInputRef.current?.click()}
                >
                  {uploadForm.audioUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                      <p className="text-emerald-400 text-sm">Enviando áudio...</p>
                    </div>
                  ) : uploadForm.audioFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                      <p className="text-emerald-400 text-sm">{uploadForm.audioFile.name}</p>
                      <p className="text-gray-500 text-xs">Clique para trocar</p>
                    </div>
                  ) : (
                    <>
                      <FileAudio className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Clique para enviar o áudio</p>
                      <p className="text-gray-500 text-xs mt-1">MP3, WAV, FLAC até 50MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1 sm:flex-none"
                disabled={uploadForm.submitting || uploadForm.coverUploading || uploadForm.audioUploading}
                onClick={handleSubmitMusic}
              >
                {uploadForm.submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Enviar Música
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white flex-1 sm:flex-none"
                onClick={() => setShowUploadModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Songs Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Música</TableHead>
                <TableHead className="text-gray-400">Álbum</TableHead>
                <TableHead className="text-gray-400">Gênero</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Lançamento</TableHead>
                <TableHead className="text-gray-400 text-right">Reproduções</TableHead>
                <TableHead className="text-gray-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCreatorSongs.map((song) => (
                <TableRow key={song.id} className="border-gray-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <Music className="w-4 h-4 text-emerald-400" />
                      </div>
                      <span className="text-white font-medium text-sm">{song.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{song.album}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">
                      {song.genre}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs ${
                        song.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {song.status === 'published' ? 'Publicado' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{song.releaseDate}</TableCell>
                  <TableCell className="text-right text-gray-300 text-sm">
                    {formatPlayCount(song.plays)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ===== ANALYTICS VIEW =====

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-white text-xl font-bold">Analytics Detalhado</h2>
        <p className="text-gray-400 text-sm">Métricas detalhadas do seu desempenho</p>
      </div>

      {/* Time Range Select */}
      <div className="flex items-center gap-3">
        <Select defaultValue="6months">
          <SelectTrigger className="w-44 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="7days">Últimos 7 dias</SelectItem>
            <SelectItem value="30days">Últimos 30 dias</SelectItem>
            <SelectItem value="3months">Últimos 3 meses</SelectItem>
            <SelectItem value="6months">Últimos 6 meses</SelectItem>
            <SelectItem value="1year">Último ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Plays Over Time */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Reproduções ao Longo do Tempo</CardTitle>
          <CardDescription className="text-gray-400 text-xs">Evolução detalhada das reproduções</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyPlays} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPlaysDetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                  formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Reproduções']}
                />
                <Area
                  type="monotone"
                  dataKey="plays"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPlaysDetail)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Country Breakdown */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Ouvintes por País</CardTitle>
            <CardDescription className="text-gray-400 text-xs">Distribuição geográfica detalhada</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topCountries} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                  <XAxis type="number" stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="country" stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #1f2937',
                      borderRadius: '8px',
                      color: '#f9fafb',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Participação']}
                  />
                  <Bar dataKey="percentage" fill="#10b981" radius={[0, 4, 4, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Dispositivos Utilizados</CardTitle>
            <CardDescription className="text-gray-400 text-xs">Plataformas de acesso dos seus ouvintes</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.topDevices}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="percentage"
                    nameKey="device"
                    label={({ device, percentage }) => `${device}: ${percentage}%`}
                  >
                    {data.topDevices.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={deviceColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #1f2937',
                      borderRadius: '8px',
                      color: '#f9fafb',
                    }}
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Média Diária</p>
            <p className="text-white text-lg font-bold">8.5K</p>
            <p className="text-emerald-400 text-xs">reproduções/dia</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Taxa de Retenção</p>
            <p className="text-white text-lg font-bold">72%</p>
            <p className="text-emerald-400 text-xs">ouvintes retornam</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Tempo Médio</p>
            <p className="text-white text-lg font-bold">3:42</p>
            <p className="text-emerald-400 text-xs">min/música</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Salvos em Playlist</p>
            <p className="text-white text-lg font-bold">12.4K</p>
            <p className="text-emerald-400 text-xs">vezes</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  // ===== FINANCIAL VIEW =====

  const renderFinancial = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Financeiro</h2>
          <p className="text-gray-400 text-sm">Acompanhe seus ganhos e saques</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Wallet className="w-4 h-4 mr-2" />
          Solicitar Saque
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Saldo Disponível</p>
                <p className="text-white text-xl font-bold">{formatCurrency(1346.28)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Pendente</p>
                <p className="text-white text-xl font-bold">{formatCurrency(530.50)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs">Total Recebido</p>
                <p className="text-white text-xl font-bold">{formatCurrency(12849.70)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Ganhos por Mês</CardTitle>
          <CardDescription className="text-gray-400 text-xs">Receita detalhada por categoria</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockEarnings} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: '8px',
                    color: '#f9fafb',
                  }}
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'streaming' ? 'Streaming' : name === 'downloads' ? 'Downloads' : name === 'live' ? 'Lives' : 'Total',
                  ]}
                />
                <Bar dataKey="streaming" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} maxBarSize={40} />
                <Bar dataKey="downloads" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} maxBarSize={40} />
                <Bar dataKey="live" stackId="a" fill="#6ee7b7" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-gray-400 text-xs">Streaming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-300" />
              <span className="text-gray-400 text-xs">Downloads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-emerald-200" />
              <span className="text-gray-400 text-xs">Lives</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Histórico de Transações</CardTitle>
          <CardDescription className="text-gray-400 text-xs">Últimas movimentações financeiras</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Descrição</TableHead>
                <TableHead className="text-gray-400">Data</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400 text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((tx) => (
                <TableRow key={tx.id} className="border-gray-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          tx.type === 'credit' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                        }`}
                      >
                        {tx.type === 'credit' ? (
                          <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                      <span className="text-white text-sm">{tx.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{tx.date}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                      Concluído
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium text-sm ${
                      tx.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(tx.amount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  // ===== ALBUMS VIEW =====

  const renderAlbums = () => {
    // Group mockSongs by albumName
    const albumMap = new Map<string, { albumName: string; artistName: string; coverUrl: string; songs: typeof mockSongs }>();
    mockSongs.forEach((song) => {
      const key = song.albumName || 'Single';
      if (!albumMap.has(key)) {
        albumMap.set(key, {
          albumName: key,
          artistName: song.artistName,
          coverUrl: song.coverUrl || '',
          songs: [],
        });
      }
      albumMap.get(key)!.songs.push(song);
    });
    const albums = Array.from(albumMap.values());

    // Show album detail if one is selected
    if (selectedAlbumId) {
      const album = albums.find((a) => a.albumName === selectedAlbumId);
      if (album) {
        return (
          <div className="space-y-6">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white mb-2"
              onClick={() => setSelectedAlbumId(null)}
            >
              ← Voltar aos Álbuns
            </Button>
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={album.coverUrl}
                alt={album.albumName}
                className="h-48 w-48 rounded-lg object-cover shrink-0"
              />
              <div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs mb-2">Álbum</Badge>
                <h2 className="text-2xl font-bold text-white">{album.albumName}</h2>
                <p className="text-gray-400 text-sm mt-1">{album.artistName} • {album.songs.length} músicas</p>
              </div>
            </div>
            <Card className="bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-transparent">
                      <TableHead className="text-gray-400">#</TableHead>
                      <TableHead className="text-gray-400">Título</TableHead>
                      <TableHead className="text-gray-400">Gênero</TableHead>
                      <TableHead className="text-gray-400 text-right">Reproduções</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {album.songs.map((song, i) => (
                      <TableRow key={song.id} className="border-gray-800">
                        <TableCell className="text-gray-400 text-sm">{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img src={song.coverUrl} alt={song.title} className="w-8 h-8 rounded object-cover shrink-0" />
                            <span className="text-white font-medium text-sm">{song.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">{song.genre}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-gray-300 text-sm">{formatPlayCount(song.playCount)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-white text-xl font-bold">Álbuns</h2>
            <p className="text-gray-400 text-sm">Gerencie seus álbuns, EPs e singles</p>
          </div>
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Criar Álbum
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {albums.map((album) => (
            <Card
              key={album.albumName}
              className="bg-gray-900 border-gray-800 cursor-pointer hover:border-emerald-500/30 transition-colors"
              onClick={() => setSelectedAlbumId(album.albumName)}
            >
              <CardContent className="p-3">
                <div className="aspect-square overflow-hidden rounded-lg mb-3">
                  <img src={album.coverUrl} alt={album.albumName} className="h-full w-full object-cover" />
                </div>
                <p className="text-white text-sm font-semibold truncate">{album.albumName}</p>
                <p className="text-gray-400 text-xs truncate">{album.artistName}</p>
                <p className="text-gray-500 text-xs mt-1">{album.songs.length} músicas</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ===== PODCASTS VIEW (CREATOR) =====

  const renderCreatorPodcasts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Podcasts</h2>
          <p className="text-gray-400 text-sm">Crie e gerencie seus podcasts e episódios</p>
        </div>
        <Button
          className="bg-emerald-500 hover:bg-emerald-600 text-white"
          onClick={() => setShowNewEpisodeModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Episódio
        </Button>
      </div>

      {/* New Episode Modal */}
      {showNewEpisodeModal && (
        <Card className="bg-gray-900 border-emerald-500/30 border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base">Novo Episódio</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowNewEpisodeModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription className="text-gray-400 text-xs">
              Adicione um novo episódio ao seu podcast
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Título do Episódio</Label>
              <Input
                placeholder="Ex: Entrevista com artista especial"
                value={episodeForm.title}
                onChange={(e) => setEpisodeForm({ ...episodeForm, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Descrição</Label>
              <Textarea
                placeholder="Do que se trata este episódio?"
                value={episodeForm.description}
                onChange={(e) => setEpisodeForm({ ...episodeForm, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Arquivo de Áudio</Label>
              <input
                type="file"
                accept="audio/*"
                ref={podcastAudioInputRef}
                className="hidden"
                onChange={handlePodcastAudioSelect}
              />
              <div
                className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer"
                onClick={() => podcastAudioInputRef.current?.click()}
              >
                {episodeForm.audioUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <p className="text-emerald-400 text-sm">Enviando áudio...</p>
                  </div>
                ) : episodeForm.audioFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    <p className="text-emerald-400 text-sm">{episodeForm.audioFile.name}</p>
                    <p className="text-gray-500 text-xs">Clique para trocar</p>
                  </div>
                ) : (
                  <>
                    <FileAudio className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Clique para enviar o áudio</p>
                    <p className="text-gray-500 text-xs mt-1">MP3, WAV, FLAC até 50MB</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1 sm:flex-none"
                disabled={episodeForm.submitting || episodeForm.audioUploading}
                onClick={handleSubmitEpisode}
              >
                {episodeForm.submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Criar Episódio
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white flex-1 sm:flex-none"
                onClick={() => setShowNewEpisodeModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPodcasts.map((podcast) => (
          <Card key={podcast.id} className="bg-gray-900 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <img src={podcast.coverUrl} alt={podcast.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm truncate">{podcast.title}</p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{podcast.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">{podcast.category}</Badge>
                    {podcast.isExclusive && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">Exclusivo</Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white text-xs">
                  <Play className="w-3 h-3 mr-1" /> Episódios
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ===== LIVES VIEW (CREATOR) =====

  const renderCreatorLives = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Lives</h2>
          <p className="text-gray-400 text-sm">Gerencie transmissões ao vivo</p>
        </div>
        <div className="flex items-center gap-2">
          {!activeLive && (
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setShowStartLiveModal(true)}
            >
              <Activity className="w-4 h-4 mr-2" />
              Iniciar Live
            </Button>
          )}
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
            onClick={() => setShowScheduleLiveModal(true)}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Live
          </Button>
        </div>
      </div>

      {/* Start Live Modal */}
      {showStartLiveModal && (
        <Card className="bg-gray-900 border-red-500/30 border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" />
                <CardTitle className="text-white text-base">Iniciar Live</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowStartLiveModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription className="text-gray-400 text-xs">
              Comece uma transmissão ao vivo agora
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Título da Live</Label>
              <Input
                placeholder="Ex: Show Acústico Ao Vivo"
                value={startLiveForm.title}
                onChange={(e) => setStartLiveForm({ ...startLiveForm, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Descrição</Label>
              <Textarea
                placeholder="Do que será a transmissão?"
                value={startLiveForm.description}
                onChange={(e) => setStartLiveForm({ ...startLiveForm, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 resize-none"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!startLiveForm.title.trim() || startingLive}
                onClick={handleStartLive}
              >
                {startingLive ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Iniciando...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 mr-2" />
                    Iniciar Agora
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowStartLiveModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Live Modal */}
      {showScheduleLiveModal && (
        <Card className="bg-gray-900 border-emerald-500/30 border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-base">Agendar Live</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowScheduleLiveModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Título da Live</Label>
              <Input
                placeholder="Ex: Show Acústico Especial"
                value={scheduleLiveForm.title}
                onChange={(e) => setScheduleLiveForm({ ...scheduleLiveForm, title: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Descrição</Label>
              <Textarea
                placeholder="Do que será a transmissão?"
                value={scheduleLiveForm.description}
                onChange={(e) => setScheduleLiveForm({ ...scheduleLiveForm, description: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Data e Hora</Label>
              <Input
                type="datetime-local"
                value={scheduleLiveForm.dateTime}
                onChange={(e) => setScheduleLiveForm({ ...scheduleLiveForm, dateTime: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={!scheduleLiveForm.title.trim() || !scheduleLiveForm.dateTime}
                onClick={() => {
                  toast({
                    title: 'Live agendada com sucesso!',
                    description: `"${scheduleLiveForm.title}" foi agendada.`,
                  });
                  setShowScheduleLiveModal(false);
                  setScheduleLiveForm({ title: '', description: '', dateTime: '' });
                }}
              >
                Agendar
              </Button>
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowScheduleLiveModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Live Stream */}
      {activeLive && (
        <Card className="bg-gray-900 border-red-500/50 border overflow-hidden">
          <div className="bg-red-600/10 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-16 h-16 rounded-lg bg-red-600/20 flex items-center justify-center shrink-0">
                  <Radio className="w-8 h-8 text-red-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-bold text-lg truncate">{activeLive.title}</p>
                    <Badge className="bg-red-600 text-white border-red-700 text-xs shrink-0 animate-pulse">
                      AO VIVO
                    </Badge>
                  </div>
                  {activeLive.description && (
                    <p className="text-gray-400 text-sm mt-1 truncate">{activeLive.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-red-400 text-sm">
                      <Eye className="w-4 h-4" />
                      {activeLive.viewerCount || 0} assistindo
                    </span>
                    <span className="text-gray-500 text-xs">
                      Iniciada em {activeLive.startedAt ? new Date(activeLive.startedAt).toLocaleTimeString('pt-BR') : 'agora'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white shrink-0"
                disabled={endingLive}
                onClick={handleEndLive}
              >
                {endingLive ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Encerrando...
                  </>
                ) : (
                  <>
                    <StopCircle className="w-4 h-4 mr-2" />
                    Encerrar Live
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Past Lives from Database */}
      {dbLives.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-400" />
            Histórico de Lives
          </h3>
          {loadingLives ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            </div>
          ) : (
            dbLives
              .filter((live: any) => !live.isLive)
              .map((live: any) => (
                <Card key={live.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                        {live.endedAt ? (
                          <StopCircle className="w-5 h-5 text-gray-500" />
                        ) : (
                          <Calendar className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-semibold text-sm truncate">{live.title}</p>
                          {live.isLive ? (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs shrink-0">AO VIVO</Badge>
                          ) : live.endedAt ? (
                            <Badge className="bg-gray-700 text-gray-400 border-gray-600 text-xs shrink-0">Encerrada</Badge>
                          ) : (
                            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs shrink-0">Agendada</Badge>
                          )}
                        </div>
                        {live.description && (
                          <p className="text-gray-400 text-xs mt-1 truncate">{live.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          {live.startedAt && (
                            <span>Início: {new Date(live.startedAt).toLocaleString('pt-BR')}</span>
                          )}
                          {live.viewerCount > 0 && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" /> {live.viewerCount} espectadores
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}

      {/* Mock Lives for Examples */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold text-sm text-gray-400">Exemplos de Lives</h3>
        {mockLiveStreams.map((stream) => (
          <Card key={stream.id} className="bg-gray-900 border-gray-800 opacity-70">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img src={stream.thumbnail} alt={stream.title} className="w-24 h-16 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm truncate">{stream.title}</p>
                    {stream.isLive && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs shrink-0">AO VIVO</Badge>
                    )}
                    {stream.isScheduled && (
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs shrink-0">Agendada</Badge>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">{stream.artistName}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    {stream.isLive && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {formatPlayCount(stream.viewerCount)} assistindo
                      </span>
                    )}
                    {stream.isScheduled && stream.scheduledAt && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(stream.scheduledAt).toLocaleString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ===== PLACEHOLDER VIEW =====

  const renderPlaceholder = (title: string, description: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-white text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-400 text-sm max-w-md">{description}</p>
        <Button className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white">
          Em breve
        </Button>
      </div>
    );
  };

  // ===== RENDER ACTIVE VIEW =====

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboard();
      case 'music':
        return renderMusic();
      case 'albums':
        return renderAlbums();
      case 'podcasts':
        return renderCreatorPodcasts();
      case 'lives':
        return renderCreatorLives();
      case 'analytics':
        return renderAnalytics();
      case 'financial':
        return renderFinancial();
      case 'settings':
        return renderPlaceholder(
          'Configurações',
          'Configure seu perfil de criador, integrações bancárias e preferências de notificação.',
          Settings
        );
      default:
        return renderDashboard();
    }
  };

  // ===== MAIN RENDER =====

  return (
    <div className="flex h-full min-h-screen bg-gray-950">
      {/* Sidebar */}
      {renderSidebar()}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-white font-semibold">
              {creatorNavItems.find((i) => i.id === activeView)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-emerald-500 text-white text-xs">LM</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}
