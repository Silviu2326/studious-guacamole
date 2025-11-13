import React from 'react';
import { Modal } from '../../../components/componentsreutilizables';
import { HelpCircle, Video } from 'lucide-react';
import { TabId } from '../types';

interface TabHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabId: TabId;
  tooltip?: string;
  videoUrl?: string;
  tabLabel: string;
}

const tabHelpContent: Record<TabId, { tooltip: string; videoUrl?: string }> = {
  dashboard: {
    tooltip: 'El Dashboard te proporciona una vista general de todos tus objetivos y métricas clave. Aquí puedes ver el progreso global, objetivos cumplidos y desviaciones críticas que requieren atención. Usa los filtros globales para ajustar la vista según sede, equipo o línea de negocio.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - reemplazar con video real
  },
  objetivos: {
    tooltip: 'En esta sección puedes crear, editar y gestionar todos tus objetivos. Establece objetivos específicos con métricas, valores objetivo y fechas límite. El sistema te alertará cuando un objetivo esté en riesgo o se haya cumplido.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - reemplazar con video real
  },
  metricas: {
    tooltip: 'Visualiza todas tus métricas en gráficos interactivos. Puedes comparar diferentes períodos, ver tendencias y analizar el rendimiento de cada métrica. Los gráficos se actualizan automáticamente según los filtros globales aplicados.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - reemplazar con video real
  },
  seguimiento: {
    tooltip: 'Realiza un seguimiento detallado del progreso de tus objetivos. Aquí puedes ver qué objetivos están en camino, cuáles requieren atención y cuáles se han completado. Usa esta vista para identificar rápidamente áreas que necesitan acción.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - reemplazar con video real
  },
  reportes: {
    tooltip: 'Genera reportes personalizados de tus objetivos y rendimiento. Puedes exportar reportes en diferentes formatos (PDF, Excel) y configurar reportes automáticos que se envíen periódicamente. Los reportes incluyen gráficos, tablas y análisis detallados.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - reemplazar con video real
  },
  alertas: {
    tooltip: 'Gestiona todas las alertas relacionadas con tus objetivos. Las alertas te notifican cuando un objetivo está en riesgo, cuando se ha cumplido o cuando hay desviaciones significativas. Puedes marcar alertas como leídas y tomar acciones directamente desde aquí.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - reemplazar con video real
  },
  comparacion: {
    tooltip: 'Compara el rendimiento entre diferentes períodos, sedes o equipos. Esta herramienta te ayuda a identificar tendencias, patrones y áreas de mejora. Puedes comparar métricas específicas o hacer comparaciones generales.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - reemplazar con video real
  },
  configuracion: {
    tooltip: 'Configura y personaliza los KPIs (Indicadores Clave de Rendimiento) que quieres monitorear. Puedes habilitar o deshabilitar métricas, establecer valores objetivo y definir cómo se calculan. Esta configuración afecta a todas las vistas del módulo.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - reemplazar con video real
  },
};

export const TabHelpModal: React.FC<TabHelpModalProps> = ({
  isOpen,
  onClose,
  tabId,
  tooltip,
  videoUrl,
  tabLabel,
}) => {
  const content = tabHelpContent[tabId] || { tooltip: tooltip || 'Información no disponible', videoUrl };
  const displayTooltip = tooltip || content.tooltip;
  const displayVideoUrl = videoUrl || content.videoUrl;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ayuda: ${tabLabel}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Tooltip/Descripción */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <HelpCircle className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">¿Qué es esta sección?</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                {displayTooltip}
              </p>
            </div>
          </div>
        </div>

        {/* Video */}
        {displayVideoUrl && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Video className="text-gray-600 dark:text-gray-400" size={20} />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Video tutorial</h3>
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={displayVideoUrl}
                title={`Video tutorial - ${tabLabel}`}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Tips adicionales */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">💡 Consejos útiles</h3>
          <ul className="text-sm text-green-800 dark:text-green-200 space-y-1 list-disc list-inside">
            <li>Usa los filtros globales en la parte superior para ajustar la vista</li>
            <li>Puedes personalizar qué tabs ver en la configuración de tabs</li>
            <li>Las alertas críticas aparecen destacadas en el header</li>
            <li>Exporta reportes para compartir con tu equipo</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

