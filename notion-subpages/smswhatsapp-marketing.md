# SMS/WhatsApp Marketing

**Página padre:** Hola

---

# SMS/WhatsApp Marketing
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada principalmente para el 'Entrenador Personal (Administrador)' que gestiona la estrategia de marketing y comunicación del negocio. El rol 'Entrenador Asociado' podría tener permisos de solo lectura para ver las campañas enviadas a sus clientes asignados, o permisos de creación si el administrador se los concede, pero no podrá gestionar la facturación o la configuración de la integración.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/mensajeria
## Descripción Funcional
La página de 'SMS/WhatsApp Marketing' es el centro de control para la comunicación directa e instantánea con clientes y leads dentro de TrainerERP. Diseñada específicamente para las necesidades de un entrenador personal, esta herramienta va más allá del simple envío de mensajes masivos. Permite a los entrenadores crear campañas altamente segmentadas y personalizadas, aprovechando el canal de comunicación más personal que tienen sus clientes: su teléfono. Desde aquí, un entrenador puede configurar recordatorios automáticos de sesiones por WhatsApp 24 horas antes para reducir drásticamente las ausencias, enviar un SMS flash con una oferta de 'último minuto' para llenar un hueco inesperado en su agenda, o lanzar una campaña motivacional semanal para mantener a sus clientes comprometidos y enfocados en sus metas. La plataforma se integra con la base de datos de clientes, permitiendo una segmentación dinámica basada en criterios como 'clientes sin sesión agendada en 30 días', 'clientes que compraron el plan de nutrición X' o 'leads que asistieron a una clase de prueba'. Además, para cumplir con las políticas de WhatsApp, la página ofrece una biblioteca de plantillas pre-aprobadas y la posibilidad de enviar nuevas plantillas a revisión, garantizando una comunicación fluida y profesional. El panel de análisis proporciona métricas clave en tiempo real: tasas de entrega, apertura (para WhatsApp), clics y respuestas, permitiendo al entrenador medir el impacto real de cada mensaje y optimizar su estrategia de comunicación para maximizar la retención y el LTV (Lifetime Value) de sus clientes.
## Valor de Negocio
El valor de negocio de la funcionalidad de 'SMS/WhatsApp Marketing' para un entrenador personal es inmenso y directo, impactando en tres áreas críticas: reducción de costos, aumento de ingresos y mejora de la retención. En primer lugar, reduce las pérdidas por ausencias (no-shows) mediante recordatorios automatizados y confirmaciones de citas por WhatsApp, un canal con una tasa de apertura superior al 90%. Cada sesión recuperada es un ingreso que de otro modo se habría perdido. En segundo lugar, es una potente herramienta de generación de ingresos. Permite al entrenador lanzar promociones flash y ofertas de up-selling/cross-selling con una inmediatez que el email no puede igualar. Por ejemplo, puede enviar un SMS a un segmento de clientes que finalizaron su paquete para ofrecerles una renovación con descuento, generando ventas recurrentes. Finalmente, y quizás lo más importante, fortalece la relación cliente-entrenador. Enviar mensajes motivacionales personalizados, felicitaciones por alcanzar un hito o consejos rápidos directamente a su WhatsApp crea una conexión personal y un sentido de cuidado que fomenta la lealtad y reduce el abandono. Esta comunicación proactiva y personalizada transforma el servicio de un simple entrenamiento a una experiencia de coaching integral, justificando precios premium y creando embajadores de la marca.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero enviar un recordatorio automático por WhatsApp a mis clientes 24 horas antes de su sesión agendada para reducir las ausencias.
- Como dueño de un estudio, quiero crear un segmento de clientes cuyo paquete de sesiones está a punto de expirar y enviarles una campaña por SMS con una oferta de renovación anticipada.
- Como coach online, quiero programar un mensaje motivacional de 'Feliz Lunes' por WhatsApp a todos mis clientes activos para empezar la semana con energía.
- Como entrenador, quiero ver un panel con las estadísticas de mi última campaña de SMS, incluyendo cuántas personas hicieron clic en el enlace para reservar una clase especial.
- Como administrador, quiero gestionar y crear plantillas de mensajes para WhatsApp Business para poder enviar notificaciones y promociones que cumplan con las políticas de la plataforma.
## Acciones Clave
- Crear una nueva campaña de SMS o WhatsApp.
- Seleccionar o crear un segmento de audiencia para la campaña (ej: 'Clientes inactivos', 'Asistentes al último reto').
- Redactar el mensaje utilizando placeholders como {{nombre_cliente}} o {{proxima_sesion}}.
- Elegir una plantilla pre-aprobada para campañas de WhatsApp.
- Programar el envío de la campaña para una fecha y hora específicas.
- Analizar el rendimiento de campañas pasadas (tasa de entrega, clics, costo).
- Gestionar el consentimiento (opt-in/opt-out) de los clientes para recibir comunicaciones.
## 🧩 Componentes React Sugeridos
### 1. CampaignBuilderContainer
Tipo: container | Componente principal que orquesta el flujo de creación de una campaña en varios pasos: tipo de campaña (SMS/WhatsApp), selección de audiencia, composición del mensaje y programación.
Props:
- userId: 
- string (requerido) - ID del entrenador que está creando la campaña.
- onCampaignSave: 
- (campaignData: Campaign) => void (requerido) - Callback que se ejecuta al guardar o programar la campaña.
Estados: currentStep ('audience', 'message', 'schedule'), campaignType ('sms' | 'whatsapp'), selectedSegmentId, messageContent, scheduledAt
Dependencias: react-step-wizard
Ejemplo de uso:
```typescript
<CampaignBuilderContainer userId='trainer-123' onCampaignSave={handleSave} />
```

