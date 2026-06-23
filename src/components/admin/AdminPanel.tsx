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
  Search,
  Bell,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Ban,
  Edit3,
  Plus,
  Download,
  Upload,
  Volume2,
  Image,
  Video,
  Key,
  Globe,
  Mail,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  BarChart3,
  FileText,
  Trash2,
  Check,
  X,
  MoreVertical,
  ExternalLink,
  Clock,
  Zap,
  UserPlus,
  Filter,
  EyeOff,
  Wifi,
  WifiOff,
  Save,
  Loader2,
  Monitor,
  Smartphone,
  Tablet,
  LogOut,
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminAnalytics, mockSongs, mockArtists, mockPodcasts, mockLiveStreams, subscriptionPlans } from '@/lib/mock-data';
import { formatCurrency, formatPlayCount } from '@/lib/asaas';
import { resetAdminAuthCache } from '@/app/admin/page';

// ===== TYPES =====

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

interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'free' | 'premium' | 'creator' | 'moderator' | 'admin';
  plan: 'free' | 'premium_individual' | 'premium_duo' | 'premium_familia' | 'premium_estudante';
  status: 'active' | 'suspended' | 'banned';
  joinedDate: string;
}

interface MockSubscription {
  id: string;
  userId: string;
  userName: string;
  plan: string;
  price: number;
  status: 'active' | 'canceled' | 'expired' | 'past_due';
  billingMethod: 'PIX' | 'Cartão' | 'Boleto';
  nextBilling: string;
}

interface MockPayment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito';
  status: 'confirmed' | 'pending' | 'failed' | 'refunded';
  date: string;
}

interface MockAdCampaign {
  id: string;
  name: string;
  type: 'audio' | 'video' | 'banner';
  status: 'active' | 'inactive';
  impressions: number;
  clicks: number;
  budget: number;
  spent: number;
  targetUrl: string;
  duration: number;
  frequency: number;
  audioFileName?: string;
}

// ===== SIDEBAR NAV ITEMS =====

const NAV_ITEMS: { icon: React.ElementType; label: string; view: AdminView }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
  { icon: Users, label: 'Usuários', view: 'users' },
  { icon: CreditCard, label: 'Assinaturas', view: 'subscriptions' },
  { icon: DollarSign, label: 'Pagamentos', view: 'payments' },
  { icon: Mic2, label: 'Criadores', view: 'creators' },
  { icon: Music, label: 'Músicas', view: 'songs' },
  { icon: Radio, label: 'Podcasts', view: 'podcasts' },
  { icon: Activity, label: 'Lives', view: 'lives' },
  { icon: Megaphone, label: 'Anúncios', view: 'ads' },
  { icon: FileBarChart, label: 'Relatórios', view: 'reports' },
  { icon: Settings, label: 'Configurações', view: 'settings' },
];

// ===== MOCK DATA =====

