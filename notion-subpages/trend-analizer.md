# Trend Analizer

**Página padre:** Hola

---

# Trend Analizer
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta herramienta está diseñada para los profesionales que gestionan el negocio, como el 'Entrenador Personal (Administrador)' o 'Entrenadores Asociados' con permisos. Su objetivo es proporcionar inteligencia de mercado para la toma de decisiones estratégicas en marketing y contenido. Los roles de 'Cliente' o 'Lead' no tienen acceso a esta sección.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/intelligence/trend-analyzer
## Descripción Funcional
El 'Trend Analizer' es el centro de inteligencia competitiva y de mercado de TrainerERP. Esta herramienta va más allá de los análisis internos del negocio, enfocándose en el ecosistema externo del fitness para mantener al entrenador un paso por delante de la competencia. El sistema agrega y procesa continuamente datos de fuentes clave como redes sociales (Instagram, TikTok, YouTube), blogs de fitness influyentes y motores de búsqueda para identificar patrones y tendencias emergentes. Para un entrenador personal, esto se traduce en insights accionables: ¿Qué tipo de rutinas de 'HIIT en casa' se están volviendo virales? ¿Qué mitos nutricionales están generando más debate ahora mismo? ¿Qué hashtags están usando los líderes de opinión del sector para maximizar su alcance? La página presenta esta información a través de un dashboard interactivo, no solo mostrando *qué* es tendencia, sino *por qué* y *cómo* el entrenador puede capitalizarlo. Ofrece sugerencias de contenido generadas por IA, como ideas para reels, carruseles, artículos de blog o incluso temáticas para nuevos programas de entrenamiento. Además, permite un análisis de la competencia, donde el entrenador puede monitorear las estrategias de otros profesionales para encontrar huecos en el mercado o inspirarse en sus éxitos. Es una herramienta proactiva diseñada para eliminar las conjeturas en la estrategia de contenido y posicionar al entrenador como una autoridad relevante y actualizada en el dinámico mundo del fitness.
## Valor de Negocio
El valor de negocio del 'Trend Analizer' reside en su capacidad para transformar a un entrenador personal de reactivo a proactivo en su estrategia de marketing y crecimiento. En un mercado tan saturado como el del fitness, la relevancia es la moneda de cambio. Esta herramienta ahorra decenas de horas semanales que los entrenadores invierten en investigación manual, un proceso a menudo ineficaz y sesgado. Al automatizar la detección de tendencias, TrainerERP permite que el profesional se enfoque en lo que mejor sabe hacer: entrenar a sus clientes. Crear contenido que resuena con las tendencias actuales aumenta drásticamente el engagement orgánico, la captación de seguidores cualificados y, en última instancia, la generación de leads. Posiciona al entrenador como una fuente de información fresca y fiable, construyendo una marca personal sólida. Además, al analizar a la competencia, ofrece una ventaja competitiva directa, permitiendo al entrenador diferenciar su propuesta de valor y anticiparse a movimientos del mercado. A largo plazo, esto se traduce en una mayor tasa de conversión de leads, una menor dependencia de la publicidad pagada y una mayor retención de clientes, que perciben a su entrenador como un experto a la vanguardia del sector.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: alta
- Fase recomendada: Premium
## User Stories
- Como entrenador online, quiero ver qué tipos de 'challenges' de fitness son tendencia en TikTok e Instagram para poder lanzar mi propio reto y captar nuevos leads.
- Como especialista en nutrición deportiva, quiero identificar las dudas más frecuentes sobre suplementación en foros y blogs para crear una serie de posts educativos que me posicionen como experto.
- Como dueño de un estudio de entrenamiento personal, quiero analizar las publicaciones con más engagement de mis competidores locales para entender qué servicios o mensajes resuenan mejor en mi área geográfica.
- Como entrenador personal independiente, quiero recibir sugerencias de temas para mis vídeos de YouTube basados en las búsquedas con mayor crecimiento relacionadas con 'pérdida de peso para principiantes'.
- Como coach de calistenia, quiero configurar una alerta para ser notificado cuando nuevos tutoriales o técnicas sobre 'front lever' o 'planche' empiecen a ganar tracción en la comunidad.
- Como gestor de redes sociales para un centro de fitness, quiero un listado de hashtags de nicho y de alto volumen para optimizar el alcance de nuestras publicaciones diarias.
## Acciones Clave
- Explorar el dashboard principal con las tendencias más destacadas del sector fitness.
- Filtrar tendencias por plataforma (Instagram, TikTok, YouTube, Blogs, Búsquedas), categoría (Ejercicio, Nutrición, Mentalidad) y público objetivo (Principiantes, Avanzados).
- Hacer clic en una tendencia para ver un análisis detallado, incluyendo su 'velocidad de crecimiento', ejemplos de contenido popular y demografía de la audiencia.
- Guardar una sugerencia de contenido generada por IA en el planificador de contenido del sistema.
- Añadir hasta 5 perfiles de competidores para monitorizar su contenido más exitoso, frecuencia de publicación y estrategia de hashtags.
- Crear y gestionar alertas personalizadas por palabras clave para recibir notificaciones sobre tendencias emergentes.
## 🧩 Componentes React Sugeridos
### 1. TrendAnalyzerDashboard
Tipo: container | Componente principal que orquesta la página. Gestiona los filtros, realiza las peticiones a la API y distribuye los datos a los componentes de presentación.
Props:
- userProfile: 
- object (requerido) - Objeto con información del entrenador para personalizar las sugerencias de relevancia.
Estados: trendsData, suggestionsData, competitorsData, activeFilters, isLoading, error
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<TrendAnalyzerDashboard userProfile={currentUser.profile} />
```

### 2. TrendCard
Tipo: presentational | Muestra la información resumida de una única tendencia, incluyendo su título, KPIs clave y un botón de acción para ver detalles.
Props:
- trend: 
- { title: string; velocityScore: number; saturation: 'low' | 'medium' | 'high'; platform: 'instagram' | 'tiktok' } (requerido) - Objeto que contiene los datos de la tendencia a mostrar.
- onSeeDetails: 
- (trendId: string) => void (requerido) - Función callback que se ejecuta al hacer clic en el botón de ver detalles.
Dependencias: styled-components
Ejemplo de uso:
```typescript
<TrendCard trend={someTrendData} onSeeDetails={() => handleDetailsClick(someTrendData.id)} />
```

### 3. ContentSuggestionCard
Tipo: presentational | Muestra una idea de contenido concreta generada por IA, con formato, tema y un botón para guardarla.
Props:
- suggestion: 
- { id: string; format: 'Reel' | 'Post' | 'Story'; title: string; description: string; } (requerido) - Objeto con los detalles de la sugerencia de contenido.
- onSave: 
- (suggestionId: string) => void (requerido) - Función callback para guardar la idea en el planificador de contenido.
Estados: isSaved
Ejemplo de uso:
```typescript
<ContentSuggestionCard suggestion={iaSuggestion} onSave={handleSaveSuggestion} />
```

### 4. useTrendApi
Tipo: hook | Hook personalizado que abstrae la lógica de fetching, cacheo y estado (loading, error) para los datos de tendencias, usando react-query.
Props:
- filters: 
- { platform?: string; category?: string; } (opcional) - Objeto con los filtros activos para la petición a la API.
Dependencias: react-query, axios
Ejemplo de uso:
```typescript
const { data: trends, isLoading, isError } = useTrendApi({ platform: 'tiktok' });
```
## 🔌 APIs Requeridas
### 1. GET /api/intelligence/trends
Obtiene una lista de las tendencias actuales de fitness, filtradas y ordenadas por relevancia.
Parámetros:
- platform (
- string, query, opcional): Filtra por plataforma. Ej: 'instagram', 'tiktok', 'youtube'.
- category (
- string, query, opcional): Filtra por categoría. Ej: 'exercise', 'nutrition', 'mindset'.
- limit (
- number, query, opcional): Número de resultados a devolver. Default: 20.
Respuesta:
Tipo: array
Estructura: Un array de objetos 'trend', cada uno con id, title, description, velocity_score, saturation_level, platform, y examples (links).
```json
{
  "trends": [
    {
      "id": "trend_123",
      "title": "Entrenamiento Híbrido (Fuerza + Resistencia)",
      "velocity_score": 85,
      "saturation_level": "medium",
      "platform": "instagram",
      "examples": [
        "https://..."
      ]
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - Token de autenticación inválido o ausente.
- 429: 
- Too Many Requests - Límite de peticiones excedido.

### 2. GET /api/intelligence/content-suggestions
Genera u obtiene sugerencias de contenido basadas en una tendencia específica o en el perfil del usuario.
Parámetros:
- trend_id (
- string, query, requerido): ID de la tendencia para la cual generar sugerencias.
- count (
- number, query, opcional): Número de sugerencias a generar. Default: 3.
Respuesta:
Tipo: array
Estructura: Un array de objetos 'suggestion', cada uno con id, format ('reel', 'post'), title, description, y call_to_action sugerido.
```json
{
  "suggestions": [
    {
      "id": "sug_456",
      "format": "Reel",
      "title": "3 Mitos del Entrenamiento Híbrido Desmentidos",
      "description": "Crea un reel rápido mostrando un mito (ej. 'no se puede ganar músculo y correr a la vez'), y luego desmintiéndolo con ciencia y mostrando un ejemplo.",
      "suggested_cta": "¿Practicas entrenamiento híbrido? ¡Cuéntame tu experiencia!"
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Trend Not Found - El trend_id proporcionado no existe.
- 503: 
- AI Service Unavailable - El servicio de generación de contenido no está disponible temporalmente.

### 3. POST /api/intelligence/competitors
Añade un nuevo perfil de competidor para que el sistema comience a monitorizarlo.
Parámetros:
- social_handle (
- string, body, requerido): El nombre de usuario del competidor en la red social. Ej: '@nombre.competidor'.
- platform (
- string, body, requerido): La plataforma social del handle. Ej: 'instagram'.
Respuesta:
Tipo: object
Estructura: El objeto del competidor recién creado, con su id y estado de monitorización ('pending_first_analysis').
```json
{
  "competitor": {
    "id": "comp_789",
    "social_handle": "@nombre.competidor",
    "platform": "instagram",
    "status": "pending_first_analysis"
  }
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Invalid Handle - El formato del 'social_handle' no es válido.
- 409: 
- Competitor Already Exists - Este competidor ya está siendo monitorizado por el usuario.

### 4. GET /api/intelligence/competitors/{id}/analysis
Obtiene el último análisis disponible para un competidor específico.
Parámetros:
- id (
- string, path, requerido): El ID del competidor.
Respuesta:
Tipo: object
Estructura: Un objeto con el análisis del competidor, incluyendo sus posts más exitosos, frecuencia de publicación, hashtags más usados y temas principales.
```json
{
  "analysis": {
    "last_updated": "2023-10-27T10:00:00Z",
    "top_posts": [
      {
        "url": "...",
        "engagement_rate": 5.2
      }
    ],
    "posting_frequency": "4 posts/week",
    "top_hashtags": [
      "#fitnesslife",
      "#personaltrainer"
    ],
    "main_topics": [
      "kettlebell workouts",
      "meal prep"
    ]
  }
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Competitor Not Found - El ID del competidor no existe o no pertenece al usuario.
## Notas Técnicas
Colecciones backend: trends, content_suggestions_ia, competitor_profiles, trend_alerts, user_saved_ideas
KPIs visibles: Puntuación de Velocidad de Tendencia (Trend Velocity Score), Volumen de Menciones/Búsquedas (24h/7d), Nivel de Saturación del Contenido, Índice de Relevancia para el Nicho (calculado según el perfil del entrenador), Tasa de Engagement Promedio del Contenido Asociado, Potencial de Alcance Orgánico Estimado
## Documentación Completa
## Resumen
El módulo 'Trend Analizer' es una herramienta de Business Intelligence (BI) diseñada para proporcionar a los entrenadores personales de TrainerERP una ventaja competitiva en el ámbito del marketing digital y la creación de contenido. Su función principal es analizar el ecosistema digital del fitness (redes sociales, blogs, tendencias de búsqueda) para extraer y presentar insights accionables. En lugar de que el entrenador invierta horas en investigación manual, el 'Trend Analizer' le ofrece un dashboard consolidado con las tendencias emergentes, sugerencias de contenido personalizadas por IA, y un análisis de la competencia. El objetivo es permitir que los entrenadores creen contenido más relevante, aumenten su alcance orgánico, se posicionen como autoridades en su nicho y, en última instancia, atraigan más clientes de alta calidad. Esta funcionalidad pasa de ser un simple análisis de datos a una herramienta de estrategia proactiva, ayudando a responder preguntas cruciales como: "¿Sobre qué debería publicar hoy?", "¿Qué tipo de contenido está funcionando ahora mismo en mi sector?" y "¿Qué están haciendo mis competidores que yo podría hacer mejor?".
## Flujo paso a paso de uso real
Imaginemos a Ana, una entrenadora personal online especializada en calistenia para principiantes.
1. **Acceso y Vista General**: Ana accede a `dashboard/intelligence/trend-analyzer`. Lo primero que ve es el 'Top 5 de Tendencias en Fitness', donde destaca "Movilidad para Calistenia" con una alta 'Puntuación de Velocidad'.
2. **Análisis Profundo de la Tendencia**: Intrigada, hace clic en esta tendencia. Se abre una vista detallada que le muestra:
* Gráficos del crecimiento en menciones en Instagram y búsquedas en YouTube.
* Ejemplos de reels virales de otros creadores sobre rutinas de movilidad para muñecas y hombros.
* Un listado de hashtags populares como `#calisthenicsmobility` y `#mobilityflow`.
* Insights de la audiencia: "El público que interactúa con este contenido suele ser principiante y busca prevenir lesiones".
3. **Generación de Ideas de Contenido**: En la misma vista, la sección 'Sugerencias de Contenido IA' le propone tres ideas:
* **Reel**: "Tu rutina de 5 minutos de movilidad antes de entrenar calistenia".
* **Carrusel**: "3 ejercicios para proteger tus muñecas en la calistenia".
* **Artículo de Blog**: "La guía definitiva de movilidad para principiantes de la calistenia".
4. **Acción Inmediata**: A Ana le encanta la idea del carrusel. Hace clic en el botón 'Guardar en Content Planner'. La idea se añade automáticamente a su calendario de contenido dentro de TrainerERP, creando una tarea para diseñar y programar la publicación.
5. **Análisis de la Competencia**: Ana luego navega a la pestaña 'Competidores'. Ya tiene agregado a 'CarlosFit', otro entrenador de calistenia popular. El dashboard le muestra que el post más exitoso de Carlos en el último mes fue un tutorial sobre la progresión para el 'muscle-up'. El sistema le da un insight: "Carlos se enfoca en movimientos avanzados. Existe una oportunidad en contenido para principiantes absolutos, como la movilidad". Esto reafirma la decisión de Ana de centrarse en ese tema.
6. **Configuración de Alertas**: Finalmente, para no perderse nada, Ana va a la sección 'Alertas' y crea una nueva alerta con la palabra clave "calistenia para mujeres". La próxima vez que el sistema detecte un aumento significativo de contenido o interés sobre este tema, Ana recibirá una notificación por correo electrónico.
## Riesgos operativos y edge cases
- **Calidad de los Datos**: La fiabilidad de la herramienta depende enteramente de la calidad y frescura de los datos. Si las APIs externas (Instagram, Google Trends) fallan o cambian, el servicio puede degradarse o dar información obsoleta.
- **Sobrecarga de Información**: Presentar demasiadas tendencias o datos sin una clara jerarquía puede abrumar al usuario. La UI/UX debe ser impecable para guiar al entrenador hacia los insights más relevantes.
- **Relevancia del Nicho**: Un entrenador especializado en powerlifting para mayores de 50 no está interesado en tendencias de baile de TikTok. El algoritmo debe ser lo suficientemente inteligente para filtrar y personalizar las tendencias según el perfil y los clientes del entrenador.
- **Falsos Positivos**: El sistema podría identificar un pico de conversación sobre 'batidos' que en realidad se refiere a un producto de cocina y no a nutrición deportiva. Se requiere un robusto procesamiento de lenguaje natural (NLP) contextualizado al fitness.
- **Limitaciones de API y Costes**: La monitorización constante puede ser costosa y estar sujeta a los límites de tasa de las plataformas. Una estrategia de sondeo inteligente es necesaria para balancear coste y actualidad de los datos.
## KPIs y qué significan
- **Puntuación de Velocidad de Tendencia (Trend Velocity Score)**: Un valor de 0 a 100 que mide la aceleración en la popularidad de un tema. Un score alto (ej. 90) indica una tendencia emergente y explosiva, ideal para 'early adopters'. Un score medio (ej. 50) representa una tendencia estable y popular.
- **Volumen de Menciones/Búsquedas**: El número bruto de veces que se ha mencionado un tema en un período (ej. últimas 24h). Ayuda a comprender la escala de la conversación.
- **Nivel de Saturación del Contenido**: Una métrica cualitativa (Bajo, Medio, Alto) que estima cuántos creadores ya están publicando sobre este tema. Una tendencia con 'Alta Velocidad' y 'Baja Saturación' es una oportunidad de oro.
- **Índice de Relevancia para el Nicho**: Una puntuación personalizada que cruza los datos de la tendencia con la información del perfil del entrenador (especialidades, tipo de cliente). Ayuda a responder "¿Esto es para mí?".
- **Potencial de Alcance Orgánico Estimado**: Una proyección basada en el volumen, la competencia de hashtags y la plataforma, que indica si el contenido sobre este tema tiene probabilidades de ser descubierto por nuevas audiencias.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Fuentes de Datos Externas] -->|Instagram, TikTok, Google Trends, Blogs| B(Agregador de Datos);
B --> C{Procesamiento y Limpieza};
C --> D[Motor de Análisis NLP y de Sentimiento];
D --> E[Algoritmo de Detección y Puntuación de Tendencias];
E --> F[Base de Datos de Tendencias];
F --> G[API de TrainerERP (/api/intelligence/trends)];
G --> H[Frontend: TrendAnalyzerDashboard];
F --> I[Motor de Sugerencias IA];
I --> J[API de TrainerERP (/api/intelligence/content-suggestions)];
J --> H;
