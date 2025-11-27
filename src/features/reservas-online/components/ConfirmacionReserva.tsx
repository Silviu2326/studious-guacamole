import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Reserva } from '../types';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Link2, 
  User,
  Mail,
  Phone,
  Edit,
  XCircle,
  AlertCircle
} from 'lucide-react';

/**
 * Props para el componente de confirmación de reserva
 */
export interface ConfirmacionReservaProps {
  /**
   * Datos de la reserva a mostrar
   * Puede ser una Reserva completa o datos equivalentes
   */
  reserva: Reserva | {
    id: string;
    clienteNombre?: string;
    fecha?: Date;
    fechaInicio?: Date;
    fechaFin?: Date;
    horaInicio?: string;
    horaFin?: string;
    tipo?: 'sesion-1-1' | 'clase-grupal' | 'fisio' | 'nutricion' | 'masaje';
    tipoSesion?: 'presencial' | 'videollamada';
    claseNombre?: string;
    ubicacion?: string;
    enlaceVideollamada?: string;
    estado?: string;
    precio?: number;
    observaciones?: string;
  };
  
  /**
   * Título personalizado del mensaje de confirmación
   * Por defecto: "Reserva Confirmada" o "Reserva Pendiente" según el estado
   */
  titulo?: string;
  
  /**
   * Mensaje personalizado adicional
   */
  mensaje?: string;
  
  /**
   * Si es true, muestra información sobre reservas recurrentes
   */
  esRecurrente?: boolean;
  
  /**
   * Número de reservas creadas (para reservas recurrentes)
   */
  numeroReservasCreadas?: number;
  
  /**
   * URL o función para modificar la reserva
   * Si se proporciona, se mostrará un botón para modificar
   */
  enlaceModificar?: string | (() => void);
  
  /**
   * URL o función para cancelar la reserva
   * Si se proporciona, se mostrará un botón para cancelar
   */
  enlaceCancelar?: string | (() => void);
  
  /**
   * Texto personalizado para el botón de modificar
   */
  textoModificar?: string;
  
  /**
   * Texto personalizado para el botón de cancelar
   */
  textoCancelar?: string;
  
  /**
   * Si es true, muestra información de contacto adicional
   */
  mostrarContacto?: boolean;
  
  /**
   * Email de contacto (si mostrarContacto es true)
   */
  emailContacto?: string;
  
  /**
   * Teléfono de contacto (si mostrarContacto es true)
   */
  telefonoContacto?: string;
  
  /**
   * Clase CSS adicional para el contenedor
   */
  className?: string;
  
  /**
   * Variante del diseño: 'centrado' | 'completo'
   * 'centrado': Diseño centrado con información básica
   * 'completo': Diseño completo con todos los detalles
   */
  variante?: 'centrado' | 'completo';
}

/**
 * Componente reutilizable para mostrar mensajes de confirmación de reserva
 * 
 * Muestra de forma clara:
 * - Qué se ha reservado
 * - Cuándo y dónde
 * - Cómo modificar/cancelar
 * - Enlace de videollamada si es reserva online
 * 
 * Puede usarse en:
 * - ReservasOnline (flujo interno)
 * - ReservaPublicaPage
 * - ConfirmarReservaPage
 */
