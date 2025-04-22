"use client"

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const { user, login, register, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [authError, setAuthError] = useState('');

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setAuthError("Les mots de passe ne correspondent pas");
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      let success;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(
          formData.name, 
          formData.email, 
          formData.password,
          formData.phoneNumber
        );
      }

      if (success) {
        toast.success(isLogin ? 'Connexion réussie!' : 'Inscription réussie!');
        // La redirection se fera automatiquement via l'effet useEffect ci-dessus
      } else {
        setAuthError(isLogin ? 'Email ou mot de passe incorrect' : "Échec de l'inscription. Veuillez vérifier vos informations.");
        toast.error(isLogin ? 'Échec de la connexion' : "Échec de l'inscription");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setAuthError(error.message || 'Une erreur est survenue');
      toast.error(error.message || 'Une erreur est survenue');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success(`Instructions de réinitialisation envoyées à ${forgotEmail}`);
    setShowForgotPassword(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f] text-white relative">
      <div className="fixed inset-0 bg-black/40" />

      <main className="flex-grow relative">
        <div className="relative h-full">
          <div className="absolute inset-0 flex">
            <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
              <Image
                src="/decorations/leavesleft.webp"
                alt="Décoration gauche"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-r from-transparent to-[#0f0f0f]" />
            </div>

            <div className="flex-grow bg-[#0f0f0f]">
              <div className="max-w-6xl mx-auto px-8" />
            </div>

            <div className="w-[15%] sm:w-[20%] md:w-[25%] relative">
              <Image
                src="/decorations/leavesright.webp"
                alt="Décoration droite"
                fill
                className="object-cover opacity-20"
                priority
              />
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-l from-transparent to-[#0f0f0f]" />
            </div>
          </div>

          <div className="relative flex items-center justify-center min-h-screen py-12 px-4">
            <div className="w-full mt-40 max-w-md">
              <div className="bg-[#2a2a2a]/90 backdrop-blur-md rounded-2xl shadow-xl border border-[#C4B5A2]/20 overflow-hidden">
                <div className="text-center p-8 bg-gradient-to-b from-[#C4B5A2] to-[#A69783]">
                  <div className="relative w-28 h-28 mx-auto mb-3">
                    <Image
                      src="/logos/TikiLogo.png"
                      alt="Au Tiki Logo"
                      fill
                      className="object-contain drop-shadow-md"
                    />
                  </div>
                  <h1 className="text-3xl font-bold text-white font-didot tracking-wide drop-shadow-sm">
                    {showForgotPassword ? 'Récupération' : isLogin ? 'Connexion' : 'Inscription'}
                  </h1>
                  <div className="w-12 h-[2px] bg-white/50 mx-auto mt-2 mb-1"></div>
                  <p className="text-white/80 text-sm">
                    {showForgotPassword 
                      ? "Récupérez l'accès à votre compte"
                      : isLogin 
                        ? "Accédez à votre espace personnel"
                        : "Rejoignez l'aventure Tiki dès maintenant"}
                  </p>
                </div>

                {/* Décoration de séparation */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#C4B5A2]/30 to-transparent"></div>

                {authError && (
                  <div className="mx-8 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-sm">{authError}</p>
                  </div>
                )}

                <div className="p-8">
                  {showForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div>
                        <button 
                          type="button" 
                          onClick={() => setShowForgotPassword(false)}
                          className="flex items-center text-[#C4B5A2] hover:text-white mb-6 transition-colors"
                        >
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          <span>Retour à la connexion</span>
                        </button>
                        <label className="block text-sm font-medium text-white mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#C4B5A2]/30 rounded-lg focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white pl-12"
                            placeholder="vous@example.com"
                            required
                          />
                          <Mail className="absolute left-4 top-3.5 h-5 w-5 text-[#C4B5A2]" />
                        </div>
                        <p className="text-gray-400 text-xs mt-2">
                          Nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#C4B5A2] to-[#A69783] hover:from-[#A69783] hover:to-[#C4B5A2] text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Envoyer les instructions
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {!isLogin && (
                        <>
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

                          <div>
                            <label className="block text-sm font-medium text-white mb-2">
                              Numéro de téléphone
                            </label>
                            <div className="relative">
                              <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#C4B5A2]/30 rounded-lg focus:ring-2 focus:ring-[#C4B5A2] focus:border-transparent text-white pl-12"
                                placeholder="06 12 34 56 78"
                                required
                              />
                              <Phone className="absolute left-4 top-3.5 h-5 w-5 text-[#C4B5A2]" />
                            </div>
                          </div>
                        </>
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
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-white">
                            Mot de passe
                          </label>
                          {isLogin && (
                            <button 
                              type="button" 
                              onClick={() => setShowForgotPassword(true)}
                              className="text-sm text-[#C4B5A2] hover:text-white transition-colors"
                            >
                              Mot de passe oublié ?
                            </button>
                          )}
                        </div>
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
                        className="w-full bg-gradient-to-r from-[#C4B5A2] to-[#A69783] hover:from-[#A69783] hover:to-[#C4B5A2] text-white font-medium px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                      >
                        {isLoading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Chargement...
                          </div>
                        ) : (
                          isLogin ? 'Se connecter' : "S'inscrire"
                        )}
                      </button>
                    </form>
                  )}

                  {!showForgotPassword && (
                    <div className="mt-6 text-center">
                      <div className="relative py-3">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[#C4B5A2]/20"></div>
                        </div>
                        <div className="relative flex justify-center">
                          <span className="px-4 bg-[#2a2a2a] text-gray-400 text-sm">ou</span>
                        </div>
                      </div>

                      <p className="text-gray-400 mt-4">
                        {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                        {' '}
                        <button
                          onClick={() => {
                            setIsLogin(!isLogin);
                            setAuthError('');
                          }}
                          className="text-[#C4B5A2] hover:text-white transition-colors font-medium"
                        >
                          {isLogin ? "S'inscrire" : "Se connecter"}
                        </button>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Décoration du bas */}
              <div className="mt-6 text-center">
                <div className="flex justify-center opacity-80 space-x-1">
                  <div className="w-2 h-2 rounded-full bg-[#C4B5A2]"></div>
                  <div className="w-2 h-2 rounded-full bg-[#C4B5A2]/50"></div>
                  <div className="w-2 h-2 rounded-full bg-[#C4B5A2]/30"></div>
                </div>
                <p className="mt-4 text-gray-400 text-xs">
                  En vous connectant, vous acceptez les <a href="#" className="underline hover:text-[#C4B5A2]">Conditions d'utilisation</a> et la <a href="#" className="underline hover:text-[#C4B5A2]">Politique de confidentialité</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}