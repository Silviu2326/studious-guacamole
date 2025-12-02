import { useState, useEffect } from 'react';
import { Modal } from '../../../components/componentsreutilizables/Modal';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Card } from '../../../components/componentsreutilizables/Card';
import {
  Share2,
  Mail,
  MessageSquare,
  Download,
  X,
  Check,
  Copy,
  FileText,
} from 'lucide-react';
import { getChatMessages } from '../../gestión-de-clientes/api/chat';
import type { ChatMessage } from '../../gestión-de-clientes/types';

interface CompartirExtractosChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId: string;
  clienteNombre: string;
  programaId?: string;
  programaNombre?: string;
}

type ModoCompartir = 'email' | 'mensaje' | 'exportar';

export function CompartirExtractosChat({
  open,
  onOpenChange,
  clienteId,
  clienteNombre,
  programaId,
  programaNombre,
}: CompartirExtractosChatProps) {
  const [modo, setModo] = useState<ModoCompartir>('email');
  const [mensajes, setMensajes] = useState<ChatMessage[]>([]);
  const [mensajesSeleccionados, setMensajesSeleccionados] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Campos para email
  const [emailDestinatario, setEmailDestinatario] = useState('');
  const [asuntoEmail, setAsuntoEmail] = useState('');
  const [mensajeEmail, setMensajeEmail] = useState('');

  // Campos para mensaje
  const [mensajeTexto, setMensajeTexto] = useState('');

  // Filtros
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  const [busquedaTexto, setBusquedaTexto] = useState('');

  useEffect(() => {
    if (open && clienteId) {
      cargarMensajes();
    }
  }, [open, clienteId]);

  useEffect(() => {
    if (open) {
      // Pre-llenar email del cliente si está disponible
      setEmailDestinatario(clienteNombre.toLowerCase().replace(/\s+/g, '.') + '@email.com');
      setAsuntoEmail(
        programaNombre
          ? `Resumen del programa: ${programaNombre}`
          : `Resumen de conversación - ${clienteNombre}`
      );
    }
  }, [open, clienteNombre, programaNombre]);

  const cargarMensajes = async () => {
    setLoading(true);
    try {
      const mensajesData = await getChatMessages(clienteId);
      setMensajes(mensajesData);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  const mensajesFiltrados = mensajes.filter((msg) => {
    const fechaMsg = new Date(msg.timestamp);
    const desde = filtroFechaDesde ? new Date(filtroFechaDesde) : null;
    const hasta = filtroFechaHasta ? new Date(filtroFechaHasta) : null;

    const cumpleFecha =
      (!desde || fechaMsg >= desde) && (!hasta || fechaMsg <= hasta);

    const cumpleBusqueda =
      !busquedaTexto ||
      msg.content.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(busquedaTexto.toLowerCase());

    return cumpleFecha && cumpleBusqueda;
  });

  const toggleMensaje = (mensajeId: string) => {
    const nuevos = new Set(mensajesSeleccionados);
    if (nuevos.has(mensajeId)) {
      nuevos.delete(mensajeId);
    } else {
      nuevos.add(mensajeId);
    }
    setMensajesSeleccionados(nuevos);
  };

  const seleccionarTodos = () => {
    if (mensajesSeleccionados.size === mensajesFiltrados.length) {
      setMensajesSeleccionados(new Set());
    } else {
      setMensajesSeleccionados(new Set(mensajesFiltrados.map((m) => m.id)));
    }
  };

  const generarExtracto = (): string => {
    const mensajesSeleccionadosData = mensajesFiltrados.filter((m) =>
      mensajesSeleccionados.has(m.id)
    );

    if (mensajesSeleccionadosData.length === 0) {
      return '';
    }

    let extracto = `Resumen de conversación con ${clienteNombre}\n`;
    if (programaNombre) {
      extracto += `Programa: ${programaNombre}\n`;
    }
    extracto += `Fecha: ${new Date().toLocaleDateString('es-ES')}\n\n`;
    extracto += '─'.repeat(50) + '\n\n';

    mensajesSeleccionadosData.forEach((msg) => {
      const fecha = new Date(msg.timestamp).toLocaleString('es-ES');
      extracto += `[${fecha}] ${msg.senderName}:\n`;
      extracto += `${msg.content}\n\n`;
      if (msg.attachments && msg.attachments.length > 0) {
        extracto += `Adjuntos: ${msg.attachments.map((a) => a.fileName).join(', ')}\n\n`;
      }
    });

    return extracto;
  };

  const handleEnviarEmail = async () => {
    if (!emailDestinatario || !asuntoEmail) {
      alert('Por favor completa el email y el asunto');
      return;
    }

    if (mensajesSeleccionados.size === 0) {
      alert('Por favor selecciona al menos un mensaje');
      return;
    }

    setEnviando(true);
    try {
      const extracto = generarExtracto();
      const contenidoCompleto = `${mensajeEmail}\n\n${extracto}`;

      // Simular envío de email
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Email enviado:', {
        to: emailDestinatario,
        subject: asuntoEmail,
        body: contenidoCompleto,
      });

      alert('Email enviado correctamente');
      onOpenChange(false);
    } catch (error) {
      console.error('Error enviando email:', error);
      alert('Error al enviar el email');
    } finally {
      setEnviando(false);
    }
  };

  const handleEnviarMensaje = async () => {
    if (!mensajeTexto.trim()) {
      alert('Por favor escribe un mensaje');
      return;
    }

    if (mensajesSeleccionados.size === 0) {
      alert('Por favor selecciona al menos un mensaje');
      return;
    }

    setEnviando(true);
    try {
      const extracto = generarExtracto();
      const contenidoCompleto = `${mensajeTexto}\n\n${extracto}`;

      // Simular envío de mensaje
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Mensaje enviado:', {
        clienteId,
        contenido: contenidoCompleto,
      });

      alert('Mensaje enviado correctamente');
      onOpenChange(false);
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setEnviando(false);
    }
  };

  const handleExportar = () => {
    if (mensajesSeleccionados.size === 0) {
      alert('Por favor selecciona al menos un mensaje');
      return;
    }

    const extracto = generarExtracto();
    const blob = new Blob([extracto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `extracto-chat-${clienteNombre}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Extracto exportado correctamente');
  };

  const handleCopiar = () => {
    if (mensajesSeleccionados.size === 0) {
      alert('Por favor selecciona al menos un mensaje');
      return;
    }

    const extracto = generarExtracto();
    navigator.clipboard.writeText(extracto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Compartir Extractos del Chat"
      size="xl"
    >
      <div className="space-y-6">
        {/* Selector de modo */}
        <div className="flex gap-2 border-b pb-4">
          <button
            onClick={() => setModo('email')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              modo === 'email'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setModo('mensaje')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              modo === 'mensaje'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Mensaje
          </button>
          <button
            onClick={() => setModo('exportar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              modo === 'exportar'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>

        {/* Filtros */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Buscar en mensajes"
              value={busquedaTexto}
              onChange={(e) => setBusquedaTexto(e.target.value)}
              placeholder="Buscar texto..."
            />
            <Input
              label="Fecha desde"
              type="date"
              value={filtroFechaDesde}
              onChange={(e) => setFiltroFechaDesde(e.target.value)}
            />
            <Input
              label="Fecha hasta"
              type="date"
              value={filtroFechaHasta}
              onChange={(e) => setFiltroFechaHasta(e.target.value)}
            />
          </div>
        </Card>

        {/* Lista de mensajes */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Seleccionar mensajes ({mensajesSeleccionados.size} seleccionados)
            </h3>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={seleccionarTodos}
              >
                {mensajesSeleccionados.size === mensajesFiltrados.length
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopiar}
                iconLeft={copiado ? Check : Copy}
              >
                {copiado ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando mensajes...</div>
          ) : mensajesFiltrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay mensajes que coincidan con los filtros
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {mensajesFiltrados.map((msg) => {
                const seleccionado = mensajesSeleccionados.has(msg.id);
                return (
                  <div
                    key={msg.id}
                    onClick={() => toggleMensaje(msg.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      seleccionado
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                          seleccionado
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {seleccionado && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {msg.senderName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(msg.timestamp).toLocaleString('es-ES')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {msg.content}
                        </p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {msg.attachments.map((att) => (
                              <span
                                key={att.id}
                                className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"
                              >
                                <FileText className="w-3 h-3" />
                                {att.fileName}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Formulario según el modo */}
        {modo === 'email' && (
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Enviar por Email
            </h3>
            <div className="space-y-4">
              <Input
                label="Email destinatario"
                type="email"
                value={emailDestinatario}
                onChange={(e) => setEmailDestinatario(e.target.value)}
                placeholder="cliente@email.com"
                required
              />
              <Input
                label="Asunto"
                value={asuntoEmail}
                onChange={(e) => setAsuntoEmail(e.target.value)}
                placeholder="Asunto del email"
                required
              />
              <Textarea
                label="Mensaje adicional (opcional)"
                value={mensajeEmail}
                onChange={(e) => setMensajeEmail(e.target.value)}
                placeholder="Escribe un mensaje adicional que se incluirá antes del extracto..."
                rows={4}
              />
              <Button
                onClick={handleEnviarEmail}
                loading={enviando}
                disabled={!emailDestinatario || !asuntoEmail || mensajesSeleccionados.size === 0}
                iconLeft={Mail}
              >
                Enviar Email
              </Button>
            </div>
          </Card>
        )}

        {modo === 'mensaje' && (
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Enviar Mensaje
            </h3>
            <div className="space-y-4">
              <Textarea
                label="Mensaje"
                value={mensajeTexto}
                onChange={(e) => setMensajeTexto(e.target.value)}
                placeholder="Escribe un mensaje que se incluirá antes del extracto..."
                rows={4}
                required
              />
              <Button
                onClick={handleEnviarMensaje}
                loading={enviando}
                disabled={!mensajeTexto.trim() || mensajesSeleccionados.size === 0}
                iconLeft={MessageSquare}
              >
                Enviar Mensaje
              </Button>
            </div>
          </Card>
        )}

        {modo === 'exportar' && (
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Exportar Extracto
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                El extracto se exportará como un archivo de texto (.txt) con todos los mensajes
                seleccionados.
              </p>
              <Button
                onClick={handleExportar}
                disabled={mensajesSeleccionados.size === 0}
                iconLeft={Download}
              >
                Exportar como TXT
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Modal>
  );
}

