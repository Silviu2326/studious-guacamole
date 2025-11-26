import { Cita } from '../types';
import { getCitas } from './calendario';
import { getHorarioTrabajoActual } from './horariosTrabajo';

export interface EstadisticaHorario {
  hora: number; // 0-23
  minuto: number; // 0 o 30
  horario: string; // "09:00", "09:30", etc.
  cantidadSesiones: number;
  porcentajeOcupacion: number;
  demanda: 'alta' | 'media' | 'baja';
}

export interface MapaCalorSemanal {
  diaSemana: number; // 0-6 (Domingo-Sábado)
  nombreDia: string;
  horarios: {
    horario: string;
    hora: number;
    minuto: number;
    cantidadSesiones: number;
    intensidad: number; // 0-100
  }[];
}

export interface SugerenciaHorario {
  horario: string;
  hora: number;
  minuto: number;
  diaSemana: number;
  nombreDia: string;
  razon: string;
  demandaEsperada: 'alta' | 'media';
  prioridad: 'alta' | 'media' | 'baja';
}

export interface AnalisisHorarios {
  mapaCalorSemanal: MapaCalorSemanal[];
  estadisticasPorFranja: EstadisticaHorario[];
  horariosMayorDemanda: EstadisticaHorario[];
  sugerenciasApertura: SugerenciaHorario[];
  tendenciaHorarios: {
    horario: string;
    tendencia: 'subiendo' | 'bajando' | 'estable';
    cambioPorcentual: number;
  }[];
}

/**
 * Obtiene análisis completo de horarios demandados
 */
