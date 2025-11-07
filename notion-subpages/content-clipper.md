# Content Clipper

**Página padre:** Hola

---

# Content Clipper
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta herramienta está diseñada para los creadores de contenido del negocio. El 'Entrenador Personal (Administrador)' tiene una vista completa de todo el contenido capturado por él y sus asociados, pudiendo gestionar categorías y tags a nivel global. El 'Entrenador Asociado' puede capturar y organizar su propio contenido, y acceder a colecciones compartidas por el administrador para mantener la consistencia de la marca.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/content/clipper
## Descripción Funcional
El 'Content Clipper' es un centro de inspiración y recursos digitales, diseñado específicamente para el entrenador personal moderno. Funciona como un repositorio inteligente donde los entrenadores pueden capturar, guardar y organizar cualquier contenido valioso que encuentren en internet. Ya sea un estudio científico innovador sobre hipertrofia, un video de YouTube demostrando la técnica perfecta de un peso muerto, una infografía sobre macronutrientes, o un post motivacional de otro referente del sector, todo puede ser guardado con un solo clic. Más allá de un simple gestor de marcadores, esta herramienta extrae metadatos clave como el título, la descripción y una imagen de vista previa, permitiendo al entrenador añadir notas personales, asignar categorías personalizadas (como 'Nutrición', 'Ejercicios para Espalda', 'Ideas para Reels', 'Estrategias de Negocio') y múltiples etiquetas para una búsqueda ultra-rápida. El objetivo es combatir el bloqueo del creador y optimizar el tiempo de planificación de contenido. En lugar de buscar ideas desde cero cada semana, el entrenador acude a su propia biblioteca curada de contenido de alta calidad, listo para ser adaptado y transformado en posts para redes sociales, artículos de blog, newsletters o guías para clientes. Se integra directamente con el planificador de redes sociales y el creador de campañas de email de TrainerERP, haciendo que el paso de la inspiración a la publicación sea fluido y eficiente.
## Valor de Negocio
El valor principal del 'Content Clipper' reside en la optimización del recurso más valioso de un entrenador: el tiempo. Reduce drásticamente las horas dedicadas a la investigación y la ideación de contenido, permitiéndoles enfocarse en entrenar a sus clientes y hacer crecer su negocio. Al centralizar la inspiración, asegura una mayor consistencia y calidad en la comunicación de marketing, un factor clave para la captación y retención de clientes. Permite al entrenador posicionarse como una autoridad en su nicho, al facilitar la referencia a fuentes fiables y estudios actualizados, aumentando la confianza de su audiencia. Para los estudios con varios entrenadores, esta herramienta es fundamental para alinear la estrategia de contenido, creando bibliotecas compartidas de recursos aprobados que garantizan un mensaje de marca cohesivo. En última instancia, un flujo de contenido constante y de alta calidad alimenta los embudos de venta, nutre a los leads y mantiene a la comunidad de clientes comprometida, lo que se traduce directamente en un menor abandono y un mayor valor de vida del cliente (LTV). Es una inversión en la eficiencia del marketing que genera retornos medibles en crecimiento y autoridad de marca.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal independiente, quiero guardar rápidamente un artículo sobre los beneficios del sueño en la recuperación muscular para poder crear un carrusel informativo en Instagram la próxima semana.
- Como coach online, quiero capturar videos de ejercicios de movilidad de diferentes creadores en una colección llamada 'Calentamientos' para tener una fuente de inspiración visual para mis propios videos.
- Como administrador de un estudio de fitness, quiero crear una categoría de contenido llamada 'Ciencia Aprobada' y compartirla con mis entrenadores para que todos usen fuentes verificadas al comunicarse con los clientes.
- Como entrenador especializado en nutrición, quiero etiquetar artículos con tags como '#vegano', '#keto', '#ayunointermitente' para poder encontrar rápidamente información específica cuando un cliente me hace una pregunta.
- Como entrenador que busca hacer crecer su negocio, quiero guardar posts de otros entrenadores exitosos en una categoría de 'Análisis Competitivo' para estudiar sus estrategias de marketing y comunicación.
## Acciones Clave
- Capturar contenido desde una URL, extrayendo automáticamente título, descripción e imagen.
- Editar los metadatos de un contenido capturado y añadir notas personales contextuales.
- Crear, asignar y gestionar categorías personalizadas (ej: 'Nutrición', 'Mindset', 'Marketing').
- Añadir y eliminar múltiples etiquetas a cada contenido para una organización granular.
- Buscar en la biblioteca por palabra clave, y filtrar por categoría, etiqueta o tipo de contenido (artículo, video).
- Visualizar una vista previa del contenido en una tarjeta interactiva sin salir de TrainerERP.
## 🧩 Componentes React Sugeridos
### 1. ContentClipperDashboard
Tipo: container | Componente principal que orquesta la página. Gestiona el estado de los filtros, la búsqueda y la paginación. Llama al hook `useContentLibrary` para obtener y manipular los datos.
Estados: filters: { category: string, tags: string[], search: string }, pagination: { currentPage: number, totalPages: number }, isModalOpen: boolean
Dependencias: useContentLibrary
Ejemplo de uso:
```typescript
<ContentClipperDashboard />
```

