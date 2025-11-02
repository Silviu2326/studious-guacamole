import type { UserRole } from '../../../types/auth';

interface Evento {
  id: string;
  titulo: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  tipo: 'sesion' | 'clase' | 'evaluacion' | 'videollamada';
  capacidad?: number;
  ocupacion?: number;
}

export async function getCalendario(role: UserRole): Promise<Evento[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock: datos diferenciados por rol
  const hoy = new Date();
  const iso = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const addDays = (days: number) => new Date(hoy.getTime() + days * 24 * 60 * 60 * 1000);
  
  if (role === 'entrenador') {
    const eventos = [
      // Hoy
      { id: 'e1', titulo: 'Sesión 1 a 1: Juan Pérez', fecha: iso(hoy), horaInicio: '17:00', horaFin: '18:00', tipo: 'sesion' },
      { id: 'e2', titulo: 'Videollamada: María García', fecha: iso(hoy), horaInicio: '19:00', horaFin: '19:45', tipo: 'videollamada' },
      // Mañana
      { id: 'e3', titulo: 'Sesión 1 a 1: Carlos Ruiz', fecha: iso(addDays(1)), horaInicio: '10:00', horaFin: '11:00', tipo: 'sesion' },
      { id: 'e4', titulo: 'Evaluación: Ana Martínez', fecha: iso(addDays(1)), horaInicio: '12:00', horaFin: '13:00', tipo: 'evaluacion' },
      { id: 'e5', titulo: 'Sesión 1 a 1: Pedro Sánchez', fecha: iso(addDays(1)), horaInicio: '16:00', horaFin: '17:00', tipo: 'sesion' },
      // Pasado mañana
      { id: 'e6', titulo: 'Videollamada: Laura Martín', fecha: iso(addDays(2)), horaInicio: '09:00', horaFin: '09:30', tipo: 'videollamada' },
      { id: 'e7', titulo: 'Sesión 1 a 1: Miguel González', fecha: iso(addDays(2)), horaInicio: '11:00', horaFin: '12:00', tipo: 'sesion' },
      { id: 'e8', titulo: 'Evaluación: Sofia López', fecha: iso(addDays(2)), horaInicio: '15:00', horaFin: '16:00', tipo: 'evaluacion' },
      { id: 'e9', titulo: 'Sesión 1 a 1: Roberto Martín', fecha: iso(addDays(2)), horaInicio: '18:00', horaFin: '19:00', tipo: 'sesion' },
      // +3 días
      { id: 'e10', titulo: 'Sesión 1 a 1: Carmen Ruiz', fecha: iso(addDays(3)), horaInicio: '10:00', horaFin: '11:00', tipo: 'sesion' },
      { id: 'e11', titulo: 'Videollamada: David Torres', fecha: iso(addDays(3)), horaInicio: '12:00', horaFin: '12:45', tipo: 'videollamada' },
      // +4 días
      { id: 'e12', titulo: 'Sesión 1 a 1: Elena García', fecha: iso(addDays(4)), horaInicio: '16:00', horaFin: '17:00', tipo: 'sesion' },
      { id: 'e13', titulo: 'Evaluación: Jorge Ramírez', fecha: iso(addDays(4)), horaInicio: '18:00', horaFin: '19:00', tipo: 'evaluacion' },
      // +5 días
      { id: 'e14', titulo: 'Sesión 1 a 1: Paula Jiménez', fecha: iso(addDays(5)), horaInicio: '11:00', horaFin: '12:00', tipo: 'sesion' },
      { id: 'e15', titulo: 'Videollamada: Alejandro Moreno', fecha: iso(addDays(5)), horaInicio: '14:00', horaFin: '14:30', tipo: 'videollamada' },
      // +6 días
      { id: 'e16', titulo: 'Sesión 1 a 1: Isabel Castro', fecha: iso(addDays(6)), horaInicio: '15:00', horaFin: '16:00', tipo: 'sesion' },
      { id: 'e17', titulo: 'Evaluación: Daniel Herrera', fecha: iso(addDays(6)), horaInicio: '17:00', horaFin: '18:00', tipo: 'evaluacion' },
      // +7 días
      { id: 'e18', titulo: 'Sesión 1 a 1: Patricia Serrano', fecha: iso(addDays(7)), horaInicio: '10:00', horaFin: '11:00', tipo: 'sesion' },
      { id: 'e19', titulo: 'Videollamada: Javier Morales', fecha: iso(addDays(7)), horaInicio: '19:00', horaFin: '19:45', tipo: 'videollamada' },
    ];
  }
  
  return [
    // Hoy
    { id: 'c1', titulo: 'CrossFit Intensivo', fecha: iso(hoy), horaInicio: '18:00', horaFin: '19:00', tipo: 'clase', capacidad: 20, ocupacion: 18 },
    { id: 'c2', titulo: 'Zumba', fecha: iso(hoy), horaInicio: '20:00', horaFin: '21:00', tipo: 'clase', capacidad: 30, ocupacion: 25 },
    // Mañana
    { id: 'c3', titulo: 'Yoga Matutino', fecha: iso(addDays(1)), horaInicio: '07:00', horaFin: '08:00', tipo: 'clase', capacidad: 20, ocupacion: 16 },
    { id: 'c4', titulo: 'Pilates', fecha: iso(addDays(1)), horaInicio: '09:00', horaFin: '10:00', tipo: 'clase', capacidad: 15, ocupacion: 12 },
    { id: 'c5', titulo: 'HIIT', fecha: iso(addDays(1)), horaInicio: '19:00', horaFin: '20:00', tipo: 'clase', capacidad: 25, ocupacion: 22 },
    // Pasado mañana
    { id: 'c6', titulo: 'Spinning', fecha: iso(addDays(2)), horaInicio: '08:00', horaFin: '09:00', tipo: 'clase', capacidad: 30, ocupacion: 28 },
    { id: 'c7', titulo: 'Fisioterapia', fecha: iso(addDays(2)), horaInicio: '11:00', horaFin: '12:00', tipo: 'evaluacion', capacidad: 1, ocupacion: 1 },
    { id: 'c8', titulo: 'Body Pump', fecha: iso(addDays(2)), horaInicio: '18:30', horaFin: '19:30', tipo: 'clase', capacidad: 25, ocupacion: 20 },
    { id: 'c9', titulo: 'Fisioterapia', fecha: iso(addDays(2)), horaInicio: '20:00', horaFin: '21:00', tipo: 'evaluacion', capacidad: 1, ocupacion: 0 },
    // +3 días
    { id: 'c10', titulo: 'RPM', fecha: iso(addDays(3)), horaInicio: '07:30', horaFin: '08:30', tipo: 'clase', capacidad: 30, ocupacion: 26 },
    { id: 'c11', titulo: 'Funcional', fecha: iso(addDays(3)), horaInicio: '19:00', horaFin: '20:00', tipo: 'clase', capacidad: 20, ocupacion: 18 },
    { id: 'c12', titulo: 'Fisioterapia', fecha: iso(addDays(3)), horaInicio: '20:00', horaFin: '21:00', tipo: 'evaluacion', capacidad: 1, ocupacion: 1 },
    // +4 días
    { id: 'c13', titulo: 'Aquagym', fecha: iso(addDays(4)), horaInicio: '10:00', horaFin: '11:00', tipo: 'clase', capacidad: 20, ocupacion: 15 },
    { id: 'c14', titulo: 'Stretching', fecha: iso(addDays(4)), horaInicio: '18:00', horaFin: '19:00', tipo: 'clase', capacidad: 18, ocupacion: 14 },
    // +5 días
    { id: 'c15', titulo: 'Boxeo', fecha: iso(addDays(5)), horaInicio: '17:00', horaFin: '18:00', tipo: 'clase', capacidad: 20, ocupacion: 19 },
    { id: 'c16', titulo: 'Yoga Restaurativo', fecha: iso(addDays(5)), horaInicio: '19:00', horaFin: '20:00', tipo: 'clase', capacidad: 15, ocupacion: 12 },
    { id: 'c17', titulo: 'Fisioterapia', fecha: iso(addDays(5)), horaInicio: '20:00', horaFin: '21:00', tipo: 'evaluacion', capacidad: 1, ocupacion: 0 },
    // +6 días
    { id: 'c18', titulo: 'Core & Abdominales', fecha: iso(addDays(6)), horaInicio: '09:00', horaFin: '10:00', tipo: 'clase', capacidad: 25, ocupacion: 22 },
    { id: 'c19', titulo: 'Bailes Latinos', fecha: iso(addDays(6)), horaInicio: '20:00', horaFin: '21:00', tipo: 'clase', capacidad: 35, ocupacion: 30 },
    // +7 días
    { id: 'c20', titulo: 'TRX', fecha: iso(addDays(7)), horaInicio: '08:00', horaFin: '09:00', tipo: 'clase', capacidad: 12, ocupacion: 10 },
    { id: 'c21', titulo: 'Fisioterapia', fecha: iso(addDays(7)), horaInicio: '11:00', horaFin: '12:00', tipo: 'evaluacion', capacidad: 1, ocupacion: 1 },
  ];
}