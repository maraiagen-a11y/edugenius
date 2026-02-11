import React, { useEffect, useState } from 'react';
import { User, Resource } from '../types';
import { supabase } from '../services/supabaseClient';
import { 
  Search, 
  Trash2, 
  Eye, 
  FileText, 
  X, 
  Printer, 
  Calendar,
  Globe, // Nuevo icono para lo público
  Users
} from 'lucide-react';
import { Button } from '../components/Button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Datos de prueba para invitados
const MOCK_RESOURCES: Resource[] = [
  {
    id: 'mock-1',
    user_id: 'guest',
    title: 'Ejemplo: Las Capitales de Europa',
    content: '# Capitales de Europa\n\n1. España - Madrid\n2. Francia - París',
    created_at: new Date().toISOString(),
    type: 'worksheet',
    is_public: true
  }
];

interface ResourceLibraryProps {
  user: User;
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'private' | 'public'>('private'); // Control de pestañas
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  const isGuest = user.id === 'guest';

  useEffect(() => {
    fetchResources();
  }, [user.id, activeTab]); // Recargar si cambiamos de usuario o de pestaña

  const fetchResources = async () => {
    // Si es invitado y quiere ver "Mis Fichas", mostramos ejemplo
    if (isGuest && activeTab === 'private') {
      setResources(MOCK_RESOURCES);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeTab === 'private') {
        // Pestaña "Mis Fichas": Solo las mías
        query = query.eq('user_id', user.id);
      } else {
        // Pestaña "Galería": Solo las públicas (de cualquiera)
        query = query.eq('is_public', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error cargando recursos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGuest) return;
    if (!window.confirm('¿Estás seguro de que quieres borrar esta ficha?')) return;

    try {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
      setResources(resources.filter(r => r.id !== id));
      if (selectedResource?.id === id) setSelectedResource(null);
    } catch (error) {
      alert('Error al borrar la ficha.');
    }
  };

  // Función para cambiar entre Público/Privado
  const togglePublic = async (resource: Resource, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isGuest) return;

    const newValue = !resource.is_public;
    
    try {
      const { error } = await supabase
        .from('resources')
        .update({ is_public: newValue })
        .eq('id', resource.id);

      if (error) throw error;

      // Actualizamos la interfaz inmediatamente (Optimistic UI)
      setResources(resources.map(r => 
        r.id === resource.id ? { ...r, is_public: newValue } : r
      ));
    } catch (error) {
      console.error("Error actualizando estado público:", error);
      alert("No se pudo cambiar el estado. Revisa tu conexión.");
    }
  };

  const handleViewRequest = (resource: Resource) => {
    // Permitimos ver siempre (la seguridad ya filtra en la carga)
    setSelectedResource(resource);
  };

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 relative font-sans">
      
      {/* CABECERA CON PESTAÑAS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            Biblioteca de Recursos
          </h1>
          <p className="text-slate-500 mt-1">
            Gestiona tus fichas o descubre contenido de la comunidad.
          </p>
        </div>

        {/* SELECTOR DE PESTAÑAS */}
        <div className="bg-slate-100 p-1 rounded-xl flex font-medium text-sm self-start md:self-auto">
            <button 
                onClick={() => setActiveTab('private')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'private' ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <FileText className="w-4 h-4" /> Mis Fichas
            </button>
            <button 
                onClick={() => setActiveTab('public')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${activeTab === 'public' ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Users className="w-4 h-4" /> Galería Pública
            </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Buscar por título..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* LISTA DE RECURSOS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
             <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
             <p>Cargando biblioteca...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 p-8 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
              {activeTab === 'public' ? <Users className="w-8 h-8 text-slate-300" /> : <FileText className="w-8 h-8 text-slate-300" />}
            </div>
            <h3 className="text-lg font-medium text-slate-900">No hay fichas aquí</h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              {activeTab === 'public' 
                ? "Aún no hay fichas públicas. ¡Sé el primero en compartir!" 
                : "Ve al Generador para crear tu primer material educativo."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* CABECERA DE TABLA */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <div className="col-span-8 md:col-span-6">Título</div>
              <div className="col-span-3 hidden md:block">Fecha</div>
              <div className="col-span-4 md:col-span-3 text-right">Acciones</div>
            </div>

            {/* FILAS */}
            {filteredResources.map((resource) => (
              <div 
                key={resource.id} 
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => handleViewRequest(resource)}
              >
                
                {/* Título e Icono */}
                <div className="col-span-8 md:col-span-6 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${resource.is_public ? 'bg-green-100 text-green-700' : 'bg-brand-50 text-brand-600'}`}>
                    {resource.is_public ? <Globe className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-slate-900 truncate pr-4">{resource.title}</h3>
                    {resource.is_public && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800 mt-1 uppercase tracking-wide">
                            Público
                        </span>
                    )}
                  </div>
                </div>

                {/* Fecha */}
                <div className="col-span-3 hidden md:flex items-center text-sm text-slate-500">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  {resource.created_at ? new Date(resource.created_at).toLocaleDateString() : '---'}
                </div>

                {/* Acciones */}
                <div className="col-span-4 md:col-span-3 flex justify-end gap-1">
                  
                  {/* Botón MUNDO (Hacer público/privado) - SOLO SI ES MÍA */}
                  {!isGuest && resource.user_id === user.id && (
                    <button 
                      onClick={(e) => togglePublic(resource, e)}
                      className={`p-2 rounded-lg transition-colors ${resource.is_public ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                      title={resource.is_public ? "Hacer Privado" : "Hacer Público"}
                    >
                      <Globe className="w-4 h-4" />
                    </button>
                  )}

                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedResource(resource); }}
                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                    title="Ver Ficha"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Borrar (Solo si es mía) */}
                  {!isGuest && resource.user_id === user.id && (
                    <button 
                      onClick={(e) => handleDelete(resource.id, e)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODAL VISTA PREVIA --- */}
      {selectedResource && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-800 truncate max-w-md">
                  {selectedResource.title}
                </h2>
                <div className="flex gap-2 text-xs mt-1">
                   <span className="text-slate-500">Vista previa</span>
                   {selectedResource.is_public && <span className="text-green-600 font-medium flex items-center gap-1"><Globe className="w-3 h-3"/> Pública</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="w-4 h-4 mr-2" /> Imprimir
                </Button>
                <button 
                  onClick={() => setSelectedResource(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-slate-100 modal-content">
               <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm] p-[20mm] text-slate-900">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-black text-slate-900 mb-6 border-b-2 border-slate-900 pb-2 uppercase tracking-tight" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-8 mb-4 uppercase tracking-wide text-slate-800 border-l-4 border-brand-500 pl-3" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-6 mb-2 text-slate-700" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-justify text-slate-700" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 mb-4 space-y-1 text-slate-700" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-1 text-slate-700" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-slate-300 pl-4 italic text-slate-600 my-4" {...props} />,
                      hr: ({node, ...props}) => <hr className="my-8 border-slate-200" {...props} />,
                    }}
                  >
                    {selectedResource.content}
                  </ReactMarkdown>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};