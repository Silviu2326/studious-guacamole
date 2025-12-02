import React, { useState, useRef } from 'react';
import { Modal, Button, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { useCajaBancos } from '../hooks/useCajaBancos';

interface ImportarMovimientosModalProps {
  onClose: () => void;
  onImportComplete: () => void;
}

export const ImportarMovimientosModal: React.FC<ImportarMovimientosModalProps> = ({
  onClose,
  onImportComplete
}) => {
  const { importarMovimientosBancarios } = useCajaBancos();
  const [loading, setLoading] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [paso, setPaso] = useState<'seleccionar' | 'procesando' | 'completado'>('seleccionar');
  const [resultados, setResultados] = useState<{
    importados: number;
    errores: string[];
  }>({ importados: 0, errores: [] });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Por favor seleccione un archivo CSV o Excel (.csv, .xls, .xlsx)');
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }
      
      setArchivo(file);
    }
  };

  const handleImport = async () => {
    if (!archivo) return;
    
    setLoading(true);
    setPaso('procesando');
    
    try {
      const movimientosImportados = await importarMovimientosBancarios(archivo);
      
      setResultados({
        importados: movimientosImportados.length,
        errores: []
      });
      
      setPaso('completado');
      onImportComplete();
    } catch (error) {
      setResultados({
        importados: 0,
        errores: [error instanceof Error ? error.message : 'Error desconocido']
      });
      setPaso('completado');
    } finally {
      setLoading(false);
    }
  };

  const renderSeleccionar = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        </div>
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          Importar Movimientos Bancarios
        </h3>
        <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          Seleccione un archivo CSV o Excel con los movimientos bancarios
        </p>
      </div>

      {/* Área de carga */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          archivo
            ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xls,.xlsx"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {archivo ? (
          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className={`${ds.typography.body} font-medium text-green-700 dark:text-green-300`}>
              {archivo.name}
            </div>
            <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {(archivo.size / 1024).toFixed(1)} KB
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setArchivo(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
            >
              Cambiar archivo
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className={`${ds.typography.body} font-medium`}>
              Haga clic para seleccionar archivo
            </div>
            <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              CSV, XLS o XLSX (máximo 5MB)
            </div>
          </div>
        )}
      </div>

      {/* Formato esperado */}
      <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
        <h4 className={`${ds.typography.body} font-semibold mb-3`}>
          Formato esperado del archivo:
        </h4>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-6 gap-2 font-medium text-gray-600 dark:text-gray-400">
            <div>Fecha</div>
            <div>Banco</div>
            <div>Cuenta</div>
            <div>Concepto</div>
            <div>Tipo</div>
            <div>Monto</div>
          </div>
          <div className="grid grid-cols-6 gap-2 text-gray-800 dark:text-gray-200">
            <div>15/01/2024</div>
            <div>Bancolombia</div>
            <div>****1234</div>
            <div>Transferencia</div>
            <div>ingreso</div>
            <div>500000</div>
          </div>
        </div>
      </Card>

      {/* Instrucciones */}
      <div className="space-y-3">
        <h4 className={`${ds.typography.body} font-semibold`}>
          Instrucciones:
        </h4>
        <ul className={`space-y-1 ${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          <li>• El archivo debe contener las columnas: Fecha, Banco, Cuenta, Concepto, Tipo, Monto</li>
          <li>• Las fechas deben estar en formato DD/MM/YYYY</li>
          <li>• El tipo debe ser "ingreso" o "egreso"</li>
          <li>• Los montos deben ser números sin formato (ej: 500000, no $500.000)</li>
          <li>• La primera fila debe contener los encabezados</li>
        </ul>
      </div>
    </div>
  );

  const renderProcesando = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
        Procesando archivo...
      </h3>
      <p className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
        Importando movimientos bancarios, por favor espere
      </p>
    </div>
  );

  const renderCompletado = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          resultados.errores.length > 0
            ? 'bg-yellow-100 dark:bg-yellow-900/30'
            : 'bg-green-100 dark:bg-green-900/30'
        }`}>
          {resultados.errores.length > 0 ? (
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          {resultados.errores.length > 0 ? 'Importación con advertencias' : 'Importación completada'}
        </h3>
      </div>

      {/* Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-green-50 dark:bg-green-900/20">
          <div className="text-center">
            <div className={`${ds.typography.h2} text-green-600 font-bold mb-1`}>
              {resultados.importados}
            </div>
            <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Movimientos importados
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-red-50 dark:bg-red-900/20">
          <div className="text-center">
            <div className={`${ds.typography.h2} text-red-600 font-bold mb-1`}>
              {resultados.errores.length}
            </div>
            <div className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Errores encontrados
            </div>
          </div>
        </Card>
      </div>

      {/* Errores */}
      {resultados.errores.length > 0 && (
        <Card className="p-4 bg-red-50 dark:bg-red-900/20">
          <h4 className={`${ds.typography.body} font-semibold text-red-700 dark:text-red-300 mb-3`}>
            Errores encontrados:
          </h4>
          <ul className="space-y-1">
            {resultados.errores.map((error, index) => (
              <li key={index} className={`${ds.typography.bodySmall} text-red-600 dark:text-red-400`}>
                • {error}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Siguiente paso */}
      {resultados.importados > 0 && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900/20">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className={`${ds.typography.body} font-semibold text-blue-700 dark:text-blue-300 mb-1`}>
                Siguiente paso
              </h4>
              <p className={`${ds.typography.bodySmall} text-blue-600 dark:text-blue-400`}>
                Los movimientos han sido importados como "pendientes de conciliar". 
                Vaya a la pestaña de movimientos para revisarlos y marcarlos como conciliados.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Importar Movimientos Bancarios"
      size="lg"
    >
      <div className="space-y-6">
        {paso === 'seleccionar' && renderSeleccionar()}
        {paso === 'procesando' && renderProcesando()}
        {paso === 'completado' && renderCompletado()}

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {paso === 'seleccionar' && (
            <>
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleImport}
                disabled={!archivo || loading}
              >
                Importar Archivo
              </Button>
            </>
          )}
          
          {paso === 'completado' && (
            <Button
              variant="primary"
              onClick={onClose}
            >
              Cerrar
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};