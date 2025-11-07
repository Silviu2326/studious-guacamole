# Personalization Engine (IA avanzada)

**Página padre:** Hola

---

# Personalization Engine (IA avanzada)
👥 Tipo de Usuario: Entrenador Personal (Administrador), Administrador del Sistema
Esta funcionalidad es principalmente para el 'Entrenador Personal (Administrador)', quien utiliza esta interfaz como un centro de control para configurar, supervisar y validar las acciones del motor de IA. El entrenador define los objetivos, establece las reglas y revisa las sugerencias antes de que se apliquen a sus clientes. El 'Administrador del Sistema' puede tener una vista global para monitorear el rendimiento general del motor en toda la plataforma. Los roles 'Cliente' y 'Lead' no acceden a esta página, pero son los receptores de las experiencias personalizadas que se originan aquí.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/ia/personalization-engine
## Descripción Funcional
El 'Personalization Engine' es el cerebro inteligente de TrainerERP, una potente suite de herramientas basadas en Inteligencia Artificial diseñada para que los entrenadores puedan ofrecer una experiencia hiper-personalizada a escala. Esta página no es solo un dashboard, es el centro de comando desde donde el entrenador interactúa con la IA, actuando como un 'co-piloto' que analiza constantemente los datos de cada cliente para ofrecer recomendaciones proactivas. El motor ingiere y procesa una vasta cantidad de información: registros de entrenamiento, métricas de progreso (peso, medidas, fotos), adherencia al plan, historial de comunicación, sentimiento en los mensajes, e incluso datos de wearables integrados. Basado en este análisis, la IA genera sugerencias accionables en áreas clave: ajustes automáticos de planes de entrenamiento para romper estancamientos, recomendaciones de contenido relevante (artículos, videos de técnica), comunicaciones adaptativas que cambian de tono según el estado de ánimo del cliente, y ofertas de productos o servicios (upsells) en el momento justo. Esta página permite al entrenador visualizar estas sugerencias, entender el 'porqué' detrás de cada una, y aceptarlas con un solo clic o descartarlas, manteniendo siempre el control final y el toque humano.
## Valor de Negocio
El valor de negocio del 'Personalization Engine' es transformacional para un entrenador personal, ya que ataca directamente los mayores desafíos del sector: escalabilidad y retención. Permite a un solo entrenador ofrecer un nivel de atención individual que antes era imposible gestionar para más de un puñado de clientes, simulando tener un asistente experto por cada persona entrenada. Esto se traduce directamente en una mayor retención de clientes; cuando un cliente siente que su plan evoluciona constantemente con su progreso y que la comunicación es relevante y oportuna, su compromiso y lealtad aumentan drásticamente, reduciendo el churn. Además, el motor crea nuevas vías de ingresos al identificar inteligentemente oportunidades de upsell y cross-sell (ej. ofrecer un plan de nutrición a alguien que lucha con su dieta). Esto incrementa el Lifetime Value (LTV) de cada cliente. A nivel de marca, posiciona al entrenador como un profesional de vanguardia, que utiliza la tecnología y los datos para optimizar resultados, lo que le permite justificar precios premium y diferenciarse en un mercado competitivo. Finalmente, automatiza una carga cognitiva y administrativa enorme, liberando tiempo valioso para que el entrenador se enfoque en lo que mejor sabe hacer: motivar y conectar con sus clientes.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Premium | Futuro
## User Stories
- Como entrenador personal, quiero que el sistema me sugiera automáticamente ajustes en el plan de entrenamiento de un cliente cuando detecte que su progreso se ha estancado durante dos semanas, para poder intervenir proactivamente y mantenerlo motivado.
- Como coach online, quiero configurar el motor de IA para que envíe mensajes de motivación personalizados a los clientes que no han registrado un entrenamiento en los últimos 3 días, adaptando el tono (ej. 'empático' vs. 'directo') según su perfil de personalidad predefinido.
- Como dueño de un estudio de fitness, quiero ver un dashboard que me muestre qué recomendaciones de la IA (upsells de nutrición, venta de programas especializados) están generando más ingresos, para refinar mi estrategia de ofertas.
- Como entrenador personal, quiero que la IA me alerte sobre clientes en 'riesgo de abandono' basándose en una combinación de factores (baja interacción, progreso negativo, mensajes con sentimiento negativo), para poder contactarlos personalmente antes de que sea tarde.
- Como creador de contenido fitness, quiero que el motor de IA recomiende mis artículos de blog o videos de técnica específicos a los clientes correctos en el momento adecuado (ej. un video sobre 'forma correcta de peso muerto' a alguien que empieza un nuevo bloque de fuerza), aumentando así el engagement con mi material educativo.
- Como entrenador, quiero tener un 'human-in-the-loop' donde pueda revisar, aprobar o rechazar cada sugerencia de la IA antes de que se comunique al cliente, para asegurar que siempre mantengo el control y la calidad del servicio.
## Acciones Clave
- Configurar los objetivos principales del motor de IA (ej: maximizar retención, maximizar LTV, mejorar adherencia al plan).
- Revisar y aprobar/rechazar la lista de sugerencias generadas por la IA para los clientes.
- Visualizar el historial de personalizaciones y decisiones de la IA aplicadas a un cliente específico.
- Activar o desactivar los diferentes módulos de personalización (Ajustes de Entrenamiento, Comunicación Adaptativa, Recomendación de Contenido, Ofertas Inteligentes).
- Definir reglas y límites para la personalización (ej: 'No sugerir aumentos de peso superiores al 10% por semana', 'No enviar más de una oferta de upsell por mes').
- Analizar el panel de KPIs para medir la efectividad del motor de personalización y su impacto en el negocio.
## 🧩 Componentes React Sugeridos
### 1. PersonalizationEngineDashboard
Tipo: container | Componente principal que orquesta toda la página. Obtiene los datos de KPIs, la lista de sugerencias y la configuración actual del motor a través del hook 'usePersonalizationEngineAPI' y los pasa a los componentes de presentación.
Estados: kpis: IKPI[], suggestions: ISuggestion[], settings: IEngineSettings, isLoading: boolean, error: Error | null
Dependencias: usePersonalizationEngineAPI
Ejemplo de uso:
```typescript
<PersonalizationEngineDashboard />
```

