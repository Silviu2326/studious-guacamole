import { Reserva } from '../types';

export const confirmarReserva = async (reservaId: string): Promise<Reserva> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: reservaId,
        clienteId: 'cliente1',
        clienteNombre: 'Juan Pérez',
        fecha: new Date(),
        horaInicio: '10:00',
        horaFin: '11:00',
        tipo: 'sesion-1-1',
        estado: 'confirmada',
        precio: 50,
        pagado: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }, 500);
  });
};

export const procesarPago = async (reservaId: string, metodoPago: string): Promise<{ exito: boolean; transaccionId?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        exito: true,
        transaccionId: `txn-${Date.now()}`,
      });
    }, 1000);
  });
};

export const enviarConfirmacion = async (reservaId: string, tipo: 'email' | 'sms'): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};
