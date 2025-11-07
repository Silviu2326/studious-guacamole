import { Disponibilidad } from '../types';

export const getDisponibilidad = async (
  fecha: Date,
  role: 'entrenador' | 'gimnasio'
): Promise<Disponibilidad[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const disponibilidad: Disponibilidad[] = [];
      
      if (role === 'entrenador') {
        // Para entrenadores: horarios para sesiones 1 a 1
        const horas = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
        horas.forEach((hora, index) => {
          disponibilidad.push({
            id: `disp-${index}`,
            fecha,
            horaInicio: hora,
            horaFin: `${String(parseInt(hora.split(':')[0]) + 1).padStart(2, '0')}:00`,
            disponible: index % 3 !== 0, // Simula algunos horarios ocupados
            tipo: 'sesion-1-1',
          });
        });
      } else {
        // Para gimnasios: horarios de clases grupales
        const clases = [
          { hora: '10:00', tipo: 'spinning' },
          { hora: '12:00', tipo: 'boxeo' },
          { hora: '14:00', tipo: 'hiit' },
          { hora: '16:00', tipo: 'fisio' },
        ];
        
        clases.forEach((clase, index) => {
          disponibilidad.push({
            id: `disp-${index}`,
            fecha,
            horaInicio: clase.hora,
            horaFin: `${String(parseInt(clase.hora.split(':')[0]) + 1).padStart(2, '0')}:00`,
            disponible: true,
            tipo: 'clase-grupal',
            claseId: `clase-${index}`,
            claseNombre: clase.tipo.charAt(0).toUpperCase() + clase.tipo.slice(1),
            capacidad: 20,
            ocupacion: index === 0 ? 18 : 10,
          });
        });
      }
      
      resolve(disponibilidad);
    }, 300);
  });
};

export const verificarDisponibilidad = async (
  fecha: Date,
  horaInicio: string,
  tipo: 'sesion-1-1' | 'clase-grupal',
  claseId?: string
): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simula verificación de disponibilidad
      resolve(true);
    }, 200);
  });
};
