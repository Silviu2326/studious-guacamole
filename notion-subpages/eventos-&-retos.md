# Eventos & Retos

**Página padre:** Hola

---

# Eventos & Retos
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado, Cliente
Esta funcionalidad es principalmente para el 'Entrenador Personal (Administrador)' y 'Entrenador Asociado', quienes tienen permisos para crear, gestionar, y monetizar eventos y retos. Son los arquitectos de la experiencia. El rol de 'Cliente' interactúa con esta página para descubrir, inscribirse y participar en los eventos. Su vista es limitada a la participación: ver detalles del evento, registrar su progreso, ver leaderboards y comunicarse con el grupo, pero no pueden crear ni editar eventos.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/experiencias/eventos
## Descripción Funcional
El módulo 'Eventos & Retos' es una herramienta estratégica diseñada para que los entrenadores personales trasciendan el modelo de servicio uno a uno y se conviertan en líderes de comunidades. Permite la creación y gestión integral de experiencias grupales, tanto presenciales como online, que aumentan el engagement y abren nuevas vías de monetización. El sistema está específicamente adaptado al nicho del fitness, permitiendo configurar 'Retos de Transformación de 30 días', 'Desafíos de Pérdida de Peso', 'Bootcamps de fin de semana' o 'Eventos de running al aire libre'.

El entrenador puede definir todos los aspectos del evento: nombre, fechas, descripción detallada, plazas disponibles, y un precio de inscripción con integración de pasarela de pago. La gestión de participantes es centralizada, permitiendo ver quién se ha inscrito, su estado de pago y su progreso a lo largo del tiempo. Una de las características clave es el seguimiento de progreso personalizable. El entrenador puede definir qué métricas son importantes para un reto (ej. % de grasa corporal perdido, kilos levantados en sentadilla, entrenamientos completados) y los clientes pueden registrar sus datos directamente en la plataforma. Esto alimenta automáticamente los 'Leaderboards' (tablas de clasificación), una potente herramienta de gamificación que fomenta la competencia sana y la motivación. Además, el módulo se integra con las áreas de 'EMAIL & SMS' para automatizar la comunicación, enviando recordatorios, consejos diarios, o mensajes de ánimo a todos los participantes, manteniendo la energía del grupo alta sin un esfuerzo manual constante.
## Valor de Negocio
El valor de negocio del módulo 'Eventos & Retos' es multifacético y de alto impacto para un entrenador personal. En primer lugar, crea una nueva y escalable fuente de ingresos. En lugar de vender su tiempo en bloques de una hora, el entrenador puede vender un programa o una experiencia a decenas o cientos de clientes simultáneamente, rompiendo la barrera de ingreso ligada a su tiempo disponible. Segundo, es una herramienta de retención de clientes extremadamente poderosa. Al crear un sentido de comunidad y pertenencia, los clientes se sienten más conectados con el entrenador y con otros miembros, lo que aumenta drásticamente su lealtad y reduce las tasas de abandono. Un cliente que es parte de un grupo de apoyo tiene más probabilidades de alcanzar sus metas y, por lo tanto, de seguir con el servicio. Tercero, cada reto o evento exitoso se convierte en una potente pieza de marketing. Los resultados, testimonios y transformaciones generados son 'Social Proof' de alto valor que se pueden utilizar en el área de 'CONFIANZA & SOCIAL PROOF' para atraer a nuevos clientes. Finalmente, posiciona al entrenador no solo como un proveedor de servicios, sino como un líder e influencer en su nicho, fortaleciendo su marca personal y su autoridad en el mercado.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero crear un 'Reto de 90 días de Transformación' con un precio de inscripción, establecer reglas claras, y definir métricas de progreso (fotos, peso, medidas) para lanzar una oferta premium de alto valor a mi comunidad.
- Como cliente, quiero poder navegar por los próximos eventos, inscribirme en un 'Desafío de Verano', pagar online de forma segura y tener acceso inmediato a un panel con toda la información y el calendario del desafío.
- Como entrenador, quiero ver un dashboard centralizado por cada evento con un leaderboard en tiempo real basado en 'entrenamientos completados', para poder nombrar al 'participante de la semana' y mantener alta la motivación.
- Como participante de un reto, quiero recibir notificaciones automáticas por email o SMS con consejos diarios y recordatorios para registrar mi progreso, para no olvidarme y mantenerme comprometido con el objetivo.
- Como entrenador, al finalizar un reto, quiero poder seleccionar a los ganadores, distribuir premios digitales (como cupones de descuento para mi próximo servicio) y generar una galería con las mejores transformaciones (con permiso del cliente) para promocionar la siguiente edición.
## Acciones Clave
- Crear un nuevo evento/reto con un asistente paso a paso (definir nombre, fechas, descripción, reglas, precio, métricas).
- Gestionar la lista de participantes (ver inscritos, estado del pago, enviar invitaciones directas).
- Configurar y visualizar el leaderboard del evento, personalizando las métricas de clasificación.
- Programar y enviar comunicaciones grupales o individuales a los participantes.
- Monitorear el progreso agregado del grupo e individual de los participantes a través de gráficos.
- Finalizar un evento, declarar ganadores y archivar los resultados para futuras consultas.
## 🧩 Componentes React Sugeridos
### 1. EventBuilderWizard
Tipo: container | Un componente de formulario multi-paso que guía al entrenador a través de la creación de un nuevo evento o reto. Maneja el estado del formulario complejo y la validación en cada paso.
Props:
- initialEventData: 
- Partial<Event> (opcional) - Datos iniciales para precargar el formulario, usado para editar un evento existente.
- onSubmit: 
- (eventData: Event) => Promise<void> (requerido) - Función callback que se ejecuta al completar y enviar el formulario.
Estados: currentStep, formData, validationErrors, isSubmitting
Dependencias: react-hook-form, zod
Ejemplo de uso:
```typescript
<EventBuilderWizard onSubmit={handleCreateEvent} />
```

