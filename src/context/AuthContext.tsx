import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';
import { MOCK_USERS } from '../data/users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'gym_app_user';

// Función para cargar el usuario desde localStorage
const loadUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Verificar que el usuario aún existe en MOCK_USERS (validación básica)
      const userExists = MOCK_USERS.some(u => u.email === user.email);
      if (userExists) {
        return user;
      }
    }
  } catch (error) {
    console.error('Error al cargar usuario desde localStorage:', error);
  }
  return null;
};

// Función para guardar el usuario en localStorage
const saveUserToStorage = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error al guardar usuario en localStorage:', error);
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicializar el estado con el usuario guardado en localStorage si existe
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage());

  // Sincronizar cambios del usuario con localStorage
  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  const login = (email: string, password: string): boolean => {
    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    // localStorage se limpia automáticamente por el useEffect cuando setUser(null)
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
