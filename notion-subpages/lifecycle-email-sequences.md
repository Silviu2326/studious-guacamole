# Lifecycle Email Sequences

**Página padre:** Hola

---

# Lifecycle Email Sequences
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada para que los entrenadores (Administradores o Asociados) configuren y gestionen las comunicaciones automáticas. Los roles 'Cliente' y 'Lead' son los destinatarios de estas secuencias, pero no interactúan con esta interfaz. Permite al entrenador crear flujos de trabajo de comunicación sin necesidad de intervención manual.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/automatizacion/secuencias-email
## Descripción Funcional
La página 'Lifecycle Email Sequences' es el centro de control para la automatización de la comunicación en TrainerERP. Permite a los entrenadores personales diseñar, construir y desplegar secuencias de emails automáticas que se activan en función del comportamiento y ciclo de vida de sus clientes. Utilizando un editor visual intuitivo de arrastrar y soltar, el entrenador puede mapear flujos completos: desde el momento en que un nuevo cliente se inscribe, recibiendo una cálida bienvenida y una guía de primeros pasos, hasta el seguimiento posterior a una sesión para recoger feedback, o el envío de un mensaje de ánimo cuando un cliente alcanza un nuevo hito de fuerza o pérdida de peso. El sistema va más allá de simples recordatorios, permitiendo la creación de lógicas condicionales. Por ejemplo, si un cliente no ha registrado un entrenamiento en 14 días, se le puede enviar automáticamente una secuencia de reactivación con consejos o una oferta especial. Si un cliente ha completado 3 meses de entrenamiento con éxito, se le puede enviar una secuencia de upsell para un plan de nutrición avanzado. Cada email puede ser personalizado con variables dinámicas como el nombre del cliente, su objetivo principal, o su último logro, haciendo que cada comunicación se sienta personal y relevante, fortaleciendo la relación entrenador-cliente y mejorando drásticamente la retención y el compromiso.
## Valor de Negocio
El valor de negocio de 'Lifecycle Email Sequences' es transformacional para un entrenador personal, ya que ataca directamente tres pilares clave: escalabilidad, retención y monetización. En términos de escalabilidad, automatiza lo que antes eran horas de trabajo manual semanal: enviar emails de bienvenida, hacer seguimientos, recordar citas y motivar a los clientes. Esto libera al entrenador para que se concentre en lo que mejor sabe hacer: entrenar. En cuanto a la retención, estas secuencias aseguran que ningún cliente se sienta olvidado. La comunicación constante y personalizada, activada por hitos reales en su progreso, crea una experiencia de cliente superior que reduce significativamente la tasa de abandono. Un cliente que recibe felicitaciones automáticas por sus logros y mensajes de apoyo cuando flaquea es un cliente que se siente cuidado y es más propenso a continuar con su suscripción. Finalmente, en monetización, abre nuevas vías de ingresos pasivos. Las secuencias de upsell y cross-sell pueden ofrecer programas avanzados, planes de nutrición o talleres a los clientes en el momento exacto en que son más receptivos, convirtiendo la comunicación en un motor de ingresos adicional sin esfuerzo de venta activo. En resumen, esta herramienta convierte la comunicación en un activo estratégico que trabaja para el negocio del entrenador 24/7.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador online, quiero crear una secuencia de bienvenida de 5 emails para los nuevos clientes, para que reciban automáticamente una guía sobre cómo usar la app, qué esperar de su primer entrenamiento, y consejos de nutrición inicial, asegurando un onboarding exitoso.
- Como propietario de un estudio de entrenamiento, quiero configurar una secuencia de reactivación que se envíe a los clientes que no han reservado una sesión en los últimos 15 días, para recordarles sus objetivos y ofrecerles una sesión de consulta gratuita para volver a encarrilarlos.
- Como coach de grupo, quiero que se envíe un email automático de felicitación cuando un cliente registra en el sistema un nuevo récord personal (ej: 5K en menos tiempo, levantamiento máximo), para reforzar positivamente su esfuerzo y mantener alta la motivación.
- Como entrenador personal, quiero construir una secuencia de upsell que se active después de que un cliente complete 90 días en su plan, ofreciéndole un paquete avanzado de 'Coaching Nutricional' para llevar sus resultados al siguiente nivel.
- Como gestor de mi negocio, quiero ver un panel de análisis para cada secuencia de emails que muestre la tasa de apertura, tasa de clics y cuántos clientes han completado el objetivo (ej: reservar una sesión o comprar un producto), para poder optimizar mis comunicaciones.
- Como entrenador que valora su marca, quiero poder personalizar plantillas de email con mi logo, colores y tono de voz, para que todas las comunicaciones automáticas sean consistentes con mi identidad profesional.
## Acciones Clave
- Crear una nueva secuencia de email a partir de plantillas pre-diseñadas (ej. 'Bienvenida', 'Reactivación', 'Cumpleaños', 'Logro alcanzado').
- Utilizar el editor visual para arrastrar y soltar nodos de acción (Enviar Email, Esperar X días/horas, Condición Si/No basado en datos del cliente).
- Configurar el 'disparador' (trigger) que inicia la secuencia (ej. 'Cliente se suscribe a un plan', 'Cliente completa un entrenamiento', 'Campo de cliente se actualiza').
- Editar el contenido de cada email usando un editor de texto enriquecido con variables dinámicas (ej. `{{client.firstName}}`, `{{client.primaryGoal}}`, `{{lastWorkout.name}}`).
- Activar, pausar o desactivar secuencias completas con un solo clic.
- Visualizar estadísticas de rendimiento de la secuencia en tiempo real (clientes activos, tasa de apertura, CTR, tasa de conversión).
- Clonar una secuencia existente para crear rápidamente una nueva versión o una para un segmento de clientes diferente.
## 🧩 Componentes React Sugeridos
### 1. SequenceBuilderContainer
Tipo: container | Componente principal que orquesta el constructor de secuencias. Gestiona el estado del flujo (nodos y conexiones), carga los datos de la secuencia desde la API y maneja las acciones de guardar, activar y eliminar.
Props:
- sequenceId: 
- string | null (requerido) - ID de la secuencia a editar. Si es nulo, se crea una nueva.
Estados: nodes, edges, sequenceName, trigger, isActive, isLoading, error
Dependencias: react-flow-renderer, axios
Ejemplo de uso:
```typescript
<SequenceBuilderContainer sequenceId='seq_12345' />
```

