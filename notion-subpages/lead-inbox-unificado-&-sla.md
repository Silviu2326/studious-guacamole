# Lead Inbox Unificado & SLA

**Página padre:** Hola

---

# Lead Inbox Unificado & SLA
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
El 'Entrenador Personal (Administrador)' tiene una vista completa de todos los leads, puede configurar SLAs y asignar leads a otros entrenadores. El 'Entrenador Asociado' solo ve los leads que le han sido asignados y puede interactuar con ellos, pero no puede configurar los SLAs a nivel de negocio.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/analytics/inbox
## Descripción Funcional
El Lead Inbox Unificado es el centro de mando para la captación de nuevos clientes en TrainerERP. En el competitivo mundo del entrenamiento personal, la velocidad de respuesta es crítica. Un potencial cliente que pregunta por tus servicios en Instagram o en tu web está evaluando también a otros entrenadores. Perder ese mensaje o tardar un día en responder puede significar perder un cliente para siempre. Esta página soluciona ese problema centralizando todas las conversaciones de potenciales clientes en una única bandeja de entrada inteligente. Ya no tendrás que saltar entre Instagram DMs, mensajes de Facebook, correos electrónicos, formularios de tu web o chats. Todo converge aquí. El sistema no solo unifica, sino que añade una capa de inteligencia: clasifica automáticamente los leads (por ejemplo, alguien que pregunta 'cuánto cuestan tus planes' es un 'hot lead') y les asigna una prioridad. Además, implementa un sistema de Acuerdos de Nivel de Servicio (SLA) personalizables, mostrando un temporizador en cada conversación para asegurar que los leads más importantes sean respondidos en menos de una hora, por ejemplo. Esto crea un proceso de ventas proactivo y profesional, asegurando que ninguna oportunidad se enfríe y maximizando las conversiones de prospecto a cliente comprometido con sus objetivos de fitness.
## Valor de Negocio
El valor de negocio del Lead Inbox Unificado es directo y medible: un incremento en la tasa de conversión de leads y, por tanto, en los ingresos. Para un entrenador personal, cada lead no respondido es una pérdida de ingresos potenciales de cientos o miles de euros al año. Este módulo transforma la gestión de leads de un proceso caótico y reactivo a un sistema organizado y proactivo. Al centralizar la comunicación, se elimina el riesgo de perder mensajes en la avalancha de notificaciones diarias. La priorización inteligente y los SLAs de respuesta aseguran que el tiempo del entrenador se invierta en los leads con mayor probabilidad de conversión, optimizando el esfuerzo de ventas. Para estudios con varios entrenadores, permite una distribución equitativa y transparente de las oportunidades, además de monitorizar el rendimiento del equipo en la gestión comercial. El tracking de conversión desde la fuente del lead (ej. 'Campaña de Instagram Enero') hasta que se convierte en cliente permite tomar decisiones de marketing más inteligentes, invirtiendo recursos en los canales que realmente generan negocio. En resumen, esta funcionalidad convierte el interés de potenciales clientes en contratos firmados de manera sistemática y eficiente, siendo un motor clave para el crecimiento sostenible del negocio del entrenador.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como Entrenador Personal, quiero ver todos mis nuevos leads de Instagram, Facebook, mi web y WhatsApp en una sola bandeja de entrada para no tener que revisar múltiples aplicaciones y perder oportunidades.
- Como Administrador de un estudio, quiero establecer una regla de SLA que me alerte si un 'hot lead' no ha sido respondido en menos de 1 hora, para asegurar una atención al cliente excepcional.
- Como Entrenador Asociado, quiero poder ver una lista clara de los leads que se me han asignado, junto con todo el historial de la conversación, para poder continuar el proceso de venta eficazmente.
- Como Entrenador Personal, quiero poder responder a un mensaje de un lead directamente desde el Inbox Unificado y que mi respuesta se envíe por el canal original (ej. Instagram DM), para agilizar mi comunicación.
- Como Entrenador Personal, quiero poder cambiar el estado de un lead a 'Convertido' y que el sistema me pregunte qué plan ha comprado, para poder rastrear la efectividad de mis canales de captación.
## Acciones Clave
- Filtrar la lista de leads por canal (Instagram, Web, etc.), estado (Nuevo, Contactado, Descartado), entrenador asignado o estado del SLA (A tiempo, En riesgo, Vencido).
- Abrir una conversación para ver el historial completo y responder directamente al lead a través del canal de origen.
- Asignar o re-asignar un lead a un entrenador específico del equipo.
- Actualizar el estado del lead (ej. de 'Nuevo' a 'Contactado' o 'Convertido') para moverlo a través del embudo de ventas.
- Ver un resumen de KPIs en la cabecera de la página, como el tiempo medio de respuesta y la tasa de conversión del mes.
- Configurar las políticas de SLA (ej. 'Responder a leads del formulario web en menos de 8 horas').
## 🧩 Componentes React Sugeridos
### 1. LeadInboxContainer
Tipo: container | Componente principal que orquesta la página. Gestiona el estado global, como los filtros activos, la paginación, y realiza las llamadas a la API para obtener los leads. No renderiza UI directamente, sino que pasa datos y funciones a los componentes presentacionales.
Estados: leads: Lead[], isLoading: boolean, error: Error | null, filters: ILeadFilters, pagination: IPagination
Dependencias: react-query (para data fetching y caching), zustand (para gestión de estado)
Ejemplo de uso:
```typescript
<LeadInboxContainer />
```

