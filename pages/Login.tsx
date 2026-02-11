import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Button } from '../components/Button';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  BookOpen, 
  Clock 
} from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user && data.user.email) {
        onLogin(data.user.email);
      }
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' 
        ? 'El correo o la contraseña son incorrectos.' 
        : 'Ocurrió un error al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      
      {/* --- COLUMNA IZQUIERDA (MARKETING / VENTA) --- */}
      {/* Solo visible en pantallas grandes (lg) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Sparkles className="w-64 h-64" />
        </div>

        {/* Logo / Marca */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <div className="p-2 bg-brand-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            EduGenius AI
          </div>
        </div>

        {/* Contenido Principal */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            Tu copiloto educativo <span className="text-brand-400">inteligente</span>.
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Deja de pasar horas buscando recursos. Crea fichas, exámenes y ejercicios adaptados en segundos con Inteligencia Artificial.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-full text-green-400">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-slate-200">Ahorra +10 horas semanales de preparación.</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-full text-blue-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-slate-200">Contenido adaptado a cualquier nivel (Primaria - Bachillerato).</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-full text-purple-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-slate-200">Generación ilimitada de ideas creativas.</span>
            </div>
          </div>
        </div>

        {/* Footer Izquierdo */}
        <div className="text-slate-500 text-sm">
          © 2024 EduGenius AI. Hecho para profesores.
        </div>
      </div>

      {/* --- COLUMNA DERECHA (FORMULARIO) --- */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Bienvenido de nuevo</h2>
            <p className="mt-2 text-slate-600">
              Accede a tu panel para continuar creando.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Correo electrónico
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                    placeholder="profe@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                isLoading={loading}
                className="w-full flex justify-center py-3 text-base font-semibold shadow-lg shadow-brand-500/30"
              >
                Iniciar Sesión <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              ¿Aún no tienes cuenta?{' '}
              <button 
                onClick={onSwitchToRegister}
                className="font-medium text-brand-600 hover:text-brand-500 transition-colors"
              >
                Crea una gratis aquí
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};