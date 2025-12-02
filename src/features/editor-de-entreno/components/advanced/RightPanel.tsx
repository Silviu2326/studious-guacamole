import React, { useState } from 'react';
import { 
  ClientePerfil, 
  EstadoCliente, 
  SesionEntrenamiento,
  PlanificacionSemana,
  Restricciones,
  BalanceadorCarga,
  ChecklistSesion
} from '../../types/advanced';
import { Card } from '../../../../components/componentsreutilizables';
import { 
  User, 
  Brain, 
  Shield, 
  CheckSquare, 
  Clock, 
  Dumbbell,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Send
} from 'lucide-react';
import { Tabs } from '../../../../components/componentsreutilizables/Tabs';
import { Badge } from '../../../../components/componentsreutilizables/Badge';

interface RightPanelProps {
  clientePerfil?: ClientePerfil;
  estadoCliente?: EstadoCliente;
  sesionActual?: SesionEntrenamiento;
  planificacion?: PlanificacionSemana;
  onRestriccionesChange: (restricciones: Restricciones) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  clientePerfil,
  estadoCliente,
  sesionActual,
  planificacion,
  onRestriccionesChange,
}) => {
  const [tabActiva, setTabActiva] = useState('perfil');
  const [mensaje, setMensaje] = useState('');

  const procesarComandoIA = (comando: string) => {
    const comandoLower = comando.toLowerCase();
    
    // "Tiene tendinitis rotuliana" → cambia patrones, baja profundidad, añade isométricos
    if (comandoLower.includes('tendinitis') || comandoLower.includes('dolor rodilla')) {
      // TODO: Implementar cambio automático
      alert('IA: Cambiando patrones de rodilla, reduciendo profundidad y añadiendo isométricos');
    }
    
    // "Solo 25' hoy" → condensar día
    const tiempoMatch = comandoLower.match(/(\d+)\s*['"]?\s*min/);
    if (tiempoMatch) {
      const tiempo = parseInt(tiempoMatch[1]);
      alert(`IA: Condensando día a ${tiempo} minutos`);
      // TODO: Llamar a función de condensar con tiempo específico
    }
    
    // "Hotel sin gym" → reemplazos por bandas/peso corporal
    if (comandoLower.includes('hotel') || comandoLower.includes('sin gym')) {
      alert('IA: Cambiando a variantes bodyweight y bandas');
      // TODO: Implementar modo hotel
    }
    
    // Otros comandos
    console.log('Comando IA procesado:', comando);
  };

  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: <User className="w-4 h-4" /> },
    { id: 'copilot', label: 'IA Copilot', icon: <Brain className="w-4 h-4" /> },
    { id: 'seguridad', label: 'Seguridad', icon: <Shield className="w-4 h-4" /> },
    { id: 'checklist', label: 'Checklist', icon: <CheckSquare className="w-4 h-4" /> },
  ];

  // Calcular balanceador de carga (ejemplo)
  const balanceadorCarga: BalanceadorCarga = {
    empuje: { actual: 12, objetivo: 16 },
    tiron: { actual: 8, objetivo: 16 },
    rodilla: { actual: 10, objetivo: 12 },
    cadera: { actual: 6, objetivo: 12 },
    vertical: { actual: 4, objetivo: 8 },
    horizontal: { actual: 8, objetivo: 12 },
    core: { actual: 6, objetivo: 8 },
  };

  // Generar checklist de sesión con mensajes pre-rellenados inteligentes
  const calcularTiempoEstimado = () => {
    if (!sesionActual?.ejercicios) return 0;
    const tiempoEjercicios = sesionActual.ejercicios.length * 5;
    const tiempoDescansos = sesionActual.ejercicios.reduce((sum, ej) => {
      return sum + (ej.series?.reduce((s, serie) => s + (serie.descanso || 0), 0) || 0);
    }, 0);
    return Math.round((tiempoEjercicios + tiempoDescansos) / 60);
  };

  const tiempoEstimado = calcularTiempoEstimado();
  const ejerciciosPrioritarios = sesionActual?.ejercicios?.slice(0, 2).map(ej => ej.ejercicio.nombre) || [];

  const checklist: ChecklistSesion = {
    ejercicios: sesionActual?.ejercicios?.map((ej, idx) => ({
      ejercicioId: ej.id,
      nombre: ej.ejercicio.nombre,
      series: ej.series?.length || 0,
      repeticiones: `${ej.series?.[0]?.repeticiones || 0}${ej.series?.length > 1 ? '-' + ej.series[ej.series.length - 1]?.repeticiones : ''}`,
      peso: ej.series?.[0]?.peso,
      notas: ej.series?.[0]?.notas,
    })) || [],
    mensajesPreRellenos: {
      whatsapp: `¡Hola! Hoy toca entrenamiento: ${sesionActual?.nombre || 'Rutina personalizada'}. ${tiempoEstimado > 0 ? `Tiempo estimado: ~${tiempoEstimado} min. ` : ''}${ejerciciosPrioritarios.length > 0 ? `Prioriza: ${ejerciciosPrioritarios.join(', ')}. ` : ''}¡Nos vemos! 💪`,
      sms: `Recordatorio: Entrenamiento hoy (~${tiempoEstimado} min). ${sesionActual?.nombre || 'Rutina personalizada'}`,
      push: `💪 Entrenamiento de hoy: ${sesionActual?.nombre || 'Rutina personalizada'}${tiempoEstimado > 0 ? ` (~${tiempoEstimado} min)` : ''}`,
    },
  };

  const renderPerfil = () => (
    <div className="space-y-4 p-4">
      {clientePerfil && (
        <>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">{clientePerfil.nombre}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Tiempo/semana: {clientePerfil.tiempoSemana} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Material: {clientePerfil.materialDisponible.join(', ')}</span>
              </div>
              {clientePerfil.lesiones.length > 0 && (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <span className="text-gray-600">Lesiones: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {clientePerfil.lesiones.map((lesion, idx) => (
                        <Badge key={idx} variant="yellow" size="sm">{lesion}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {clientePerfil.preferencias.length > 0 && (
                <div>
                  <span className="text-gray-600">Preferencias: </span>
                  <span className="text-gray-900">{clientePerfil.preferencias.join(', ')}</span>
                </div>
              )}
              <div>
                <span className="text-gray-600">Cronotipo: </span>
                <span className="text-gray-900 capitalize">{clientePerfil.cronotipo}</span>
              </div>
            </div>
          </div>
        </>
      )}
      {estadoCliente && (
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm text-gray-900 mb-2">Estado Actual</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Adherencia</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all"
                    style={{ width: `${estadoCliente.adherenciaSemana}%` }}
                  />
                </div>
                <span className="text-gray-900 font-medium">{estadoCliente.adherenciaSemana}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Fatiga</span>
              <Badge
                variant={
                  estadoCliente.fatigaReportada === 'baja' ? 'green' :
                  estadoCliente.fatigaReportada === 'media' ? 'yellow' : 'red'
                }
              >
                {estadoCliente.fatigaReportada}
              </Badge>
            </div>
            {estadoCliente.dolorActual && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Dolor</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    estadoCliente.dolorActual.intensidad === 'verde' ? 'bg-green-500' :
                    estadoCliente.dolorActual.intensidad === 'amarillo' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  {estadoCliente.dolorActual.zona && (
                    <span className="text-sm text-gray-900">{estadoCliente.dolorActual.zona}</span>
                  )}
                </div>
              </div>
            )}
            {estadoCliente.hrv && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">HRV</span>
                <span className="text-gray-900">{estadoCliente.hrv} ms</span>
              </div>
            )}
            {estadoCliente.sueño && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Sueño</span>
                <span className="text-gray-900">{estadoCliente.sueño} horas</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderCopilot = () => (
    <div className="space-y-4 p-4">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">IA Coach Copilot</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Chat contextual con acciones. Pide ayuda para ajustar entrenamientos según el estado del cliente.
        </p>
        <div className="space-y-2">
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Ej: Tiene tendinitis rotuliana / Solo 25' hoy / Hotel sin gym"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && mensaje.trim()) {
                procesarComandoIA(mensaje);
                setMensaje('');
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (mensaje.trim()) {
                  procesarComandoIA(mensaje);
                  setMensaje('');
                }
              }}
              className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Enviar
            </button>
            <button className="text-xs px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Sugerencias
            </button>
          </div>
        </div>
      </div>
      
      {/* Sugerencias rápidas con acciones reales */}
      <div>
        <h4 className="text-xs font-medium text-gray-600 mb-2">Sugerencias rápidas</h4>
        <div className="space-y-1">
          {[
            { texto: 'Tiene tendinitis rotuliana', accion: 'tendinitis-rodilla' },
            { texto: 'Solo 25\' hoy', accion: 'condensar-25' },
            { texto: 'Hotel sin gym', accion: 'modo-hotel' },
            { texto: 'Ajustar por fatiga alta', accion: 'fatiga-alta' },
            { texto: 'Reducir volumen 10%', accion: 'reducir-volumen' },
            { texto: 'Cambiar variantes dolorosas', accion: 'cambiar-variantes' },
            { texto: 'Añadir movilidad', accion: 'añadir-movilidad' },
          ].map((sug, idx) => (
            <button
              key={idx}
              onClick={() => {
                setMensaje(sug.texto);
                procesarComandoIA(sug.texto);
              }}
              className="w-full text-left text-xs px-2 py-1.5 bg-gray-50 hover:bg-gray-100 rounded text-gray-700"
            >
              {sug.texto}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSeguridad = () => (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Alertas de Seguridad</h3>
        <div className="space-y-2">
          {/* Alertas de exceso de carga */}
          {estadoCliente?.fatigaReportada === 'alta' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-900">Fatiga alta detectada</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Considera reducir volumen 15% y aumentar tempo controlado
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Balanceador de carga */}
          <div className="border-t pt-3">
            <h4 className="text-xs font-medium text-gray-600 mb-2">Balance de Patrones</h4>
            <div className="space-y-2">
              {Object.entries(balanceadorCarga).map(([patron, datos]) => {
                const diferencia = datos.objetivo - datos.actual;
                const porcentaje = (datos.actual / datos.objetivo) * 100;
                return (
                  <div key={patron} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 capitalize">{patron}</span>
                      <span className="text-gray-600">
                        {datos.actual}/{datos.objetivo} series
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          porcentaje >= 100 ? 'bg-green-500' :
                          porcentaje >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(porcentaje, 100)}%` }}
                      />
                    </div>
                    {diferencia > 0 && (
                      <p className="text-xs text-red-600">
                        Faltan {diferencia} series de {patron}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChecklist = () => (
    <div className="space-y-4 p-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Checklist de Sesión</h3>
        <p className="text-xs text-gray-600 mb-3">
          Lo que verá el cliente hoy
        </p>
        
        {checklist.ejercicios.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No hay ejercicios en esta sesión
          </div>
        ) : (
          <div className="space-y-2">
            {checklist.ejercicios.map((ej, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200"
              >
                <input
                  type="checkbox"
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{ej.nombre}</p>
                  <p className="text-xs text-gray-600">
                    {ej.series} series × {ej.repeticiones} reps
                    {ej.peso && ` @ ${ej.peso}kg`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mensajes rápidos */}
      {checklist.ejercicios.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-xs font-medium text-gray-600 mb-2">Mensajes Rápidos</h4>
          <div className="space-y-2">
            {checklist.mensajesPreRellenos.whatsapp && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">WhatsApp</span>
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                  {checklist.mensajesPreRellenos.whatsapp}
                </p>
              </div>
            )}
            {checklist.mensajesPreRellenos.sms && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">SMS</span>
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                  {checklist.mensajesPreRellenos.sms}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <Tabs
        items={tabs}
        activeTab={tabActiva}
        onTabChange={setTabActiva}
        variant="pills"
      />
      <div className="flex-1 overflow-y-auto">
        {tabActiva === 'perfil' && renderPerfil()}
        {tabActiva === 'copilot' && renderCopilot()}
        {tabActiva === 'seguridad' && renderSeguridad()}
        {tabActiva === 'checklist' && renderChecklist()}
      </div>
    </div>
  );
};

