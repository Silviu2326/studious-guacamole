# Webinars & Virtual Events Manager

**Página padre:** Hola

---

# Webinars & Virtual Events Manager
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada para que los entrenadores (ya sean administradores o asociados con permisos) puedan crear, gestionar y analizar eventos virtuales. Los roles de 'Cliente' y 'Lead/Potencial Cliente' no acceden a esta interfaz de gestión; ellos interactúan con las páginas de registro públicas y las salas de eventos en vivo que se generan desde este módulo.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/experiences/virtual-events
## Descripción Funcional
El 'Webinars & Virtual Events Manager' es el centro de control definitivo para que los entrenadores personales y estudios de fitness diseñen, automaticen y moneticen experiencias virtuales. Esta plataforma integrada permite a los profesionales del fitness ir más allá del entrenamiento 1-a-1, construyendo una comunidad y estableciéndose como autoridades en su nicho. Desde aquí, un entrenador puede orquestar una amplia gama de eventos: desde webinars gratuitos diseñados para captar leads, como 'Los 5 pilares de una nutrición sostenible', hasta masterclasses premium de pago sobre 'Técnicas avanzadas de levantamiento de peso muerto'. También facilita la creación de eventos de comunidad, como retos de fitness grupales en vivo o sesiones de preguntas y respuestas exclusivas para clientes. El sistema automatiza todo el ciclo de vida del evento: la creación de páginas de registro personalizables, la gestión de inscritos, el envío de secuencias de recordatorios por email y SMS, la transmisión en vivo a través de una sala virtual integrada, y el seguimiento post-evento. Las grabaciones se generan automáticamente y se pueden ofrecer como contenido bajo demanda, creando un activo digital reutilizable. Finalmente, un potente panel de análisis proporciona métricas clave sobre el rendimiento de cada evento, permitiendo al entrenador entender qué temas resuenan con su audiencia y optimizar su estrategia para futuros eventos.
## Valor de Negocio
El 'Webinars & Virtual Events Manager' transforma la forma en que un entrenador personal escala su negocio y su impacto. Su principal valor reside en la creación de nuevas y diversificadas fuentes de ingresos, liberando al entrenador de la limitación de vender únicamente su tiempo en sesiones individuales. Al ofrecer masterclasses de pago o retos grupales virtuales, pueden servir a muchos clientes simultáneamente, multiplicando su potencial de ganancias. En segundo lugar, es una herramienta de marketing y captación de leads de altísimo valor. Un webinar gratuito bien ejecutado posiciona al entrenador como un experto, genera confianza y captura emails de potenciales clientes altamente cualificados, nutriéndolos para futuras ofertas. Además, fortalece la comunidad y la retención de clientes existentes. Los eventos exclusivos crean un sentido de pertenencia, mejoran la satisfacción del cliente y reducen las tasas de abandono. Operativamente, el valor es inmenso: automatiza tareas logísticas que consumen mucho tiempo (inscripciones, recordatorios, seguimiento), permitiendo al entrenador centrarse en lo que mejor sabe hacer: crear contenido de calidad y entrenar. Esto se traduce en una mayor eficiencia, un branding más fuerte y un negocio más resiliente y escalable.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero crear un webinar gratuito sobre 'Cómo evitar lesiones en el gimnasio' para captar leads cualificados y hacer crecer mi lista de correo.
- Como coach de grupos, quiero organizar y cobrar por un 'Reto de 21 días de Core' con sesiones semanales en vivo para fomentar la comunidad y generar una nueva fuente de ingresos.
- Como experto en nutrición deportiva, quiero vender acceso a una masterclass en vivo sobre 'Planificación de comidas para atletas de resistencia' para monetizar mi conocimiento especializado.
- Como entrenador online, quiero que el sistema envíe automáticamente recordatorios por email y SMS a los inscritos 24 horas y 1 hora antes de un evento, para maximizar la tasa de asistencia en vivo.
- Como administrador de un estudio de fitness, quiero analizar las métricas de un webinar pasado, como la tasa de asistencia y el engagement en el chat, para decidir qué temas abordar en futuros eventos.
## Acciones Clave
- Crear un nuevo evento virtual (webinar, masterclass, reto, Q&A).
- Personalizar la página de registro del evento con branding, descripción y formulario de captura.
- Configurar la automatización de comunicaciones (confirmación, recordatorios, seguimiento).
- Gestionar la lista de inscritos (ver, filtrar, exportar).
- Iniciar y gestionar la sesión en vivo (compartir pantalla, moderar chat, lanzar encuestas).
- Acceder y gestionar la biblioteca de grabaciones de eventos pasados.
- Revisar el panel de analíticas de rendimiento para un evento específico.
## 🧩 Componentes React Sugeridos
### 1. EventsDashboardContainer
Tipo: container | Componente principal que obtiene y gestiona la lista de todos los eventos virtuales del entrenador. Maneja la lógica de filtrado (próximos, pasados, borradores) e inicia el flujo de creación de un nuevo evento.
Props:
- trainerId: 
- string (requerido) - ID del entrenador para obtener sus eventos.
Estados: events: Event[], isLoading: boolean, error: string | null, filter: 'upcoming' | 'past' | 'drafts', isCreationModalOpen: boolean
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<EventsDashboardContainer trainerId='trainer-123' />
```

### 2. EventCard
Tipo: presentational | Muestra la información resumida de un único evento en una tarjeta. Muestra KPIs clave como inscritos y fecha, y proporciona acciones rápidas como editar o ver analíticas.
Props:
- event: 
- object (requerido) - Objeto con los datos del evento (title, date, status, stats).
- onEdit: 
- () => void (requerido) - Callback que se ejecuta al hacer clic en el botón de editar.
- onViewAnalytics: 
- () => void (requerido) - Callback para navegar a la página de analíticas del evento.
Dependencias: @mui/material
Ejemplo de uso:
```typescript
<EventCard event={eventData} onEdit={() => openEditModal(eventData.id)} onViewAnalytics={() => navigate(`/events/${eventData.id}/analytics`)} />
```

### 3. EventCreationWizard
Tipo: container | Un formulario multi-paso que guía al entrenador en la creación de un nuevo evento. Cada paso se enfoca en una parte de la configuración: detalles, página de registro, automatizaciones y pago.
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del wizard (modal).
- onClose: 
- () => void (requerido) - Función para cerrar el wizard.
- onEventCreated: 
- (newEvent: Event) => void (requerido) - Callback que se ejecuta cuando el evento se ha creado exitosamente.
Estados: currentStep: number, eventData: Partial<Event>, isSubmitting: boolean
Dependencias: react-hook-form, zod
Ejemplo de uso:
```typescript
<EventCreationWizard isOpen={isModalOpen} onClose={() => setModalOpen(false)} onEventCreated={refetchEvents} />
```

### 4. useEventAnalytics
Tipo: hook | Hook personalizado para encapsular la lógica de obtención y procesamiento de datos analíticos para un evento específico. Devuelve los datos listos para ser consumidos por componentes de visualización.
Props:
- eventId: 
- string (requerido) - ID del evento del cual obtener las analíticas.
Dependencias: react-query, axios
Ejemplo de uso:
```typescript
const { data, isLoading, error } = useEventAnalytics(eventId);
```
## 🔌 APIs Requeridas
### 1. POST /api/events
Crea un nuevo evento virtual. Requiere los detalles básicos del evento en el cuerpo de la solicitud.
Parámetros:
- eventData (
- object, body, requerido): Objeto que contiene: title, description, startTime_utc, type ('webinar', 'masterclass'), access ('free', 'paid'), price (si es 'paid').
Respuesta:
Tipo: object
Estructura: El objeto del evento recién creado, incluyendo su nuevo ID.
```json
{
  "id": "evt_a1b2c3d4",
  "title": "Introducción al Entrenamiento Funcional",
  "status": "draft",
  "startTime_utc": "2024-10-26T18:00:00.000Z",
  "trainerId": "trainer-123"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos o los datos son inválidos (e.g., fecha en el pasado).
- 403: 
- Forbidden - El usuario no tiene permisos para crear eventos (e.g., rol de cliente).

### 2. GET /api/events
Obtiene una lista paginada de los eventos del entrenador, con opciones de filtrado.
Parámetros:
- status (
- 'upcoming' | 'past' | 'drafts', query, opcional): Filtra los eventos por su estado.
- page (
- number, query, opcional): Número de página para la paginación.
- limit (
- number, query, opcional): Número de resultados por página.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene un array de eventos y metadatos de paginación.
```json
{
  "data": [
    {
      "id": "evt_a1b2c3d4",
      "title": "Introducción al Entrenamiento Funcional",
      "status": "upcoming",
      "registrations_count": 85
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
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o ha expirado.

### 3. PUT /api/events/{eventId}
Actualiza los detalles de un evento existente.
Parámetros:
- eventId (
- string, path, requerido): El ID del evento a actualizar.
- updateData (
- object, body, requerido): Un objeto con los campos a actualizar.
Respuesta:
Tipo: object
Estructura: El objeto del evento actualizado.
```json
{
  "id": "evt_a1b2c3d4",
  "title": "Webinar: Introducción al Entrenamiento Funcional",
  "status": "published"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El eventId no corresponde a ningún evento existente.
- 400: 
- Bad Request - Los datos de actualización son inválidos.

### 4. GET /api/events/{eventId}/analytics
Obtiene las métricas de rendimiento y KPIs para un evento completado.
Parámetros:
- eventId (
- string, path, requerido): El ID del evento del cual se solicitan las analíticas.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene todos los KPIs relevantes del evento.
```json
{
  "eventId": "evt_a1b2c3d4",
  "totalRegistrations": 150,
  "liveAttendees": 90,
  "attendanceRate": 0.6,
  "newLeads": 25,
  "recordingViews": 45,
  "revenue": 0
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El eventId no existe.
- 403: 
- Forbidden - El usuario no es el propietario del evento y no tiene permisos para ver sus analíticas.
## Notas Técnicas
Colecciones backend: events, event_registrations, event_recordings, event_automations, event_analytics
KPIs visibles: Total de Inscritos, Tasa de Asistencia en Vivo (Asistentes / Inscritos), Nuevos Leads Generados (Inscritos que no estaban en el CRM), Ingresos Totales (para eventos de pago), Tasa de Conversión de la Página de Registro (Inscritos / Visitantes Únicos), Engagement Promedio (interacciones en chat/encuestas por asistente), Visualizaciones de la Grabación
## Documentación Completa
## Resumen
El módulo **Webinars & Virtual Events Manager** es una funcionalidad estratégica dentro de TrainerERP, ubicada en el área de **EXPERIENCIAS & EVENTOS**. Su propósito es empoderar a los entrenadores personales para que trasciendan el modelo de servicio tradicional de uno a uno, permitiéndoles crear, gestionar, automatizar y monetizar eventos virtuales a escala. Esta herramienta convierte el conocimiento y la experiencia de un entrenador en activos digitales que pueden ser utilizados para captar leads, generar ingresos adicionales, y construir una comunidad sólida y comprometida.
Este módulo se integra de forma nativa con otras áreas funcionales clave de TrainerERP:
- **CAPTURA & CONVERSIÓN:** Los webinars gratuitos son una de las herramientas más efectivas de generación de leads. Cada inscrito se añade automáticamente al CRM del entrenador, pudiendo ser segmentado y nutrido a través de embudos de venta.
- **MONETIZACIÓN & OFERTAS:** Permite la venta directa de masterclasses, talleres o retos virtuales, creando flujos de ingresos que no dependen del tiempo presencial del entrenador.
- **SEGMENTACIÓN & AUTOMATIZACIÓN:** Los asistentes a un evento pueden ser etiquetados y segmentados automáticamente (ej. 'Asistió al webinar de nutrición'), lo que permite un marketing de seguimiento hiper-personalizado y relevante.
En esencia, este gestor de eventos no es solo una herramienta de logística, sino un motor de crecimiento para el negocio del entrenador.
## Flujo paso a paso de uso real
Imaginemos a **Carlos, un entrenador especializado en calistenia** que quiere ampliar su alcance.
1. **Planificación:** Carlos decide ofrecer un webinar gratuito titulado "5 Errores Comunes al Empezar con Calistenia" para atraer a principiantes.
2. **Creación:** Dentro de TrainerERP, navega a `Experiencias > Eventos Virtuales` y hace clic en "Crear Nuevo Evento". El sistema le presenta un asistente.
3. **Paso 1: Detalles del Evento:**
* **Título:** 5 Errores Comunes al Empezar con Calistenia
* **Tipo:** Webinar Gratuito
* **Fecha y Hora:** Selecciona una fecha y hora. El sistema automáticamente gestionará las zonas horarias para los visitantes de la página de registro.
4. **Paso 2: Página de Registro:**
* Carlos sube una imagen suya haciendo un `muscle-up`.
* Escribe 3 puntos clave que cubrirá en el webinar.
* El formulario de registro (nombre y email) ya está pre-configurado para conectarse a su CRM.
5. **Paso 3: Automatizaciones:**
* Carlos revisa la secuencia de emails por defecto y la aprueba: email de confirmación instantáneo, recordatorio 24h antes, y recordatorio 1h antes con el enlace de acceso.
6. **Promoción:** Publica el evento y obtiene un enlace único (ej. `carlos-trainer.trainererp.com/events/calistenia-errores`). Lo comparte en su Instagram, en su newsletter y en grupos de Facebook relevantes.
7. **Día del Evento:**
* 15 minutos antes, Carlos entra a la sala de anfitrión desde su dashboard. Prueba su cámara y micrófono.
* A la hora programada, hace clic en "Iniciar Transmisión".
* Durante el webinar, interactúa con los asistentes a través del chat y lanza una encuesta: "¿Cuál es tu mayor desafío con la calistenia?"
* Al final, presenta su programa de entrenamiento de pago y comparte un enlace para inscribirse.
8. **Post-Evento:**
* La grabación se procesa automáticamente. A las pocas horas, el sistema envía un email a todos los inscritos con el enlace para ver la repetición.
* Carlos crea un segmento en su CRM con todos los que asistieron en vivo y les envía una oferta especial para su programa.
9. **Análisis:** Al día siguiente, revisa las métricas: 200 inscritos, 110 asistentes (55% de asistencia), 45 nuevos leads y 5 ventas directas de su programa. Con estos datos, decide hacer otro webinar el próximo mes.
## Riesgos operativos y edge cases
- **Problemas de Conexión del Anfitrión:** Si la conexión a internet del entrenador falla, la transmisión se interrumpirá. El sistema debería intentar reconectar automáticamente durante un breve período. Se debe recomendar a los entrenadores tener una conexión de respaldo (e.g., tethering móvil).
- **Moderación del Chat:** Un chat en vivo puede ser vulnerable a spam o comentarios abusivos. Se requiere una funcionalidad de moderación (borrar mensajes, silenciar/bloquear usuarios) para el anfitrión.
- **Cancelación de Eventos:** Si un entrenador cancela un evento pagado, el sistema debe tener un flujo claro para procesar reembolsos automáticos a todos los compradores a través del procesador de pagos (e.g., Stripe).
- **Límites de Asistentes:** Los planes de TrainerERP podrían tener límites en el número de asistentes simultáneos. El sistema debe gestionar qué sucede cuando se alcanza el límite (e.g., mostrar un mensaje de 'sala llena' a nuevos intentos de conexión).
- **Compatibilidad de Navegadores:** La sala de eventos debe ser probada exhaustivamente en los principales navegadores (Chrome, Firefox, Safari, Edge) para garantizar una experiencia consistente para todos los asistentes.
## KPIs y qué significan
- **Tasa de Conversión de la Página de Registro:** (Inscritos / Visitantes Únicos). Mide la efectividad del título, la descripción y el diseño de la página de registro. Una tasa baja (<20%) sugiere que el mensaje no es atractivo o la página es confusa.
- **Tasa de Asistencia en Vivo:** (Asistentes en vivo / Inscritos). Un indicador clave del interés real en el tema y la efectividad de los recordatorios. Una tasa saludable suele estar entre el 30% y el 50%. Si es baja, se puede experimentar con la frecuencia o el contenido de los emails de recordatorio.
- **Engagement Promedio:** Mide cuántas interacciones (mensajes de chat, respuestas a encuestas) hubo por asistente. Un alto engagement indica que el contenido fue interesante y el anfitrión supo conectar con la audiencia.
- **Tasa de Visualización de la Grabación:** (Usuarios que vieron la grabación / Inscritos que no asistieron en vivo). Muestra el valor del contenido a largo plazo. Una alta tasa de visualización es positiva.
- **Tasa de Conversión Post-Evento:** (Clientes que compraron la oferta / Asistentes). Este es el KPI de negocio más importante. Mide directamente el ROI del evento. Si es bajo, puede que la oferta no estuviera bien alineada con el contenido del webinar o que el pitch de venta necesite mejorar.
## Diagramas de Flujo
mermaid
graph TD
A[Entrenador inicia creación] --> B{Asistente de Creación};
B --> C[Paso 1: Detalles Básicos];
C --> D[Paso 2: Página de Registro];
D --> E[Paso 3: Automatizaciones];
E --> F[Paso 4: Monetización (Opcional)];
F --> G[Evento Creado y Publicado];
G --> H[Entrenador comparte enlace];
subgraph Flujo del Cliente
I[Lead ve enlace] --> J[Visita Página de Registro];
J --> K[Se inscribe];
K --> L[Recibe Email de Confirmación];
L --> M[Recibe Recordatorios];
M --> N[Se une al Evento en Vivo];
end
G --> O[Día del Evento: Entrenador Inicia Transmisión];
O <--> N;
O --> P[Evento Finalizado];
P --> Q[Grabación se procesa];
Q --> R[Sistema envía email con grabación];
P --> S[Entrenador revisa Analíticas];
