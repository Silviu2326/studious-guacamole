# SMS/WhatsApp Automation

**Página padre:** Hola

---

# SMS/WhatsApp Automation
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada principalmente para el 'Entrenador Personal (Administrador)', quien tiene el control total para crear, editar, activar y analizar el rendimiento de las automatizaciones. Un 'Entrenador Asociado' en un estudio más grande podría tener permisos restringidos, como solo poder visualizar las automatizaciones activas o utilizar plantillas pre-aprobadas por el administrador, pero no crear flujos desde cero para garantizar la consistencia de la marca y el control de costos.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/automations/messaging
## Descripción Funcional
La página de 'SMS/WhatsApp Automation' es el centro de control de comunicación proactiva de TrainerERP. Permite a los entrenadores personales diseñar y desplegar flujos de mensajes automáticos que se activan en función de eventos específicos en el ciclo de vida de sus clientes. En lugar de enviar manualmente recordatorios, mensajes de seguimiento o felicitaciones, el entrenador puede configurar reglas del tipo 'si-esto-entonces-aquello' que se ejecutan 24/7. Por ejemplo, se puede crear una automatización que envíe un SMS de recordatorio 24 horas antes de cada sesión agendada, reduciendo drásticamente las ausencias. Otro flujo podría ser un mensaje de bienvenida por WhatsApp a un nuevo cliente justo después de que complete su primer pago, proporcionándole un enlace a su plan de entrenamiento inicial. La interfaz visual permite encadenar acciones, como 'esperar 2 días después de la primera sesión' y luego 'enviar un SMS preguntando cómo se sienten sus músculos'. Se pueden usar variables dinámicas como `{{cliente_nombre}}` o `{{fecha_proxima_cita}}` para personalizar cada mensaje, haciendo que la comunicación, aunque automatizada, se sienta personal y directa. Esta herramienta transforma la comunicación reactiva en una estrategia de engagement proactiva, fortaleciendo la relación con el cliente, mejorando la retención y liberando horas de trabajo administrativo cada semana.
## Valor de Negocio
El valor de negocio de la automatización de SMS y WhatsApp para un entrenador personal es inmenso y multifacético. En primer lugar, ataca directamente uno de los mayores problemas operativos: las ausencias y cancelaciones de última hora. Los recordatorios automáticos pueden reducir la tasa de 'no-shows' en más de un 30%, lo que se traduce directamente en ingresos recuperados. En segundo lugar, automatiza el cobro y la gestión de pagos al enviar recordatorios de facturas pendientes, mejorando el flujo de caja y eliminando la necesidad de conversaciones incómodas sobre dinero. Más allá de lo operativo, esta herramienta es un potente motor de retención de clientes. Mensajes automáticos de felicitación por alcanzar un hito (ej. '¡Felicidades por completar 10 sesiones!'), seguimientos post-entrenamiento ('¿Cómo te encuentras después de la sesión de ayer?') y mensajes para reactivar a clientes inactivos crean una experiencia de cliente superior y demuestran un nivel de atención que es difícil de escalar manualmente. Esto aumenta el valor de vida del cliente (LTV) y reduce la tasa de abandono. Finalmente, libera el recurso más valioso del entrenador: su tiempo. Al automatizar estas tareas de comunicación, el entrenador puede centrarse en la captación de nuevos clientes, su propia formación o, lo más importante, en ofrecer un servicio excepcional durante las sesiones.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero configurar un recordatorio automático por SMS 24 horas antes de cada sesión, para reducir las ausencias y cancelaciones de última hora.
- Como entrenador online, quiero enviar un mensaje de WhatsApp de bienvenida a cada nuevo cliente que contrata un plan, para que se sientan acogidos y sepan los siguientes pasos.
- Como dueño de un estudio, quiero que se envíe un SMS de felicitación automático cuando un cliente registra un nuevo récord personal en la app, para mantener su motivación alta.
- Como coach de grupos, quiero automatizar un recordatorio de pago por SMS 3 días antes del vencimiento de la mensualidad, para mejorar el flujo de caja y evitar conversaciones incómodas.
- Como entrenador personal, quiero crear un flujo que envíe un mensaje de 'Te echamos de menos' si un cliente no ha reservado una sesión en 14 días, para prevenir el abandono.
- Como entrenador, quiero poder ver un log de todos los mensajes automáticos enviados a un cliente específico dentro de su perfil, para tener un historial completo de nuestra comunicación.
## Acciones Clave
- Crear una nueva automatización desde cero o a partir de una plantilla específica para entrenadores (ej: 'Recordatorio de Cita').
- Configurar el 'trigger' o disparador de la automatización (ej: 'Cita Agendada', 'Pago Vencido', 'Logro Desbloqueado').
- Definir la secuencia de acciones y demoras en un constructor visual (ej: 'Esperar 24h antes de la cita', 'Enviar SMS').
- Personalizar el contenido del mensaje usando un editor de texto enriquecido con variables dinámicas (ej: `{{cliente_nombre}}`, `{{fecha_cita}}`).
- Activar, pausar o desactivar automatizaciones existentes con un solo clic.
- Visualizar un dashboard con las estadísticas de rendimiento de cada automatización (mensajes enviados, tasa de entrega, errores).
## 🧩 Componentes React Sugeridos
### 1. AutomationBuilderContainer
Tipo: container | Componente principal que orquesta la creación y edición de una automatización. Maneja el estado completo del flujo, incluyendo triggers, acciones y configuraciones. Realiza las llamadas a la API para guardar los cambios.
Props:
- automationId: 
- string | null (opcional) - ID de la automatización a editar. Si es nulo, se crea una nueva.
Estados: automationState, isLoading, error, isSaving
Dependencias: react-beautiful-dnd (para reordenar acciones), axios
Ejemplo de uso:
```typescript
<AutomationBuilderContainer automationId='auto_12345' />
```

