import React, { useState } from 'react';
import { 
  BookOpen, 
  FileStack, 
  Zap, 
  History, 
  Search,
  Filter,
  Dumbbell,
  Target,
  Clock,
  Layers
} from 'lucide-react';
import { Input } from '../../../../components/componentsreutilizables/Input';
import { Select } from '../../../../components/componentsreutilizables/Select';
import { Tabs } from '../../../../components/componentsreutilizables/Tabs';
import { Restricciones } from '../../types/advanced';

interface LeftPanelProps {
  onAgregarEjercicio: (ejercicio: any) => void;
  onAplicarPlantilla: (plantillaId: string, rango: 'dia' | 'semana' | 'rango') => void;
  onAplicarBloque: (bloque: any) => void;
  clienteId?: string;
  restricciones?: Restricciones;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  onAgregarEjercicio,
  onAplicarPlantilla,
  onAplicarBloque,
  clienteId,
  restricciones,
}) => {
  const [tabActiva, setTabActiva] = useState('biblioteca');
  const [busquedaBiblioteca, setBusquedaBiblioteca] = useState('');
  const [filtros, setFiltros] = useState({
    grupoMuscular: '',
    patron: '',
    equipo: '',
    nivel: '',
    rpe: '',
    tiempo: '',
  });

  // Búsqueda natural: "empuje vertical con mancuernas nivel intermedio 30'"
  const parseBusquedaNatural = (busqueda: string) => {
    const patrones = ['empuje', 'tiron', 'rodilla', 'cadera', 'vertical', 'horizontal'];
    const equipos = ['mancuernas', 'barra', 'máquinas', 'bodyweight', 'bandas'];
    const niveles = ['principiante', 'intermedio', 'avanzado'];
    
    const patron = patrones.find(p => busqueda.toLowerCase().includes(p));
    const equipo = equipos.find(e => busqueda.toLowerCase().includes(e));
    const nivel = niveles.find(n => busqueda.toLowerCase().includes(n));
    const tiempoMatch = busqueda.match(/(\d+)\s*['"]?\s*min/);
    const tiempo = tiempoMatch ? parseInt(tiempoMatch[1]) : undefined;

    return { patron, equipo, nivel, tiempo };
  };

  const busquedaNatural = parseBusquedaNatural(busquedaBiblioteca);

  const tabs = [
    {
      id: 'biblioteca',
      label: 'Biblioteca',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'plantillas',
      label: 'Plantillas',
      icon: <FileStack className="w-4 h-4" />,
    },
    {
      id: 'bloques',
      label: 'Bloques',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: <History className="w-4 h-4" />,
    },
  ];

  const ejerciciosEjemplo = [
    { id: '1', nombre: 'Sentadilla', grupoMuscular: ['piernas'], patron: 'rodilla', nivel: 'intermedio' },
    { id: '2', nombre: 'Press Banca', grupoMuscular: ['pecho'], patron: 'empuje', nivel: 'intermedio' },
    { id: '3', nombre: 'Peso Muerto', grupoMuscular: ['espalda'], patron: 'cadera', nivel: 'avanzado' },
  ];

  const plantillasEjemplo = [
    { id: '1', nombre: 'Fuerza 4 semanas', tipo: 'semana', duracion: 28 },
    { id: '2', nombre: 'Hipertrofia Bloque', tipo: 'bloque', duracion: 42 },
  ];

  const bloquesRapidos = [
    { id: '1', nombre: 'Calentamiento Estándar', tipo: 'calentamiento' },
    { id: '2', nombre: 'Movilidad Completa', tipo: 'movilidad' },
    { id: '3', nombre: 'Superset A/B', tipo: 'superset' },
    { id: '4', nombre: 'Circuito HIIT', tipo: 'circuito' },
    { id: '5', nombre: 'Finisher Cardio', tipo: 'finisher' },
  ];

  const historialEjemplo = [
    { id: '1', nombre: 'PR: Sentadilla 120kg', fecha: new Date(), tipo: 'pr' },
    { id: '2', nombre: 'Último: Push/Pull', fecha: new Date(), tipo: 'sesion' },
  ];

  const renderBiblioteca = () => (
    <div className="space-y-3 p-4">
      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar ejercicios..."
          value={busquedaBiblioteca}
          onChange={(e) => setBusquedaBiblioteca(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtros */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
          <Filter className="w-3 h-3" />
          <span>Filtros</span>
        </div>
        <Select
          value={filtros.grupoMuscular}
          onChange={(value) => setFiltros({ ...filtros, grupoMuscular: value })}
          options={[
            { label: 'Todos los grupos', value: '' },
            { label: 'Pecho', value: 'pecho' },
            { label: 'Espalda', value: 'espalda' },
            { label: 'Piernas', value: 'piernas' },
            { label: 'Hombros', value: 'hombros' },
            { label: 'Brazos', value: 'brazos' },
          ]}
          placeholder="Grupo muscular"
        />
        <Select
          value={filtros.patron}
          onChange={(value) => setFiltros({ ...filtros, patron: value })}
          options={[
            { label: 'Todos los patrones', value: '' },
            { label: 'Empuje', value: 'empuje' },
            { label: 'Tirón', value: 'tiron' },
            { label: 'Rodilla', value: 'rodilla' },
            { label: 'Cadera', value: 'cadera' },
          ]}
          placeholder="Patrón"
        />
        <Select
          value={filtros.equipo}
          onChange={(value) => setFiltros({ ...filtros, equipo: value })}
          options={[
            { label: 'Todo el equipo', value: '' },
            { label: 'Mancuernas', value: 'mancuernas' },
            { label: 'Barra', value: 'barra' },
            { label: 'Máquinas', value: 'maquinas' },
            { label: 'Bodyweight', value: 'bodyweight' },
          ]}
          placeholder="Equipo"
        />
        {restricciones?.tiempoDisponible && (
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
            <Clock className="w-3 h-3" />
            <span>Tiempo disponible: {restricciones.tiempoDisponible} min</span>
          </div>
        )}
      </div>

      {/* Lista de ejercicios */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {ejerciciosEjemplo.map((ejercicio) => (
          <button
            key={ejercicio.id}
            onClick={() => onAgregarEjercicio(ejercicio)}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm text-gray-900">{ejercicio.nombre}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {ejercicio.grupoMuscular.join(', ')} • {ejercicio.patron}
                </div>
              </div>
              <Dumbbell className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderPlantillas = () => (
    <div className="space-y-3 p-4">
      <div className="text-xs font-medium text-gray-600 mb-2">Plantillas disponibles</div>
      <div className="space-y-2">
        {plantillasEjemplo.map((plantilla) => (
          <div
            key={plantilla.id}
            className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900">{plantilla.nombre}</div>
            <div className="text-xs text-gray-500 mt-1">
              {plantilla.tipo} • {plantilla.duracion} días
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onAplicarPlantilla(plantilla.id, 'dia')}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Día
              </button>
              <button
                onClick={() => onAplicarPlantilla(plantilla.id, 'semana')}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                Semana
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBloques = () => (
    <div className="space-y-3 p-4">
      <div className="text-xs font-medium text-gray-600 mb-2">Bloques rápidos</div>
      <div className="space-y-2">
        {bloquesRapidos.map((bloque) => (
          <button
            key={bloque.id}
            onClick={() => onAplicarBloque(bloque)}
            className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm text-gray-900">{bloque.nombre}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderHistorial = () => (
    <div className="space-y-3 p-4">
      <div className="text-xs font-medium text-gray-600 mb-2">Historial del cliente</div>
      <div className="space-y-2">
        {historialEjemplo.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:border-green-300 hover:bg-green-50 transition-colors"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', JSON.stringify(item));
            }}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-green-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">{item.nombre}</div>
                <div className="text-xs text-gray-500">
                  {item.fecha.toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
        {tabActiva === 'biblioteca' && renderBiblioteca()}
        {tabActiva === 'plantillas' && renderPlantillas()}
        {tabActiva === 'bloques' && renderBloques()}
        {tabActiva === 'historial' && renderHistorial()}
      </div>
    </div>
  );
};