### 2. SequenceStepNode
Tipo: presentational | Representa visualmente un paso individual en el flujo de la secuencia (Enviar Email, Espera, Condición). Es un nodo arrastrable que muestra información clave y permite acciones como editar o eliminar el paso.
Props:
- id: 
- string (requerido) - ID único del nodo.
- data: 
- { type: 'email' | 'delay' | 'condition', label: string, icon: React.ReactNode } (requerido) - Datos que definen el tipo y contenido del nodo.
- onEdit: 
- (nodeId: string) => void (requerido) - Callback que se ejecuta al hacer clic en el botón de editar.
Estados: isSelected
Ejemplo de uso:
```typescript
// Dentro de ReactFlow 
<SequenceStepNode id='node-1' data={{ type: 'email', label: 'Email de Bienvenida', icon: <MailIcon /> }} onEdit={handleEditNode} />
```

### 3. EmailContentModal
Tipo: presentational | Un modal que contiene un editor de texto enriquecido (WYSIWYG) para escribir el asunto y el cuerpo del email. Incluye un selector de variables dinámicas (ej: {{client.firstName}}).
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- onSave: 
- (content: { subject: string, body: string }) => void (requerido) - Función que se ejecuta al guardar el contenido del email.
- initialContent: 
- { subject: string, body: string } (opcional) - Contenido inicial para cargar en el editor.
Estados: subject, bodyHtml
Dependencias: react-modal, ckeditor5-react
Ejemplo de uso:
```typescript
<EmailContentModal isOpen={isEditorOpen} onClose={closeEditor} onSave={handleSaveEmail} initialContent={currentEmail} />
```

