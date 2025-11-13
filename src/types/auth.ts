export type UserRole = 'entrenador' | 'gimnasio' | 'creador';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  sede?: string; // Sede/location del usuario
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
