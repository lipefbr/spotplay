'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  Music,
  Mic2,
  Radio,
  Megaphone,
  FileBarChart,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Play,
  Eye,
  MoreHorizontal,
  Search,
  Bell,
  ChevronRight,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
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
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { adminAnalytics, mockSongs, mockArtists } from '@/lib/mock-data';
import { formatCurrency, formatPlayCount } from '@/lib/asaas';

// ===== SIDEBAR NAV ITEMS =====

type AdminView =
  | 'dashboard'
  | 'users'
  | 'subscriptions'
  | 'payments'
  | 'creators'
  | 'songs'
  | 'podcasts'
  | 'lives'
  | 'ads'
  | 'reports'
  | 'settings';

const adminNavItems: { id: AdminView; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'subscriptions', label: 'Assinaturas', icon: CreditCard },
  { id: 'payments', label: 'Pagamentos', icon: DollarSign },
  { id: 'creators', label: 'Criadores', icon: Mic2 },
  { id: 'songs', label: 'Músicas', icon: Music },
  { id: 'podcasts', label: 'Podcasts', icon: Radio },
  { id: 'lives', label: 'Lives', icon: Activity },
  { id: 'ads', label: 'Anúncios', icon: Megaphone },
  { id: 'reports', label: 'Relatórios', icon: FileBarChart },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

// ===== MOCK DATA FOR VIEWS =====

const mockUsers = [
  { id: 'u1', name: 'João Silva', email: 'joao@email.com', role: 'premium' as const, plan: 'Premium Individual', status: 'active', avatar: '', joined: '2024-01-15' },
  { id: 'u2', name: 'Maria Santos', email: 'maria@email.com', role: 'creator' as const, plan: 'Premium Família', status: 'active', avatar: '', joined: '2024-02-20' },
  { id: 'u3', name: 'Pedro Costa', email: 'pedro@email.com', role: 'free' as const, plan: 'Free', status: 'active', avatar: '', joined: '2024-03-10' },
  { id: 'u4', name: 'Ana Oliveira', email: 'ana@email.com', role: 'premium' as const, plan: 'Premium Duo', status: 'inactive', avatar: '', joined: '2024-04-05' },
  { id: 'u5', name: 'Carlos Souza', email: 'carlos@email.com', role: 'free' as const, plan: 'Free', status: 'active', avatar: '', joined: '2024-05-12' },
  { id: 'u6', name: 'Fernanda Lima', email: 'fernanda@email.com', role: 'creator' as const, plan: 'Premium Individual', status: 'active', avatar: '', joined: '2024-06-18' },
  { id: 'u7', name: 'Ricardo Alves', email: 'ricardo@email.com', role: 'premium' as const, plan: 'Premium Estudante', status: 'active', avatar: '', joined: '2024-07-22' },
  { id: 'u8', name: 'Juliana Mendes', email: 'juliana@email.com', role: 'free' as const, plan: 'Free', status: 'suspended', avatar: '', joined: '2024-08-30' },
];

const mockSubscriptions = [
  { id: 'sub1', user: 'João Silva', plan: 'Premium Individual', price: 21.90, status: 'active', billing: 'PIX', nextBilling: '2025-07-15' },
  { id: 'sub2', user: 'Maria Santos', plan: 'Premium Família', price: 39.90, status: 'active', billing: 'Cartão', nextBilling: '2025-07-20' },
  { id: 'sub3', user: 'Ana Oliveira', plan: 'Premium Duo', price: 29.90, status: 'canceled', billing: 'PIX', nextBilling: '-' },
  { id: 'sub4', user: 'Fernanda Lima', plan: 'Premium Individual', price: 21.90, status: 'active', billing: 'Cartão', nextBilling: '2025-07-18' },
  { id: 'sub5', user: 'Ricardo Alves', plan: 'Premium Estudante', price: 11.95, status: 'active', billing: 'PIX', nextBilling: '2025-07-22' },
  { id: 'sub6', user: 'Lucas Ferreira', plan: 'Premium Individual', price: 21.90, status: 'past_due', billing: 'Boleto', nextBilling: '2025-06-30' },
];

const recentActivity = [
  { id: '1', action: 'Novo usuário cadastrado', user: 'Beatriz Rocha', time: '2 min atrás', type: 'user' },
  { id: '2', action: 'Assinatura Premium ativada', user: 'Lucas Ferreira', time: '15 min atrás', type: 'subscription' },
  { id: '3', action: 'Música aprovada pelo moderador', user: 'DJ Thunder - Neon Lights', time: '1h atrás', type: 'content' },
  { id: '4', action: 'Pagamento recebido via PIX', user: 'Maria Santos - R$ 39,90', time: '2h atrás', type: 'payment' },
  { id: '5', action: 'Nova live agendada', user: 'Marina Silva', time: '3h atrás', type: 'content' },
  { id: '6', action: 'Conta suspensa por violação', user: 'Juliana Mendes', time: '5h atrás', type: 'moderation' },
  { id: '7', action: 'Relatório mensal gerado', user: 'Sistema', time: '1 dia atrás', type: 'system' },
  { id: '8', action: 'Criador verificado', user: 'Ana Costa', time: '1 dia atrás', type: 'creator' },
];

