export type UserRole = 'entrenador' | 'gimnasio';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}
