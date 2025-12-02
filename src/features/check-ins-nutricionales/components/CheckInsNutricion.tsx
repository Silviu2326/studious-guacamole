import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Modal } from '../../../components/componentsreutilizables';
import { Plus, Calendar, Image as ImageIcon, Scale, Droplet, Settings } from 'lucide-react';
import { CheckInNutricional, crearCheckInNutricional, getCheckInsNutricionales, actualizarCheckInNutricional } from '../api/checkins';
import { FotosComida } from './FotosComida';
import { ComparadorFotos } from './ComparadorFotos';
import { SeguimientoPeso } from './SeguimientoPeso';
import { EvaluacionHambre } from './EvaluacionHambre';
import { FeedbackEntrenador } from './FeedbackEntrenador';
import { Input, Textarea } from '../../../components/componentsreutilizables';
import { CamposPersonalizadosCheckInNutricional } from './CamposPersonalizadosCheckInNutricional';
import { GestorPlantillasCheckInNutricional } from './GestorPlantillasCheckInNutricional';
import { getPlantillaActivaPorCliente, PlantillaCheckInNutricional } from '../api/plantillas';

interface CheckInsNutricionProps {
  clienteId: string;
}

export const CheckInsNutricion: React.FC<CheckInsNutricionProps> = ({
  clienteId,
}) => {
  const [checkIns, setCheckIns] = useState<CheckInNutricional[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [checkInSeleccionado, setCheckInSeleccionado] = useState<CheckInNutricional | null>(null);
  const [cargando, setCargando] = useState(true);
  const [plantillaActiva, setPlantillaActiva] = useState<PlantillaCheckInNutricional | null>(null);
  const [mostrarGestorPlantillas, setMostrarGestorPlantillas] = useState(false);
  const [camposAdicionales, setCamposAdicionales] = useState<Record<string, any>>({});
  const [recargarComparador, setRecargarComparador] = useState(0);

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    tipoComida: 'desayuno' as 'desayuno' | 'almuerzo' | 'merienda' | 'cena' | 'snack',
    hambreAntes: 0,
    hambreDespues: 0,
    saciedad: 0,
    peso: '',
    observaciones: '',
  });

  useEffect(() => {
    cargarCheckIns();
    cargarPlantillaActiva();
  }, [clienteId]);

  const cargarPlantillaActiva = async () => {
    try {
      const tplActiva = await getPlantillaActivaPorCliente(clienteId);
      setPlantillaActiva(tplActiva);
    } catch (error) {
      console.error('Error al cargar plantilla activa:', error);
    }
  };

  const cargarCheckIns = async () => {
    setCargando(true);
    try {
      const data = await getCheckInsNutricionales(clienteId);
      setCheckIns(data);
    } catch (error) {
      console.error('Error al cargar check-ins:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearCheckIn = async () => {
    try {
      const nuevoCheckIn = await crearCheckInNutricional({
        clienteId,
        fecha: formData.fecha,
        tipoComida: formData.tipoComida,
        hambreAntes: formData.hambreAntes,
        hambreDespues: formData.hambreDespues || undefined,
        saciedad: formData.saciedad,
        peso: formData.peso ? parseFloat(formData.peso) : undefined,
        observaciones: formData.observaciones || undefined,
        camposAdicionales: Object.keys(camposAdicionales).length > 0 ? camposAdicionales : undefined,
      });

      if (nuevoCheckIn) {
        setCheckIns([nuevoCheckIn, ...checkIns]);
        setMostrarModal(false);
        resetearFormulario();
      }
    } catch (error) {
      console.error('Error al crear check-in:', error);
    }
  };

  const resetearFormulario = () => {
    setFormData({
      fecha: new Date().toISOString().split('T')[0],
      tipoComida: 'desayuno',
      hambreAntes: 0,
      hambreDespues: 0,
      saciedad: 0,
      peso: '',
      observaciones: '',
    });
    setCamposAdicionales({});
  };

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

  const checkInsHoy = checkIns.filter(
    (ci) => new Date(ci.fecha).toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {plantillaActiva && (
            <Card className="p-3 bg-blue-50 border border-blue-200">
              <div className="text-sm text-slate-700">
                Plantilla activa: <span className="font-semibold">{plantillaActiva.nombre}</span>
              </div>
            </Card>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setMostrarGestorPlantillas(true)}>
            <Settings size={18} className="mr-2" />
            Plantillas
          </Button>
          <Button onClick={() => setMostrarModal(true)}>
            <Plus size={20} className="mr-2" />
            Nuevo Check-in
          </Button>
        </div>
      </div>

      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">
              Check-ins de Hoy
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {checkInsHoy.length} registros
          </span>
        </div>

        {checkInsHoy.length === 0 ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay check-ins registrados</h3>
            <p className="text-gray-600 mb-4">No hay check-ins registrados para hoy</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {checkInsHoy.map((checkIn) => (
              <Card
                key={checkIn.id}
                variant="hover"
                className="p-4 bg-white shadow-sm cursor-pointer transition-shadow"
                onClick={() => setCheckInSeleccionado(checkIn)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                      {checkIn.tipoComida === 'desayuno' && <ImageIcon size={20} className="text-blue-600" />}
                      {checkIn.tipoComida === 'almuerzo' && <Scale size={20} className="text-blue-600" />}
                      {checkIn.tipoComida === 'merienda' && <Droplet size={20} className="text-blue-600" />}
                      {checkIn.tipoComida === 'cena' && <ImageIcon size={20} className="text-blue-600" />}
                      {checkIn.tipoComida === 'snack' && <Droplet size={20} className="text-blue-600" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {getTipoComidaLabel(checkIn.tipoComida)}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          Hambre: {checkIn.hambreAntes}/10
                        </span>
                        <span className="text-xs text-gray-500">
                          Saciedad: {checkIn.saciedad}/10
                        </span>
                        {checkIn.peso && (
                          <span className="text-xs text-gray-500">
                            Peso: {checkIn.peso} kg
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {checkIn.fotoComida && (
                    <ImageIcon size={20} className="text-green-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          resetearFormulario();
        }}
        title="Nuevo Check-in Nutricional"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha"
              value={formData.fecha}
              onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            />
            <Select
              label="Tipo de Comida"
              value={formData.tipoComida}
              onChange={(e) => setFormData({ ...formData, tipoComida: e.target.value as any })}
              options={[
                { value: 'desayuno', label: 'Desayuno' },
                { value: 'almuerzo', label: 'Almuerzo' },
                { value: 'merienda', label: 'Merienda' },
                { value: 'cena', label: 'Cena' },
                { value: 'snack', label: 'Snack' },
              ]}
            />
          </div>

          <EvaluacionHambre
            tipo="hambre"
            valor={formData.hambreAntes}
            onChange={(valor) => setFormData({ ...formData, hambreAntes: valor })}
            label="Hambre Antes de Comer"
          />

          <EvaluacionHambre
            tipo="saciedad"
            valor={formData.saciedad}
            onChange={(valor) => setFormData({ ...formData, saciedad: valor })}
            label="Saciedad Después de Comer"
          />

          <Input
            type="number"
            step="0.1"
            label="Peso (kg)"
            value={formData.peso}
            onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
            leftIcon={<Scale className="w-5 h-5" />}
            placeholder="Opcional"
          />

          <Textarea
            label="Observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            placeholder="Notas adicionales..."
            rows={3}
          />

          {plantillaActiva && (
            <CamposPersonalizadosCheckInNutricional
              plantilla={plantillaActiva}
              values={camposAdicionales}
              onChange={setCamposAdicionales}
            />
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                setMostrarModal(false);
                resetearFormulario();
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCrearCheckIn}
              disabled={formData.hambreAntes === 0 || formData.saciedad === 0}
            >
              Guardar Check-in
            </Button>
          </div>
        </div>
      </Modal>

      {checkInSeleccionado && (
        <Modal
          isOpen={!!checkInSeleccionado}
          onClose={() => setCheckInSeleccionado(null)}
          title={`Check-in: ${getTipoComidaLabel(checkInSeleccionado.tipoComida)}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Comparador de fotos */}
            {checkInSeleccionado.id && (
              <ComparadorFotos
                key={recargarComparador}
                clienteId={clienteId}
                checkIn={checkInSeleccionado}
              />
            )}
            
            {/* Subir nuevas fotos */}
            {checkInSeleccionado.id && (
              <FotosComida
                clienteId={clienteId}
                checkInId={checkInSeleccionado.id}
                soloLectura={false}
                onFotoSubida={() => {
                  // Recargar el comparador después de subir una foto
                  setRecargarComparador(prev => prev + 1);
                  cargarCheckIns();
                }}
              />
            )}
            
            <FeedbackEntrenador
              checkIn={checkInSeleccionado}
              onFeedbackEnviado={() => {
                cargarCheckIns();
                setCheckInSeleccionado(null);
              }}
            />
          </div>
        </Modal>
      )}

      <GestorPlantillasCheckInNutricional
        isOpen={mostrarGestorPlantillas}
        onClose={async () => {
          setMostrarGestorPlantillas(false);
          await cargarPlantillaActiva();
        }}
        clienteId={clienteId}
      />
    </div>
  );
};