### 2. AudienceSelector
Tipo: presentational | Permite al entrenador seleccionar un segmento de clientes predefinido (ej: 'Clientes Activos') o crear uno nuevo con filtros dinámicos (ej: 'Última sesión hace más de 60 días').
Props:
- segments: 
- Segment[] (requerido) - Array de segmentos de clientes predefinidos.
- onSegmentSelect: 
- (segmentId: string) => void (requerido) - Callback que devuelve el ID del segmento seleccionado.
- estimatedRecipients: 
- number (opcional) - Número estimado de clientes en el segmento seleccionado.
Estados: selectedSegment, filterCriteria
Dependencias: @headlessui/react
Ejemplo de uso:
```typescript
<AudienceSelector segments={userSegments} onSegmentSelect={setSegment} estimatedRecipients={15} />
```

### 3. MessageComposer
Tipo: presentational | Editor de texto para redactar el mensaje de la campaña. Incluye selector de placeholders (ej: {{nombre_cliente}}), contador de caracteres para SMS y un selector de plantillas aprobadas para WhatsApp.
Props:
- channel: 
- 'sms' | 'whatsapp' (requerido) - Determina las restricciones y funcionalidades del compositor.
- templates: 
- MessageTemplate[] (opcional) - Array de plantillas de WhatsApp aprobadas (solo si channel es 'whatsapp').
- onContentChange: 
- (content: string) => void (requerido) - Callback que se ejecuta cuando el contenido del mensaje cambia.
Estados: messageText, selectedTemplateId
Ejemplo de uso:
```typescript
<MessageComposer channel='whatsapp' templates={approvedTemplates} onContentChange={setMessage} />
```

