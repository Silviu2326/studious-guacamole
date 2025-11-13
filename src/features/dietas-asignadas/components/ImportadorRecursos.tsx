import React, { useState, useRef } from 'react';
import { Card, Button, Modal, Badge } from '../../../components/componentsreutilizables';
import { Upload, FileSpreadsheet, Link as LinkIcon, Image as ImageIcon, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import {
  parsearCSVRecursos,
  importarRecursoDesdeEnlace,
  importarRecursoDesdeImagen,
  guardarRecursoImportado,
  validarCSV,
  validarImagen,
  validarURL,
  RecursoImportado,
} from '../api/importacionRecursos';
import { RecursoBiblioteca } from '../types';
import { useAuth } from '../../../context/AuthContext';

interface ImportadorRecursosProps {
  onRecursoImportado?: (recurso: RecursoBiblioteca) => void;
  onCerrar?: () => void;
}

type TipoImportacion = 'csv' | 'enlace' | 'imagen' | null;

export const ImportadorRecursos: React.FC<ImportadorRecursosProps> = ({
  onRecursoImportado,
  onCerrar,
}) => {
  const { user } = useAuth();
  const [tipoImportacion, setTipoImportacion] = useState<TipoImportacion>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [importando, setImportando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [recursosImportados, setRecursosImportados] = useState<RecursoImportado[]>([]);
  
  const inputCSVRef = useRef<HTMLInputElement>(null);
  const inputImagenRef = useRef<HTMLInputElement>(null);
  const inputEnlaceRef = useRef<HTMLInputElement>(null);

  const handleImportarCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    const validacion = validarCSV(archivo);
    if (!validacion.valido) {
      setError(validacion.error || 'Error validando el archivo');
      return;
    }

    setImportando(true);
    setError(null);
    setExito(null);

    try {
      const recursos = await parsearCSVRecursos(archivo);
      setRecursosImportados(recursos);
      setExito(`Se encontraron ${recursos.length} recurso(s) en el CSV`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando el CSV');
    } finally {
      setImportando(false);
    }
  };

  const handleImportarEnlace = async () => {
    const enlace = inputEnlaceRef.current?.value.trim();
    if (!enlace) {
      setError('Por favor ingresa un enlace válido');
      return;
    }

    const validacion = validarURL(enlace);
    if (!validacion.valido) {
      setError(validacion.error || 'URL inválida');
      return;
    }

    setImportando(true);
    setError(null);
    setExito(null);

    try {
      const recurso = await importarRecursoDesdeEnlace(enlace);
      setRecursosImportados([recurso]);
      setExito('Enlace procesado correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando el enlace');
    } finally {
      setImportando(false);
    }
  };

  const handleImportarImagen = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;

    const validacion = validarImagen(archivo);
    if (!validacion.valido) {
      setError(validacion.error || 'Error validando la imagen');
      return;
    }

    setImportando(true);
    setError(null);
    setExito(null);

    try {
      const recurso = await importarRecursoDesdeImagen(archivo);
      setRecursosImportados([recurso]);
      setExito('Imagen procesada correctamente');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error procesando la imagen');
    } finally {
      setImportando(false);
    }
  };

  const handleGuardarRecursos = async () => {
    if (recursosImportados.length === 0) return;

    setImportando(true);
    setError(null);

    try {
      const recursosGuardados: RecursoBiblioteca[] = [];
      
      for (const recurso of recursosImportados) {
        const guardado = await guardarRecursoImportado(recurso, user?.id);
        recursosGuardados.push(guardado);
        onRecursoImportado?.(guardado);
      }

      setExito(`Se importaron ${recursosGuardados.length} recurso(s) exitosamente`);
      setRecursosImportados([]);
      
      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setMostrarModal(false);
        setTipoImportacion(null);
        setExito(null);
        onCerrar?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardando los recursos');
    } finally {
      setImportando(false);
    }
  };

  const abrirModal = (tipo: TipoImportacion) => {
    setTipoImportacion(tipo);
    setMostrarModal(true);
    setError(null);
    setExito(null);
    setRecursosImportados([]);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTipoImportacion(null);
    setError(null);
    setExito(null);
    setRecursosImportados([]);
    onCerrar?.();
  };

  return (
    <>
      {/* Botón principal de importación */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<Upload className="h-4 w-4" />}
          onClick={() => abrirModal(null)}
        >
          Importar Recursos
        </Button>
      </div>

      {/* Modal de importación */}
      <Modal
        isOpen={mostrarModal}
        onClose={cerrarModal}
        title="Importar Recursos a la Biblioteca"
        size="lg"
      >
        <div className="space-y-6">
          {/* Selección de tipo de importación */}
          {!tipoImportacion && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className="p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                onClick={() => setTipoImportacion('csv')}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-100 rounded-lg mb-3">
                    <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Importar CSV</h3>
                  <p className="text-sm text-gray-600">
                    Importa múltiples recursos desde un archivo CSV
                  </p>
                </div>
              </Card>

              <Card
                className="p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                onClick={() => setTipoImportacion('enlace')}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-green-100 rounded-lg mb-3">
                    <LinkIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Importar Enlace</h3>
                  <p className="text-sm text-gray-600">
                    Importa un recurso desde una URL
                  </p>
                </div>
              </Card>

              <Card
                className="p-4 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all"
                onClick={() => setTipoImportacion('imagen')}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-purple-100 rounded-lg mb-3">
                    <ImageIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Importar Imagen</h3>
                  <p className="text-sm text-gray-600">
                    Importa una receta desde una foto
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* Formulario de importación CSV */}
          {tipoImportacion === 'csv' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona un archivo CSV
                </label>
                <input
                  ref={inputCSVRef}
                  type="file"
                  accept=".csv"
                  onChange={handleImportarCSV}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<FileSpreadsheet className="h-4 w-4" />}
                  onClick={() => inputCSVRef.current?.click()}
                  disabled={importando}
                >
                  Seleccionar archivo CSV
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  El CSV debe incluir columnas: nombre, tipo, descripcion, calorias, proteinas, carbohidratos, grasas
                </p>
              </div>
            </div>
          )}

          {/* Formulario de importación de enlace */}
          {tipoImportacion === 'enlace' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL del recurso
                </label>
                <input
                  ref={inputEnlaceRef}
                  type="url"
                  placeholder="https://ejemplo.com/receta"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <Button
                fullWidth
                leftIcon={<LinkIcon className="h-4 w-4" />}
                onClick={handleImportarEnlace}
                disabled={importando}
              >
                {importando ? 'Procesando...' : 'Importar Enlace'}
              </Button>
            </div>
          )}

          {/* Formulario de importación de imagen */}
          {tipoImportacion === 'imagen' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona una imagen
                </label>
                <input
                  ref={inputImagenRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImportarImagen}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<ImageIcon className="h-4 w-4" />}
                  onClick={() => inputImagenRef.current?.click()}
                  disabled={importando}
                >
                  Seleccionar imagen
                </Button>
                <p className="text-xs text-gray-500 mt-2">
                  Formatos soportados: JPG, PNG, WEBP (máx. 10MB)
                </p>
              </div>
            </div>
          )}

          {/* Mensajes de error y éxito */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {exito && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">{exito}</p>
            </div>
          )}

          {/* Vista previa de recursos importados */}
          {recursosImportados.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">
                Recursos a importar ({recursosImportados.length})
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {recursosImportados.map((recurso, index) => (
                  <Card key={index} className="p-3 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{recurso.nombre}</h5>
                        {recurso.descripcion && (
                          <p className="text-sm text-gray-600 mt-1">{recurso.descripcion}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-blue-50 text-blue-700 text-xs">
                            {recurso.tipo}
                          </Badge>
                          {recurso.macros && (
                            <span className="text-xs text-gray-600">
                              {recurso.macros.calorias} kcal
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <Button
                fullWidth
                leftIcon={importando ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                onClick={handleGuardarRecursos}
                disabled={importando}
              >
                {importando ? 'Guardando...' : `Guardar ${recursosImportados.length} recurso(s)`}
              </Button>
            </div>
          )}

          {/* Botones de navegación */}
          {tipoImportacion && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => {
                  setTipoImportacion(null);
                  setError(null);
                  setExito(null);
                  setRecursosImportados([]);
                }}
              >
                Volver
              </Button>
              <Button variant="ghost" onClick={cerrarModal}>
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