### 2. ClippedContentCard
Tipo: presentational | Muestra una tarjeta individual para un contenido guardado. Muestra la imagen, título, fuente, etiquetas y botones de acción (Editar, Eliminar). No tiene lógica de negocio.
Props:
- clip: 
- { id: string; title: string; thumbnailUrl: string; source: string; tags: string[]; } (requerido) - Objeto con la información del contenido a mostrar.
- onEdit: 
- (id: string) => void (requerido) - Callback que se ejecuta al hacer clic en el botón de editar.
- onDelete: 
- (id: string) => void (requerido) - Callback que se ejecuta al hacer clic en el botón de eliminar.
Dependencias: TailwindCSS, Lucide-React (for icons)
Ejemplo de uso:
```typescript
<ClippedContentCard clip={someClipData} onEdit={handleEdit} onDelete={handleDelete} />
```

### 3. AddContentModal
Tipo: container | Un modal para agregar nuevo contenido pegando una URL. Incluye un campo de entrada para la URL, un botón para 'scrapear' los datos y un formulario para editar los metadatos obtenidos y agregar notas/tags antes de guardar.
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- onContentAdded: 
- () => void (requerido) - Callback para refrescar la lista de contenidos después de agregar uno nuevo.
Estados: url: string, isLoading: boolean, scrapedData: { title: string, description: string, imageUrl: string } | null, formData: { title: string, notes: string, categoryId: string, tags: string[] }
Dependencias: axios, react-hook-form
Ejemplo de uso:
```typescript
<AddContentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onContentAdded={refreshContent} />
```

