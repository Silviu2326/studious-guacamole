import React, { useState } from 'react';
import { Card, Button, Input, Select, Modal, Textarea } from '../../../components/componentsreutilizables';
import { AlertaSeguridad, EstadoAlerta, TipoRestriccion, SeveridadRestriccion, FiltrosAlertas } from '../types';
import { useAlertas } from '../hooks/useRestricciones';
import { 
  formatearTipoRestriccion, 
  formatearSeveridad, 
  obtenerColorSeveridad,
  obtenerIconoTipo,
  obtenerIconoSeveridad,
  formatearFecha,
  calcularTiempoTranscurrido,
  obtenerTiposRestriccion,
  obtenerSeveridades
} from '../utils/validaciones';

interface AlertasSeguridadProps {
  clienteId?: string;
  mostrarFiltros?: boolean;
  soloActivas?: boolean;
}

export const AlertasSeguridad: React.FC<AlertasSeguridadProps> = ({
  clienteId,
  mostrarFiltros = true,
  soloActivas = false
}) => {
  const { alertas, loading, error, marcarComoResuelta, ignorarAlerta } = useAlertas(clienteId);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState<FiltrosAlertas>(
    soloActivas ? { estado: ['activa'] } : {}
  );
  const [busqueda, setBusqueda] = useState('');
  
  // Estados para modales
  const [modalResolver, setModalResolver] = useState(false);
  const [modalIgnorar, setModalIgnorar] = useState(false);
  const [alertaSeleccionada, setAlertaSeleccionada] = useState<AlertaSeguridad | null>(null);
  const [accionResolucion, setAccionResolucion] = useState('');
  const [razonIgnorar, setRazonIgnorar] = useState('');
  const [procesando, setProcesando] = useState(false);

  // Filtrar alertas
  const alertasFiltradas = alertas.filter(alerta => {
    // Filtro por búsqueda
    if (busqueda) {
      const textoBusqueda = busqueda.toLowerCase();
      const coincide = 
        alerta.mensaje.toLowerCase().includes(textoBusqueda) ||
        alerta.descripcion.toLowerCase().includes(textoBusqueda) ||
        alerta.responsable?.toLowerCase().includes(textoBusqueda);
      
      if (!coincide) return false;
    }
    
    // Filtros específicos
    if (filtros.estado && filtros.estado.length > 0 && !filtros.estado.includes(alerta.estado)) {
      return false;
    }
    
    if (filtros.tipo && filtros.tipo.length > 0 && !filtros.tipo.includes(alerta.tipo)) {
      return false;
    }
    
    if (filtros.severidad && filtros.severidad.length > 0 && !filtros.severidad.includes(alerta.severidad)) {
      return false;
    }
    
    return true;
  });

  // Agrupar alertas por estado
  const alertasActivas = alertasFiltradas.filter(a => a.estado === 'activa');
  const alertasResueltas = alertasFiltradas.filter(a => a.estado === 'resuelta');
  const alertasIgnoradas = alertasFiltradas.filter(a => a.estado === 'ignorada');

  const handleResolverAlerta = async () => {
    if (!alertaSeleccionada || !accionResolucion.trim()) return;
    
    try {
      setProcesando(true);
      await marcarComoResuelta(alertaSeleccionada.id, accionResolucion);
      setModalResolver(false);
      setAlertaSeleccionada(null);
      setAccionResolucion('');
    } catch (error) {
      console.error('Error al resolver alerta:', error);
    } finally {
      setProcesando(false);
    }
  };

  const handleIgnorarAlerta = async () => {
    if (!alertaSeleccionada || !razonIgnorar.trim()) return;
    
    try {
      setProcesando(true);
      await ignorarAlerta(alertaSeleccionada.id, razonIgnorar);
      setModalIgnorar(false);
      setAlertaSeleccionada(null);
      setRazonIgnorar('');
    } catch (error) {
      console.error('Error al ignorar alerta:', error);
    } finally {
      setProcesando(false);
    }
  };

  const obtenerColorEstado = (estado: EstadoAlerta): string => {
    switch (estado) {
      case 'activa':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200';
      case 'resuelta':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
      case 'ignorada':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const obtenerIconoEstado = (estado: EstadoAlerta): string => {
    switch (estado) {
      case 'activa':
        return '🚨';
      case 'resuelta':
        return '✅';
      case 'ignorada':
        return '🔇';
      default:
        return '❓';
    }
  };

  const AlertaCard: React.FC<{ alerta: AlertaSeguridad }> = ({ alerta }) => (
    <Card className={`p-4 border-l-4 ${
      alerta.estado === 'activa' 
        ? 'border-l-red-500' 
        : alerta.estado === 'resuelta'
        ? 'border-l-green-500'
        : 'border-l-gray-400'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Header de la alerta */}
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl">{obtenerIconoTipo(alerta.tipo)}</span>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {alerta.mensaje}
              </h4>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${obtenerColorSeveridad(alerta.severidad)}`}>
                  {obtenerIconoSeveridad(alerta.severidad)} {formatearSeveridad(alerta.severidad)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${obtenerColorEstado(alerta.estado)}`}>
                  {obtenerIconoEstado(alerta.estado)} {alerta.estado.charAt(0).toUpperCase() + alerta.estado.slice(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatearTipoRestriccion(alerta.tipo)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Descripción */}
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {alerta.descripcion}
          </p>
          
          {/* Información adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div>
              <strong>Fecha:</strong> {formatearFecha(alerta.fechaCreacion)}
            </div>
            <div>
              <strong>Hace:</strong> {calcularTiempoTranscurrido(alerta.fechaCreacion)}
            </div>
            <div>
              <strong>Responsable:</strong> {alerta.responsable || 'No asignado'}
            </div>
            {alerta.fechaResolucion && (
              <div>
                <strong>Resuelto:</strong> {formatearFecha(alerta.fechaResolucion)}
              </div>
            )}
          </div>
          
          {/* Acciones tomadas */}
          {alerta.accionesTomadas && alerta.accionesTomadas.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <strong className="text-sm text-gray-700 dark:text-gray-300">Acciones tomadas:</strong>
              <ul className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {alerta.accionesTomadas.map((accion, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span>•</span>
                    <span>{accion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        {alerta.estado === 'activa' && (
          <div className="flex space-x-2 ml-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setAlertaSeleccionada(alerta);
                setModalResolver(true);
              }}
            >
              ✅ Resolver
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAlertaSeleccionada(alerta);
                setModalIgnorar(true);
              }}
            >
              🔇 Ignorar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600 dark:text-red-400">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold mb-2">Error al cargar alertas</h3>
          <p>{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Alertas de Seguridad
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitoreo y gestión de alertas alimentarias
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {alertasActivas.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Alertas activas
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {alertasResueltas.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Resueltas
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔴</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {alertasFiltradas.filter(a => a.severidad === 'severa' || a.severidad === 'critica').length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Críticas/Severas
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔇</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {alertasIgnoradas.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Ignoradas
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Buscar alertas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              leftIcon={<span>🔍</span>}
            />
            
            <Select
              placeholder="Estado"
              options={[
                { value: '', label: 'Todos los estados' },
                { value: 'activa', label: '🚨 Activas' },
                { value: 'resuelta', label: '✅ Resueltas' },
                { value: 'ignorada', label: '🔇 Ignoradas' }
              ]}
              value={filtros.estado?.[0] || ''}
              onChange={(e) => {
                const valor = e.target.value as EstadoAlerta;
                setFiltros(prev => ({
                  ...prev,
                  estado: valor ? [valor] : undefined
                }));
              }}
            />
            
            <Select
              placeholder="Tipo"
              options={[
                { value: '', label: 'Todos los tipos' },
                ...obtenerTiposRestriccion().map(tipo => ({
                  value: tipo.value,
                  label: `${obtenerIconoTipo(tipo.value)} ${tipo.label}`
                }))
              ]}
              value={filtros.tipo?.[0] || ''}
              onChange={(e) => {
                const valor = e.target.value as TipoRestriccion;
                setFiltros(prev => ({
                  ...prev,
                  tipo: valor ? [valor] : undefined
                }));
              }}
            />
            
            <Select
              placeholder="Severidad"
              options={[
                { value: '', label: 'Todas las severidades' },
                ...obtenerSeveridades().map(sev => ({
                  value: sev.value,
                  label: `${obtenerIconoSeveridad(sev.value)} ${sev.label}`
                }))
              ]}
              value={filtros.severidad?.[0] || ''}
              onChange={(e) => {
                const valor = e.target.value as SeveridadRestriccion;
                setFiltros(prev => ({
                  ...prev,
                  severidad: valor ? [valor] : undefined
                }));
              }}
            />
          </div>
        </Card>
      )}

      {/* Lista de alertas */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </Card>
          ))}
        </div>
      ) : alertasFiltradas.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay alertas
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {soloActivas 
                ? 'No hay alertas activas en este momento'
                : 'No se encontraron alertas con los filtros aplicados'
              }
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {alertasFiltradas.map(alerta => (
            <AlertaCard key={alerta.id} alerta={alerta} />
          ))}
        </div>
      )}

      {/* Modal para resolver alerta */}
      <Modal
        isOpen={modalResolver}
        onClose={() => {
          setModalResolver(false);
          setAlertaSeleccionada(null);
          setAccionResolucion('');
        }}
        title="Resolver Alerta"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              {alertaSeleccionada?.mensaje}
            </h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              {alertaSeleccionada?.descripcion}
            </p>
          </div>
          
          <Textarea
            label="Acción tomada para resolver la alerta"
            value={accionResolucion}
            onChange={(e) => setAccionResolucion(e.target.value)}
            placeholder="Describe qué acción se tomó para resolver esta alerta..."
            rows={4}
            required
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setModalResolver(false);
                setAlertaSeleccionada(null);
                setAccionResolucion('');
              }}
              disabled={procesando}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleResolverAlerta}
              loading={procesando}
              disabled={!accionResolucion.trim()}
            >
              Marcar como Resuelta
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para ignorar alerta */}
      <Modal
        isOpen={modalIgnorar}
        onClose={() => {
          setModalIgnorar(false);
          setAlertaSeleccionada(null);
          setRazonIgnorar('');
        }}
        title="Ignorar Alerta"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              {alertaSeleccionada?.mensaje}
            </h4>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              {alertaSeleccionada?.descripcion}
            </p>
          </div>
          
          <Textarea
            label="Razón para ignorar la alerta"
            value={razonIgnorar}
            onChange={(e) => setRazonIgnorar(e.target.value)}
            placeholder="Explica por qué esta alerta debe ser ignorada..."
            rows={4}
            required
          />
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setModalIgnorar(false);
                setAlertaSeleccionada(null);
                setRazonIgnorar('');
              }}
              disabled={procesando}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleIgnorarAlerta}
              loading={procesando}
              disabled={!razonIgnorar.trim()}
            >
              Ignorar Alerta
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};