### 2. AISuggestionCard
Tipo: presentational | Muestra una única sugerencia de la IA de forma clara y concisa. Incluye el nombre del cliente, el tipo de sugerencia, una descripción detallada, la justificación de la IA y los botones de acción.
Props:
- suggestion: 
- ISuggestion (requerido) - Objeto que contiene toda la información de una sugerencia de la IA.
- onAccept: 
- (suggestionId: string) => void (requerido) - Callback que se ejecuta cuando el entrenador presiona el botón 'Aceptar'.
- onReject: 
- (suggestionId: string, reason?: string) => void (requerido) - Callback que se ejecuta cuando el entrenador presiona el botón 'Rechazar'.
Estados: isProcessingAction: boolean
Ejemplo de uso:
```typescript
<AISuggestionCard suggestion={suggestion} onAccept={handleAccept} onReject={handleReject} />
```

### 3. EngineSettingsModule
Tipo: presentational | Un componente que permite al entrenador configurar un módulo específico de la IA (ej. 'Ajustes de Entrenamiento') mediante interruptores (toggles), sliders o selects.
Props:
- title: 
- string (requerido) - Título del módulo (ej: 'Comunicación Adaptativa').
- config: 
- IModuleConfig (requerido) - Objeto con la configuración actual del módulo.
- onConfigChange: 
- (newConfig: IModuleConfig) => void (requerido) - Función que se llama cuando el entrenador modifica la configuración.
Dependencias: antd (para componentes UI como Switch, Slider)
Ejemplo de uso:
```typescript
<EngineSettingsModule title="Ofertas Inteligentes" config={settings.upsellConfig} onConfigChange={handleSettingsUpdate} />
```

