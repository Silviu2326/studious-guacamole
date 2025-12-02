# Gestión de Contenidos Premium

**Página padre:** Hola

---

# Gestión de Contenidos Premium
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada principalmente para el 'Entrenador Personal (Administrador)' y el 'Entrenador Asociado', quienes son los responsables de crear, gestionar y monetizar el contenido. Ellos utilizarán esta interfaz para construir programas, establecer precios y reglas de acceso, y analizar el rendimiento. El rol 'Cliente' interactuará con el resultado de esta gestión a través de su portal personal, donde consumirá el contenido al que ha obtenido acceso, pero no verá esta interfaz de administración.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/contenido-premium
## Descripción Funcional
La página de 'Gestión de Contenidos Premium' es el centro neurálgico para que los entrenadores personales producticen su conocimiento y experiencia, transformando su servicio en activos digitales escalables. Esta herramienta va más allá de un simple repositorio de archivos; es una plataforma de creación estructurada que permite a los entrenadores diseñar, empaquetar y vender programas completos de entrenamiento, planes de nutrición, guías de mentalidad, y cualquier otro material de valor. Los entrenadores pueden construir 'Paquetes de Contenido' multi-formato, como un 'Programa de Transformación de 12 Semanas' que combine videos de ejercicios exclusivos, PDFs con recetas semanales, y textos motivacionales programados. La funcionalidad clave reside en su robusto sistema de control de acceso, que se integra nativamente con los módulos de pago y suscripciones de TrainerERP. Esto permite restringir el contenido a clientes que han realizado un pago único, que pertenecen a un nivel de suscripción específico (ej. 'Plan Premium'), o como un bonus dentro de un paquete de coaching personalizado. Además, la plataforma permite la entrega de contenido programada (drip content), liberando módulos semanalmente para mantener el compromiso del cliente y proteger la propiedad intelectual del entrenador. Finalmente, ofrece analíticas detalladas sobre el consumo, permitiendo al entrenador ver qué clientes están progresando, quiénes se están quedando atrás, y qué piezas de contenido son las más efectivas, facilitando un seguimiento proactivo y personalizado.
## Valor de Negocio
El valor de negocio de la 'Gestión de Contenidos Premium' es transformacional para un entrenador personal, ya que le permite romper la barrera de 'tiempo por dinero'. Introduce múltiples flujos de ingresos pasivos y semi-pasivos, diversificando la facturación más allá de las sesiones 1-a-1. Al empaquetar su conocimiento en programas digitales, un entrenador puede servir a un número ilimitado de clientes simultáneamente, escalando su impacto y sus ingresos de forma exponencial. Esta funcionalidad eleva la percepción de valor de la marca del entrenador, posicionándolo como una autoridad con productos de alta calidad. Actúa como una potente herramienta de conversión y retención: los programas premium pueden ser utilizados como 'tripwires' o productos de entrada para convertir leads, como 'upsells' para clientes existentes, o como parte de paquetes de alto valor para mejorar la retención a largo plazo. Centralizar la propiedad intelectual en una plataforma segura y controlada protege el activo más valioso del entrenador. Finalmente, al analizar los datos de consumo, el entrenador puede refinar continuamente su oferta, crear contenido más efectivo y entender mejor las necesidades de sus clientes, creando un círculo virtuoso de mejora y crecimiento del negocio.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: alta
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero crear un 'Programa Premium' que incluya videos de ejercicios, un plan de nutrición en PDF y un calendario de contenido, para poder venderlo como un paquete de pago único a nuevos clientes.
- Como entrenador online, quiero restringir el acceso a mi biblioteca de videos de 'Técnica Avanzada' solo a los clientes con una suscripción activa 'Pro', para crear una fuente de ingresos recurrentes y darles un valor exclusivo.
- Como administrador de un estudio de fitness, quiero duplicar un programa de contenido existente y asignarlo a un nuevo entrenador para que lo personalice, agilizando la creación de nuevas ofertas.
- Como entrenador personal, quiero visualizar un dashboard que me muestre la tasa de finalización de mi 'Reto de 21 Días de Fitness', para identificar en qué día abandonan más usuarios y poder mejorar el contenido.
- Como coach de grupos pequeños, quiero programar la liberación de contenido semanalmente (drip content) para mi 'Programa de Preparación para Maratón', para guiar a los participantes paso a paso y evitar que se sientan abrumados.
## Acciones Clave
- Crear un nuevo 'Paquete de Contenido' (ej: programa, curso, biblioteca).
- Subir y organizar materiales multimedia (videos, PDFs, texto enriquecido, enlaces externos) dentro de módulos y lecciones.
- Configurar reglas de acceso y monetización (pago único, vincular a plan de suscripción, acceso gratuito como lead magnet).
- Asignar o revocar acceso a paquetes de contenido a clientes individuales o segmentos de clientes.
- Analizar las métricas de consumo de contenido por paquete y por cliente (progreso, último acceso, videos vistos).
- Configurar la liberación programada de contenido ('Drip Content') basado en la fecha de inscripción del cliente.
## 🧩 Componentes React Sugeridos
### 1. ContentPackageManager
Tipo: container | Componente principal que renderiza la vista de gestión de contenidos. Obtiene la lista de todos los paquetes de contenido creados por el entrenador, maneja el estado de carga y error, y controla la apertura de modales para crear o editar paquetes.
Props:
- trainerId: 
- string (requerido) - ID del entrenador actualmente logueado para obtener sus paquetes.
Estados: packages: ContentPackage[], isLoading: boolean, error: string | null, isCreateModalOpen: boolean
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<ContentPackageManager trainerId={auth.user.id} />
```

### 2. ContentPackageCard
Tipo: presentational | Tarjeta visual que representa un único paquete de contenido. Muestra información clave como el título, una imagen de portada, el número de clientes inscritos, el precio y los botones de acción (editar, analizar, previsualizar).
Props:
- packageData: 
- { id: string; title: string; imageUrl: string; enrolledClients: number; price: number; accessType: 'subscription' | 'one-time'; } (requerido) - Objeto con los datos del paquete de contenido a mostrar.
- onEdit: 
- (id: string) => void (requerido) - Callback que se ejecuta al hacer clic en el botón de editar.
- onAnalytics: 
- (id: string) => void (requerido) - Callback que se ejecuta al hacer clic en el botón de analytics.
Dependencias: styled-components
Ejemplo de uso:
```typescript
<ContentPackageCard packageData={pkg} onEdit={() => openEditModal(pkg.id)} onAnalytics={() => navigate(`/dashboard/contenido-premium/${pkg.id}/analytics`)} />
```

### 3. ContentBuilder
Tipo: container | Un componente complejo (posiblemente una página completa o un modal grande) para la creación y edición de la estructura de un paquete de contenido. Permite añadir módulos (ej. 'Semana 1') y arrastrar y soltar ítems de contenido (videos, PDFs) dentro de ellos.
Props:
- packageId: 
- string | null (opcional) - ID del paquete a editar. Si es nulo, se asume la creación de uno nuevo.
- onSave: 
- (packageStructure: object) => void (requerido) - Función que se llama al guardar los cambios, enviando la nueva estructura del paquete.
Estados: modules: ContentModule[], selectedItem: ContentItem | null, isUploading: boolean
Dependencias: react-beautiful-dnd, axios
Ejemplo de uso:
```typescript
<ContentBuilder packageId='pkg_123' onSave={handleSavePackage} />
```

### 4. useContentPackage
Tipo: hook | Hook personalizado para abstraer la lógica de fetching y mutación de un paquete de contenido específico. Proporciona los datos del paquete, su estado de carga, y funciones para actualizarlo o eliminarlo.
Props:
- packageId: 
- string (requerido) - El ID del paquete de contenido a gestionar.
Estados: Devuelve un objeto de estado de react-query: { data, isLoading, isError, updateMutation, deleteMutation }
Dependencias: react-query, axios
Ejemplo de uso:
```typescript
const { data: package, isLoading, updateMutation } = useContentPackage('pkg_123');
```
## 🔌 APIs Requeridas
### 1. GET /api/content/packages
Obtiene una lista de todos los paquetes de contenido premium creados por el entrenador autenticado.
Parámetros:
- sortBy (
- string, query, opcional): Campo por el cual ordenar la lista (ej: 'createdAt', 'title', 'revenue').
Respuesta:
Tipo: array
Estructura: Un array de objetos, donde cada objeto representa un paquete de contenido con sus metadatos principales.
```json
[
  {
    "id": "pkg_abc123",
    "title": "Programa de Hipertrofia de 12 Semanas",
    "enrolledClients": 45,
    "price": 99.99,
    "accessType": "one-time",
    "createdAt": "2023-10-27T10:00:00Z"
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación no es válido o no fue provisto.

### 2. POST /api/content/packages
Crea un nuevo paquete de contenido premium.
Parámetros:
- packageData (
- object, body, requerido): Objeto con la información inicial del paquete a crear.
Respuesta:
Tipo: object
Estructura: El objeto del paquete de contenido recién creado, incluyendo su nuevo ID.
```json
{
  "id": "pkg_def456",
  "title": "Plan Nutricional Keto - 30 Días",
  "description": "Un plan completo para iniciar la dieta cetogénica.",
  "price": 49,
  "accessType": "one-time",
  "modules": [],
  "createdAt": "2023-10-27T11:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos en el body (ej: 'title').
- 402: 
- Payment Required - La creación de contenido premium está bloqueada para el plan de suscripción actual del entrenador.

### 3. PUT /api/content/packages/{packageId}
Actualiza la información y estructura de un paquete de contenido existente.
Parámetros:
- packageId (
- string, path, requerido): El ID del paquete a actualizar.
- updateData (
- object, body, requerido): Un objeto con los campos a actualizar. Puede ser una actualización parcial (PATCH-like).
Respuesta:
Tipo: object
Estructura: El objeto del paquete de contenido actualizado.
```json
{
  "id": "pkg_abc123",
  "title": "Programa de Hipertrofia Total 2.0",
  "price": 129.99,
  "description": "Versión actualizada con nuevos videos y rutinas."
}
```
Autenticación: Requerida
Errores posibles:
- 403: 
- Forbidden - El entrenador no es el propietario del paquete de contenido que intenta modificar.
- 404: 
- Not Found - El 'packageId' proporcionado no corresponde a ningún paquete existente.

### 4. POST /api/content/packages/{packageId}/access
Otorga acceso a un paquete de contenido a un cliente específico.
Parámetros:
- packageId (
- string, path, requerido): ID del paquete al que se dará acceso.
- clientId (
- string, body, requerido): ID del cliente que recibirá el acceso.
- accessDurationDays (
- number, body, opcional): Duración del acceso en días. Si no se provee, el acceso es indefinido.
Respuesta:
Tipo: object
Estructura: Un objeto confirmando la concesión de acceso.
```json
{
  "success": true,
  "clientId": "cli_xyz789",
  "packageId": "pkg_abc123",
  "accessExpiresAt": "2024-10-26T12:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 409: 
- Conflict - El cliente ya tiene acceso a este paquete de contenido.
- 404: 
- Not Found - El 'clientId' o 'packageId' no existen.
## Notas Técnicas
Colecciones backend: ContentPackages, ContentModules, ContentItems, ClientAccessControl, ClientProgress
KPIs visibles: Ingresos totales por Contenido Premium (Mes actual vs Mes anterior), Número de suscripciones activas a contenido, Tasa de finalización promedio por programa (%), Contenido más vendido/accedido, Tasa de engagement (clientes que han accedido al contenido en los últimos 7 días), Valor de vida del cliente (LTV) de clientes que compran contenido vs los que no.
## Documentación Completa
## Resumen
La funcionalidad de **Gestión de Contenidos Premium** es un pilar estratégico dentro de TrainerERP, diseñada para empoderar a los entrenadores personales en su transición de un modelo de negocio basado en servicios (horas de entrenamiento) a uno basado en productos y valor escalable. Este módulo permite a los entrenadores empaquetar su conocimiento, metodologías y experiencia en formatos digitales (programas, cursos, guías nutricionales, bibliotecas de videos) que pueden ser vendidos y distribuidos a una audiencia masiva sin la limitación de su tiempo físico.
El objetivo principal es crear nuevas y robustas fuentes de ingresos, aumentar el Valor de Vida del Cliente (LTV) y fortalecer la marca del entrenador. Al integrarse de forma nativa con los sistemas de pago, suscripciones y CRM de TrainerERP, esta herramienta se convierte en el motor de la estrategia de **CAPTURA & CONVERSIÓN**, permitiendo la creación de lead magnets, productos de entrada de bajo coste (tripwires), y ofertas de alto valor (high-ticket) que guían al cliente potencial a través de un embudo de ventas bien definido.
## Flujo paso a paso de uso real
Imaginemos a una entrenadora, Sofía, especializada en fitness post-parto. Quiere lanzar un programa digital para llegar a más madres.
1. **Conceptualización:** Sofía decide crear un "Programa de Recuperación Post-Parto de 8 Semanas".
2. **Creación del Paquete:** En su dashboard de TrainerERP, navega a `Contenido Premium` y hace clic en "Crear Nuevo Paquete". Le asigna un nombre, una descripción motivacional, una imagen de portada y establece un precio de pago único de 149€.
3. **Estructuración del Contenido:** Dentro del "Constructor de Contenido", Sofía crea 8 módulos, uno para cada semana.
* En "Semana 1: Conexión Core", sube 3 videos cortos: "Respiración Diafragmática", "Activación del Suelo Pélvico" y "Estiramientos Suaves". Añade un PDF con una "Lista de la Compra Antiinflamatoria".
* Repite el proceso para las demás semanas, aumentando progresivamente la intensidad.
4. **Configuración de Drip Content:** Para evitar que las clientas se abrumen o compartan el material, Sofía configura cada módulo para que se libere 7 días después del anterior, a partir de la fecha de compra de la clienta.
5. **Marketing y Venta:** Sofía utiliza el módulo de "Landing Pages" de TrainerERP para crear una página de ventas para su programa. El botón "Comprar Ahora" está directamente vinculado al paquete de contenido. Comparte el enlace en sus redes sociales y lista de correo.
6. **Acceso del Cliente:** Cuando una nueva clienta, Laura, compra el programa, el sistema automáticamente:
* Procesa el pago.
* Crea un perfil de cliente para Laura en TrainerERP.
* Le otorga acceso al programa.
* Le envía un email de bienvenida con el enlace a su portal.
7. **Monitorización:** Sofía entra a la sección de "Analytics" del programa y ve que 15 personas se han inscrito. Observa que la mayoría de usuarias completan hasta la Semana 3, pero hay una caída en la Semana 4. Decide enviar un email de motivación automatizado a todas las usuarias que no han iniciado la Semana 4 después de 3 días, preguntándoles si necesitan ayuda.
## Riesgos operativos y edge cases
- **Piratería de Contenido:** El riesgo más significativo es que los clientes descarguen y compartan ilegalmente el contenido. Mitigación: Implementar streaming de video seguro (HLS), marcas de agua dinámicas en videos y PDFs, y términos de servicio claros. Evitar enlaces de descarga directa.
- **Gestión de Cambios:** Si Sofía actualiza un video en la Semana 2, ¿qué pasa con las clientas que ya pasaron esa semana? ¿Y las que están por llegar? Mitigación: Implementar un sistema de versionado. Notificar a los clientes activos de las actualizaciones importantes. Permitir a los entrenadores decidir si el cambio se aplica a todos o solo a los nuevos inscritos.
- **Revocación de Acceso:** El acceso debe sincronizarse perfectamente con el estado de pago. Si una suscripción falla o se solicita un reembolso, el acceso al contenido debe ser revocado de forma inmediata y automática para evitar abusos.
- **Rendimiento y Coste de Almacenamiento:** El hosting de video es caro y requiere una infraestructura robusta. Mitigación: Utilizar servicios de terceros especializados como Vimeo Pro o Mux, integrados vía API. Implementar transcodificación para ofrecer distintas calidades de video y optimizar la carga.
## KPIs y qué significan
- **Ingresos por Contenido Premium:** La métrica más directa del éxito financiero. Permite evaluar qué paquetes son más rentables y el ROI de la creación de contenido.
- **Tasa de Finalización de Programa (%):** (Número de clientes que completan el 100% / Número total de inscritos). Un indicador clave de la calidad del contenido y del engagement del cliente. Tasas bajas pueden señalar que el contenido es muy difícil, aburrido o mal estructurado.
- **Punto de Abandono Promedio:** ¿En qué módulo o lección abandonan la mayoría de los clientes? Este KPI es crucial para identificar puntos de fricción y mejorar el contenido para aumentar la retención.
- **Tasa de Conversión (de Lead a Cliente de Contenido):** Mide la efectividad de las páginas de venta y las campañas de marketing asociadas a los paquetes de contenido.
- **Engagement del Contenido:** Mide la frecuencia con la que los clientes acceden a su contenido. Un alto engagement se correlaciona con una mayor satisfacción y probabilidad de comprar otros productos o renovar suscripciones.
## Diagramas de Flujo (Mermaid)
**Flujo de Creación y Venta de Contenido:**
mermaid
graph TD;
A[Entrenador inicia sesión en TrainerERP] --> B(Navega a 'Contenido Premium');
B --> C{¿Crear nuevo o editar?};
C -- Crear Nuevo --> D[Define Título, Precio, Acceso];
C -- Editar Existente --> E[Selecciona Paquete de la lista];
D --> F[Constructor de Contenido: Añade Módulos/Items];
E --> F;
F --> G[Guarda y Publica el Paquete];
G --> H[Crea Landing Page o lo vincula a una oferta];
H --> I[Cliente visita la página y compra];
I --> J[API de Pago procesa la transacción];
J --> K[Sistema otorga acceso al Cliente];
K --> L[Cliente consume contenido en su portal];
L --> M[Entrenador monitoriza el progreso y KPIs];
