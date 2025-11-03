# Competitive Analysis & Market Intelligence

**Página padre:** Hola

---

# Competitive Analysis & Market Intelligence
👥 Tipo de Usuario: Entrenador Personal (Administrador), Administrador del Sistema, Entrenador Asociado (con permisos)
Principalmente para el 'Entrenador Personal (Administrador)' o el dueño del negocio, que toma decisiones estratégicas. Un 'Entrenador Asociado' en un estudio más grande podría tener acceso de solo lectura para entender el contexto del mercado, pero no para añadir o eliminar competidores.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/market-intelligence
## Descripción Funcional
El módulo de 'Análisis Competitivo e Inteligencia de Mercado' es una herramienta estratégica diseñada para transformar a los entrenadores personales de excelentes profesionales del fitness a astutos empresarios. Esta funcionalidad permite a los usuarios de TrainerERP ir más allá de su propia gestión y obtener una visión clara y basada en datos del panorama competitivo que les rodea. En lugar de basar las decisiones críticas de negocio —como la fijación de precios, la creación de ofertas o la estrategia de marketing— en la intuición o en información fragmentada, esta herramienta automatiza la recopilación y el análisis de información pública de otros entrenadores y centros de fitness. El sistema permite al entrenador definir a sus competidores clave, ya sea por su nombre, página web o perfiles de redes sociales. A partir de ahí, TrainerERP monitorea de forma continua aspectos como sus estructuras de precios, los tipos de paquetes y servicios que ofrecen (entrenamiento 1 a 1, clases grupales, asesoría nutricional), su frecuencia de publicación en redes sociales, el engagement que generan y las promociones que lanzan. El resultado es un dashboard centralizado que no solo muestra datos brutos, sino que los convierte en insights accionables: gráficos comparativos de precios, nubes de palabras con los servicios más ofertados en la zona, y sugerencias proactivas sobre posibles 'gaps' o nichos de mercado desatendidos que el entrenador podría explotar para diferenciarse y atraer a más clientes.
## Valor de Negocio
El valor de negocio de esta herramienta es fundamental para la sostenibilidad y el crecimiento a largo plazo del negocio de un entrenador personal. En un mercado cada vez más saturado, la diferenciación es clave. Este módulo proporciona la inteligencia necesaria para construir una propuesta de valor única y competitiva. Primero, elimina la incertidumbre en la fijación de precios, permitiendo al entrenador posicionarse estratégicamente (como opción premium, asequible o de valor) basándose en datos reales del mercado local y online, maximizando así su potencial de ingresos. Segundo, inspira la innovación en la oferta de servicios; al identificar qué están haciendo otros, el entrenador puede descubrir oportunidades para ofrecer servicios complementarios o especializarse en un nicho con menos competencia, atrayendo a un público más específico y leal. Tercero, optimiza la estrategia de marketing al analizar qué tipo de contenido y promociones resuenan más en la audiencia de sus competidores, ahorrando tiempo y dinero en tácticas de marketing ineficaces. En resumen, esta herramienta eleva al entrenador de ser un mero proveedor de servicios a un estratega de negocio, dándole el poder de tomar decisiones informadas que impulsan la captación de clientes, aumentan la rentabilidad y construyen una marca sólida y diferenciada en el competitivo mundo del fitness.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: alta
- Fase recomendada: Premium
## User Stories
- Como entrenador personal independiente en una nueva ciudad, quiero analizar los precios promedio por sesión y por paquete mensual de otros entrenadores en mi código postal para establecer mis tarifas de forma competitiva y justa.
- Como coach online especializado en calistenia, quiero rastrear los perfiles de Instagram de los 5 principales influencers de calistenia para entender su estrategia de contenido, frecuencia de publicación y tipo de interacción con su comunidad.
- Como dueño de un estudio de entrenamiento, quiero identificar qué servicios complementarios (e.g., fisioterapia, nutrición, yoga) ofrecen los gimnasios y estudios en un radio de 5 km para encontrar un 'gap' en el mercado y diferenciar mi oferta.
- Como entrenador que busca expandirse, quiero generar un reporte que compare mi paquete 'Transformación Total' con ofertas similares de 3 competidores directos, analizando precio, número de sesiones, y extras incluidos.
- Como entrenador personal, quiero recibir una notificación semanal con un resumen de las nuevas ofertas o cambios de precios significativos de los competidores que estoy monitoreando para poder reaccionar rápidamente.
## Acciones Clave
- Añadir un nuevo competidor para monitorear a través de su URL web o perfil de red social.
- Configurar la ubicación (ciudad, código postal) y el nicho (e.g., entrenamiento postparto, powerlifting) para el análisis de mercado general.
- Visualizar un dashboard comparativo con métricas clave de mis competidores (precios, servicios, actividad en redes).
- Generar y descargar un reporte en PDF con el análisis comparativo entre mi negocio y competidores seleccionados.
- Explorar el 'Mapa de Oportunidades' que sugiere servicios o nichos con baja competencia en mi área.
- Guardar 'Insights' clave o ideas estratégicas generadas por la plataforma en mi plan de negocio digital dentro de TrainerERP.
## 🧩 Componentes React Sugeridos
### 1. MarketIntelligenceDashboard
Tipo: container | Componente principal que orquesta la página. Realiza las llamadas a la API para obtener los datos de competidores y del mercado, y gestiona el estado global de la página (filtros, competidor seleccionado, etc.).
Props:
- userId: 
- string (requerido) - ID del entrenador logueado para obtener sus datos específicos.
Estados: competitorsList, marketSummary, selectedLocation, isLoading, error
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<MarketIntelligenceDashboard userId='user-123' />
```

### 2. CompetitorCard
Tipo: presentational | Tarjeta que muestra la información resumida de un único competidor. Muestra su logo, nombre, métricas clave (precio promedio, engagement) y botones de acción (ver detalles, eliminar).
Props:
- competitor: 
- object (requerido) - Objeto con los datos del competidor.
- onViewDetails: 
- (id: string) => void (requerido) - Callback que se ejecuta al hacer clic en 'Ver Detalles'.
- onDelete: 
- (id: string) => void (requerido) - Callback que se ejecuta al hacer clic en 'Eliminar'.
Dependencias: @mui/material
Ejemplo de uso:
```typescript
<CompetitorCard competitor={competitorData} onViewDetails={handleViewDetails} onDelete={handleDelete} />
```

### 3. AddCompetitorModal
Tipo: container | Modal con un formulario para que el usuario pueda añadir un nuevo competidor. Maneja la validación de los campos y la llamada a la API para crear el registro.
Props:
- isOpen: 
- boolean (requerido) - Controla si el modal está visible.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- onCompetitorAdded: 
- () => void (requerido) - Callback que se ejecuta después de añadir un competidor exitosamente para refrescar la lista.
Estados: url, socialMediaHandle, isSubmitting, formError
Dependencias: react-hook-form, zod
Ejemplo de uso:
```typescript
<AddCompetitorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCompetitorAdded={refetchCompetitors} />
```

### 4. PriceComparisonChart
Tipo: presentational | Componente de visualización que muestra un gráfico de barras comparando los precios del usuario con el promedio del mercado y los de competidores seleccionados.
Props:
- data: 
- Array<{ name: string; price: number; type: 'user' | 'market' | 'competitor' }> (requerido) - Array de objetos con los datos para renderizar en el gráfico.
Dependencias: recharts, d3
Ejemplo de uso:
```typescript
<PriceComparisonChart data={chartData} />
```
## 🔌 APIs Requeridas
### 1. GET /api/intelligence/competitors
Obtiene la lista de competidores que el entrenador está monitoreando.
Respuesta:
Tipo: array
Estructura: Un array de objetos, donde cada objeto representa un competidor con sus métricas clave resumidas.
```json
[
  {
    "id": "comp-abc",
    "name": "FitLife Studio",
    "websiteUrl": "https://fitlifestudio.com",
    "summary": {
      "avgPricePerSession": 55,
      "socialEngagementRate": 2.5,
      "lastUpdate": "2023-10-27T10:00:00Z"
    }
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o ha expirado.

### 2. POST /api/intelligence/competitors
Añade un nuevo competidor a la lista de monitoreo del entrenador.
Parámetros:
- url (
- string, body, requerido): La URL de la página web o del perfil de red social principal del competidor.
Respuesta:
Tipo: object
Estructura: El objeto del competidor recién creado, con una tarea de 'scraping' inicial encolada.
```json
{
  "id": "comp-xyz",
  "name": "Joe's Personal Training",
  "websiteUrl": "https://joestraining.com",
  "status": "pending_first_scan"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - La URL proporcionada no es válida o ya está siendo monitoreada.
- 402: 
- Payment Required - El usuario ha alcanzado el límite de competidores a monitorear en su plan actual.

### 3. GET /api/intelligence/market-summary
Obtiene un resumen agregado de la inteligencia de mercado para una ubicación y nicho específicos.
Parámetros:
- location (
- string, query, requerido): La ubicación para el análisis (e.g., 'Madrid, ES' o '90210').
- niche (
- string, query, opcional): El nicho de entrenamiento a analizar (e.g., 'yoga', 'crossfit').
Respuesta:
Tipo: object
Estructura: Un objeto con KPIs agregados del mercado, como precios promedio, servicios populares y oportunidades.
```json
{
  "location": "Madrid, ES",
  "averagePricePerSession": 45.5,
  "averagePricePerMonth": 180,
  "popularServices": [
    "Entrenamiento Funcional",
    "Asesoría Nutricional",
    "Pilates"
  ],
  "opportunityGaps": [
    "Entrenamiento para mayores de 60",
    "Preparación para oposiciones"
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontraron suficientes datos para la ubicación o nicho especificado.

### 4. DELETE /api/intelligence/competitors/{id}
Elimina a un competidor de la lista de monitoreo.
Parámetros:
- id (
- string, path, requerido): El ID del competidor a eliminar.
Respuesta:
Tipo: object
Estructura: Un mensaje de confirmación.
```json
{
  "status": "success",
  "message": "Competidor eliminado correctamente."
}
```
Autenticación: Requerida
Errores posibles:
- 403: 
- Forbidden - El usuario no tiene permisos para eliminar a este competidor.
- 404: 
- Not Found - No se encontró un competidor con el ID proporcionado.
## Notas Técnicas
Colecciones backend: competitors, market_snapshots, social_media_data, service_offerings, user_insights
KPIs visibles: Precio Promedio del Mercado (por sesión/paquete), Mi Posicionamiento de Precio (vs. Promedio), Tasa de Engagement Promedio de Competidores, Frecuencia de Publicación de Competidores (posts/semana), Top 5 Servicios Más Ofrecidos en el Área, Índice de Oportunidad de Nicho (calculado en base a la demanda vs. oferta)
## Documentación Completa
## Resumen
El módulo de **Análisis Competitivo e Inteligencia de Mercado** es una herramienta de alto valor estratégico dentro de TrainerERP, ubicada en la sección de 'Extras & Especializados'. Su propósito es empoderar a los entrenadores personales y dueños de estudios de fitness con datos concretos sobre su entorno competitivo. En lugar de operar a ciegas o basarse en suposiciones, esta funcionalidad permite a los usuarios monitorear de forma automatizada a sus competidores directos y analizar las tendencias del mercado en su ubicación y nicho.
El sistema recopila información pública de páginas web y perfiles de redes sociales sobre precios, paquetes de servicios, estrategias de contenido, promociones y nivel de interacción con la audiencia. Posteriormente, procesa y presenta estos datos en un dashboard intuitivo con gráficos comparativos, KPIs clave y, lo más importante, **insights accionables**. El objetivo final es ayudar al entrenador a tomar decisiones de negocio más inteligentes para:
1. **Optimizar su estrategia de precios** para maximizar ingresos sin perder competitividad.
2. **Identificar oportunidades de mercado** y nichos desatendidos para diferenciarse.
3. **Innovar en su oferta de servicios** basándose en lo que funciona y lo que falta en el mercado.
4. **Mejorar su estrategia de marketing y redes sociales** aprendiendo de los éxitos y fracasos de otros.
Esta herramienta está diseñada para el administrador del negocio, aquel que piensa en el crecimiento y la sostenibilidad a largo plazo.
---
## Flujo paso a paso de uso real
Imaginemos a **Laura, una entrenadora personal en Barcelona** que quiere lanzar un nuevo servicio de entrenamiento online para mujeres postparto.
1. **Acceso y Configuración Inicial**: Laura navega a `Dashboard > Inteligencia de Mercado`. Lo primero que ve es un panel de bienvenida que le pide configurar su ubicación principal ('Barcelona, ES') y su nicho principal ('entrenamiento postparto').
2. **Análisis de Mercado General**: Inmediatamente, el sistema le muestra un resumen del mercado para su configuración. Ve que el precio promedio por sesión online en Barcelona para nichos similares es de 50€. También descubre que los servicios más comunes son 'recuperación de suelo pélvico' y 'entrenamiento funcional adaptado', pero hay una baja oferta de 'asesoría nutricional específica para la lactancia'. ¡Este es su primer insight de oportunidad!
3. **Añadir Competidores**: Laura conoce a tres coaches online que son su competencia directa. Hace clic en 'Añadir Competidor' e introduce las URLs de sus perfiles de Instagram y sus páginas web. El sistema confirma que los ha añadido y le informa que el primer análisis puede tardar unas horas.
4. **Revisión del Dashboard**: Al día siguiente, Laura vuelve al dashboard. Ahora ve tres 'Competitor Cards' con los nombres de sus competidoras. Cada tarjeta muestra un resumen: precio del paquete más popular, frecuencia de publicación (e.g., 4 posts/semana) y tasa de engagement (e.g., 3.2%).
5. **Análisis Profundo**: Laura hace clic en 'Comparar'. Se abre una vista detallada con un gráfico de barras que compara sus precios (aún no definidos) con los de sus tres competidoras y el promedio del mercado. Ve que una competidora tiene un precio muy alto (premium) y las otras dos están en la media. También ve una tabla que desglosa los paquetes: 'Competidora A' ofrece 8 sesiones/mes + 1 llamada de seguimiento. 'Competidora B' ofrece acceso a una app con vídeos pre-grabados. Esto le da ideas para estructurar su propia oferta.
6. **Guardar Insights y Actuar**: Inspirada, Laura utiliza la función 'Guardar Insight'. Escribe: "*Oportunidad: Crear paquete premium que incluya asesoría nutricional para lactancia. Precio sugerido: 65€/sesión para posicionarme por encima de la media pero debajo de la competidora más cara*". Este insight se guarda en su plan de negocio dentro de TrainerERP. Con esta información, Laura define su nueva oferta en el módulo de 'Monetización & Ofertas' con mucha más confianza.
---
## Riesgos operativos y edge cases
- **Calidad de los Datos**: El mayor riesgo es la imprecisión. Los scrapers pueden fallar si un sitio web cambia su diseño. Los precios pueden estar ocultos o requerir un inicio de sesión. **Mitigación**: Implementar sistemas de monitoreo de scrapers, permitir a los usuarios reportar datos incorrectos y mostrar siempre la fecha de la 'última actualización' de los datos.
- **Límites de API y Bloqueos**: Plataformas como Instagram o Facebook pueden bloquear IPs o limitar severamente las solicitudes de datos. **Mitigación**: Usar proxies rotativos, respetar los `rate limits` de las APIs y tener mecanismos de reintento con backoff exponencial. Considerar el uso de APIs de terceros especializadas en web scraping.
- **Competidores 'Offline'**: La herramienta es inútil para analizar competidores que no tienen una presencia digital sólida. **Mitigación**: Ser transparentes sobre esta limitación. Permitir al usuario introducir datos manualmente para estos competidores y así incluirlos en las comparativas.
- **Interpretación Errónea de los Datos**: Un entrenador podría, por ejemplo, bajar sus precios drásticamente solo porque el promedio del mercado es bajo, sin considerar su valor añadido. **Mitigación**: Acompañar los datos con textos explicativos (tooltips, guías) que ayuden a interpretarlos. Sugerir estrategias en lugar de dar órdenes ('Considera ofrecer X' en lugar de 'Ofrece X').
- **Privacidad y Ética**: Aunque se escanea información pública, el agregado y análisis sistemático puede rozar límites éticos. **Mitigación**: Tener una política de uso aceptable muy clara. No escanear información privada ni intentar acceder a áreas protegidas por contraseña. Enfocarse en datos de negocio, no personales.
---
## KPIs y qué significan
- **Precio Promedio del Mercado (por sesión/paquete)**: Es la media de precios extraída de los competidores en la ubicación y nicho definidos. **Significado para el entrenador**: Es su principal punto de referencia para saber si sus precios son altos, bajos o están en la media. Ayuda a evitar tanto el infravalorarse como el quedar fuera del mercado.
- **Mi Posicionamiento de Precio (vs. Promedio)**: Un indicador visual (e.g., un medidor o un percentil) que muestra dónde se sitúan los precios del entrenador en comparación con el promedio. **Significado**: Le permite entender rápidamente su estrategia de posicionamiento actual (premium, valor, económico).
- **Tasa de Engagement Promedio de Competidores**: El promedio de (likes + comentarios) / seguidores por publicación de los competidores monitoreados. **Significado**: Es un indicador de la calidad y resonancia del contenido de la competencia. Un engagement alto sugiere que su estrategia de contenido funciona, y puede ser una fuente de inspiración.
- **Frecuencia de Publicación de Competidores (posts/semana)**: Cuántas veces, en promedio, publican sus competidores en redes sociales. **Significado**: Ayuda al entrenador a calibrar su propio esfuerzo en redes sociales. Si sus competidores publican a diario y él una vez a la semana, podría estar perdiendo visibilidad.
- **Top 5 Servicios Más Ofrecidos en el Área**: Un listado de los servicios que más se repiten en las ofertas de la competencia (e.g., 'Entrenamiento HIIT', 'Asesoría Nutricional'). **Significado**: Muestra cuáles son las expectativas del mercado y los servicios 'estándar'. Si el entrenador no ofrece alguno de ellos, debe tener una razón estratégica para ello. También puede indicar saturación.
- **Índice de Oportunidad de Nicho**: Una métrica calculada por TrainerERP que cruza la demanda aparente (búsquedas, menciones) con la oferta existente. **Significado**: Es una señal proactiva que le dice al entrenador: "*Hey, mucha gente busca 'entrenamiento para escaladores' en tu zona, pero pocos entrenadores lo ofrecen. ¡Aquí hay una oportunidad!*"
---
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Usuario entra a la página] --> B{¿Configuración inicial completa?};
B -->|No| C[Muestra modal de configuración: Ubicación y Nicho];
C --> D[Guarda configuración y carga datos del mercado];
B -->|Sí| D;
D --> E[Muestra Dashboard con Resumen de Mercado y lista de competidores];
subgraph Acciones del Usuario
F[Clic en 'Añadir Competidor'] --> G[Abre Modal de URL];
G --> H[API: POST /api/intelligence/competitors];
H --> I[Añade competidor a la lista con estado 'Analizando...'];
J[Clic en 'Comparar'] --> K[Muestra vista de análisis detallado con gráficos];
L[Clic en 'Eliminar Competidor'] --> M[API: DELETE /api/intelligence/competitors/{id}];
end
E --> F;
E --> J;
E --> L;
