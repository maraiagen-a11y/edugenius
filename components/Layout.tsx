import React, { useState } from 'react';
import { User } from '../types';
import { 
  LayoutDashboard, 
  BookOpen, 
  Sparkles, 
  CreditCard, 
  Menu, 
  X, 
  LogOut,
  User as UserIcon
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout, 
  currentPage, 
  onNavigate 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'resources', label: 'Biblioteca de Recursos', icon: BookOpen },
    { id: 'generator', label: 'Generador IA', icon: Sparkles },
    { id: 'pricing', label: 'Planes y Precios', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row print:bg-white font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center no-print">
        <div className="flex items-center space-x-2">
          <div className="bg-brand-600 text-white p-1.5 rounded-lg">
            <Sparkles size={20} />
          </div>
          <span className="font-bold text-lg text-slate-800">FichaLab</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out
        md:relative md:translate-x-0 no-print
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          {/* LOGO DE ESCRITORIO - Aquí estaba el error */}
          <div className="hidden md:flex items-center space-x-2 mb-8">
             <div className="bg-brand-500 text-white p-1.5 rounded-lg">
                <Sparkles size={24} />
              </div>
            {/* CORREGIDO: De EduGenius a FichaLab */}
            <span className="font-bold text-xl tracking-tight">FichaLab</span>
          </div>

          <div className="mb-6 px-3 py-2 bg-slate-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-slate-700 p-2 rounded-full border border-slate-600">
                <UserIcon size={16} />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate text-slate-100">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.plan} Plan</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                  currentPage === item.id 
                    ? 'bg-brand-600 text-white shadow-md' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <button 
            onClick={onLogout}
            className="mt-auto flex items-center space-x-3 px-3 py-3 rounded-lg text-slate-300 hover:bg-red-900/30 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden no-print"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};