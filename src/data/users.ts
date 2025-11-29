import { User } from '../types/auth';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'entrenador@test.com',
    password: 'entrenador123',
    role: 'entrenador',
    name: 'Carlos Rodríguez'
  },
  {
    id: '2',
    email: 'gimnasio@test.com',
    password: 'gimnasio123',
    role: 'gimnasio',
    name: 'Gimnasio FitZone'
  },
  {
    id: '3',
    email: 'creador@test.com',
    password: 'creador123',
    role: 'creador',
    name: 'Alex Creativo'
  }
];
