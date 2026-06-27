'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music, Eye, EyeOff, Chrome, Apple, Facebook, Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import type { UserType } from '@/types';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'login' | 'register';
  onDemoLogin: (type: 'user' | 'admin') => void;
  onLoginSuccess: (user: UserType) => void;
}

export default function AuthModal({ open, onOpenChange, mode, onDemoLogin, onLoginSuccess }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  // Sync tab with mode prop
  useEffect(() => {
    setActiveTab(mode);
    // Clear errors when switching modes
    setError('');
  }, [mode]);

  // Clear errors when switching tabs
  useEffect(() => {
    setError('');
  }, [activeTab]);

  // Seed demo users on first open
  useEffect(() => {
    if (open) {
      fetch('/api/auth/seed').catch(() => {
        // Silently fail - seeding is optional
      });
    }
  }, [open]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao fazer login');
        return;
      }

      // Login successful
      const user: UserType = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || undefined,
        username: data.user.username || undefined,
        avatar: data.user.avatar || undefined,
        bio: data.user.bio || undefined,
        role: data.user.role,
        plan: data.user.plan,
        isVerified: data.user.isVerified,
        isActive: data.user.isActive,
        createdAt: data.user.createdAt,
      };

      onLoginSuccess(user);
      onOpenChange(false);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (registerPassword !== registerConfirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (registerPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Erro ao criar conta');
        return;
      }

      // Registration successful - auto-login
      const user: UserType = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name || undefined,
        username: data.user.username || undefined,
        avatar: data.user.avatar || undefined,
        bio: data.user.bio || undefined,
        role: data.user.role,
        plan: data.user.plan,
        isVerified: data.user.isVerified,
        isActive: data.user.isActive,
        createdAt: data.user.createdAt,
      };

      onLoginSuccess(user);
      onOpenChange(false);
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider} - not yet implemented`);
    setError(`Login com ${provider} ainda não está disponível`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-950 border-white/10 p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-6 pt-8 pb-12">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative z-10">
            <DialogHeader>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Music className="w-5 h-5 text-white" />
                </div>
              </div>
              <DialogTitle className="text-center text-white text-2xl font-bold">
                {activeTab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
              </DialogTitle>
              <p className="text-center text-emerald-100/70 text-sm mt-1">
                {activeTab === 'login'
                  ? 'Entre na sua conta SpotiPlay'
                  : 'Comece a ouvir milhões de músicas grátis'}
              </p>
            </DialogHeader>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 -mt-6">
          <div className="bg-gray-900 rounded-2xl border border-white/5 p-6 shadow-xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-gray-800/50 border border-white/5 p-1 mb-6">
                <TabsTrigger
                  value="login"
                  className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-400 font-semibold transition-all duration-200"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="flex-1 data-[state=active]:bg-emerald-500 data-[state=active]:text-white text-gray-400 font-semibold transition-all duration-200"
                >
                  Criar Conta
                </TabsTrigger>
              </TabsList>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Login Tab */}
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300 text-sm font-medium">
                      E-mail
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => { setLoginEmail(e.target.value); setError(''); }}
                      className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password" className="text-gray-300 text-sm font-medium">
                        Senha
                      </Label>
                      <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                        Esqueceu a senha?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => { setLoginPassword(e.target.value); setError(''); }}
                        className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/40"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Tab */}
              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-gray-300 text-sm font-medium">
                      Nome completo
                    </Label>
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="Seu nome"
                      value={registerName}
                      onChange={(e) => { setRegisterName(e.target.value); setError(''); }}
                      className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-300 text-sm font-medium">
                      E-mail
                    </Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerEmail}
                      onChange={(e) => { setRegisterEmail(e.target.value); setError(''); }}
                      className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-300 text-sm font-medium">
                      Senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={registerPassword}
                        onChange={(e) => { setRegisterPassword(e.target.value); setError(''); }}
                        className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-gray-300 text-sm font-medium">
                      Confirmar senha
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Repita a senha"
                        value={registerConfirmPassword}
                        onChange={(e) => { setRegisterConfirmPassword(e.target.value); setError(''); }}
                        className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    Ao criar uma conta, você concorda com nossos{' '}
                    <a href="#" className="text-emerald-400 hover:underline">Termos de Uso</a>{' '}
                    e{' '}
                    <a href="#" className="text-emerald-400 hover:underline">Política de Privacidade</a>.
                  </p>

                  <Button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-5 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-emerald-500/40"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      'Criar Conta Grátis'
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Social Login Divider */}
              <div className="relative my-6">
                <Separator className="bg-white/5" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-3 text-gray-500 text-xs">
                  ou continue com
                </span>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-800/50 border-white/10 text-white hover:bg-gray-800 hover:border-white/20 transition-all duration-200 py-5"
                  onClick={() => handleSocialLogin('google')}
                >
                  <Chrome className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-800/50 border-white/10 text-white hover:bg-gray-800 hover:border-white/20 transition-all duration-200 py-5"
                  onClick={() => handleSocialLogin('facebook')}
                >
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-800/50 border-white/10 text-white hover:bg-gray-800 hover:border-white/20 transition-all duration-200 py-5"
                  onClick={() => handleSocialLogin('apple')}
                >
                  <Apple className="w-5 h-5" />
                </Button>
              </div>

              {/* Demo Login Section */}
              <div className="mt-6">
                <div className="relative mb-4">
                  <Separator className="bg-white/5" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 px-3 text-amber-400/80 text-xs font-medium">
                    Acesso Demo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 hover:text-emerald-300 transition-all duration-200 py-4 flex flex-col gap-1 h-auto"
                    onClick={() => onDemoLogin('user')}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-xs font-semibold">Usuário Demo</span>
                    <span className="text-[10px] text-emerald-500/60">user@soundflow.com</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/50 hover:text-amber-300 transition-all duration-200 py-4 flex flex-col gap-1 h-auto"
                    onClick={() => onDemoLogin('admin')}
                  >
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-semibold">Admin Demo</span>
                    <span className="text-[10px] text-amber-500/60">admin@soundflow.com</span>
                  </Button>
                </div>

                <p className="text-[10px] text-gray-600 text-center mt-3">
                  Contas de demonstração para testar a plataforma
                </p>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
