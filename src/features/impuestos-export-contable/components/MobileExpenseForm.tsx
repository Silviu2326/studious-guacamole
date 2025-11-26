import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input, Select, SelectOption, Modal, Textarea } from '../../../components/componentsreutilizables';
import { 
  GastoDeducible, 
  CategoriaGasto, 
  CATEGORIAS_GASTO,
  ArchivoAdjunto,
  CrearGastoRequest
} from '../types/expenses';
import { expensesAPI } from '../api/expenses';
import { 
  Camera, 
  Image as ImageIcon, 
  X, 
  CheckCircle,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  Upload,
  Trash2
} from 'lucide-react';

interface MobileExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gasto: CrearGastoRequest) => Promise<void>;
  initialGasto?: GastoDeducible | null;
}

export const MobileExpenseForm: React.FC<MobileExpenseFormProps> = ({
  isOpen,
  onClose,
  onSave,
  initialGasto
}) => {
  const [concepto, setConcepto] = useState('');
  const [importe, setImporte] = useState('');
  const [categoria, setCategoria] = useState<CategoriaGasto | ''>('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [notas, setNotas] = useState('');
  const [archivos, setArchivos] = useState<ArchivoAdjunto[]>([]);
  const [capturingPhoto, setCapturingPhoto] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (initialGasto) {
        setConcepto(initialGasto.concepto);
        setImporte(initialGasto.importe.toString());
        setCategoria(initialGasto.categoria);
        setFecha(new Date(initialGasto.fecha).toISOString().split('T')[0]);
        setNotas(initialGasto.notas || '');
        setArchivos(initialGasto.archivosAdjuntos || []);
      } else {
        // Reset to defaults
        setConcepto('');
        setImporte('');
        setCategoria('');
        setFecha(new Date().toISOString().split('T')[0]);
        setNotas('');
        setArchivos([]);
      }
    }
  }, [isOpen, initialGasto]);

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    
    // Process files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const nuevoArchivo: ArchivoAdjunto = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          nombre: file.name,
          url: url,
          tipo: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'other',
          tamaño: file.size,
          fechaSubida: new Date()
        };
        setArchivos(prev => [...prev, nuevoArchivo]);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleRemoveFile = (id: string) => {
    setArchivos(prev => prev.filter(f => f.id !== id));
  };

  const handleSave = async () => {
    if (!concepto || !importe || !categoria) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      await onSave({
        fecha: new Date(fecha),
        concepto,
        importe: parseFloat(importe),
        categoria: categoria as CategoriaGasto,
        deducible: true, // Por defecto deducible
        notas: notas || undefined,
        archivosAdjuntos: archivos.length > 0 ? archivos : undefined
      });
      
      // Reset form
      setConcepto('');
      setImporte('');
      setCategoria('');
      setFecha(new Date().toISOString().split('T')[0]);
      setNotas('');
      setArchivos([]);
      
      onClose();
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error al guardar el gasto');
    }
  };

  const opcionesCategorias: SelectOption[] = Object.values(CATEGORIAS_GASTO).map(cat => ({
    value: cat.id,
    label: cat.nombre
  }));

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // TODO: Implement OCR functionality for automatic data extraction from receipts
  // This would involve:
  // 1. Sending image to OCR API (e.g., Google Vision API, AWS Textract, Tesseract.js)
  // 2. Extracting amount, date, merchant name, category from receipt text
  // 3. Auto-filling form fields with extracted data
  // 4. Allowing user to verify and correct extracted data

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialGasto ? 'Editar Gasto' : 'Nuevo Gasto'}
      size="lg"
      footer={
        <div className="flex gap-3 w-full">
          <Button 
            variant="secondary" 
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            className="flex-1"
            disabled={uploading}
          >
            {uploading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Camera/Photo Section - Mobile First */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Foto del Ticket
          </label>
          
          {/* Camera Capture Button */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="primary"
              onClick={handleCameraCapture}
              className="flex-1 flex items-center justify-center gap-2"
              disabled={uploading}
            >
              <Camera className="w-5 h-5" />
              {archivos.length === 0 ? 'Tomar Foto' : 'Añadir Foto'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2"
              disabled={uploading}
            >
              <Upload className="w-5 h-5" />
              Galería
            </Button>
          </div>
          
          {/* Hidden inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {/* Preview uploaded files */}
          {archivos.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              {archivos.map((archivo) => (
                <div
                  key={archivo.id}
                  className="relative border border-gray-200 rounded-lg overflow-hidden"
                >
                  {archivo.tipo === 'image' ? (
                    <img
                      src={archivo.url}
                      alt={archivo.nombre}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => handleRemoveFile(archivo.id)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="p-2 bg-white">
                    <p className="text-xs text-gray-600 truncate">{archivo.nombre}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(archivo.tamaño)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Form Fields - Simplified for Mobile */}
        <div className="space-y-4">
          {/* Concepto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Concepto *
            </label>
            <Input
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Combustible, Comida, Equipamiento..."
              required
              className="w-full"
            />
          </div>

          {/* Importe y Categoría en una fila en desktop, columnas en mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Importe *
              </label>
              <Input
                type="number"
                value={importe}
                onChange={(e) => setImporte(e.target.value)}
                placeholder="0.00"
                required
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Categoría *
              </label>
              <Select
                options={opcionesCategorias}
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaGasto)}
                required
                className="w-full"
              />
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha
            </label>
            <Input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Notas (opcional, collapsed by default on mobile) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <Textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Información adicional..."
              rows={2}
              className="w-full"
            />
          </div>
        </div>

        {/* Info about auto-extraction */}
        {archivos.length > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Los datos se extraerán automáticamente de la imagen si es posible. 
              Verifica y ajusta los campos si es necesario.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