### 2. LeadList
Tipo: presentational | Renderiza la lista de leads. Recibe un array de leads y una función para manejar la selección de un lead. Muestra un estado de carga o un mensaje de 'no hay resultados'.
Props:
- leads: 
- Lead[] (requerido) - Array de objetos de lead para mostrar.
- onSelectLead: 
- (leadId: string) => void (requerido) - Callback que se ejecuta cuando un usuario hace clic en un item de la lista.
- isLoading: 
- boolean (opcional) - Si es true, muestra un esqueleto de carga.
Estados: activeLeadId: string | null
Ejemplo de uso:
```typescript
<LeadList leads={leadsData} onSelectLead={handleSelect} isLoading={isFetching} />
```

### 3. ConversationPanel
Tipo: presentational | Muestra el historial de mensajes de una conversación seleccionada y un campo de texto para enviar una nueva respuesta. Obtiene los datos del lead y la conversación activa.
Props:
- leadId: 
- string (requerido) - ID del lead cuya conversación se está mostrando.
Estados: messages: Message[], newMessage: string, isSending: boolean
Dependencias: react-query (para obtener los mensajes de la conversación y para la mutación de enviar mensaje)
Ejemplo de uso:
```typescript
<ConversationPanel leadId={selectedLeadId} />
```

### 4. useLeadFilters
Tipo: hook | Hook personalizado para encapsular la lógica compleja de los filtros del inbox. Maneja el estado de los filtros y provee funciones para actualizarlos. Sincroniza el estado de los filtros con los query params de la URL para que se puedan compartir.
Estados: filters: { status: string; channel: string; assigneeId: string; }, setFilter: (filterName: string, value: string) => void, clearFilters: () => void
Dependencias: react-router-dom (useSearchParams)
Ejemplo de uso:
```typescript
const { filters, setFilter } = useLeadFilters();
```
## 🔌 APIs Requeridas
### 1. GET /api/inbox/leads
Obtiene una lista paginada de leads, con opciones de filtrado y ordenación.
Parámetros:
- page (
- number, query, opcional): Número de la página a obtener.
- limit (
- number, query, opcional): Número de leads por página.
- status (
- string, query, opcional): Filtra por estado del lead (new, contacted, converted, discarded).
- channel (
- string, query, opcional): Filtra por canal de origen (instagram, facebook, web_form).
- assigneeId (
- string, query, opcional): Filtra por el ID del entrenador asignado.
Respuesta:
Tipo: object
Estructura: Objeto con un array de leads y metadatos de paginación.
```json
{
  "data": [
    {
      "id": "ld_123",
      "name": "Ana García",
      "last_message_snippet": "¿Hola! Me gustaría saber precios para...",
      "source_channel": "instagram",
      "status": "new",
      "assigned_to": {
        "id": "trainer_abc",
        "name": "Carlos Ruiz"
      },
      "sla_status": "at_risk",
      "sla_due_timestamp": "2023-10-27T14:00:00Z",
      "updated_at": "2023-10-27T12:30:00Z"
    }
  ],
  "pagination": {
    "total": 128,
    "page": 1,
    "limit": 20,
    "totalPages": 7
  }
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - Token de autenticación no válido o ausente.
- 400: 
- Bad Request - Parámetro de filtro no válido.

### 2. POST /api/inbox/leads/{leadId}/messages
Envía un nuevo mensaje a un lead. El backend se encarga de enrutar el mensaje al canal de origen apropiado (Instagram, SMS, etc.).
Parámetros:
- leadId (
- string, path, requerido): ID del lead al que se envía el mensaje.
- body (
- object, body, requerido): Contenido del mensaje a enviar.
Respuesta:
Tipo: object
Estructura: El objeto del mensaje recién creado y enviado.
```json
{
  "id": "msg_987",
  "lead_id": "ld_123",
  "direction": "outgoing",
  "channel": "instagram",
  "content": "¡Hola Ana! Claro, te cuento...",
  "status": "sent",
  "created_at": "2023-10-27T13:05:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El leadId especificado no existe.
- 502: 
- Bad Gateway - Fallo al enviar el mensaje a través de la API del proveedor externo (ej. Meta API).

### 3. PATCH /api/inbox/leads/{leadId}
Actualiza propiedades de un lead, como su estado o el entrenador asignado.
Parámetros:
- leadId (
- string, path, requerido): ID del lead a actualizar.
- updates (
- object, body, requerido): Campos a actualizar.
Respuesta:
Tipo: object
Estructura: El objeto del lead actualizado.
```json
{
  "id": "ld_123",
  "name": "Ana García",
  "status": "contacted",
  "assigned_to": {
    "id": "trainer_def",
    "name": "Laura Sanz"
  }
}
```
Autenticación: Requerida
Errores posibles:
- 403: 
- Forbidden - El usuario no tiene permisos para reasignar este lead.
- 400: 
- Bad Request - El valor para el estado o el assigneeId no es válido.
## Notas Técnicas
Colecciones backend: leads, conversations, messages, sla_policies, channels
KPIs visibles: Tiempo Promedio de Primera Respuesta (TTFR), Tasa de Conversión de Lead a Cliente (%), Número de Leads por Canal (últimos 30 días), Porcentaje de Cumplimiento de SLA (%), Tasa de Contacto (Leads respondidos vs. Total de leads recibidos)
## Documentación Completa
## Resumen
El **Lead Inbox Unificado & SLA** es una herramienta estratégica dentro del área de **ANÁLISIS & INTELIGENCIA** de TrainerERP, diseñada para resolver uno de los mayores desafíos de los entrenadores personales modernos: la gestión fragmentada de la comunicación con potenciales clientes. En la era digital, un lead puede llegar desde un comentario en un post de Instagram, un mensaje directo, un formulario en la web, una campaña de email marketing o un chat en vivo. La incapacidad para gestionar esta afluencia de manera centralizada y eficiente se traduce directamente en oportunidades de negocio perdidas.
Este módulo transforma el caos en orden. Centraliza todas las conversaciones entrantes de leads en una única interfaz, similar a una bandeja de entrada de correo electrónico pero sobrealimentada con inteligencia de negocio. No solo agrega, sino que analiza y prioriza. Mediante un sistema de puntuación configurable (lead scoring), distingue entre un curioso ('cold lead') y un cliente potencial listo para comprar ('hot lead').
La funcionalidad clave son los Acuerdos de Nivel de Servicio (SLA). El entrenador puede definir reglas como "Todos los leads de Instagram deben recibir una primera respuesta en menos de 1 hora". El sistema visualiza estas reglas con temporizadores y alertas, gamificando la velocidad de respuesta y asegurando que nadie se quede esperando. Esto no solo mejora la tasa de conversión, sino que establece un estándar de profesionalismo desde el primer contacto, un diferenciador clave en el mercado del fitness.
## Flujo paso a paso de uso real
1. **Captura del Lead**: Laura, una potencial clienta, ve una historia de éxito en el Instagram del Entrenador Carlos y le envía un Mensaje Directo: "¡Hola Carlos! Vi la transformación de tu cliente y es increíble. ¿Me podrías dar información sobre tus planes de entrenamiento online?".
2. **Ingreso al Inbox**: Inmediatamente, este mensaje aparece como una nueva conversación en el Lead Inbox de Carlos dentro de TrainerERP. El sistema lo etiqueta con el ícono de Instagram y, al detectar palabras clave como "información" y "planes", lo marca como "Hot Lead 🔥".
3. **Activación del SLA**: La política de SLA configurada por Carlos para "Hot Leads de Instagram" es de 1 hora. Un temporizador visual aparece junto a la conversación de Laura, mostrando "59:59 restantes". Carlos también recibe una notificación push en su móvil.
4. **Respuesta Centralizada**: Carlos abre el inbox, ve la conversación de Laura en la parte superior de su lista de prioridades. Hace clic en ella. En lugar de ir a la app de Instagram, escribe su respuesta directamente en el campo de texto de TrainerERP: "¡Hola Laura! Gracias por tu mensaje. Me alegra que te sientas inspirada. Te cuento..." y pulsa "Enviar".
5. **Entrega Transparente**: El mensaje se envía a través de la API de Instagram y Laura lo recibe en sus DMs como una respuesta normal de Carlos. Para ella, la experiencia es fluida y no sabe que Carlos está usando una herramienta externa.
6. **Actualización de Estado**: Después de enviar el mensaje, el sistema actualiza automáticamente el estado del lead de "Nuevo" a "Contactado" y el temporizador del SLA se detiene y marca como "Cumplido ✅".
7. **Seguimiento y Conversión**: Durante los siguientes días, toda la conversación con Laura se mantiene en ese hilo. Cuando Laura decide contratar el 'Plan de Transformación de 3 meses', Carlos cambia manualmente el estado del lead a "Convertido". El sistema le presenta un modal para asociar esa conversión con el plan específico y registrar el valor del contrato. Este dato alimentará el dashboard de análisis de ventas.
## Riesgos operativos y edge cases
- **Sincronización Bidireccional**: El mayor riesgo es que un entrenador responda a un lead directamente desde la app nativa (ej. app de Instagram). Si nuestro sistema no capta esa respuesta vía webhooks, el estado del SLA y la conversación en TrainerERP quedarán desactualizados. La solución requiere una arquitectura de webhooks muy robusta y un proceso de 're-sincronización' periódico.
- **Falsos Positivos en Lead Scoring**: El sistema de scoring podría marcar un mensaje de spam o una pregunta irrelevante como "Hot Lead". Se debe permitir al usuario marcar conversaciones como "No es un lead" o "Spam" para entrenar al modelo y limpiar la bandeja de entrada.
- **Gestión de Múltiples Identidades**: ¿Qué pasa si la misma persona contacta por Instagram y luego por email? El sistema debería ser capaz de sugerir la fusión de estos leads basándose en datos como el nombre, email o número de teléfono, para evitar tener conversaciones duplicadas con la misma persona.
- **Dependencia de APIs de Terceros**: El sistema depende completamente de la disponibilidad y políticas de las APIs de Meta, Google, etc. Un cambio en sus términos, una caída de su servicio o la revocación de un token de acceso puede inutilizar partes críticas de la funcionalidad. Es vital tener un monitoreo constante y un plan de contingencia claro para notificar a los usuarios.
## KPIs y qué significan
- **Tiempo Promedio de Primera Respuesta (TTFR)**: Mide el tiempo que transcurre desde que un lead entra en el sistema hasta que recibe la primera respuesta del entrenador. Un TTFR bajo (ej. < 1 hora) está directamente correlacionado con mayores tasas de conversión. Es el indicador de la agilidad y eficiencia del proceso de ventas.
- **Tasa de Conversión de Lead a Cliente (%)**: (Leads Convertidos / Total de Leads) * 100. Es el KPI de negocio más importante. Permite al entrenador saber qué porcentaje de las personas que muestran interés se convierten en clientes de pago. Se puede desglosar por canal para ver qué fuentes son más efectivas.
- **Número de Leads por Canal**: Un recuento simple que muestra de dónde provienen los clientes potenciales (Instagram, Web, Facebook, etc.). Ayuda a tomar decisiones sobre dónde invertir tiempo y dinero en marketing. Si el 90% de los clientes convertidos vienen de Instagram, es una señal clara de dónde enfocar los esfuerzos.
- **Porcentaje de Cumplimiento de SLA (%)**: Mide la disciplina y el rendimiento del equipo (o del propio entrenador) a la hora de cumplir con los objetivos de tiempo de respuesta definidos. Un alto porcentaje indica un servicio al cliente excelente y profesional desde el primer momento.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Lead Entrante] -->|Vía Instagram, Web, etc.| B(Creación de Lead en Inbox)
B --> C{¿Es Hot Lead?}
C -->|Sí| D[Aplica SLA de 1 hora]
C -->|No| E[Aplica SLA de 24 horas]
D --> F[Entrenador Responde]
E --> F
F --> G{¿Respuesta a tiempo?}
G -->|Sí| H[SLA Cumplido ✅]
G -->|No| I[SLA Vencido ❌]
H --> J(Conversación Activa)
I --> J
J --> K{¿Cliente acepta contratar?}
K -->|Sí| L[Marcar como Convertido]
K -->|No| M[Marcar como Descartado]
