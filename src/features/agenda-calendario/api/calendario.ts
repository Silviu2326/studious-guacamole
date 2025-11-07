import { Cita, TipoCita, EstadoCita } from '../types';

export const getCitas = async (fechaInicio: Date, fechaFin: Date, role: 'entrenador' | 'gimnasio'): Promise<Cita[]> => {
  // Mock API - En producción, esto haría una llamada real
  return new Promise((resolve) => {
    setTimeout(() => {
      const hoy = new Date();
      console.log('[calendario.ts] Role recibido:', role);
      console.log('[calendario.ts] Fecha hoy:', hoy);
      
      const addDays = (days: number, hour: number, minute: number) => {
        const d = new Date(hoy);
        d.setDate(d.getDate() + days);
        d.setHours(hour, minute, 0, 0);
        return d;
      };

      let citas: Cita[] = [];

      if (role === 'entrenador') {
        citas = [
          // Hoy
          {
            id: 'e1',
            titulo: 'Sesión PT con Juan Pérez',
            tipo: 'sesion-1-1',
            estado: 'confirmada',
            fechaInicio: addDays(0, 17, 0),
            fechaFin: addDays(0, 18, 0),
            clienteId: '1',
            clienteNombre: 'Juan Pérez',
            notas: 'Enfoque en piernas',
          },
          {
            id: 'e2',
            titulo: 'Videollamada con María García',
            tipo: 'videollamada',
            estado: 'confirmada',
            fechaInicio: addDays(0, 19, 0),
            fechaFin: addDays(0, 19, 45),
            clienteId: '2',
            clienteNombre: 'María García',
            notas: 'Consulta nutricional',
          },
          // Mañana
          {
            id: 'e3',
            titulo: 'Sesión PT con Carlos Ruiz',
            tipo: 'sesion-1-1',
            estado: 'confirmada',
            fechaInicio: addDays(1, 10, 0),
            fechaFin: addDays(1, 11, 0),
            clienteId: '3',
            clienteNombre: 'Carlos Ruiz',
            notas: 'Entrenamiento de fuerza',
          },
          {
            id: 'e4',
            titulo: 'Evaluación con Ana Martínez',
            tipo: 'evaluacion',
            estado: 'confirmada',
            fechaInicio: addDays(1, 12, 0),
            fechaFin: addDays(1, 13, 0),
            clienteId: '4',
            clienteNombre: 'Ana Martínez',
            notas: 'Evaluación de progreso',
          },
          {
            id: 'e5',
            titulo: 'Sesión PT con Pedro Sánchez',
            tipo: 'sesion-1-1',
            estado: 'confirmada',
            fechaInicio: addDays(1, 16, 0),
            fechaFin: addDays(1, 17, 0),
            clienteId: '7',
            clienteNombre: 'Pedro Sánchez',
            notas: 'Recuperación activa',
          },
          // Pasado mañana
          {
            id: 'e6',
            titulo: 'Videollamada con Laura Martín',
            tipo: 'videollamada',
            estado: 'confirmada',
            fechaInicio: addDays(2, 9, 0),
            fechaFin: addDays(2, 9, 30),
            clienteId: '5',
            clienteNombre: 'Laura Martín',
            notas: 'Plan nutricional',
          },
          {
            id: 'e7',
            titulo: 'Sesión PT con Miguel González',
            tipo: 'sesion-1-1',
            estado: 'confirmada',
            fechaInicio: addDays(2, 11, 0),
            fechaFin: addDays(2, 12, 0),
            clienteId: '6',
            clienteNombre: 'Miguel González',
            notas: 'Cardio intenso',
          },
          {
            id: 'e8',
            titulo: 'Evaluación con Sofia López',
            tipo: 'evaluacion',
            estado: 'confirmada',
            fechaInicio: addDays(2, 15, 0),
            fechaFin: addDays(2, 16, 0),
            clienteId: '8',
            clienteNombre: 'Sofia López',
            notas: 'Evaluación mensual',
          },
          // +3 días
          {
            id: 'e9',
            titulo: 'Sesión PT con Roberto Martín',
            tipo: 'sesion-1-1',
            estado: 'confirmada',
            fechaInicio: addDays(3, 10, 0),
            fechaFin: addDays(3, 11, 0),
            clienteId: '9',
            clienteNombre: 'Roberto Martín',
            notas: 'Entrenamiento funcional',
          },
          {
            id: 'e10',
            titulo: 'Videollamada con Carmen Ruiz',
            tipo: 'videollamada',
            estado: 'confirmada',
            fechaInicio: addDays(3, 12, 0),
            fechaFin: addDays(3, 12, 30),
            clienteId: '10',
            clienteNombre: 'Carmen Ruiz',
            notas: 'Revisión objetivos',
          },
          // +4 días
          {
            id: 'e11',
            titulo: 'Sesión PT con Elena García',
            tipo: 'sesion-1-1',
            estado: 'confirmada',
            fechaInicio: addDays(4, 9, 0),
            fechaFin: addDays(4, 10, 0),
            clienteId: '11',
            clienteNombre: 'Elena García',
            notas: 'Entrenamiento de resistencia',
          },
          {
            id: 'e12',
            titulo: 'Evaluación con Jorge Ramírez',
            tipo: 'evaluacion',
            estado: 'confirmada',
            fechaInicio: addDays(4, 13, 0),
            fechaFin: addDays(4, 14, 0),
            clienteId: '12',
            clienteNombre: 'Jorge Ramírez',
            notas: 'Seguimiento de progreso',
          },
          // +5 días
          {
            id: 'e13',
            titulo: 'Sesión PT con Paula Jiménez',
            tipo: 'sesion-1-1',
            estado: 'confirmada',
            fechaInicio: addDays(5, 11, 0),
            fechaFin: addDays(5, 12, 0),
            clienteId: '13',
            clienteNombre: 'Paula Jiménez',
            notas: 'Tonificación muscular',
          },
          {
            id: 'e14',
            titulo: 'Videollamada con Alejandro Moreno',
            tipo: 'videollamada',
            estado: 'confirmada',
            fechaInicio: addDays(5, 16, 0),
            fechaFin: addDays(5, 16, 45),
            clienteId: '14',
            clienteNombre: 'Alejandro Moreno',
            notas: 'Consulta nutricional',
          },
          // +6 días
          {
            id: 'e15',
            titulo: 'Sesión PT con Isabel Castro',
            tipo: 'sesion-1-1',
            estado: 'confirmada',
            fechaInicio: addDays(6, 10, 0),
            fechaFin: addDays(6, 11, 0),
            clienteId: '15',
            clienteNombre: 'Isabel Castro',
            notas: 'Entrenamiento HIIT',
          },
          {
            id: 'e16',
            titulo: 'Sesión PT con Daniel Herrera',
            tipo: 'sesion-1-1',
            estado: 'confirmada',
            fechaInicio: addDays(6, 17, 0),
            fechaFin: addDays(6, 18, 0),
            clienteId: '16',
            clienteNombre: 'Daniel Herrera',
            notas: 'Fuerza y potencia',
          },
        ];
      } else {
        citas = [
          // Hoy
          {
            id: 'c1',
            titulo: 'Yoga Matutino',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(0, 8, 0),
            fechaFin: addDays(0, 9, 0),
            capacidadMaxima: 20,
            inscritos: 16,
            instructorNombre: 'María García',
          },
          {
            id: 'c2',
            titulo: 'Pilates',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(0, 9, 0),
            fechaFin: addDays(0, 10, 0),
            capacidadMaxima: 15,
            inscritos: 12,
            instructorNombre: 'Ana Martínez',
          },
          {
            id: 'c3',
            titulo: 'HIIT',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(0, 19, 0),
            fechaFin: addDays(0, 20, 0),
            capacidadMaxima: 25,
            inscritos: 22,
            instructorNombre: 'Carlos Ruiz',
          },
          // Mañana
          {
            id: 'c4',
            titulo: 'Spinning',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(1, 8, 0),
            fechaFin: addDays(1, 9, 0),
            capacidadMaxima: 30,
            inscritos: 28,
            instructorNombre: 'Laura Gómez',
          },
          {
            id: 'c5',
            titulo: 'Sesión Fisioterapia',
            tipo: 'fisioterapia',
            estado: 'confirmada',
            fechaInicio: addDays(1, 11, 0),
            fechaFin: addDays(1, 12, 0),
            clienteId: '1',
            clienteNombre: 'Juan Pérez',
          },
          {
            id: 'c6',
            titulo: 'Zumba',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(1, 18, 0),
            fechaFin: addDays(1, 19, 0),
            capacidadMaxima: 30,
            inscritos: 25,
            instructorNombre: 'Patricia López',
          },
          // Pasado mañana
          {
            id: 'c7',
            titulo: 'Body Pump',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(2, 8, 0),
            fechaFin: addDays(2, 9, 0),
            capacidadMaxima: 25,
            inscritos: 20,
            instructorNombre: 'Pedro Sánchez',
          },
          {
            id: 'c8',
            titulo: 'Sesión Fisioterapia',
            tipo: 'fisioterapia',
            estado: 'confirmada',
            fechaInicio: addDays(2, 14, 0),
            fechaFin: addDays(2, 15, 0),
            clienteId: '2',
            clienteNombre: 'María García',
          },
          {
            id: 'c9',
            titulo: 'Boxeo',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(2, 18, 30),
            fechaFin: addDays(2, 19, 30),
            capacidadMaxima: 20,
            inscritos: 18,
            instructorNombre: 'Carlos Martínez',
          },
          // +3 días
          {
            id: 'c10',
            titulo: 'Funcional',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(3, 9, 0),
            fechaFin: addDays(3, 10, 0),
            capacidadMaxima: 20,
            inscritos: 16,
            instructorNombre: 'Ana González',
          },
          {
            id: 'c11',
            titulo: 'Aquagym',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(3, 19, 0),
            fechaFin: addDays(3, 20, 0),
            capacidadMaxima: 20,
            inscritos: 15,
            instructorNombre: 'Laura Fernández',
          },
          // +4 días
          {
            id: 'c12',
            titulo: 'Stretching',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(4, 8, 0),
            fechaFin: addDays(4, 9, 0),
            capacidadMaxima: 18,
            inscritos: 14,
            instructorNombre: 'Miguel Torres',
          },
          {
            id: 'c13',
            titulo: 'Sesión Fisioterapia',
            tipo: 'fisioterapia',
            estado: 'confirmada',
            fechaInicio: addDays(4, 11, 0),
            fechaFin: addDays(4, 12, 0),
            clienteId: '3',
            clienteNombre: 'Roberto Martín',
          },
          {
            id: 'c14',
            titulo: 'RPM',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(4, 19, 0),
            fechaFin: addDays(4, 20, 0),
            capacidadMaxima: 30,
            inscritos: 27,
            instructorNombre: 'Sofia Ramírez',
          },
          // +5 días
          {
            id: 'c15',
            titulo: 'TRX',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(5, 10, 0),
            fechaFin: addDays(5, 11, 0),
            capacidadMaxima: 12,
            inscritos: 10,
            instructorNombre: 'Javier Morales',
          },
          {
            id: 'c16',
            titulo: 'Yoga Restaurativo',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(5, 18, 0),
            fechaFin: addDays(5, 19, 0),
            capacidadMaxima: 15,
            inscritos: 12,
            instructorNombre: 'Carmen Vega',
          },
          // +6 días
          {
            id: 'c17',
            titulo: 'Core & Abdominales',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(6, 9, 0),
            fechaFin: addDays(6, 10, 0),
            capacidadMaxima: 25,
            inscritos: 22,
            instructorNombre: 'David Pérez',
          },
          {
            id: 'c18',
            titulo: 'Bailes Latinos',
            tipo: 'clase-colectiva',
            estado: 'confirmada',
            fechaInicio: addDays(6, 20, 0),
            fechaFin: addDays(6, 21, 0),
            capacidadMaxima: 35,
            inscritos: 30,
            instructorNombre: 'Patricia Serrano',
          },
        ];
      }
      
      console.log('[calendario.ts] Citas generadas:', citas);
      resolve(citas);
    }, 300);
  });
};

export const crearCita = async (cita: Omit<Cita, 'id'>): Promise<Cita> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const nuevaCita: Cita = {
        ...cita,
        id: Date.now().toString(),
      };
      resolve(nuevaCita);
    }, 300);
  });
};

export const actualizarCita = async (id: string, cita: Partial<Cita>): Promise<Cita> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const citaActualizada: Cita = {
        id,
        titulo: 'Cita actualizada',
        tipo: 'sesion-1-1',
        estado: 'confirmada',
        fechaInicio: new Date(),
        fechaFin: new Date(),
        ...cita,
      };
      resolve(citaActualizada);
    }, 300);
  });
};

export const eliminarCita = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

