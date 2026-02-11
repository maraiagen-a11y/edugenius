import { useState } from 'react';
import { supabase } from '../services/supabaseClient';

// Definimos que este componente espera recibir una función para cambiar de pantalla
interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'profesor'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Crear usuario Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Guardar perfil
        const { error: dbError } = await supabase
          .from('profiles')
          .insert([{
              id: authData.user.id,
              name: formData.name,
              email: formData.email,
              role: formData.role
          }]);

        if (dbError) throw dbError;

        alert('¡Registro exitoso! Revisa tu email.');
        
        // AQUÍ ESTÁ EL CAMBIO: Usamos la función manual en vez de navigate
        onSwitchToLogin(); 
      }

    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h2>
        
        <form onSubmit={handleRegister} className="space-y-4">
          {/* ... Inputs iguales que antes (Nombre, Rol, Email, Password) ... */}
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input name="name" type="text" required className="w-full px-4 py-2 border rounded-lg" onChange={handleChange} />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">Rol</label>
             <select name="role" className="w-full px-4 py-2 border rounded-lg" onChange={handleChange}>
               <option value="profesor">Profesor</option>
               <option value="alumno">Alumno</option>
             </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-2 border rounded-lg" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input name="password" type="password" required className="w-full px-4 py-2 border rounded-lg" onChange={handleChange} />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            {loading ? 'Creando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <button onClick={onSwitchToLogin} className="text-blue-600 font-semibold hover:underline">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}