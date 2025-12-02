# Librería de Campañas (Playbooks)

**Página padre:** Hola

---

# Librería de Campañas (Playbooks)
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada principalmente para el 'Entrenador Personal (Administrador)' que define la estrategia de marketing y crecimiento del negocio. Los 'Entrenadores Asociados' podrían tener permisos de solo lectura para ver los playbooks disponibles o permisos de edición para ejecutar y gestionar campañas que les hayan sido asignadas, dependiendo de la configuración del administrador del estudio.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/intelligence/playbooks
## Descripción Funcional
La 'Librería de Campañas (Playbooks)' es un centro de inteligencia de marketing estratégico diseñado exclusivamente para el nicho del entrenamiento personal. En lugar de obligar a los entrenadores a crear campañas de marketing desde cero, esta sección ofrece una biblioteca curada de 'playbooks' o plantillas de campañas de marketing completas y probadas. Cada playbook está diseñado para un objetivo específico, como la captación de clientes para el 'Reto de Año Nuevo', la reactivación de clientes antiguos con una campaña de 'Te echamos de menos', o el aumento de ingresos con una 'Oferta de Entrenamiento de Verano'. Un playbook no es solo una idea; es un paquete de activos listos para usar: secuencias de correo electrónico, borradores de publicaciones para redes sociales (Instagram, Facebook), plantillas de landing pages de alta conversión, y flujos de mensajes SMS/WhatsApp. El entrenador puede explorar la librería, previsualizar cada activo dentro de un playbook y, con un solo clic, 'activarlo'. Al activarse, el sistema clona toda la campaña en el espacio de trabajo del entrenador, permitiéndole personalizar cada elemento (cambiar textos, añadir su logo, ajustar precios) antes de lanzarla. Esta página transforma el marketing de una tarea compleja y que consume tiempo en un proceso estratégico, guiado y eficiente, permitiendo a los entrenadores ejecutar tácticas de crecimiento de nivel profesional sin necesidad de ser expertos en marketing.
## Valor de Negocio
El valor de negocio de la Librería de Playbooks es inmenso y multifacético, ya que aborda uno de los mayores desafíos para los entrenadores personales: el marketing y la captación de clientes de manera consistente. En primer lugar, reduce drásticamente la barrera de entrada al marketing digital avanzado. Los entrenadores son expertos en fitness, no necesariamente en copywriting, diseño de embudos o automatización. Este módulo les entrega la experiencia de una agencia de marketing en una caja, permitiéndoles competir eficazmente en el mercado. En segundo lugar, acelera el tiempo de implementación de campañas de semanas a minutos. Esto permite a los entrenadores ser más ágiles y capitalizar oportunidades estacionales o tendencias del mercado sin una planificación exhaustiva. En tercer lugar, aumenta directamente el ROI al proporcionar campañas que ya han sido probadas y optimizadas para la conversión dentro del nicho del fitness. Esto minimiza el gasto en estrategias ineficaces y maximiza la generación de leads y ventas. Finalmente, mejora la retención de clientes al ofrecer playbooks específicos para la fidelización y el re-engagement. Al democratizar el marketing de alto rendimiento, TrainerERP no solo se convierte en una herramienta de gestión, sino en un socio estratégico para el crecimiento del negocio del entrenador, justificando su valor y aumentando la fidelidad al producto (stickiness).
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal independiente, quiero explorar una biblioteca de campañas de marketing pre-hechas para poder lanzar promociones estacionales sin tener que contratar a un experto en marketing.
- Como dueño de un estudio de fitness, quiero previsualizar todos los activos de un 'Playbook de Retención' (emails, SMS, ofertas) antes de activarlo, para asegurar que se alinea con la voz y marca de mi negocio.
- Como coach online, quiero activar un 'Playbook de Lanzamiento de Reto de 30 días' con un solo clic, para que todos los emails, posts y la landing page se copien a mi cuenta y pueda personalizarlos rápidamente.
- Como entrenador con poco tiempo, quiero ver métricas de rendimiento sugeridas y KPIs para cada playbook, para entender qué resultados puedo esperar y cómo medir el éxito de mi campaña.
- Como administrador de un centro con varios entrenadores, quiero poder asignar una campaña activada desde un playbook a un 'Entrenador Asociado' para que él la gestione y haga el seguimiento de los leads generados.
- Como un nuevo entrenador, quiero usar un playbook de 'Construcción de Audiencia' que me guíe paso a paso en la creación de mi lista de correo y mi presencia en redes sociales.
## Acciones Clave
- Explorar y filtrar la librería de playbooks por objetivo (ej: Captación, Retención), temporada (ej: Verano, Año Nuevo) o tipo de cliente (ej: Principiantes, Avanzados).
- Previsualizar el contenido completo de un playbook, incluyendo el texto de los emails, el diseño de las landing pages y los copys para redes sociales.
- Activar un playbook, lo que duplica todos sus activos y crea una nueva campaña editable en el espacio de trabajo del usuario.
- Personalizar los detalles de una campaña activada (ej: editar textos con el editor en línea, cambiar imágenes, ajustar fechas de envío).
- Lanzar y/o programar la ejecución de la campaña completa o de sus partes individuales.
- Acceder a un dashboard de rendimiento específico para cada campaña activada, mostrando KPIs clave como leads generados, tasa de conversión y ROI.
## 🧩 Componentes React Sugeridos
### 1. PlaybookLibraryContainer
Tipo: container | Componente principal que renderiza la página de la librería. Se encarga de obtener los playbooks de la API, gestionar los estados de carga, error, y aplicar los filtros seleccionados por el usuario.
Estados: playbooks: Playbook[], isLoading: boolean, error: string | null, filters: { category: string, objective: string }
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<PlaybookLibraryContainer />
```

### 2. PlaybookCard
Tipo: presentational | Muestra una tarjeta de resumen para un solo playbook en la librería. Muestra el título, descripción corta, etiquetas (ej: 'Captación', 'Verano') y botones de acción.
Props:
- playbook: 
- PlaybookSummary (requerido) - Objeto con la información resumida del playbook.
- onPreview: 
- (playbookId: string) => void (requerido) - Callback que se ejecuta al hacer clic en 'Previsualizar'.
- onActivate: 
- (playbookId: string) => void (requerido) - Callback que se ejecuta al hacer clic en 'Activar'.
Dependencias: styled-components
Ejemplo de uso:
```typescript
<PlaybookCard playbook={playbookData} onPreview={handlePreview} onActivate={handleActivate} />
```

### 3. PlaybookDetailModal
Tipo: container | Modal que muestra la vista detallada de un playbook seleccionado. Carga y muestra todos los activos (emails, posts) y contiene el botón de confirmación para activar la campaña.
Props:
- playbookId: 
- string | null (requerido) - ID del playbook a mostrar. Si es null, el modal está cerrado.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
Estados: playbookDetails: PlaybookDetail | null, isActivating: boolean
Dependencias: axios, @headlessui/react
Ejemplo de uso:
```typescript
<PlaybookDetailModal playbookId={selectedPlaybookId} onClose={() => setSelectedPlaybookId(null)} />
```

### 4. usePlaybookActivation
Tipo: hook | Hook personalizado que encapsula la lógica para activar un playbook. Maneja la llamada a la API, el estado de carga y los posibles errores, proveyendo una función simple para ser llamada desde el componente.
Dependencias: react-query, axios
Ejemplo de uso:
```typescript
const { mutate: activatePlaybook, isLoading } = usePlaybookActivation(); 
 const handleActivate = () => activatePlaybook(playbookId);
