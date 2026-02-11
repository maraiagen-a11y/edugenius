import React from 'react';
import { Sparkles, Zap, Brain, Shield, Library } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onExplore: () => void; // Botón para ir a la biblioteca pública
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onExplore }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-sans text-slate-900">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 text-white p-2 rounded-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          {/* CORRECCIÓN AQUÍ: Cambiado de EduGenius a FichaLab */}
          <span className="text-xl font-bold tracking-tight text-slate-900">FichaLab</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={onExplore}
            className="hidden md:block text-slate-600 hover:text-brand-600 font-medium transition-colors px-4 py-2"
          >
            Explorar Fichas
          </button>
          <button 
            onClick={onStart} 
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-medium transition-all shadow-lg shadow-brand-200"
          >
            Empezar Gratis
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-8 border border-brand-100">
          <Zap className="w-4 h-4 fill-current" />
          <span>Nueva IA Generativa v2.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
          Crea fichas educativas <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
            en segundos, no horas
          </span>
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          FichaLab es la herramienta definitiva para profesores. Genera ejercicios, exámenes y material de estudio ilimitado con Inteligencia Artificial.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Crear mi primera ficha
          </button>
          
          <button 
            onClick={onExplore}
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg transition-all shadow-sm hover:shadow-md flex items-center gap-2"
          >
            <Library className="w-5 h-5" />
            Ver Galería Pública
          </button>
        </div>

        {/* FEATURES GRID */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-brand-200 transition-colors">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instantáneo</h3>
            <p className="text-slate-500 leading-relaxed">
              Olvídate de buscar en Google. Pide "Ejercicios de sumas para 2º de primaria" y tenlo listo para imprimir al momento.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-brand-200 transition-colors">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">IA Pedagógica</h3>
            <p className="text-slate-500 leading-relaxed">
              Nuestra IA entiende el currículo escolar. Adapta la dificultad y el tono según la edad de tus alumnos.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:border-brand-200 transition-colors">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Tuyo para siempre</h3>
            <p className="text-slate-500 leading-relaxed">
              Todo lo que generas es tuyo. Guárdalo en tu biblioteca privada o compártelo con la comunidad de FichaLab.
            </p>
          </div>
        </div>
      </main>
      
      {/* FOOTER SIMPLE */}
      <footer className="border-t border-slate-200 py-12 text-center text-slate-400 text-sm">
        <p>© 2024 FichaLab. Hecho con ❤️ para profesores.</p>
      </footer>
    </div>
  );
};