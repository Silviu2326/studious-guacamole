import React, { useState } from 'react';
import { Button, Card } from './index';
import { ds } from '../../features/adherencia/ui/ds';

export const ButtonShowcase: React.FC = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleLoading = (buttonId: string) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F0F23] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className={`${ds.typography.display} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
            🔘 Showcase de Botones
          </h1>
          <p className={`${ds.typography.bodyLarge} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Todas las variantes, tamaños y estados de los botones según la guía de estilos v2.0
          </p>
        </div>

        {/* Variantes de Botones */}
        <Card>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
            Variantes de Botones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Primary */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-center`}>
                <span className="w-3 h-3 bg-[#6366F1] rounded-full mr-3"></span>
                Primary
              </h3>
              <div className="space-y-3">
                <Button variant="primary" size="sm">Pequeño</Button>
                <Button variant="primary" size="md">Mediano</Button>
                <Button variant="primary" size="lg">Grande</Button>
                <Button variant="primary" fullWidth>Ancho completo</Button>
                <Button 
                  variant="primary" 
                  loading={loadingStates.primary1}
                  onClick={() => handleLoading('primary1')}
                >
                  {loadingStates.primary1 ? 'Cargando...' : 'Con Loading'}
                </Button>
                <Button variant="primary" disabled>Deshabilitado</Button>
              </div>
            </div>

            {/* Secondary */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-center`}>
                <span className="w-3 h-3 bg-[#64748B] rounded-full mr-3"></span>
                Secondary
              </h3>
              <div className="space-y-3">
                <Button variant="secondary" size="sm">Pequeño</Button>
                <Button variant="secondary" size="md">Mediano</Button>
                <Button variant="secondary" size="lg">Grande</Button>
                <Button variant="secondary" fullWidth>Ancho completo</Button>
                <Button 
                  variant="secondary" 
                  loading={loadingStates.secondary1}
                  onClick={() => handleLoading('secondary1')}
                >
                  {loadingStates.secondary1 ? 'Cargando...' : 'Con Loading'}
                </Button>
                <Button variant="secondary" disabled>Deshabilitado</Button>
              </div>
            </div>

            {/* Ghost */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-center`}>
                <span className="w-3 h-3 bg-[#6366F1] rounded-full mr-3 opacity-50"></span>
                Ghost
              </h3>
              <div className="space-y-3">
                <Button variant="ghost" size="sm">Pequeño</Button>
                <Button variant="ghost" size="md">Mediano</Button>
                <Button variant="ghost" size="lg">Grande</Button>
                <Button variant="ghost" fullWidth>Ancho completo</Button>
                <Button 
                  variant="ghost" 
                  loading={loadingStates.ghost1}
                  onClick={() => handleLoading('ghost1')}
                >
                  {loadingStates.ghost1 ? 'Cargando...' : 'Con Loading'}
                </Button>
                <Button variant="ghost" disabled>Deshabilitado</Button>
              </div>
            </div>

            {/* Destructive */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-center`}>
                <span className="w-3 h-3 bg-[#EF4444] rounded-full mr-3"></span>
                Destructive
              </h3>
              <div className="space-y-3">
                <Button variant="destructive" size="sm">Pequeño</Button>
                <Button variant="destructive" size="md">Mediano</Button>
                <Button variant="destructive" size="lg">Grande</Button>
                <Button variant="destructive" fullWidth>Ancho completo</Button>
                <Button 
                  variant="destructive" 
                  loading={loadingStates.destructive1}
                  onClick={() => handleLoading('destructive1')}
                >
                  {loadingStates.destructive1 ? 'Cargando...' : 'Con Loading'}
                </Button>
                <Button variant="destructive" disabled>Deshabilitado</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Estados Especiales */}
        <Card>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
            Estados Especiales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Loading States */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Estados de Carga
              </h3>
              <div className="space-y-3">
                <Button variant="primary" loading>Guardando...</Button>
                <Button variant="secondary" loading>Procesando...</Button>
                <Button variant="ghost" loading>Enviando...</Button>
                <Button variant="destructive" loading>Eliminando...</Button>
              </div>
            </div>

            {/* Disabled States */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Estados Deshabilitados
              </h3>
              <div className="space-y-3">
                <Button variant="primary" disabled>No disponible</Button>
                <Button variant="secondary" disabled>Sin permisos</Button>
                <Button variant="ghost" disabled>Deshabilitado</Button>
                <Button variant="destructive" disabled>Bloqueado</Button>
              </div>
            </div>

            {/* Full Width */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Ancho Completo
              </h3>
              <div className="space-y-3">
                <Button variant="primary" fullWidth>Acción Principal</Button>
                <Button variant="secondary" fullWidth>Acción Secundaria</Button>
                <Button variant="ghost" fullWidth>Acción Alternativa</Button>
                <Button variant="destructive" fullWidth>Acción Peligrosa</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tamaños Comparativos */}
        <Card>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
            Comparación de Tamaños
          </h2>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark} w-20`}>
                Pequeño:
              </span>
              <Button variant="primary" size="sm">Acción</Button>
              <Button variant="secondary" size="sm">Acción</Button>
              <Button variant="ghost" size="sm">Acción</Button>
              <Button variant="destructive" size="sm">Acción</Button>
            </div>

            <div className="flex items-center space-x-4">
              <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark} w-20`}>
                Mediano:
              </span>
              <Button variant="primary" size="md">Acción</Button>
              <Button variant="secondary" size="md">Acción</Button>
              <Button variant="ghost" size="md">Acción</Button>
              <Button variant="destructive" size="md">Acción</Button>
            </div>

            <div className="flex items-center space-x-4">
              <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textSecondary} ${ds.color.textSecondaryDark} w-20`}>
                Grande:
              </span>
              <Button variant="primary" size="lg">Acción</Button>
              <Button variant="secondary" size="lg">Acción</Button>
              <Button variant="ghost" size="lg">Acción</Button>
              <Button variant="destructive" size="lg">Acción</Button>
            </div>
          </div>
        </Card>

        {/* Casos de Uso Comunes */}
        <Card>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
            Casos de Uso Comunes
          </h2>
          <div className="space-y-6">
            {/* Formulario */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Formulario
              </h3>
              <div className="flex space-x-3">
                <Button variant="primary">Guardar</Button>
                <Button variant="secondary">Cancelar</Button>
                <Button variant="ghost">Borrar</Button>
              </div>
            </div>

            {/* Acciones de Lista */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Acciones de Lista
              </h3>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">✏️ Editar</Button>
                <Button variant="ghost" size="sm">👁️ Ver</Button>
                <Button variant="ghost" size="sm">📋 Copiar</Button>
                <Button variant="destructive" size="sm">🗑️ Eliminar</Button>
              </div>
            </div>

            {/* Navegación */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Navegación
              </h3>
              <div className="flex space-x-3">
                <Button variant="ghost">← Anterior</Button>
                <Button variant="primary">Siguiente →</Button>
              </div>
            </div>

            {/* Confirmación */}
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Confirmación
              </h3>
              <div className="flex space-x-3">
                <Button variant="secondary">No, cancelar</Button>
                <Button variant="destructive">Sí, eliminar</Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Especificaciones Técnicas */}
        <Card>
          <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-6`}>
            Especificaciones Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Colores
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-[#6366F1] rounded"></div>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Primary: #6366F1
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-[#64748B] rounded"></div>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Secondary: #64748B
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-[#EF4444] rounded"></div>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Destructive: #EF4444
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Tamaños
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-6 bg-[#6366F1] rounded text-xs text-white flex items-center justify-center">
                    SM
                  </div>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    px-4 py-2 text-sm
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-20 h-8 bg-[#6366F1] rounded text-sm text-white flex items-center justify-center">
                    MD
                  </div>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    px-6 py-3 text-base
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 h-10 bg-[#6366F1] rounded text-base text-white flex items-center justify-center">
                    LG
                  </div>
                  <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    px-8 py-4 text-lg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
