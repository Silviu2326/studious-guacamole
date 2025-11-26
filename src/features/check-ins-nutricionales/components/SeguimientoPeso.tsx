import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { Scale, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RegistroPeso, crearRegistroPeso, getRegistrosPeso, getTendenciaPeso } from '../api/peso';

interface SeguimientoPesoProps {
  clienteId: string;
  soloLectura?: boolean;
}

export const SeguimientoPeso: React.FC<SeguimientoPesoProps> = ({
  clienteId,
  soloLectura = false,
}) => {
  const [peso, setPeso] = useState('');
  const [registros, setRegistros] = useState<RegistroPeso[]>([]);
  const [tendencia, setTendencia] = useState<any>(null);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [clienteId]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [registrosData, tendenciaData] = await Promise.all([
        getRegistrosPeso(clienteId),
        getTendenciaPeso(clienteId, 30),
      ]);
      setRegistros(registrosData);
      setTendencia(tendenciaData);
    } catch (error) {
      console.error('Error al cargar datos de peso:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async () => {
    if (!peso || soloLectura) return;
    
    setGuardando(true);
    try {
      const nuevoRegistro = await crearRegistroPeso({
        clienteId,
        fecha: new Date().toISOString().split('T')[0],
        peso: parseFloat(peso),
      });
      
      if (nuevoRegistro) {
        setRegistros([nuevoRegistro, ...registros]);
        setPeso('');
        await cargarDatos();
      }
    } catch (error) {
      console.error('Error al guardar peso:', error);
    } finally {
      setGuardando(false);
    }
  };

  const getTendenciaIcon = () => {
    if (!tendencia) return <Minus className="w-5 h-5" />;
    switch (tendencia.tendencia) {
      case 'subiendo':
        return <TrendingUp className="w-5 h-5 text-red-500" />;
      case 'bajando':
        return <TrendingDown className="w-5 h-5 text-green-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTendenciaColor = () => {
    if (!tendencia) return 'text-gray-500';
    switch (tendencia.tendencia) {
      case 'subiendo':
        return 'text-red-500';
      case 'bajando':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (cargando) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <Scale size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Registro de Peso
                </h3>
                <p className="text-xs text-gray-500">
                  Seguimiento diario del peso corporal
                </p>
              </div>
            </div>
            {tendencia && (
              <div className="text-right">
                <div className={`flex items-center gap-2 ${getTendenciaColor()}`}>
                  {getTendenciaIcon()}
                  <span className="text-xl font-bold">
                    {tendencia.pesoActual.toFixed(1)} kg
                  </span>
                </div>
                {tendencia.diferencia !== 0 && (
                  <p className={`text-xs ${getTendenciaColor()}`}>
                    {tendencia.diferencia > 0 ? '+' : ''}{tendencia.diferencia.toFixed(1)} kg
                  </p>
                )}
              </div>
            )}
          </div>

          {!soloLectura && (
            <div className="flex gap-3">
              <Input
                type="number"
                step="0.1"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                placeholder="Peso en kg"
                leftIcon={<Scale size={20} />}
                className="flex-1"
              />
              <Button
                onClick={handleGuardar}
                loading={guardando}
                disabled={!peso}
              >
                Registrar
              </Button>
            </div>
          )}
        </div>
      </Card>

      {registros.length > 0 && (
        <Card className="p-4 bg-white shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Historial de Peso
          </h4>
          <div className="space-y-2">
            {registros.slice(0, 7).map((registro) => (
              <div
                key={registro.id}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(registro.fecha).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  {registro.observaciones && (
                    <p className="text-xs text-gray-500 mt-1">
                      {registro.observaciones}
                    </p>
                  )}
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {registro.peso.toFixed(1)} kg
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

