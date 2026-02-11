import React from 'react';
import { User, UserPlan } from '../types';
import { Check, X as XIcon, Sparkles } from 'lucide-react'; 
import { Button } from '../components/Button';
import { APP_CONFIG, PLAN_LIMITS } from '../constants';

interface PricingProps {
  user: User;
  onUpgrade: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ user, onUpgrade }) => {
  
  // Leemos los datos de configuración
  const freeLimits = PLAN_LIMITS[UserPlan.FREE];
  const premiumLimits = PLAN_LIMITS[UserPlan.PREMIUM];
  const prices = APP_CONFIG.PRICING;

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          Planes diseñados para profesores
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Empieza gratis y pásate al plan PRO por menos de lo que cuesta un desayuno.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start px-4">
        
        {/* --- PLAN GRATUITO --- */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg hover:shadow-xl transition-shadow p-8 flex flex-col h-full relative">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Plan Gratuito</h3>
            <p className="text-slate-500 mt-2 font-medium">Para probar la herramienta.</p>
            <div className="mt-6 flex items-baseline">
              <span className="text-5xl font-extrabold text-slate-900">0€</span>
              <span className="ml-2 text-xl text-slate-500">/mes</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">Acceso a <strong>{freeLimits.maxResources} recursos</strong></span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700"><strong>{freeLimits.maxGenerations} Fichas IA</strong> al mes</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">Historial limitado ({freeLimits.maxHistory} últimos)</span>
            </li>
            {/* EL GANCHO: Mostramos que NO hay PDF */}
            <li className="flex items-start opacity-50">
              <XIcon className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-500 decoration-slate-400">Descarga en PDF limpio</span>
            </li>
            <li className="flex items-start opacity-50">
              <XIcon className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-500">Soporte prioritario</span>
            </li>
          </ul>

          <Button 
            variant="outline" 
            className="w-full py-4 text-lg"
            disabled={user.plan === UserPlan.FREE}
          >
            {user.plan === UserPlan.FREE ? 'Tu Plan Actual' : 'Downgrade a Gratis'}
          </Button>
        </div>

        {/* --- PLAN PREMIUM --- */}
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-8 flex flex-col h-full relative overflow-hidden transform md:-translate-y-4">
          
          {/* Etiqueta Recomendado */}
          <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl shadow-lg">
            RECOMENDADO
          </div>
          
          <div className="mb-6 relative z-10">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              Plan Premium
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </h3>
            <p className="text-slate-300 mt-2 font-medium">Potencia total para el aula.</p>
            
            <div className="mt-6 flex items-baseline">
              {/* PRECIO DINÁMICO */}
              <span className="text-6xl font-extrabold text-white">{prices.MONTHLY}€</span>
              <span className="ml-2 text-xl text-slate-400">/mes</span>
            </div>
            <p className="text-sm text-brand-300 mt-2 font-semibold">
              o solo {prices.YEARLY}€/año (¡2 meses gratis!)
            </p>
          </div>

          <ul className="space-y-4 mb-8 flex-1 relative z-10">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-400 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-100">Acceso <strong>ILIMITADO</strong> a recursos</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-400 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-100">Generaciones IA <strong>ILIMITADAS*</strong></span>
            </li>
            {/* LA JOYA DE LA CORONA: EL PDF */}
            <li className="flex items-start bg-slate-800/50 p-2 rounded-lg -mx-2">
              <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-white font-bold">Descarga PDF Profesional</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-400 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-100">Historial completo guardado</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-brand-400 mr-3 flex-shrink-0 mt-0.5" />
              <span className="text-slate-100">Soporte técnico prioritario</span>
            </li>
          </ul>

          <Button 
            variant="primary" 
            className="w-full py-4 text-lg bg-brand-600 hover:bg-brand-500 border-none text-white shadow-lg shadow-brand-900/50 transition-all hover:scale-[1.02]"
            onClick={onUpgrade}
            disabled={user.plan === UserPlan.PREMIUM}
          >
            {user.plan === UserPlan.PREMIUM ? 'Tu Plan Actual' : 'Suscribirse Ahora'}
          </Button>
          
          <p className="text-center text-xs text-slate-500 mt-4 relative z-10">
            *Uso responsable hasta {premiumLimits.maxGenerations} gens/mes
          </p>
        </div>
      </div>
    </div>
  );
};