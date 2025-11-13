import type { NotaRecordatorio } from '../types';

// Mock data - En producción, estas serían llamadas a la API real
const notasRecordatoriosStorage: Record<string, NotaRecordatorio[]> = {};

export const getNotasRecordatorios = async (dietaId: string): Promise<NotaRecordatorio[]> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: GET /api/dietas/${dietaId}/notas-recordatorios
  return notasRecordatoriosStorage[dietaId] || [];
};

export const guardarNotaRecordatorio = async (nota: NotaRecordatorio): Promise<NotaRecordatorio> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: POST /api/dietas/${nota.dietaId}/notas-recordatorios o PUT si existe
  if (!notasRecordatoriosStorage[nota.dietaId]) {
    notasRecordatoriosStorage[nota.dietaId] = [];
  }
  
  const index = notasRecordatoriosStorage[nota.dietaId].findIndex(n => n.id === nota.id);
  if (index >= 0) {
    notasRecordatoriosStorage[nota.dietaId][index] = nota;
  } else {
    notasRecordatoriosStorage[nota.dietaId].push(nota);
  }
  
  return nota;
};

export const eliminarNotaRecordatorio = async (dietaId: string, notaId: string): Promise<void> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: DELETE /api/dietas/${dietaId}/notas-recordatorios/${notaId}
  if (notasRecordatoriosStorage[dietaId]) {
    notasRecordatoriosStorage[dietaId] = notasRecordatoriosStorage[dietaId].filter(n => n.id !== notaId);
  }
};

export const completarNotaRecordatorio = async (dietaId: string, notaId: string): Promise<NotaRecordatorio> => {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción: PATCH /api/dietas/${dietaId}/notas-recordatorios/${notaId}/completar
  if (!notasRecordatoriosStorage[dietaId]) {
    throw new Error('Nota no encontrada');
  }
  
  const nota = notasRecordatoriosStorage[dietaId].find(n => n.id === notaId);
  if (!nota) {
    throw new Error('Nota no encontrada');
  }
  
  const notaActualizada: NotaRecordatorio = {
    ...nota,
    completado: !nota.completado,
    fechaCompletado: !nota.completado ? new Date().toISOString() : undefined,
    fechaActualizacion: new Date().toISOString(),
  };
  
  const index = notasRecordatoriosStorage[dietaId].findIndex(n => n.id === notaId);
  notasRecordatoriosStorage[dietaId][index] = notaActualizada;
  
  return notaActualizada;
};

