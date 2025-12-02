import React, { useState, useEffect } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { NotaDeSesion } from '../types';
import { getNotasPorCliente, getClientesConNotas } from '../api/notasSesion';
import { useAuth } from '../../../context/AuthContext';
import { FileText, Calendar, Clock, User, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface NotasClienteProps {
  entrenadorId: string;
}

export const NotasCliente: React.FC<NotasClienteProps> = ({ entrenadorId }) => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState<Array<{ clienteId: string; clienteNombre: string; totalNotas: number }>>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('');
  const [notas, setNotas] = useState<NotaDeSesion[]>([]);
  const [loading, setLoading] = useState(false);
  const [notasExpandidas, setNotasExpandidas] = useState<Set<string>>(new Set());

  // Cargar lista de clientes con notas
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const clientesData = await getClientesConNotas(entrenadorId);
        setClientes(clientesData);
        // Seleccionar el primer cliente por defecto si hay clientes
        if (clientesData.length > 0 && !clienteSeleccionado) {
          setClienteSeleccionado(clientesData[0].clienteId);
        }
      } catch (error) {
        console.error('Error cargando clientes:', error);
      }
    };
    cargarClientes();
  }, [entrenadorId]);

  // Cargar notas del cliente seleccionado
  useEffect(() => {
    if (clienteSeleccionado) {
      const cargarNotas = async () => {
        setLoading(true);
        try {
          const notasData = await getNotasPorCliente(clienteSeleccionado, entrenadorId);
          setNotas(notasData);
          // Expandir todas las notas por defecto
          setNotasExpandidas(new Set(notasData.map(n => n.id)));
        } catch (error) {
          console.error('Error cargando notas:', error);
        } finally {
          setLoading(false);
        }
      };
      cargarNotas();
    } else {
      setNotas([]);
    }
  }, [clienteSeleccionado, entrenadorId]);

  const toggleNotaExpandida = (notaId: string) => {
    setNotasExpandidas(prev => {
      const nuevo = new Set(prev);
      if (nuevo.has(notaId)) {
        nuevo.delete(notaId);
      } else {
        nuevo.add(notaId);
      }
      return nuevo;
    });
  };

  const clienteActual = clientes.find(c => c.clienteId === clienteSeleccionado);

  const opcionesClientes = clientes.map(cliente => ({
    value: cliente.clienteId,
    label: `${cliente.clienteNombre} (${cliente.totalNotas} ${cliente.totalNotas === 1 ? 'nota' : 'notas'})`,
  }));

  return (
    <div className="space-y-6">
      {/* Selector de cliente */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-semibold">Seleccionar Cliente:</span>
            </div>
            <div className="flex-1 max-w-md">
              <Select
                options={opcionesClientes}
                value={clienteSeleccionado}
                onChange={(value) => setClienteSeleccionado(value)}
                placeholder="Selecciona un cliente"
                fullWidth
              />
            </div>
            {clienteActual && (
              <div className="text-sm text-gray-600">
                {clienteActual.totalNotas} {clienteActual.totalNotas === 1 ? 'nota' : 'notas'} en total
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Lista de notas */}
      {clienteSeleccionado ? (
        loading ? (
          <Card className="bg-white shadow-sm">
            <div className="p-12 text-center">
              <div className="text-gray-600">Cargando notas...</div>
            </div>
          </Card>
        ) : notas.length === 0 ? (
          <Card className="bg-white shadow-sm">
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay notas registradas
              </h3>
              <p className="text-gray-600">
                No se han registrado notas de sesión para este cliente aún.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notas de Sesión - {clienteActual?.clienteNombre}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (notasExpandidas.size === notas.length) {
                      setNotasExpandidas(new Set());
                    } else {
                      setNotasExpandidas(new Set(notas.map(n => n.id)));
                    }
                  }}
                >
                  {notasExpandidas.size === notas.length ? 'Colapsar todas' : 'Expandir todas'}
                </Button>
              </div>
            </div>

            {notas.map((nota) => {
              const estaExpandida = notasExpandidas.has(nota.id);
              
              return (
                <Card key={nota.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header de la nota */}
                    <div
                      className="flex items-start justify-between cursor-pointer"
                      onClick={() => toggleNotaExpandida(nota.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Sesión del {nota.fechaSesion.toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>{nota.horaInicio} - {nota.horaFin}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Creada: {nota.createdAt.toLocaleDateString('es-ES')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleNotaExpandida(nota.id);
                        }}
                      >
                        {estaExpandida ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>

                    {/* Contenido expandible */}
                    {estaExpandida && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                        {/* Qué trabajamos */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <h5 className="font-semibold text-gray-900">¿Qué trabajamos?</h5>
                          </div>
                          <p className="text-gray-700 bg-blue-50 rounded-lg p-3 whitespace-pre-wrap">
                            {nota.queTrabajamos}
                          </p>
                        </div>

                        {/* Rendimiento */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <h5 className="font-semibold text-gray-900">Rendimiento del cliente</h5>
                          </div>
                          <p className="text-gray-700 bg-green-50 rounded-lg p-3 whitespace-pre-wrap">
                            {nota.rendimiento}
                          </p>
                        </div>

                        {/* Observaciones */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <h5 className="font-semibold text-gray-900">Observaciones</h5>
                          </div>
                          <p className="text-gray-700 bg-amber-50 rounded-lg p-3 whitespace-pre-wrap">
                            {nota.observaciones}
                          </p>
                        </div>

                        {/* Información adicional */}
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              Nota creada: {nota.createdAt.toLocaleString('es-ES')}
                            </span>
                            {nota.updatedAt.getTime() !== nota.createdAt.getTime() && (
                              <span>
                                Última actualización: {nota.updatedAt.toLocaleString('es-ES')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )
      ) : (
        <Card className="bg-white shadow-sm">
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Selecciona un cliente
            </h3>
            <p className="text-gray-600">
              Por favor, selecciona un cliente de la lista para ver sus notas de sesión.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};


