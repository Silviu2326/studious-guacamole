import React, { useState, useRef } from 'react';
import { Modal, Button, Badge, Table } from '../../../components/componentsreutilizables';
import { Upload, FileSpreadsheet, Link as LinkIcon, CheckCircle2, AlertTriangle, X, Loader2, Database } from 'lucide-react';
import { KPI } from '../types';
import { validateImportedKPIs, importKPIsFromFile, importKPIsFromConnector } from '../api/kpiImport';

interface KPIImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
  role: 'entrenador' | 'gimnasio';
}

interface ImportedKPI {
  name: string;
  description?: string;
  metric: string;
  unit: string;
  category: string;
  target?: number;
  enabled?: boolean;
  critical?: boolean;
  criticalThreshold?: number;
  rawData: Record<string, any>;
}

interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  kpis: ImportedKPI[];
}

export const KPIImportModal: React.FC<KPIImportModalProps> = ({
  isOpen,
  onClose,
  onImportComplete,
  role,
}) => {
  const [importSource, setImportSource] = useState<'file' | 'connector'>('file');
  const [importStep, setImportStep] = useState<'select' | 'validate' | 'importing' | 'complete'>('select');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [selectedKPIs, setSelectedKPIs] = useState<Set<number>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [connectorType, setConnectorType] = useState<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const importedKPIs = await importKPIsFromFile(file);
      const validation = await validateImportedKPIs(importedKPIs, role);
      setValidationResult(validation);
      setImportStep('validate');
      
      // Seleccionar todos los KPIs válidos por defecto
      const validIndices = validation.kpis
        .map((_, idx) => idx)
        .filter(idx => {
          const kpiErrors = validation.errors.filter(e => e.field.startsWith(`kpi[${idx}]`));
          return kpiErrors.length === 0;
        });
      setSelectedKPIs(new Set(validIndices));
    } catch (error) {
      console.error('Error importing file:', error);
      alert('Error al importar el archivo. Por favor, verifica el formato.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleConnectorImport = async () => {
    if (!connectorType) {
      alert('Por favor, selecciona un conector');
      return;
    }

    try {
      setIsImporting(true);
      const importedKPIs = await importKPIsFromConnector(connectorType, role);
      const validation = await validateImportedKPIs(importedKPIs, role);
      setValidationResult(validation);
      setImportStep('validate');
      
      // Seleccionar todos los KPIs válidos por defecto
      const validIndices = validation.kpis
        .map((_, idx) => idx)
        .filter(idx => {
          const kpiErrors = validation.errors.filter(e => e.field.startsWith(`kpi[${idx}]`));
          return kpiErrors.length === 0;
        });
      setSelectedKPIs(new Set(validIndices));
    } catch (error) {
      console.error('Error importing from connector:', error);
      alert('Error al importar desde el conector. Por favor, verifica la conexión.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleToggleKPI = (index: number) => {
    const newSelected = new Set(selectedKPIs);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedKPIs(newSelected);
  };

  const handleConfirmImport = async () => {
    if (!validationResult || selectedKPIs.size === 0) {
      alert('Por favor, selecciona al menos un KPI para importar');
      return;
    }

    try {
      setIsImporting(true);
      setImportStep('importing');
      
      const kpisToImport = validationResult.kpis.filter((_, idx) => selectedKPIs.has(idx));
      
      // Aquí se llamaría a la API real para importar los KPIs
      // Por ahora simulamos la importación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Guardar en localStorage (simulación)
      const savedKPIs = localStorage.getItem(`kpi-config-${role}`) || '[]';
      const existingKPIs: KPI[] = JSON.parse(savedKPIs);
      
      kpisToImport.forEach((importedKPI) => {
        const newKPI: KPI = {
          id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: importedKPI.name,
          description: importedKPI.description,
          metric: importedKPI.metric,
          unit: importedKPI.unit,
          category: importedKPI.category,
          target: importedKPI.target,
          enabled: importedKPI.enabled ?? true,
          role: [role],
          order: existingKPIs.length + 1,
          visible: true,
          critical: importedKPI.critical ?? false,
          criticalThreshold: importedKPI.criticalThreshold,
          isCustom: true,
        };
        existingKPIs.push(newKPI);
      });
      
      localStorage.setItem(`kpi-config-${role}`, JSON.stringify(existingKPIs));
      
      setImportStep('complete');
      setTimeout(() => {
        onImportComplete();
        handleReset();
      }, 2000);
    } catch (error) {
      console.error('Error importing KPIs:', error);
      alert('Error al importar los KPIs. Por favor, intenta de nuevo.');
      setImportStep('validate');
    } finally {
      setIsImporting(false);
    }
  };

  const handleReset = () => {
    setImportStep('select');
    setValidationResult(null);
    setSelectedKPIs(new Set());
    setConnectorType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (!isImporting) {
      handleReset();
      onClose();
    }
  };

  const getKPIErrors = (index: number): ValidationError[] => {
    if (!validationResult) return [];
    return validationResult.errors.filter(e => e.field.startsWith(`kpi[${index}]`));
  };

  const getKPIWarnings = (index: number): ValidationError[] => {
    if (!validationResult) return [];
    return validationResult.warnings.filter(e => e.field.startsWith(`kpi[${index}]`));
  };

  const isValidKPI = (index: number): boolean => {
    return getKPIErrors(index).length === 0;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Importar KPIs"
      size="xl"
      footer={
        importStep === 'validate' ? (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setImportStep('select')} disabled={isImporting}>
              Volver
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmImport}
              disabled={isImporting || selectedKPIs.size === 0}
              loading={isImporting}
            >
              {isImporting ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} className="mr-2" />
                  Importar {selectedKPIs.size} KPI{selectedKPIs.size !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        ) : importStep === 'complete' ? (
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
        ) : null
      }
    >
      <div className="space-y-6">
        {importStep === 'select' && (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Importar KPIs desde fuentes externas
                  </h4>
                  <p className="text-xs text-blue-700">
                    Importa KPIs desde hojas de cálculo (CSV, Excel) o conectores externos. 
                    Los KPIs serán validados antes de integrarlos para garantizar consistencia.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setImportSource('file')}
                className={`p-6 border-2 rounded-lg transition-all ${
                  importSource === 'file'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FileSpreadsheet className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Hoja de Cálculo</h3>
                <p className="text-sm text-gray-600">
                  Importa desde archivos CSV o Excel
                </p>
              </button>

              <button
                onClick={() => setImportSource('connector')}
                className={`p-6 border-2 rounded-lg transition-all ${
                  importSource === 'connector'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <LinkIcon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold text-gray-900 mb-2">Conector Externo</h3>
                <p className="text-sm text-gray-600">
                  Conecta con sistemas externos
                </p>
              </button>
            </div>

            {importSource === 'file' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="kpi-file-input"
                />
                <label
                  htmlFor="kpi-file-input"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-sm font-medium text-gray-700 mb-1">
                    Haz clic para seleccionar un archivo
                  </span>
                  <span className="text-xs text-gray-500">
                    Formatos soportados: CSV, Excel (.xlsx, .xls)
                  </span>
                </label>
                {isImporting && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Procesando archivo...</span>
                  </div>
                )}
              </div>
            )}

            {importSource === 'connector' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Conector
                  </label>
                  <select
                    value={connectorType}
                    onChange={(e) => setConnectorType(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Selecciona un conector</option>
                    <option value="google_sheets">Google Sheets</option>
                    <option value="airtable">Airtable</option>
                    <option value="notion">Notion</option>
                    <option value="api">API Externa</option>
                  </select>
                </div>
                <Button
                  variant="primary"
                  onClick={handleConnectorImport}
                  disabled={!connectorType || isImporting}
                  loading={isImporting}
                  className="w-full"
                >
                  {isImporting ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <LinkIcon size={18} className="mr-2" />
                      Conectar e Importar
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {importStep === 'validate' && validationResult && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border-2 ${
              validationResult.isValid
                ? 'bg-green-50 border-green-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start gap-3">
                {validationResult.isValid ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Validación Completada
                  </h4>
                  <p className="text-xs text-gray-700">
                    {validationResult.kpis.length} KPI{validationResult.kpis.length !== 1 ? 's' : ''} encontrado{validationResult.kpis.length !== 1 ? 's' : ''}
                    {validationResult.errors.length > 0 && (
                      <> • {validationResult.errors.length} error{validationResult.errors.length !== 1 ? 'es' : ''}</>
                    )}
                    {validationResult.warnings.length > 0 && (
                      <> • {validationResult.warnings.length} advertencia{validationResult.warnings.length !== 1 ? 's' : ''}</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <Table
                data={validationResult.kpis.map((kpi, idx) => ({
                  ...kpi,
                  _index: idx,
                  _isValid: isValidKPI(idx),
                  _errors: getKPIErrors(idx),
                  _warnings: getKPIWarnings(idx),
                }))}
                columns={[
                  {
                    key: '_select',
                    label: '',
                    render: (_: any, row: any) => (
                      <input
                        type="checkbox"
                        checked={selectedKPIs.has(row._index)}
                        onChange={() => handleToggleKPI(row._index)}
                        disabled={!row._isValid}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                    ),
                  },
                  {
                    key: 'name',
                    label: 'Nombre',
                    render: (value: string, row: any) => (
                      <div>
                        <div className="font-medium text-gray-900">{value}</div>
                        {!row._isValid && (
                          <div className="text-xs text-red-600 mt-1">
                            {row._errors.map((e: ValidationError) => e.message).join(', ')}
                          </div>
                        )}
                        {row._warnings.length > 0 && (
                          <div className="text-xs text-yellow-600 mt-1">
                            {row._warnings.map((e: ValidationError) => e.message).join(', ')}
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'metric',
                    label: 'Métrica',
                    render: (value: string) => (
                      <span className="text-sm text-gray-700">{value}</span>
                    ),
                  },
                  {
                    key: 'unit',
                    label: 'Unidad',
                    render: (value: string) => (
                      <span className="text-sm text-gray-700">{value}</span>
                    ),
                  },
                  {
                    key: 'category',
                    label: 'Categoría',
                    render: (value: string) => (
                      <Badge variant="blue">{value}</Badge>
                    ),
                  },
                  {
                    key: '_status',
                    label: 'Estado',
                    render: (_: any, row: any) => (
                      row._isValid ? (
                        <Badge variant="green">Válido</Badge>
                      ) : (
                        <Badge variant="red">Error</Badge>
                      )
                    ),
                  },
                ]}
                loading={false}
                emptyMessage="No se encontraron KPIs"
              />
            </div>

            <div className="text-sm text-gray-600">
              <strong>{selectedKPIs.size}</strong> de {validationResult.kpis.length} KPI{validationResult.kpis.length !== 1 ? 's' : ''} seleccionado{selectedKPIs.size !== 1 ? 's' : ''} para importar
            </div>
          </div>
        )}

        {importStep === 'importing' && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Importando KPIs...</p>
          </div>
        )}

        {importStep === 'complete' && (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Importación completada!
            </h3>
            <p className="text-gray-600">
              Los KPIs se han importado correctamente y están disponibles en el configurador.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

