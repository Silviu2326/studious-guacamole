# Promociones, Cupones & Packs

**Página padre:** Hola

---

# Promociones, Cupones & Packs
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Principalmente para el 'Entrenador Personal (Administrador)' y 'Entrenador Asociado', quienes tienen permisos para crear, gestionar y analizar las estrategias de precios y promociones del negocio. Los 'Clientes' interactúan con el resultado de esta funcionalidad al aplicar cupones en el checkout o al comprar packs de sesiones, pero no acceden a este panel de gestión.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/monetizacion/ofertas
## Descripción Funcional
El módulo de 'Promociones, Cupones & Packs' es el centro de control estratégico para la monetización del negocio de un entrenador personal dentro de TrainerERP. Esta sección permite a los entrenadores ir más allá de una simple tarifa por hora o por plan, dándoles la flexibilidad para diseñar una amplia gama de ofertas comerciales que impulsen la adquisición de clientes, mejoren la retención y aumenten el valor de vida del cliente (LTV). Desde aquí, el entrenador puede crear cupones de descuento (porcentaje o cantidad fija), ideales para campañas de captación ('20% en tu primer mes'), promociones estacionales ('Plan Verano Fit') o recompensas de fidelidad. Además, facilita la creación de 'Packs' o paquetes de servicios, una herramienta clave para mejorar el flujo de caja y asegurar el compromiso del cliente a largo plazo (ej: 'Pack de 10 sesiones de entrenamiento personal con un 15% de descuento'). La plataforma permite configurar reglas detalladas para cada oferta: fechas de validez, límites de uso (total o por cliente), aplicabilidad a servicios específicos (entrenamiento personal, asesoría nutricional, planes online), y la generación de códigos únicos para campañas personalizadas o programas de referidos. Este sistema no solo crea las ofertas, sino que también proporciona un seguimiento analítico detallado sobre su rendimiento.
## Valor de Negocio
El valor de negocio de esta funcionalidad es inmenso y directo, ya que impacta directamente en la capacidad del entrenador para generar ingresos y hacer crecer su negocio de manera competitiva. Permite una estrategia de precios dinámica y adaptativa, crucial en el mercado del fitness. Al crear packs de sesiones, los entrenadores aseguran ingresos por adelantado, mejorando drásticamente su flujo de caja y reduciendo la incertidumbre financiera mes a mes. Los cupones de descuento para nuevos clientes son una de las herramientas de adquisición más efectivas, reduciendo la barrera de entrada y acelerando la conversión de leads. Las promociones estacionales o flash sales crean un sentido de urgencia que puede reactivar a clientes pasados o motivar a leads indecisos a tomar acción. Además, este módulo es fundamental para las estrategias de retención; un cupón de 'aniversario' o un descuento por renovación anticipada puede marcar la diferencia entre un cliente que se va y uno que se queda. Al centralizar la gestión y el análisis de estas ofertas, TrainerERP proporciona al entrenador una visión clara de qué estrategias funcionan, permitiéndole optimizar sus campañas de marketing y maximizar el retorno de la inversión (ROI) de sus esfuerzos.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: MVP
## User Stories
- Como entrenador personal, quiero crear un cupón de descuento del 25% llamado 'NUEVOCLIENTE25' que solo se pueda aplicar al primer pago de cualquier plan mensual, para así incentivar la captación de nuevos clientes.
- Como propietario de un estudio de entrenamiento, quiero crear un 'Pack de 12 Sesiones' que tenga un precio fijo y un 15% de descuento sobre el precio individual, para fomentar compromisos a largo plazo y mejorar el cash-flow.
- Como coach online, quiero lanzar una promoción 'Flash Sale 48h' con un descuento del 30% en mi programa de transformación de 90 días, estableciendo una fecha de inicio y fin claras para generar urgencia.
- Como entrenador personal, quiero poder ver un listado de todos mis cupones, cuántas veces se ha usado cada uno y qué clientes los han utilizado, para medir la efectividad de mis diferentes campañas de marketing.
- Como administrador del centro de fitness, quiero generar 50 códigos de un solo uso para una colaboración con un influencer, para que cada uno de sus seguidores tenga un descuento único y poder rastrear la conversión de esa campaña específica.
## Acciones Clave
- Crear una nueva oferta (cupón, pack, promoción).
- Visualizar y filtrar la lista de todas las ofertas (activas, inactivas, programadas, expiradas).
- Editar los parámetros de una oferta existente (ej: extender la fecha de validez, aumentar el límite de usos).
- Desactivar o archivar una promoción que ya no está en uso.
- Consultar las estadísticas de rendimiento de una oferta: número de usos, ingresos generados, clientes que la han redimido.
- Generar un lote de códigos únicos a partir de una plantilla de cupón base.
- Buscar una oferta específica por su nombre o código.
## 🧩 Componentes React Sugeridos
### 1. OfferManagerContainer
Tipo: container | Componente principal que orquesta la página. Gestiona el estado global, como la lista de ofertas, el estado de carga y los errores. Llama al hook 'useOffersAPI' para interactuar con el backend y pasa los datos y funciones a los componentes de presentación.
Estados: offers: Offer[], isLoading: boolean, error: string | null, isModalOpen: boolean, selectedOffer: Offer | null
Dependencias: useOffersAPI
Ejemplo de uso:
```typescript
<OfferManagerContainer />
```

