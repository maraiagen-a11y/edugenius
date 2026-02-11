import React, { useEffect, useState } from 'react';
import { User, Resource } from '../types';
import { Button } from '../components/Button';
import { PLAN_LIMITS, MOCK_RESOURCES } from '../constants';
import { supabase } from '../services/supabaseClient';
import { 
  Sparkles, FileText, Zap, Clock, Plus, Crown, ArrowRight, Lock, AlertCircle 
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onNavigate: (page: string) => void;
  onRequireAuth?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onRequireAuth }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResources: 0,
    recentActivity: [] as Resource[]
  });

  const isGuest = user.id === 'guest';
  const limits = PLAN_LIMITS[user.plan];
  const usagePercentage = isGuest ? 65 : Math.min((user.generatedCount / limits.maxGenerations) * 100, 100);

  const handleProtectedAction = (destination: string) => {
    if (isGuest && onRequireAuth) {
      onRequireAuth();
    } else {
      onNavigate(destination);
    }
  };

  useEffect(() => {
    async function fetchDashboardData() {
      if (isGuest) {
        setStats({
          totalResources: 12, 
          recentActivity: MOCK_RESOURCES.slice(0, 3)
        });
        setLoading(false);
        return;
      }

      try {
        const { count } = await supabase
          .from('resources')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { data: recent } = await supabase
          .from('resources')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(3);

        setStats({
          totalResources: count || 0,
          recentActivity: recent || []
        });
      } catch (error) {
        console.error("Error dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user.id, isGuest]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
      {/* --- NUEVO: BANNER DE AVISO PARA INVITADOS --- */}
      {isGuest && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3 text-yellow-800 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            Estás navegando como invitado. <button onClick={onRequireAuth} className="underline font-bold hover:text-yellow-900">Inicia sesión</button> para guardar tus fichas y eliminar los límites.
          </p>
        </div>
      )}
      
      {/* HEADER */}
      <div className="relative bg-slate-900 rounded-3xl p-8 md:p-10 shadow-2xl overflow-hidden text-white">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
          <Sparkles className="w-64 h-64 text-brand-400" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tight">
              {isGuest ? 'Bienvenido a EduGenius' : `Hola, ${user.name.split(' ')[0]}`} <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl">
              {isGuest 
                ? "Explora lo que nuestra IA puede hacer por ti. Abajo verás ejemplos reales de fichas generadas." 
                : "Tu asistente inteligente está listo. ¿Qué creamos hoy?"}
            </p>
          </div>
          <Button 
            onClick={() => handleProtectedAction('generator')}
            className="bg-brand-500 hover:bg-brand-400 text-white border-0 py-3 px-6 text-lg shadow-lg"
          >
            {isGuest ? <Lock className="w-4 h-4 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
            {isGuest ? "Probar Generador" : "Crear Nueva Ficha"}
          </Button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              {/* CAMBIO DE TEXTO AQUÍ */}
              <p className="text-slate-500 text-sm font-semibold uppercase">{isGuest ? 'Potencia IA' : 'Generaciones'}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">
                {isGuest ? "Demo" : user.generatedCount} <span className="text-lg text-slate-400">{!isGuest && `/ ${limits.maxGenerations}`}</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600"><Zap className="w-6 h-6" /></div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-3">
            <div className="h-3 rounded-full bg-brand-600" style={{ width: `${usagePercentage}%` }}></div>
          </div>
          {isGuest && <p className="text-xs text-slate-400">Capacidad disponible en versión gratuita.</p>}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              {/* CAMBIO DE TEXTO AQUÍ */}
              <p className="text-slate-500 text-sm font-semibold uppercase">{isGuest ? 'Ejemplos Disponibles' : 'Recursos Guardados'}</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.totalResources}</h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600"><FileText className="w-6 h-6" /></div>
          </div>
          <button 
            onClick={() => handleProtectedAction('resources')}
            className="text-brand-600 font-medium text-sm flex items-center mt-4 group"
          >
            {isGuest ? 'Ver ejemplos' : 'Ver biblioteca'} <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-400 text-sm font-semibold uppercase">Tu Plan</p>
              <h3 className="text-3xl font-bold mt-2 capitalize">{user.plan}</h3>
            </div>
            <Crown className="w-6 h-6 text-yellow-400" />
          </div>
          <Button 
            className="w-full mt-2 bg-white text-slate-900 border-0"
            onClick={() => handleProtectedAction('pricing')}
          >
            {isGuest ? "Crear Cuenta Gratis" : "Mejorar Plan"}
          </Button>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            {isGuest ? "Ejemplos de lo que puedes crear" : "Actividad Reciente"}
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {stats.recentActivity.map((resource) => (
            <div 
              key={resource.id} 
              className="p-4 sm:p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              onClick={() => handleProtectedAction('resources')}
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-100 transition-colors">
                {isGuest ? <Lock className="w-5 h-5 opacity-50" /> : <FileText className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-slate-900">{resource.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{resource.subject} • {resource.level}</p>
              </div>
              {isGuest && <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">DEMO</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};