import { useState } from 'react';
import {
  BadgeCheck,
  Building,
  ClipboardList,
  CreditCard,
  Database,
  FileText,
  Layers,
  Plug,
  Scroll,
  ShieldCheck,
  SlidersHorizontal,
  UserCog,
  Wrench,
  Code2,
} from 'lucide-react';
import { Badge, Button, Card, Tabs, type TabItem } from '../../../components/componentsreutilizables';

const TAB_ITEMS: TabItem[] = [
  { id: 'general', label: 'General del centro', icon: <Building className="h-4 w-4" /> },
  { id: 'servicios', label: 'Servicios & tarifas', icon: <Wrench className="h-4 w-4" /> },
  { id: 'politicas', label: 'Políticas & términos', icon: <Scroll className="h-4 w-4" /> },
  { id: 'plantillas', label: 'Plantillas', icon: <Layers className="h-4 w-4" /> },
  { id: 'roles', label: 'Roles & permisos', icon: <UserCog className="h-4 w-4" /> },
  { id: 'financiera', label: 'Configuración financiera', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'integraciones', label: 'Integraciones', icon: <Plug className="h-4 w-4" /> },
  { id: 'webhooks', label: 'Webhooks & API Keys', icon: <Code2 className="h-4 w-4" /> },
  { id: 'importadores', label: 'Importadores / Migraciones', icon: <Database className="h-4 w-4" /> },
];

const generalHighlights = [
  { title: 'Marca visual actualizada', description: 'Logo y paleta aplicados en web, app y pantallas in situ.' },
  { title: 'Horarios oficiales sincronizados', description: 'Integración con Agenda y reservas online completada.' },
  { title: 'Datos legales verificados', description: 'CIF, domicilio fiscal y razón social auditados el 02/11/2025.' },
];

const serviceCatalog = [
  { name: 'Plan Premium 12 meses', price: '€89', status: 'Activo', lastUpdate: '05 Nov 2025' },
  { name: 'Entreno personal 10 sesiones', price: '€350', status: 'Activo', lastUpdate: '28 Oct 2025' },
  { name: 'Corporativo bienestar mensual', price: '€59', status: 'Borrador', lastUpdate: '01 Nov 2025' },
];

const policyItems = [
  { name: 'Términos y condiciones', version: 'v5.2', status: 'Publicado', updatedAt: '31 Oct 2025' },
  { name: 'Política privacidad RGPD', version: 'v4.0', status: 'Pendiente firma', updatedAt: '18 Oct 2025' },
  { name: 'Consentimiento menores', version: 'v2.3', status: 'En revisión legal', updatedAt: '09 Oct 2025' },
];

const templateLibrary = [
  { title: 'Contrato membresía premium', type: 'PDF', usage: 'Autoenviado', updatedAt: '25 Oct 2025' },
  { title: 'Email bienvenida entrenador', type: 'Email', usage: 'Secuencia onboarding', updatedAt: '12 Oct 2025' },
  { title: 'Carta renovación corporativa', type: 'Doc', usage: 'B2B', updatedAt: '04 Nov 2025' },
];

const roleMatrix = [
  { role: 'Administrador', users: 4, scope: 'Acceso completo', status: 'Activo' },
  { role: 'Coordinador', users: 8, scope: 'Gestión clases, informes', status: 'Activo' },
  { role: 'Entrenador', users: 26, scope: 'Agenda, clientes asignados', status: 'Revisar' },
  { role: 'Recepción', users: 12, scope: 'Check-in, pagos, incidencias', status: 'Activo' },
];

const financialSettings = [
  { name: 'Moneda principal', value: 'EUR', detail: 'Multimoneda habilitada para ventas online' },
  { name: 'Series de facturación', value: 'CENTRO-2025, CORP-2025', detail: 'Próxima numeración automática' },
  { name: 'Impuestos', value: 'IVA 21% / IVA reducido 10%', detail: 'Reglas aplicadas por tipo de servicio' },
];

const integrations = [
  { name: 'Stripe', category: 'Pagos', status: 'Conectado', sync: 'Último sync 08:15' },
  { name: 'HubSpot', category: 'CRM', status: 'Conectado', sync: 'Último sync 07:52' },
  { name: 'Mailjet', category: 'Email marketing', status: 'Advertencia', sync: 'Token expira en 5 días' },
  { name: 'Google Calendar', category: 'Productividad', status: 'Conectado', sync: 'Bidireccional' },
];