const pieData = [
  { name: 'Premium Individual', value: 45, color: '#10b981' },
  { name: 'Premium Duo', value: 15, color: '#34d399' },
  { name: 'Premium Família', value: 25, color: '#6ee7b7' },
  { name: 'Premium Estudante', value: 10, color: '#a7f3d0' },
  { name: 'Free', value: 5, color: '#374151' },
];

// ===== COMPONENT =====

export default function AdminPanel() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userSearch, setUserSearch] = useState('');

  const data = adminAnalytics;

  // ===== STAT CARDS =====

  const statCards = [
    {
      title: 'Total de Usuários',
      value: data.totalUsers.toLocaleString('pt-BR'),
      change: '+12.5%',
      trend: 'up' as const,
      icon: Users,
      description: 'vs. mês anterior',
    },
    {
      title: 'Usuários Premium',
      value: data.premiumUsers.toLocaleString('pt-BR'),
      change: '+8.2%',
      trend: 'up' as const,
      icon: CreditCard,
      description: 'vs. mês anterior',
    },
    {
      title: 'Receita Mensal',
      value: formatCurrency(data.totalRevenue),
      change: '+15.3%',
      trend: 'up' as const,
      icon: DollarSign,
      description: 'vs. mês anterior',
    },
    {
      title: 'Usuários Ativos',
      value: data.activeUsers.toLocaleString('pt-BR'),
      change: '-2.1%',
      trend: 'down' as const,
      icon: Activity,
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
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight">SoundFlow</h1>
            <p className="text-gray-400 text-xs">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
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
        {statCards.map((stat) => {
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-base">Receita Mensal</CardTitle>
                <CardDescription className="text-gray-400 text-xs">
                  Evolução da receita nos últimos 6 meses
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                +15.3%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.revenueByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
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
                    formatter={(value: number) => [formatCurrency(value), 'Receita']}
                    cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                  />
                  <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-base">Crescimento de Usuários</CardTitle>
                <CardDescription className="text-gray-400 text-xs">
                  Novos cadastros por mês
                </CardDescription>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.usersByMonth} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
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
                    formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Usuários']}
                    cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#030712', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Top Songs + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Songs Table */}
        <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white text-base">Músicas Mais Tocadas</CardTitle>
                <CardDescription className="text-gray-400 text-xs">
                  Top 5 músicas da plataforma
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-transparent">
                  <TableHead className="text-gray-400">#</TableHead>
                  <TableHead className="text-gray-400">Música</TableHead>
                  <TableHead className="text-gray-400">Artista</TableHead>
                  <TableHead className="text-gray-400">Gênero</TableHead>
                  <TableHead className="text-gray-400 text-right">Reproduções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topSongs.map((song, i) => (
                  <TableRow key={song.id} className="border-gray-800">
                    <TableCell className="text-gray-400 font-medium">{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0">
                          <Music className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-white font-medium text-sm">{song.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">{song.artistName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">
                        {song.genre}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-gray-300 text-sm">
                      {formatPlayCount(song.playCount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">Atividade Recente</CardTitle>
            <CardDescription className="text-gray-400 text-xs">Últimas ações no sistema</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {activity.type === 'user' && <Users className="w-3.5 h-3.5 text-blue-400" />}
                    {activity.type === 'subscription' && <CreditCard className="w-3.5 h-3.5 text-emerald-400" />}
                    {activity.type === 'content' && <Music className="w-3.5 h-3.5 text-purple-400" />}
                    {activity.type === 'payment' && <DollarSign className="w-3.5 h-3.5 text-amber-400" />}
                    {activity.type === 'moderation' && <Shield className="w-3.5 h-3.5 text-red-400" />}
                    {activity.type === 'system' && <Settings className="w-3.5 h-3.5 text-gray-400" />}
                    {activity.type === 'creator' && <Mic2 className="w-3.5 h-3.5 text-pink-400" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-200 text-xs leading-snug">{activity.action}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{activity.user} &middot; {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Distribution */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base">Distribuição de Planos</CardTitle>
          <CardDescription className="text-gray-400 text-xs">Distribuição dos usuários por tipo de plano</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="h-64 w-64 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111827',
                      border: '1px solid #1f2937',
                      borderRadius: '8px',
                      color: '#f9fafb',
                    }}
                    formatter={(value: number) => [`${value}%`, 'Participação']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-300 text-sm">{entry.name}</span>
                  <span className="text-white font-semibold text-sm ml-auto">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ===== USERS VIEW =====

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Gerenciamento de Usuários</h2>
          <p className="text-gray-400 text-sm">Gerencie todos os usuários da plataforma</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Buscar usuário..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="pl-9 bg-gray-800 border-gray-700 text-white placeholder-gray-500 w-64"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-36 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="creator">Criador</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Usuário</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">Função</TableHead>
                <TableHead className="text-gray-400">Plano</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers
                .filter(
                  (u) =>
                    !userSearch ||
                    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearch.toLowerCase())
                )
                .map((user) => (
                  <TableRow key={user.id} className="border-gray-800">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gray-700 text-gray-300 text-xs">
                            {user.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white font-medium text-sm">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${
                          user.role === 'creator'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : user.role === 'premium'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }`}
                      >
                        {user.role === 'creator' ? 'Criador' : user.role === 'premium' ? 'Premium' : 'Gratuito'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300 text-sm">{user.plan}</TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs ${
                          user.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : user.status === 'inactive'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Suspens'}
                      </Badge>
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

  // ===== SUBSCRIPTIONS VIEW =====

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white text-xl font-bold">Assinaturas</h2>
          <p className="text-gray-400 text-sm">Gerencie as assinaturas dos usuários</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="canceled">Canceladas</SelectItem>
              <SelectItem value="past_due">Vencidas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Assinaturas Ativas</p>
              <p className="text-white text-xl font-bold">34.567</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Receita Recorrente (MRR)</p>
              <p className="text-white text-xl font-bold">{formatCurrency(856234.5)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Taxa de Conversão</p>
              <p className="text-white text-xl font-bold">27.7%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-transparent">
                <TableHead className="text-gray-400">Usuário</TableHead>
                <TableHead className="text-gray-400">Plano</TableHead>
                <TableHead className="text-gray-400">Valor</TableHead>
                <TableHead className="text-gray-400">Cobrança</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Próx. Cobrança</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSubscriptions.map((sub) => (
                <TableRow key={sub.id} className="border-gray-800">
                  <TableCell className="text-white font-medium text-sm">{sub.user}</TableCell>
                  <TableCell className="text-gray-300 text-sm">{sub.plan}</TableCell>
                  <TableCell className="text-gray-300 text-sm">{formatCurrency(sub.price)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-gray-400 border-gray-700 text-xs">
                      {sub.billing}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs ${
                        sub.status === 'active'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : sub.status === 'canceled'
                          ? 'bg-red-500/20 text-red-400 border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {sub.status === 'active' ? 'Ativa' : sub.status === 'canceled' ? 'Cancelada' : 'Vencida'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{sub.nextBilling}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
      case 'users':
        return renderUsers();
      case 'subscriptions':
        return renderSubscriptions();
      case 'payments':
        return renderPlaceholder(
          'Pagamentos',
          'Gerencie todos os pagamentos realizados na plataforma, incluindo PIX, cartão de crédito e boleto bancário.',
          DollarSign
        );
      case 'creators':
        return renderPlaceholder(
          'Criadores',
          'Gerencie os criadores de conteúdo da plataforma, verificação de artistas e métricas de desempenho.',
          Mic2
        );
      case 'songs':
        return renderPlaceholder(
          'Músicas',
          'Modere e gerencie o catálogo de músicas da plataforma, aprovações e remoções de conteúdo.',
          Music
        );
      case 'podcasts':
        return renderPlaceholder(
          'Podcasts',
          'Gerencie os podcasts disponíveis na plataforma, episódios e conteúdos exclusivos.',
          Radio
        );
      case 'lives':
        return renderPlaceholder(
          'Lives',
          'Gerencie as transmissões ao vivo, agendamentos e monitoramento de conteúdo.',
          Activity
        );
      case 'ads':
        return renderPlaceholder(
          'Anúncios',
          'Configure e gerencie os anúncios da plataforma, campanhas publicitárias e métricas.',
          Megaphone
        );
      case 'reports':
        return renderPlaceholder(
          'Relatórios',
          'Gere relatórios detalhados sobre usuários, receita, conteúdo e métricas de engajamento.',
          FileBarChart
        );
      case 'settings':
        return renderPlaceholder(
          'Configurações',
          'Configure as definições gerais da plataforma, notificações, integrações e segurança.',
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
              {adminNavItems.find((i) => i.id === activeView)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full" />
            </Button>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-emerald-500 text-white text-xs">AD</AvatarFallback>
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