### 2. OfferListTable
Tipo: presentational | Muestra una tabla con todas las ofertas. Incluye columnas para nombre, código, tipo, usos, estado y fechas. Permite filtrar y ordenar. Emite eventos para editar o ver estadísticas de una oferta.
Props:
- offers: 
- Offer[] (requerido) - Array de objetos de oferta para mostrar en la tabla.
- onEdit: 
- (offerId: string) => void (requerido) - Callback que se ejecuta cuando el usuario hace clic en el botón de editar de una oferta.
- onViewStats: 
- (offerId: string) => void (requerido) - Callback que se ejecuta al hacer clic para ver las estadísticas de una oferta.
Estados: filterTerm: string, sortBy: string
Dependencias: TableComponent (from a UI library like Chakra UI or Material-UI), BadgeComponent
Ejemplo de uso:
```typescript
<OfferListTable offers={offersData} onEdit={handleEditOffer} onViewStats={handleViewStats} />
```

### 3. OfferFormModal
Tipo: presentational | Un modal con un formulario para crear o editar una oferta. Muestra campos condicionales basados en el tipo de oferta (cupón o pack). Realiza validación de campos del lado del cliente.
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- onSubmit: 
- (offerData: OfferFormData) => void (requerido) - Callback que se ejecuta con los datos del formulario al enviarlo.
- initialData: 
- Offer | null (opcional) - Datos iniciales para rellenar el formulario en modo de edición.
- availableServices: 
- Service[] (requerido) - Lista de servicios del entrenador para seleccionar a cuáles aplica la oferta.
Estados: formData: OfferFormData, formErrors: Record<string, string>
Dependencias: react-hook-form, zod (for validation), ModalComponent (from UI library)
Ejemplo de uso:
```typescript
<OfferFormModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit} initialData={selectedOffer} availableServices={services} />
```

