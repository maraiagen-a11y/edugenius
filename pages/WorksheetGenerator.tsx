import React, { useState } from 'react';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { generateWorksheet } from '../services/geminiService';
import { supabase } from '../services/supabaseClient';
import { EducationLevel, Subject, User, UserPlan, WorksheetResponse } from '../types';
import { Button } from '../components/Button';
import { PLAN_LIMITS } from '../constants';
import { 
  Sparkles, 
  Printer, 
  RefreshCw, 
  LayoutTemplate, 
  Lock, 
  AlertCircle,
} from 'lucide-react';

interface WorksheetGeneratorProps {
  user: User;
  onWorksheetGenerated: () => void;
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ user, onWorksheetGenerated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [level, setLevel] = useState<EducationLevel>(EducationLevel.PRIMARY);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [instructions, setInstructions] = useState('');

  const [result, setResult] = useState<WorksheetResponse | null>(null);

  const limits = PLAN_LIMITS[user.plan];
  const canGenerate = user.plan === UserPlan.PREMIUM || user.generatedCount < limits.maxGenerations;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    if (!topic.trim()) {
      setError("Por favor, introduce un tema.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // 1. Generamos el contenido con la IA
      const response = await generateWorksheet({
        subject,
        level,
        topic,
        exerciseCount: count,
        instructions
      });

      // 2. Si NO es invitado, guardamos en la base de datos y actualizamos contador
      if (user.id !== 'guest') {
        
        // A) Guardar la ficha en la tabla 'resources'
        const { error: insertError } = await supabase
          .from('resources')
          .insert([
            {
              user_id: user.id,
              title: `${subject}: ${topic} (${level})`,
              content: response.content,
              type: 'worksheet'
            }
          ]);

        if (insertError) throw insertError;

        // B) --- AUTOMATIZACIÓN: SUMAR +1 AL CONTADOR ---
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ generated_count: user.generatedCount + 1 })
          .eq('id', user.id);

        if (!updateError) {
          // Avisamos a la App para que refresque el número en pantalla
          onWorksheetGenerated(); 
        }
      }