const webhookEvents = [
  { event: 'member.created', target: 'https://api.mi-centro.com/webhooks/new-member', status: '200 OK', retries: 0 },
  { event: 'payment.failed', target: 'https://ops.mi-centro.com/hooks/payments', status: 'Error 401', retries: 2 },
  { event: 'class.booked', target: 'https://analytics.mi-centro.com/hooks/classes', status: '200 OK', retries: 0 },
];

const importJobs = [
  { id: 'JOB-322', type: 'Clientes', source: 'CSV', status: 'Completado', processed: '1.240 registros' },
  { id: 'JOB-329', type: 'Historial pagos', source: 'API externa', status: 'En progreso', processed: '68%' },
  { id: 'JOB-330', type: 'Clases legacy', source: 'CSV', status: 'Pendiente validación', processed: 'Esperando QA' },
];

function renderStatusPill(text: string, variant: 'success' | 'yellow' | 'secondary' | 'red' = 'secondary') {
  return (
    <Badge variant={variant} size="sm">
      {text}
    </Badge>
  );
}

export function ConfiguracionCentroPage() {
  const [activeTab, setActiveTab] = useState<string>('general');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge variant="blue" size="md" leftIcon={<BadgeCheck className="h-4 w-4" />}>
                Configuración del centro
              </Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
                Operación y branding centralizados
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                Administra la identidad del centro, catálogo de servicios, plantillas legales y conexiones técnicas desde un
                único panel unificado.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button variant="secondary" onClick={() => setActiveTab('general')}>
                Editar datos del centro
              </Button>
              <Button variant="ghost" onClick={() => setActiveTab('integraciones')}>
                Gestionar integraciones
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <Tabs items={TAB_ITEMS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />

          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <h2 className="text-lg font-semibold text-slate-900">Identidad corporativa</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Logotipo, colores y copy hero aplicados en todas las experiencias digitales y presenciales.
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {generalHighlights.map(item => (
                    <Card key={item.title} className="bg-slate-50" padding="md">
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-xs text-slate-500">{item.description}</p>
                    </Card>
                  ))}
                </div>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Datos fiscales</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• Razón social: Centro Fitness Europa S.L.</li>
                    <li>• CIF: B-98451234 • Domicilio: C/ Serrano 45, Madrid</li>
                    <li>• Certificados digitales vigentes hasta 12/2026</li>
                  </ul>
                </Card>
                <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                  <h3 className="text-lg font-semibold text-slate-900">Experiencia omnicanal</h3>
                  <ul className="mt-4 space-y-2 text-sm text-slate-600">
                    <li>• App móvil y kioskos alineados con nueva identidad</li>
                    <li>• Mensajería transaccional verificada y en producción</li>
                    <li>• FAQ y help center actualizados a noviembre 2025</li>
                  </ul>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'servicios' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Catálogo de servicios</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Gestiona tarifas, periodos promocionales y disponibilidad por canal de venta.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Crear servicio
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {serviceCatalog.map(service => (
                    <div
                      key={service.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-900">{service.name}</p>
                        <p className="text-xs text-slate-500">Actualizado {service.lastUpdate}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-700">{service.price}</p>
                      <div className="md:text-right">{renderStatusPill(service.status, service.status === 'Activo' ? 'success' : 'secondary')}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <h3 className="text-lg font-semibold text-slate-900">Reglas de pricing</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>• Tarifa corporativa ajustada por volumen y duración del contrato.</li>
                  <li>• Promociones estacionales sincronizadas con marketing digital.</li>
                  <li>• Bundles cross-selling con nutrición y fisioterapia en fase beta.</li>
                </ul>
              </Card>
            </div>
          )}

          {activeTab === 'politicas' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Políticas y términos</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Controla versiones, firmas pendientes y compliance legal para cada documento.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Subir nueva versión
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {policyItems.map(policy => (
                    <div
                      key={policy.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-900">{policy.name}</p>
                        <p className="text-xs text-slate-500">Versión {policy.version}</p>
                      </div>
                      <p className="text-xs text-slate-500">Actualizada {policy.updatedAt}</p>
                      <div className="md:text-right">{renderStatusPill(policy.status, policy.status === 'Publicado' ? 'success' : policy.status === 'Pendiente firma' ? 'yellow' : 'secondary')}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'plantillas' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Plantillas disponibles</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Contratos, emails y documentos listos para personalizar según segmento.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Crear plantilla
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {templateLibrary.map(template => (
                    <div
                      key={template.title}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-900">{template.title}</p>
                        <p className="text-xs text-slate-500">Tipo: {template.type}</p>
                      </div>
                      <p className="text-xs text-slate-500">Uso: {template.usage}</p>
                      <p className="text-xs text-slate-500 md:text-right">Actualizado {template.updatedAt}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Roles y permisos</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Define accesos granulares y monitoriza cuentas que requieren revisión.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Añadir rol
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {roleMatrix.map(role => (
                    <div
                      key={role.role}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <p className="text-sm font-semibold text-slate-900">{role.role}</p>
                      <p className="text-sm text-slate-600">Usuarios {role.users}</p>
                      <p className="text-xs text-slate-500">{role.scope}</p>
                      <div className="md:text-right">{renderStatusPill(role.status, role.status === 'Revisar' ? 'yellow' : 'success')}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'financiera' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <h2 className="text-lg font-semibold text-slate-900">Configuración financiera</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Moneda, impuestos y series de facturación sincronizadas con el ERP.
                </p>
                <div className="mt-6 space-y-3">
                  {financialSettings.map(setting => (
                    <div
                      key={setting.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-3 md:items-center"
                    >
                      <p className="text-sm font-semibold text-slate-900">{setting.name}</p>
                      <p className="text-sm text-slate-600">{setting.value}</p>
                      <p className="text-xs text-slate-500">{setting.detail}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <h3 className="text-lg font-semibold text-slate-900">Automatizaciones contables</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>• Envío automático de facturas B2B tras conciliación Stripe.</li>
                  <li>• Notificación de facturas vencidas al módulo de cobranzas.</li>
                  <li>• Exportación mensual a asesoría en formato SAF-T.</li>
                </ul>
              </Card>
            </div>
          )}

          {activeTab === 'integraciones' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Integraciones conectadas</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Sincroniza datos clave con herramientas de pagos, CRM y comunicaciones.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Conectar servicio
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {integrations.map(integration => (
                    <div
                      key={integration.name}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{integration.name}</p>
                        <p className="text-xs text-slate-500">{integration.category}</p>
                      </div>
                      <p className="text-xs text-slate-500">{integration.sync}</p>
                      <p className="text-xs text-slate-500">Modo: {integration.category}</p>
                      <div className="md:text-right">{renderStatusPill(integration.status, integration.status === 'Conectado' ? 'success' : 'yellow')}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Webhooks & API Keys</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Monitoriza eventos críticos y gestiona credenciales para integradores externos.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Crear webhook
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {webhookEvents.map(event => (
                    <div
                      key={event.event}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <div className="md:col-span-2">
                        <p className="text-sm font-semibold text-slate-900">{event.event}</p>
                        <p className="text-xs text-slate-500">{event.target}</p>
                      </div>
                      <p className="text-xs text-slate-500">Reintentos {event.retries}</p>
                      <div className="md:text-right">{renderStatusPill(event.status === '200 OK' ? 'Activo' : 'Error', event.status === '200 OK' ? 'success' : 'red')}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'importadores' && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Historial de importaciones</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Sigue el estado de los procesos de migración y audita registros procesados.
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Lanzar importación
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {importJobs.map(job => (
                    <div
                      key={job.id}
                      className="grid gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 p-4 md:grid-cols-4 md:items-center"
                    >
                      <p className="text-sm font-semibold text-slate-900">{job.id}</p>
                      <p className="text-sm text-slate-600">{job.type}</p>
                      <p className="text-xs text-slate-500">Fuente: {job.source}</p>
                      <p className="text-xs text-slate-500 md:text-right">{job.status} • {job.processed}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="bg-white shadow-sm ring-1 ring-slate-200/70" padding="lg">
                <h3 className="text-lg font-semibold text-slate-900">Buenas prácticas</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>• Validar siempre la plantilla CSV oficial y ejecutar pruebas con 10 registros.</li>
                  <li>• Configurar backups antes de migraciones masivas y notificar al equipo BI.</li>
                  <li>• Revisar logs en tiempo real y automatizar alertas ante errores críticos.</li>
                </ul>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ConfiguracionCentroPage;
