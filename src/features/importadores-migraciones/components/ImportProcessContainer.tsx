import React, { useState, useEffect } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { ArrowLeft, Download, FileSpreadsheet, Users, Calendar, CreditCard, Clock } from 'lucide-react';
import { UserType, ImportStep, ImportEntity, TargetField } from '../types';
import { FileUploadDropzone } from './FileUploadDropzone';
import { FieldMappingWizard } from './FieldMappingWizard';
import { ImportProgress } from './ImportProgress';
import { ImportResults } from './ImportResults';
import { ImportHistory } from './ImportHistory';
import { importService } from '../api/importService';
import { ImportJob, ImportResults as ImportResultsType } from '../types';

export interface ImportProcessContainerProps {
  userType: UserType;
}

export const ImportProcessContainer: React.FC<ImportProcessContainerProps> = ({
  userType,
}) => {
  const [currentStep, setCurrentStep] = useState<ImportStep>('upload');
  const [activeTab, setActiveTab] = useState<'import' | 'history'>('import');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<ImportEntity>('members');
  const [sourceColumns, setSourceColumns] = useState<string[]>([]);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [jobId, setJobId] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<ImportJob | null>(null);
  const [importResults, setImportResults] = useState<ImportResultsType | null>(null);
  const [historyJobs, setHistoryJobs] = useState<ImportJob[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const isTrainer = userType === 'trainer';

  // Campos objetivo según la entidad
  const getTargetFields = (entity: ImportEntity): TargetField[] => {
    const fields: Record<ImportEntity, TargetField[]> = {
      members: [
        { key: 'first_name', label: 'Nombre', required: true, type: 'string' },
        { key: 'last_name', label: 'Apellido', required: true, type: 'string' },
        { key: 'email', label: 'Email', required: true, type: 'email' },
        { key: 'phone_number', label: 'Teléfono', required: false, type: 'phone' },
        { key: 'membership_plan_id', label: 'ID Plan de Membresía', required: false, type: 'string' },
        { key: 'start_date', label: 'Fecha de Inicio', required: false, type: 'date' },
      ],
      classes: [
        { key: 'name', label: 'Nombre', required: true, type: 'string' },
        { key: 'description', label: 'Descripción', required: false, type: 'string' },
        { key: 'instructor_id', label: 'ID Instructor', required: false, type: 'string' },
        { key: 'capacity', label: 'Capacidad', required: false, type: 'number' },
        { key: 'start_time', label: 'Hora de Inicio', required: false, type: 'string' },
        { key: 'duration', label: 'Duración (minutos)', required: false, type: 'number' },
      ],
      subscriptions: [
        { key: 'member_id', label: 'ID Socio', required: true, type: 'string' },
        { key: 'plan_id', label: 'ID Plan', required: true, type: 'string' },
        { key: 'start_date', label: 'Fecha de Inicio', required: true, type: 'date' },
        { key: 'end_date', label: 'Fecha de Fin', required: false, type: 'date' },
        { key: 'status', label: 'Estado', required: false, type: 'string' },
      ],
      check_ins: [
        { key: 'member_id', label: 'ID Socio', required: true, type: 'string' },
        { key: 'check_in_date', label: 'Fecha', required: true, type: 'date' },
        { key: 'check_in_time', label: 'Hora', required: false, type: 'string' },
      ],
    };
    return fields[entity] || [];
  };

  const entityOptions: Array<{ value: ImportEntity; label: string; icon: React.ReactNode }> = [
    { value: 'members', label: 'Socios', icon: <Users className="w-4 h-4" /> },
    { value: 'classes', label: 'Clases', icon: <Calendar className="w-4 h-4" /> },
    { value: 'subscriptions', label: 'Suscripciones', icon: <CreditCard className="w-4 h-4" /> },
    { value: 'check_ins', label: 'Asistencias', icon: <Clock className="w-4 h-4" /> },
  ];

  // Cargar historial
  useEffect(() => {
    if (activeTab === 'history') {
      loadHistory();
    }
  }, [activeTab]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const response = await importService.getImportHistory();
      setHistoryJobs(response.data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Polling del estado de importación
  useEffect(() => {
    if (!jobId || currentStep !== 'progress') return;

    const interval = setInterval(async () => {
      try {
        const job = await importService.getImportStatus(jobId);
        if (job) {
          setCurrentJob(job);

          if (job.status === 'completed' || job.status === 'completed_with_errors' || job.status === 'failed') {
            const results = await importService.getImportResults(jobId);
            if (results) {
              setImportResults(results);
              setCurrentStep('results');
            }
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error('Error checking import status:', error);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, currentStep]);

  const handleFileSelect = async (file: File | null) => {
    if (!file) {
      setUploadedFile(null);
      setSourceColumns([]);
      return;
    }

    setUploadedFile(file);

    // Simular lectura de columnas (en producción usaría una librería como papaparse)
    const mockColumns = ['nombre', 'apellido', 'email', 'telefono', 'fecha_nacimiento', 'plan'];
    setSourceColumns(mockColumns);

    // Para entrenador, saltar directamente a la confirmación si el mapeo automático es suficiente
    if (isTrainer) {
      const autoMappings: Record<string, string> = {
        first_name: mockColumns.find(c => c.toLowerCase().includes('nombre')) || '',
        last_name: mockColumns.find(c => c.toLowerCase().includes('apellido')) || '',
        email: mockColumns.find(c => c.toLowerCase().includes('email')) || '',
        phone_number: mockColumns.find(c => c.toLowerCase().includes('telefono')) || '',
      };
      setFieldMappings(autoMappings);
      setCurrentStep('mapping');
    }
  };

  const handleEntityChange = (entity: ImportEntity) => {
    setSelectedEntity(entity);
    setCurrentStep('upload');
    setUploadedFile(null);
    setSourceColumns([]);
    setFieldMappings({});
  };

  const handleMappingSubmit = async (mappings: Record<string, string>) => {
    setFieldMappings(mappings);

    if (!uploadedFile) return;

    try {
      const response = await importService.startImport(uploadedFile, selectedEntity, mappings);
      setJobId(response.jobId);
      setCurrentStep('progress');
      
      // Inicializar el job
      const job = await importService.getImportStatus(response.jobId);
      if (job) {
        setCurrentJob(job);
      }
    } catch (error) {
      console.error('Error starting import:', error);
      alert('Error al iniciar la importación. Por favor, intenta nuevamente.');
    }
  };

  const handleStartNew = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setSourceColumns([]);
    setFieldMappings({});
    setJobId(null);
    setCurrentJob(null);
    setImportResults(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await importService.downloadTemplate(selectedEntity);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `plantilla_${selectedEntity}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Error al descargar la plantilla.');
    }
  };

  const handleDownloadReport = (jobIdParam: string) => {
    // En producción, esto descargaría el informe real
    alert(`Descargando informe para job ${jobIdParam}`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-6">
            {!isTrainer && (
              <Card className="bg-white shadow-sm">
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Selecciona el tipo de datos a importar
                    </label>
                    <Select
                      value={selectedEntity}
                      onChange={(e) => handleEntityChange(e.target.value as ImportEntity)}
                      options={entityOptions.map(opt => ({
                        value: opt.value,
                        label: opt.label,
                      }))}
                    />
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleDownloadTemplate}>
                    <Download className="w-4 h-4 mr-2" />
                    Descargar Plantilla CSV
                  </Button>
                </div>
              </Card>
            )}

            <FileUploadDropzone
              onFileSelect={handleFileSelect}
              selectedFile={uploadedFile}
            />

            {uploadedFile && (
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (isTrainer && sourceColumns.length > 0) {
                      setCurrentStep('mapping');
                    } else if (!isTrainer) {
                      setCurrentStep('mapping');
                    }
                  }}
                >
                  Continuar
                </Button>
              </div>
            )}
          </div>
        );

      case 'mapping':
        return (
          <div className="space-y-6">
            {!isTrainer && (
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep('upload')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
            )}

            {uploadedFile && sourceColumns.length > 0 && (
              <FieldMappingWizard
                sourceColumns={sourceColumns}
                targetFields={getTargetFields(selectedEntity)}
                onSubmit={handleMappingSubmit}
                initialMappings={fieldMappings}
              />
            )}
          </div>
        );

      case 'progress':
        return currentJob ? (
          <div className="space-y-6">
            <ImportProgress job={currentJob} />
          </div>
        ) : (
          <Card className="p-8 text-center bg-white shadow-sm">
            <p className="text-gray-600">Cargando...</p>
          </Card>
        );

      case 'results':
        return importResults ? (
          <div className="space-y-6">
            <ImportResults
              results={importResults}
              onDownloadReport={() => jobId && handleDownloadReport(jobId)}
              onStartNew={handleStartNew}
            />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Sistema de Tabs según guía */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            <button
              role="tab"
              aria-selected={activeTab === 'import'}
              onClick={() => setActiveTab('import')}
              className={[
                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                activeTab === 'import'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              ].join(' ')}
            >
              <FileSpreadsheet
                size={18}
                className={activeTab === 'import' ? 'opacity-100' : 'opacity-70'}
              />
              <span>Nueva Importación</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'history'}
              onClick={() => setActiveTab('history')}
              className={[
                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              ].join(' ')}
            >
              <Download
                size={18}
                className={activeTab === 'history' ? 'opacity-100' : 'opacity-70'}
              />
              <span>Historial</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Contenido de la pestaña activa */}
      <div className="mt-6">
        {activeTab === 'import' && renderStepContent()}

        {activeTab === 'history' && (
          <ImportHistory
            jobs={historyJobs}
            loading={loadingHistory}
            onDownloadReport={handleDownloadReport}
            onViewDetails={(jobIdParam) => {
              // Navegar a detalles
              console.log('View details for:', jobIdParam);
            }}
          />
        )}
      </div>
    </div>
  );
};