### 2. EventDashboard
Tipo: container | El panel de control principal para un evento específico. Muestra KPIs clave, la lista de participantes, el leaderboard y las herramientas de comunicación. Obtiene y gestiona todos los datos relacionados con el evento.
Props:
- eventId: 
- string (requerido) - El ID del evento a mostrar.
Estados: eventDetails, participants, leaderboardData, isLoading, error
Dependencias: swr, recharts
Ejemplo de uso:
```typescript
<EventDashboard eventId='evt_12345' />
```

### 3. Leaderboard
Tipo: presentational | Un componente visual que renderiza una tabla de clasificación ordenada. Es reutilizable y solo se encarga de mostrar los datos que recibe.
Props:
- participants: 
- Array<{ name: string; avatarUrl: string; score: number; rank: number; }> (requerido) - Un array de objetos con los datos de los participantes a mostrar.
- metricName: 
- string (requerido) - El nombre de la métrica que se está usando para el ranking (ej. 'Kgs Perdidos').
Ejemplo de uso:
```typescript
<Leaderboard participants={rankedParticipants} metricName='Entrenamientos Completados' />
```

### 4. useEventData
Tipo: hook | Un hook personalizado que abstrae la lógica de fetching y caching de los datos de un evento específico, incluyendo detalles, participantes y leaderboard.
Props:
- eventId: 
- string (requerido) - ID del evento para el cual obtener los datos.
Estados: Devuelve un objeto con { data, isLoading, error, mutate }
Dependencias: swr
Ejemplo de uso:
```typescript
const { data, isLoading } = useEventData(eventId);
```
## 🔌 APIs Requeridas
### 1. POST /api/trainer/events
Crea un nuevo evento o reto para el entrenador autenticado.
Parámetros:
- eventData (
- object, body, requerido): Objeto con todos los detalles del evento: nombre, tipo, fechas, precio, reglas, métricas, etc.
Respuesta:
Tipo: object
Estructura: El objeto completo del evento recién creado, incluyendo su nuevo ID.
```json
{
  "id": "evt_abc123",
  "name": "Reto de 30 días Fit",
  "type": "challenge",
  "startDate": "2024-08-01T00:00:00.000Z",
  "fee": 49.99,
  "trainerId": "trn_xyz789"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Datos del evento inválidos o campos requeridos faltantes.
- 402: 
- Payment Required - El plan del entrenador no incluye la creación de eventos.

### 2. GET /api/trainer/events
Obtiene una lista paginada de todos los eventos creados por el entrenador.
Parámetros:
- status (
- string, query, opcional): Filtra por estado del evento: 'upcoming', 'active', 'completed'.
- page (
- number, query, opcional): Número de página para la paginación.
Respuesta:
Tipo: object
Estructura: Un objeto con un array de eventos y metadatos de paginación.
```json
{
  "data": [
    {
      "id": "evt_abc123",
      "name": "Reto de 30 días Fit",
      "status": "active",
      "participantCount": 25
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
- Unauthorized - El usuario no está autenticado como entrenador.

### 3. GET /api/trainer/events/{eventId}/leaderboard
Obtiene los datos del leaderboard para un evento específico.
Parámetros:
- eventId (
- string, path, requerido): El ID del evento.
- metric (
- string, query, opcional): La métrica específica por la cual ordenar el leaderboard. Si no se provee, usa la principal del evento.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene la métrica usada y un array de participantes ordenados.
```json
{
  "metricName": "% Grasa Corporal Perdido",
  "ranking": [
    {
      "rank": 1,
      "userId": "usr_cde456",
      "userName": "Ana Gómez",
      "userAvatar": "url/to/avatar.jpg",
      "value": -3.5,
      "progress": "down"
    },
    {
      "rank": 2,
      "userId": "usr_fgh789",
      "userName": "Carlos Ruiz",
      "userAvatar": "url/to/avatar2.jpg",
      "value": -3.2,
      "progress": "down"
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El evento con el ID especificado no existe.
- 403: 
- Forbidden - El entrenador no tiene permiso para ver este evento.

### 4. POST /api/client/events/{eventId}/register
Inscribe al cliente autenticado a un evento. Puede requerir un token de pago.
Parámetros:
- eventId (
- string, path, requerido): El ID del evento al que se quiere inscribir.
- paymentToken (
- string, body, opcional): Token de la pasarela de pago si el evento tiene costo.
Respuesta:
Tipo: object
Estructura: Un objeto confirmando el estado de la inscripción.
```json
{
  "registrationId": "reg_123xyz",
  "eventId": "evt_abc123",
  "userId": "usr_cde456",
  "status": "confirmed",
  "paymentStatus": "paid"
}
```
Autenticación: Requerida
Errores posibles:
- 402: 
- Payment Required - El pago falló o no se proporcionó un token para un evento de pago.
- 409: 
- Conflict - El usuario ya está inscrito en el evento o las plazas están agotadas.
## Notas Técnicas
Colecciones backend: events, event_registrations, user_progress_logs, leaderboards, event_automations
KPIs visibles: Ingresos Totales por Evento, Tasa de Inscripción (Inscritos / Plazas Totales), Tasa de Participación Diaria (Participantes que registran progreso / Total Inscritos), Tasa de Finalización del Reto, Promedio de Engagement (Comentarios/Posts en el muro del evento), Coste de Adquisición por Participante (si se usa publicidad)
## Documentación Completa
## Resumen
El módulo de 'Eventos & Retos' es una de las funcionalidades de mayor valor estratégico dentro de TrainerERP. Su propósito es dotar a los entrenadores personales de las herramientas necesarias para escalar su negocio más allá de las sesiones individuales, permitiéndoles crear, gestionar y monetizar experiencias grupales. Estas experiencias, como 'retos de transformación' o 'bootcamps', no solo representan una fuente de ingresos diversificada y altamente escalable, sino que también son el motor principal para la construcción de una comunidad sólida y comprometida. Un cliente que participa en un reto grupal siente un mayor nivel de conexión y apoyo, lo que se traduce directamente en mayores tasas de retención y éxito. Adicionalmente, los resultados y testimonios generados en estos eventos son activos de marketing de incalculable valor (social proof) que alimentan el embudo de ventas del entrenador.
Esta funcionalidad se integra nativamente con otros módulos clave de TrainerERP: utiliza 'MONETIZACIÓN & OFERTAS' para procesar los pagos de inscripción, se apoya en 'EMAIL & SMS' para las comunicaciones automatizadas, y los resultados alimentan el área de 'CONFIANZA & SOCIAL PROOF'. Es, en esencia, el puente entre la gestión de clientes y la construcción de una marca personal fuerte.
---
## Flujo paso a paso de uso real
1. **Ideación y Creación (Entrenador):** Laura, una entrenadora online, decide lanzar un 'Reto Post-Navidad de 21 días'. Entra en su panel de TrainerERP, navega a `Experiencias > Eventos & Retos` y hace clic en 'Crear Nuevo Reto'.
2. **Configuración:** El asistente `EventBuilderWizard` la guía.
* **Paso 1 (Básico):** Introduce el nombre, una descripción motivacional, las fechas de inicio y fin, y sube una imagen de portada atractiva.
* **Paso 2 (Reglas y Precio):** Establece un límite de 100 participantes, un precio de 'early bird' de 79€ y un precio normal de 99€. Define las reglas principales del reto.
* **Paso 3 (Seguimiento):** Configura las métricas clave para el leaderboard: 'Nº de entrenamientos completados' (se sincroniza con el plan de entrenamiento del cliente) y 'Puntos de consistencia' (otorgados por registrar actividad diariamente).
* **Paso 4 (Comunicación):** Programa una serie de emails automáticos: un email de bienvenida al inscribirse, recordatorios diarios y un email de felicitación al finalizar.
3. **Promoción y Venta (Entrenador):** Una vez publicado, el sistema genera una landing page pública para el reto. Laura copia el enlace y lo comparte en su Instagram y en su newsletter (utilizando el módulo 'EMAIL & SMS' de TrainerERP).
4. **Inscripción (Cliente):** Marcos, un seguidor de Laura, ve la promoción. Hace clic, aterriza en la página del reto, se convence y procede a la inscripción. El sistema lo guía a través de la pasarela de pago integrada. Tras el pago, recibe el email de bienvenida y el reto aparece en su portal de cliente.
5. **Ejecución y Participación (Cliente y Entrenador):** Durante 21 días, Marcos registra cada entrenamiento completado. En su portal, ve su progreso y cómo sube en el leaderboard. Laura, desde su `EventDashboard`, monitoriza la participación general, ve quién se está quedando atrás y puede enviar un mensaje personal de ánimo directamente desde la plataforma. El leaderboard fomenta una competencia amistosa y mantiene a todos enganchados.
6. **Finalización y Post-Evento (Entrenador):** Al finalizar los 21 días, el sistema cierra el reto. Laura anuncia a los 3 primeros del leaderboard, quienes reciben un cupón de descuento para su programa de coaching 1-a-1. Luego, utiliza una plantilla para enviar una encuesta de satisfacción y solicitar testimonios y fotos de transformación a los participantes más exitosos.
---
## Riesgos operativos y edge cases
- **Gestión de Pagos y Reembolsos:** Un cliente podría solicitar un reembolso. Se debe tener una política clara y una funcionalidad para procesar devoluciones (parciales o totales) que actualice el estado del participante.
- **Fraude en Leaderboards:** Participantes podrían registrar datos falsos para ganar. El sistema podría incluir flags para progresos anómalos (ej. una pérdida de peso irreal en un día) para revisión del entrenador.
- **Baja Participación:** Si un evento no alcanza el quórum mínimo, el entrenador debe poder cancelarlo y comunicar/reembolsar a los inscritos de forma masiva.
- **Privacidad de Datos:** El manejo de fotos de 'antes y después' y datos de peso es crítico. El sistema debe requerir consentimiento explícito y granular para que el cliente decida si sus datos pueden ser usados anónimamente, para el leaderboard, o en material de marketing.
- **Soporte Técnico:** Durante un reto, los clientes pueden tener problemas técnicos. Debe haber un canal de comunicación claro para soporte que no sobrecargue al entrenador.
---
## KPIs y qué significan
- **Ingresos Totales por Evento:** La métrica más directa del éxito financiero. Ayuda al entrenador a decidir qué tipo de eventos son más rentables.
- **Tasa de Finalización del Reto:** (Participantes que completan / Total de inscritos). Un indicador clave de la calidad del programa y del nivel de engagement generado. Una tasa baja puede indicar que el reto era demasiado difícil o poco motivador.
- **Tasa de Conversión Post-Evento:** (% de participantes que compran otro producto/servicio después del evento). Mide la efectividad del evento como herramienta de 'upselling' hacia servicios de mayor valor.
- **NPS (Net Promoter Score) del Evento:** Recopilado a través de una encuesta final, mide la satisfacción general y la probabilidad de que los participantes lo recomienden. Esencial para iterar y mejorar futuras ediciones.
- **Número de Testimonios/Social Proof Generados:** Un KPI cualitativo que mide la cantidad de material de marketing valioso que se ha producido gracias al evento.
---
## Diagramas de Flujo (Mermaid)
**Flujo de Creación de Evento por el Entrenador:**
mermaid
graph TD
A[Acceder a /dashboard/experiencias/eventos] --> B{Clic en 'Crear Nuevo'};
B --> C[Paso 1: Info Básica];
C --> D[Paso 2: Reglas y Precios];
D --> E[Paso 3: Métricas y Leaderboard];
E --> F[Paso 4: Automatización de Comunicación];
F --> G{Revisar y Publicar};
G --> H[Evento Creado y Landing Page Generada];
