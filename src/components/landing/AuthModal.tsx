'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Eye, EyeOff, Chrome, Apple, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'login' | 'register';
}

export default function AuthModal({ open, onOpenChange, mode }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>(mode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
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
                  ? 'Entre na sua conta SoundFlow'
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

              <AnimatePresence mode="wait">
                {/* Login Tab */}
                <TabsContent value="login" className="mt-0">
                  <motion.form
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleLogin}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-gray-300 text-sm font-medium">
                        E-mail
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
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
                          onChange={(e) => setLoginPassword(e.target.value)}
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
                  </motion.form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="mt-0">
                  <motion.form
                    key="register"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-gray-300 text-sm font-medium">
                        Nome completo
                      </Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Seu nome"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
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
                        onChange={(e) => setRegisterEmail(e.target.value)}
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
                          placeholder="Mínimo 8 caracteres"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10"
                          required
                          minLength={8}
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
                          onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                          className="bg-gray-800/50 border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-500 focus:ring-emerald-500/20 pr-10"
                          required
                          minLength={8}
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
                  </motion.form>
                </TabsContent>
              </AnimatePresence>

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
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
