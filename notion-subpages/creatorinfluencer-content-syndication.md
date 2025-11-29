# Creator/Influencer Content Syndication

**Página padre:** Hola

---

# Creator/Influencer Content Syndication
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada para los entrenadores que actúan como administradores de su negocio. Les permite gestionar de forma proactiva sus estrategias de marketing de influencers para escalar su alcance. Un 'Entrenador Asociado' en un estudio más grande también podría tener acceso para gestionar sus propias colaboraciones, dependiendo de los permisos configurados por el administrador principal.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/influencers
## Descripción Funcional
La página de 'Creator/Influencer Content Syndication' es un centro de mando estratégico diseñado para que los entrenadores personales planifiquen, ejecuten y midan el impacto de sus colaboraciones con influencers y creadores de contenido del nicho fitness. Esta herramienta va más allá de una simple lista de contactos; funciona como un mini-CRM especializado en la gestión de partnerships. Aquí, el entrenador puede registrar perfiles de influencers, incluyendo sus métricas clave (seguidores, engagement, nicho específico como calistenia, powerlifting, nutrición vegana, etc.) y datos de contacto. La funcionalidad principal radica en la creación y seguimiento de 'Campañas de Colaboración'. Para cada campaña, el entrenador puede definir los términos del acuerdo, ya sea un intercambio de servicios (ej: coaching gratuito a cambio de promoción), un pago fijo o una comisión por venta. El sistema permite generar y asignar enlaces de seguimiento (UTM) y códigos de descuento únicos para cada campaña, lo que es crucial para atribuir correctamente los nuevos leads y clientes. Además, se puede hacer un seguimiento de los 'entregables' acordados, como posts, stories o videos, marcándolos como completados para asegurar que ambas partes cumplen con lo pactado. El verdadero poder reside en el dashboard analítico integrado, que muestra en tiempo real el rendimiento de cada colaboración, traduciendo las métricas de vanidad en resultados de negocio tangibles como leads generados, conversiones y el retorno de la inversión (ROI).
## Valor de Negocio
El valor de negocio de esta funcionalidad para un entrenador personal es transformador, ya que convierte el marketing de influencers de una apuesta incierta a una estrategia de crecimiento medible y escalable. Para el entrenador independiente o el estudio pequeño, colaborar con influencers de fitness es una de las formas más efectivas de generar confianza y alcanzar audiencias altamente cualificadas que de otra manera serían inaccesibles. Esta herramienta sistematiza ese proceso, ahorrando horas de gestión manual en hojas de cálculo y correos. Al trackear con precisión el ROI de cada colaboración, el entrenador puede tomar decisiones basadas en datos sobre dónde invertir su tiempo y recursos de marketing, doblando la apuesta en las colaboraciones que funcionan y descartando las que no. Esto optimiza el presupuesto de marketing y acelera la adquisición de clientes. Además, al gestionar códigos de descuento y enlaces de afiliado, se integra directamente con el embudo de ventas del entrenador dentro de TrainerERP, creando un flujo sin fricciones desde el descubrimiento en redes sociales hasta la conversión en un cliente de pago. En última instancia, esta página empodera al entrenador para construir una red de promotores de su marca, amplificando su mensaje y autoridad en el competitivo mercado del fitness.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero registrar y categorizar a los influencers de fitness con los que colaboro para tener toda su información de contacto y métricas en un solo lugar.
- Como coach online, quiero crear una campaña de colaboración específica para el lanzamiento de mi nuevo programa, asignando un código de descuento único a un influencer para medir las ventas directas que genera.
- Como dueño de un estudio de fitness, quiero ver un dashboard que compare el rendimiento (leads, conversiones, ROI) de todas mis colaboraciones con influencers para decidir con quién volver a trabajar en el futuro.
- Como entrenador, quiero establecer y hacer seguimiento de los entregables de un acuerdo (ej: 3 posts, 5 stories) para asegurarme de que el influencer cumple con su parte del trato a cambio de mis servicios de coaching.
- Como entrenador que busca expandirse, quiero generar un enlace de afiliado único para un creador de contenido, de modo que pueda rastrear no solo las inscripciones directas, sino también el tráfico que dirige a mi landing page.
## Acciones Clave
- Añadir y perfilar un nuevo Creador/Influencer (redes, nicho, métricas).
- Crear una nueva Campaña de Colaboración (definir objetivos, acuerdo, duración).
- Generar y asignar un Código de Descuento o Enlace de Afiliado a una campaña.
- Registrar y actualizar el estado de los entregables de la campaña (pendiente, completado).
- Analizar el Dashboard de Rendimiento de Influencers (filtrar por campaña, influencer o rango de fechas).
- Archivar o eliminar colaboraciones pasadas o influencers inactivos.
## 🧩 Componentes React Sugeridos
### 1. InfluencerDashboardContainer
Tipo: container | Componente principal que obtiene los datos de todos los influencers y campañas. Maneja el estado general de la página, como filtros, ordenación y la apertura de modales para crear/editar.
Props:
- userId: 
- string (requerido) - ID del entrenador para obtener los datos asociados a su cuenta.
Estados: influencers: Influencer[], campaigns: Campaign[], isLoading: boolean, error: string | null, activeFilters: { niche: string, status: string }
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<InfluencerDashboardContainer userId='user-123' />
```

### 2. InfluencerListTable
Tipo: presentational | Muestra una tabla con la lista de influencers. Cada fila es un influencer y muestra sus datos clave. Permite ordenar y hacer clic para ver detalles o iniciar una nueva campaña.
Props:
- influencers: 
- Influencer[] (requerido) - Array de objetos de influencers a mostrar.
- onSelectInfluencer: 
- (influencerId: string) => void (requerido) - Callback que se ejecuta cuando se hace clic en una fila.
- onAddNewCampaign: 
- (influencerId: string) => void (requerido) - Callback para el botón 'Nueva Campaña' en cada fila.
Dependencias: primereact/datatable
Ejemplo de uso:
```typescript
<InfluencerListTable influencers={influencerData} onSelectInfluencer={handleSelect} onAddNewCampaign={handleNewCampaign} />
```

### 3. CampaignFormModal
Tipo: presentational | Un modal con un formulario para crear o editar una campaña de colaboración. Incluye campos para el nombre, descripción, términos del acuerdo y un botón para generar el código/enlace.
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- onSubmit: 
- (campaignData: CampaignFormData) => void (requerido) - Función que se ejecuta al enviar el formulario con los datos validados.
- initialData: 
- Partial<Campaign> (opcional) - Datos iniciales para poblar el formulario en modo edición.
Estados: formData: CampaignFormData, formErrors: Record<string, string>
Dependencias: react-hook-form, zod
Ejemplo de uso:
```typescript
<CampaignFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={handleFormSubmit} />
```

### 4. useInfluencerAnalytics
Tipo: hook | Hook personalizado que encapsula la lógica para obtener y procesar las estadísticas de rendimiento de una campaña o influencer específico, calculando KPIs como el ROI y la tasa de conversión.
Props:
- campaignId: 
- string | null (opcional) - ID de la campaña para la cual obtener las analíticas.
Estados: stats: CampaignStats | null, isLoading: boolean, error: any
Dependencias: react-query
Ejemplo de uso:
```typescript
const { stats, isLoading } = useInfluencerAnalytics({ campaignId: 'camp-abc' });
```
## 🔌 APIs Requeridas
### 1. GET /api/marketing/influencers
Obtiene la lista de todos los influencers asociados a la cuenta del entrenador.
Parámetros:
- sortBy (
- string, query, opcional): Campo por el cual ordenar la lista (ej: 'name', 'followerCount').
- filterByNiche (
- string, query, opcional): Filtra influencers por un nicho específico (ej: 'yoga').
Respuesta:
Tipo: array
Estructura: Un array de objetos 'Influencer'.
```json
[
  {
    "id": "inf_1",
    "name": "FitLife Maria",
    "niche": "Calistenia",
    "followerCount": 150000,
    "socialLinks": {
      "instagram": "https://instagram.com/fitlifemaria"
    },
    "activeCampaigns": 1
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o no se proporcionó.
- 500: 
- Internal Server Error - Error en la base de datos al recuperar la lista.

### 2. POST /api/marketing/influencers
Crea un nuevo perfil de influencer en el sistema del entrenador.
Parámetros:
- influencerData (
- object, body, requerido): Objeto con los datos del nuevo influencer.
Respuesta:
Tipo: object
Estructura: El objeto del influencer recién creado, incluyendo su nuevo ID.
```json
{
  "id": "inf_2",
  "name": "Keto Coach Kevin",
  "niche": "Nutrición Keto",
  "followerCount": 75000,
  "socialLinks": {
    "youtube": "https://youtube.com/ketocoachkevin"
  },
  "activeCampaigns": 0
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos (ej: 'name' o 'socialLinks').
- 409: 
- Conflict - Ya existe un influencer con el mismo handle de red social.

### 3. POST /api/marketing/campaigns
Crea una nueva campaña de colaboración para un influencer y genera los activos de seguimiento (código/enlace).
Parámetros:
- campaignData (
- object, body, requerido): Objeto con los detalles de la campaña, incluyendo el influencerId.
Respuesta:
Tipo: object
Estructura: El objeto de la campaña recién creada con el código y/o enlace de seguimiento.
```json
{
  "id": "camp_123",
  "influencerId": "inf_1",
  "name": "Lanzamiento Programa 'Abs de Acero'",
  "status": "active",
  "trackingLink": "https://{trainer-domain}/landing/abs-acero?ref=fitlifemaria",
  "promoCode": "MARIA15"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Falta el 'influencerId' o el nombre de la campaña.
- 404: 
- Not Found - El 'influencerId' proporcionado no existe.

### 4. PUT /api/marketing/campaigns/{id}
Actualiza el estado o los detalles de una campaña existente (ej: marcarla como 'completada').
Parámetros:
- id (
- string, path, requerido): ID de la campaña a actualizar.
- updateData (
- object, body, requerido): Campos a actualizar (ej: { 'status': 'completed' }).
Respuesta:
Tipo: object
Estructura: El objeto de la campaña actualizado.
```json
{
  "id": "camp_123",
  "status": "completed"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna campaña con el ID proporcionado.

### 5. GET /api/marketing/campaigns/{id}/stats
Obtiene las métricas de rendimiento y KPIs para una campaña específica.
Parámetros:
- id (
- string, path, requerido): ID de la campaña de la que se quieren las estadísticas.
Respuesta:
Tipo: object
Estructura: Un objeto con los KPIs calculados para la campaña.
```json
{
  "campaignId": "camp_123",
  "clicks": 542,
  "leadsGenerated": 45,
  "conversions": 8,
  "revenue": 792,
  "cpa": 25,
  "roi": 3068
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró ninguna campaña con el ID proporcionado.
## Notas Técnicas
Colecciones backend: influencers, influencerCampaigns, trackingLinks, promoCodes, campaignDeliverables
KPIs visibles: Nuevos Leads por Influencer/Campaña, Tasa de Conversión (Lead a Cliente) por Influencer/Campaña, Ingresos Generados (Revenue) por Influencer/Campaña, Coste por Adquisición (CPA) de la Colaboración, Retorno de la Inversión (ROI) de la Campaña (%), Clics en Enlace de Afiliado, Usos del Código de Descuento
## Documentación Completa
## Resumen
El módulo de **Sindicación de Contenido con Creadores/Influencers** es una herramienta estratégica dentro de TrainerERP, diseñada para empoderar a los entrenadores personales en la ejecución de marketing de influencers de una manera profesional, medible y escalable. Su objetivo es transformar las colaboraciones, que a menudo se gestionan de forma desorganizada a través de hojas de cálculo y mensajes directos, en un proceso sistemático y basado en datos. Esta funcionalidad permite a los entrenadores identificar, contactar, gestionar y, lo más importante, medir el impacto real de sus alianzas con figuras influyentes en el nicho del fitness. Al centralizar la gestión de estas relaciones y conectar directamente los resultados de las campañas (leads, ventas) con la plataforma de gestión de clientes, TrainerERP proporciona una visión 360° del retorno de la inversión, permitiendo a los entrenadores optimizar sus esfuerzos de marketing para atraer clientes de alta calidad y construir una marca sólida y con autoridad en el mercado.
## Flujo paso a paso de uso real
Imaginemos a **Ana, una entrenadora personal especializada en entrenamiento funcional online**, que quiere lanzar un nuevo programa de 8 semanas.
1. **Identificación y Registro:** Ana identifica a 'Carlos Functional', un influencer con 50k seguidores en Instagram cuyo público encaja perfectamente con su cliente ideal. Entra en su panel de TrainerERP, va a `Marketing > Influencers` y hace clic en 'Añadir Influencer'. Rellena su perfil: nombre, handle de Instagram, número de seguidores, nicho ('Entrenamiento Funcional'), y un correo de contacto.
2. **Creación de la Campaña:** Ana contacta a Carlos y acuerdan una colaboración: 3 meses de acceso gratuito al plan premium de Ana a cambio de una serie de promociones. Ana vuelve a TrainerERP, busca a Carlos en su lista y hace clic en 'Crear Nueva Campaña'.
* **Nombre de la Campaña:** `Lanzamiento Programa Funtional-8S`.
* **Acuerdo:** En el campo de descripción, anota: '3 meses de coaching premium a cambio de 2 posts en el feed, 5 stories con enlace y 1 Reel tutorial'.
* **Duración:** Establece una fecha de inicio y fin para la campaña.
3. **Generación de Activos de Seguimiento:** Dentro del formulario de la campaña, Ana utiliza la herramienta para generar un código de descuento único: `CARLOS20` (20% de descuento en el nuevo programa). El sistema también genera automáticamente un enlace de afiliado: `https://ana.trainererp.com/funcional-8s?ref=carlosfunctional`.
4. **Ejecución y Seguimiento:** Ana le proporciona a Carlos el código y el enlace. Cuando Carlos publica su primer post, Ana entra en la campaña dentro de TrainerERP, va a la sección 'Entregables' y marca 'Post 1/2' como completado, adjuntando el enlace a la publicación como referencia.
5. **Análisis de Resultados:** A medida que los seguidores de Carlos empiezan a usar el código o hacer clic en el enlace, el dashboard de la campaña se actualiza en tiempo real. Ana puede ver:
* **Clics en el enlace:** 1,250
* **Leads generados (gente que se registró para más info):** 98
* **Nuevos clientes (usaron el código `CARLOS20`):** 15
* **Ingresos generados:** 15 clientes * ($199 precio del programa * 0.80 descuento) = $2,388
6. **Cálculo del ROI:** El sistema calcula automáticamente el ROI. El 'coste' de la campaña es el valor de los 3 meses de coaching que Ana le dio a Carlos (ej: $150/mes * 3 = $450). El ROI sería `(($2,388 - $450) / $450) * 100 = 430%`. Ana ve claramente que la colaboración fue un éxito rotundo y decide proponerle a Carlos una colaboración a largo plazo.
## Riesgos operativos y edge cases
- **Atribución Incorrecta:** Un seguidor ve la promo de Carlos, pero busca a Ana en Google más tarde y se inscribe sin usar el código/enlace. La venta no se atribuiría correctamente. Solución parcial: implementar modelos de atribución más complejos (ej. primer/último clic) o añadir un campo '¿Cómo nos conociste?' en el checkout.
- **Fuga de Códigos de Descuento:** El código `CARLOS20` podría ser compartido en sitios de cupones, inflando los números de uso por personas no referidas por él. Solución: generar códigos de un solo uso o limitar el número total de usos del código de descuento.
- **Disputas sobre Entregables:** Un influencer puede marcar un entregable como 'hecho' pero el contenido es de baja calidad o no cumple lo acordado. Solución: El sistema debe permitir al entrenador 'aprobar' los entregables y añadir notas. No debe haber pagos automáticos (si aplica) hasta la aprobación.
- **Gestión de Comisiones:** Si el acuerdo es por comisión en lugar de un intercambio, la complejidad aumenta. El sistema necesitaría un sub-módulo de 'pagos a afiliados' para calcular y gestionar estas comisiones, lo que implica implicaciones fiscales y legales.
## KPIs y qué significan
- **Nuevos Leads por Influencer:** Mide la capacidad de un influencer para generar interés y llevar a su audiencia a tu embudo. Un número alto indica una buena alineación de audiencias.
- **Tasa de Conversión (Lead a Cliente):** De los leads que trajo un influencer, ¿cuántos se convirtieron en clientes de pago? Una tasa alta significa que el influencer atrae a un público con alta intención de compra y bien cualificado.
- **Ingresos Generados:** La métrica final. Cuánto dinero tangible ha generado la colaboración. Es la prueba definitiva del éxito financiero.
- **Coste por Adquisición (CPA):** `Coste Total de la Campaña / Número de Nuevos Clientes`. El coste puede ser el valor del servicio intercambiado o un pago directo. Te dice cuánto te cuesta adquirir un cliente a través de ese canal. Un CPA bajo es ideal.
- **Retorno de la Inversión (ROI):** `((Ingresos Generados - Coste de la Campaña) / Coste de la Campaña) * 100`. El KPI más importante. Un ROI por encima del 100% significa que la campaña fue rentable. Permite comparar la eficacia de diferentes influencers y campañas de marketing.
## Diagramas de Flujo (Mermaid)
mermaid
graph TD;
A[Inicio: El Entrenador identifica un Influencer] --> B{¿Existe en TrainerERP?};
B -- No --> C[Añadir nuevo Influencer al CRM];
B -- Sí --> D[Seleccionar Influencer existente];
C --> D;
D --> E[Crear Nueva Campaña de Colaboración];
E --> F[Definir Acuerdo y Entregables];
F --> G[Generar Código/Enlace de Seguimiento];
G --> H[Compartir activos con el Influencer];
H --> I[Influencer publica contenido promocional];
I --> J{Seguidor interactúa};
J -- Clic en Enlace/Usa Código --> K[Dashboard se actualiza: Clics, Leads, Ventas];
J -- No interactúa --> L[Fin del flujo para ese seguidor];
K --> M[Entrenador monitorea KPIs en tiempo real];
M --> N{¿Se completaron los entregables?};
N -- Sí --> O[Marcar Campaña como Finalizada];
N -- No --> M;
O --> P[Analizar ROI final y decidir futuras colaboraciones];
