import React, { useState, useEffect } from 'react';
import Register from './pages/Register';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/LandingPage'; 
import { ResourceLibrary } from './pages/ResourceLibrary';
import { WorksheetGenerator } from './pages/WorksheetGenerator';
import { Pricing } from './pages/Pricing';
import { User, UserPlan } from './types';
import { supabase } from './services/supabaseClient';

// --- DEFINIMOS EL USUARIO INVITADO ---
const GUEST_USER: User = {
  id: 'guest',
  name: 'Profe Invitado',
  email: 'invitado@fichalab.com', // Actualizado a FichaLab
  role: 'profesor',
  plan: UserPlan.FREE,
  generatedCount: 0
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      await fetchUserProfile(session.user.id, session.user.email!);
    } else {
      // SI NO HAY SESIÓN -> CARGAMOS MODO INVITADO AUTOMÁTICAMENTE
      setUser(GUEST_USER);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        console.log("Perfil no encontrado. Creando uno nuevo... 🛠️");
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            id: userId,
            email: email,
            name: email.split('@')[0], 
            role: 'profesor',
            plan: 'free',
            generated_count: 0
          }])
          .select()
          .single();

        if (createError) throw createError;
        data = newProfile;
        error = null;
      } else if (error) {
        throw error;
      }

      if (data) {
        setUser({
          id: data.id,
          name: data.name || email.split('@')[0],
          email: data.email,
          role: data.role as 'profesor' | 'alumno',
          plan: (data.plan as UserPlan) || UserPlan.FREE, 
          generatedCount: data.generated_count || 0 
        });
        setIsAuthenticated(true);
        if (loading) setCurrentPage('dashboard');
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (!user || user.id === 'guest') return;
    await fetchUserProfile(user.id, user.email);
  };

  const handleLogin = () => {
    window.location.reload();
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const requireAuth = () => {
    setAuthView('login');
    setCurrentPage('login_required'); 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  
  // --- LÓGICA DE LANDING VS APP ---
  if (!isAuthenticated && currentPage === 'landing') {
    return (
      <LandingPage 
        onStart={() => setCurrentPage('login_required')} 
        onExplore={() => {
          // TRUCO DE MAGIA: Si quiere explorar, le dejamos pasar como GUEST
          // y le mandamos directo a la biblioteca
          setUser(GUEST_USER); 
          setCurrentPage('resources');
        }}
      />
    );
  }

  if (currentPage === 'login_required') {
    return authView === 'register' 
      ? <Register onSwitchToLogin={() => setAuthView('login')} />
      : <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
  }

  if (!user) return null;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': 
        return <Dashboard user={user} onNavigate={setCurrentPage} onRequireAuth={requireAuth} />;
      
      case 'resources': 
        // La biblioteca ya sabe manejar invitados
        return <ResourceLibrary user={user} />;
      
      case 'generator': 
        if (!isAuthenticated) return <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthView('register')} />;
        return <WorksheetGenerator user={user} onWorksheetGenerated={refreshUserData} />;
      
      case 'pricing': 
        return <Pricing user={user} onUpgrade={requireAuth} />;
      
      default: return <Dashboard user={user} onNavigate={setCurrentPage} onRequireAuth={requireAuth} />;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default App;