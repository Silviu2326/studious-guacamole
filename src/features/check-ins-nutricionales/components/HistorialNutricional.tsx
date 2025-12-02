import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Select, Input, Button } from '../../../components/componentsreutilizables';
import { Calendar, Clock, Image, Scale, Filter, X } from 'lucide-react';
import { getHistorialNutricional, HistorialCheckInNutricional } from '../api/checkins';
import { Badge } from '../../../components/componentsreutilizables';

interface HistorialNutricionalProps {
  clienteId: string;
  dias?: number;
}

export const HistorialNutricional: React.FC<HistorialNutricionalProps> = ({
  clienteId,
  dias = 30,
}) => {
  const [historial, setHistorial] = useState<HistorialCheckInNutricional[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Estados de filtros
  const [filtroTipoComida, setFiltroTipoComida] = useState<string>('');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState<string>('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState<string>('');
  const [filtroHambreMin, setFiltroHambreMin] = useState<string>('');
  const [filtroHambreMax, setFiltroHambreMax] = useState<string>('');
  const [filtroSaciedadMin, setFiltroSaciedadMin] = useState<string>('');
  const [filtroSaciedadMax, setFiltroSaciedadMax] = useState<string>('');

  useEffect(() => {
    cargarHistorial();
  }, [clienteId, dias]);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const data = await getHistorialNutricional(clienteId, dias);
      setHistorial(data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    } finally {
      setCargando(false);
    }
  };

  // Aplicar filtros al historial
  const historialFiltrado = useMemo(() => {
    return historial.filter((h) => {
      const checkIn = h.checkIn;
      
      // Filtro por tipo de comida
      if (filtroTipoComida && checkIn.tipoComida !== filtroTipoComida) {
        return false;
      }
      
      // Filtro por rango de fechas
      if (filtroFechaDesde) {
        const fechaDesde = new Date(filtroFechaDesde);
        const fechaCheckIn = new Date(h.fecha);
        if (fechaCheckIn < fechaDesde) {
          return false;
        }
      }
      
      if (filtroFechaHasta) {
        const fechaHasta = new Date(filtroFechaHasta);
        fechaHasta.setHours(23, 59, 59, 999); // Incluir todo el día
        const fechaCheckIn = new Date(h.fecha);
        if (fechaCheckIn > fechaHasta) {
          return false;
        }
      }
      
      // Filtro por nivel de hambre
      if (filtroHambreMin && checkIn.hambreAntes < parseInt(filtroHambreMin)) {
        return false;
      }
      
      if (filtroHambreMax && checkIn.hambreAntes > parseInt(filtroHambreMax)) {
        return false;
      }
      
      // Filtro por nivel de saciedad
      if (filtroSaciedadMin && checkIn.saciedad < parseInt(filtroSaciedadMin)) {
        return false;
      }
      
      if (filtroSaciedadMax && checkIn.saciedad > parseInt(filtroSaciedadMax)) {
        return false;
      }
      
      return true;
    });
  }, [historial, filtroTipoComida, filtroFechaDesde, filtroFechaHasta, filtroHambreMin, filtroHambreMax, filtroSaciedadMin, filtroSaciedadMax]);

  const limpiarFiltros = () => {
    setFiltroTipoComida('');
    setFiltroFechaDesde('');
    setFiltroFechaHasta('');
    setFiltroHambreMin('');
    setFiltroHambreMax('');
    setFiltroSaciedadMin('');
    setFiltroSaciedadMax('');
  };

  const tieneFiltrosActivos = filtroTipoComida || filtroFechaDesde || filtroFechaHasta || 
    filtroHambreMin || filtroHambreMax || filtroSaciedadMin || filtroSaciedadMax;

  const getTipoComidaLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      desayuno: 'Desayuno',
      almuerzo: 'Almuerzo',
      merienda: 'Merienda',
      cena: 'Cena',
      snack: 'Snack',
    };
    return labels[tipo] || tipo;
  };

  const getTendenciaBadge = (tendencia?: string) => {
    if (!tendencia) return null;
    switch (tendencia) {
      case 'mejora':
        return <Badge variant="success">Mejora</Badge>;
      case 'empeora':
        return <Badge variant="error">Empeora</Badge>;
      default:
        return <Badge variant="warning">Estable</Badge>;
    }
  };

  const columns = [
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-900">
            {new Date(value).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Comida',
      render: (checkIn: any) => (
        <div>
          <span className="text-sm font-semibold text-gray-900">
            {getTipoComidaLabel(checkIn.tipoComida)}
          </span>
          {checkIn.fotoComida && (
            <div className="flex items-center gap-1 mt-1">
              <Image size={12} className="text-gray-400" />
              <span className="text-xs text-gray-500">
                Foto disponible
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Hambre / Saciedad',
      render: (checkIn: any) => (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-900">
            {checkIn.hambreAntes}/10
          </span>
          <span className="text-gray-400">→</span>
          <span className="text-sm text-gray-900">
            {checkIn.saciedad}/10
          </span>
        </div>
      ),
    },
    {
      key: 'checkIn',
      label: 'Peso',
      render: (checkIn: any) => (
        checkIn.peso ? (
          <div className="flex items-center gap-1">
            <Scale size={16} className="text-gray-400" />
            <span className="text-sm text-gray-900">
              {checkIn.peso.toFixed(1)} kg
            </span>
          </div>
        ) : (
          <span className="text-xs text-gray-500">
            No registrado
          </span>
        )
      ),
    },
    {
      key: 'adherencia',
      label: 'Adherencia',
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${
            value >= 80 ? 'text-green-600' :
            value >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {value.toFixed(0)}%
          </span>
        </div>
      ),
    },
    {
      key: 'tendencia',
      label: 'Tendencia',
      render: (tendencia: string) => getTendenciaBadge(tendencia),
    },
  ];

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-xl ring-1 ring-purple-200/70">
            <Clock size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Historial Nutricional
            </h3>
            <p className="text-xs text-gray-500">
              {tieneFiltrosActivos 
                ? `${historialFiltrado.length} registro(s) encontrado(s)`
                : `Últimos ${dias} días`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {tieneFiltrosActivos && (
            <Button
              variant="ghost"
              size="sm"
              onClick={limpiarFiltros}
            >
              <X size={16} className="mr-1" />
              Limpiar filtros
            </Button>
          )}
          <Button
            variant={mostrarFiltros ? "primary" : "secondary"}
            size="sm"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
          >
            <Filter size={16} className="mr-1" />
            Filtros
          </Button>
        </div>
      </div>

      {mostrarFiltros && (
        <Card className="p-4 mb-4 bg-gray-50 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Tipo de Comida"
              value={filtroTipoComida}
              onChange={(e) => setFiltroTipoComida(e.target.value)}
              options={[
                { value: '', label: 'Todos' },
                { value: 'desayuno', label: 'Desayuno' },
                { value: 'almuerzo', label: 'Almuerzo' },
                { value: 'merienda', label: 'Merienda' },
                { value: 'cena', label: 'Cena' },
                { value: 'snack', label: 'Snack' },
              ]}
            />
            
            <Input
              type="date"
              label="Fecha Desde"
              value={filtroFechaDesde}
              onChange={(e) => setFiltroFechaDesde(e.target.value)}
            />
            
            <Input
              type="date"
              label="Fecha Hasta"
              value={filtroFechaHasta}
              onChange={(e) => setFiltroFechaHasta(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                label="Hambre Mín"
                value={filtroHambreMin}
                onChange={(e) => setFiltroHambreMin(e.target.value)}
                placeholder="0"
                min="0"
                max="10"
              />
              <Input
                type="number"
                label="Hambre Máx"
                value={filtroHambreMax}
                onChange={(e) => setFiltroHambreMax(e.target.value)}
                placeholder="10"
                min="0"
                max="10"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                label="Saciedad Mín"
                value={filtroSaciedadMin}
                onChange={(e) => setFiltroSaciedadMin(e.target.value)}
                placeholder="0"
                min="0"
                max="10"
              />
              <Input
                type="number"
                label="Saciedad Máx"
                value={filtroSaciedadMax}
                onChange={(e) => setFiltroSaciedadMax(e.target.value)}
                placeholder="10"
                min="0"
                max="10"
              />
            </div>
          </div>
        </Card>
      )}

      <Table
        data={historialFiltrado.map((h) => ({
          checkIn: h.checkIn,
          fecha: h.fecha,
          adherencia: h.adherencia,
          tendencia: h.tendencia,
        }))}
        columns={columns}
        loading={cargando}
        emptyMessage="No hay historial nutricional disponible"
      />
    </Card>
  );
};

