import React, { useState, useEffect } from 'react';
import { Card, Table, Button } from '../../../components/componentsreutilizables';
import {
  getListaEspera,
  getClase,
  getSocio,
  removeFromListaEspera,
  confirmarReservaDesdeLista,
} from '../api';
import { ListaEspera as ListaEsperaType, Clase, Socio } from '../types';
import { Clock, Users, X, CheckCircle, AlertCircle } from 'lucide-react';

export const ListaEspera: React.FC<{ claseId?: string }> = ({ claseId }) => {
  const [listaEspera, setListaEspera] = useState<ListaEsperaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [clase, setClase] = useState<Clase | null>(null);
  const [socios, setSocios] = useState<Record<string, Socio>>({});

  useEffect(() => {
    cargarDatos();
  }, [claseId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const lista = await getListaEspera(claseId ? { claseId } : undefined);
      setListaEspera(lista);

      // Cargar información adicional
      const clasesUnicas = [...new Set(lista.map(item => item.claseId))];
      const sociosUnicos = [...new Set(lista.map(item => item.socioId))];

      if (clasesUnicas.length > 0 && !claseId) {
        // Si no hay claseId específica, cargar la primera
        const claseData = await getClase(clasesUnicas[0]);
        if (claseData) setClase(claseData);
      } else if (claseId) {
        const claseData = await getClase(claseId);
        if (claseData) setClase(claseData);
      }

      // Cargar socios
      const sociosData: Record<string, Socio> = {};
      for (const socioId of sociosUnicos) {
        const socio = await getSocio(socioId);
        if (socio) sociosData[socioId] = socio;
      }
      setSocios(sociosData);
    } catch (error) {
      console.error('Error al cargar lista de espera:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarReserva = async (listaEsperaId: string) => {
    try {
      await confirmarReservaDesdeLista(listaEsperaId);
      cargarDatos();
    } catch (error) {
      console.error('Error al confirmar reserva:', error);
    }
  };

  const handleRemover = async (id: string) => {
    try {
      await removeFromListaEspera(id);
      cargarDatos();
    } catch (error) {
      console.error('Error al remover de lista de espera:', error);
    }
  };

  const getPrioridadBadge = (prioridad: string) => {
    const colors = {
      normal: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
      premium: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      alta: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    return colors[prioridad as keyof typeof colors] || colors.normal;
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      activa: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      notificada: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      confirmada: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      expirada: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[estado as keyof typeof colors] || colors.activa;
  };

  const columns = [
    {
      key: 'posicion',
      label: 'Posición',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <span className="font-semibold">#{value}</span>
        </div>
      ),
    },
    {
      key: 'socioId',
      label: 'Socio',
      render: (_: any, row: ListaEsperaType) => {
        const socio = socios[row.socioId];
        return (
          <div>
            <div className="font-medium">{socio?.nombre || 'N/A'}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {socio?.email || ''}
            </div>
          </div>
        );
      },
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      render: (value: string) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getPrioridadBadge(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'fechaIngreso',
      label: 'Fecha Ingreso',
      render: (value: Date) => new Date(value).toLocaleString('es-ES'),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: string) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadge(value)}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, row: ListaEsperaType) => (
        <div className="flex gap-2">
          {row.estado === 'activa' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleConfirmarReserva(row.id)}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Confirmar
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleRemover(row.id)}
          >
            <X className="w-4 h-4 mr-1" />
            Remover
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {clase && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center ring-1 ring-blue-200/70">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {clase.nombre}
              </h3>
              <p className="text-gray-600">
                {clase.fecha.toLocaleDateString('es-ES')} - {clase.horaInicio} a {clase.horaFin}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {clase.reservasConfirmadas} / {clase.capacidadMaxima}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{listaEspera.length} en lista de espera</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Lista de Espera
          </h3>
        </div>

        {listaEspera.length === 0 && !loading ? (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No hay personas en lista de espera
            </p>
          </div>
        ) : (
          <Table
            data={listaEspera}
            columns={columns}
            loading={loading}
            emptyMessage="No hay registros en lista de espera"
          />
        )}
      </Card>
    </div>
  );
};

