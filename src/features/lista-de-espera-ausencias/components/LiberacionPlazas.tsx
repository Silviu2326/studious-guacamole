import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { getAusencias, liberarPlaza, enviarNotificacionDisponibilidad } from '../api';
import { Ausencia } from '../types';
import { RefreshCw, Bell, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export const LiberacionPlazas: React.FC = () => {
  const [plazasLiberadas, setPlazasLiberadas] = useState<Ausencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [procesando, setProcesando] = useState<string | null>(null);

  useEffect(() => {
    cargarPlazasLiberadas();
  }, []);

  const cargarPlazasLiberadas = async () => {
    try {
      setLoading(true);
      const ausencias = await getAusencias();
      // Filtrar solo las ausencias que liberan plaza y no están notificadas
      const noNotificadas = ausencias.filter(a => !a.notificadoListaEspera);
      setPlazasLiberadas(noNotificadas);
    } catch (error) {
      console.error('Error al cargar plazas liberadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLiberarYNotificar = async (ausencia: Ausencia) => {
    try {
      setProcesando(ausencia.id);
      
      // Liberar plaza
      await liberarPlaza(ausencia.reservaId);
      
      // Notificar a lista de espera (simulado)
      // En producción, aquí se buscaría la primera persona en lista de espera
      await enviarNotificacionDisponibilidad(`lista-espera-${ausencia.claseId}`);
      
      // Actualizar estado de la ausencia
      ausencia.notificadoListaEspera = true;
      
      cargarPlazasLiberadas();
    } catch (error) {
      console.error('Error al liberar y notificar:', error);
    } finally {
      setProcesando(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Liberación Automática de Plazas
          </h3>
          <Button
            variant="secondary"
            onClick={cargarPlazasLiberadas}
            loading={loading}
          >
            <RefreshCw size={20} className="mr-2" />
            Actualizar
          </Button>
        </div>

        <p className="text-gray-600 mb-6">
          Cuando un socio cancela o no asiste, se libera automáticamente su plaza y se notifica 
          al primer socio en lista de espera.
        </p>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Cargando...</p>
          </div>
        ) : plazasLiberadas.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <p className="text-gray-600">
              No hay plazas pendientes de liberar
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {plazasLiberadas.map((ausencia) => (
              <div
                key={ausencia.id}
                className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Clase {ausencia.claseId}
                    </h4>
                    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      {ausencia.tipo.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Socio {ausencia.socioId} - {new Date(ausencia.fechaAusencia).toLocaleString('es-ES')}
                  </p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => handleLiberarYNotificar(ausencia)}
                  loading={procesando === ausencia.id}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Liberar y Notificar
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