```
## 🔌 APIs Requeridas
### 1. GET /api/v1/playbooks/templates
Obtiene una lista paginada y filtrable de todas las plantillas de playbooks disponibles para el usuario.
Parámetros:
- page (
- number, query, opcional): Número de página para paginación.
- limit (
- number, query, opcional): Número de resultados por página.
- objective (
- string, query, opcional): Filtra por objetivo (e.g., 'lead_generation', 'retention').
- tags (
- string[], query, opcional): Filtra por etiquetas (e.g., 'new_year', 'summer_promo').
Respuesta:
Tipo: object
Estructura: Un objeto que contiene un array de plantillas de playbook y metadatos de paginación.
```json
{
  "data": [
    {
      "id": "playbook-tpl-001",
      "name": "Reto de 30 Días para Abdominales",
      "description": "Una campaña completa para captar leads y vender un reto de fitness online de 30 días.",
      "objective": "lead_generation",
      "tags": [
        "reto",
        "online",
        "captacion"
      ],
      "asset_counts": {
        "emails": 7,
        "social_posts": 15,
        "landing_pages": 2
      }
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación es inválido o no fue provisto.

### 2. GET /api/v1/playbooks/templates/{templateId}
Obtiene los detalles completos de una plantilla de playbook, incluyendo una vista previa de todos sus activos.
Parámetros:
- templateId (
- string, path, requerido): El ID de la plantilla de playbook.
Respuesta:
Tipo: object
Estructura: Un objeto con los detalles del playbook y un array de sus activos.
```json
{
  "id": "playbook-tpl-001",
  "name": "Reto de 30 Días para Abdominales",
  "full_description": "...",
  "assets": [
    {
      "id": "asset-tpl-e01",
      "type": "email",
      "name": "Email 1: Anuncio del Reto",
      "preview_content": "<html>...</html>"
    },
    {
      "id": "asset-tpl-s01",
      "type": "social_post",
      "name": "Post de Instagram: ¿Estás listo?",
      "preview_content": "Texto del post..."
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La plantilla de playbook con el ID especificado no existe.

### 3. POST /api/v1/playbooks/activate
Activa un playbook para el usuario actual. Esto crea una nueva campaña y clona todos los activos de la plantilla, asociándolos a la nueva campaña del usuario.
Parámetros:
- templateId (
- string, body, requerido): El ID de la plantilla de playbook a activar.
- campaignName (
- string, body, requerido): Nombre que el usuario le da a su nueva campaña.
Respuesta:
Tipo: object
Estructura: Un objeto que confirma la activación y proporciona el ID de la nueva campaña creada.
```json
{
  "success": true,
  "message": "Campaña 'Mi Reto de Verano' creada exitosamente.",
  "campaignId": "user-camp-xyz789"
}
```
Autenticación: Requerida
Errores posibles:
- 402: 
- Payment Required - El plan de suscripción del usuario no permite esta acción (ej: límite de campañas alcanzado, o la plantilla requiere una funcionalidad premium).
- 429: 
- Too Many Requests - El usuario está intentando activar campañas demasiado rápido.
- 500: 
- Internal Server Error - Falló el proceso de clonación de activos en el backend.
## Notas Técnicas
Colecciones backend: playbook_templates, playbook_assets, user_campaigns, user_campaign_assets, campaign_performance_logs
KPIs visibles: Playbooks más populares (por número de activaciones)., Tasa de conversión promedio por playbook (leads generados / visitantes únicos)., Número de campañas activas por usuario., Leads generados por campañas basadas en playbooks (últimos 30 días)., ROI estimado por tipo de playbook (basado en el valor promedio de cliente)., Tasa de finalización de personalización (usuarios que activan un playbook vs. usuarios que lo lanzan).
## Documentación Completa
## Resumen
La 'Librería de Campañas (Playbooks)' es una funcionalidad estratégica dentro del área de 'ANÁLISIS & INTELIGENCIA' de TrainerERP. Su propósito es empoderar a los entrenadores personales, dueños de estudios y coaches online con herramientas de marketing de nivel profesional, eliminando la complejidad y el tiempo asociados a la creación de campañas de crecimiento. En esencia, es una biblioteca de plantillas de marketing completas y contextualizadas para el nicho del fitness.
Cada 'Playbook' es un paquete de activos coordinados que sirven a un objetivo de negocio específico:
- **Captación de Clientes:** Playbooks como 'Lanzamiento de Reto de 30 Días', 'Oferta de Año Nuevo', 'Promoción de Verano'.
- **Retención y Fidelización:** Playbooks como 'Campaña de Reactivación de Clientes Inactivos', 'Programa de Referidos', 'Secuencia de Aniversario de Cliente'.
- **Monetización:** Playbooks para vender productos de alto valor como 'Lanzamiento de Programa de Coaching Premium' o 'Venta de Planes de Nutrición'.
Al seleccionar y 'activar' un playbook, el entrenador no solo obtiene ideas, sino que el sistema automáticamente crea una campaña completa en su cuenta, clonando secuencias de emails, plantillas de landing pages, copys para redes sociales y flujos de automatización. El entrenador solo necesita personalizar los detalles con su marca y lanzarla. Esta funcionalidad transforma a TrainerERP de un simple sistema de gestión a un verdadero socio para el crecimiento del negocio.
## Flujo paso a paso de uso real
Imaginemos a **Sofía**, una entrenadora personal online que quiere aumentar su base de clientes antes del verano.
1. **Exploración:** Sofía inicia sesión en TrainerERP y navega a la sección `Inteligencia > Librería de Campañas`. La pantalla le muestra una galería de 'Playbooks' con tarjetas visuales atractivas.
2. **Filtrado:** Utiliza los filtros en la parte superior para acotar su búsqueda. Selecciona el objetivo `'Captación de Clientes'` y la etiqueta `'Verano'`. La lista se actualiza y le muestra el playbook **'Transformación de Verano en 6 Semanas'**.
3. **Previsualización:** Hace clic en 'Previsualizar'. Se abre un modal que detalla todo el contenido del playbook:
* **5 Emails:** Desde el anuncio inicial hasta el recordatorio de última oportunidad.
* **10 Posts para Instagram:** Incluyendo imágenes sugeridas y copys persuasivos.
* **1 Landing Page:** Con un formulario de registro y un diseño optimizado para la conversión.
* **Flujo de SMS:** 3 mensajes para recordar a los leads sobre la oferta.
Sofía puede leer el texto de cada email y ver la estructura de la landing page. Todo le parece perfecto.
4. **Activación:** Cierra el modal y hace clic en el botón 'Activar'. El sistema le pide que le dé un nombre a su campaña, ella escribe `'Mi Transformación de Verano 2024'` y confirma.
5. **Clonación Asíncrona:** TrainerERP muestra un mensaje de 'Estamos preparando tu campaña...'. En segundo plano, el sistema está duplicando los 19 activos (5 emails, 10 posts, 1 landing page, 3 SMS) y asociándolos a su nueva campaña.
6. **Personalización:** Unos segundos después, es redirigida automáticamente al editor de su nueva campaña. Aquí ve todos los activos listos para ser personalizados. Abre el primer email y cambia la línea de saludo para que sea más personal y acorde a su marca. Sube una foto suya a la landing page.
7. **Lanzamiento:** Una vez que está contenta con los cambios, utiliza el programador de la campaña para definir las fechas de envío de los emails y la publicación de los posts en redes sociales. Con un clic, la campaña queda programada.
8. **Monitoreo:** Durante las siguientes semanas, Sofía vuelve a la página de su campaña para ver el dashboard de rendimiento. Ve en tiempo real cuántas personas han abierto sus emails, cuántos han hecho clic y, lo más importante, cuántos nuevos clientes se han inscrito a su programa 'Transformación de Verano'.
## Riesgos operativos y edge cases
- **Sobrecarga de personalización:** Si un playbook tiene demasiados elementos personalizables, puede abrumar al usuario. Es crucial encontrar un balance entre flexibilidad y simplicidad. Los playbooks deben funcionar 'casi' listos para usar.
- **Saturación del mercado:** Si miles de entrenadores usan el mismo playbook, los mensajes pueden volverse repetitivos para el público final. Se deben introducir variaciones, nuevos playbooks regularmente y animar a la personalización.
- **Dependencias de API de terceros:** Los playbooks que interactúan con redes sociales (Instagram, Facebook) dependen de sus APIs. Un cambio en estas APIs puede romper la funcionalidad de publicación. Se necesita un monitoreo constante y un plan de contingencia.
- **Gestión de permisos:** En un estudio con varios entrenadores, se debe definir claramente quién puede activar campañas (que pueden tener costos asociados) y quién solo puede ejecutarlas. El rol 'Entrenador Asociado' debe tener permisos restringidos por defecto.
- **Consistencia de marca:** El proceso de clonación debe asegurar que los elementos de marca del entrenador (logo, colores) se apliquen automáticamente a los activos clonados donde sea posible, para reducir el trabajo manual.
## KPIs y qué significan
- **Tasa de Activación de Playbooks:** (Número de activaciones / Número de usuarios activos) - Mide la adopción de la funcionalidad. Un valor alto indica que los usuarios encuentran valor en los playbooks ofrecidos.
- **Tasa de Lanzamiento:** (Campañas lanzadas / Campañas activadas) - Indica si los usuarios realmente completan el proceso de personalización y lanzan las campañas. Una tasa baja podría señalar que el proceso es demasiado complejo.
- **Tasa de Conversión por Playbook:** (Leads o Clientes generados / Visitantes únicos a la landing page del playbook) - Es el KPI de rendimiento más importante. Permite al entrenador y al sistema identificar qué estrategias son más efectivas.
- **Coste por Adquisición (CPA) por Campaña:** (Coste total de la campaña (SMS, ads) / Nuevos clientes) - Ayuda al entrenador a entender la rentabilidad de sus esfuerzos de marketing.
- **Engagement por Activo:** (Aperturas y clics en emails, interacciones en posts) - Métricas para optimizar los componentes individuales de futuras versiones del playbook.
## Diagramas de Flujo (Mermaid)
**Flujo de Activación de un Playbook:**
mermaid
graph TD;
A[Usuario navega a la Librería] --> B[Explora y filtra playbooks];
B --> C{Selecciona un Playbook};
C --> D[Previsualiza Activos (Emails, Posts, LP)];
D --> E{¿Activar?};
E -- No --> B;
E -- Sí --> F[Nombra la nueva campaña];
F --> G[API POST /playbooks/activate];
G --> H[Backend: Proceso de clonación asíncrono];
H --> I[Crea registro 'user_campaigns'];
H --> J[Crea registros 'user_campaign_assets'];
H -- Éxito --> K[API devuelve campaignId];
K --> L[Redirige al usuario al editor de la campaña];
L --> M[Usuario personaliza y lanza la campaña];