export const getAnalisisHorarios = async (
  fechaInicio: Date,
  fechaFin: Date,
  userId?: string
): Promise<AnalisisHorarios> => {
  return new Promise(async (resolve) => {
    try {
      const citas = await getCitas(fechaInicio, fechaFin, 'entrenador');
      const horarioTrabajo = await getHorarioTrabajoActual(userId);
      
      // Generar todos los slots posibles (6:00 a 22:00, cada 30 minutos)
      const slots: { hora: number; minuto: number }[] = [];
      for (let hora = 6; hora < 22; hora++) {
        slots.push({ hora, minuto: 0 });
        slots.push({ hora, minuto: 30 });
      }
      
      // Calcular estadísticas por franja horaria
      const estadisticasMap = new Map<string, number>();
      citas.forEach(cita => {
        const fechaInicioCita = new Date(cita.fechaInicio);
        const hora = fechaInicioCita.getHours();
        const minuto = fechaInicioCita.getMinutes() >= 30 ? 30 : 0;
        const clave = `${hora}:${minuto}`;
        const count = estadisticasMap.get(clave) || 0;
        estadisticasMap.set(clave, count + 1);
      });
      
      const maxSesiones = Math.max(...Array.from(estadisticasMap.values()), 1);
      
      const estadisticasPorFranja: EstadisticaHorario[] = slots.map(slot => {
        const clave = `${slot.hora}:${slot.minuto}`;
        const cantidad = estadisticasMap.get(clave) || 0;
        const porcentaje = maxSesiones > 0 ? Math.round((cantidad / maxSesiones) * 100) : 0;
        
        let demanda: 'alta' | 'media' | 'baja';
        if (porcentaje >= 70) {
          demanda = 'alta';
        } else if (porcentaje >= 30) {
          demanda = 'media';
        } else {
          demanda = 'baja';
        }
        
        return {
          hora: slot.hora,
          minuto: slot.minuto,
          horario: `${slot.hora.toString().padStart(2, '0')}:${slot.minuto.toString().padStart(2, '0')}`,
          cantidadSesiones: cantidad,
          porcentajeOcupacion: porcentaje,
          demanda,
        };
      });
      
      // Calcular horarios con mayor demanda (top 10)
      const horariosMayorDemanda = [...estadisticasPorFranja]
        .filter(e => e.cantidadSesiones > 0)
        .sort((a, b) => b.cantidadSesiones - a.cantidadSesiones)
        .slice(0, 10);
      
      // Calcular mapa de calor semanal
      const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const mapaCalorSemanal: MapaCalorSemanal[] = [];
      
      for (let dia = 0; dia < 7; dia++) {
        const sesionesDia = citas.filter(cita => {
          const fechaInicioCita = new Date(cita.fechaInicio);
          return fechaInicioCita.getDay() === dia;
        });
        
        const horariosDia = slots.map(slot => {
          const cantidad = sesionesDia.filter(cita => {
            const fechaInicioCita = new Date(cita.fechaInicio);
            const horaCita = fechaInicioCita.getHours();
            const minutoCita = fechaInicioCita.getMinutes() >= 30 ? 30 : 0;
            return horaCita === slot.hora && minutoCita === slot.minuto;
          }).length;
          
          const intensidad = maxSesiones > 0 ? Math.round((cantidad / maxSesiones) * 100) : 0;
          
          return {
            horario: `${slot.hora.toString().padStart(2, '0')}:${slot.minuto.toString().padStart(2, '0')}`,
            hora: slot.hora,
            minuto: slot.minuto,
            cantidadSesiones: cantidad,
            intensidad,
          };
        });
        
        mapaCalorSemanal.push({
          diaSemana: dia,
          nombreDia: nombresDias[dia],
          horarios: horariosDia,
        });
      }
      
      // Calcular sugerencias de apertura de nuevos horarios
      const sugerencias: SugerenciaHorario[] = [];
      
      // Buscar horarios con alta demanda en días adyacentes
      mapaCalorSemanal.forEach(dia => {
        dia.horarios.forEach(horario => {
          if (horario.intensidad >= 70) {
            // Este horario tiene alta demanda, buscar días adyacentes con baja demanda
            const diaAnterior = (dia.diaSemana - 1 + 7) % 7;
            const diaSiguiente = (dia.diaSemana + 1) % 7;
            
            const diaAnteriorData = mapaCalorSemanal.find(d => d.diaSemana === diaAnterior);
            const diaSiguienteData = mapaCalorSemanal.find(d => d.diaSemana === diaSiguiente);
            
            const horarioAnterior = diaAnteriorData?.horarios.find(h => h.horario === horario.horario);
            const horarioSiguiente = diaSiguienteData?.horarios.find(h => h.horario === horario.horario);
            
            if (horarioAnterior && horarioAnterior.intensidad < 30) {
              sugerencias.push({
                horario: horario.horario,
                hora: horario.hora,
                minuto: horario.minuto,
                diaSemana: diaAnterior,
                nombreDia: nombresDias[diaAnterior],
                razon: `Alta demanda en ${dia.nombreDia} pero baja en ${nombresDias[diaAnterior]}`,
                demandaEsperada: 'alta',
                prioridad: 'alta',
              });
            }
            
            if (horarioSiguiente && horarioSiguiente.intensidad < 30) {
              sugerencias.push({
                horario: horario.horario,
                hora: horario.hora,
                minuto: horario.minuto,
                diaSemana: diaSiguiente,
                nombreDia: nombresDias[diaSiguiente],
                razon: `Alta demanda en ${dia.nombreDia} pero baja en ${nombresDias[diaSiguiente]}`,
                demandaEsperada: 'alta',
                prioridad: 'alta',
              });
            }
          }
        });
      });
      
      // Buscar horarios adyacentes a horarios de alta demanda
      mapaCalorSemanal.forEach(dia => {
        dia.horarios.forEach((horario, index) => {
          if (horario.intensidad >= 70 && index > 0 && index < dia.horarios.length - 1) {
            const horarioAnterior = dia.horarios[index - 1];
            const horarioSiguiente = dia.horarios[index + 1];
            
            if (horarioAnterior.intensidad < 30) {
              const existeSugerencia = sugerencias.some(s => 
                s.diaSemana === dia.diaSemana && 
                s.horario === horarioAnterior.horario
              );
              
              if (!existeSugerencia) {
                sugerencias.push({
                  horario: horarioAnterior.horario,
                  hora: horarioAnterior.hora,
                  minuto: horarioAnterior.minuto,
                  diaSemana: dia.diaSemana,
                  nombreDia: dia.nombreDia,
                  razon: `Horario adyacente a ${horario.horario} con alta demanda`,
                  demandaEsperada: 'media',
                  prioridad: 'media',
                });
              }
            }
            
            if (horarioSiguiente.intensidad < 30) {
              const existeSugerencia = sugerencias.some(s => 
                s.diaSemana === dia.diaSemana && 
                s.horario === horarioSiguiente.horario
              );
              
              if (!existeSugerencia) {
                sugerencias.push({
                  horario: horarioSiguiente.horario,
                  hora: horarioSiguiente.hora,
                  minuto: horarioSiguiente.minuto,
                  diaSemana: dia.diaSemana,
                  nombreDia: dia.nombreDia,
                  razon: `Horario adyacente a ${horario.horario} con alta demanda`,
                  demandaEsperada: 'media',
                  prioridad: 'media',
                });
              }
            }
          }
        });
      });
      
      // Eliminar duplicados y ordenar por prioridad
      const sugerenciasUnicas = sugerencias.filter((sugerencia, index, self) =>
        index === self.findIndex(s => 
          s.diaSemana === sugerencia.diaSemana && 
          s.horario === sugerencia.horario
        )
      ).sort((a, b) => {
        const prioridadOrder = { 'alta': 3, 'media': 2, 'baja': 1 };
        return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
      });
      
      // Calcular tendencias de horarios (comparar con período anterior)
      const diasDiferencia = Math.ceil((fechaFin.getTime() - fechaInicio.getTime()) / (1000 * 60 * 60 * 24));
      const fechaInicioAnterior = new Date(fechaInicio);
      fechaInicioAnterior.setDate(fechaInicioAnterior.getDate() - diasDiferencia);
      const fechaFinAnterior = new Date(fechaInicioAnterior);
      fechaFinAnterior.setDate(fechaFinAnterior.getDate() + diasDiferencia);
      
      const citasAnteriores = await getCitas(fechaInicioAnterior, fechaFinAnterior, 'entrenador');
      const estadisticasAnterioresMap = new Map<string, number>();
      
      citasAnteriores.forEach(cita => {
        const fechaInicioCita = new Date(cita.fechaInicio);
        const hora = fechaInicioCita.getHours();
        const minuto = fechaInicioCita.getMinutes() >= 30 ? 30 : 0;
        const clave = `${hora}:${minuto}`;
        const count = estadisticasAnterioresMap.get(clave) || 0;
        estadisticasAnterioresMap.set(clave, count + 1);
      });
      
      const tendenciaHorarios = estadisticasPorFranja
        .filter(e => e.cantidadSesiones > 0 || estadisticasAnterioresMap.get(`${e.hora}:${e.minuto}`) || 0 > 0)
        .map(estadistica => {
          const cantidadAnterior = estadisticasAnterioresMap.get(`${estadistica.hora}:${estadistica.minuto}`) || 0;
          const cambio = estadistica.cantidadSesiones - cantidadAnterior;
          const cambioPorcentual = cantidadAnterior > 0
            ? Math.round((cambio / cantidadAnterior) * 100)
            : estadistica.cantidadSesiones > 0 ? 100 : 0;
          
          let tendencia: 'subiendo' | 'bajando' | 'estable';
          if (cambioPorcentual > 10) {
            tendencia = 'subiendo';
          } else if (cambioPorcentual < -10) {
            tendencia = 'bajando';
          } else {
            tendencia = 'estable';
          }
          
          return {
            horario: estadistica.horario,
            tendencia,
            cambioPorcentual,
          };
        })
        .sort((a, b) => Math.abs(b.cambioPorcentual) - Math.abs(a.cambioPorcentual))
        .slice(0, 10);
      
      const analisis: AnalisisHorarios = {
        mapaCalorSemanal,
        estadisticasPorFranja,
        horariosMayorDemanda,
        sugerenciasApertura: sugerenciasUnicas.slice(0, 10),
        tendenciaHorarios,
      };
      
      setTimeout(() => {
        resolve(analisis);
      }, 300);
    } catch (error) {
      console.error('Error obteniendo análisis de horarios:', error);
      // Retornar análisis vacío en caso de error
      setTimeout(() => {
        resolve({
          mapaCalorSemanal: [],
          estadisticasPorFranja: [],
          horariosMayorDemanda: [],
          sugerenciasApertura: [],
          tendenciaHorarios: [],
        });
      }, 300);
    }
  });
};

/**
 * Obtiene análisis de horarios para el último mes
 */
export const getAnalisisHorariosUltimoMes = async (
  userId?: string
): Promise<AnalisisHorarios> => {
  const fechaActual = new Date();
  const fechaInicio = new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1);
  const fechaFin = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 0);
  fechaFin.setHours(23, 59, 59, 999);
  
  return getAnalisisHorarios(fechaInicio, fechaFin, userId);
};

/**
 * Obtiene análisis de horarios para las últimas 4 semanas
 */
export const getAnalisisHorariosUltimas4Semanas = async (
  userId?: string
): Promise<AnalisisHorarios> => {
  const fechaActual = new Date();
  const fechaFin = new Date(fechaActual);
  fechaFin.setHours(23, 59, 59, 999);
  
  const fechaInicio = new Date(fechaActual);
  fechaInicio.setDate(fechaInicio.getDate() - 28);
  fechaInicio.setHours(0, 0, 0, 0);
  
  return getAnalisisHorarios(fechaInicio, fechaFin, userId);
};