### 4. useContentLibrary
Tipo: hook | Hook personalizado que encapsula toda la lógica de comunicación con la API para el contenido guardado. Maneja estados de carga, errores y los datos en sí. Provee funciones para leer, crear, actualizar y eliminar clips.
Props:
- initialFilters: 
- { category?: string, tags?: string[], search?: string } (opcional) - Filtros iniciales para la carga de datos.
Estados: clips: Clip[], isLoading: boolean, error: Error | null
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { clips, isLoading, addClip } = useContentLibrary({ initialFilters: { category: 'nutrition' } });
```
## 🔌 APIs Requeridas
### 1. POST /api/content/clips
Crea un nuevo elemento de contenido guardado a partir de una URL. El backend se encarga de hacer el scraping de los metadatos.
Parámetros:
- url (
- string, body, requerido): La URL del contenido a guardar.
- categoryId (
- string, body, opcional): ID de la categoría inicial (opcional).
Respuesta:
Tipo: object
Estructura: Devuelve el objeto del contenido recién creado, incluyendo los metadatos scrapeados.
```json
{
  "id": "clip_12345",
  "userId": "user_abcde",
  "title": "Los 5 mejores ejercicios para un core de acero",
  "originalUrl": "https://www.fitproblog.com/core-exercises",
  "thumbnailUrl": "https://cdn.fitproblog.com/images/core.jpg",
  "scrapedDescription": "Descubre los ejercicios que realmente fortalecen tu abdomen y mejoran tu postura.",
  "personalNotes": null,
  "createdAt": "2023-10-27T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - La URL proporcionada no es válida o está vacía.
- 422: 
- Unprocessable Entity - No se pudo hacer scraping de la URL (sitio caído, bloqueado, etc.).

### 2. GET /api/content/clips
Obtiene una lista paginada y filtrada del contenido guardado por el usuario.
Parámetros:
- q (
- string, query, opcional): Término de búsqueda para buscar en título, descripción y notas.
- categoryId (
- string, query, opcional): Filtra por el ID de una categoría específica.
- tags (
- string, query, opcional): Lista de IDs de tags separados por coma para filtrar.
- page (
- number, query, opcional): Número de página para la paginación.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene la lista de clips y la información de paginación.
```json
{
  "data": [
    {
      "id": "clip_12345",
      "title": "Los 5 mejores ejercicios para un core de acero",
      "thumbnailUrl": "https://cdn.fitproblog.com/images/core.jpg",
      "source": "fitproblog.com",
      "tags": [
        "core",
        "abs"
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48
  }
}
```
Autenticación: Requerida

### 3. PUT /api/content/clips/{clipId}
Actualiza un elemento de contenido guardado (título, notas, categoría, tags).
Parámetros:
- clipId (
- string, path, requerido): ID del contenido a actualizar.
- title (
- string, body, opcional): Nuevo título para el contenido.
- personalNotes (
- string, body, opcional): Nuevas notas personales.
- tagIds (
- string[], body, opcional): Array completo de IDs de los tags asociados.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto del contenido actualizado.
```json
{
  "id": "clip_12345",
  "title": "Mis 5 ejercicios favoritos para un core de acero",
  "personalNotes": "Excelente para un post sobre 'entrenamiento funcional'",
  "tags": [
    "core",
    "abs",
    "funcional"
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El clip con el ID especificado no existe o no pertenece al usuario.
- 403: 
- Forbidden - El usuario no tiene permisos para modificar este recurso.

### 4. DELETE /api/content/clips/{clipId}
Elimina permanentemente un elemento de contenido guardado.
Parámetros:
- clipId (
- string, path, requerido): ID del contenido a eliminar.
Respuesta:
Tipo: object
Estructura: Respuesta vacía con estado 204 No Content en caso de éxito.
```json
{}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El clip con el ID especificado no existe o no pertenece al usuario.
- 403: 
- Forbidden - El usuario no tiene permisos para eliminar este recurso.
## Notas Técnicas
Colecciones backend: users, clipped_content, categories, tags, clipped_content_tags
KPIs visibles: Número total de contenidos guardados, Distribución de contenidos por categoría (Gráfico de Torta), Nube de tags más utilizados, Actividad reciente: Número de clips añadidos en los últimos 30 días, Contenidos más antiguos sin revisar (para fomentar la limpieza), Distribución por tipo de contenido (Artículo, Video, Imagen)
## Documentación Completa
## Resumen
El **Content Clipper** es una herramienta estratégica dentro del área de **CONTENIDO & REDES SOCIALES** de TrainerERP. Su propósito fundamental es resolver uno de los mayores desafíos para los entrenadores personales: la generación constante de contenido de valor para su audiencia. En lugar de un proceso de ideación desestructurado y dependiente de la inspiración del momento, el Content Clipper proporciona un sistema para construir proactivamente una biblioteca personal de recursos, ideas y referencias de alta calidad.
Esta funcionalidad transforma la forma en que los entrenadores interactúan con la información en línea. Cada artículo de T-Nation, video de Athlean-X o estudio de PubMed se convierte en un activo potencial para su marketing. Al permitir una captura y organización sencillas, se reduce la fricción para guardar ideas, fomentando un hábito de curación de contenido. El verdadero poder no está solo en guardar, sino en la capacidad de contextualizar con notas personales, organizar con un sistema de taxonomía flexible (categorías y etiquetas) y, lo más importante, encontrar y reutilizar la información de manera eficiente cuando llega el momento de planificar y crear.
El Content Clipper está diseñado para ser el puente entre el consumo de información y la creación de contenido, posicionando a los usuarios de TrainerERP como expertos informados y consistentes en su comunicación, un pilar fundamental para el crecimiento sostenible de su negocio de entrenamiento.
## Flujo paso a paso de uso real
Imaginemos a **Laura, una entrenadora online especializada en mujeres postparto.**
1. **Captura:** Mientras navega en su portátil, Laura encuentra un estudio científico reciente en una revista de medicina deportiva sobre la 'diástasis de rectos' y su recuperación. Considera que es oro puro para su audiencia. Abre la extensión de navegador de TrainerERP, hace clic en 'Capturar', y la herramienta automáticamente guarda la URL.
2. **Organización y Contextualización:** Más tarde, dentro de su dashboard de TrainerERP, va a la sección 'Content Clipper'. Ve el nuevo elemento. El sistema ya ha extraído el título del estudio, un resumen (el abstract) y una imagen genérica. Laura edita el título a algo más amigable: "Estudio Clave sobre Recuperación de Diástasis".
3. Añade sus **notas personales**: *"Punto clave: los ejercicios hipopresivos demuestran una eficacia del 80%. Puedo crear un Reel de 30 segundos mostrando una versión segura de un hipopresivo. También es ideal para un email a mi segmento de 'Nuevas Madres' para demostrar mi conocimiento basado en evidencia."*
4. Asigna la categoría predefinida **'Salud Femenina'** y añade las etiquetas **#postparto**, **#diastasisrecti**, **#ciencia**, **#recuperacion**.
5. **Reutilización:** Dos semanas después, Laura está planificando su contenido. Siente un bloqueo creativo. Va al Content Clipper y filtra por la etiqueta `#postparto`. Inmediatamente aparece el estudio guardado junto con otros artículos y videos.
6. Lee sus notas y la inspiración vuelve. Graba el Reel que había planeado, redacta el correo electrónico citando el estudio (lo que aumenta su autoridad) y programa ambas piezas de contenido utilizando las herramientas de programación de TrainerERP. El Content Clipper ha convertido 2 minutos de captura en una hora de creación de contenido altamente efectivo.
## Riesgos operativos y edge cases
* **Calidad del Scraping:** La dependencia de metadatos (Open Graph tags) es un riesgo. Sitios sin estos tags o con implementaciones incorrectas pueden resultar en clips sin título, descripción o imagen. Se debe implementar un sistema de fallback (ej: usar el `<title>` de la página) y permitir la edición manual completa.
* **Contenido Dinámico y SPAs:** Las aplicaciones de una sola página (SPAs) pueden ser difíciles de scrapear desde el backend. La solución podría ser que la extensión del navegador extraiga el DOM renderizado y envíe esa información a la API, en lugar de que el servidor solo vea la URL.
* **Copyright y Fair Use:** Es crucial educar al usuario. La herramienta es para inspiración y referencia personal. La documentación y los tooltips deben advertir contra la republicación directa de contenido sin permiso. El almacenamiento de thumbnails se considera generalmente 'fair use', pero debe ser evaluado legalmente.
* **Mantenimiento de URLs:** Las URLs pueden dejar de funcionar con el tiempo ('link rot'). Se podría implementar un verificador de enlaces periódico que marque los clips con enlaces rotos para que el usuario pueda revisarlos o eliminarlos.
* **Gestión de duplicados:** Si un usuario intenta guardar la misma URL dos veces, el sistema debería detectarlo y preguntar si desea abrir el clip existente en lugar de crear uno nuevo.
## KPIs y qué significan
* **Tasa de Adopción (Adoption Rate):** (Usuarios activos del Clipper / Usuarios activos totales de TrainerERP) * 100. **Significado:** Mide el atractivo y la utilidad inicial de la función. Un % bajo indica que la función no es descubierta o no se percibe como valiosa.
* **Profundidad de Engagement (Clips per Active User):** Promedio de clips guardados al mes por cada usuario activo del Clipper. **Significado:** Indica si la herramienta se está convirtiendo en un hábito. Un número creciente sugiere que los usuarios encuentran valor continuo en ella.
* **Tasa de Organización (Organized vs. Unorganized Clips):** Porcentaje de clips que tienen al menos una categoría o etiqueta asignada. **Significado:** Un % alto demuestra que los usuarios valoran las funciones de organización, validando esa parte del desarrollo. Si es bajo, la UI/UX de organización podría ser confusa.
* **Ratio de Búsqueda/Filtro por Sesión:** Promedio de veces que se utiliza la función de búsqueda o filtro por cada sesión en la página del Clipper. **Significado:** Mide si los usuarios están recuperando activamente la información guardada. Un ratio bajo podría significar que los usuarios guardan pero no reutilizan, lo cual devalúa la herramienta.
* **Tasa de Conversión a Contenido (Feature Deseada):** Si se integra con el planificador, (Contenidos creados desde un clip / Total de contenidos creados) * 100. **Significado:** Este es el KPI definitivo del éxito. Mide directamente cómo el Content Clipper está impactando el objetivo final: la creación de contenido. Demuestra un ROI claro de la funcionalidad.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Usuario encuentra contenido en la web] --> B{Usa la Extensión del Navegador o la App};
B --> C[Introduce/Confirma URL en TrainerERP];
C --> D{API POST /api/content/clips};
D --> E[Backend intenta scrapear metadatos: Título, Desc, Imagen];
E --> F{¿Scraping exitoso?};
F -- Sí --> G[Crea registro en BBDD con metadatos];
F -- No --> H[Crea registro en BBDD solo con URL];
G --> I[Responde al Frontend con datos completos];
H --> I;
I --> J[Usuario ve el nuevo clip en su dashboard];
J --> K[Usuario edita, añade notas, categorías y tags];
K --> L{API PUT /api/content/clips/{id}};
L --> M[Contenido guardado y organizado];
