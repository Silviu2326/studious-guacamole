import React from 'react';
import { DeveloperSettingsContainer } from '../components';
import { Code2, Lock } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';

/**
 * Página principal de Webhooks & API Keys
 * 
 * Esta funcionalidad está diseñada principalmente para Gimnasios, centros de fitness o cadenas
 * que cuentan con recursos de desarrollo internos o externos. Les permite integrar nuestra
 * plataforma con sus sistemas existentes (CRM, ERP, control de acceso, herramientas de marketing).
 * 
 * Aunque un entrenador personal con conocimientos técnicos podría encontrarle utilidad en un plan
 * premium, el caso de uso principal y la complejidad de la herramienta están orientados al perfil
 * de un negocio más grande y estructurado que necesita automatizar flujos de trabajo y sincronizar
 * datos a gran escala.
 * 
 * Ruta: /settings/developer
 */
export default function WebhooksApiKeysPage() {
  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <Code2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Webhooks & API Keys
          </h1>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Herramientas avanzadas para integración y automatización con sistemas externos
          </p>
        </div>
      </div>

      {/* Info Box */}
      <div className={`${ds.card} ${ds.cardPad} bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800`}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className={`${ds.typography.bodyLarge} font-semibold text-purple-900 dark:text-purple-100 mb-2`}>
              Integraciones y Automatizaciones
            </h3>
            <p className={`${ds.typography.body} text-purple-700 dark:text-purple-300 mb-3`}>
              Las API Keys permiten que aplicaciones externas accedan a los datos de tu gimnasio de manera
              programática y segura. Los Webhooks envían notificaciones automáticas en tiempo real a URLs
              externas cuando ocurren eventos específicos, eliminando la necesidad de consultas manuales
              constantes y asegurando que los sistemas conectados estén siempre sincronizados.
            </p>
            <p className={`${ds.typography.bodySmall} text-purple-600 dark:text-purple-400`}>
              Útil para integraciones con CRMs, ERPs, sistemas de control de acceso, herramientas de BI,
              plataformas de marketing y automatización.
            </p>
          </div>
        </div>
      </div>

      {/* Componente principal */}
      <DeveloperSettingsContainer />
    </div>
  );
}