const mockUsers: MockUser[] = [
  { id: 'u1', name: 'Lucas Mendes', email: 'lucas@email.com', avatar: 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=100&h=100&fit=crop', role: 'creator', plan: 'premium_individual', status: 'active', joinedDate: '2024-03-15' },
  { id: 'u2', name: 'Marina Silva', email: 'marina@email.com', avatar: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=100&h=100&fit=crop', role: 'creator', plan: 'premium_familia', status: 'active', joinedDate: '2024-01-20' },
  { id: 'u3', name: 'DJ Thunder', email: 'dj@email.com', avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&h=100&fit=crop', role: 'creator', plan: 'premium_individual', status: 'active', joinedDate: '2024-02-10' },
  { id: 'u4', name: 'Ana Costa', email: 'ana@email.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', role: 'free', plan: 'free', status: 'active', joinedDate: '2024-06-01' },
  { id: 'u5', name: 'Pedro Almeida', email: 'pedro@email.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', role: 'premium', plan: 'premium_duo', status: 'active', joinedDate: '2024-04-15' },
  { id: 'u6', name: 'Capoeira Soul', email: 'capoeira@email.com', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', role: 'creator', plan: 'premium_individual', status: 'suspended', joinedDate: '2024-05-01' },
  { id: 'u7', name: 'Rafael Torres', email: 'rafael@email.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop', role: 'premium', plan: 'premium_estudante', status: 'active', joinedDate: '2024-07-10' },
  { id: 'u8', name: 'Isabela Ferreira', email: 'isabela@email.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', role: 'creator', plan: 'premium_individual', status: 'active', joinedDate: '2024-03-20' },
  { id: 'u9', name: 'João Santos', email: 'joao@email.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', role: 'free', plan: 'free', status: 'banned', joinedDate: '2024-08-05' },
  { id: 'u10', name: 'Camila Rocha', email: 'camila@email.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop', role: 'moderator', plan: 'premium_individual', status: 'active', joinedDate: '2024-01-10' },
  { id: 'u11', name: 'Admin SoundFlow', email: 'admin@soundflow.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', role: 'admin', plan: 'premium_individual', status: 'active', joinedDate: '2023-12-01' },
  { id: 'u12', name: 'Fernanda Lima', email: 'fernanda@email.com', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop', role: 'free', plan: 'free', status: 'active', joinedDate: '2024-09-12' },
];

const mockSubscriptions: MockSubscription[] = [
  { id: 'sub1', userId: 'u1', userName: 'Lucas Mendes', plan: 'Premium Individual', price: 21.90, status: 'active', billingMethod: 'PIX', nextBilling: '2025-07-15' },
  { id: 'sub2', userId: 'u2', userName: 'Marina Silva', plan: 'Premium Família', price: 39.90, status: 'active', billingMethod: 'Cartão', nextBilling: '2025-07-20' },
  { id: 'sub3', userId: 'u3', userName: 'DJ Thunder', plan: 'Premium Individual', price: 21.90, status: 'active', billingMethod: 'Cartão', nextBilling: '2025-07-10' },
  { id: 'sub4', userId: 'u5', userName: 'Pedro Almeida', plan: 'Premium Duo', price: 29.90, status: 'active', billingMethod: 'PIX', nextBilling: '2025-07-15' },
  { id: 'sub5', userId: 'u6', userName: 'Capoeira Soul', plan: 'Premium Individual', price: 21.90, status: 'canceled', billingMethod: 'Cartão', nextBilling: '2025-06-01' },
  { id: 'sub6', userId: 'u7', userName: 'Rafael Torres', plan: 'Premium Estudante', price: 11.95, status: 'active', billingMethod: 'PIX', nextBilling: '2025-07-10' },
  { id: 'sub7', userId: 'u8', userName: 'Isabela Ferreira', plan: 'Premium Individual', price: 21.90, status: 'past_due', billingMethod: 'Cartão', nextBilling: '2025-06-20' },
  { id: 'sub8', userId: 'u10', userName: 'Camila Rocha', plan: 'Premium Individual', price: 21.90, status: 'active', billingMethod: 'PIX', nextBilling: '2025-07-10' },
  { id: 'sub9', userId: 'u11', userName: 'Admin SoundFlow', plan: 'Premium Individual', price: 21.90, status: 'active', billingMethod: 'Cartão', nextBilling: '2025-07-01' },
  { id: 'sub10', userId: 'u12', userName: 'Fernanda Lima', plan: 'Premium Individual', price: 21.90, status: 'expired', billingMethod: 'PIX', nextBilling: '2025-05-01' },
];

const mockPayments: MockPayment[] = [
  { id: 'PAY001', userId: 'u1', userName: 'Lucas Mendes', amount: 21.90, method: 'PIX', status: 'confirmed', date: '2025-06-15' },
  { id: 'PAY002', userId: 'u2', userName: 'Marina Silva', amount: 39.90, method: 'Cartão de Crédito', status: 'confirmed', date: '2025-06-20' },
  { id: 'PAY003', userId: 'u3', userName: 'DJ Thunder', amount: 21.90, method: 'Cartão de Crédito', status: 'confirmed', date: '2025-06-10' },
  { id: 'PAY004', userId: 'u5', userName: 'Pedro Almeida', amount: 29.90, method: 'PIX', status: 'confirmed', date: '2025-06-15' },
  { id: 'PAY005', userId: 'u7', userName: 'Rafael Torres', amount: 11.95, method: 'PIX', status: 'pending', date: '2025-06-10' },
  { id: 'PAY006', userId: 'u8', userName: 'Isabela Ferreira', amount: 21.90, method: 'Cartão de Crédito', status: 'failed', date: '2025-06-20' },
  { id: 'PAY007', userId: 'u10', userName: 'Camila Rocha', amount: 21.90, method: 'PIX', status: 'confirmed', date: '2025-06-10' },
  { id: 'PAY008', userId: 'u1', userName: 'Lucas Mendes', amount: 21.90, method: 'PIX', status: 'confirmed', date: '2025-05-15' },
  { id: 'PAY009', userId: 'u2', userName: 'Marina Silva', amount: 39.90, method: 'Cartão de Crédito', status: 'confirmed', date: '2025-05-20' },
  { id: 'PAY010', userId: 'u6', userName: 'Capoeira Soul', amount: 21.90, method: 'Cartão de Crédito', status: 'refunded', date: '2025-05-01' },
  { id: 'PAY011', userId: 'u11', userName: 'Admin SoundFlow', amount: 21.90, method: 'Cartão de Crédito', status: 'confirmed', date: '2025-06-01' },
  { id: 'PAY012', userId: 'u12', userName: 'Fernanda Lima', amount: 21.90, method: 'PIX', status: 'pending', date: '2025-06-25' },
];

const mockAdCampaigns: MockAdCampaign[] = [
  { id: 'ad1', name: 'Promo Verão 2025', type: 'audio', status: 'active', impressions: 125000, clicks: 3200, budget: 5000, spent: 3750, targetUrl: 'https://example.com/promo', duration: 30, frequency: 3 },
  { id: 'ad2', name: 'Novo App SoundFlow', type: 'video', status: 'active', impressions: 89000, clicks: 2100, budget: 8000, spent: 4500, targetUrl: 'https://example.com/app', duration: 15, frequency: 5 },
  { id: 'ad3', name: 'Premium Duo Lançamento', type: 'banner', status: 'active', impressions: 230000, clicks: 5600, budget: 3000, spent: 2800, targetUrl: 'https://example.com/duo', duration: 0, frequency: 4 },
  { id: 'ad4', name: 'Black Friday 2024', type: 'audio', status: 'inactive', impressions: 450000, clicks: 12000, budget: 10000, spent: 10000, targetUrl: 'https://example.com/bf', duration: 30, frequency: 3 },
  { id: 'ad5', name: 'Podcast Original SF', type: 'video', status: 'inactive', impressions: 56000, clicks: 890, budget: 2000, spent: 1200, targetUrl: 'https://example.com/podcast', duration: 20, frequency: 6 },
];

const planDistribution = [
  { name: 'Free', value: 89000, color: '#6b7280' },
  { name: 'Individual', value: 22000, color: '#10b981' },
  { name: 'Duo', value: 6500, color: '#f59e0b' },
  { name: 'Família', value: 4500, color: '#8b5cf6' },
  { name: 'Estudante', value: 1567, color: '#06b6d4' },
];

const recentActivity = [
  { id: '1', user: 'Marina Silva', action: 'assinou Premium Família', time: '2 min atrás', icon: CreditCard },
  { id: '2', user: 'DJ Thunder', action: 'enviou nova música "Neon Lights"', time: '15 min atrás', icon: Music },
  { id: '3', user: 'Ana Costa', action: 'iniciou live "Brisa Tropical"', time: '30 min atrás', icon: Radio },
  { id: '4', user: 'Pedro Almeida', action: 'cancelou assinatura', time: '1h atrás', icon: XCircle },
  { id: '5', user: 'Capoeira Soul', action: 'foi suspenso por violação', time: '2h atrás', icon: Shield },
  { id: '6', user: 'Isabela Ferreira', action: 'pagamento falhou', time: '3h atrás', icon: AlertTriangle },
  { id: '7', user: 'Rafael Torres', action: 'verificação de estudante aprovada', time: '4h atrás', icon: CheckCircle2 },
  { id: '8', user: 'Camila Rocha', action: 'foi promovida a moderadora', time: '5h atrás', icon: Users },
];

// ===== HELPER COMPONENTS =====

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { className: string; label: string }> = {
    active: { className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Ativo' },
    inactive: { className: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Inativo' },
    pending: { className: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Pendente' },
    approved: { className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Aprovado' },
    rejected: { className: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Rejeitado' },
    removed: { className: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Removido' },
    suspended: { className: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Suspenso' },
    banned: { className: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Banido' },
    canceled: { className: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Cancelado' },
    expired: { className: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'Expirado' },
    past_due: { className: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Em Atraso' },
    confirmed: { className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Confirmado' },
    failed: { className: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Falhou' },
    refunded: { className: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Reembolsado' },
    live: { className: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Ao Vivo' },
    scheduled: { className: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Agendado' },
    ended: { className: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Encerrado' },
  };
  const v = variants[status] || { className: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: status };
  return <Badge className={`${v.className} border text-xs font-medium`}>{v.label}</Badge>;
}

function RoleBadge({ role }: { role: string }) {
  const variants: Record<string, { className: string; label: string }> = {
    admin: { className: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Admin' },
    moderator: { className: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Moderador' },
    creator: { className: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Criador' },
    premium: { className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Premium' },
    free: { className: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'Free' },
  };
  const v = variants[role] || variants.free;
  return <Badge className={`${v.className} border text-xs font-medium`}>{v.label}</Badge>;
}

function PlanBadge({ plan }: { plan: string }) {
  const map: Record<string, string> = {
    free: 'Free',
    premium_individual: 'Individual',
    premium_duo: 'Duo',
    premium_familia: 'Família',
    premium_estudante: 'Estudante',
  };
  return <span className="text-xs text-gray-300">{map[plan] || plan}</span>;
}

// ===== SIDEBAR COMPONENT =====

function AdminSidebar({
  currentView,
  onViewChange,
  collapsed,
  onToggleCollapse,
  onLogout,
}: {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}) {
  return (
    <aside
      className={`fixed left-0 top-14 bottom-0 z-40 flex flex-col bg-gray-900 border-r border-white/5 transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* Logo Header - Always visible */}
      <div className={`flex items-center h-16 px-4 border-b border-white/5 shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0">
          <Music className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-base font-bold text-white tracking-tight">SoundFlow</h1>
            <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Scrollable Nav Items */}
      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-1 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onViewChange(item.view)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-emerald-400' : ''}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Bottom Buttons - Always visible */}
      <div className="shrink-0 border-t border-white/5 p-3 space-y-1">
        <button
          onClick={onLogout}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full ${collapsed ? 'justify-center px-2' : ''}`}
          title={collapsed ? 'Sair' : undefined}
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
        <button
          onClick={onToggleCollapse}
          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors w-full ${collapsed ? 'justify-center px-2' : ''}`}
        >
          {collapsed ? <ChevronRight className="h-[18px] w-[18px] shrink-0" /> : <ChevronLeft className="h-[18px] w-[18px] shrink-0" />}
          {!collapsed && <span>Recolher</span>}
        </button>
      </div>
    </aside>
  );
}

// ===== DASHBOARD VIEW =====

function DashboardView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-sm text-gray-400 mt-1">Visão geral da plataforma SoundFlow</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <Activity className="h-3 w-3 mr-1" /> Tempo real
          </Badge>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total de Usuários', value: adminAnalytics.totalUsers.toLocaleString('pt-BR'), trend: '+12.5%', up: true, icon: Users, color: 'emerald' },
          { title: 'Premium', value: adminAnalytics.premiumUsers.toLocaleString('pt-BR'), trend: '+8.3%', up: true, icon: CreditCard, color: 'amber' },
          { title: 'Receita Mensal', value: formatCurrency(adminAnalytics.totalRevenue), trend: '+15.2%', up: true, icon: DollarSign, color: 'emerald' },
          { title: 'Usuários Ativos', value: adminAnalytics.activeUsers.toLocaleString('pt-BR'), trend: '+5.7%', up: true, icon: Activity, color: 'emerald' },
        ].map((stat) => (
          <Card key={stat.title} className="bg-gray-900 border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color === 'amber' ? 'bg-amber-500/15' : 'bg-emerald-500/15'}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'}`} />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.up ? <ArrowUpRight className="h-3 w-3 text-emerald-400" /> : <ArrowDownRight className="h-3 w-3 text-red-400" />}
                  <span className={stat.up ? 'text-emerald-400' : 'text-red-400'}>{stat.trend}</span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <Card className="bg-gray-900 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Receita Mensal</CardTitle>
            <CardDescription className="text-xs text-gray-400">Receita dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={adminAnalytics.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => [formatCurrency(value), 'Receita']}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="bg-gray-900 border-white/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Crescimento de Usuários</CardTitle>
            <CardDescription className="text-xs text-gray-400">Usuários totais por mês</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={adminAnalytics.usersByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                  labelStyle={{ color: '#9ca3af' }}
                  formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Usuários']}
                />
                <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Top Songs + Activity + Plan Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top Songs */}
        <Card className="bg-gray-900 border-white/5 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Top Músicas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {adminAnalytics.topSongs.map((song, i) => (
                <div key={song.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 w-4 text-center">{i + 1}</span>
                  <Avatar className="h-9 w-9 rounded">
                    <AvatarImage src={song.coverUrl} />
                    <AvatarFallback className="bg-gray-800 text-gray-400 text-xs"><Music className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{song.title}</p>
                    <p className="text-xs text-gray-400 truncate">{song.artistName}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">{formatPlayCount(song.playCount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-white/5 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Atividade Recente</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="h-7 w-7 rounded-full bg-gray-800 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white"><span className="font-medium">{activity.user}</span> {activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card className="bg-gray-900 border-white/5 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-white">Distribuição de Planos</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                  {planDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '8px' }}
                  formatter={(value: number) => [value.toLocaleString('pt-BR'), 'Usuários']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {planDistribution.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: plan.color }} />
                    <span className="text-gray-300">{plan.name}</span>
                  </div>
                  <span className="text-gray-400">{plan.value.toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ===== USUÁRIOS VIEW =====

function UsersView() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState(mockUsers);
  const [editDialog, setEditDialog] = useState<MockUser | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editPlan, setEditPlan] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSaveUser = () => {
    if (!editDialog) return;
    setUsers(prev => prev.map(u => u.id === editDialog.id ? { ...u, role: editRole as MockUser['role'], plan: editPlan as MockUser['plan'], status: editStatus as MockUser['status'] } : u));
    setEditDialog(null);
  };

  const handleSuspend = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'suspended' ? 'active' as const : 'suspended' as const } : u));
  };

  const handleBan = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'banned' as const } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Usuários</h2>
          <p className="text-sm text-gray-400 mt-1">Gerenciar usuários da plataforma</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <UserPlus className="h-4 w-4 mr-2" /> Novo Usuário
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filtrar por cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os cargos</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="moderator">Moderador</SelectItem>
            <SelectItem value="creator">Criador</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="free">Free</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <Card className="bg-gray-900 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400">Usuário</TableHead>
                <TableHead className="text-gray-400">Cargo</TableHead>
                <TableHead className="text-gray-400">Plano</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Data</TableHead>
                <TableHead className="text-gray-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gray-700 text-gray-300 text-xs">{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><RoleBadge role={user.role} /></TableCell>
                  <TableCell><PlanBadge plan={user.plan} /></TableCell>
                  <TableCell><StatusBadge status={user.status} /></TableCell>
                  <TableCell className="text-sm text-gray-400">{new Date(user.joinedDate).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-white"
                        onClick={() => { setEditDialog(user); setEditRole(user.role); setEditPlan(user.plan); setEditStatus(user.status); }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${user.status === 'suspended' ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'}`}
                        onClick={() => handleSuspend(user.id)}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300"
                        onClick={() => handleBan(user.id)}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={!!editDialog} onOpenChange={(open) => !open && setEditDialog(null)}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription className="text-gray-400">Altere o cargo, plano e status do usuário</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-gray-300">Nome</Label>
              <Input value={editDialog?.name || ''} disabled className="bg-gray-800 border-gray-700 text-gray-400" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Cargo</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="creator">Criador</SelectItem>
                  <SelectItem value="moderator">Moderador</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Plano</Label>
              <Select value={editPlan} onValueChange={setEditPlan}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="premium_individual">Premium Individual</SelectItem>
                  <SelectItem value="premium_duo">Premium Duo</SelectItem>
                  <SelectItem value="premium_familia">Premium Família</SelectItem>
                  <SelectItem value="premium_estudante">Premium Estudante</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                  <SelectItem value="banned">Banido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-gray-400" onClick={() => setEditDialog(null)}>Cancelar</Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleSaveUser}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== ASSINATURAS VIEW =====

function SubscriptionsView() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  const filtered = mockSubscriptions.filter((s) => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchPlan = planFilter === 'all' || s.plan === planFilter;
    return matchStatus && matchPlan;
  });

  const totalSubscribers = mockSubscriptions.filter(s => s.status === 'active').length;
  const mrr = mockSubscriptions.filter(s => s.status === 'active').reduce((acc, s) => acc + s.price, 0);
  const churnRate = ((mockSubscriptions.filter(s => s.status === 'canceled').length / mockSubscriptions.length) * 100).toFixed(1);
  const avgRevenue = mrr / totalSubscribers;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Assinaturas</h2>
        <p className="text-sm text-gray-400 mt-1">Gerenciar assinaturas e planos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Assinantes', value: totalSubscribers.toString(), icon: Users, color: 'emerald' },
          { title: 'MRR', value: formatCurrency(mrr), icon: CreditCard, color: 'amber' },
          { title: 'Taxa de Churn', value: `${churnRate}%`, icon: TrendingDown, color: 'red' },
          { title: 'Receita Média', value: formatCurrency(avgRevenue), icon: DollarSign, color: 'emerald' },
        ].map((stat) => (
          <Card key={stat.title} className="bg-gray-900 border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color === 'amber' ? 'bg-amber-500/15' : stat.color === 'red' ? 'bg-red-500/15' : 'bg-emerald-500/15'}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color === 'amber' ? 'text-amber-400' : stat.color === 'red' ? 'text-red-400' : 'text-emerald-400'}`} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="canceled">Cancelado</SelectItem>
            <SelectItem value="expired">Expirado</SelectItem>
            <SelectItem value="past_due">Em Atraso</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Plano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Planos</SelectItem>
            <SelectItem value="Premium Individual">Premium Individual</SelectItem>
            <SelectItem value="Premium Duo">Premium Duo</SelectItem>
            <SelectItem value="Premium Família">Premium Família</SelectItem>
            <SelectItem value="Premium Estudante">Premium Estudante</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-gray-900 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400">Usuário</TableHead>
                <TableHead className="text-gray-400">Plano</TableHead>
                <TableHead className="text-gray-400">Preço</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Cobrança</TableHead>
                <TableHead className="text-gray-400">Próx. Cobrança</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((sub) => (
                <TableRow key={sub.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell className="text-sm text-white font-medium">{sub.userName}</TableCell>
                  <TableCell className="text-sm text-gray-300">{sub.plan}</TableCell>
                  <TableCell className="text-sm text-emerald-400 font-medium">{formatCurrency(sub.price)}</TableCell>
                  <TableCell><StatusBadge status={sub.status} /></TableCell>
                  <TableCell>
                    <Badge className="bg-gray-700/50 text-gray-300 border border-gray-600/30 text-xs">
                      {sub.billingMethod === 'PIX' ? 'PIX' : sub.billingMethod === 'Cartão' ? 'Cartão' : 'Boleto'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">{new Date(sub.nextBilling).toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== PAGAMENTOS VIEW =====

function PaymentsView() {
  const [methodFilter, setMethodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = mockPayments.filter((p) => {
    const matchMethod = methodFilter === 'all' || p.method === methodFilter;
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchMethod && matchStatus;
  });

  const totalReceived = mockPayments.filter(p => p.status === 'confirmed').reduce((acc, p) => acc + p.amount, 0);
  const totalPending = mockPayments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0);
  const totalFailed = mockPayments.filter(p => p.status === 'failed').reduce((acc, p) => acc + p.amount, 0);
  const totalRefunded = mockPayments.filter(p => p.status === 'refunded').reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Pagamentos</h2>
          <p className="text-sm text-gray-400 mt-1">Histórico e gestão de pagamentos</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
          <Download className="h-4 w-4 mr-2" /> Exportar CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Recebido', value: formatCurrency(totalReceived), icon: DollarSign, color: 'emerald' },
          { title: 'Pendente', value: formatCurrency(totalPending), icon: Clock, color: 'amber' },
          { title: 'Falhou', value: formatCurrency(totalFailed), icon: XCircle, color: 'red' },
          { title: 'Reembolsado', value: formatCurrency(totalRefunded), icon: RefreshCw, color: 'purple' },
        ].map((stat) => (
          <Card key={stat.title} className="bg-gray-900 border-white/5">
            <CardContent className="p-5">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                stat.color === 'amber' ? 'bg-amber-500/15' : stat.color === 'red' ? 'bg-red-500/15' : stat.color === 'purple' ? 'bg-purple-500/15' : 'bg-emerald-500/15'
              }`}>
                <stat.icon className={`h-5 w-5 ${
                  stat.color === 'amber' ? 'text-amber-400' : stat.color === 'red' ? 'text-red-400' : stat.color === 'purple' ? 'text-purple-400' : 'text-emerald-400'
                }`} />
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 mt-1">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Métodos</SelectItem>
            <SelectItem value="PIX">PIX</SelectItem>
            <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
            <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="failed">Falhou</SelectItem>
            <SelectItem value="refunded">Reembolsado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-gray-900 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400">ID</TableHead>
                <TableHead className="text-gray-400">Usuário</TableHead>
                <TableHead className="text-gray-400">Valor</TableHead>
                <TableHead className="text-gray-400">Método</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((payment) => (
                <TableRow key={payment.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell className="text-sm text-gray-400 font-mono">{payment.id}</TableCell>
                  <TableCell className="text-sm text-white font-medium">{payment.userName}</TableCell>
                  <TableCell className="text-sm text-emerald-400 font-medium">{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge className="bg-gray-700/50 text-gray-300 border border-gray-600/30 text-xs">
                      {payment.method}
                    </Badge>
                  </TableCell>
                  <TableCell><StatusBadge status={payment.status} /></TableCell>
                  <TableCell className="text-sm text-gray-400">{new Date(payment.date).toLocaleDateString('pt-BR')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== CRIADORES VIEW =====

function CreatorsView() {
  const [creators, setCreators] = useState(mockArtists);

  const handleVerify = (id: string) => {
    setCreators(prev => prev.map(c => c.id === id ? { ...c, verified: !c.verified } : c));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Criadores</h2>
        <p className="text-sm text-gray-400 mt-1">Gerenciar artistas e criadores de conteúdo</p>
      </div>

      <Card className="bg-gray-900 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400">Artista</TableHead>
                <TableHead className="text-gray-400">Gênero</TableHead>
                <TableHead className="text-gray-400">Verificado</TableHead>
                <TableHead className="text-gray-400">Ouvintes/Mês</TableHead>
                <TableHead className="text-gray-400">Total Plays</TableHead>
                <TableHead className="text-gray-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {creators.map((creator) => (
                <TableRow key={creator.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback className="bg-gray-700 text-gray-300 text-xs">{creator.stageName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">{creator.stageName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-300">{creator.genre}</TableCell>
                  <TableCell>
                    {creator.verified ? (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Verificado
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-700/50 text-gray-400 border border-gray-600/30 text-xs">Não verificado</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-300">{formatPlayCount(creator.monthlyListeners)}</TableCell>
                  <TableCell className="text-sm text-gray-300">{formatPlayCount(creator.totalPlays)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`h-8 text-xs ${creator.verified ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'}`}
                        onClick={() => handleVerify(creator.id)}
                      >
                        {creator.verified ? 'Desverificar' : 'Verificar'}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== MÚSICAS VIEW =====

function SongsView() {
  const [songs, setSongs] = useState(mockSongs.map(s => ({ ...s, status: s.status as 'approved' | 'pending' | 'rejected' })));
  const [statusFilter, setStatusFilter] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());

  // Add some pending songs for demo
  const allSongs = [
    ...songs,
    { id: 's13', title: 'Sertanejo Universitário', artistId: 'a2', artistName: 'Marina Silva', albumId: 'al2', albumName: 'Horizonte', duration: 215, audioUrl: '/audio/s13.mp3', coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop', genre: 'Sertanejo', playCount: 0, likeCount: 0, isExplicit: false, status: 'pending' as const, releaseDate: '2025-06-20', isLiked: false },
    { id: 's14', title: 'Funk do Momento', artistId: 'a8', artistName: 'Isabela Ferreira', albumId: 'al8', albumName: 'Fogo', duration: 180, audioUrl: '/audio/s14.mp3', coverUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=300&fit=crop', genre: 'Funk', playCount: 0, likeCount: 0, isExplicit: true, status: 'pending' as const, releaseDate: '2025-06-22', isLiked: false },
    { id: 's15', title: 'Rock Brasileiro', artistId: 'a7', artistName: 'Rafael Torres', albumId: 'al7', albumName: 'Escapadas', duration: 240, audioUrl: '/audio/s15.mp3', coverUrl: 'https://images.unsplash.com/photo-1485579149621-3123dd979885?w=300&h=300&fit=crop', genre: 'Rock', playCount: 0, likeCount: 0, isExplicit: false, status: 'pending' as const, releaseDate: '2025-06-25', isLiked: false },
  ];

  const [allSongsState, setAllSongsState] = useState(allSongs);

  const filtered = allSongsState.filter((s) => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchGenre = genreFilter === 'all' || s.genre === genreFilter;
    return matchStatus && matchGenre;
  });

  const toggleSelect = (id: string) => {
    setSelectedSongs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleApprove = (id: string) => {
    setAllSongsState(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' as const } : s));
  };

  const handleReject = (id: string) => {
    setAllSongsState(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' as const } : s));
  };

  const handleBulkApprove = () => {
    setAllSongsState(prev => prev.map(s => selectedSongs.has(s.id) ? { ...s, status: 'approved' as const } : s));
    setSelectedSongs(new Set());
  };

  const handleBulkReject = () => {
    setAllSongsState(prev => prev.map(s => selectedSongs.has(s.id) ? { ...s, status: 'rejected' as const } : s));
    setSelectedSongs(new Set());
  };

  const genres = [...new Set(allSongsState.map(s => s.genre).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Músicas</h2>
        <p className="text-sm text-gray-400 mt-1">Moderar e aprovar conteúdos musicais</p>
      </div>

      {/* Bulk Actions */}
      {selectedSongs.size > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <span className="text-sm text-amber-400 font-medium">{selectedSongs.size} selecionada(s)</span>
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleBulkApprove}>
            <Check className="h-3 w-3 mr-1" /> Aprovar
          </Button>
          <Button size="sm" variant="destructive" onClick={handleBulkReject}>
            <X className="h-3 w-3 mr-1" /> Rejeitar
          </Button>
          <Button size="sm" variant="ghost" className="text-gray-400" onClick={() => setSelectedSongs(new Set())}>
            Cancelar
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="approved">Aprovado</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
            <SelectItem value="rejected">Rejeitado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Gênero" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Gêneros</SelectItem>
            {genres.map(g => g && <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card className="bg-gray-900 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400 w-10"></TableHead>
                <TableHead className="text-gray-400">Música</TableHead>
                <TableHead className="text-gray-400">Artista</TableHead>
                <TableHead className="text-gray-400">Gênero</TableHead>
                <TableHead className="text-gray-400">Plays</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((song) => (
                <TableRow key={song.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedSongs.has(song.id)}
                      onChange={() => toggleSelect(song.id)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded">
                        <AvatarImage src={song.coverUrl} />
                        <AvatarFallback className="bg-gray-800 text-gray-400 text-xs"><Music className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white truncate">{song.title}</p>
                        {song.isExplicit && <Badge className="bg-gray-700 text-gray-300 text-[9px] px-1 py-0 ml-1">EXPLÍCITO</Badge>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-300">{song.artistName}</TableCell>
                  <TableCell className="text-sm text-gray-300">{song.genre}</TableCell>
                  <TableCell className="text-sm text-gray-300">{formatPlayCount(song.playCount)}</TableCell>
                  <TableCell><StatusBadge status={song.status} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {song.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-400 hover:text-emerald-300" onClick={() => handleApprove(song.id)}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300" onClick={() => handleReject(song.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== PODCASTS VIEW =====

function PodcastsView() {
  const [podcasts, setPodcasts] = useState(mockPodcasts.map((p, i) => ({ ...p, status: 'approved' as const, episodeCount: [25, 42, 18, 37, 31, 12][i % 6] })));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Podcasts</h2>
        <p className="text-sm text-gray-400 mt-1">Gerenciar podcasts e episódios</p>
      </div>

      <Card className="bg-gray-900 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400">Podcast</TableHead>
                <TableHead className="text-gray-400">Criador</TableHead>
                <TableHead className="text-gray-400">Categoria</TableHead>
                <TableHead className="text-gray-400">Episódios</TableHead>
                <TableHead className="text-gray-400">Exclusivo</TableHead>
                <TableHead className="text-gray-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {podcasts.map((podcast) => (
                <TableRow key={podcast.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded">
                        <AvatarImage src={podcast.coverUrl} />
                        <AvatarFallback className="bg-gray-800 text-gray-400 text-xs"><Radio className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">{podcast.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-300">{podcast.artistName}</TableCell>
                  <TableCell className="text-sm text-gray-300">{podcast.category}</TableCell>
                  <TableCell className="text-sm text-gray-300">{(podcast as { episodeCount: number }).episodeCount}</TableCell>
                  <TableCell>
                    {podcast.isExclusive ? (
                      <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs">Exclusivo</Badge>
                    ) : (
                      <Badge className="bg-gray-700/50 text-gray-400 border border-gray-600/30 text-xs">Público</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-400 hover:text-emerald-300">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== LIVES VIEW =====

function LivesView() {
  const [streams, setStreams] = useState(mockLiveStreams.map(s => ({
    ...s,
    status: s.isLive ? 'live' as const : s.isScheduled ? 'scheduled' as const : 'ended' as const,
  })));

  const handleEndLive = (id: string) => {
    setStreams(prev => prev.map(s => s.id === id ? { ...s, status: 'ended' as const, isLive: false } : s));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Lives</h2>
        <p className="text-sm text-gray-400 mt-1">Gerenciar transmissões ao vivo</p>
      </div>

      <Card className="bg-gray-900 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400">Live</TableHead>
                <TableHead className="text-gray-400">Artista</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Visualizadores</TableHead>
                <TableHead className="text-gray-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {streams.map((stream) => (
                <TableRow key={stream.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 rounded">
                        <AvatarImage src={stream.thumbnail} />
                        <AvatarFallback className="bg-gray-800 text-gray-400 text-xs"><Radio className="h-4 w-4" /></AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-white">{stream.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-300">{stream.artistName}</TableCell>
                  <TableCell><StatusBadge status={stream.status} /></TableCell>
                  <TableCell className="text-sm text-gray-300">
                    {stream.status === 'live' ? (
                      <span className="text-red-400 font-medium">{stream.viewerCount.toLocaleString('pt-BR')}</span>
                    ) : stream.status === 'ended' ? (
                      <span className="text-gray-500">{stream.maxViewers.toLocaleString('pt-BR')} pico</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {stream.status === 'live' && (
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-amber-400 hover:text-amber-300" onClick={() => handleEndLive(stream.id)}>
                          Encerrar
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-300">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// ===== ANÚNCIOS VIEW =====

function AdsView() {
  const [campaigns, setCampaigns] = useState(mockAdCampaigns);
  const [createDialog, setCreateDialog] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<string | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '', type: 'audio' as 'audio' | 'video' | 'banner',
    targetUrl: '', duration: '30', frequency: '3', budget: '',
  });

  const handleToggleCampaign = (id: string) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' as const : 'active' as const } : c));
  };

  const resetForm = () => {
    setNewCampaign({ name: '', type: 'audio', targetUrl: '', duration: '30', frequency: '3', budget: '' });
    setAudioFile(null);
    setEditingCampaign(null);
    setIsDragOver(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setCreateDialog(true);
  };

  const handleOpenEdit = (campaign: MockAdCampaign) => {
    setEditingCampaign(campaign.id);
    setNewCampaign({
      name: campaign.name,
      type: campaign.type,
      targetUrl: campaign.targetUrl,
      duration: String(campaign.duration),
      frequency: String(campaign.frequency),
      budget: String(campaign.budget),
    });
    setAudioFile(null);
    setCreateDialog(true);
  };

  const handleCreateCampaign = () => {
    if (editingCampaign) {
      // Update existing campaign
      setCampaigns(prev => prev.map(c => c.id === editingCampaign ? {
        ...c,
        name: newCampaign.name,
        type: newCampaign.type,
        targetUrl: newCampaign.targetUrl,
        duration: parseInt(newCampaign.duration) || 30,
        frequency: parseInt(newCampaign.frequency) || 3,
        budget: parseFloat(newCampaign.budget) || 0,
        audioFileName: audioFile ? audioFile.name : c.audioFileName,
      } : c));
    } else {
      // Create new campaign
      const campaign: MockAdCampaign = {
        id: `ad${_adIdCounter++}`,
        name: newCampaign.name,
        type: newCampaign.type,
        status: 'active',
        impressions: 0,
        clicks: 0,
        budget: parseFloat(newCampaign.budget) || 0,
        spent: 0,
        targetUrl: newCampaign.targetUrl,
        duration: parseInt(newCampaign.duration) || 30,
        frequency: parseInt(newCampaign.frequency) || 3,
        audioFileName: audioFile ? audioFile.name : undefined,
      };
      setCampaigns(prev => [...prev, campaign]);
    }
    setCreateDialog(false);
    resetForm();
  };

  const handleAudioDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    }
  };

  const handleAudioSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
  };

  const typeLabels: Record<string, string> = { audio: 'Áudio', video: 'Vídeo', banner: 'Banner' };
  const typeIcons: Record<string, React.ElementType> = { audio: Volume2, video: Video, banner: Image };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Anúncios</h2>
          <p className="text-sm text-gray-400 mt-1">Gerenciar campanhas publicitárias</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" /> Nova Campanha
        </Button>
      </div>

      <Card className="bg-gray-900 border-white/5">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-gray-400">Campanha</TableHead>
                <TableHead className="text-gray-400">Tipo</TableHead>
                <TableHead className="text-gray-400">Áudio</TableHead>
                <TableHead className="text-gray-400">Status</TableHead>
                <TableHead className="text-gray-400">Impressões</TableHead>
                <TableHead className="text-gray-400">Cliques</TableHead>
                <TableHead className="text-gray-400">Orçamento</TableHead>
                <TableHead className="text-gray-400">Gasto</TableHead>
                <TableHead className="text-gray-400 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => {
                const TypeIcon = typeIcons[campaign.type] || Volume2;
                return (
                  <TableRow key={campaign.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="text-sm font-medium text-white">{campaign.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{typeLabels[campaign.type]}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.audioFileName ? (
                        <div className="flex items-center gap-1.5">
                          <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-xs text-gray-300 truncate max-w-[120px]">{campaign.audioFileName}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </TableCell>
                    <TableCell><StatusBadge status={campaign.status} /></TableCell>
                    <TableCell className="text-sm text-gray-300">{campaign.impressions.toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="text-sm text-gray-300">{campaign.clicks.toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="text-sm text-emerald-400">{formatCurrency(campaign.budget)}</TableCell>
                    <TableCell className="text-sm text-gray-300">{formatCurrency(campaign.spent)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-gray-400 hover:text-white"
                          onClick={() => handleOpenEdit(campaign)}
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-1" /> Editar
                        </Button>
                        <Switch
                          checked={campaign.status === 'active'}
                          onCheckedChange={() => handleToggleCampaign(campaign.id)}
                          className="data-[state=checked]:bg-emerald-500"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Campaign Dialog */}
      <Dialog open={createDialog} onOpenChange={(open) => { if (!open) resetForm(); setCreateDialog(open); }}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCampaign ? 'Editar Campanha' : 'Nova Campanha'}</DialogTitle>
            <DialogDescription className="text-gray-400">{editingCampaign ? 'Edite os dados da campanha' : 'Crie uma nova campanha publicitária'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-gray-300">Nome da Campanha</Label>
              <Input
                value={newCampaign.name}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Promo Verão 2025"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Tipo</Label>
              <Select value={newCampaign.type} onValueChange={(v) => setNewCampaign(prev => ({ ...prev, type: v as 'audio' | 'video' | 'banner' }))}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="audio">Áudio</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Audio Upload Dropzone */}
            {(newCampaign.type === 'audio' || newCampaign.type === 'video') && (
              <div className="space-y-2">
                <Label className="text-gray-300">Arquivo de Áudio</Label>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? 'border-emerald-400 bg-emerald-500/10'
                      : 'border-gray-700 hover:border-gray-500 bg-gray-800/50'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleAudioDrop}
                  onClick={() => document.getElementById('audio-upload-input')?.click()}
                >
                  <input
                    id="audio-upload-input"
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleAudioSelect}
                  />
                  {audioFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <Volume2 className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-medium">{audioFile.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-red-400"
                        onClick={(e) => { e.stopPropagation(); setAudioFile(null); }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : editingCampaign && campaigns.find(c => c.id === editingCampaign)?.audioFileName ? (
                    <div className="flex items-center justify-center gap-2">
                      <Volume2 className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-300">{campaigns.find(c => c.id === editingCampaign)?.audioFileName}</span>
                      <span className="text-xs text-gray-500">(arraste um novo para substituir)</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Arraste um arquivo de áudio aqui</p>
                      <p className="text-xs text-gray-500 mt-1">ou clique para selecionar</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-gray-300">URL de Destino</Label>
              <Input
                value={newCampaign.targetUrl}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, targetUrl: e.target.value }))}
                placeholder="https://example.com"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Duração (seg)</Label>
                <Input
                  value={newCampaign.duration}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, duration: e.target.value }))}
                  type="number"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Frequência (após N músicas)</Label>
                <Input
                  value={newCampaign.frequency}
                  onChange={(e) => setNewCampaign(prev => ({ ...prev, frequency: e.target.value }))}
                  type="number"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Orçamento (R$)</Label>
              <Input
                value={newCampaign.budget}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
                type="number"
                placeholder="5000"
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="text-gray-400" onClick={() => { setCreateDialog(false); resetForm(); }}>Cancelar</Button>
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleCreateCampaign} disabled={!newCampaign.name || !newCampaign.budget}>
              {editingCampaign ? 'Salvar Alterações' : 'Criar Campanha'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== RELATÓRIOS VIEW =====

function ReportsView() {
  const [dateFrom, setDateFrom] = useState('2025-01-01');
  const [dateTo, setDateTo] = useState('2025-06-30');

  const reports = [
    { title: 'Relatório de Receita', description: 'Receita detalhada por período, plano e método de pagamento', icon: DollarSign, color: 'emerald' },
    { title: 'Relatório de Usuários', description: 'Crescimento, retenção, churn e atividade dos usuários', icon: Users, color: 'blue' },
    { title: 'Relatório de Conteúdo', description: 'Músicas, podcasts e lives - aprovações, remoções e métricas', icon: Music, color: 'purple' },
    { title: 'Relatório de Pagamentos', description: 'Transações, reembolsos, falhas e métodos de pagamento', icon: CreditCard, color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Relatórios</h2>
        <p className="text-sm text-gray-400 mt-1">Gerar relatórios detalhados da plataforma</p>
      </div>

      {/* Date Range */}
      <Card className="bg-gray-900 border-white/5">
        <CardContent className="p-5">
          <div className="flex items-end gap-4 flex-wrap">
            <div className="space-y-2">
              <Label className="text-gray-300 text-xs">Data Início</Label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="bg-gray-800 border-gray-700 text-white w-44" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300 text-xs">Data Fim</Label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="bg-gray-800 border-gray-700 text-white w-44" />
            </div>
            <Button variant="ghost" className="text-gray-400 h-10">
              <Calendar className="h-4 w-4 mr-2" /> Últimos 30 dias
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.title} className="bg-gray-900 border-white/5 hover:border-gray-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center shrink-0 ${
                    report.color === 'emerald' ? 'bg-emerald-500/15' : report.color === 'amber' ? 'bg-amber-500/15' : report.color === 'purple' ? 'bg-purple-500/15' : 'bg-blue-500/15'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      report.color === 'emerald' ? 'text-emerald-400' : report.color === 'amber' ? 'text-amber-400' : report.color === 'purple' ? 'text-purple-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white">{report.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{report.description}</p>
                    <div className="mt-4">
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        <FileText className="h-4 w-4 mr-2" /> Gerar Relatório
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ===== CONFIGURAÇÕES VIEW =====

function SettingsView() {
  // Tab 1: Planos & Preços
  const [plans, setPlans] = useState(subscriptionPlans.map(p => ({
    ...p,
    trialDays: p.id === 'free' ? 0 : p.id === 'premium_estudante' ? 30 : 14,
  })));
  const [savedPlans, setSavedPlans] = useState(false);

  const handlePlanPriceChange = (planId: string, newPrice: number) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, price: newPrice } : p));
  };

  const handlePlanTrialChange = (planId: string, days: number) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, trialDays: days } : p));
  };

  const handleRemoveFeature = (planId: string, featureIndex: number) => {
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, features: p.features.filter((_, i) => i !== featureIndex) } : p));
  };

  const handleAddFeature = (planId: string, feature: string) => {
    if (!feature.trim()) return;
    setPlans(prev => prev.map(p => p.id === planId ? { ...p, features: [...p.features, feature] } : p));
  };

  const [newFeatures, setNewFeatures] = useState<Record<string, string>>({});

  const handleSavePlans = () => {
    setSavedPlans(true);
    setTimeout(() => setSavedPlans(false), 2000);
  };

  // Tab 2: Pagamentos (Asaas)
  const [asaasApiKey, setAsaasApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [asaasApiUrl, setAsaasApiUrl] = useState('https://sandbox.asaas.com/api/v3');
  const [asaasSandbox, setAsaasSandbox] = useState(true);
  const [pixEnabled, setPixEnabled] = useState(true);
  const [creditCardEnabled, setCreditCardEnabled] = useState(true);
  const [debitCardEnabled, setDebitCardEnabled] = useState(false);
  const [autoRetry, setAutoRetry] = useState(true);
  const [gracePeriod, setGracePeriod] = useState('3');
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<'success' | 'error' | null>(null);

  const handleTestConnection = () => {
    setTestingConnection(true);
    setConnectionResult(null);
    setTimeout(() => {
      setTestingConnection(false);
      setConnectionResult('success');
      setTimeout(() => setConnectionResult(null), 3000);
    }, 1500);
  };

  // Tab 3: Geral
  const [platformName, setPlatformName] = useState('SoundFlow');
  const [platformUrl, setPlatformUrl] = useState('https://soundflow.com.br');
  const [supportEmail, setSupportEmail] = useState('suporte@soundflow.com.br');
  const [defaultPlan, setDefaultPlan] = useState('free');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [maxFreePlays, setMaxFreePlays] = useState('50');
  const [adFrequency, setAdFrequency] = useState('3');

  // Tab 4: Notificações
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newUserNotification, setNewUserNotification] = useState(true);
  const [paymentNotification, setPaymentNotification] = useState(true);
  const [contentApprovalNotification, setContentApprovalNotification] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Configurações</h2>
        <p className="text-sm text-gray-400 mt-1">Configurar a plataforma SoundFlow</p>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className="bg-gray-900 border border-white/5">
          <TabsTrigger value="plans" className="data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">Planos & Preços</TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">Pagamentos</TabsTrigger>
          <TabsTrigger value="general" className="data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">Geral</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-emerald-500/15 data-[state=active]:text-emerald-400">Notificações</TabsTrigger>
        </TabsList>

        {/* Tab 1: Planos & Preços */}
        <TabsContent value="plans" className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="bg-gray-900 border-white/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-white">{plan.name}</CardTitle>
                    {plan.popular && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">Popular</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-xs">Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={plan.price}
                      onChange={(e) => handlePlanPriceChange(plan.id, parseFloat(e.target.value) || 0)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-xs">Período</Label>
                    <Input value={plan.period === 'monthly' ? 'Mensal' : 'Anual'} disabled className="bg-gray-800 border-gray-700 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-xs">Dias de Teste</Label>
                    <Input
                      type="number"
                      value={plan.trialDays}
                      onChange={(e) => handlePlanTrialChange(plan.id, parseInt(e.target.value) || 0)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-xs">Funcionalidades</Label>
                  <div className="space-y-1.5">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 group">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span className="text-sm text-gray-300 flex-1">{feature}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                          onClick={() => handleRemoveFeature(plan.id, i)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="Nova funcionalidade..."
                      value={newFeatures[plan.id] || ''}
                      onChange={(e) => setNewFeatures(prev => ({ ...prev, [plan.id]: e.target.value }))}
                      className="bg-gray-800 border-gray-700 text-white h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddFeature(plan.id, newFeatures[plan.id] || '');
                          setNewFeatures(prev => ({ ...prev, [plan.id]: '' }));
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-emerald-400 hover:text-emerald-300 shrink-0"
                      onClick={() => {
                        handleAddFeature(plan.id, newFeatures[plan.id] || '');
                        setNewFeatures(prev => ({ ...prev, [plan.id]: '' }));
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-end">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={handleSavePlans}>
              {savedPlans ? <><Check className="h-4 w-4 mr-2" /> Salvo!</> : <><Save className="h-4 w-4 mr-2" /> Salvar Alterações</>}
            </Button>
          </div>
        </TabsContent>

        {/* Tab 2: Pagamentos (Asaas) */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="bg-gray-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-400" /> Configuração Asaas
              </CardTitle>
              <CardDescription className="text-gray-400">Integração com gateway de pagamento Asaas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label className="text-gray-300">API Key</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={asaasApiKey}
                      onChange={(e) => setAsaasApiKey(e.target.value)}
                      placeholder="$aas_prod_xxxxxxxx ou $aas_sandbox_xxxxxxxx"
                      className="bg-gray-800 border-gray-700 text-white pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-white"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Ambiente</Label>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={!asaasSandbox}
                    onCheckedChange={(checked) => {
                      setAsaasSandbox(!checked);
                      setAsaasApiUrl(checked ? 'https://api.asaas.com/api/v3' : 'https://sandbox.asaas.com/api/v3');
                    }}
                    className="data-[state=checked]:bg-red-500"
                  />
                  <span className={`text-sm font-medium ${asaasSandbox ? 'text-emerald-400' : 'text-red-400'}`}>
                    {asaasSandbox ? 'Sandbox (Teste)' : 'Produção'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">API URL</Label>
                <Input
                  value={asaasApiUrl}
                  onChange={(e) => setAsaasApiUrl(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Webhook URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value="https://soundflow.com.br/api/payments/webhook"
                    disabled
                    className="bg-gray-800 border-gray-700 text-gray-400"
                  />
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-white shrink-0">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  onClick={handleTestConnection}
                  disabled={testingConnection}
                >
                  {testingConnection ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testando...</>
                  ) : (
                    <><Zap className="h-4 w-4 mr-2" /> Testar Conexão</>
                  )}
                </Button>
                {connectionResult === 'success' && (
                  <span className="text-sm text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Conexão bem-sucedida!
                  </span>
                )}
                {connectionResult === 'error' && (
                  <span className="text-sm text-red-400 flex items-center gap-1">
                    <XCircle className="h-4 w-4" /> Falha na conexão
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-400" /> Métodos de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-emerald-500/15 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-400">PIX</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">PIX</p>
                    <p className="text-xs text-gray-400">Pagamento instantâneo</p>
                  </div>
                </div>
                <Switch checked={pixEnabled} onCheckedChange={setPixEnabled} className="data-[state=checked]:bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-amber-500/15 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Cartão de Crédito</p>
                    <p className="text-xs text-gray-400">Visa, Mastercard, Elo</p>
                  </div>
                </div>
                <Switch checked={creditCardEnabled} onCheckedChange={setCreditCardEnabled} className="data-[state=checked]:bg-emerald-500" />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-blue-500/15 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Cartão de Débito</p>
                    <p className="text-xs text-gray-400">Débito online</p>
                  </div>
                </div>
                <Switch checked={debitCardEnabled} onCheckedChange={setDebitCardEnabled} className="data-[state=checked]:bg-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-amber-400" /> Recuperação de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Tentativa automática de cobrança</p>
                  <p className="text-xs text-gray-400">Tentar cobrar novamente pagamentos falhados</p>
                </div>
                <Switch checked={autoRetry} onCheckedChange={setAutoRetry} className="data-[state=checked]:bg-emerald-500" />
              </div>
              <Separator className="bg-white/5" />
              <div className="space-y-2">
                <Label className="text-gray-300">Período de carência (dias)</Label>
                <Input
                  type="number"
                  value={gracePeriod}
                  onChange={(e) => setGracePeriod(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white w-32"
                />
                <p className="text-xs text-gray-500">Dias antes de cancelar a assinatura após falha no pagamento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Geral */}
        <TabsContent value="general" className="space-y-4">
          <Card className="bg-gray-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-amber-400" /> Informações da Plataforma
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Nome da Plataforma</Label>
                  <Input value={platformName} onChange={(e) => setPlatformName(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">URL da Plataforma</Label>
                  <Input value={platformUrl} onChange={(e) => setPlatformUrl(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Email de Suporte</Label>
                <Input type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Plano Padrão para Novos Usuários</Label>
                <Select value={defaultPlan} onValueChange={setDefaultPlan}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium_individual">Premium Individual</SelectItem>
                    <SelectItem value="premium_duo">Premium Duo</SelectItem>
                    <SelectItem value="premium_familia">Premium Família</SelectItem>
                    <SelectItem value="premium_estudante">Premium Estudante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-amber-400" /> Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Modo Manutenção</p>
                  <p className="text-xs text-gray-400">Desabilitar acesso à plataforma para manutenção</p>
                </div>
                <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} className="data-[state=checked]:bg-red-500" />
              </div>
              {maintenanceMode && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-red-400 font-medium">Modo manutenção ativo — a plataforma está inacessível para usuários</span>
                  </div>
                </div>
              )}
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Registro Habilitado</p>
                  <p className="text-xs text-gray-400">Permitir novos registros de usuários</p>
                </div>
                <Switch checked={registrationEnabled} onCheckedChange={setRegistrationEnabled} className="data-[state=checked]:bg-emerald-500" />
              </div>
              <Separator className="bg-white/5" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Máx. Plays Grátis/Dia</Label>
                  <Input
                    type="number"
                    value={maxFreePlays}
                    onChange={(e) => setMaxFreePlays(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-500">Limite diário para usuários gratuitos</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300">Frequência de Anúncios</Label>
                  <Input
                    type="number"
                    value={adFrequency}
                    onChange={(e) => setAdFrequency(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-xs text-gray-500">Tocar anúncio após cada N músicas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Notificações */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-gray-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-400" /> Configurações de Notificação
              </CardTitle>
              <CardDescription className="text-gray-400">Configurar quais notificações a plataforma envia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Notificações por Email</p>
                  <p className="text-xs text-gray-400">Enviar notificações por email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} className="data-[state=checked]:bg-emerald-500" />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Notificações Push</p>
                  <p className="text-xs text-gray-400">Enviar notificações push para dispositivos</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} className="data-[state=checked]:bg-emerald-500" />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Notificação de Novo Usuário</p>
                  <p className="text-xs text-gray-400">Notificar quando um novo usuário se registra</p>
                </div>
                <Switch checked={newUserNotification} onCheckedChange={setNewUserNotification} className="data-[state=checked]:bg-emerald-500" />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Notificação de Pagamento</p>
                  <p className="text-xs text-gray-400">Notificar sobre pagamentos e falhas</p>
                </div>
                <Switch checked={paymentNotification} onCheckedChange={setPaymentNotification} className="data-[state=checked]:bg-emerald-500" />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Notificação de Aprovação de Conteúdo</p>
                  <p className="text-xs text-gray-400">Notificar quando conteúdo precisa de aprovação</p>
                </div>
                <Switch checked={contentApprovalNotification} onCheckedChange={setContentApprovalNotification} className="data-[state=checked]:bg-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ===== MAIN ADMIN PANEL =====

// Stable ID counter for new ads (avoids Date.now() hydration mismatch)
let _adIdCounter = 100;

export default function AdminPanel() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    // Clear auth state from localStorage, reset cache, and redirect to home
    try {
      localStorage.removeItem('soundflow-auth');
    } catch {}
    resetAdminAuthCache();
    window.location.href = '/';
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'users': return <UsersView />;
      case 'subscriptions': return <SubscriptionsView />;
      case 'payments': return <PaymentsView />;
      case 'creators': return <CreatorsView />;
      case 'songs': return <SongsView />;
      case 'podcasts': return <PodcastsView />;
      case 'lives': return <LivesView />;
      case 'ads': return <AdsView />;
      case 'reports': return <ReportsView />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Fixed Sidebar */}
      <AdminSidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLogout={handleLogout}
      />

      {/* Main Content - scrollable independently */}
      <main
        className="fixed top-14 bottom-0 right-0 overflow-y-auto transition-all duration-300"
        style={{ left: sidebarCollapsed ? '68px' : '240px' }}
      >
        <div className="p-4 lg:p-6 max-w-7xl">
          {renderView()}
        </div>
      </main>
    </div>
  );
}
