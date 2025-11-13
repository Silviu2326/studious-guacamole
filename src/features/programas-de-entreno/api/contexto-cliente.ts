import { ContextoCliente } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_CONTEXTO_CLIENTES: Map<string, ContextoCliente> = new Map();

const initializeMockData = (clienteId: string) => {
  if (!MOCK_CONTEXTO_CLIENTES.has(clienteId)) {
    MOCK_CONTEXTO_CLIENTES.set(clienteId, {
      clienteId,
      clienteNombre: 'Cliente Ejemplo',
      datosBiometricos: {
        peso: {
          valor: 75.5,
          fecha: new Date().toISOString().split('T')[0],
          tendencia: 'bajando',
        },
        altura: 175,
        imc: 24.7,
        grasaCorporal: {
          porcentaje: 18.5,
          fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        masaMuscular: {
          kg: 61.5,
          fecha: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        medidas: {
          cintura: 85,
          cadera: 95,
          pecho: 100,
          brazo: 32,
          muslo: 58,
          fecha: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        frecuenciaCardiaca: {
          reposo: 62,
          maxima: 190,
        },
        vo2Max: 45,
      },
      lesiones: [
        {
          id: 'les-1',
          nombre: 'Lesión de rodilla',
          ubicacion: 'Rodilla derecha',
          severidad: 'leve',
          fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          estado: 'activa',
          restricciones: ['Evitar sentadillas profundas', 'No correr en pendiente'],
          notas: 'Mejorando gradualmente, seguir con ejercicios de fortalecimiento',
        },
      ],
      habitos: [
        {
          id: 'hab-1',
          nombre: 'Rutina Semanal',
          tipo: 'rutina-semanal',
          objetivo: 4,
          unidad: 'sesiones',
          cumplimiento: 75,
          activo: true,
        },
        {
          id: 'hab-2',
          nombre: 'Sueño de calidad',
          tipo: 'sueño',
          objetivo: 7,
          unidad: 'horas',
          cumplimiento: 85,
          activo: true,
        },
      ],
      disponibilidadMaterial: [
        {
          material: 'Mancuernas',
          disponible: true,
          ubicacion: 'Casa',
          notas: 'Pesos de 5kg, 10kg, 15kg',
        },
        {
          material: 'Barra y discos',
          disponible: false,
          ubicacion: 'Gimnasio',
        },
        {
          material: 'Colchoneta',
          disponible: true,
          ubicacion: 'Casa',
        },
        {
          material: 'Banda elástica',
          disponible: true,
          ubicacion: 'Casa',
        },
      ],
      cronotipo: 'matutino',
      ultimaActualizacion: new Date().toISOString(),
    });
  }
};

/**
 * Obtiene el contexto completo del cliente
 */
export const getContextoCliente = async (clienteId: string): Promise<ContextoCliente | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  initializeMockData(clienteId);
  return MOCK_CONTEXTO_CLIENTES.get(clienteId) || null;
};

/**
 * Obtiene lista de clientes (para selector)
 */
export const getClientes = async (): Promise<Array<{ id: string; nombre: string }>> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return [
    { id: '1', nombre: 'Carla' },
    { id: '2', nombre: 'Miguel' },
    { id: '3', nombre: 'Ana' },
  ];
};