export const ConfirmacionReserva: React.FC<ConfirmacionReservaProps> = ({
  reserva,
  titulo,
  mensaje,
  esRecurrente = false,
  numeroReservasCreadas,
  enlaceModificar,
  enlaceCancelar,
  textoModificar = 'Modificar Reserva',
  textoCancelar = 'Cancelar Reserva',
  mostrarContacto = false,
  emailContacto,
  telefonoContacto,
  className = '',
  variante = 'centrado',
}) => {
  // Extraer datos de la reserva
  const fecha = reserva.fecha || reserva.fechaInicio || new Date();
  const horaInicio = reserva.horaInicio || 
    (reserva.fechaInicio ? reserva.fechaInicio.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '');
  const horaFin = reserva.horaFin || 
    (reserva.fechaFin ? reserva.fechaFin.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '');
  const reservaCompleta = reserva as Reserva;
  const tipoSesion = reserva.tipoSesion || (reservaCompleta.esOnline ? 'videollamada' : 'presencial');
  const enlaceVideollamada = reserva.enlaceVideollamada || reservaCompleta.enlaceVideollamada;
  const estado = reserva.estado || reservaCompleta.estado || 'confirmada';
  const clienteNombre = reserva.clienteNombre || '';
  const claseNombre = reserva.claseNombre || '';
  const tipo = reserva.tipo || 'sesion-1-1';
  const ubicacion = reserva.ubicacion;
  const precio = reserva.precio;

  // Determinar título por defecto
  const tituloPorDefecto = esRecurrente 
    ? 'Reservas Recurrentes Creadas'
    : estado === 'pendiente'
    ? 'Reserva Pendiente de Aprobación'
    : estado === 'confirmada'
    ? '¡Reserva Confirmada!'
    : 'Reserva Creada';

  // Determinar mensaje por defecto
  const mensajePorDefecto = esRecurrente
    ? numeroReservasCreadas
      ? `Se han creado ${numeroReservasCreadas} reservas recurrentes según el patrón configurado. Se enviará confirmación por email para cada reserva.`
      : 'Se han creado las reservas recurrentes según el patrón configurado. Se enviará confirmación por email para cada reserva.'
    : estado === 'pendiente'
    ? 'Tu reserva está pendiente de aprobación. Recibirás un email cuando sea confirmada.'
    : estado === 'confirmada'
    ? 'Tu reserva ha sido confirmada. Recibirás un email con los detalles.'
    : 'Se ha enviado la confirmación por email.';

  // Formatear fecha
  const fechaFormateada = fecha.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Obtener nombre del tipo de sesión
  const obtenerNombreTipo = () => {
    if (claseNombre) return claseNombre;
    switch (tipo) {
      case 'sesion-1-1':
        return 'Sesión 1 a 1';
      case 'fisio':
        return 'Fisioterapia';
      case 'nutricion':
        return 'Nutrición';
      case 'masaje':
        return 'Masaje';
      case 'clase-grupal':
        return 'Clase Grupal';
      default:
        return 'Sesión';
    }
  };

  // Manejar clic en modificar
  const handleModificar = () => {
    if (typeof enlaceModificar === 'function') {
      enlaceModificar();
    } else if (typeof enlaceModificar === 'string') {
      window.location.href = enlaceModificar;
    }
  };

  // Manejar clic en cancelar
  const handleCancelar = () => {
    if (typeof enlaceCancelar === 'function') {
      enlaceCancelar();
    } else if (typeof enlaceCancelar === 'string') {
      window.location.href = enlaceCancelar;
    }
  };

  // Renderizar variante centrada (más simple)
  if (variante === 'centrado') {
    return (
      <Card className={`p-8 text-center bg-white shadow-sm ${className}`}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {titulo || tituloPorDefecto}
        </h3>
        
        <p className="text-gray-600 mb-6">
          {mensaje || mensajePorDefecto}
        </p>

        {/* Información de la reserva */}
        <div className="p-4 bg-gray-50 rounded-lg mb-6 text-left max-w-md mx-auto">
          <div className="space-y-3">
            {clienteNombre && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{clienteNombre}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{fechaFormateada}</span>
            </div>
            
            {horaInicio && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {horaInicio} {horaFin ? `- ${horaFin}` : ''}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {tipoSesion === 'videollamada' ? (
                <Video className="w-4 h-4 text-gray-400" />
              ) : (
                <MapPin className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-700">
                {obtenerNombreTipo()} - {tipoSesion === 'videollamada' ? 'Videollamada' : 'Presencial'}
              </span>
            </div>
            
            {ubicacion && tipoSesion === 'presencial' && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{ubicacion}</span>
              </div>
            )}
          </div>
        </div>

        {/* Enlace de videollamada */}
        {tipoSesion === 'videollamada' && enlaceVideollamada && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-medium text-blue-900">
                Sesión de Videollamada
              </p>
            </div>
            <p className="text-xs text-blue-700 mb-3">
              El enlace de videollamada se ha generado automáticamente y se enviará en el email de confirmación.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.open(enlaceVideollamada, '_blank')}
              leftIcon={<Link2 className="w-4 h-4" />}
              fullWidth
            >
              Abrir Enlace de Videollamada
            </Button>
          </div>
        )}

        {/* Botones de acción */}
        {(enlaceModificar || enlaceCancelar) && (
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            {enlaceModificar && (
              <Button
                variant="secondary"
                onClick={handleModificar}
                leftIcon={<Edit className="w-4 h-4" />}
                fullWidth={!enlaceCancelar}
              >
                {textoModificar}
              </Button>
            )}
            {enlaceCancelar && (
              <Button
                variant="ghost"
                onClick={handleCancelar}
                leftIcon={<XCircle className="w-4 h-4" />}
                fullWidth={!enlaceModificar}
              >
                {textoCancelar}
              </Button>
            )}
          </div>
        )}

        {/* Información de contacto */}
        {mostrarContacto && (emailContacto || telefonoContacto) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left max-w-md mx-auto">
            <p className="text-xs font-medium text-gray-700 mb-2">¿Necesitas ayuda?</p>
            <div className="space-y-1">
              {emailContacto && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gray-400" />
                  <a href={`mailto:${emailContacto}`} className="text-xs text-blue-600 hover:underline">
                    {emailContacto}
                  </a>
                </div>
              )}
              {telefonoContacto && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <a href={`tel:${telefonoContacto}`} className="text-xs text-blue-600 hover:underline">
                    {telefonoContacto}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Card>
    );
  }

  // Renderizar variante completa (más detallada)
  return (
    <Card className={`p-8 bg-white shadow-sm ${className}`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {titulo || tituloPorDefecto}
        </h3>
        
        <p className="text-gray-600">
          {mensaje || mensajePorDefecto}
        </p>
      </div>

      {/* Información detallada de la reserva */}
      <div className="border border-gray-200 rounded-lg p-6 mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Detalles de la Reserva</h4>
        
        <div className="space-y-4">
          {clienteNombre && (
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Cliente</p>
                <p className="text-sm font-medium text-gray-900">{clienteNombre}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Fecha</p>
              <p className="text-sm font-medium text-gray-900">{fechaFormateada}</p>
            </div>
          </div>
          
          {horaInicio && (
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Horario</p>
                <p className="text-sm font-medium text-gray-900">
                  {horaInicio} {horaFin ? `- ${horaFin}` : ''}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            {tipoSesion === 'videollamada' ? (
              <Video className="w-5 h-5 text-blue-600" />
            ) : (
              <MapPin className="w-5 h-5 text-blue-600" />
            )}
            <div>
              <p className="text-xs text-gray-500">Tipo de Sesión</p>
              <p className="text-sm font-medium text-gray-900">
                {obtenerNombreTipo()} - {tipoSesion === 'videollamada' ? 'Videollamada' : 'Presencial'}
              </p>
            </div>
          </div>
          
          {ubicacion && tipoSesion === 'presencial' && (
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-500">Ubicación</p>
                <p className="text-sm font-medium text-gray-900">{ubicacion}</p>
              </div>
            </div>
          )}
          
          {precio !== undefined && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">Precio</span>
              <span className="text-sm font-semibold text-gray-900">€{precio.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Enlace de videollamada */}
      {tipoSesion === 'videollamada' && enlaceVideollamada && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-blue-900">
              Enlace de Videollamada
            </p>
          </div>
          <p className="text-xs text-blue-700 mb-3">
            Haz clic en el botón para acceder a la videollamada en el momento de la sesión.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open(enlaceVideollamada, '_blank')}
            leftIcon={<Link2 className="w-4 h-4" />}
            fullWidth
          >
            Abrir Enlace de Videollamada
          </Button>
        </div>
      )}

      {/* Información sobre modificar/cancelar */}
      {(enlaceModificar || enlaceCancelar) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
          <div className="flex items-start gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 mb-1">
                ¿Necesitas modificar o cancelar tu reserva?
              </p>
              <p className="text-xs text-amber-700">
                Puedes modificar o cancelar tu reserva usando los botones a continuación.
                {tipoSesion === 'presencial' && ' Para cancelaciones con menos de 24 horas de anticipación, contacta directamente.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {enlaceModificar && (
              <Button
                variant="secondary"
                onClick={handleModificar}
                leftIcon={<Edit className="w-4 h-4" />}
                fullWidth={!enlaceCancelar}
                size="sm"
              >
                {textoModificar}
              </Button>
            )}
            {enlaceCancelar && (
              <Button
                variant="ghost"
                onClick={handleCancelar}
                leftIcon={<XCircle className="w-4 h-4" />}
                fullWidth={!enlaceModificar}
                size="sm"
              >
                {textoCancelar}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Información de contacto */}
      {mostrarContacto && (emailContacto || telefonoContacto) && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">¿Necesitas ayuda?</p>
          <div className="space-y-2">
            {emailContacto && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${emailContacto}`} className="text-sm text-blue-600 hover:underline">
                  {emailContacto}
                </a>
              </div>
            )}
            {telefonoContacto && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${telefonoContacto}`} className="text-sm text-blue-600 hover:underline">
                  {telefonoContacto}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
