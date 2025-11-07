# Constructor de Funnels & Landing Pages

**Página padre:** Hola

---

# Constructor de Funnels & Landing Pages
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado, Administrador del Sistema
Principalmente para el 'Entrenador Personal (Administrador)' y 'Entrenador Asociado', quienes utilizarán esta herramienta para diseñar y lanzar campañas de marketing. El 'Administrador del Sistema' puede tener acceso para supervisar el uso, gestionar plantillas globales o solucionar problemas técnicos.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/funnels
## Descripción Funcional
El 'Constructor de Funnels & Landing Pages' es una herramienta visual e intuitiva integrada en TrainerERP, diseñada para que los entrenadores personales puedan crear, sin necesidad de conocimientos técnicos, páginas de aterrizaje y embudos de conversión altamente efectivos. El objetivo principal es transformar el tráfico web (de redes sociales, publicidad, email) en leads cualificados y, finalmente, en clientes de pago. A diferencia de constructores genéricos, esta herramienta está preconfigurada con plantillas y componentes específicos para el nicho del fitness: plantillas para 'Retos de 21 días', 'Programas de Pérdida de Grasa', 'Consultas Gratuitas de Valoración', 'Descarga de Guía de Nutrición', etc. El entrenador puede arrastrar y soltar elementos como bloques de texto, imágenes de antes y después, videos testimoniales, contadores de cuenta regresiva para ofertas, y formularios de captura. Estos formularios se integran nativamente con el CRM de TrainerERP, etiquetando automáticamente a los nuevos leads y pudiendo iniciar secuencias de email marketing. Además, la herramienta incluye funcionalidades avanzadas como la creación de funnels multi-paso (ej. Landing Page -> Página de Gracias con oferta -> Página de Checkout) y la capacidad de realizar tests A/B para optimizar titulares, imágenes u ofertas y maximizar la tasa de conversión.
## Valor de Negocio
El valor de negocio de esta funcionalidad es inmenso y directo, ya que ataca el principal desafío de cualquier entrenador personal: la captación constante y predecible de nuevos clientes. Al proporcionar una herramienta de creación de landing pages y funnels, TrainerERP deja de ser solo un sistema de gestión (un coste operativo) para convertirse en un motor de crecimiento activo (una inversión que genera ingresos). Permite a los entrenadores profesionalizar su marketing digital, compitiendo con estudios más grandes. Automatiza el proceso de captación de leads, liberando tiempo que el entrenador puede dedicar a lo que mejor sabe hacer: entrenar a sus clientes. Al integrar los formularios con el CRM y las automatizaciones, se crea un sistema cohesionado que nutre al lead desde el primer contacto hasta la venta, mejorando las tasas de conversión y el ROI de las campañas publicitarias. La capacidad de realizar A/B testing empodera al entrenador para tomar decisiones de marketing basadas en datos, no en suposiciones, optimizando continuamente su embudo y reduciendo el coste de adquisición de clientes (CAC) a largo plazo.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero poder elegir entre plantillas prediseñadas para 'retos de fitness' o 'consultas gratuitas' para lanzar una nueva landing page en menos de 15 minutos.
- Como coach online, quiero crear un embudo de ventas de dos pasos: una primera página para capturar el email a cambio de un ebook de recetas, y una segunda página (página de gracias) donde ofrezco un paquete de iniciación con descuento.
- Como dueño de un estudio, quiero realizar un test A/B en mi landing page principal para probar dos ofertas diferentes ('Primera sesión gratis' vs '20% de descuento en el primer mes') y ver cuál genera más leads cualificados.
- Como entrenador que usa Instagram, quiero crear una landing page optimizada para móviles que pueda poner en mi bio, donde los visitantes puedan ver mis transformaciones de clientes y agendar una llamada directamente desde mi calendario integrado.
- Como entrenador, quiero que cada vez que alguien rellene el formulario de mi landing page de 'ganancia muscular', se añada automáticamente a mi lista de correo con la etiqueta 'interesado-musculo' y reciba una secuencia de emails personalizada.
- Como entrenador, quiero poder ver estadísticas claras y sencillas para cada landing page: cuántas personas la han visitado, cuántas han rellenado el formulario y cuál es la tasa de conversión, para saber si mis campañas están funcionando.
## Acciones Clave
- Crear un nuevo funnel desde una plantilla o desde cero.
- Editar una landing page usando un editor visual de arrastrar y soltar (drag-and-drop).
- Añadir y configurar componentes específicos del nicho (ej: comparador de imágenes 'antes y después', carrusel de testimonios, formulario de evaluación física).
- Configurar los ajustes de SEO (título, descripción) y la URL (slug) de la página.
- Publicar la landing page en un subdominio de TrainerERP o en un dominio personalizado.
- Crear y gestionar un test A/B para una página, definiendo el tráfico para cada variante.
- Visualizar el dashboard de analíticas de un funnel o landing page específica.
## 🧩 Componentes React Sugeridos
### 1. FunnelBuilderContainer
Tipo: container | Componente principal que orquesta todo el constructor. Maneja el estado del funnel activo, carga los datos, gestiona el guardado automático, y provee el contexto a los componentes hijos.
Props:
- funnelId: 
- string | null (requerido) - ID del funnel a editar. Si es null, se crea uno nuevo.
Estados: activeFunnelData, isSaving, currentPageIndex, viewMode ('desktop' | 'mobile')
Dependencias: react-dnd, zustand (o Redux/Context)
Ejemplo de uso:
```typescript
<FunnelBuilderContainer funnelId='fun_123xyz' />
```

