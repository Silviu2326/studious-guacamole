import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Input, Select, Switch, Modal, Table } from '../../../components/componentsreutilizables';
import {
  obtenerClientesInactivos,
  enviarOfertasEspecialesAutomaticas,
  crearConfiguracionOfertasPorDefecto,
  ConfiguracionOfertasEspeciales,
  OfertaEspecialEnviada,
  ClienteInactivo,
  CanalOferta,
} from '../api/ofertasEspeciales';
import { Gift, Send, Settings, Users, Clock, Calendar, TrendingDown, CheckCircle, Search, Filter } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface GestorOfertasEspecialesProps {
  entrenadorId?: string;
}

export const GestorOfertasEspeciales: React.FC<GestorOfertasEspecialesProps> = ({
  entrenadorId,
}) => {
  const { user } = useAuth();
  const [clientesInactivos, setClientesInactivos] = useState<ClienteInactivo[]>([]);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [configuracion, setConfiguracion] = useState<ConfiguracionOfertasEspeciales>(
    crearConfiguracionOfertasPorDefecto()
  );
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [historialOfertas, setHistorialOfertas] = useState<OfertaEspecialEnviada[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarClientesInactivos();
  }, [entrenadorId, configuracion]);

  const cargarClientesInactivos = async () => {
    if (!configuracion.activo) {
      setClientesInactivos([]);
      return;
    }

    setCargando(true);
    try {
      const idEntrenador = entrenadorId || user?.id;
      const clientes = await obtenerClientesInactivos(idEntrenador, configuracion);
      setClientesInactivos(clientes);
    } catch (error) {
      console.error('Error cargando clientes inactivos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEnviarOfertas = async () => {
    setEnviando(true);
    try {
      const idEntrenador = entrenadorId || user?.id;
      const ofertas = await enviarOfertasEspecialesAutomaticas(idEntrenador, configuracion);
      setHistorialOfertas([...historialOfertas, ...ofertas]);
      alert(`Se enviaron ${ofertas.length} ofertas especiales exitosamente`);
      await cargarClientesInactivos();
    } catch (error) {
      console.error('Error enviando ofertas:', error);
      alert('Error al enviar ofertas');
    } finally {
      setEnviando(false);
    }
  };

  const formatoFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(fecha));
  };

  const formatoMoneda = (cantidad: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(cantidad);
  };

  const clientesFiltrados = clientesInactivos.filter((cliente) =>
    cliente.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.clienteEmail.toLowerCase().includes(busqueda.toLowerCase())
  );

  const totalClientesInactivos = clientesFiltrados.length;
  const totalGastadoInactivos = clientesFiltrados.reduce((sum, cliente) => sum + cliente.totalGastado, 0);

  const columnas = [
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_: any, cliente: ClienteInactivo) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{cliente.clienteNombre}</p>
          <p className="text-xs text-gray-600">{cliente.clienteEmail}</p>
        </div>
      ),
    },
    {
      key: 'ultimaCompra',
      label: 'Última Compra',
      render: (_: any, cliente: ClienteInactivo) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700">{formatoFecha(cliente.ultimaCompra)}</span>
        </div>
      ),
    },
    {
      key: 'diasInactividad',
      label: 'Días Inactivo',
      render: (_: any, cliente: ClienteInactivo) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-orange-400" />
          <Badge variant={cliente.diasInactividad > 90 ? 'error' : 'warning'}>
            {cliente.diasInactividad} días
          </Badge>
        </div>
      ),
    },
    {
      key: 'historial',
      label: 'Historial',
      render: (_: any, cliente: ClienteInactivo) => (
        <div className="text-sm text-gray-600">
          <p>{cliente.totalCompras} {cliente.totalCompras === 1 ? 'compra' : 'compras'}</p>
          <p className="text-xs">{formatoMoneda(cliente.totalGastado)} total</p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ofertas Especiales Automáticas</h2>
              <p className="text-sm text-gray-600">
                Envía ofertas especiales a clientes que no compran hace más de {configuracion.diasInactividad} días
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setMostrarConfiguracion(true)}
              icon={<Settings className="w-4 h-4" />}
            >
              Configuración
            </Button>
            <Button
              variant="outline"
              onClick={() => setMostrarHistorial(true)}
              icon={<Clock className="w-4 h-4" />}
            >
              Historial
            </Button>
            <Button
              onClick={handleEnviarOfertas}
              disabled={!configuracion.activo || enviando || totalClientesInactivos === 0}
              icon={<Send className="w-4 h-4" />}
            >
              {enviando
                ? 'Enviando...'
                : `Enviar Ofertas (${totalClientesInactivos})`}
            </Button>
          </div>
        </div>

        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={configuracion.activo}
                onChange={(checked) => setConfiguracion({ ...configuracion, activo: checked })}
              />
              <span className="text-sm font-medium text-gray-700">
                Ofertas Automáticas {configuracion.activo ? 'Activadas' : 'Desactivadas'}
              </span>
            </div>
            {configuracion.activo && totalClientesInactivos > 0 && (
              <div className="flex gap-4">
                <Badge variant="warning">
                  {totalClientesInactivos} {totalClientesInactivos === 1 ? 'cliente inactivo' : 'clientes inactivos'}
                </Badge>
                <Badge variant="info">
                  {formatoMoneda(totalGastadoInactivos)} en riesgo
                </Badge>
              </div>
            )}
          </div>
          
          {configuracion.activo && clientesInactivos.length > 0 && (
            <div className="flex items-center gap-2">
              <Search size={18} className="text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email del cliente..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="flex-1"
              />
            </div>
          )}
        </div>

        {!configuracion.activo ? (
          <div className="text-center py-12 text-gray-500">
            <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Las ofertas automáticas están desactivadas</p>
            <p className="text-sm mt-2">Actívalas en la configuración para comenzar a enviar ofertas</p>
          </div>
        ) : cargando ? (
          <div className="text-center py-12 text-gray-500">Cargando...</div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-300" />
            <p>No hay clientes inactivos en este momento</p>
            <p className="text-sm mt-2">Todos tus clientes han comprado recientemente</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Clientes Inactivos</p>
                    <p className="text-2xl font-bold text-gray-900">{totalClientesInactivos}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Ingresos en Riesgo</p>
                    <p className="text-2xl font-bold text-gray-900">{formatoMoneda(totalGastadoInactivos)}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Descuento Ofrecido</p>
                    <p className="text-2xl font-bold text-gray-900">{configuracion.descuentoPorDefecto}%</p>
                  </div>
                </div>
              </Card>
            </div>

            <Table
              data={clientesFiltrados}
              columns={columnas}
            />
          </div>
        )}
      </Card>

      {/* Modal de Configuración */}
      <Modal
        isOpen={mostrarConfiguracion}
        onClose={() => setMostrarConfiguracion(false)}
        title="Configuración de Ofertas Especiales"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Activar Ofertas Automáticas</label>
            <Switch
              checked={configuracion.activo}
              onChange={(checked) => setConfiguracion({ ...configuracion, activo: checked })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Días de Inactividad (mínimo para considerar inactivo)
            </label>
            <Input
              type="number"
              value={configuracion.diasInactividad}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  diasInactividad: parseInt(e.target.value) || 60,
                })
              }
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Ejemplo: 60 días = 2 meses sin comprar
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descuento por Defecto (%)
            </label>
            <Input
              type="number"
              value={configuracion.descuentoPorDefecto}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  descuentoPorDefecto: parseInt(e.target.value) || 20,
                })
              }
              min="1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frecuencia de Verificación
            </label>
            <Select
              value={configuracion.frecuenciaVerificacion}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  frecuenciaVerificacion: e.target.value as 'diario' | 'semanal',
                })
              }
            >
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Canal de Comunicación</label>
            <Select
              value={configuracion.canal}
              onChange={(e) =>
                setConfiguracion({
                  ...configuracion,
                  canal: e.target.value as CanalOferta,
                })
              }
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="todos">Todos</option>
            </Select>
          </div>

          {configuracion.limiteOfertasPorCliente !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Límite de Ofertas por Cliente
              </label>
              <Input
                type="number"
                value={configuracion.limiteOfertasPorCliente}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    limiteOfertasPorCliente: parseInt(e.target.value) || undefined,
                  })
                }
                min="1"
              />
            </div>
          )}

          {configuracion.diasEntreOfertas !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Días Mínimos Entre Ofertas
              </label>
              <Input
                type="number"
                value={configuracion.diasEntreOfertas}
                onChange={(e) =>
                  setConfiguracion({
                    ...configuracion,
                    diasEntreOfertas: parseInt(e.target.value) || 30,
                  })
                }
                min="1"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setMostrarConfiguracion(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setMostrarConfiguracion(false);
                cargarClientesInactivos();
              }}
            >
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Historial */}
      <Modal
        isOpen={mostrarHistorial}
        onClose={() => setMostrarHistorial(false)}
        title="Historial de Ofertas Especiales"
      >
        <div className="space-y-4">
          {historialOfertas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay ofertas enviadas aún</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {historialOfertas.map((oferta) => (
                <div key={oferta.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{oferta.clienteNombre}</span>
                    <div className="flex gap-2">
                      <Badge variant={oferta.estado === 'usado' ? 'success' : oferta.estado === 'entregado' ? 'info' : 'warning'}>
                        {oferta.estado}
                      </Badge>
                      <Badge variant="success">{oferta.descuento}% OFF</Badge>
                    </div>
                  </div>
                  {oferta.codigoPromocional && (
                    <p className="text-sm font-medium text-purple-600 mb-1">
                      Código: {oferta.codigoPromocional}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-1">{oferta.mensaje.substring(0, 100)}...</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{formatoFecha(oferta.fechaEnvio)}</span>
                    <span>Canal: {oferta.canal}</span>
                    <span>{oferta.diasInactividad} días inactivo</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