### 2. TriggerSelector
Tipo: presentational | Muestra una interfaz de usuario para seleccionar y configurar el disparador de la automatización. Presenta una lista de eventos disponibles en TrainerERP (ej. 'Cita Creada', 'Pago Recibido') y los campos de configuración correspondientes.
Props:
- availableTriggers: 
- TriggerDefinition[] (requerido) - Array con la definición de todos los triggers posibles en el sistema.
- selectedTrigger: 
- TriggerState (requerido) - El estado actual del trigger seleccionado.
- onTriggerChange: 
- (newTriggerState: TriggerState) => void (requerido) - Callback que se ejecuta cuando el usuario modifica la configuración del trigger.
Ejemplo de uso:
```typescript
<TriggerSelector availableTriggers={triggers} selectedTrigger={automation.trigger} onTriggerChange={handleTriggerUpdate} />
```

### 3. MessageTemplateEditor
Tipo: presentational | Un editor de texto que permite escribir el contenido del SMS o WhatsApp. Incluye un selector de variables (ej. `{{cliente_nombre}}`) que se pueden insertar en el texto y una vista previa del mensaje.
Props:
- value: 
- string (requerido) - El contenido actual del mensaje.
- onChange: 
- (newValue: string) => void (requerido) - Función que se llama cuando el texto cambia.
- variables: 
- string[] (requerido) - Lista de variables disponibles para insertar (ej: ['cliente_nombre', 'fecha_cita']).
Estados: cursorPosition
Ejemplo de uso:
```typescript
<MessageTemplateEditor value={message} onChange={setMessage} variables={['cliente_nombre', 'entrenador_nombre']} />
```