### 2. LandingPageCanvas
Tipo: presentational | Representa el área visual donde el entrenador arrastra y suelta los componentes para construir su página. Renderiza los componentes de la página basándose en un objeto de configuración JSON.
Props:
- pageData: 
- object (requerido) - Objeto JSON que describe la estructura y contenido de la página.
- onComponentDrop: 
- (component: Component, position: number) => void (requerido) - Callback que se ejecuta cuando un nuevo componente es soltado en el canvas.
- onComponentSelect: 
- (componentId: string) => void (requerido) - Callback para seleccionar un componente y mostrar sus opciones de edición.
Estados: selectedComponentId
Dependencias: react-dnd-html5-backend, styled-components
Ejemplo de uso:
```typescript
<LandingPageCanvas pageData={activePage} onComponentDrop={handleDrop} onComponentSelect={handleSelect} />
```

### 3. ComponentSettingsPanel
Tipo: presentational | Un panel lateral que muestra los campos de configuración para el componente actualmente seleccionado en el canvas (ej: cambiar texto, subir imagen, configurar campos de un formulario).
Props:
- component: 
- object | null (requerido) - El objeto del componente seleccionado, con sus propiedades actuales.
- onUpdate: 
- (componentId: string, newProps: object) => void (requerido) - Función que se llama para actualizar las propiedades del componente.
Estados: formState (con los valores de los inputs de configuración)
Dependencias: formik
Ejemplo de uso:
```typescript
<ComponentSettingsPanel component={selectedComponent} onUpdate={updateComponentProps} />
```

