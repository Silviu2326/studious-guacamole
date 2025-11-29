import React, { useState, useCallback, useRef } from 'react';
import { Card, Button, Select, SelectOption } from '../../../components/componentsreutilizables';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ArrowRight, 
  ArrowLeft,
  Save
} from 'lucide-react';
import { parseCSV, mapCSVToTransactions, detectDuplicates, suggestCategory } from '../utils/csvParser';
import { importBankTransactions, getBankTransactions, saveBankMappingConfig, getBankMappingConfigs } from '../api/bankTransactions';
import { CSVParseResult, CSVColumnMapping, BankTransaction, TransactionImportPreview } from '../types/bankTransactions';
import { CategoriaGasto, CATEGORIAS_GASTO } from '../types/expenses';

interface BankCSVImportProps {
  onImportComplete?: () => void;
}

type ImportStep = 'upload' | 'mapping' | 'preview' | 'complete';

export const BankCSVImport: React.FC<BankCSVImportProps> = ({ onImportComplete }) => {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<CSVParseResult | null>(null);
  const [mapping, setMapping] = useState<CSVColumnMapping>({
    fecha: null,
    concepto: null,
    importe: null,
    tipo: null,
    referencia: null,
    saldo: null,
    banco: null,
    cuenta: null
  });
  const [previewTransactions, setPreviewTransactions] = useState<TransactionImportPreview[]>([]);
  const [importResult, setImportResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedConfigs, setSavedConfigs] = useState(getBankMappingConfigs());
  const [selectedConfig, setSelectedConfig] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar configuraciones guardadas al montar
  React.useEffect(() => {
    setSavedConfigs(getBankMappingConfigs());
  }, []);

  // Manejar selección de archivo
  const handleFileSelect = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setParseResult(null);
      setStep('upload');
      return;
    }

    // Validar tipo de archivo
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.type.includes('csv')) {
      setError('Por favor, selecciona un archivo CSV');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setLoading(true);

    try {
      const result = await parseCSV(selectedFile);
      setParseResult(result);
      
      // Auto-detectar columnas comunes
      const autoMapping = autoDetectColumns(result.columns);
      setMapping(autoMapping);
      
      setStep('mapping');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al parsear el archivo CSV');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-detectar columnas comunes
  const autoDetectColumns = (columns: string[]): CSVColumnMapping => {
    const mapping: CSVColumnMapping = {
      fecha: null,
      concepto: null,
      importe: null,
      tipo: null,
      referencia: null,
      saldo: null,
      banco: null,
      cuenta: null
    };

    columns.forEach(col => {
      const colLower = col.toLowerCase().trim();
      
      // Detectar fecha
      if (!mapping.fecha && (colLower.includes('fecha') || colLower.includes('date'))) {
        mapping.fecha = col;
      }
      
      // Detectar concepto
      if (!mapping.concepto && (colLower.includes('concepto') || colLower.includes('descripción') || 
          colLower.includes('descripcion') || colLower.includes('concept') || colLower.includes('description'))) {
        mapping.concepto = col;
      }
      
      // Detectar importe
      if (!mapping.importe && (colLower.includes('importe') || colLower.includes('cantidad') || 
          colLower.includes('amount') || colLower.includes('monto') || colLower.includes('valor'))) {
        mapping.importe = col;
      }
      
      // Detectar tipo
      if (!mapping.tipo && (colLower.includes('tipo') || colLower.includes('type') || 
          colLower.includes('movimiento') || colLower.includes('movement'))) {
        mapping.tipo = col;
      }
      
      // Detectar referencia
      if (!mapping.referencia && (colLower.includes('referencia') || colLower.includes('reference') || 
          colLower.includes('ref') || colLower.includes('número') || colLower.includes('numero'))) {
        mapping.referencia = col;
      }
      
      // Detectar saldo
      if (!mapping.saldo && (colLower.includes('saldo') || colLower.includes('balance'))) {
        mapping.saldo = col;
      }
      
      // Detectar banco
      if (!mapping.banco && (colLower.includes('banco') || colLower.includes('bank'))) {
        mapping.banco = col;
      }
      
      // Detectar cuenta
      if (!mapping.cuenta && (colLower.includes('cuenta') || colLower.includes('account'))) {
        mapping.cuenta = col;
      }
    });

    return mapping;
  };

  // Aplicar configuración guardada
  const handleApplyConfig = useCallback((configId: string) => {
    const config = savedConfigs.find((c: any) => c.id === configId);
    if (config) {
      setMapping(config.mapping);
      setSelectedConfig(configId);
    }
  }, [savedConfigs]);

  // Guardar configuración actual
  const handleSaveConfig = useCallback(async () => {
    if (!file) return;
    
    const bankName = prompt('Nombre del banco para esta configuración:');
    if (!bankName) return;

    try {
      await saveBankMappingConfig(bankName, mapping);
      setSavedConfigs(getBankMappingConfigs());
      alert('Configuración guardada correctamente');
    } catch (err) {
      alert('Error al guardar la configuración');
    }
  }, [mapping, file]);

  // Ir al preview
  const handlePreview = useCallback(async () => {
    if (!parseResult || !mapping.fecha || !mapping.concepto || !mapping.importe) {
      setError('Por favor, mapea al menos las columnas: Fecha, Concepto e Importe');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mapear CSV a transacciones
      const transactions = mapCSVToTransactions(parseResult.rows, mapping);
      
      // Obtener transacciones existentes
      const existingTransactions = await getBankTransactions();
      
      // Detectar duplicados y sugerir categorías
      const previews: TransactionImportPreview[] = transactions.map(transaction => {
        // Detectar duplicados
        const isDuplicate = existingTransactions.some(existing => {
          const dateDiff = Math.abs(transaction.fecha.getTime() - existing.fecha.getTime());
          const amountDiff = Math.abs(transaction.importe - existing.importe);
          const conceptSimilar = transaction.concepto.toLowerCase().includes(existing.concepto.toLowerCase().substring(0, 10)) ||
                                existing.concepto.toLowerCase().includes(transaction.concepto.toLowerCase().substring(0, 10));
          
          return dateDiff < 24 * 60 * 60 * 1000 && amountDiff < 0.01 && conceptSimilar;
        });
        
        // Sugerir categoría para egresos
        let suggestedCategory: any = undefined;
        let confidence = 0;
        let reason = '';
        
        if (transaction.tipo === 'egreso') {
          const suggestion = suggestCategory(transaction.concepto, transaction.importe, transaction.tipo);
          suggestedCategory = suggestion.categoria;
          confidence = suggestion.confidence;
          reason = suggestion.reason;
          transaction.categoria = suggestedCategory;
          transaction.deducible = true; // Por defecto, los egresos son deducibles
        }
        
        return {
          transaction,
          isDuplicate,
          duplicateReason: isDuplicate ? 'Transacción similar encontrada' : undefined,
          suggestedCategory,
          confidence,
          reason
        };
      });
      
      setPreviewTransactions(previews);
      setStep('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la vista previa');
    } finally {
      setLoading(false);
    }
  }, [parseResult, mapping]);

  // Importar transacciones
  const handleImport = useCallback(async () => {
    if (previewTransactions.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Filtrar duplicados
      const transactionsToImport = previewTransactions
        .filter(p => !p.isDuplicate)
        .map(p => p.transaction);
      
      if (transactionsToImport.length === 0) {
        setError('No hay transacciones nuevas para importar (todas son duplicados)');
        setLoading(false);
        return;
      }
      
      const result = await importBankTransactions(transactionsToImport);
      setImportResult(result);
      setStep('complete');
      
      if (onImportComplete) {
        onImportComplete();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al importar las transacciones');
    } finally {
      setLoading(false);
    }
  }, [previewTransactions, onImportComplete]);

  // Resetear el proceso
  const handleReset = useCallback(() => {
    setFile(null);
    setParseResult(null);
    setMapping({
      fecha: null,
      concepto: null,
      importe: null,
      tipo: null,
      referencia: null,
      saldo: null,
      banco: null,
      cuenta: null
    });
    setPreviewTransactions([]);
    setImportResult(null);
    setError(null);
    setStep('upload');
    setSelectedConfig('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Opciones para los selectores de mapeo
  const columnOptions: SelectOption[] = [
    { value: '', label: '-- No mapear --' },
    ...(parseResult?.columns || []).map(col => ({ value: col, label: col }))
  ];

  // Opciones de configuraciones guardadas
  const configOptions: SelectOption[] = [
    { value: '', label: '-- Seleccionar configuración --' },
    ...savedConfigs.map((config: any) => ({ value: config.id, label: config.bankName }))
  ];

  // Campos requeridos mapeados
  const requiredFieldsMapped = mapping.fecha && mapping.concepto && mapping.importe;

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Upload size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Importar Movimientos Bancarios desde CSV
              </h3>
              <p className="text-sm text-gray-600">
                Importa transacciones desde un archivo CSV de tu banco
              </p>
            </div>
          </div>
          {step !== 'upload' && (
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X size={18} className="mr-2" />
              Nuevo Import
            </Button>
          )}
        </div>

        {/* Indicador de pasos */}
        <div className="flex items-center justify-center gap-4 pb-4 border-b border-gray-200">
          {['upload', 'mapping', 'preview', 'complete'].map((s, index) => {
            const stepIndex = ['upload', 'mapping', 'preview', 'complete'].indexOf(step);
            const isActive = s === step;
            const isCompleted = ['upload', 'mapping', 'preview', 'complete'].indexOf(s) < stepIndex;
            
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isCompleted ? <CheckCircle size={18} /> : index + 1}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                    {s === 'upload' ? 'Subir' : s === 'mapping' ? 'Mapear' : s === 'preview' ? 'Previsualizar' : 'Completado'}
                  </span>
                </div>
                {index < 3 && <ArrowRight size={20} className="text-gray-400" />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Step: Upload */}
        {step === 'upload' && (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-blue-400');
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-400');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-blue-400');
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) {
                  handleFileSelect(droppedFile);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Arrastra tu archivo CSV aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-gray-500">
                Formatos soportados: CSV
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0] || null;
                  handleFileSelect(selectedFile);
                }}
              />
            </div>
            
            {file && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-600">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleFileSelect(null)}>
                  <X size={18} />
                </Button>
              </div>
            )}

            {parseResult && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>{parseResult.rows.length}</strong> filas detectadas,{' '}
                  <strong>{parseResult.columns.length}</strong> columnas encontradas
                </p>
                {parseResult.errors.length > 0 && (
                  <p className="text-sm text-blue-700 mt-2">
                    {parseResult.errors.length} advertencia(s) durante el parsing
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step: Mapping */}
        {step === 'mapping' && parseResult && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Mapeo de Columnas</h4>
                <p className="text-sm text-gray-600">
                  Asigna las columnas de tu CSV a los campos del sistema
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleSaveConfig}>
                <Save size={18} className="mr-2" />
                Guardar Configuración
              </Button>
            </div>

            {/* Configuraciones guardadas */}
            {savedConfigs.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Configuraciones Guardadas
                </label>
                <div className="flex gap-2">
                  <Select
                    options={configOptions}
                    value={selectedConfig}
                    onChange={(e) => {
                      setSelectedConfig(e.target.value);
                      if (e.target.value) {
                        handleApplyConfig(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Mapeo de columnas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha <span className="text-red-500">*</span>
                </label>
                <Select
                  options={columnOptions}
                  value={mapping.fecha || ''}
                  onChange={(e) => setMapping({ ...mapping, fecha: e.target.value || null })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concepto <span className="text-red-500">*</span>
                </label>
                <Select
                  options={columnOptions}
                  value={mapping.concepto || ''}
                  onChange={(e) => setMapping({ ...mapping, concepto: e.target.value || null })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Importe <span className="text-red-500">*</span>
                </label>
                <Select
                  options={columnOptions}
                  value={mapping.importe || ''}
                  onChange={(e) => setMapping({ ...mapping, importe: e.target.value || null })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo (opcional)
                </label>
                <Select
                  options={columnOptions}
                  value={mapping.tipo || ''}
                  onChange={(e) => setMapping({ ...mapping, tipo: e.target.value || null })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Referencia (opcional)
                </label>
                <Select
                  options={columnOptions}
                  value={mapping.referencia || ''}
                  onChange={(e) => setMapping({ ...mapping, referencia: e.target.value || null })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saldo (opcional)
                </label>
                <Select
                  options={columnOptions}
                  value={mapping.saldo || ''}
                  onChange={(e) => setMapping({ ...mapping, saldo: e.target.value || null })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banco (opcional)
                </label>
                <Select
                  options={columnOptions}
                  value={mapping.banco || ''}
                  onChange={(e) => setMapping({ ...mapping, banco: e.target.value || null })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuenta (opcional)
                </label>
                <Select
                  options={columnOptions}
                  value={mapping.cuenta || ''}
                  onChange={(e) => setMapping({ ...mapping, cuenta: e.target.value || null })}
                />
              </div>
            </div>

            {/* Vista previa de primera fila */}
            {parseResult.rows.length > 0 && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Vista Previa (Primera Fila)</h5>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {parseResult.columns.map(col => (
                          <th key={col} className="text-left p-2 font-medium text-gray-700">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {parseResult.columns.map(col => (
                          <td key={col} className="p-2 text-gray-600">
                            {parseResult.rows[0][col] || '-'}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <Button variant="ghost" onClick={() => setStep('upload')}>
                <ArrowLeft size={18} className="mr-2" />
                Atrás
              </Button>
              <Button
                variant="primary"
                onClick={handlePreview}
                disabled={!requiredFieldsMapped || loading}
                loading={loading}
              >
                Previsualizar
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Vista Previa de Transacciones</h4>
              <p className="text-sm text-gray-600">
                Revisa las transacciones antes de importar. Las duplicadas están marcadas.
              </p>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-900">{previewTransactions.length}</p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Nuevas</p>
                <p className="text-2xl font-bold text-green-900">
                  {previewTransactions.filter(p => !p.isDuplicate).length}
                </p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-600 font-medium">Duplicadas</p>
                <p className="text-2xl font-bold text-yellow-900">
                  {previewTransactions.filter(p => p.isDuplicate).length}
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm text-purple-600 font-medium">Con Categoría</p>
                <p className="text-2xl font-bold text-purple-900">
                  {previewTransactions.filter(p => p.suggestedCategory).length}
                </p>
              </div>
            </div>

            {/* Tabla de transacciones */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fecha</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Concepto</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">Importe</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Categoría</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewTransactions.slice(0, 50).map((preview, index) => (
                    <tr
                      key={index}
                      className={preview.isDuplicate ? 'bg-yellow-50' : ''}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {preview.transaction.fecha.toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {preview.transaction.concepto}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          preview.transaction.tipo === 'ingreso'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {preview.transaction.tipo === 'ingreso' ? 'Ingreso' : 'Egreso'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-medium text-gray-900">
                        {preview.transaction.importe.toFixed(2)} €
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {preview.suggestedCategory && preview.suggestedCategory !== 'ingreso' ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            {CATEGORIAS_GASTO[preview.suggestedCategory as CategoriaGasto]?.nombre || preview.suggestedCategory}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-center">
                        {preview.isDuplicate ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertCircle size={14} className="mr-1" />
                            Duplicado
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle size={14} className="mr-1" />
                            Nuevo
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewTransactions.length > 50 && (
                <div className="p-4 text-center text-sm text-gray-600 bg-gray-50">
                  Mostrando 50 de {previewTransactions.length} transacciones
                </div>
              )}
            </div>

            {/* Botones de navegación */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <Button variant="ghost" onClick={() => setStep('mapping')}>
                <ArrowLeft size={18} className="mr-2" />
                Atrás
              </Button>
              <Button
                variant="primary"
                onClick={handleImport}
                disabled={loading || previewTransactions.filter(p => !p.isDuplicate).length === 0}
                loading={loading}
              >
                Importar {previewTransactions.filter(p => !p.isDuplicate).length} Transacciones
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Complete */}
        {step === 'complete' && importResult && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h4 className="text-2xl font-bold text-gray-900 mb-2">¡Importación Completada!</h4>
              <p className="text-gray-600">
                Se han procesado las transacciones correctamente
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm text-green-600 font-medium">Importadas</p>
                <p className="text-3xl font-bold text-green-900">{importResult.imported}</p>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-sm text-yellow-600 font-medium">Duplicadas</p>
                <p className="text-3xl font-bold text-yellow-900">{importResult.duplicates}</p>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-sm text-red-600 font-medium">Errores</p>
                <p className="text-3xl font-bold text-red-900">{importResult.errors}</p>
              </div>
            </div>

            {importResult.errorsDetails && importResult.errorsDetails.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h5 className="text-sm font-medium text-red-900 mb-2">Detalles de Errores</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  {importResult.errorsDetails.map((error: any, index: number) => (
                    <li key={index}>
                      Fila {error.row}: {error.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-center pt-4">
              <Button variant="primary" onClick={handleReset}>
                Importar Otro Archivo
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

