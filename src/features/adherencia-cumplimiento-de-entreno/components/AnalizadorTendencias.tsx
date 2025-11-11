import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Select, Modal, Button, Textarea } from '../../../components/componentsreutilizables';
import { LineChart, TrendingUp, TrendingDown, BarChart3, Activity, MessageSquare, Edit2, Trash2 } from 'lucide-react';
import type { SelectOption } from '../../../components/componentsreutilizables';
import { useAuth } from '../../../context/AuthContext';

interface Props {
  modo: 'entrenador' | 'gimnasio';
}

interface Annotation {
  id: string;
  semana: string;
  valor: number;
  texto: string;
  fechaCreacion: string;
  autor: string;
  autorId: string;
}

export const AnalizadorTendencias: React.FC<Props> = ({ modo }) => {
  const { user } = useAuth();
  const [periodo, setPeriodo] = useState<string>('30d');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [selectedSemana, setSelectedSemana] = useState<string | null>(null);
  const [selectedValor, setSelectedValor] = useState<number | null>(null);
  const [annotationText, setAnnotationText] = useState('');
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);

  // Cargar anotaciones desde localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(`adherencia-annotations-${modo}`);
    if (stored) {
      try {
        setAnnotations(JSON.parse(stored));
      } catch (e) {
        console.error('Error cargando anotaciones:', e);
      }
    }
  }, [modo]);

  // Guardar anotaciones en localStorage cuando cambien
  useEffect(() => {
    if (annotations.length > 0 || localStorage.getItem(`adherencia-annotations-${modo}`)) {
      localStorage.setItem(`adherencia-annotations-${modo}`, JSON.stringify(annotations));
    }
  }, [annotations, modo]);

  const handleAddAnnotation = (semana: string, valor: number) => {
    setSelectedSemana(semana);
    setSelectedValor(valor);
    setAnnotationText('');
    setEditingAnnotation(null);
    setShowAnnotationModal(true);
  };

  const handleEditAnnotation = (annotation: Annotation) => {
    setEditingAnnotation(annotation);
    setSelectedSemana(annotation.semana);
    setSelectedValor(annotation.valor);
    setAnnotationText(annotation.texto);
    setShowAnnotationModal(true);
  };

  const handleSaveAnnotation = () => {
    if (!annotationText.trim() || !selectedSemana || selectedValor === null || !user) return;

    if (editingAnnotation) {
      // Editar anotación existente
      setAnnotations(annotations.map(ann =>
        ann.id === editingAnnotation.id
          ? { ...ann, texto: annotationText.trim(), fechaCreacion: new Date().toISOString() }
          : ann
      ));
    } else {
      // Crear nueva anotación
      const newAnnotation: Annotation = {
        id: `ann-${Date.now()}`,
        semana: selectedSemana,
        valor: selectedValor,
        texto: annotationText.trim(),
        fechaCreacion: new Date().toISOString(),
        autor: user.name || 'Usuario',
        autorId: user.id || 'unknown',
      };
      setAnnotations([...annotations, newAnnotation]);
    }

    setShowAnnotationModal(false);
    setAnnotationText('');
    setSelectedSemana(null);
    setSelectedValor(null);
    setEditingAnnotation(null);
  };

  const handleDeleteAnnotation = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta anotación?')) {
      setAnnotations(annotations.filter(ann => ann.id !== id));
    }
  };

  const getAnnotationsForSemana = (semana: string) => {
    return annotations.filter(ann => ann.semana === semana);
  };

  const periodos: SelectOption[] = [
    { value: '7d', label: 'Últimos 7 días' },
    { value: '30d', label: 'Últimos 30 días' },
    { value: '90d', label: 'Últimos 90 días' },
  ];

  const datosSemanales = [
    { semana: 'Sem 1', adherence: 78, ocupation: 65 },
    { semana: 'Sem 2', adherence: 82, ocupation: 68 },
    { semana: 'Sem 3', adherence: 85, ocupation: 71 },
    { semana: 'Sem 4', adherence: 84, ocupation: 72 },
    { semana: 'Sem 5', adherence: 86, ocupation: 73 },
    { semana: 'Sem 6', adherence: 88, ocupation: 74 },
    { semana: 'Sem 7', adherence: 90, ocupation: 75 },
    { semana: 'Sem 8', adherence: 87, ocupation: 76 },
  ];

  const datosTendencia =
    modo === 'entrenador'
      ? [
          { cliente: 'María Pérez', tendencia: '+8.2%', estado: 'Mejora', puntos: 87 },
          { cliente: 'Carlos Ruiz', tendencia: '+2.1%', estado: 'Estable', puntos: 100 },
          { cliente: 'Ana Martínez', tendencia: '+0.5%', estado: 'Estable', puntos: 75 },
          { cliente: 'Luis García', tendencia: '-12.3%', estado: 'Bajada', puntos: 62 },
          { cliente: 'Sofia López', tendencia: '-5.8%', estado: 'Bajada', puntos: 50 },
          { cliente: 'Diego Fernández', tendencia: '+5.2%', estado: 'Mejora', puntos: 87 },
          { cliente: 'Elena Sánchez', tendencia: '-20.1%', estado: 'Crítica', puntos: 37 },
          { cliente: 'Roberto Martín', tendencia: '+1.2%', estado: 'Estable', puntos: 75 },
        ]
      : [
          { clase: 'HIIT Lunes 18:00', tendencia: '+5.2%', estado: 'Mejora', ocupacion: 90 },
          { clase: 'Yoga Martes 19:00', tendencia: '+3.1%', estado: 'Mejora', ocupacion: 96 },
          { clase: 'Cross Training Mié 18:00', tendencia: '-2.3%', estado: 'Estable', ocupacion: 80 },
          { clase: 'Pilates Jueves 09:00', tendencia: '-8.5%', estado: 'Bajada', ocupacion: 60 },
          { clase: 'Zumba Viernes 19:00', tendencia: '+1.2%', estado: 'Estable', ocupacion: 93 },
          { clase: 'TRX Lunes 10:00', tendencia: '0%', estado: 'Estable', ocupacion: 100 },
          { clase: 'Spinning Martes 18:00', tendencia: '+2.1%', estado: 'Estable', ocupacion: 80 },
          { clase: 'Body Pump Viernes 18:00', tendencia: '+4.3%', estado: 'Mejora', ocupacion: 95 },
        ];

  const columns =
    modo === 'entrenador'
      ? [
          { key: 'cliente', label: 'Cliente' },
          { key: 'puntos', label: 'Puntos' },
          { key: 'tendencia', label: 'Tendencia' },
          { key: 'estado', label: 'Estado' },
        ]
      : [
          { key: 'clase', label: 'Clase' },
          { key: 'ocupacion', label: 'Ocupación' },
          { key: 'tendencia', label: 'Tendencia' },
          { key: 'estado', label: 'Estado' },
        ];

  const formattedData = datosTendencia.map(row => ({
    ...row,
    estado:
      row.estado === 'Mejora' ? (
        <Badge variant="green">
          <TrendingUp size={14} className="mr-1" />
          Mejora
        </Badge>
      ) : row.estado === 'Estable' ? (
        <Badge variant="blue">
          <Activity size={14} className="mr-1" />
          Estable
        </Badge>
      ) : row.estado === 'Bajada' ? (
        <Badge variant="yellow">
          <TrendingDown size={14} className="mr-1" />
          Bajada
        </Badge>
      ) : (
        <Badge variant="red">
          <TrendingDown size={14} className="mr-1" />
          Crítica
        </Badge>
      ),
  }));

  const renderGraficoBarra = (datos: typeof datosSemanales) => {
    const maxValue = Math.max(...datos.map(d => Math.max(d.adherence, d.ocupation)));
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Evolución Semanal</h4>
            <p className="text-xs text-gray-600">Datos de las últimas 8 semanas</p>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Adherencia</span>
            </div>
            {modo === 'gimnasio' && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>Ocupación</span>
              </div>
            )}
          </div>
        </div>
        {datos.map((item, idx) => {
          const semanaAnnotations = getAnnotationsForSemana(item.semana);
          return (
            <div key={idx} className="space-y-2 relative group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 w-16">
                  <span className="font-medium text-gray-700">{item.semana}</span>
                  {semanaAnnotations.length > 0 && (
                    <div className="relative">
                      <MessageSquare size={14} className="text-blue-600 cursor-pointer" />
                      <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        {semanaAnnotations.length}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-2 ml-4">
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                        onClick={() => handleAddAnnotation(item.semana, item.adherence)}
                        title="Haz clic para añadir una anotación">
                        <div
                          className="absolute left-0 top-0 h-full bg-blue-500 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(item.adherence / maxValue) * 100}%` }}
                        >
                          <span className="text-xs font-semibold text-white">
                            {item.adherence}%
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Mostrar anotaciones para esta semana */}
                    {semanaAnnotations.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {semanaAnnotations.map(ann => (
                          <div
                            key={ann.id}
                            className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs relative group/ann"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="text-gray-800">{ann.texto}</p>
                                <p className="text-gray-500 text-[10px] mt-1">
                                  {ann.autor} • {new Date(ann.fechaCreacion).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                                </p>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover/ann:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditAnnotation(ann);
                                  }}
                                  className="p-1 hover:bg-blue-200 rounded"
                                  title="Editar"
                                >
                                  <Edit2 size={12} className="text-blue-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAnnotation(ann.id);
                                  }}
                                  className="p-1 hover:bg-red-200 rounded"
                                  title="Eliminar"
                                >
                                  <Trash2 size={12} className="text-red-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {modo === 'gimnasio' && (
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-green-400 transition-all"
                          onClick={() => handleAddAnnotation(item.semana, item.ocupation)}
                          title="Haz clic para añadir una anotación">
                          <div
                            className="absolute left-0 top-0 h-full bg-green-500 rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${(item.ocupation / maxValue) * 100}%` }}
                          >
                            <span className="text-xs font-semibold text-white">
                              {item.ocupation}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Analizador de Tendencias</h3>
          <p className="text-sm text-gray-600 mt-2">
            {modo === 'entrenador'
              ? 'Evolución de adherencia por cliente, sesiones y semanas'
              : 'Evolución de ocupación por clase, franja horaria y semana'}
          </p>
        </div>
        <Select
          value={periodo}
          onChange={e => setPeriodo(e.target.value)}
          options={periodos}
          className="w-48"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={24} className="text-blue-600" />
            <h4 className="text-lg font-semibold text-gray-900">Tendencia General</h4>
          </div>
          {renderGraficoBarra(datosSemanales)}
        </Card>

        <Card className="bg-white shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <LineChart size={24} className="text-green-600" />
            <h4 className="text-lg font-semibold text-gray-900">
              {modo === 'entrenador' ? 'Por Cliente' : 'Por Clase'}
            </h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span className="font-medium">
                {modo === 'entrenador'
                  ? 'Top 8 Clientes por Tendencia'
                  : 'Top 8 Clases por Ocupación'}
              </span>
            </div>
            {formattedData.slice(0, 8).map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {(item as any).cliente || (item as any).clase}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {modo === 'entrenador' ? `Puntos: ${(item as any).puntos}` : `Ocupación: ${(item as any).ocupacion}%`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-semibold ${
                      parseFloat((item as any).tendencia) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {(item as any).tendencia}
                  </span>
                  {item.estado}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="bg-white shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={20} className="text-gray-700" />
          <h4 className="text-lg font-semibold text-gray-900">Análisis Completo</h4>
        </div>
        <Table columns={columns} data={formattedData} />
      </Card>

      {/* Modal para añadir/editar anotaciones */}
      <Modal
        isOpen={showAnnotationModal}
        onClose={() => {
          setShowAnnotationModal(false);
          setAnnotationText('');
          setSelectedSemana(null);
          setSelectedValor(null);
          setEditingAnnotation(null);
        }}
        title={editingAnnotation ? 'Editar Anotación' : 'Añadir Anotación'}
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAnnotationModal(false);
                setAnnotationText('');
                setSelectedSemana(null);
                setSelectedValor(null);
                setEditingAnnotation(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveAnnotation}
              disabled={!annotationText.trim()}
            >
              {editingAnnotation ? 'Guardar Cambios' : 'Añadir Anotación'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-semibold">Semana:</span> {selectedSemana}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Valor:</span> {selectedValor}%
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anotación
            </label>
            <Textarea
              value={annotationText}
              onChange={(e) => setAnnotationText(e.target.value)}
              placeholder="Describe el cambio brusco o contexto relevante para esta semana..."
              rows={4}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">
              Esta anotación será visible para todo tu equipo y ayudará a contextualizar cambios en la adherencia.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};