      setResult(response);

    } catch (err) {
      console.error(err);
      setError("Error al guardar o generar. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    // CONTENEDOR PRINCIPAL CON ARREGLO DE IMPRESIÓN (overflow-visible)
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] bg-slate-100 overflow-hidden font-sans print:h-auto print:overflow-visible print:bg-white">
      
      {/* Estilos CSS Específicos para Impresión perfecta */}
      <style>{`
        @media print {
          @page {
            margin: 20mm;
            size: auto;
          }
          body {
            background: white;
            height: auto;
            overflow: visible;
          }
          ::-webkit-scrollbar {
            display: none;
          }
          h1, h2, h3 {
            break-after: avoid;
          }
          li, p, blockquote {
            break-inside: avoid;
          }
        }
      `}</style>

      {/* --- PANEL IZQUIERDO: CONTROLES --- */}
      <div className="w-full lg:w-[400px] bg-white border-r border-slate-200 flex flex-col h-full z-10 print:hidden shadow-xl lg:shadow-none">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-brand-600" />
            Configuración
          </h2>
          <p className="text-xs text-slate-500 mt-1">Define los parámetros de tu ficha.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Selectores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asignatura</label>
              <select 
                className="w-full rounded-lg border-slate-200 text-sm focus:border-brand-500 py-2"
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
              >
                {Object.values(Subject).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nivel</label>
              <select 
                className="w-full rounded-lg border-slate-200 text-sm focus:border-brand-500 py-2"
                value={level}
                onChange={(e) => setLevel(e.target.value as EducationLevel)}
              >
                {Object.values(EducationLevel).map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tema Principal</label>
            <input
              type="text"
              className="w-full rounded-lg border-slate-200 text-sm focus:border-brand-500 py-2"
              placeholder="Ej: Logaritmos, Verbos..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Ejercicios: {count}</label>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-600"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Instrucciones</label>
            <textarea
              className="w-full rounded-lg border-slate-200 text-sm focus:border-brand-500 py-2"
              rows={3}
              placeholder="Ej: Formato lista, espacio para escribir..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          {/* Botón Generar */}
          <div className="pt-4">
            <Button 
              onClick={handleGenerate} 
              isLoading={isLoading} 
              disabled={!canGenerate || !topic}
              className={`w-full py-3 shadow-lg ${!canGenerate ? 'bg-slate-400 hover:bg-slate-400 cursor-not-allowed' : 'bg-brand-600 shadow-brand-500/30'}`}
            >
              {isLoading ? 'Generando...' : (
                <span className="flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" /> {result ? 'Regenerar' : 'Generar Ficha'}
                </span>
              )}
            </Button>
            {!canGenerate && (
               <p className="text-xs text-center text-red-500 mt-2 font-medium">Límite gratuito alcanzado.</p>
            )}
            {error && <p className="text-xs text-center text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>

      {/* --- PANEL DERECHO: VISTA PREVIA --- */}
      <div className="flex-1 flex flex-col h-full bg-slate-200 overflow-hidden relative print:bg-white print:overflow-visible print:h-auto print:block">
        
        {/* Barra Superior Fija (Se oculta al imprimir) */}
        {result && (
          <div className="h-14 border-b border-slate-300 bg-white px-6 flex items-center justify-between shrink-0 print:hidden z-20 shadow-sm">
            <div className="text-sm font-medium text-slate-600">Vista Previa A4</div>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" onClick={handleGenerate} title="Regenerar">
                <RefreshCw className="w-4 h-4 text-slate-600" />
              </Button>
              <Button size="sm" onClick={handlePrint} className="bg-slate-800 text-white hover:bg-slate-700">
                <Printer className="w-4 h-4 mr-2" /> Imprimir / PDF
              </Button>
            </div>
          </div>
        )}

        {/* ÁREA DE SCROLL (DOCUMENTO) */}
        <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible print:h-auto">
          
          <div className="max-w-[210mm] mx-auto print:w-full print:max-w-none">
            
            {!result && (
              <div className="min-h-[297mm] bg-white shadow-xl flex flex-col items-center justify-center text-slate-300 border border-slate-200 rounded-sm">
                 {isLoading ? (
                    <div className="flex flex-col items-center animate-pulse">
                      <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
                      <p className="text-brand-600 font-medium">Redactando contenido...</p>
                    </div>
                 ) : (
                    <>
                      <LayoutTemplate className="w-20 h-20 mb-4 opacity-20" />
                      <p>Configura y genera tu primera ficha.</p>
                    </>
                 )}
              </div>
            )}

            {/* CONTENIDO DE LA FICHA (PÁGINAS) */}
            {result && !isLoading && (
              <div className="print:w-full">
                <div className="bg-white shadow-2xl min-h-[297mm] p-[20mm] md:p-[25mm] print:shadow-none print:p-0 print:m-0 text-slate-900 leading-relaxed">
                  
                  {/* Cabecera del Documento */}
                  <div className="border-b-2 border-slate-900 pb-6 mb-10 flex justify-between items-end">
                     <div>
                       <h1 className="text-4xl font-black text-slate-900 mb-1 uppercase tracking-tighter m-0 p-0">{subject}</h1>
                       <p className="text-slate-600 font-bold text-lg m-0">{level} • {topic}</p>
                     </div>
                     <div className="text-right hidden md:block print:block">
                       <div className="text-sm text-slate-400 mb-3 font-medium">Fecha: _________________</div>
                       <div className="text-sm text-slate-400 font-medium">Nombre: _________________________</div>
                     </div>
                  </div>

                  {/* Markdown Renderizado */}
                  <div className="prose prose-slate max-w-none prose-p:text-justify prose-headings:font-bold prose-headings:text-slate-900 print:prose-sm">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]} 
                      components={{
                        h1: ({node, ...props}) => <h2 className="text-2xl font-bold border-b border-slate-300 pb-2 mt-8 mb-6 text-brand-700" {...props} />,
                        h2: ({node, ...props}) => <h3 className="text-xl font-bold mt-8 mb-4 text-slate-800 uppercase tracking-wide" {...props} />,
                        
                        p: ({node, ...props}) => <p className="mb-4 text-slate-700 leading-relaxed" {...props} />,
                        
                        // Listas bien maquetadas
                        ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 space-y-2 mb-6" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 space-y-4 mb-6 font-medium text-slate-800" {...props} />,
                        
                        li: ({node, ...props}) => <li className="pl-2" {...props} />,
                        
                        blockquote: ({node, ...props}) => (
                          <div className="border-l-4 border-brand-500 bg-brand-50/50 p-4 my-6 italic text-slate-700 rounded-r-lg">
                            {props.children}
                          </div>
                        ),
                        
                        strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />,
                        hr: ({node, ...props}) => <hr className="my-10 border-t border-slate-200" {...props} />,
                      }}
                    >
                      {result.content}
                    </ReactMarkdown>
                  </div>

                </div>
              </div>
            )}
            
            <div className="h-20 print:hidden"></div>
          </div>
        </div>
      </div>
    </div>
  );
};