### 4. useSequenceAnalytics
Tipo: hook | Un hook personalizado que encapsula la lógica para obtener, almacenar en caché y refrescar los datos de analíticas para una secuencia específica.
Props:
- sequenceId: 
- string (requerido) - ID de la secuencia para la cual obtener las analíticas.
Dependencias: swr, axios
Ejemplo de uso:
```typescript
const { data, error, isLoading } = useSequenceAnalytics(sequenceId);
```
## 🔌 APIs Requeridas
### 1. GET /api/v1/sequences
Obtiene una lista paginada de todas las secuencias de email creadas por el entrenador.
Parámetros:
- page (
- integer, query, opcional): Número de la página a obtener.
- limit (
- integer, query, opcional): Número de secuencias por página.
Respuesta:
Tipo: array
Estructura: Un array de objetos de secuencia, cada uno con id, nombre, trigger, status, y estadísticas básicas.
```json
{
  "data": [
    {
      "id": "seq_abc123",
      "name": "Bienvenida a Nuevos Clientes",
      "is_active": true,
      "trigger_type": "CLIENT_CREATED",
      "stats": {
        "active_enrollments": 25,
        "total_sent": 150,
        "open_rate": 0.65
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
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o no se proporcionó.

### 2. POST /api/v1/sequences
Crea una nueva secuencia de email.
Parámetros:
- name (
- string, body, requerido): Nombre de la secuencia.
- trigger_type (
- string, body, requerido): El evento que inicia la secuencia (ej: 'CLIENT_CREATED', 'WORKOUT_COMPLETED').
- steps (
- array, body, opcional): Un array de objetos que definen los pasos de la secuencia.
Respuesta:
Tipo: object
Estructura: El objeto de la secuencia recién creada.
```json
{
  "id": "seq_def456",
  "name": "Secuencia de Reactivación",
  "is_active": false,
  "trigger_type": "CLIENT_INACTIVE_14_DAYS",
  "steps": [],
  "created_at": "2023-10-27T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos (ej: 'name') o el 'trigger_type' no es válido.
- 401: 
- Unauthorized - El usuario no tiene permisos para crear secuencias.

### 3. PUT /api/v1/sequences/{sequenceId}
Actualiza una secuencia existente, incluyendo su nombre, estado (activo/inactivo) y sus pasos.
Parámetros:
- sequenceId (
- string, path, requerido): ID de la secuencia a actualizar.
- sequenceData (
- object, body, requerido): Objeto con los campos a actualizar (name, is_active, steps, etc.).
Respuesta:
Tipo: object
Estructura: El objeto de la secuencia actualizado.
```json
{
  "id": "seq_abc123",
  "name": "Bienvenida a Nuevos Clientes (Versión 2)",
  "is_active": true,
  "trigger_type": "CLIENT_CREATED",
  "steps": [
    {
      "id": "step_1",
      "type": "email",
      "email_template_id": "tpl_welcome"
    },
    {
      "id": "step_2",
      "type": "delay",
      "delay_in_hours": 48
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna secuencia con el ID proporcionado.
- 403: 
- Forbidden - El entrenador no es el propietario de esta secuencia.

### 4. GET /api/v1/sequences/{sequenceId}/analytics
Obtiene las métricas de rendimiento detalladas para una secuencia específica.
Parámetros:
- sequenceId (
- string, path, requerido): ID de la secuencia.
- dateRange (
- string, query, opcional): Rango de fechas para las métricas (ej: 'last_30_days').
Respuesta:
Tipo: object
Estructura: Un objeto con las métricas generales y un desglose por cada paso de la secuencia.
```json
{
  "sequence_id": "seq_abc123",
  "overall": {
    "enrollments": 100,
    "completions": 75,
    "open_rate": 0.72,
    "ctr": 0.15,
    "conversion_rate": 0.1
  },
  "steps": [
    {
      "step_id": "step_1",
      "step_name": "Email de Bienvenida",
      "sent": 100,
      "opens": 85,
      "clicks": 20
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna secuencia con el ID proporcionado.
## Notas Técnicas
Colecciones backend: sequences, sequence_steps, sequence_enrollments, email_templates, clients, trigger_events_log
KPIs visibles: Tasa de Apertura (Open Rate): Porcentaje de clientes que abrieron un email específico., Tasa de Clics (CTR): Porcentaje de clientes que hicieron clic en un enlace dentro de un email., Tasa de Conversión de la Secuencia: Porcentaje de clientes que completaron el objetivo final de la secuencia (ej: comprar un plan, reservar una sesión)., Tasa de Baja (Unsubscribe Rate): Porcentaje de clientes que se dieron de baja a través de un email de esta secuencia., Clientes Activos: Número de clientes que están actualmente dentro de la secuencia., Progreso Promedio: En qué paso de la secuencia se encuentra la mayoría de los clientes., Ingresos Atribuidos: (Para secuencias con objetivos de venta) El total de ingresos generados por los clientes mientras estaban en la secuencia.
## Documentación Completa
## Resumen
La funcionalidad 'Lifecycle Email Sequences' es una herramienta estratégica de automatización dentro de TrainerERP, diseñada para empoderar a los entrenadores personales a construir y mantener relaciones sólidas y personalizadas con sus clientes a escala. Supera el marketing por correo electrónico tradicional al permitir la creación de flujos de comunicación inteligentes que reaccionan a eventos específicos en el ciclo de vida de un cliente. Esto significa que la comunicación correcta llega al cliente correcto en el momento adecuado, sin intervención manual del entrenador. Desde dar la bienvenida a un nuevo miembro con una serie de correos de onboarding, hasta motivar a alguien que ha alcanzado un hito, o reenganchar a un cliente que muestra signos de inactividad, estas secuencias actúan como un asistente virtual incansable. El objetivo principal es triple: mejorar la retención de clientes a través de un compromiso constante y relevante, ahorrarle al entrenador incontables horas de trabajo administrativo y crear oportunidades de ingresos adicionales mediante upselling y cross-selling automatizados. Es la pieza central del motor de automatización de TrainerERP, transformando la comunicación de una tarea reactiva a un activo proactivo que impulsa el crecimiento del negocio.
## Flujo paso a paso de uso real
Imaginemos a Carlos, un entrenador personal online que quiere automatizar el onboarding de sus nuevos clientes.
1. **Navegación:** Carlos inicia sesión en TrainerERP y va a la sección 'Automatización' en el menú lateral. Allí, hace clic en 'Secuencias de Email'.
2. **Creación:** Ve una lista de sus secuencias existentes. Hace clic en el botón 'Crear Nueva Secuencia'. El sistema le ofrece empezar desde cero o usar una plantilla. Carlos elige la plantilla 'Bienvenida de 7 días para nuevos clientes'.
3. **Configuración del Disparador:** La plantilla ya viene preconfigurada con el disparador 'Nuevo cliente se suscribe a un plan'. Carlos confirma que este es el disparador correcto.
4. **Edición Visual del Flujo:** Se abre un lienzo visual con varios bloques conectados.
* El primer bloque es 'Enviar Email: ¡Bienvenido a bordo!'. Carlos hace clic en él. Se abre un modal de edición de email.
* **Personalización del Email:** Carlos modifica el asunto y el cuerpo. Utiliza el selector de variables para insertar `{{client.firstName}}`, haciendo el saludo personal. Revisa el contenido que explica cómo acceder a la app y al plan de entrenamiento.
* El siguiente bloque es 'Esperar 2 días'. Carlos decide que es un buen intervalo.
* El tercer bloque es 'Enviar Email: Tus primeros pasos hacia el éxito'. Este email contiene consejos de nutrición. Carlos lo personaliza con su propio tono y firma.
* Añade un nuevo bloque de 'Condición'. Lo configura para que verifique si el cliente ha completado su primer entrenamiento (`client.firstWorkoutCompleted == true`). Si es 'Sí', se le envía un email de felicitación. Si es 'No', se le envía un email de recordatorio y motivación.
5. **Revisión y Activación:** Una vez que está satisfecho con el flujo, Carlos guarda los cambios. La secuencia aparece en su lista con el estado 'Borrador'. Revisa todo una última vez y hace clic en el interruptor para cambiar su estado a 'Activa'.
6. **Monitoreo:** A partir de ese momento, cada nuevo cliente que se registre entrará automáticamente en esta secuencia. Días después, Carlos vuelve a esta página y hace clic en la pestaña 'Análisis' de su secuencia de bienvenida. Puede ver cuántos clientes están en el flujo, la tasa de apertura de cada email y la tasa de clics en el enlace a la app, lo que le permite entender qué tan efectivo es su onboarding.
## Riesgos operativos y edge cases
* **Edición de Secuencias Activas:** Si un entrenador modifica una secuencia mientras hay 50 clientes dentro, ¿qué ocurre? **Solución:** Implementar un sistema de versionado. Al guardar los cambios, el sistema debe preguntar si aplicar los cambios solo a los nuevos clientes que entren en la secuencia (recomendado) o intentar migrar a los clientes existentes a la nueva versión (más complejo y arriesgado).
* **Conflictos entre Secuencias:** Un cliente podría cumplir los criterios para entrar en una secuencia de 'Reactivación' y una de 'Oferta de Cumpleaños' al mismo tiempo. **Solución:** Introducir un sistema de 'etiquetas de exclusión' o prioridades. El entrenador puede configurar que si un cliente está en una secuencia con la etiqueta 'Onboarding', no puede entrar en ninguna otra, o que las secuencias de 'Reactivación' tienen menor prioridad que las de 'Oferta'.
* **Cumplimiento Legal (GDPR/CAN-SPAM):** El sistema debe garantizar que todos los emails enviados contengan un enlace de baja visible y funcional. La acción de darse de baja debe ser global para todas las comunicaciones de marketing y debe reflejarse inmediatamente en el sistema para detener cualquier secuencia activa para ese cliente.
* **Sobrecarga de Comunicación:** Si un entrenador configura demasiadas secuencias muy agresivas, podría abrumar a sus clientes. **Solución:** Implementar 'límites de frecuencia' a nivel de cuenta, permitiendo al entrenador establecer un máximo de emails de automatización que un cliente puede recibir en una semana. Mostrar advertencias en la UI si las secuencias son muy seguidas.
## KPIs y qué significan
* **Tasa de Apertura (Open Rate):** ¿Leen tus emails? Un alto porcentaje en el primer email de bienvenida significa que tu asunto es bueno y llega en el momento oportuno. Una caída drástica en emails posteriores puede indicar que el contenido no es tan relevante.
* **Tasa de Clics (CTR):** ¿Interactúan con tu contenido? Este KPI es crucial para emails con llamados a la acción (CTA), como 'Reserva tu sesión' o 'Descarga tu guía nutricional'. Un CTR bajo puede significar que el CTA no es claro, la oferta no es atractiva o el enlace está roto.
* **Tasa de Conversión:** ¿Cumplen el objetivo? Si una secuencia tiene como fin que el cliente compre un plan de nutrición, esta métrica te dice qué porcentaje de los que entraron en la secuencia lo hicieron. Es el KPI de negocio más importante.
* **Tasa de Baja (Unsubscribe Rate):** ¿Estás molestando a tus clientes? Un pequeño porcentaje es normal, pero un pico en esta métrica después de un email concreto es una señal de alerta de que tu contenido no fue bien recibido.
* **Progreso en la Secuencia / Puntos de Abandono:** ¿Dónde se quedan tus clientes? Ver en qué paso de la secuencia la mayoría de los clientes dejan de interactuar te ayuda a identificar el eslabón débil de tu comunicación para poder mejorarlo.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Trigger: Nuevo Cliente se Registra] --> B{Enviar Email de Bienvenida};
B --> C[Esperar 2 Días];
C --> D{Enviar Email: 'Consejos de Nutrición'};
D --> E[Esperar 3 Días];
E --> F{Condición: ¿Ha completado el 1er entreno?};
F -- Sí --> G[Enviar Email: '¡Felicidades por tu 1er paso!'];
F -- No --> H[Enviar Email: '¿Necesitas ayuda para empezar?'];
G --> I[Fin de la Secuencia];
H --> I;
