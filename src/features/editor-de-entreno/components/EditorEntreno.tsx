import React, { useState } from 'react';
import { Card, Tabs, Button } from '../../../components/componentsreutilizables';
import {
  SesionEntrenamiento,
  EjercicioEnSesion,
  ProgresionConfig,
  CheckInConfig,
} from '../api';
import { ConstructorSesion } from './ConstructorSesion';
import { SelectorEjercicios } from './SelectorEjercicios';
import { ConfiguradorProgresion } from './ConfiguradorProgresion';
import { CheckInsSemaforo } from './CheckInsSemaforo';
import { AsignadorDestinatario } from './AsignadorDestinatario';
import { crearSesion, actualizarSesion } from '../api';
import { Save, FileText } from 'lucide-react';

interface EditorEntrenoProps {
  sesionInicial?: SesionEntrenamiento;
  onGuardar?: (sesion: SesionEntrenamiento) => void;
}

export const EditorEntreno: React.FC<EditorEntrenoProps> = ({
  sesionInicial,
  onGuardar,
}) => {
  const [tabActiva, setTabActiva] = useState('construccion');
  const [sesion, setSesion] = useState<Partial<SesionEntrenamiento>>(
    sesionInicial || {
      nombre: '',
      tipo: 'fuerza',
      ejercicios: [],
      progresion: {
        habilitada: false,
        tipo: 'automatica',
        frecuencia: 'semanal',
      },
      checkIns: {
        habilitado: false,
        tipos: [],
      },
    }
  );

  const [guardando, setGuardando] = useState(false);

  const tabs = [
    {
      id: 'construccion',
      label: 'Construcción',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'ejercicios',
      label: 'Ejercicios',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'progresion',
      label: 'Progresión',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'checkins',
      label: 'Check-ins',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'asignacion',
      label: 'Asignación',
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const handleAgregarEjercicio = (ejercicio: any) => {
    const nuevoEjercicio: EjercicioEnSesion = {
      id: `ejercicio-${Date.now()}`,
      ejercicio,
      series: [
        {
          id: `serie-${Date.now()}`,
          repeticiones: 10,
          peso: 0,
          descanso: 60,
          rpe: 6,
        },
      ],
      orden: (sesion.ejercicios?.length || 0) + 1,
    };
    setSesion({
      ...sesion,
      ejercicios: [...(sesion.ejercicios || []), nuevoEjercicio],
    });
  };

  const handleGuardar = async () => {
    if (!sesion.nombre || sesion.ejercicios?.length === 0) {
      alert('Completa el nombre y agrega al menos un ejercicio');
      return;
    }

    setGuardando(true);
    try {
      const sesionCompleta = sesion as SesionEntrenamiento;
      let sesionGuardada;

      if (sesionInicial?.id) {
        await actualizarSesion(sesionInicial.id, sesionCompleta);
        sesionGuardada = { ...sesionCompleta, id: sesionInicial.id };
      } else {
        sesionGuardada = await crearSesion(sesionCompleta);
      }

      if (sesionGuardada && onGuardar) {
        onGuardar(sesionGuardada);
      }
    } catch (error) {
      console.error('Error al guardar sesión:', error);
      alert('Error al guardar la sesión');
    } finally {
      setGuardando(false);
    }
  };

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'construccion':
        return (
          <ConstructorSesion
            sesion={sesion}
            onChange={setSesion}
            onAgregarEjercicio={handleAgregarEjercicio}
          />
        );
      case 'ejercicios':
        return (
          <SelectorEjercicios
            onSeleccionar={handleAgregarEjercicio}
            ejerciciosSeleccionados={sesion.ejercicios?.map((ej) => ej.ejercicio) || []}
          />
        );
      case 'progresion':
        return (
          <ConfiguradorProgresion
            config={sesion.progresion || { habilitada: false, tipo: 'automatica', frecuencia: 'semanal' }}
            onChange={(config) => setSesion({ ...sesion, progresion: config })}
          />
        );
      case 'checkins':
        return (
          <CheckInsSemaforo
            config={sesion.checkIns || { habilitado: false, tipos: [] }}
            onChange={(config) => setSesion({ ...sesion, checkIns: config })}
          />
        );
      case 'asignacion':
        return (
          <AsignadorDestinatario
            tipoAsignacion={sesion.asignadoTipo}
            asignadoA={sesion.asignadoA}
            onChange={(tipo, id) => setSesion({ ...sesion, asignadoTipo: tipo, asignadoA: id })}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <Tabs items={tabs} activeTab={tabActiva} onTabChange={setTabActiva} variant="pills" />
        </div>
      </Card>

      {renderTabContent()}

      <Card className="p-4 bg-white shadow-sm">
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={() => window.history.back()}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar} loading={guardando}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Sesión
          </Button>
        </div>
      </Card>
    </div>
  );
};