### 4. useOffersAPI
Tipo: hook | Hook personalizado que encapsula toda la lógica de comunicación con la API de ofertas (GET, POST, PUT, DELETE). Maneja estados de carga y errores de forma centralizada.
Dependencias: axios, react-query (or SWR)
Ejemplo de uso:
```typescript
const { data: offers, isLoading, createOffer } = useOffersAPI();
```
## 🔌 APIs Requeridas
### 1. POST /api/monetizacion/ofertas
Crea una nueva oferta (cupón o pack) para el entrenador autenticado.
Parámetros:
- offerData (
- object, body, requerido): Objeto con todos los detalles de la nueva oferta.
Respuesta:
Tipo: object
Estructura: El objeto de la oferta recién creada, incluyendo su ID asignado por la base de datos.
```json
{
  "id": "offer_12345",
  "name": "Pack Bienvenida",
  "type": "pack",
  "code": null,
  "discountType": "fixed_amount",
  "discountValue": 250,
  "usageLimit": null,
  "usageCount": 0,
  "validFrom": "2024-01-01T00:00:00Z",
  "validTo": null,
  "applicableServiceIds": [
    "service_abc",
    "service_def"
  ],
  "status": "active"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Datos de la oferta inválidos o campos requeridos faltantes.
- 409: 
- Conflict - El código del cupón ya existe.
- 401: 
- Unauthorized - El usuario no está autenticado o no tiene permisos.

### 2. GET /api/monetizacion/ofertas
Obtiene una lista paginada y filtrada de todas las ofertas del entrenador.
Parámetros:
- page (
- number, query, opcional): Número de la página a obtener.
- limit (
- number, query, opcional): Número de ofertas por página.
- status (
- string ('active', 'inactive', 'expired'), query, opcional): Filtra las ofertas por su estado.
- type (
- string ('coupon', 'pack'), query, opcional): Filtra por tipo de oferta.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene un array de ofertas y metadatos de paginación.
```json
{
  "data": [
    {
      "id": "offer_12345",
      "name": "Pack Bienvenida",
      "type": "pack",
      "status": "active",
      "usageCount": 15
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
- Unauthorized - Usuario no autenticado.

### 3. PUT /api/monetizacion/ofertas/{id}
Actualiza los detalles de una oferta existente.
Parámetros:
- id (
- string, path, requerido): ID de la oferta a actualizar.
- updateData (
- object, body, requerido): Objeto con los campos a actualizar.
Respuesta:
Tipo: object
Estructura: El objeto de la oferta completamente actualizado.
```json
{
  "id": "offer_12345",
  "name": "Pack Bienvenida (Actualizado)",
  "status": "inactive"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - No se encontró una oferta con el ID proporcionado.
- 400: 
- Bad Request - Los datos de actualización son inválidos.

### 4. POST /api/monetizacion/ofertas/validar
Valida un código de cupón en el contexto de una compra (ej. checkout). Esta API podría ser accedida por el frontend del cliente.
Parámetros:
- code (
- string, body, requerido): El código del cupón que el cliente ha introducido.
- context (
- object, body, requerido): Contexto de la compra, como los IDs de los servicios en el carrito y el ID del cliente.
Respuesta:
Tipo: object
Estructura: Un objeto que indica si el cupón es válido y los detalles del descuento a aplicar.
```json
{
  "isValid": true,
  "offerId": "offer_abcde",
  "discountType": "percentage",
  "discountValue": 20,
  "message": "Cupón 'VERANO20' aplicado correctamente."
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El código del cupón no existe o no es válido.
- 403: 
- Forbidden - El cupón ha expirado, ha alcanzado su límite de uso, o no es aplicable a los productos del carrito.
## Notas Técnicas
Colecciones backend: offers, offer_usages, services
KPIs visibles: Tasa de Redención de Cupones (%), Ingresos Totales Generados por Ofertas (€), Número de Nuevos Clientes Adquiridos con Ofertas de Captación, Valor Promedio de Compra (AOV) con Descuento vs. sin Descuento, Top 5 Ofertas Más Utilizadas, Número Total de Ofertas Activas
## Documentación Completa
## Resumen
El sistema de **Promociones, Cupones & Packs** es una funcionalidad central del área de **MONETIZACIÓN & OFERTAS** de TrainerERP. Su objetivo principal es dotar a los entrenadores personales de herramientas flexibles y potentes para diseñar, implementar y gestionar su estrategia de precios y marketing. Esta funcionalidad permite crear tres tipos principales de ofertas:
1. **Cupones:** Códigos de descuento (ej. `VERANO20`) que aplican una rebaja porcentual o de cantidad fija. Son ideales para campañas de captación, retención o para colaboraciones específicas.
2. **Packs de Sesiones:** Paquetes de servicios (ej. '10 Sesiones de Entrenamiento') vendidos a un precio total reducido. Fomentan el compromiso a largo plazo del cliente y mejoran el flujo de caja del entrenador.
3. **Promociones Automáticas:** Descuentos que se aplican automáticamente bajo ciertas condiciones (ej. '20% de descuento en tu primer mes'), sin necesidad de que el cliente introduzca un código.
Cada oferta es altamente configurable, permitiendo establecer fechas de validez, límites de uso, aplicabilidad a servicios concretos y mucho más. El sistema también incluye un dashboard analítico para medir el rendimiento de cada oferta, proporcionando datos clave para la toma de decisiones estratégicas.
---
## Flujo paso a paso de uso real
**Caso de Uso:** Un entrenador personal, Carlos, quiere lanzar una campaña de 'Año Nuevo, Vida Nueva' para captar clientes en Enero.
1. **Definición de la Estrategia:** Carlos decide ofrecer un 20% de descuento en su 'Plan de Entrenamiento Mensual Online' a los primeros 30 nuevos clientes que se apunten en Enero.
2. **Creación de la Oferta:**
* Carlos inicia sesión en TrainerERP y navega a `Monetización > Promociones & Ofertas`.
* Hace clic en el botón 'Crear Nueva Oferta' y selecciona el tipo 'Cupón'.
* Rellena el formulario:
* **Nombre de la oferta:** Campaña Año Nuevo 2025
* **Código:** `PROPOSITO25`
* **Tipo de Descuento:** Porcentaje
* **Valor del Descuento:** 20
* **Aplicable a:** Selecciona de una lista su servicio 'Plan de Entrenamiento Mensual Online'.
* **Límite de Usos Totales:** 30
* **Límite de Usos por Cliente:** 1
* **Fecha de Inicio:** 1 de Enero de 2025
* **Fecha de Fin:** 31 de Enero de 2025
* Guarda la oferta. El sistema la muestra en la lista con el estado 'Programada'.
3. **Lanzamiento de la Campaña:** El 1 de Enero, la oferta se activa automáticamente. Carlos utiliza las herramientas de `EMAIL & SMS` y `CONTENIDO & REDES SOCIALES` de TrainerERP para comunicar la promoción a su lista de leads y a sus seguidores, incluyendo el código `PROPOSITO25` y un enlace directo a la página de compra de su plan.
4. **Redención por parte del Cliente:**
* Un lead, Ana, recibe el email. Hace clic en el enlace, que la lleva a la landing page del plan de Carlos.
* Añade el plan al carrito y en la página de checkout, ve un campo que dice '¿Tienes un cupón?'.
* Introduce `PROPOSITO25`. El sistema llama a la API `/api/monetizacion/ofertas/validar` en tiempo real. La API confirma que el cupón es válido, no ha expirado, no ha alcanzado su límite de usos y es aplicable al producto. El precio se actualiza instantáneamente con el 20% de descuento.
* Ana completa el pago.
5. **Seguimiento y Análisis:**
* Carlos vuelve al dashboard de ofertas. Ve que la oferta `PROPOSITO25` ahora tiene '1/30' usos.
* Al hacer clic en la oferta, puede ver una lista de los clientes que la han redimido, incluyendo a Ana. También ve los ingresos generados a través de esta campaña.
* A finales de mes, Carlos analiza que la campaña fue un éxito, adquiriendo 28 nuevos clientes y decide planificar una similar para el verano.
---
## Riesgos operativos y edge cases
- **Apilamiento de Descuentos (Stacking):** Si un cliente tiene acceso a múltiples códigos, ¿cuál se aplica? **Política recomendada:** El sistema solo permitirá un cupón por transacción. Si se introduce un segundo cupón, reemplazará al primero.
- **Edición de Ofertas en Uso:** Si un entrenador edita una oferta (ej. cambia el descuento de 20% a 15%) mientras está activa, ¿qué pasa con los clientes que ya la han visto pero no la han usado? **Solución:** Una vez que una oferta tiene usos, ciertos campos críticos (valor del descuento, tipo) deberían ser bloqueados. Para cambios mayores, se debe archivar la oferta actual y crear una nueva.
- **Suscripciones y Cupones:** ¿Un cupón de descuento en un plan mensual aplica para siempre? **Política recomendada:** Por defecto, todos los cupones deben aplicarse únicamente al primer ciclo de facturación. Se debe incluir una opción avanzada (checkbox) para que el entrenador pueda, si lo desea, hacerlo aplicable a todos los ciclos de la suscripción.
- **Reembolsos:** Si un cliente que usó un cupón solicita un reembolso, la cantidad a reembolsar debe ser el precio final pagado, no el precio original del servicio.
---
## KPIs y qué significan
- **Tasa de Redención (%):** (Usos / Límites de Uso o Usos / Clientes Alcanzados) * 100. Un KPI crucial para medir la efectividad de una oferta. Una tasa alta indica que el descuento es atractivo y la comunicación fue efectiva. Una tasa baja sugiere que la oferta no es competitiva o no llegó a la audiencia correcta.
- **Ingresos Generados por Oferta (€):** Suma total de los ingresos de las transacciones donde se aplicó una oferta específica. Permite al entrenador identificar qué promociones son más rentables.
- **Coste de Adquisición de Cliente (CAC) por Campaña:** Si una campaña con cupón se dirige a nuevos clientes, se puede calcular el CAC dividiendo el coste total de la campaña (incluyendo el valor de los descuentos otorgados) entre el número de nuevos clientes adquiridos. Ayuda a evaluar el ROI del marketing.
- **Uplift en Ventas:** Comparación de las ventas de un servicio durante el período de una promoción vs. un período similar sin promoción. Mide el impacto directo de la oferta en el volumen de negocio.
---
## Diagramas de Flujo (Mermaid)
**Flujo de Creación de Oferta:**
mermaid
graph TD
A[Usuario en /dashboard/ofertas] --> B{Clic en 'Crear Oferta'};
B --> C[Abre OfferFormModal];
C --> D{Selecciona Tipo: Cupón o Pack};
D -- Cupón --> E[Rellena campos: código, %, límite];
D -- Pack --> F[Rellena campos: precio fijo, servicios incluidos];
E --> G[Selecciona servicios aplicables];
F --> G;
G --> H{Clic en 'Guardar'};
H --> I[Valida datos en el frontend];
I -- Válido --> J[POST /api/monetizacion/ofertas];
J -- Éxito 201 --> K[Cierra Modal y actualiza la lista];
J -- Error 400/409 --> L[Muestra error en el formulario];
I -- Inválido --> M[Muestra errores de validación en el formulario];
**Flujo de Validación de Cupón en Checkout:**
mermaid
graph TD
A[Cliente en página de checkout] --> B[Introduce código en campo de cupón];
B --> C{Clic en 'Aplicar'};
C --> D[Frontend llama a POST /api/monetizacion/ofertas/validar con el código];
D --> E{API verifica el código: existe? activo? no expirado? no ha alcanzado límite? aplica al carrito?};
E -- Sí, es Válido --> F[API responde con Éxito 200 y detalles del descuento];
F --> G[Frontend actualiza el total del carrito y muestra mensaje de éxito];
E -- No, es Inválido --> H[API responde con Error 403/404 y motivo];
H --> I[Frontend muestra mensaje de error al cliente. Ej: 'Este cupón ha expirado'];
