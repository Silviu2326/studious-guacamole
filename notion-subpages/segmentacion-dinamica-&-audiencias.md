# Segmentación Dinámica & Audiencias

**Página padre:** Hola

---

# Segmentación Dinámica & Audiencias
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada principalmente para el 'Entrenador Personal (Administrador)' y los 'Entrenadores Asociados' que gestionan la comunicación y el marketing. Permite a los entrenadores ir más allá de la gestión individual y adoptar un enfoque de marketing estratégico, creando grupos de clientes con características comunes para enviarles mensajes, ofertas y planes de entrenamiento ultra-personalizados. El Administrador puede crear y gestionar todas las audiencias, mientras que un Entrenador Asociado podría tener permisos para usar audiencias existentes en sus campañas, pero no para crearlas o modificarlas, dependiendo de la configuración de roles del estudio.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/audiencias
## Descripción Funcional
La página de 'Segmentación Dinámica & Audiencias' es el centro de inteligencia de clientes de TrainerERP. Permite a los entrenadores personales transformar su base de datos de clientes, que a menudo es estática, en una colección de audiencias vivas y dinámicas que se actualizan automáticamente en tiempo real. En lugar de tratar a todos los clientes por igual, el entrenador puede crear segmentos basados en una combinación ilimitada de criterios. Por ejemplo, puede crear una audiencia para 'Clientes con objetivo de pérdida de peso que no han registrado una sesión en 10 días', u otra para 'Clientes avanzados en ganancia muscular que han completado su plan actual'. Los criterios de segmentación se extraen de toda la información disponible en TrainerERP: datos demográficos, objetivos de fitness, historial de asistencia, registro de entrenamientos, estado de los pagos y suscripciones, interacción con emails anteriores, y etiquetas personalizadas. Esta herramienta es el motor que impulsa la personalización a escala, permitiendo al entrenador diseñar y ejecutar campañas de marketing, comunicación y retención con una precisión quirúrgica, asegurando que cada cliente reciba el mensaje correcto en el momento adecuado para maximizar su compromiso, resultados y lealtad.
## Valor de Negocio
El valor de negocio de la segmentación dinámica para un entrenador personal es transformacional, elevando su operación de un simple servicio a una empresa de coaching optimizada y escalable. En primer lugar, aumenta drásticamente la retención de clientes. Al identificar automáticamente a los clientes 'en riesgo' (p. ej., baja asistencia), el sistema puede activar flujos de comunicación para re-engancharlos antes de que cancelen. En segundo lugar, abre nuevas vías de ingresos y maximiza el valor de vida del cliente (LTV). Un entrenador puede crear segmentos de 'clientes altamente comprometidos' y ofrecerles servicios premium, como talleres especializados o coaching nutricional, generando upselling. Del mismo modo, puede identificar a clientes que han alcanzado sus metas iniciales y proponerles nuevos planes para mantenerlos en el ecosistema. Finalmente, optimiza el recurso más valioso del entrenador: su tiempo. En lugar de revisar manualmente listas de clientes para decidir a quién contactar, el sistema lo hace de forma automática, permitiendo que el entrenador se concentre en lo que mejor sabe hacer: entrenar y motivar. Esta capacidad convierte los datos de los clientes en acciones rentables y relaciones más fuertes.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero crear un segmento de clientes cuyo plan de suscripción expira en los próximos 7 días, para poder enviarles un recordatorio automático de renovación.
- Como coach online, quiero segmentar a los leads que descargaron mi guía de nutrición pero no han comprado un plan en 15 días, para poder incluirlos en una campaña de email nurturing específica.
- Como dueño de un estudio, quiero identificar a los clientes que han asistido a más de 12 sesiones el último mes, para enviarles un mensaje de felicitación y ofrecerles un pequeño bonus o descuento en merchandising.
- Como entrenador, quiero crear una audiencia de clientes con el objetivo 'ganancia muscular' que están en el nivel 'avanzado', para poder notificarles sobre un nuevo programa de entrenamiento de alta intensidad que estoy lanzando.
- Como entrenador, quiero tener un segmento dinámico de 'clientes inactivos' que no han registrado un entrenamiento ni reservado una clase en 30 días, para poder activar una campaña de reactivación con una oferta especial.
- Como entrenador, quiero poder segmentar clientes por etiquetas personalizadas que yo mismo he creado, como 'participó_en_reto_verano' o 'interesado_en_nutricion', para poder hacer un seguimiento muy específico.
## Acciones Clave
- Crear una nueva audiencia desde cero.
- Editar el nombre y las reglas de una audiencia existente.
- Visualizar la lista de clientes que pertenecen a una audiencia en tiempo real.
- Duplicar una audiencia para crear una similar rápidamente.
- Eliminar una audiencia que ya no es necesaria.
- Conectar una audiencia a una automatización de marketing (email/SMS) como disparador.
- Exportar la lista de miembros de una audiencia a un archivo CSV.
## 🧩 Componentes React Sugeridos
### 1. AudienceBuilderContainer
Tipo: container | Componente principal que orquesta la creación y edición de una audiencia. Gestiona el estado de las reglas, el nombre de la audiencia y se comunica con la API para guardar y obtener vistas previas.
Props:
- audienceId: 
- string | null (opcional) - ID de la audiencia a editar. Si es nulo, se crea una nueva.
- onSave: 
-  (audience: Audience) => void (requerido) - Callback que se ejecuta cuando la audiencia se guarda con éxito.
Estados: audienceName: string, rules: RuleGroup, isLoading: boolean, previewCount: number | null, error: string | null
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<AudienceBuilderContainer audienceId='123' onSave={(audience) => console.log('Saved:', audience.name)} />
```

### 2. RuleGroup
Tipo: presentational | Componente recursivo que renderiza un grupo de reglas y/o sub-grupos, unidos por un operador lógico ('Y' / 'O').
Props:
- group: 
- { operator: 'AND' | 'OR', rules: (Rule | RuleGroup)[] } (requerido) - El objeto que define el grupo de reglas.
- onChange: 
- (newGroup: RuleGroup) => void (requerido) - Callback para notificar cambios en el grupo de reglas.
- onDelete: 
- () => void (opcional) - Callback para eliminar el grupo completo (si no es el raíz).
Ejemplo de uso:
```typescript
<RuleGroup group={rulesState} onChange={setRulesState} />
```

### 3. RuleCondition
Tipo: presentational | Componente para una única condición de regla (p. ej., 'Objetivo' 'es igual a' 'Pérdida de peso'). Muestra los dropdowns y campos de entrada necesarios según el tipo de dato.
Props:
- rule: 
- { field: string, operator: string, value: any } (requerido) - El objeto que define la regla individual.
- onChange: 
- (newRule: Rule) => void (requerido) - Callback para notificar cambios en la regla.
- onDelete: 
- () => void (requerido) - Callback para eliminar la regla.
Ejemplo de uso:
```typescript
<RuleCondition rule={ruleState} onChange={setRuleState} onDelete={handleDelete} />
```

### 4. useAudiencePreview
Tipo: hook | Hook personalizado que obtiene el número de miembros que coinciden con un conjunto de reglas. Utiliza debouncing para evitar llamadas excesivas a la API mientras el usuario edita las reglas.
Props:
- rules: 
- RuleGroup (requerido) - El conjunto de reglas actual para previsualizar.
- debounceMs: 
- number (opcional) - Tiempo de espera en milisegundos para el debounce.
Estados: count: number | null, isLoading: boolean
Dependencias: lodash.debounce, react-query
Ejemplo de uso:
```typescript
const { count, isLoading } = useAudiencePreview({ rules: currentRules, debounceMs: 500 });
```
## 🔌 APIs Requeridas
### 1. GET /api/audiences
Obtiene una lista paginada de todas las audiencias creadas por el entrenador.
Parámetros:
- page (
- number, query, opcional): Número de la página a obtener.
- limit (
- number, query, opcional): Número de audiencias por página.
Respuesta:
Tipo: object
Estructura: Un objeto con datos de paginación y un array de audiencias.
```json
{
  "data": [
    {
      "id": "aud_123",
      "name": "Clientes en Riesgo",
      "member_count": 15,
      "created_at": "2023-10-27T10:00:00Z"
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
- Unauthorized - El token de autenticación es inválido o no fue proporcionado.

### 2. POST /api/audiences
Crea una nueva audiencia con su nombre y su conjunto de reglas.
Parámetros:
- audienceData (
- object, body, requerido): Objeto con el nombre y la estructura de reglas de la audiencia.
Respuesta:
Tipo: object
Estructura: El objeto de la audiencia recién creada.
```json
{
  "id": "aud_456",
  "name": "Clientes VIP",
  "rules": {
    "operator": "AND",
    "rules": [
      {
        "field": "subscription.plan_type",
        "operator": "equals",
        "value": "premium"
      }
    ]
  },
  "created_at": "2023-10-27T11:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Los datos de la audiencia son inválidos (p. ej., falta el nombre o las reglas tienen un formato incorrecto).
- 401: 
- Unauthorized - No autenticado.

### 3. PUT /api/audiences/{id}
Actualiza el nombre o las reglas de una audiencia existente.
Parámetros:
- id (
- string, path, requerido): ID de la audiencia a actualizar.
- updateData (
- object, body, requerido): Objeto con los campos a actualizar (nombre y/o reglas).
Respuesta:
Tipo: object
Estructura: El objeto de la audiencia actualizado.
```json
{
  "id": "aud_456",
  "name": "Clientes VIP Platino",
  "rules": {
    "operator": "AND",
    "rules": [
      {
        "field": "subscription.plan_type",
        "operator": "equals",
        "value": "premium"
      },
      {
        "field": "client_since",
        "operator": "before",
        "value": "2022-01-01T00:00:00Z"
      }
    ]
  }
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La audiencia con el ID proporcionado no existe.
- 403: 
- Forbidden - El usuario no tiene permisos para modificar esta audiencia.

### 4. POST /api/audiences/preview
Calcula y devuelve el número de clientes que coinciden con un conjunto de reglas sin guardar la audiencia. Esencial para la retroalimentación en tiempo real en la UI.
Parámetros:
- rules (
- object, body, requerido): La estructura de reglas a evaluar.
Respuesta:
Tipo: object
Estructura: Un objeto con el conteo de miembros.
```json
{
  "matching_members": 42
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - La estructura de reglas proporcionada es inválida.

### 5. GET /api/audiences/{id}/members
Obtiene una lista paginada de los clientes que son miembros de una audiencia específica.
Parámetros:
- id (
- string, path, requerido): ID de la audiencia.
Respuesta:
Tipo: object
Estructura: Objeto con paginación y array de objetos de cliente simplificados.
```json
{
  "data": [
    {
      "id": "user_abc",
      "name": "Ana García",
      "email": "ana.garcia@example.com"
    },
    {
      "id": "user_def",
      "name": "Carlos Ruiz",
      "email": "carlos.ruiz@example.com"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10
  }
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La audiencia con el ID proporcionado no existe.
## Notas Técnicas
Colecciones backend: audiences, users, client_profiles, workout_logs, subscriptions, payment_history, custom_tags
KPIs visibles: Número total de audiencias creadas., Tamaño de cada audiencia (número de miembros)., Crecimiento/disminución de la audiencia en los últimos 30 días., Porcentaje de clientes segmentados vs. no segmentados., Audiencias más utilizadas en automatizaciones., Tasa de apertura/clic promedio de las campañas asociadas a cada audiencia (si se integra con el módulo de email).
## Documentación Completa
## Resumen
La funcionalidad de 'Segmentación Dinámica & Audiencias' es una herramienta estratégica dentro de TrainerERP, diseñada para empoderar a los entrenadores personales con capacidades de marketing y comunicación avanzadas. Su propósito fundamental es permitir la clasificación automática y continua de clientes en grupos (audiencias) basados en un conjunto de reglas y condiciones predefinidas. Estas reglas pueden basarse en cualquier dato disponible en la plataforma: desde el objetivo principal del cliente (p. ej., 'pérdida de peso'), su nivel de experiencia ('principiante'), hasta su comportamiento reciente (p. ej., 'no ha reservado una sesión en 14 días') o su estado comercial (p. ej., 'suscripción a punto de expirar').
A diferencia de las listas estáticas, estas audiencias son dinámicas; se actualizan en tiempo real. Si un cliente registra un entrenamiento, puede salir de la audiencia 'inactivos' y entrar en la de 'activos' instantáneamente. Este dinamismo asegura que las acciones de marketing y comunicación sean siempre relevantes y oportunas. El valor principal radica en la capacidad de personalizar a escala, mejorando la retención, creando oportunidades de venta (upselling/cross-selling) y ahorrando un tiempo considerable al automatizar tareas de gestión de clientes que de otro modo serían manuales y propensas a errores.
## Flujo paso a paso de uso real
Un entrenador, llamémosle David, quiere mejorar la retención de sus clientes. Decide crear una campaña para re-enganchar a aquellos que empiezan a mostrar signos de abandono.
1. **Navegación:** David inicia sesión en TrainerERP y se dirige a la sección 'Marketing', luego hace clic en 'Audiencias'.
2. **Creación:** Ve su lista de audiencias existentes y hace clic en el botón 'Crear Nueva Audiencia'.
3. **Configuración Inicial:** En la nueva pantalla, nombra la audiencia como 'Clientes en Riesgo de Abandono'.
4. **Definición de Reglas:** Ahora utiliza el constructor de reglas visual:
* **Regla 1 (Inactividad):** Selecciona el campo 'Último entrenamiento registrado'. Como operador, elige 'hace más de' y en el valor introduce '14 días'. Esto captura a cualquiera que no haya entrenado en dos semanas.
* **Operador 'Y':** David quiere que se cumplan varias condiciones, así que se asegura de que el operador principal sea 'Y'.
* **Regla 2 (Aún son clientes):** Añade una nueva regla. Selecciona el campo 'Estado de la suscripción', el operador 'es igual a' y el valor 'Activa'. Esto es crucial para no contactar a personas que ya han cancelado.
* **Regla 3 (Excluir nuevos):** Añade una tercera regla para no molestar a los clientes recién incorporados. Selecciona 'Fecha de inicio del cliente', el operador 'es anterior a' y establece una fecha de hace 30 días.
5. **Previsualización:** Mientras añade estas reglas, un contador en la esquina de la pantalla se actualiza en tiempo real (gracias a la API de preview), mostrándole '8 clientes coinciden'. Esto le da confianza en que sus reglas son correctas.
6. **Guardado:** Satisfecho con la configuración, David hace clic en 'Guardar Audiencia'. La audiencia 'Clientes en Riesgo de Abandono' aparece ahora en su lista.
7. **Automatización:** A continuación, David navega a la sección 'Automatizaciones' y crea un nuevo flujo de trabajo.
* **Disparador:** Como disparador (trigger), selecciona 'Un cliente entra en una audiencia' y elige 'Clientes en Riesgo de Abandono'.
* **Acción:** Como acción, configura el envío de un email personalizado con el asunto '¡Te echamos de menos, [Nombre del Cliente]!' y un cuerpo que ofrece ayuda para volver a la rutina o una sesión gratuita para re-evaluar objetivos.
8. **Activación:** David activa la automatización. A partir de ahora, cualquier cliente que cumpla las condiciones de la audiencia recibirá automáticamente ese email, sin que David tenga que mover un dedo.
## Riesgos operativos y edge cases
* **Rendimiento del sistema:** El cálculo de audiencias complejas en una base de datos grande puede ser lento. Si un entrenador tiene 5,000 clientes, una consulta mal optimizada podría degradar el rendimiento de toda la aplicación. **Mitigación:** Usar trabajos en segundo plano (background jobs) que recalculen las audiencias periódicamente (p. ej., cada hora) en lugar de en tiempo real para cada carga de página. Almacenar en caché los resultados y usar índices de base de datos muy específicos.
* **Complejidad de la UI:** Un constructor de reglas demasiado potente puede volverse confuso para usuarios no técnicos. **Mitigación:** Diseñar una interfaz intuitiva con plantillas predefinidas para casos de uso comunes ('Clientes en riesgo', 'Más comprometidos', 'Próximos a renovar').
* **Datos Basura (GIGO - Garbage In, Garbage Out):** La efectividad de la segmentación depende directamente de la calidad de los datos. Si un entrenador no registra consistentemente los entrenamientos o los objetivos de sus clientes, las audiencias serán imprecisas. **Mitigación:** Fomentar la adopción de buenas prácticas a través de tutoriales, tooltips en la plataforma y dashboards que muestren el 'estado de salud de los datos'.
* **Fatiga de comunicación:** Si un cliente pertenece a múltiples audiencias que disparan automatizaciones simultáneamente, podría recibir demasiados mensajes. **Mitigación:** Implementar reglas de 'frecuencia' a nivel de automatización (p. ej., 'no enviar más de 1 email de marketing cada 3 días a un mismo cliente').
## KPIs y qué significan
* **Tamaño de Audiencia:** Muestra cuántos clientes encajan en un segmento. Un tamaño muy grande o muy pequeño puede indicar que la regla es demasiado amplia o demasiado restrictiva.
* **Tasa de Conversión por Audiencia:** (Requiere integración con objetivos de campaña) Mide el porcentaje de miembros de una audiencia que completan una acción deseada (p. ej., renovar, comprar un nuevo plan). Este es el KPI clave para demostrar el ROI de la segmentación. Si la audiencia 'Próximos a renovar' convierte un 20% más que un email masivo, la herramienta está funcionando.
* **Tasa de Abandono (Churn) por Segmento:** Permite identificar qué perfiles de cliente son más propensos a abandonar. Si la audiencia de 'principiantes con objetivo de pérdida de peso' tiene un churn alto, el entrenador puede crear contenido específico para mejorar su experiencia inicial.
* **Crecimiento de Audiencia:** Un crecimiento positivo en audiencias 'positivas' (p. ej., 'Clientes VIP') es un buen indicador de la salud del negocio. Un crecimiento en audiencias 'negativas' (p. ej., 'Clientes en Riesgo') es una señal de alerta temprana.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Usuario entra a la página de Audiencias] --> B(Click en 'Crear Nueva');
B --> C{Define Nombre y Reglas};
C -- Edita Reglas --> D(UI Llama a API de /preview);
D --> E[API Calcula y Devuelve Conteo];
E --> C;
C -- Click en 'Guardar' --> F(API POST /audiences);
F --> G[Sistema guarda la definición de la audiencia];
G --> H((Job en Segundo Plano));
H -- Periódicamente --> I{Evalúa reglas contra DB de clientes};
I --> J[Actualiza la lista de miembros de la audiencia];
subgraph Flujo de Automatización
K[Cliente realiza una acción, p.ej. no entrena] --> H;
J -- Cliente entra en Audiencia 'En Riesgo' --> L(Disparador de Automatización se activa);
L --> M[Sistema envía Email/SMS de re-enganche];
end