### 4. usePersonalizationEngineAPI
Tipo: hook | Hook personalizado que encapsula la lógica para comunicarse con la API del motor de personalización. Gestiona los estados de carga, error y datos para KPIs, sugerencias y configuración.
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { kpis, suggestions, settings, isLoading, acceptSuggestion } = usePersonalizationEngineAPI();
```
## 🔌 APIs Requeridas
### 1. GET /api/ia/suggestions
Obtiene la lista de sugerencias de IA pendientes de revisión para el entrenador autenticado. Permite filtrar por tipo de sugerencia y por cliente.
Parámetros:
- status (
- string, query, opcional): Filtra por estado. Por defecto 'PENDING_REVIEW'.
- type (
- string, query, opcional): Filtra por tipo de sugerencia (ej: 'WORKOUT_ADJUSTMENT').
- clientId (
- string, query, opcional): Filtra las sugerencias para un cliente específico.
Respuesta:
Tipo: array
Estructura: Un array de objetos 'suggestion'. Cada objeto contiene id, clientId, clientName, type, data, justificationText, createdAt.
```json
[
  {
    "suggestionId": "sug_123",
    "clientId": "cli_456",
    "clientName": "Juan Pérez",
    "type": "WORKOUT_ADJUSTMENT",
    "data": {
      "exerciseId": "ex_789",
      "exerciseName": "Press de Banca",
      "action": "INCREASE_WEIGHT",
      "value": "5%",
      "newValue": "84kg"
    },
    "justificationText": "Juan ha completado todas las repeticiones y series en las últimas 3 sesiones con el peso actual. El sistema recomienda un aumento del 5% para continuar con la sobrecarga progresiva.",
    "createdAt": "2023-10-27T10:00:00Z"
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o no se proporcionó.
- 400: 
- Bad Request - Los parámetros de filtrado no son válidos.

### 2. POST /api/ia/suggestions/{suggestionId}/action
Permite al entrenador aceptar o rechazar una sugerencia específica de la IA.
Parámetros:
- suggestionId (
- string, path, requerido): El ID de la sugerencia a la que se le aplicará la acción.
- actionPayload (
- object, body, requerido): Objeto que contiene la acción a realizar.
Respuesta:
Tipo: object
Estructura: Un objeto confirmando la acción realizada y el nuevo estado de la sugerencia.
```json
{
  "success": true,
  "suggestionId": "sug_123",
  "newStatus": "ACCEPTED",
  "message": "La sugerencia ha sido aceptada y aplicada al plan del cliente."
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El suggestionId proporcionado no existe.
- 403: 
- Forbidden - El entrenador no tiene permiso para actuar sobre esta sugerencia (no es su cliente).
- 409: 
- Conflict - La sugerencia ya ha sido procesada (aceptada o rechazada).

### 3. PUT /api/ia/settings
Actualiza la configuración del motor de personalización para el entrenador autenticado.
Parámetros:
- settingsPayload (
- object, body, requerido): Un objeto que contiene la configuración completa o parcial a actualizar.
Respuesta:
Tipo: object
Estructura: El objeto de configuración actualizado.
```json
{
  "trainerId": "trn_abc",
  "globalObjective": "MAXIMIZE_RETENTION",
  "modules": {
    "workoutAdjustments": {
      "enabled": true,
      "maxWeightIncreasePercent": 10,
      "reviewRequired": true
    },
    "adaptiveCommunication": {
      "enabled": false
    }
  }
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - El cuerpo de la solicitud tiene un formato inválido o valores fuera de rango.
- 401: 
- Unauthorized - Token de autenticación inválido.
## Notas Técnicas
Colecciones backend: personalization_engine_settings, ai_client_profiles, ai_suggestions, personalization_logs, trainer_feedback
KPIs visibles: Tasa de Aceptación de Sugerencias (% de sugerencias aprobadas por el entrenador), Impacto en la Adherencia al Plan (comparativa % de entrenamientos completados antes y después de activar la IA), Churn Rate Co-horte IA (tasa de abandono de clientes bajo el motor de IA vs. grupo de control), Tasa de Conversión de Ofertas IA (% de ofertas de upsell generadas por IA que resultan en compra), Engagement con Contenido Recomendado (CTR en enlaces de contenido enviados por la IA), Precisión del Modelo de Riesgo de Abandono (% de clientes marcados 'en riesgo' que abandonaron en los siguientes 30 días)
## Documentación Completa
## Resumen
El **Personalization Engine** es el componente de Inteligencia Artificial de TrainerERP, concebido como un co-piloto inteligente para el entrenador personal. Su misión es simple pero poderosa: permitir que cada entrenador ofrezca un servicio hiper-personalizado a una escala que sería humanamente imposible. El sistema no busca reemplazar al entrenador, sino potenciarlo, automatizando el análisis de datos y la generación de insights para que el profesional pueda centrarse en la conexión humana y la estrategia de alto nivel.
El motor se alimenta de todos los puntos de datos disponibles del cliente dentro de TrainerERP: desde cada repetición y serie registrada en la app, la frecuencia de check-ins, las fotos de progreso, hasta el sentimiento detectado en las conversaciones de chat. Al procesar esta información, la IA identifica patrones, predice necesidades y genera sugerencias proactivas en cuatro áreas clave:
1. **Ajustes de Entrenamiento:** Recomienda modificaciones en los planes (aumentar peso, cambiar un ejercicio, sugerir una semana de descarga) para optimizar el progreso y evitar estancamientos.
2. **Comunicación Adaptativa:** Sugiere el momento y el tono adecuados para los mensajes automáticos (recordatorios, felicitaciones), adaptándose al perfil psicológico del cliente.
3. **Recomendación de Contenido:** Propone el envío de artículos, videos o guías del propio entrenador que sean relevantes para los objetivos o las dificultades actuales del cliente.
4. **Ofertas Inteligentes:** Identifica el momento óptimo para presentar una oferta de upsell (ej. un paquete de coaching nutricional) a un cliente que muestra interés o necesidad.
Esta página es el panel de control donde el entrenador interactúa con este motor: configura sus preferencias, revisa las sugerencias y mide el impacto de la IA en los resultados de sus clientes y su negocio.
---
## Flujo paso a paso de uso real
1. **Configuración Inicial (Onboarding del Motor):**
* El Entrenador Alex accede por primera vez a la página del `Personalization Engine`.
* Un wizard de configuración le pregunta por su objetivo principal: 'Maximizar Retención', 'Aumentar LTV' o 'Mejorar Adherencia'. Alex elige 'Maximizar Retención'.
* El wizard le permite activar los módulos que desee. Alex decide empezar activando solo 'Ajustes de Entrenamiento' y 'Recomendación de Contenido', dejando los otros para más adelante.
* Configura una regla clave: todas las sugerencias de 'Ajustes de Entrenamiento' deben ser revisadas y aprobadas por él antes de ser aplicadas.
2. **Operación Diaria (Revisión de Sugerencias):**
* Alex comienza su día revisando su dashboard de TrainerERP. El widget del Motor de IA le indica que tiene '4 sugerencias pendientes'.
* Navega a la página del motor y ve una lista de tarjetas. Una de ellas dice: **"Cliente: Laura Gómez. Sugerencia: Ajuste de Entrenamiento"**.
3. **Análisis y Decisión sobre una Sugerencia:**
* Alex hace clic en la tarjeta de Laura. Se expande mostrando los detalles:
* **Sugerencia:** 'Reemplazar 'Sentadilla con barra' por 'Sentadilla Goblet' para el próximo bloque de 4 semanas.'
* **Justificación de la IA:** 'Laura ha reportado 'dolor lumbar leve' en sus dos últimos check-ins. El análisis de su video de técnica muestra una inclinación excesiva del torso. Reemplazar por Sentadilla Goblet reducirá la carga axial y promoverá una postura más erguida, minimizando el riesgo de lesión y manteniendo el estímulo en el tren inferior.'
* Alex recuerda las conversaciones con Laura. La recomendación de la IA es acertada. Presiona el botón **'Aceptar'**.
* El sistema confirma que el plan de entrenamiento de Laura para el próximo lunes ha sido actualizado automáticamente.
4. **Monitoreo de Resultados (Análisis Semanal):**
* Cada viernes, Alex revisa la sección de KPIs del motor.
* Observa que la 'Tasa de Adherencia al Plan' para los clientes con la IA activa ha aumentado un 12% en el último mes.
* Ve que el 'Engagement con Contenido' ha subido un 30% gracias a que la IA está enviando sus artículos a las personas correctas en el momento justo.
* Estos datos le dan la confianza para activar el módulo de 'Ofertas Inteligentes' para un pequeño grupo de clientes a modo de prueba.
---
## Riesgos operativos y edge cases
* **Información Incompleta o Incorrecta:** Si un cliente no registra sus entrenamientos o introduce datos erróneos, las recomendaciones de la IA pueden ser imprecisas. El sistema debe tener un umbral de confianza y no generar sugerencias si los datos son insuficientes.
* **Lesiones y Condiciones Especiales:** El mayor riesgo. Una IA no puede diagnosticar. Si un cliente reporta una lesión por chat, la IA debe ser capaz de pausar todas las recomendaciones de progreso físico para ese cliente y alertar inmediatamente al entrenador. Debe haber un sistema de 'flags' manuales que el entrenador pueda activar ('Lesionado', 'Embarazada', 'Viajando').
* **Rechazo del Cliente:** Un cliente podría sentirse 'espiado' o no gustarle la comunicación automatizada. El onboarding del cliente debe explicar de forma transparente cómo se utiliza la tecnología para mejorar su experiencia, y debe existir una opción para que el cliente opte por un 'modo manual' sin IA.
* **Sobre-optimización y Falta de Variedad:** Un modelo de IA podría encontrar un 'óptimo local' y sugerir siempre los mismos patrones. El modelo debe tener parámetros que incentiven la variedad y la exploración para mantener al cliente motivado.
* **Fallo del Modelo:** ¿Qué pasa si un bug en el despliegue del modelo empieza a generar sugerencias absurdas? Debe haber un 'interruptor de emergencia' global y por entrenador para desactivar el motor por completo instantáneamente.
---
## KPIs y qué significan
* **Tasa de Aceptación de Sugerencias:**
* **Qué es:** Porcentaje de sugerencias que el entrenador aprueba.
* **Qué significa:** Es el indicador más importante de la confianza del entrenador en la IA. Una tasa alta (>80%) significa que el modelo está bien alineado con la filosofía y el conocimiento del entrenador. Una tasa baja indica que el modelo necesita re-entrenamiento o que los parámetros de configuración no son los adecuados.
* **Impacto en la Adherencia al Plan:**
* **Qué es:** Comparativa A/B del porcentaje de sesiones completadas entre clientes con IA y sin IA.
* **Qué significa:** Mide si la personalización realmente está ayudando a los clientes a mantenerse en el camino. Un uplift positivo aquí es una prueba directa del ROI de la funcionalidad en la retención.
* **Tasa de Conversión de Ofertas IA:**
* **Qué es:** El porcentaje de ofertas de upsell/cross-sell generadas y enviadas por la IA que resultan en una compra.
* **Qué significa:** Mide la capacidad del motor para identificar oportunidades comerciales de forma efectiva. Es un KPI clave para demostrar el valor del motor en el aumento del LTV.
* **Precisión del Modelo de Riesgo de Abandono:**
* **Qué es:** De todos los clientes que la IA marcó como 'en riesgo', ¿qué porcentaje realmente abandonó en los siguientes 30-60 días?
* **Qué significa:** Evalúa la capacidad predictiva del sistema. Una alta precisión permite al entrenador enfocar sus esfuerzos de retención manual en los clientes que más lo necesitan, optimizando su tiempo.
---
## Diagramas de Flujo (Mermaid)
mermaid
sequenceDiagram
participant ClientApp as Cliente (App)
participant TrainerERP as TrainerERP (Backend)
participant AIEngine as Motor de IA
participant TrainerUI as Entrenador (Dashboard)
ClientApp->>+TrainerERP: Registra entrenamiento (POST /api/workouts)
TrainerERP->>+AIEngine: Envía nuevos datos del cliente (progreso, logs)
AIEngine->>AIEngine: Procesa datos y analiza patrones
Note over AIEngine: Detecta estancamiento en 'Press de Banca'
AIEngine->>-TrainerERP: Genera sugerencia (POST /api/internal/suggestions)
TrainerERP-->>-ClientApp: Confirmación de registro
alt Flujo de Revisión del Entrenador
TrainerUI->>+TrainerERP: Solicita sugerencias pendientes (GET /api/ia/suggestions)
TrainerERP-->>-TrainerUI: Devuelve lista de sugerencias
TrainerUI->>TrainerUI: Entrenador revisa y aprueba la sugerencia
TrainerUI->>+TrainerERP: Envía acción (POST /api/ia/suggestions/{id}/action)
TrainerERP->>TrainerERP: Actualiza el plan del cliente en la BBDD
TrainerERP->>-TrainerUI: Confirma la acción
TrainerERP->>ClientApp: Notificación push: '¡Tu plan ha sido actualizado por tu entrenador!'
end
