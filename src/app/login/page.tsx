"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      let success;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.name, formData.email, formData.password);
      }

      if (success) {
        toast.success(isLogin ? 'Connexion réussie!' : 'Inscription réussie!');
        router.push('/');
      } else {
        toast.error(isLogin ? 'Échec de la connexion' : "Échec de l'inscription");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#141414] text-white relative">
      <div className="fixed inset-0 bg-black/40" />

      <main className="flex-grow relative">
        <div className="relative h-full">
          <div className="absolute inset-0 flex">
            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-[#141414]" />
            </div>

            <div className="flex-grow bg-[#141414]">
              <div className="max-w-6xl mx-auto px-8" />
            </div>

            <div className="w-[400px] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-l from-transparent to-[#141414]" />
            </div>
          </div>

          <div className="relative flex items-center justify-center min-h-screen py-12 px-4">
            <div className="w-full max-w-md">
              <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-2xl shadow-xl border border-[#C4B5A2]/20 overflow-hidden">
                <div className="text-center p-8 bg-[#C4B5A2]">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src="/logo.png"
                      alt="Au Tiki Logo"
                      fill
                      className="rounded-full object-cover border-4 border-white"
                    />
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    {isLogin ? 'Connexion' : 'Inscription'}
                  </h1>
                </div>

                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Nom complet
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#C4B5A2]/30 rounded-lg focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white pl-12"
                            placeholder="John Doe"
                            required
                          />
                          <User className="absolute left-4 top-3.5 h-5 w-5 text-[#C4B5A2]" />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#C4B5A2]/30 rounded-lg focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white pl-12"
                          placeholder="vous@example.com"
                          required
                        />
                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-[#C4B5A2]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#C4B5A2]/30 rounded-lg focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white pl-12"
                          placeholder="••••••••"
                          required
                        />
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-[#C4B5A2]" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-3.5 text-[#C4B5A2] hover:text-white transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    {!isLogin && (
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Confirmer le mot de passe
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#C4B5A2]/30 rounded-lg focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white pl-12"
                            placeholder="••••••••"
                            required
                          />
                          <Lock className="absolute left-4 top-3.5 h-5 w-5 text-[#C4B5A2]" />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#C4B5A2] hover:bg-[#A69783] text-black font-medium px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        'Chargement...'
                      ) : (
                        isLogin ? 'Se connecter' : "S'inscrire"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-gray-400">
                      {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                      {' '}
                      <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[#C4B5A2] hover:text-white transition-colors"
                      >
                        {isLogin ? "S'inscrire" : "Se connecter"}
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}