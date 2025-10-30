import React, { useState } from 'react';
import { Modal, Button, Tabs, TabItem } from '../../../components/componentsreutilizables';
import { VisorEjercicioProps, Dificultad } from '../types';
import { ds } from '../../adherencia/ui/ds';

export const VisorEjercicio: React.FC<VisorEjercicioProps> = ({
  ejercicio,
  onCerrar,
  onAgregarFavorito,
  onRemoverFavorito,
  esFavorito = false,
  onAgregarAPrograma
}) => {
  const [tabActiva, setTabActiva] = useState('detalles');

  const getDificultadColor = (dificultad: Dificultad) => {
    switch (dificultad) {
      case Dificultad.PRINCIPIANTE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case Dificultad.INTERMEDIO:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case Dificultad.AVANZADO:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case Dificultad.EXPERTO:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const tabs: TabItem[] = [
    {
      id: 'detalles',
      label: 'Detalles',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'instrucciones',
      label: 'Instrucciones',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'advertencias',
      label: 'Advertencias',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    {
      id: 'variaciones',
      label: 'Variaciones',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    }
  ];

  const renderDetalles = () => (
    <div className="space-y-6">
      {/* Video/Imagen */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
        <div className="text-center space-y-2">
          <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4V8a3 3 0 013-3h6a3 3 0 013 3v2M7 21h10a2 2 0 002-2v-5a2 2 0 00-2-2H7a2 2 0 00-2 2v5a2 2 0 002 2z" />
          </svg>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Video de demostración
          </p>
        </div>
      </div>

      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Información General
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  Dificultad:
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDificultadColor(ejercicio.dificultad)}`}>
                  {ejercicio.dificultad}
                </span>
              </div>
              {ejercicio.duracion && (
                <div className="flex justify-between">
                  <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Duración:
                  </span>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {ejercicio.duracion} minutos
                  </span>
                </div>
              )}
              {ejercicio.calorias && (
                <div className="flex justify-between">
                  <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Calorías:
                  </span>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    ~{ejercicio.calorias} cal
                  </span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Grupos Musculares
            </h4>
            <div className="flex flex-wrap gap-2">
              {ejercicio.grupoMuscular.map((grupo) => (
                <span 
                  key={grupo.id}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: `${grupo.color}20`, color: grupo.color }}
                >
                  {grupo.nombre}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Equipamiento
            </h4>
            <div className="space-y-2">
              {ejercicio.equipamiento.map((equipo) => (
                <div key={equipo.id} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {equipo.nombre}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
              Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              {ejercicio.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
          Descripción
        </h4>
        <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
          {ejercicio.descripcion}
        </p>
      </div>
    </div>
  );

  const renderInstrucciones = () => (
    <div className="space-y-4">
      <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
        Instrucciones de Ejecución
      </h4>
      <div className="space-y-3">
        {ejercicio.instrucciones.map((instruccion, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </div>
            <p className={`${ds.typography.body} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {instruccion}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdvertencias = () => (
    <div className="space-y-6">
      {/* Advertencias generales */}
      <div>
        <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
          Precauciones Importantes
        </h4>
        <div className="space-y-3">
          {ejercicio.advertencias.map((advertencia, index) => (
            <div key={index} className="flex gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className={`${ds.typography.body} text-yellow-800 dark:text-yellow-200`}>
                {advertencia}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contraindicaciones */}
      {ejercicio.contraindicaciones.length > 0 && (
        <div>
          <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            Contraindicaciones
          </h4>
          <div className="space-y-3">
            {ejercicio.contraindicaciones.map((contraindicacion, index) => (
              <div key={index} className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
                <p className={`${ds.typography.body} text-red-800 dark:text-red-200`}>
                  {contraindicacion}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderVariaciones = () => (
    <div className="space-y-4">
      <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
        Variaciones del Ejercicio
      </h4>
      {ejercicio.variaciones && ejercicio.variaciones.length > 0 ? (
        <div className="space-y-3">
          {ejercicio.variaciones.map((variacion, index) => (
            <div key={index} className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <p className={`${ds.typography.body} text-green-800 dark:text-green-200`}>
                {variacion}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay variaciones disponibles para este ejercicio
          </p>
        </div>
      )}
    </div>
  );

  const renderContenidoTab = () => {
    switch (tabActiva) {
      case 'detalles':
        return renderDetalles();
      case 'instrucciones':
        return renderInstrucciones();
      case 'advertencias':
        return renderAdvertencias();
      case 'variaciones':
        return renderVariaciones();
      default:
        return renderDetalles();
    }
  };

  return (
    <Modal onClose={onCerrar} size="xl">
      <div className="space-y-6">
        {/* Encabezado */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {ejercicio.nombre}
            </h2>
            <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-1`}>
              {ejercicio.descripcion}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onAgregarFavorito && onRemoverFavorito && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (esFavorito) {
                    onRemoverFavorito(ejercicio.id);
                  } else {
                    onAgregarFavorito(ejercicio.id);
                  }
                }}
              >
                <svg 
                  className={`w-5 h-5 ${esFavorito ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                  fill={esFavorito ? "currentColor" : "none"} 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              </Button>
            )}
            {onAgregarAPrograma && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onAgregarAPrograma(ejercicio)}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Agregar a programa
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          items={tabs}
          activeTab={tabActiva}
          onTabChange={setTabActiva}
        />

        {/* Contenido de la tab activa */}
        <div className="min-h-[400px]">
          {renderContenidoTab()}
        </div>
      </div>
    </Modal>
  );
};