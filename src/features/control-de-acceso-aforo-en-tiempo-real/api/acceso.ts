export interface AccesoRegistro {
  id?: string;
  clienteId: string;
  tarjetaId?: string;
  tipoCredencial: 'RFID' | 'NFC' | 'codigo_barras' | 'QR' | 'manual';
  tipoMovimiento: 'entrada' | 'salida';
  estadoMembresia: 'activa' | 'vencida' | 'pausada';
  resultado: 'permitido' | 'denegado' | 'aforo_completo';
  mensaje?: string;
  torniqueteId?: string;
  fechaHora: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EstadoAcceso {
  torniquetesActivos: number;
  torniquetesTotal: number;
  modoEmergencia: boolean;
  modoMantenimiento: boolean;
  lectoresActivos: number;
  lectoresTotal: number;
}

export interface ValidacionCredencial {
  valida: boolean;
  clienteId?: string;
  nombre?: string;
  membresia?: {
    estado: 'activa' | 'vencida' | 'pausada';
    fechaVencimiento?: string;
    tipo?: string;
  };
  mensaje?: string;
}

export async function obtenerEstadoAcceso(): Promise<EstadoAcceso> {
  const res = await fetch('/api/operaciones/acceso');
  if (!res.ok) {
    return {
      torniquetesActivos: 0,
      torniquetesTotal: 0,
      modoEmergencia: false,
      modoMantenimiento: false,
      lectoresActivos: 0,
      lectoresTotal: 0,
    };
  }
  return res.json();
}

export async function registrarEntradaSalida(
  registro: Omit<AccesoRegistro, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AccesoRegistro | null> {
  const res = await fetch('/api/operaciones/acceso', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registro),
  });
  if (!res.ok) return null;
  return res.json();
}

export async function validarCredencial(
  credencial: string,
  tipo: 'RFID' | 'NFC' | 'codigo_barras' | 'QR'
): Promise<ValidacionCredencial> {
  const res = await fetch('/api/operaciones/acceso/validar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credencial, tipo }),
  });
  if (!res.ok) {
    return { valida: false, mensaje: 'Error al validar credencial' };
  }
  return res.json();
}

export async function obtenerHistorialAcceso(
  fechaInicio?: string,
  fechaFin?: string,
  clienteId?: string
): Promise<AccesoRegistro[]> {
  const params = new URLSearchParams();
  if (fechaInicio) params.append('fechaInicio', fechaInicio);
  if (fechaFin) params.append('fechaFin', fechaFin);
  if (clienteId) params.append('clienteId', clienteId);
  
  const res = await fetch(`/api/operaciones/acceso/historial?${params.toString()}`);
  if (!res.ok) return [];
  return res.json();
}

export async function activarModoEmergencia(): Promise<boolean> {
  const res = await fetch('/api/operaciones/acceso/emergencia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activar: true }),
  });
  return res.ok;
}

export async function desactivarModoEmergencia(): Promise<boolean> {
  const res = await fetch('/api/operaciones/acceso/emergencia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activar: false }),
  });
  return res.ok;
}

export async function cambiarEstadoTorniquete(
  torniqueteId: string,
  estado: 'activo' | 'inactivo' | 'mantenimiento'
): Promise<boolean> {
  const res = await fetch(`/api/operaciones/acceso/torniquetes/${torniqueteId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  });
  return res.ok;
}

