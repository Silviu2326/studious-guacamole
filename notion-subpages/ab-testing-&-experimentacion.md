# A/B Testing & Experimentación

**Página padre:** Hola

---

# A/B Testing & Experimentación
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado, Administrador del Sistema
Esta funcionalidad está diseñada para los roles con permisos de gestión de marketing y ventas, como el Entrenador Personal que es dueño del negocio o un Entrenador Asociado con responsabilidades de crecimiento. No es visible para los Clientes o Leads. Permite a los usuarios optimizar sus estrategias de captación y comunicación basándose en datos reales en lugar de intuiciones.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/ab-testing
## Descripción Funcional
El módulo de A/B Testing y Experimentación de TrainerERP es una potente herramienta diseñada para que los entrenadores personales dejen de adivinar qué funciona y empiecen a tomar decisiones basadas en datos. Esta funcionalidad permite crear y gestionar pruebas controladas para comparar dos o más versiones de un activo de marketing y determinar cuál rinde mejor en la consecución de un objetivo específico. Por ejemplo, un entrenador puede probar dos titulares diferentes en su landing page para un nuevo 'Reto de 30 Días': la Versión A podría ser 'Transforma tu Físico en 30 Días' y la Versión B 'Pierde hasta 5kg de Grasa este Mes'. El sistema dividirá automáticamente el tráfico de visitantes entre ambas versiones y medirá cuál de ellas consigue más inscripciones. Lo mismo se aplica a las campañas de email, donde se pueden probar diferentes asuntos para maximizar la tasa de apertura, o a las ofertas, comparando un '20% de descuento' contra 'una sesión extra gratis' para ver qué incentivo atrae a más clientes. La plataforma no solo muestra los resultados en tiempo real, sino que también realiza el análisis estadístico, calculando la significancia para asegurar que los resultados son fiables y no producto del azar, declarando automáticamente una versión 'ganadora' cuando se alcanza un umbral de confianza.
## Valor de Negocio
El valor de negocio de la experimentación A/B para un entrenador personal es inmenso y directo: aumenta los ingresos y reduce los costes de adquisición de clientes. En un mercado competitivo, cada lead cuenta. Al optimizar sistemáticamente las landing pages, los emails y las ofertas, el entrenador puede aumentar significativamente sus tasas de conversión. Un aumento del 2% al 4% en la conversión de una landing page significa duplicar el número de clientes potenciales con el mismo presupuesto de publicidad. Esto permite escalar el negocio de manera más rentable. Además, esta herramienta empodera al entrenador, transformándolo de un simple proveedor de servicios a un estratega de marketing sofisticado. Le permite entender profundamente la psicología de su cliente ideal: ¿qué lenguaje resuena más con ellos? ¿Qué imágenes les motivan? ¿Qué ofertas les parecen irresistibles? Este conocimiento no solo se aplica a un único test, sino que genera aprendizajes que pueden ser utilizados en todas las comunicaciones futuras, mejorando la efectividad de todo el embudo de marketing y ventas. En resumen, el A/B testing convierte el marketing en una ciencia, proporcionando un camino claro y medible para el crecimiento sostenible del negocio.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador online, quiero crear un test A/B para mi landing page de 'Programa de Entrenamiento Personalizado' para ver si un video testimonial convierte mejor que una galería de fotos de 'antes y después', para así maximizar la venta de mis planes.
- Como coach de grupos pequeños, quiero probar dos asuntos de email diferentes para mi campaña de reactivación de ex-clientes, para identificar cuál genera una mayor tasa de apertura y consigue que más personas se reinscriban.
- Como dueño de un estudio de entrenamiento, quiero experimentar con dos ofertas diferentes para la primera sesión ('50% de descuento' vs. 'Gratuita si contratas un plan') para entender qué incentivo es más efectivo para convertir visitantes en clientes de largo plazo.
- Como entrenador personal, quiero que la plataforma me muestre un dashboard claro con la tasa de conversión, el nivel de confianza estadística y me notifique cuando una versión sea la ganadora clara, para no tener que interpretar datos complejos.
- Como administrador del negocio, quiero poder ver un historial completo de todos los experimentos realizados, sus resultados y los insights clave, para poder construir un 'playbook' de lo que funciona mejor con mi audiencia específica.
## Acciones Clave
- Crear un nuevo experimento seleccionando el tipo (Landing Page, Email, Oferta).
- Configurar las variaciones (A/B) subiendo diferentes textos, imágenes o configuraciones.
- Definir el objetivo de conversión (ej: envío de formulario, clic en botón de compra, apertura de email).
- Lanzar, pausar y finalizar un experimento.
- Monitorizar el rendimiento de cada variación en un dashboard en tiempo real.
- Visualizar el informe final con la versión ganadora y la significancia estadística.
- Aplicar la versión ganadora con un solo clic para que se convierta en la versión por defecto.
## 🧩 Componentes React Sugeridos
### 1. ExperimentDashboardContainer
Tipo: container | Componente principal que obtiene y gestiona el estado de todos los experimentos (activos, pausados, finalizados) del entrenador. Maneja la lógica de paginación y filtros.
Props:
- trainerId: 
- string (requerido) - ID del entrenador para obtener sus experimentos.
Estados: experimentsList, isLoading, error, activeFilter
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<ExperimentDashboardContainer trainerId='trainer-123' />
```

### 2. ExperimentResultCard
Tipo: presentational | Muestra un resumen visual de un único experimento. Compara las métricas clave de cada variante y destaca a la ganadora si existe.
Props:
- experiment: 
- Experiment (requerido) - Objeto que contiene toda la información y resultados del experimento.
Dependencias: recharts
Ejemplo de uso:
```typescript
<ExperimentResultCard experiment={experimentData} />
```

### 3. ExperimentSetupWizard
Tipo: container | Un wizard multi-paso que guía al entrenador a través de la creación de un nuevo experimento, desde la selección del tipo hasta la definición de las variantes y el objetivo.
Props:
- onComplete: 
- (newExperiment: Experiment) => void (requerido) - Callback que se ejecuta cuando el wizard se completa con éxito.
Estados: currentStep, experimentConfig, validationErrors
Dependencias: react-hook-form
Ejemplo de uso:
```typescript
<ExperimentSetupWizard onComplete={(exp) => console.log('Experimento creado:', exp)} />
```

### 4. StatisticalSignificanceIndicator
Tipo: presentational | Un pequeño componente visual que muestra el nivel de confianza estadística de un experimento, usando colores y un porcentaje para una fácil interpretación.
Props:
- confidenceLevel: 
- number (requerido) - Un valor entre 0 y 1 que representa el nivel de confianza.
Ejemplo de uso:
```typescript
<StatisticalSignificanceIndicator confidenceLevel={0.97} />
```
## 🔌 APIs Requeridas
### 1. POST /api/marketing/experiments
Crea un nuevo experimento de A/B testing para el entrenador autenticado.
Parámetros:
- experimentData (
- object, body, requerido): Objeto con la configuración del experimento, incluyendo nombre, tipo, objetivo y variantes.
Respuesta:
Tipo: object
Estructura: El objeto del experimento recién creado, incluyendo su ID.
```json
{
  "id": "exp_abc123",
  "name": "Test de Headline Landing Verano",
  "type": "LANDING_PAGE",
  "status": "DRAFT",
  "variants": [
    {
      "id": "var_a",
      "name": "Versión A - Headline Original"
    },
    {
      "id": "var_b",
      "name": "Versión B - Headline Agresivo"
    }
  ],
  "createdAt": "2023-10-27T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Datos del experimento inválidos o incompletos (ej: menos de dos variantes).
- 403: 
- Forbidden - El plan del usuario no incluye la funcionalidad de A/B testing.

### 2. GET /api/marketing/experiments
Obtiene una lista paginada de todos los experimentos del entrenador.
Parámetros:
- status (
- string, query, opcional): Filtra experimentos por estado (e.g., 'active', 'finished', 'draft').
- page (
- number, query, opcional): Número de página para la paginación.
Respuesta:
Tipo: array
Estructura: Un array de objetos de experimento con sus resultados resumidos.
```json
[
  {
    "id": "exp_abc123",
    "name": "Test de Headline Landing Verano",
    "status": "ACTIVE",
    "winner": null,
    "confidence": 0.85,
    "startDate": "2023-10-28T10:00:00Z"
  }
]
```
Autenticación: Requerida

### 3. GET /api/marketing/experiments/{id}
Obtiene los detalles y resultados completos de un experimento específico.
Parámetros:
- id (
- string, path, requerido): ID del experimento a consultar.
Respuesta:
Tipo: object
Estructura: Objeto completo del experimento con estadísticas detalladas por variante.
```json
{
  "id": "exp_abc123",
  "name": "Test de Headline Landing Verano",
  "status": "ACTIVE",
  "variants": [
    {
      "id": "var_a",
      "visitors": 1024,
      "conversions": 51,
      "conversionRate": 0.05
    },
    {
      "id": "var_b",
      "visitors": 1019,
      "conversions": 68,
      "conversionRate": 0.0667
    }
  ],
  "statisticalSignificance": 0.96,
  "lift": 0.334
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El experimento con el ID proporcionado no existe o no pertenece al usuario.

### 4. PUT /api/marketing/experiments/{id}/status
Actualiza el estado de un experimento (ej: para iniciarlo, pausarlo o finalizarlo).
Parámetros:
- id (
- string, path, requerido): ID del experimento a actualizar.
- status (
- string, body, requerido): El nuevo estado: 'active', 'paused', 'finished'.
Respuesta:
Tipo: object
Estructura: El objeto del experimento actualizado.
```json
{
  "id": "exp_abc123",
  "status": "ACTIVE"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Transición de estado no válida (ej: intentar iniciar un experimento ya finalizado).
- 404: 
- Not Found - El experimento con el ID proporcionado no existe.
## Notas Técnicas
Colecciones backend: experiments, experiment_variants, experiment_events, experiment_results
KPIs visibles: Tasa de Conversión (por variante), Número de Visitantes/Impresiones (por variante), Número de Conversiones (por variante), Significancia Estadística (o Nivel de Confianza), Mejora Relativa (Lift) de la variante B sobre la A, Duración del Experimento, Probabilidad de ser la Mejor (P-to-beat-baseline)
## Documentación Completa
## Resumen
El módulo de A/B Testing y Experimentación es una herramienta de optimización avanzada dentro de TrainerERP, diseñada para ayudar a los entrenadores a tomar decisiones de marketing basadas en datos, no en suposiciones. Su propósito es permitir la comparación científica de dos o más versiones de un elemento (como una página de ventas, un email o una oferta) para determinar cuál es más efectiva para lograr un objetivo concreto, como conseguir más inscripciones, ventas o clics.
En lugar de preguntarse '¿Qué titular funcionará mejor para mi nuevo programa?', el entrenador puede probar dos o tres opciones simultáneamente. El sistema divide automáticamente el tráfico entre las versiones y recopila datos sobre el rendimiento de cada una. Al final, presenta un informe claro que no solo muestra cuál funcionó mejor, sino que también indica con un alto grado de confianza estadística que el resultado no es una casualidad. Esta funcionalidad transforma el marketing de un arte a una ciencia, proporcionando un método claro para mejorar continuamente las tasas de conversión, maximizar el retorno de la inversión en publicidad y, en última instancia, hacer crecer el negocio del entrenador de manera más rápida y predecible.
## Flujo paso a paso de uso real
Imaginemos a **Laura, una entrenadora online** que quiere lanzar un nuevo "Reto de 90 Días". Ha creado una landing page, pero no está segura de qué oferta inicial atraerá a más clientes.
1. **Creación del Experimento:** Laura accede a la sección 'A/B Testing' en TrainerERP y hace clic en 'Crear Nuevo Experimento'. Selecciona el tipo 'Landing Page'. Le da un nombre: "Test de Oferta - Reto 90 Días".
2. **Definición de Variantes:**
* **Variante A (Control):** Configura la oferta principal como un "15% de descuento en el primer mes".
* **Variante B (Prueba):** Crea una copia de la página y cambia la oferta a "Incluye una sesión de coaching nutricional 1-a-1 GRATIS (valorada en 75€)".
3. **Configuración del Objetivo:** Laura define el objetivo de conversión como "un envío exitoso del formulario de inscripción". TrainerERP ya sabe cómo rastrear esto en su constructor de páginas.
4. **Lanzamiento:** Revisa la configuración y lanza el experimento. TrainerERP comienza a dividir el tráfico 50/50 entre las dos versiones de la página. Los visitantes son asignados a una versión y la verán consistentemente si regresan.
5. **Monitorización:** Durante los siguientes días, Laura visita el dashboard del experimento. Ve en tiempo real el número de visitantes, las conversiones y la tasa de conversión para cada variante. Un 'Indicador de Significancia Estadística' le muestra qué tan fiables son los datos hasta el momento. Al principio, está bajo (ej. 60%), lo que significa que es demasiado pronto para decidir.
6. **Declaración del Ganador:** Después de una semana, el sistema ha recopilado suficientes datos. El indicador de significancia alcanza el 97%. La Variante B (sesión gratis) muestra una tasa de conversión un 35% superior a la Variante A. El sistema marca la Variante B como la 'Ganadora'. Laura recibe una notificación.
7. **Aplicación de Cambios:** Con un solo clic en 'Aplicar Ganador', Laura configura la Variante B como la única versión visible de su landing page para todo el futuro tráfico. Ahora sabe con certeza que esta oferta es más atractiva para su público.
## Riesgos operativos y edge cases
- **'Peeking' o Espionaje de Resultados:** El riesgo más común es que el entrenador revise los resultados cada hora y detenga el test en cuanto una variante parezca estar ganando. Esto puede llevar a conclusiones falsas, ya que la aleatoriedad puede hacer que una versión parezca mejor al principio. **Mitigación:** Educar al usuario dentro de la UI para que espere a que se alcance un tamaño de muestra mínimo y una alta significancia estadística.
- **Bajo Volumen de Tráfico:** Si el entrenador tiene pocos visitantes, un test puede tardar semanas o meses en dar resultados fiables. **Mitigación:** El sistema debe estimar la duración del test basándose en el tráfico actual y la mejora esperada, gestionando las expectativas del usuario.
- **Efecto Regresión a la Media:** Una variante puede tener un rendimiento extraordinariamente bueno o malo al principio, pero tenderá a normalizarse con el tiempo. **Mitigación:** Similar al 'peeking', insistir en la necesidad de esperar a que el test 'madure'.
- **Múltiples Cambios a la Vez:** Si un entrenador prueba un nuevo titular Y una nueva imagen al mismo tiempo, no sabrá cuál de los dos cambios fue el responsable de la mejora. **Mitigación:** Recomendar tests A/B puros (un solo cambio) para empezar y explicar el concepto de tests multivariante como una opción avanzada.
## KPIs y qué significan
- **Tasa de Conversión:** El porcentaje de visitantes que completan la acción deseada (ej. se inscriben, compran, hacen clic). Es la métrica principal para medir la efectividad. `(Conversiones / Visitantes) * 100`.
- **Significancia Estadística:** Es el 'medidor de confianza' en los resultados. Un valor del 95% significa que hay un 95% de probabilidad de que la diferencia de rendimiento entre las variantes sea real y no producto del azar. Es crucial para tomar decisiones fiables.
- **Mejora Relativa (Lift):** Muestra cuánto mejor (o peor) es una variante en comparación con la original, en porcentaje. Un 'lift' del 25% significa que la nueva versión está generando un 25% más de conversiones.
- **Visitantes/Impresiones:** El número total de usuarios únicos que han visto cada variante. Esencial para asegurar que tenemos un tamaño de muestra suficiente.
- **Conversiones:** El número bruto de veces que se ha alcanzado el objetivo en cada variante.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Inicio: Dashboard de A/B Testing] --> B{Crear Nuevo Experimento};
B --> C[1. Elegir Tipo: Landing Page, Email, etc.];
C --> D[2. Nombrar Experimento y Definir Objetivo];
D --> E[3. Configurar Variante A (Control)];
E --> F[4. Configurar Variante B (Prueba)];
F --> G{¿Añadir más variantes?};
G -- Sí --> F;
G -- No --> H[5. Revisar y Lanzar Experimento];
H --> I[Sistema divide tráfico y recopila datos];
I --> J[Monitorizar Dashboard en Tiempo Real];
J --> K{¿Significancia > 95%?};
K -- No --> J;
K -- Sí --> L[Declarar Variante Ganadora];
L --> M[Usuario recibe notificación];
M --> N{Aplicar Ganador};
N -- Sí --> O[La variante ganadora se convierte en la versión por defecto];
N -- No --> P[Experimento finalizado y archivado];
O --> P;
