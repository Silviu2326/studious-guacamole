import { EventoReto, EventoFilters, TipoEvento, EstadoEvento, TipoReto, DuracionReto, ObjetivoReto } from '../types';

// Datos mock iniciales
const eventosRetosMock: EventoReto[] = [
  {
    id: '1',
    tipo: 'reto',
    tipoReto: 'personal',
    titulo: 'Reto 30 días conmigo',
    descripcion: 'Un reto personalizado de 30 días para alcanzar tus objetivos de forma divertida y motivadora.',
    duracionDias: 30,
    fechaInicio: new Date('2024-01-01'),
    fechaFin: new Date('2024-01-31'),
    objetivo: 'general',
    reglas: ['Completar entrenamiento diario', 'Registrar progreso', 'Mantener adherencia'],
    estado: 'en_curso',
    creadorId: 'entrenador-1',
    creadorNombre: 'Juan Pérez',
    participantes: [],
    contenidoMotivacional: [],
    premios: [],
    ranking: [],
    createdAt: new Date('2023-12-15'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    tipo: 'evento',
    tipoReto: 'grupal',
    titulo: 'Masterclass de movilidad sábado 18:00',
    descripcion: 'Una masterclass especial sobre movilidad y flexibilidad. Perfecta para mejorar tu rango de movimiento.',
    fechaInicio: new Date('2024-02-10'),
    estado: 'publicado',
    capacidadMaxima: 30,
    requisitos: ['Membresía activa', 'Reserva previa'],
    reglas: ['Llegar 10 minutos antes', 'Traer mat de yoga'],
    creadorId: 'gimnasio-1',
    creadorNombre: 'Gimnasio Fitness Pro',
    participantes: [],
    contenidoMotivacional: [],
    premios: [],
    ranking: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    tipo: 'reto',
    tipoReto: 'grupal',
    titulo: 'Reto 8 Semanas Verano',
    descripcion: 'El reto definitivo para estar en forma este verano. 8 semanas de entrenamiento y nutrición.',
    duracionDias: 60,
    fechaInicio: new Date('2024-03-01'),
    fechaFin: new Date('2024-04-29'),
    objetivo: 'perdida_peso',
    reglas: ['Entrenamiento 5 veces por semana', 'Check-in diario', 'Seguir plan nutricional'],
    estado: 'borrador',
    capacidadMaxima: 100,
    creadorId: 'gimnasio-1',
    creadorNombre: 'Gimnasio Fitness Pro',
    participantes: [],
    contenidoMotivacional: [],
    premios: [
      {
        id: '1',
        tipo: 'medalla',
        nombre: 'Medalla Completador',
        descripcion: 'Para quienes completen las 8 semanas',
        requisito: '100% de adherencia',
      }
    ],
    ranking: [],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
];

class EventosRetosService {
  private eventos: EventoReto[] = [...eventosRetosMock];

  async getEventosRetos(filters?: EventoFilters): Promise<EventoReto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let result = [...this.eventos];
    
    if (filters?.tipo) {
      result = result.filter(e => e.tipo === filters.tipo);
    }
    
    if (filters?.estado) {
      result = result.filter(e => e.estado === filters.estado);
    }
    
    if (filters?.objetivo) {
      result = result.filter(e => e.objetivo === filters.objetivo);
    }
    
    if (filters?.fechaInicioDesde) {
      result = result.filter(e => e.fechaInicio >= filters.fechaInicioDesde!);
    }
    
    if (filters?.fechaInicioHasta) {
      result = result.filter(e => e.fechaInicio <= filters.fechaInicioHasta!);
    }
    
    return result;
  }

  async getEventoReto(id: string): Promise<EventoReto | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.eventos.find(e => e.id === id) || null;
  }

  async createEventoReto(evento: Omit<EventoReto, 'id' | 'createdAt' | 'updatedAt' | 'participantes' | 'ranking' | 'contenidoMotivacional' | 'premios'>): Promise<EventoReto> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const nuevoEvento: EventoReto = {
      ...evento,
      id: Date.now().toString(),
      participantes: [],
      contenidoMotivacional: [],
      premios: [],
      ranking: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.eventos.push(nuevoEvento);
    return nuevoEvento;
  }

  async updateEventoReto(id: string, updates: Partial<EventoReto>): Promise<EventoReto> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = this.eventos.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Evento no encontrado');
    }
    
    this.eventos[index] = {
      ...this.eventos[index],
      ...updates,
      updatedAt: new Date(),
    };
    
    return this.eventos[index];
  }

  async deleteEventoReto(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.eventos = this.eventos.filter(e => e.id !== id);
  }
}

export const eventosRetosService = new EventosRetosService();

