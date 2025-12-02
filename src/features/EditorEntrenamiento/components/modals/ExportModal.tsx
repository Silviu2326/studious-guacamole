import React, { useState } from 'react';
import { FileText, Smartphone, Table, Check, Download, Send, FileSpreadsheet, Monitor, Video, StickyNote } from 'lucide-react';
import { Modal } from '../../../../components/componentsreutilizables/Modal';
import { Button } from '../../../../components/componentsreutilizables/Button';
import { useUIContext } from '../../context/UIContext';
import { useEditorToast } from '../feedback/ToastSystem';

type ExportFormat = 'pdf' | 'excel' | 'app';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setExportModalOpen } = useUIContext();
  const { addToast } = useEditorToast();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [includeVideos, setIncludeVideos] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const handleClose = () => {
    setExportModalOpen(false);
  };

  const handleExport = () => {
    setIsExporting(true);
    
    // Mock export process
    setTimeout(() => {
      setIsExporting(false);
      setExportModalOpen(false);
      
      let message = '';
      switch (selectedFormat) {
        case 'pdf':
          message = 'El PDF se ha generado y descargado correctamente.';
          break;
        case 'excel':
          message = 'El archivo Excel se ha descargado correctamente.';
          break;
        case 'app':
          message = 'El programa se ha enviado a la aplicación móvil del cliente.';
          break;
      }

      addToast({
        type: 'success',
        title: 'Exportación completada',
        message,
        duration: 4000
      });
    }, 1500);
  };

  const renderPdfOptions = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex items-center justify-center min-h-[200px]">
        {/* PDF Preview Mockup */}
        <div className="bg-white shadow-lg w-40 h-56 border border-gray-100 flex flex-col p-3 transform transition-transform hover:scale-105 cursor-default">
          <div className="h-2 w-full bg-gray-200 mb-2"></div>
          <div className="h-2 w-3/4 bg-gray-200 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-1">
                <div className="h-1.5 w-1.5 bg-blue-200 rounded-full"></div>
                <div className="h-1.5 w-full bg-gray-100"></div>
              </div>
            ))}
          </div>
          <div className="mt-auto flex justify-center">
             <span className="text-[10px] text-gray-400">Página 1</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Opciones de configuración</h4>
        
        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
          <div className={`w-5 h-5 rounded flex items-center justify-center border ${includeVideos ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'}`}>
             {includeVideos && <Check size={12} />}
          </div>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={includeVideos} 
            onChange={() => setIncludeVideos(!includeVideos)} 
          />
          <div className="flex items-center gap-2">
            <Video size={16} className="text-gray-500" />
            <span className="text-sm text-gray-700">Incluir enlaces a videos</span>
          </div>
        </label>

        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
          <div className={`w-5 h-5 rounded flex items-center justify-center border ${includeNotes ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300'}`}>
             {includeNotes && <Check size={12} />}
          </div>
          <input 
            type="checkbox" 
            className="hidden" 
            checked={includeNotes} 
            onChange={() => setIncludeNotes(!includeNotes)} 
          />
          <div className="flex items-center gap-2">
            <StickyNote size={16} className="text-gray-500" />
            <span className="text-sm text-gray-700">Incluir notas del entrenador</span>
          </div>
        </label>
      </div>
    </div>
  );

  const renderExcelOptions = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2">
        <FileSpreadsheet size={48} />
      </div>
      <div className="text-center max-w-xs">
        <h4 className="text-lg font-medium text-gray-900 mb-2">Formato Hoja de Cálculo</h4>
        <p className="text-sm text-gray-500">
          Descarga el programa en formato .xlsx compatible con Excel, Google Sheets y Numbers. Ideal para clientes que prefieren registrar su progreso manualmente.
        </p>
      </div>
    </div>
  );

  const renderAppOptions = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-2 relative">
        <Smartphone size={48} />
        <div className="absolute -right-1 -bottom-1 bg-white rounded-full p-1 shadow-sm">
          <div className="bg-green-500 w-4 h-4 rounded-full"></div>
        </div>
      </div>
      <div className="text-center max-w-xs">
        <h4 className="text-lg font-medium text-gray-900 mb-2">Enviar a App Móvil</h4>
        <p className="text-sm text-gray-500">
          El cliente recibirá una notificación push y podrá ver su nuevo programa inmediatamente en la aplicación FitPro Client.
        </p>
      </div>
      <div className="w-full bg-gray-50 p-4 rounded-lg border border-gray-100 text-left">
         <div className="flex items-center gap-3 mb-2">
           <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
           <div>
             <p className="text-sm font-medium text-gray-900">Juan Pérez</p>
             <p className="text-xs text-gray-500">Última conexión: Hace 2 horas</p>
           </div>
         </div>
         <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
           <Monitor size={12} />
           <span>App instalada y activa</span>
         </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isExportModalOpen}
      onClose={handleClose}
      title="Exportar Programa"
      size="lg"
      footer={
        <div className="flex justify-between w-full">
           <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleExport}
            isLoading={isExporting}
            disabled={isExporting}
            className={
                selectedFormat === 'pdf' ? 'bg-blue-600 hover:bg-blue-700' :
                selectedFormat === 'excel' ? 'bg-green-600 hover:bg-green-700' :
                'bg-purple-600 hover:bg-purple-700'
            }
          >
            {selectedFormat === 'pdf' && <><Download size={16} className="mr-2" /> Descargar PDF</>}
            {selectedFormat === 'excel' && <><Download size={16} className="mr-2" /> Descargar Excel</>}
            {selectedFormat === 'app' && <><Send size={16} className="mr-2" /> Enviar a App</>}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-1 min-h-[400px]">
        {/* Sidebar Selection */}
        <div className="space-y-2 col-span-1 border-r border-gray-100 pr-4">
          <button
            onClick={() => setSelectedFormat('pdf')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
              ${selectedFormat === 'pdf' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}
            `}
          >
            <FileText size={20} />
            <div className="flex-1">
              <div className="font-medium">PDF Profesional</div>
              <div className="text-xs opacity-70">Para imprimir o compartir</div>
            </div>
          </button>
          
          <button
            onClick={() => setSelectedFormat('excel')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
              ${selectedFormat === 'excel' ? 'bg-green-50 text-green-700' : 'hover:bg-gray-50 text-gray-700'}
            `}
          >
            <Table size={20} />
            <div className="flex-1">
              <div className="font-medium">Excel / CSV</div>
              <div className="text-xs opacity-70">Datos en bruto</div>
            </div>
          </button>
          
          <button
            onClick={() => setSelectedFormat('app')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left
              ${selectedFormat === 'app' ? 'bg-purple-50 text-purple-700' : 'hover:bg-gray-50 text-gray-700'}
            `}
          >
            <Smartphone size={20} />
            <div className="flex-1">
              <div className="font-medium">App Móvil</div>
              <div className="text-xs opacity-70">Asignación directa</div>
            </div>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="col-span-1 md:col-span-2 pl-2 pt-2">
          {selectedFormat === 'pdf' && renderPdfOptions()}
          {selectedFormat === 'excel' && renderExcelOptions()}
          {selectedFormat === 'app' && renderAppOptions()}
        </div>
      </div>
    </Modal>
  );
};
