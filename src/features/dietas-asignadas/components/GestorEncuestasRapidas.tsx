import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Table, Badge, ConfirmModal } from '../../../components/componentsreutilizables';
import { 
  Plus, 
  Send, 
  Edit, 
  Trash2, 
  FileText, 
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import {
  EncuestaRapida,
  TipoEncuestaRapida,
  RespuestaEncuestaRapida,
  InsightEncuestaRapida,
} from '../types';
import {
  getEncuestasRapidas,
  crearEncuestaPredefinida,
  eliminarEncuestaRapida,
  enviarEncuestaRapida,
  getRespuestasEncuesta,
  getInsightsEncuesta,
} from '../api/encuestasRapidas';
import { useAuth } from '../../../context/AuthContext';
import { EditorEncuestaRapida } from './EditorEncuestaRapida';
import { VerRespuestasEncuesta } from './VerRespuestasEncuesta';

interface GestorEncuestasRapidasProps {
  dietaId: string;
  clienteId: string;
  clienteNombre?: string;
  onEncuestaCreada?: () => void;
}

export const GestorEncuestasRapidas: React.FC<GestorEncuestasRapidasProps> = ({
  dietaId,
  clienteId,
  clienteNombre,
  onEncuestaCreada,
}) => {
  const { user } = useAuth();
  const [encuestas, setEncuestas] = useState<EncuestaRapida[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarEditor, setMostrarEditor] = useState(false);
  const [mostrarRespuestas, setMostrarRespuestas] = useState(false);
  const [encuestaSeleccionada, setEncuestaSeleccionada] = useState<EncuestaRapida | null>(null);
  const [encuestaEditando, setEncuestaEditando] = useState<EncuestaRapida | null>(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState<EncuestaRapida | null>(null);
  const [insights, setInsights] = useState<InsightEncuestaRapida | null>(null);

  useEffect(() => {
    cargarEncuestas();
  }, [dietaId]);

  const cargarEncuestas = async () => {
    setCargando(true);
    try {
      const data = await getEncuestasRapidas(dietaId);
      setEncuestas(data);
    } catch (error) {
      console.error('Error cargando encuestas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearEncuesta = async (tipo: TipoEncuestaRapida) => {
    try {
      if (!user?.id) return;
      
      await crearEncuestaPredefinida(dietaId, clienteId, tipo, user.id);
      await cargarEncuestas();
      setMostrarEditor(false);
      onEncuestaCreada?.();
    } catch (error) {
      console.error('Error creando encuesta:', error);
    }
  };

  const handleEnviarEncuesta = async (encuesta: EncuestaRapida) => {
    try {
      await enviarEncuestaRapida(encuesta.id);
      await cargarEncuestas();
    } catch (error) {
      console.error('Error enviando encuesta:', error);
    }
  };

  const handleEliminarEncuesta = async () => {
    if (!confirmarEliminar) return;
    
    try {
      await eliminarEncuestaRapida(confirmarEliminar.id);
      await cargarEncuestas();
      setConfirmarEliminar(null);
    } catch (error) {
      console.error('Error eliminando encuesta:', error);
    }
  };

  const handleVerRespuestas = async (encuesta: EncuestaRapida) => {
    setEncuestaSeleccionada(encuesta);
    try {
      const insight = await getInsightsEncuesta(encuesta.id);
      setInsights(insight);
      setMostrarRespuestas(true);
    } catch (error) {
      console.error('Error cargando insights:', error);
    }
  };

  const tiposEncuesta: Array<{ tipo: TipoEncuestaRapida; nombre: string; descripcion: string }> = [
    { tipo: 'satisfaccion-semanal', nombre: 'Satisfacción Semanal', descripcion: 'Encuesta de satisfacción semanal' },
    { tipo: 'facilidad-preparacion', nombre: 'Facilidad de Preparación', descripcion: 'Encuesta sobre facilidad de preparación' },
    { tipo: 'satisfaccion-comida', nombre: 'Satisfacción con Comidas', descripcion: 'Encuesta de satisfacción con comidas' },
    { tipo: 'saciedad', nombre: 'Nivel de Saciedad', descripcion: 'Encuesta sobre nivel de saciedad' },
    { tipo: 'digestion', nombre: 'Digestión', descripcion: 'Encuesta sobre digestión' },
    { tipo: 'gusto', nombre: 'Gusto', descripcion: 'Encuesta sobre gusto de las comidas' },
    { tipo: 'adherencia', nombre: 'Adherencia', descripcion: 'Encuesta sobre adherencia al plan' },
    { tipo: 'dificultades', nombre: 'Dificultades', descripcion: 'Encuesta sobre dificultades encontradas' },
    { tipo: 'sugerencias', nombre: 'Sugerencias', descripcion: 'Encuesta para recoger sugerencias' },
    { tipo: 'personalizada', nombre: 'Personalizada', descripcion: 'Crear encuesta personalizada' },
  ];

  const columnas = [
    {
      key: 'nombre',
      label: 'Nombre',
      render: (_: any, row: EncuestaRapida) => (
        <div>
          <div className="font-medium text-gray-900">{row.nombre}</div>
          {row.descripcion && (
            <div className="text-sm text-gray-500">{row.descripcion}</div>
          )}
        </div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (_: any, row: EncuestaRapida) => (
        <Badge variant="secondary">{row.tipo}</Badge>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: EncuestaRapida) => (
        <div className="flex items-center gap-2">
          {row.activa ? (
            <Badge variant="success">Activa</Badge>
          ) : (
            <Badge variant="secondary">Inactiva</Badge>
          )}
          {row.enviada ? (
            <Badge variant="blue">Enviada</Badge>
          ) : (
            <Badge variant="yellow">No enviada</Badge>
          )}
        </div>
      ),
    },
    {
      key: 'respuestas',
      label: 'Respuestas',
      render: (_: any, row: EncuestaRapida) => (
        <div className="text-sm text-gray-600">
          {row.respuestasRecibidas} / {row.totalRespuestasEsperadas}
        </div>
      ),
    },
    {
      key: 'fechaEnvio',
      label: 'Fecha de Envío',
      render: (_: any, row: EncuestaRapida) => (
        <div className="text-sm text-gray-600">
          {row.fechaEnvio ? new Date(row.fechaEnvio).toLocaleDateString() : '-'}
        </div>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'right' as const,
      render: (_: any, row: EncuestaRapida) => (
        <div className="flex items-center justify-end gap-2">
          {row.respuestasRecibidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVerRespuestas(row)}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
          )}
          {!row.enviada && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEnviarEncuesta(row)}
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEncuestaEditando(row);
              setMostrarEditor(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmarEliminar(row)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <FileText size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Encuestas Rápidas
              </h3>
              <p className="text-sm text-gray-600">
                Gestiona encuestas rápidas para {clienteNombre || 'el cliente'}
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setEncuestaEditando(null);
              setMostrarEditor(true);
            }}
          >
            <Plus size={20} className="mr-2" />
            Nueva Encuesta
          </Button>
        </div>

        <Table
          data={encuestas}
          columns={columnas}
          loading={cargando}
          emptyMessage="No hay encuestas creadas"
        />
      </Card>

      {mostrarEditor && (
        <EditorEncuestaRapida
          dietaId={dietaId}
          clienteId={clienteId}
          encuesta={encuestaEditando || undefined}
          tiposEncuesta={tiposEncuesta}
          onCrear={handleCrearEncuesta}
          onCancel={() => {
            setMostrarEditor(false);
            setEncuestaEditando(null);
          }}
          onSave={async () => {
            await cargarEncuestas();
            setMostrarEditor(false);
            setEncuestaEditando(null);
            onEncuestaCreada?.();
          }}
        />
      )}

      {mostrarRespuestas && encuestaSeleccionada && insights && (
        <VerRespuestasEncuesta
          encuesta={encuestaSeleccionada}
          insights={insights}
          onClose={() => {
            setMostrarRespuestas(false);
            setEncuestaSeleccionada(null);
            setInsights(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!confirmarEliminar}
        onClose={() => setConfirmarEliminar(null)}
        onConfirm={handleEliminarEncuesta}
        title="Eliminar Encuesta"
        message={`¿Estás seguro de que quieres eliminar la encuesta "${confirmarEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

