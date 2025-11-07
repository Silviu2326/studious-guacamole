import React, { useState } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { Bell, BellOff } from 'lucide-react';
import { 
  type ListaCompra,
  configurarRecordatorio
} from '../api';

interface RecordatoriosListaProps {
  lista: ListaCompra;
  onRecordatorioConfigurado?: () => void;
}

export const RecordatoriosLista: React.FC<RecordatoriosListaProps> = ({
  lista,
  onRecordatorioConfigurado,
}) => {
  const [activo, setActivo] = useState(lista.recordatoriosActivos);
  const [frecuencia, setFrecuencia] = useState<'semanal' | 'quincenal' | 'mensual'>('semanal');
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      const exito = await configurarRecordatorio(lista.id, activo, frecuencia);
      if (exito) {
        onRecordatorioConfigurado?.();
        alert('Recordatorios configurados correctamente');
      } else {
        alert('Error al configurar recordatorios');
      }
    } catch (error) {
      console.error('Error configurando recordatorios:', error);
      alert('Error al configurar recordatorios');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        {activo ? (
          <Bell className="w-6 h-6 text-blue-600" />
        ) : (
          <BellOff className="w-6 h-6 text-gray-400" />
        )}
        <h2 className="text-2xl font-semibold text-gray-900">
          Recordatorios Automáticos
        </h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="recordatoriosActivos"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label
            htmlFor="recordatoriosActivos"
            className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}
          >
            Activar recordatorios automáticos
          </label>
        </div>

        {activo && (
          <>
            <Select
              label="Frecuencia de Recordatorio"
              options={[
                { value: 'semanal', label: 'Semanal' },
                { value: 'quincenal', label: 'Quincenal' },
                { value: 'mensual', label: 'Mensual' },
              ]}
              value={frecuencia}
              onChange={(e) =>
                setFrecuencia(e.target.value as 'semanal' | 'quincenal' | 'mensual')
              }
            />

            {lista.proximoRecordatorio && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className={`text-sm text-blue-700 dark:text-blue-300 ${ds.typography.bodySmall}`}>
                  <strong>Próximo recordatorio:</strong>{' '}
                  {new Date(lista.proximoRecordatorio).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </>
        )}

        <Button onClick={handleGuardar} loading={guardando} fullWidth>
          {activo ? (
            <Bell className="w-4 h-4 mr-2" />
          ) : (
            <BellOff className="w-4 h-4 mr-2" />
          )}
          Guardar Configuración
        </Button>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className={`text-sm text-gray-600 dark:text-gray-400 ${ds.typography.bodySmall}`}>
            Los recordatorios se enviarán automáticamente al cliente por email o app móvil
            según la frecuencia configurada, recordándole que es hora de hacer la compra.
          </p>
        </div>
      </div>
    </Card>
  );
};