### 4. useFunnelAnalytics
Tipo: hook | Un hook personalizado para obtener y gestionar los datos de analíticas de un funnel específico, manejando el estado de carga y los errores.
Props:
- funnelId: 
- string (requerido) - El ID del funnel del cual se quieren obtener las analíticas.
- dateRange: 
- { startDate: Date, endDate: Date } (requerido) - El rango de fechas para la consulta de datos.
Estados: data, isLoading, error
Dependencias: swr, axios
Ejemplo de uso:
```typescript
const { data, isLoading } = useFunnelAnalytics({ funnelId: 'fun_123xyz', dateRange });
```
## 🔌 APIs Requeridas
### 1. POST /api/v1/funnels
Crea un nuevo embudo de conversión para el entrenador autenticado, a partir de una plantilla o en blanco.
Parámetros:
- name (
- string, body, requerido): Nombre del embudo para identificación interna.
- templateId (
- string, body, opcional): ID opcional de una plantilla para iniciar el funnel.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto del funnel recién creado, incluyendo el ID.
```json
{
  "funnelId": "fun_abc123",
  "name": "Reto Verano 2024",
  "trainerId": "trn_xyz789",
  "createdAt": "2023-10-27T10:00:00Z",
  "steps": [
    {
      "pageId": "page_def456",
      "name": "Página de Captura",
      "order": 0
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - El nombre del funnel está vacío o el templateId no es válido.
- 402: 
- Payment Required - El plan del entrenador no incluye la creación de funnels o ha alcanzado el límite.

### 2. PUT /api/v1/funnels/{funnelId}/pages/{pageId}
Actualiza el contenido y la configuración de una landing page específica dentro de un funnel.
Parámetros:
- funnelId (
- string, path, requerido): ID del funnel al que pertenece la página.
- pageId (
- string, path, requerido): ID de la página a actualizar.
- pageData (
- object, body, requerido): Objeto que contiene las propiedades a actualizar, como 'name', 'slug' o 'jsonContent'.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto de la página actualizado.
```json
{
  "pageId": "page_def456",
  "name": "Página de Captura Optimizada",
  "slug": "reto-verano-2024",
  "status": "draft",
  "updatedAt": "2023-10-27T11:30:00Z",
  "jsonContent": {
    "components": []
  }
}
```
Autenticación: Requerida
Errores posibles:
- 403: 
- Forbidden - El entrenador no tiene permisos para editar este funnel.
- 404: 
- Not Found - El funnelId o pageId no existen.
- 409: 
- Conflict - El slug 'reto-verano-2024' ya está en uso por otra página del mismo entrenador.

### 3. GET /api/v1/funnels/{funnelId}/analytics
Obtiene las estadísticas de rendimiento de un funnel completo en un rango de fechas.
Parámetros:
- funnelId (
- string, path, requerido): ID del funnel a analizar.
- startDate (
- date, query, requerido): Fecha de inicio del reporte (formato YYYY-MM-DD).
- endDate (
- date, query, requerido): Fecha de fin del reporte (formato YYYY-MM-DD).
Respuesta:
Tipo: object
Estructura: Devuelve un objeto con KPIs agregados para el funnel y un desglose por cada paso (página).
```json
{
  "funnelId": "fun_abc123",
  "range": {
    "start": "2023-10-01",
    "end": "2023-10-27"
  },
  "summary": {
    "totalVisitors": 1520,
    "totalLeads": 180,
    "conversionRate": 11.84
  },
  "steps": [
    {
      "pageId": "page_def456",
      "name": "Página de Captura",
      "visitors": 1520,
      "leads": 180,
      "conversionRate": 11.84
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Las fechas proporcionadas son inválidas.
- 404: 
- Not Found - El funnelId no existe.
## Notas Técnicas
Colecciones backend: funnels, landingPages, pageTemplates, formSubmissions, abTests, funnelAnalytics
KPIs visibles: Tasa de Conversión (Leads / Visitantes), Número Total de Visitantes Únicos, Número Total de Leads Generados, Fuentes de Tráfico Principales (si se usan UTMs), Tasa de Conversión por Variante (en Test A/B), Coste por Adquisición de Lead (CPL) (si se integra con el módulo de publicidad)
## Documentación Completa
## Resumen
El módulo 'Constructor de Funnels & Landing Pages' es una de las herramientas más estratégicas dentro de TrainerERP para el área de **CAPTURA & CONVERSIÓN**. Su propósito es empoderar a los entrenadores personales, independientemente de su nivel técnico, para que puedan crear sus propias máquinas de adquisición de clientes. Este sistema permite el diseño, publicación y análisis de páginas de aterrizaje y embudos de conversión optimizados para el sector del fitness.
A través de una interfaz visual de arrastrar y soltar, los entrenadores pueden construir páginas para promocionar sus servicios, programas específicos, retos, o para capturar leads a través de 'lead magnets' como guías de nutrición gratuitas. La integración nativa con el resto de TrainerERP (CRM, Calendario, Email Marketing, Pagos) es su principal ventaja competitiva frente a herramientas externas. Un lead capturado en una landing page entra automáticamente en el ecosistema de gestión del entrenador, permitiendo una nutrición y seguimiento fluidos, lo que maximiza las posibilidades de conversión final. Esta funcionalidad transforma a TrainerERP de una simple herramienta de gestión a un socio de crecimiento para el negocio del entrenador.
## Flujo paso a paso de uso real
Imaginemos a **Carlos, un entrenador personal especializado en entrenamiento funcional online**.
1. **Objetivo:** Carlos quiere lanzar un nuevo programa grupal online de 4 semanas llamado "Functional Forte". Necesita captar al menos 20 inscripciones.
2. **Acceso:** Carlos inicia sesión en TrainerERP y navega a `Marketing > Funnels & Landing Pages`.
3. **Creación:** Hace clic en "Crear Nuevo Funnel". El sistema le pregunta si quiere empezar desde cero o usar una plantilla. Carlos elige la plantilla "Lanzamiento de Programa Online".
4. **Personalización (Paso 1 - Landing Page):** Se abre el editor visual con la plantilla precargada.
* Cambia el titular a "Transforma tu cuerpo en 4 semanas con Functional Forte".
* Sube un video corto de él explicando los beneficios del programa.
* Actualiza la sección de "¿Qué incluye?" con los detalles de su programa.
* Arrastra un componente de "Testimonios" y selecciona tres de sus mejores clientes desde el CRM de TrainerERP.
* El botón de llamada a la acción (CTA) principal dice "¡Quiero Unirme Ahora!".
5. **Configuración del Formulario:** El formulario de la plantilla pide nombre y email. Carlos lo mantiene así. En la configuración del formulario, selecciona la acción "Al enviar, añadir a la lista 'Interesados Functional Forte' y enviar secuencia de email 'Bienvenida Programa'".
6. **Página de Agradecimiento (Paso 2):** Carlos navega al segundo paso del funnel, la página de agradecimiento. La personaliza con un mensaje de confirmación y un video diciendo: "¡Genial! Revisa tu email para los siguientes pasos. ¡Prepárate para el cambio!".
7. **Publicación:** Una vez satisfecho, hace clic en "Publicar". Configura la URL como `carlosfit.trainererp.com/functional-forte`.
8. **Promoción:** Carlos copia el enlace y lo comparte en su biografía de Instagram, en sus historias, y envía un email a su lista de contactos existente.
9. **Análisis:** Durante los siguientes días, Carlos vuelve a la sección de Funnels y abre el dashboard de analíticas de "Functional Forte". Ve que 250 personas han visitado la página y 30 se han registrado, dándole una tasa de conversión del 12%. Puede ver quiénes son esos 30 leads directamente en su CRM.
## Riesgos operativos y edge cases
- **Rendimiento de las páginas:** Si las páginas publicadas son lentas, afectará negativamente al SEO y a la tasa de conversión. Es crucial implementar un sistema de renderizado estático y distribución a través de una CDN (Content Delivery Network).
- **Abuso y Spam:** Los formularios públicos son un objetivo para bots. La implementación de Google reCAPTCHA v3 o un honeypot es indispensable para mantener la calidad de los leads.
- **Complejidad del editor:** Un editor demasiado complejo puede frustrar a los usuarios no técnicos. Debe haber un equilibrio entre potencia y simplicidad, quizás con un modo 'sencillo' y 'avanzado'.
- **Gestión de Dominios Personalizados:** La configuración de DNS es un punto de fricción común. Se debe proporcionar documentación muy clara, tutoriales en video y un sistema de validación de registros DNS para ayudar al usuario. El soporte técnico debe estar preparado para este tipo de consultas.
- **Consistencia de Marca:** Si se permite demasiada personalización sin guía, los entrenadores pueden crear páginas que no se alinean con su marca. Ofrecer 'Kits de Marca' (paletas de colores, tipografías) preconfigurables podría mitigar esto.
## KPIs y qué significan
- **Tasa de Conversión (Leads / Visitantes):** El KPI más importante. Indica la efectividad de la página y la oferta. Para un entrenador, una tasa del 5% podría ser buena, mientras que un 15% sería excelente. Les dice si su mensaje está resonando con la audiencia correcta.
- **Número de Leads Generados:** La métrica de volumen. Muestra cuántos clientes potenciales ha generado la campaña. Es el resultado directo que justifica el esfuerzo de marketing.
- **Visitas Totales:** Indica el alcance de la campaña. Ayuda al entrenador a entender cuánto tráfico están generando sus esfuerzos de promoción (redes sociales, anuncios, etc.).
- **Tasa de Conversión por Variante (Test A/B):** En un test A/B, este KPI es crucial. Le dice al entrenador de forma objetiva qué versión de su página (qué titular, qué imagen, qué oferta) funciona mejor para convertir visitantes en leads. Permite la optimización basada en datos.
- **Coste por Lead (CPL):** Si el entrenador está invirtiendo en publicidad, este KPI (calculado como `Inversión Total en Anuncios / Número de Leads Generados`) es vital. Le dice cuánto le cuesta adquirir un cliente potencial, permitiéndole evaluar la rentabilidad de sus campañas.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD
A[Acceso al Módulo de Funnels] --> B{¿Crear Nuevo o Editar?};
B -->|Crear Nuevo| C[Seleccionar Plantilla o Empezar en Blanco];
C --> D[Editor Visual: Personalizar Página 1 (Captura)];
D --> E{¿Añadir más pasos?};
E -->|Sí| F[Añadir Nueva Página (Ej: Gracias, Venta)];
F --> D;
E -->|No| G[Configurar Acciones del Formulario];
G --> H[Configurar SEO y URL];
H --> I[Publicar Funnel];
I --> J[Compartir Enlace en Canales de Marketing];
J --> K[Monitorizar Analíticas];
B -->|Editar Existente| L[Seleccionar Funnel de la Lista];
L --> D;