### 4. useCampaignStats
Tipo: hook | Hook personalizado para obtener y gestionar los datos de estadísticas de una campaña específica, manejando estados de carga y error.
Props:
- campaignId: 
- string (requerido) - ID de la campaña de la cual se quieren obtener las estadísticas.
Estados: stats, isLoading, error
Dependencias: axios, swr
Ejemplo de uso:
```typescript
const { stats, isLoading, error } = useCampaignStats('campaign-abc');
```
## 🔌 APIs Requeridas
### 1. POST /api/marketing/campaigns
Crea y programa una nueva campaña de SMS o WhatsApp.
Parámetros:
- channel (
- string ('sms' | 'whatsapp'), body, requerido): El canal por el que se enviará la campaña.
- segmentId (
- string, body, requerido): ID del segmento de clientes al que se dirige la campaña.
- message (
- string, body, requerido): Contenido del mensaje. Para WhatsApp, debe coincidir con una plantilla.
- templateId (
- string, body, opcional): ID de la plantilla de WhatsApp (requerido si channel es 'whatsapp').
- scheduledAt (
- ISO 8601 Date string, body, opcional): Fecha y hora para programar el envío. Si es nulo, se envía inmediatamente.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto de la campaña creada con su ID y estado.
```json
{
  "campaignId": "camp_a4g8s2d",
  "status": "scheduled",
  "channel": "whatsapp",
  "segmentId": "seg_active_clients",
  "estimatedRecipients": 42,
  "scheduledAt": "2024-10-26T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos o el formato de `scheduledAt` es inválido.
- 402: 
- Payment Required - Créditos de mensajería insuficientes en la cuenta del entrenador.
- 403: 
- Forbidden - El usuario no tiene permisos para crear campañas.

### 2. GET /api/marketing/campaigns
Obtiene una lista paginada de todas las campañas creadas por el entrenador.
Parámetros:
- page (
- number, query, opcional): Número de página para la paginación.
- limit (
- number, query, opcional): Número de resultados por página.
Respuesta:
Tipo: object
Estructura: Un objeto con la lista de campañas y metadatos de paginación.
```json
{
  "data": [
    {
      "campaignId": "camp_a4g8s2d",
      "name": "Recordatorio Sesión Verano",
      "status": "sent",
      "sentAt": "2024-07-20T14:00:00Z",
      "stats": {
        "sent": 50,
        "delivered": 48,
        "clicks": 15
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```
Autenticación: Requerida

### 3. GET /api/marketing/campaigns/{campaignId}/stats
Obtiene las estadísticas detalladas de una campaña específica.
Parámetros:
- campaignId (
- string, path, requerido): ID único de la campaña.
Respuesta:
Tipo: object
Estructura: Un objeto detallado con todas las métricas de la campaña.
```json
{
  "campaignId": "camp_a4g8s2d",
  "name": "Recordatorio Sesión Verano",
  "status": "sent",
  "kpis": {
    "deliveryRate": 0.96,
    "ctr": 0.3125,
    "optOutRate": 0.02,
    "totalCost": "1.24"
  },
  "recipientDetails": [
    {
      "clientId": "client_1",
      "status": "read",
      "clicked": true
    },
    {
      "clientId": "client_2",
      "status": "delivered",
      "clicked": false
    },
    {
      "clientId": "client_3",
      "status": "failed",
      "reason": "invalid_number"
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La campaña con el ID especificado no existe o no pertenece al usuario.

### 4. GET /api/marketing/whatsapp-templates
Obtiene la lista de plantillas de WhatsApp aprobadas para la cuenta del entrenador.
Respuesta:
Tipo: array
Estructura: Un array de objetos, cada uno representando una plantilla aprobada.
```json
[
  {
    "templateId": "wa_tpl_reminder_24h",
    "name": "recordatorio_sesion_24h",
    "category": "UTILITY",
    "body": "¡Hola {{1}}! Solo un recordatorio de tu sesión de entrenamiento mañana a las {{2}}. ¡Prepárate para darlo todo! 💪",
    "status": "APPROVED"
  }
]
```
Autenticación: Requerida
Errores posibles:
- 503: 
- Service Unavailable - No se pudo conectar con la API del proveedor de WhatsApp (ej: Twilio).
## Notas Técnicas
Colecciones backend: sms_whatsapp_campaigns, client_segments, message_templates, communication_logs, client_preferences
KPIs visibles: Tasa de Entrega (Delivered Rate): % de mensajes que llegaron exitosamente al dispositivo del cliente., Tasa de Clics (CTR): % de destinatarios que hicieron clic en un enlace dentro del mensaje., Tasa de Cancelación (Opt-out Rate): % de clientes que se dieron de baja de las comunicaciones., Costo por Campaña: Gasto total de la campaña a través del proveedor de API (ej: Twilio)., Tasa de Conversión: % de clientes que completaron una acción deseada (ej: reservar una sesión) después de recibir el mensaje., Tasa de Fallo (Failure Rate): % de mensajes que no se pudieron entregar y su motivo.
## Documentación Completa
## Resumen
La funcionalidad de **Marketing por SMS/WhatsApp** es una herramienta estratégica dentro de TrainerERP, diseñada para potenciar la comunicación directa, personal y efectiva entre los entrenadores y sus clientes. Su objetivo principal es aprovechar los canales de mensajería con las tasas de apertura más altas para lograr objetivos de negocio clave: reducir las ausencias, aumentar las ventas y fidelizar a la clientela. A diferencia del email, que puede perderse en bandejas de entrada saturadas, un SMS o un mensaje de WhatsApp llega directamente al bolsillo del cliente, garantizando una atención casi inmediata.
Esta plataforma permite a los entrenadores ir más allá de la simple comunicación. Se integra profundamente con el CRM de TrainerERP, permitiendo una segmentación avanzada. Un entrenador puede, por ejemplo, enviar una oferta especial solo a clientes que no han reservado una sesión en el último mes, o un mensaje de felicitación automático cuando un cliente alcanza un hito de entrenamiento registrado en el sistema. Para WhatsApp, la herramienta gestiona todo el ciclo de vida de las plantillas de mensajes (creación, envío a aprobación y uso), asegurando el cumplimiento de las políticas de Meta y manteniendo una imagen profesional.
El valor reside en la capacidad de automatizar puntos de contacto de alto impacto que fortalecen la relación y generan ingresos. Desde recordatorios de citas que salvan sesiones hasta campañas de reactivación que recuperan clientes, esta funcionalidad convierte el teléfono del entrenador en una poderosa herramienta de gestión y crecimiento.
---
## Flujo paso a paso de uso real
Imaginemos a **Carlos**, un entrenador personal que utiliza TrainerERP. Quiere llenar dos huecos que tiene en su agenda para el próximo viernes.
1. **Acceso a la funcionalidad:** Carlos inicia sesión en TrainerERP y navega al menú lateral. Hace clic en `Marketing` y luego en `SMS/WhatsApp`.
2. **Inicio de la campaña:** En el dashboard de campañas, hace clic en el botón `+ Nueva Campaña`. El sistema le pregunta el canal: elige `SMS` por su inmediatez y porque la oferta es muy directa.
3. **Definición de la Audiencia:** En el segundo paso, se le presenta el `Selector de Audiencia`. Carlos quiere dirigirse a clientes que probablemente tengan disponibilidad. Crea un nuevo segmento dinámico con las siguientes reglas:
* `Estado del cliente` ES `Activo`.
* `Última sesión` FUE EN `Los últimos 30 días`.
* `Etiqueta` NO ES `Plan Corporativo` (ya que estos tienen horarios fijos).
El sistema le muestra que el segmento contiene a **34 clientes**.
4. **Composición del Mensaje:** Carlos pasa al editor de mensajes. Escribe un texto conciso y persuasivo:
> "¡Hola {{nombre_cliente}}! Tengo 2 huecos libres este viernes a las 10am y 4pm con un 25% de descuento. ¡El primero que responda se lo queda! Reserva aquí: {{enlace_reserva_viernes}}"
Utiliza el selector de placeholders para insertar `{{nombre_cliente}}` y el sistema genera automáticamente un enlace de reserva corto y rastreable para `{{enlace_reserva_viernes}}`.
5. **Revisión y Envío:** En el último paso, ve un resumen: `Campaña SMS` a `34 destinatarios`. El sistema muestra un costo estimado de `€1.70`. Todo parece correcto. Como es una oferta de última hora, elige `Enviar ahora` en lugar de programarla.
6. **Análisis de Resultados:** Una hora después, Carlos vuelve a la página. Ve que la campaña ya tiene un 97% de tasa de entrega. Hace clic en la campaña para ver los detalles y observa que 8 clientes (un 24% de CTR) han hecho clic en el enlace. En su calendario, ya ve las dos sesiones reservadas. La campaña ha sido un éxito rotundo, llenando sus huecos y generando ingresos extra con un coste mínimo.
---
## Riesgos operativos y edge cases
* **Cumplimiento Legal (Consentimiento):** El mayor riesgo es enviar mensajes a clientes sin su consentimiento explícito (opt-in). El sistema debe tener un flujo claro para capturar este consentimiento (ej: un checkbox durante el registro del cliente) y una forma sencilla para que el cliente se dé de baja (ej: responder 'STOP'). El incumplimiento puede acarrear multas severas (GDPR, TCPA).
* **Gestión de Costos:** Los servicios de SMS/WhatsApp tienen un costo por mensaje. Una campaña mal segmentada o un flujo automático descontrolado (ej: un recordatorio que se envía en bucle) podría generar una factura inesperadamente alta. Es crucial tener alertas de presupuesto y una estimación de costos clara antes de cada envío.
* **Calidad de los Números de Teléfono:** La efectividad depende de tener números de teléfono correctos y formateados internacionalmente en la base de datos de clientes. Un número incorrecto o que ya no pertenece al cliente puede llevar a fallos de entrega o a que el mensaje llegue a la persona equivocada.
* **Bloqueo por parte de WhatsApp:** Enviar contenido promocional a través de WhatsApp requiere plantillas pre-aprobadas. Intentar eludir esto o enviar spam puede resultar en el bloqueo del número de teléfono del negocio por parte de Meta, lo cual sería catastrófico para la comunicación.
* **Manejo de Respuestas:** Si se permite la comunicación bidireccional, el entrenador debe estar preparado para gestionar las respuestas. Si no hay un plan para ello, las preguntas de los clientes pueden quedar sin respuesta, generando una mala experiencia.
---
## KPIs y qué significan
* **Tasa de Entrega (Delivered Rate):** `(Mensajes Entregados / Mensajes Enviados) * 100`.
* **Qué significa para el entrenador:** Es el indicador más básico de la salud de su lista de contactos. Una tasa baja (ej: <90%) sugiere que muchos números de teléfono en su CRM son incorrectos o inactivos y necesita una limpieza de datos.
* **Tasa de Clics (CTR):** `(Clics Únicos / Mensajes Entregados) * 100`.
* **Qué significa para el entrenador:** Mide directamente qué tan atractiva es la oferta o el mensaje. Un CTR alto en un enlace para reservar una 'sesión de evaluación' indica que la propuesta de valor y el llamado a la acción son efectivos. Es el KPI principal para medir el interés.
* **Tasa de Conversión (Conversion Rate):** `(Acciones Completadas / Mensajes Entregados) * 100`.
* **Qué significa para el entrenador:** Este es el KPI que mide el dinero. ¿Cuántos clientes realmente reservaron y pagaron la sesión promocionada? Mide el retorno de la inversión (ROI) real de la campaña. Un CTR alto con una conversión baja puede indicar problemas en la landing page o en el proceso de pago.
* **Tasa de Cancelación (Opt-out Rate):** `(Clientes que se dieron de baja / Mensajes Entregados) * 100`.
* **Qué significa para el entrenador:** Es un termómetro de la relevancia y frecuencia de sus comunicaciones. Si esta tasa sube, significa que está enviando mensajes con demasiada frecuencia o que el contenido no es valioso para sus clientes. Es una señal de alarma para ajustar la estrategia.
* **Costo por Conversión:** `Costo Total de la Campaña / Número de Conversiones`.
* **Qué significa para el entrenador:** Le dice exactamente cuánto le costó adquirir esa nueva reserva o venta a través de la campaña. Esto le permite comparar la efectividad del marketing por SMS/WhatsApp frente a otros canales como los anuncios de Instagram o el email marketing.
---
## Diagramas de Flujo (Mermaid)
**Flujo de Creación de Campaña:**
mermaid
graph TD
A[Inicio: Dashboard de Mensajería] --> B{Clic en 'Nueva Campaña'};
B --> C[Paso 1: Elegir Canal];
C -- SMS --> D[Paso 2: Seleccionar/Crear Segmento];
C -- WhatsApp --> E[Paso 2: Seleccionar/Crear Segmento];
D --> F[Paso 3: Componer Mensaje SMS con Placeholders];
E --> G[Paso 3: Seleccionar Plantilla de WhatsApp y rellenar variables];
F --> H[Paso 4: Programar o Enviar Inmediatamente];
G --> H;
H --> I[Revisión Final: Ver resumen y costo estimado];
I --> J{Confirmar Envío};
J --> K[Campaña en estado 'Programada' o 'Enviando'];
K --> L[Fin: Ver en la lista de campañas];
