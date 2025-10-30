import { useEffect, useState } from 'react';
import { LogIn, User, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    const success = login(email, password);
    if (!success) {
      setError('Credenciales incorrectas');
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const fillCredentials = (role: 'entrenador' | 'gimnasio') => {
    if (role === 'entrenador') {
      setEmail('entrenador@test.com');
      setPassword('entrenador123');
    } else {
      setEmail('gimnasio@test.com');
      setPassword('gimnasio123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bienvenido
            </h1>
            <p className="text-gray-600">
              Sistema de Gestión para Entrenadores
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center mb-4">
              Usuarios de prueba:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => fillCredentials('entrenador')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition border border-green-200"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Entrenador</span>
              </button>
              <button
                onClick={() => fillCredentials('gimnasio')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition border border-purple-200"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">Gimnasio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