### 4. useAutomationApi
Tipo: hook | Hook personalizado que encapsula la lógica de comunicación con el backend para las automatizaciones. Proporciona funciones para obtener, crear, actualizar y eliminar automatizaciones, manejando el estado de carga y errores.
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { automations, createAutomation, isLoading } = useAutomationApi();
```
## 🔌 APIs Requeridas
### 1. GET /api/automations
Obtiene una lista de todas las automatizaciones de mensajería creadas por el entrenador autenticado.
Parámetros:
- status (
- string, query, opcional): Filtra por estado (ej: 'active', 'paused', 'draft').
Respuesta:
Tipo: array
Estructura: Un array de objetos de automatización, cada uno con su id, nombre, trigger, número de acciones y estado.
```json
[
  {
    "id": "auto_abc123",
    "name": "Recordatorio de Cita 24h",
    "triggerType": "APPOINTMENT_UPCOMING",
    "actionCount": 1,
    "status": "active",
    "stats": {
      "sentLast30d": 150
    }
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación es inválido o no fue provisto.

### 2. POST /api/automations
Crea una nueva automatización de mensajería.
Parámetros:
- automationData (
- object, body, requerido): Objeto con la configuración completa de la automatización, incluyendo nombre, trigger, condiciones y acciones.
Respuesta:
Tipo: object
Estructura: El objeto de la automatización recién creada, incluyendo su nuevo ID.
```json
{
  "id": "auto_def456",
  "name": "Bienvenida a Nuevo Cliente",
  "triggerType": "CLIENT_CREATED",
  "actions": [
    {
      "type": "SEND_WHATSAPP",
      "template": "Hola {{cliente_nombre}}! ..."
    }
  ],
  "status": "draft"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Los datos de la automatización son inválidos o incompletos (ej. falta el trigger).
- 402: 
- Payment Required - El plan del usuario no incluye la creación de más automatizaciones.

### 3. PUT /api/automations/{automationId}
Actualiza una automatización existente.
Parámetros:
- automationId (
- string, path, requerido): El ID de la automatización a actualizar.
- updateData (
- object, body, requerido): Objeto con los campos a actualizar.
Respuesta:
Tipo: object
Estructura: El objeto de la automatización completo y actualizado.
```json
{
  "id": "auto_abc123",
  "name": "Recordatorio de Cita 24h (Actualizado)",
  "status": "active"
}
```
Autenticación: Requerida
Errores posibles:
- 403: 
- Forbidden - El usuario no tiene permisos para modificar esta automatización.
- 404: 
- Not Found - No se encontró ninguna automatización con el ID proporcionado.

### 4. GET /api/automations/{automationId}/logs
Obtiene el historial de ejecuciones (logs) para una automatización específica, útil para depuración y seguimiento.
Parámetros:
- automationId (
- string, path, requerido): El ID de la automatización.
- page (
- number, query, opcional): Número de página para paginación de resultados.
Respuesta:
Tipo: array
Estructura: Un array de objetos de log, cada uno detallando una ejecución: cliente afectado, estado (enviado, fallido), fecha y mensaje de error si aplica.
```json
[
  {
    "logId": "log_xyz789",
    "clientId": "client_123",
    "clientName": "Ana García",
    "timestamp": "2023-10-27T10:00:00Z",
    "status": "sent",
    "providerMessageId": "SMxxxxxxxxxxxxxxxxxxxxxxxx"
  }
]
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna automatización con el ID proporcionado.
## Notas Técnicas
Colecciones backend: automations, automation_logs, clients, appointments, payments, client_achievements
KPIs visibles: Tasa de Entrega (%), Mensajes Enviados (últimos 30 días), Número de Automatizaciones Activas, Costo Estimado de Mensajería del Mes, Tasa de Fallo de Envío (%), Automatización con Mejor Rendimiento (más ejecuciones)
## Documentación Completa
## Resumen
La funcionalidad de Automatización de SMS/WhatsApp es un componente estratégico del área funcional 'EMAIL & SMS' de TrainerERP. Su objetivo principal es permitir a los entrenadores personales y estudios de fitness escalar su comunicación y mejorar la experiencia del cliente sin incrementar su carga de trabajo administrativo. A través de una interfaz visual intuitiva, los usuarios pueden construir flujos de comunicación que se disparan automáticamente basados en eventos clave como la reserva de una cita, la realización de un pago, el registro de un nuevo cliente o la consecución de un objetivo de entrenamiento.
Esta herramienta no solo gestiona tareas operativas como el envío de recordatorios para reducir ausencias, sino que también funciona como un potente motor de engagement y retención. Automatizar mensajes de felicitación, seguimiento post-entrenamiento o reactivación de clientes inactivos crea múltiples puntos de contacto positivos que fortalecen la relación entrenador-cliente. La personalización mediante variables dinámicas asegura que cada mensaje, aunque automatizado, se perciba como personal y relevante. En esencia, esta página transforma la comunicación de una tarea reactiva a un sistema proactivo que trabaja para el negocio del entrenador 24/7, mejorando la eficiencia, el flujo de caja y, lo más importante, la lealtad del cliente.
## Flujo paso a paso de uso real
**Caso de uso:** Un entrenador personal, Carlos, quiere reducir el número de clientes que olvidan sus sesiones. Decide crear una automatización para enviar un recordatorio por SMS 24 horas antes de cada cita.
1. **Navegación:** Carlos inicia sesión en TrainerERP y se dirige a la sección 'Automatizaciones' en el menú de navegación principal, y luego hace clic en la pestaña 'SMS/WhatsApp'.
2. **Creación:** Ve una lista de sus automatizaciones existentes (si las tuviera) y un botón grande que dice 'Crear Nueva Automatización'. Hace clic en él.
3. **Elección de Plantilla:** Se le presenta una galería de plantillas predefinidas. Ve una llamada 'Recordatorio de Cita 24h Antes' y la selecciona para empezar más rápido.
4. **Configuración del Trigger (Disparador):** La plantilla ya tiene el trigger pre-configurado: 'Evento de Calendario'. Carlos revisa la condición, que es 'La cita está programada para comenzar dentro de 24 horas'. Confirma que es exactamente lo que necesita.
5. **Configuración de la Acción:** La siguiente etapa es la acción. La plantilla ya tiene una acción 'Enviar SMS'. Carlos hace clic para editar el contenido del mensaje.
6. **Personalización del Mensaje:** Ve un cuadro de texto con un mensaje de ejemplo. Lo modifica para que se ajuste a su estilo:
> `¡Hola {{cliente_nombre}}! 👋 Solo un recordatorio de nuestra sesión de entrenamiento mañana a las {{cita_hora}}. ¡Ven con energía para darlo todo! Nos vemos en el estudio. - Carlos.`
Utiliza el selector de variables para asegurarse de que `{{cliente_nombre}}` y `{{cita_hora}}` se inserten correctamente.
7. **Guardado y Activación:** Una vez satisfecho con el mensaje, Carlos nombra la automatización como 'Recordatorio 24h SMS Citas' y hace clic en el botón 'Guardar y Activar'. El sistema le muestra una confirmación y la automatización aparece ahora en su lista con el estado 'Activa'.
8. **Verificación:** A partir de ese momento, el sistema de TrainerERP monitoreará automáticamente todas las citas agendadas. 24 horas antes de cada una, enviará el SMS personalizado al cliente correspondiente sin que Carlos tenga que hacer nada más.
## Riesgos operativos y edge cases
- **Cumplimiento Legal (GDPR/LOPD/TCPA):** El mayor riesgo es enviar mensajes a usuarios que no han dado su consentimiento explícito. El sistema DEBE tener un campo 'communicationConsent' en el perfil del cliente, que solo se marque a través de un opt-in claro (ej. una casilla en el formulario de registro). Además, debe existir un mecanismo de opt-out universal (responder 'STOP') que inhabilite todas las comunicaciones futuras.
- **Gestión de Costos:** Los servicios de SMS/WhatsApp (como Twilio) tienen un costo por mensaje. Si un entrenador configura una automatización con un trigger muy frecuente por error, podría incurrir en costos inesperados. El sistema debe tener salvaguardas, como un resumen de costos estimados y posiblemente límites configurables por cuenta.
- **Calidad de los Datos:** Una automatización es tan buena como los datos que utiliza. Si los números de teléfono en la base de datos de clientes son incorrectos o están mal formateados, la tasa de entrega será baja y se gastará dinero en envíos fallidos. Es crucial tener validación de formato en el campo del número de teléfono.
- **Fatiga de Comunicación:** Si un entrenador crea demasiadas automatizaciones, podría abrumar a sus clientes. Se podría implementar una regla de 'no más de X mensajes automáticos por día por cliente' para prevenir el spam.
- **Gestión de Respuestas:** El SMS es a menudo un canal bidireccional. Si un cliente responde al recordatorio ('¿Puedo cambiar la hora?'), el entrenador necesita una forma de ver esa respuesta. Esto implica la necesidad de un 'Inbox' o la integración de webhooks para recibir mensajes entrantes, lo cual añade complejidad.
## KPIs y qué significan
- **Tasa de Entrega (%):** (Mensajes Entregados / Mensajes Enviados) * 100. Este es el KPI de salud más importante. Mide la calidad de la base de datos de teléfonos y la fiabilidad del proveedor de mensajería. Una tasa baja (ej. < 95%) indica un problema que necesita ser investigado.
- **Mensajes Enviados (últimos 30 días):** Un recuento bruto del volumen de actividad. Ayuda al entrenador a entender el uso y a correlacionarlo con los costos.
- **Número de Automatizaciones Activas:** Indica el nivel de adopción de la funcionalidad por parte del usuario. Un número creciente sugiere que el entrenador encuentra valor en la herramienta.
- **Costo Estimado de Mensajería del Mes:** Proporciona transparencia sobre los gastos asociados. Es crucial para que los entrenadores gestionen su presupuesto y entiendan el ROI de la funcionalidad.
- **Tasa de Fallo de Envío (%):** (Mensajes Fallidos / Mensajes Enviados) * 100. El complemento de la tasa de entrega. Analizar los motivos de fallo (ej. 'número inválido', 'no suscrito') permite depurar problemas.
- **Automatización con Mejor Rendimiento:** Identifica qué flujo está generando más actividad. Esto puede ayudar al entrenador a entender qué tipo de comunicación es más relevante para su negocio (ej. si los recordatorios son el flujo más activo, refuerza su valor en la reducción de ausencias).
## Diagramas de Flujo (Mermaid)
mermaid
sequenceDiagram
participant Client
participant TrainerERP_Scheduler
participant TrainerERP_AutomationEngine
participant SMS_Gateway
Client->>+TrainerERP_Scheduler: Agenda una cita para el 20/12 a las 10:00
TrainerERP_Scheduler->>-Client: Confirma la cita
TrainerERP_Scheduler->>TrainerERP_AutomationEngine: Notifica nueva cita (client_id, appointment_time)
Note over TrainerERP_AutomationEngine: El motor de automatización detecta la cita y calcula el momento de envío (19/12 10:00)
TrainerERP_AutomationEngine-->>SMS_Gateway: (el 19/12 a las 10:00) Envía solicitud de SMS para Client
SMS_Gateway-->>+Client: Entrega el SMS de recordatorio
Client->>-SMS_Gateway: Recibe el mensaje
