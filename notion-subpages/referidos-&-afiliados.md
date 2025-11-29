# Referidos & Afiliados

**Página padre:** Hola

---

# Referidos & Afiliados
👥 Tipo de Usuario: Entrenador Personal (Administrador), Cliente, Entrenador Asociado (Afiliado)
Esta funcionalidad tiene vistas y capacidades distintas según el rol. El 'Entrenador Personal' tiene acceso de administrador para crear, configurar y gestionar todos los programas de referidos y afiliados, ver analíticas globales y procesar pagos. El 'Cliente' tiene una vista simplificada en su portal personal donde puede ver su código de referido único, compartirlo fácilmente y rastrear el estado de sus referidos y las recompensas obtenidas. El 'Entrenador Asociado' (o cualquier otro profesional afiliado, como un nutricionista) tiene un dashboard de afiliado dedicado para acceder a su enlace único, materiales promocionales, y ver estadísticas detalladas de clics, conversiones y comisiones generadas.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/marketing/referrals
## Descripción Funcional
La página de 'Referidos & Afiliados' es un centro de control integral diseñado para transformar la base de clientes y la red profesional del entrenador en un motor de crecimiento automatizado y de bajo costo. Este módulo permite a los entrenadores personales diseñar e implementar dos tipos de programas de crecimiento viral: programas de referidos para clientes existentes y programas de afiliados para colaboradores estratégicos. Para los clientes, el sistema genera automáticamente un código o enlace de referido único que pueden compartir con amigos, familiares o en sus redes sociales. El entrenador puede configurar recompensas personalizadas, como una sesión de entrenamiento gratuita, un descuento en la próxima mensualidad, o acceso a contenido premium, tanto para el cliente que refiere como para el nuevo cliente que se registra. Esto no solo incentiva el marketing de boca a boca, la fuente de clientes más confiable en el sector del fitness, sino que también aumenta la lealtad y retención del cliente actual. Para la red profesional, el sistema permite crear programas de afiliados para nutricionistas, fisioterapeutas u otros negocios complementarios. Estos afiliados reciben un enlace de seguimiento y ganan una comisión (configurable como un porcentaje o una cantidad fija) por cada cliente que refieren, creando un canal de adquisición de clientes de alta calidad y mutuamente beneficioso. La página ofrece dashboards completos para que el entrenador monitoree el rendimiento de cada programa, rastree conversiones en tiempo real y gestione los pagos de comisiones, todo dentro de TrainerERP.
## Valor de Negocio
El valor de negocio de la funcionalidad de 'Referidos & Afiliados' es inmenso y multifacético, posicionándola como una herramienta de crecimiento estratégico en lugar de una simple característica. Principalmente, reduce drásticamente el Costo de Adquisición de Clientes (CAC). En lugar de invertir grandes sumas en publicidad digital con resultados inciertos, los entrenadores pueden aprovechar su activo más valioso: la confianza de sus clientes actuales y la autoridad de sus socios profesionales. El marketing de boca a boca es intrínsecamente más efectivo y económico. En segundo lugar, aumenta el Valor de Vida del Cliente (LTV). Al recompensar a los clientes por su lealtad y promoción, se fortalece la relación y se reduce la tasa de abandono. Un cliente que ha referido a un amigo está mucho más comprometido con el servicio. Además, el programa de afiliados abre nuevos canales de marketing de alto rendimiento que serían difíciles de acceder de otra manera. Un nutricionista que recomienda a un entrenador crea una transferencia de confianza inmediata, resultando en leads de mayor calidad y con mayor probabilidad de conversión. Finalmente, automatiza un proceso de marketing que de otro modo sería manual y difícil de rastrear, liberando tiempo valioso para que el entrenador se concentre en lo que mejor sabe hacer: entrenar a sus clientes.
## Prioridad / Roadmap
- Impacto: alto
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como Entrenador Personal, quiero crear y personalizar un programa de referidos donde mis clientes actuales obtengan un 25% de descuento en su próximo mes por cada amigo que se inscriba, para así incentivar el crecimiento orgánico de mi negocio.
- Como Cliente, quiero acceder a mi portal y encontrar fácilmente mi enlace de referido único, con botones para compartirlo directamente en WhatsApp e Instagram, para poder ganar recompensas recomendando a mi entrenador.
- Como Entrenador Personal, quiero establecer un programa de afiliados con un fisioterapeuta local, ofreciéndole una comisión del 15% sobre los primeros 3 meses de pago de cualquier cliente que él me envíe, para formalizar y escalar nuestra colaboración.
- Como Fisioterapeuta (Afiliado), quiero tener un dashboard donde pueda rastrear cuántas personas han hecho clic en mi enlace, cuántas se han convertido en clientes de pago y cuál es mi comisión acumulada, para poder medir la efectividad de nuestra alianza.
- Como Entrenador Personal, quiero ver un informe que me muestre qué clientes son mis mejores 'embajadores' (los que más refieren) y cuántos ingresos ha generado cada programa (referidos vs. afiliados), para poder optimizar mis estrategias de marketing y recompensar a mis promotores más leales.
## Acciones Clave
- Configurar un nuevo programa de referidos (definir recompensas para referente y referido).
- Establecer un nuevo programa de afiliados (definir estructura de comisiones, duración de cookies y términos).
- Visualizar el dashboard principal con un resumen del rendimiento de todos los programas.
- Revisar y aprobar las recompensas de referidos y los pagos de comisiones pendientes.
- Invitar a profesionales específicos para que se unan al programa de afiliados.
- Acceder (como cliente/afiliado) al enlace/código único y a los materiales promocionales para compartir.
## 🧩 Componentes React Sugeridos
### 1. ProgramBuilder
Tipo: container | Un componente tipo 'wizard' o formulario complejo que permite al Entrenador Personal configurar todos los detalles de un nuevo programa de referidos o afiliados. Maneja la lógica de estado para las diferentes opciones de recompensa y comisión.
Props:
- programType: 
- 'client_referral' | 'affiliate' (requerido) - Determina qué tipo de programa se está configurando, mostrando campos diferentes.
- onSave: 
- (programData: Program) => void (requerido) - Callback que se ejecuta al guardar el programa, enviando los datos al API.
- initialData: 
- Program | null (opcional) - Datos iniciales para pre-rellenar el formulario en modo de edición.
Estados: rewardType, rewardValue, commissionPercentage, cookieDuration, programTerms
Dependencias: react-hook-form, zod
Ejemplo de uso:
```typescript
<ProgramBuilder programType='affiliate' onSave={handleCreateProgram} />
```

### 2. ReferralStatsCard
Tipo: presentational | Una tarjeta visualmente atractiva que muestra una métrica clave (KPI) con su título, valor, y un indicador de tendencia (subida/bajada). Usado en el dashboard principal.
Props:
- title: 
- string (requerido) - El título del KPI, ej: 'Ingresos por Referidos'.
- value: 
- string | number (requerido) - El valor numérico del KPI a mostrar.
- trend: 
- 'up' | 'down' | 'neutral' (opcional) - Indica la tendencia para mostrar un icono de flecha.
- tooltipText: 
- string (opcional) - Texto explicativo que aparece al pasar el cursor sobre la tarjeta.
Dependencias: recharts (para mini-gráfico opcional)
Ejemplo de uso:
```typescript
<ReferralStatsCard title='Conversiones este mes' value={25} trend='up' />
```

### 3. ShareableLink
Tipo: presentational | Un componente simple para la vista del Cliente y del Afiliado, que muestra su código/enlace único con botones para copiar al portapapeles y compartir en redes sociales populares.
Props:
- link: 
- string (requerido) - El enlace de referido/afiliado completo.
- code: 
- string (opcional) - El código de referido corto (opcional).
Estados: isCopied
Dependencias: react-copy-to-clipboard
Ejemplo de uso:
```typescript
<ShareableLink link='https://trainererp.com/signup?ref=johnsmith123' code='JOHNSMITH123' />
```

### 4. useReferralData
Tipo: hook | Un hook personalizado que encapsula la lógica de fetching, caching y estado para los datos de referidos. Se adapta al rol del usuario para solicitar los datos correctos.
Props:
- role: 
- 'trainer' | 'client' | 'affiliate' (requerido) - Determina qué endpoints de la API se deben llamar.
Estados: isLoading, error, data
Dependencias: @tanstack/react-query
Ejemplo de uso:
```typescript
const { data, isLoading } = useReferralData({ role: 'trainer' });
```
## 🔌 APIs Requeridas
### 1. POST /api/v1/marketing/referral-programs
Crea un nuevo programa de referidos o de afiliados para el entrenador autenticado.
Parámetros:
- programData (
- object, body, requerido): Objeto con toda la configuración del programa.
Respuesta:
Tipo: object
Estructura: Devuelve el objeto del programa recién creado, incluyendo su ID único.
```json
{
  "id": "prog_a1b2c3d4",
  "trainerId": "trainer_123",
  "type": "client_referral",
  "name": "Referidos Verano 2024",
  "isActive": true,
  "reward": {
    "type": "discount_percentage",
    "referrer_value": 20,
    "referee_value": 20
  },
  "createdAt": "2024-05-21T10:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Datos del programa inválidos o faltantes.
- 403: 
- Forbidden - El usuario no tiene permisos para crear programas (no es un Entrenador).

### 2. GET /api/v1/marketing/referrals/overview
Obtiene las estadísticas agregadas de todos los programas de referidos y afiliados para el entrenador.
Parámetros:
- timeframe (
- string, query, opcional): Define el rango de tiempo para las estadísticas (ej: '7d', '30d', '90d').
Respuesta:
Tipo: object
Estructura: Un objeto con KPIs clave y listas de los mejores participantes.
```json
{
  "kpis": {
    "totalConversions": 42,
    "totalRevenue": 4200.5,
    "conversionRate": 15.5,
    "referralCAC": 15.75
  },
  "topReferrers": [
    {
      "clientId": "client_abc",
      "name": "Ana García",
      "conversions": 5
    },
    {
      "clientId": "client_def",
      "name": "Carlos Ruiz",
      "conversions": 3
    }
  ],
  "topAffiliates": [
    {
      "affiliateId": "aff_xyz",
      "name": "NutriFit Pro",
      "revenue": 1200
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - Token de autenticación inválido o ausente.

### 3. GET /api/v1/me/referral-data
Obtiene los datos de referidos específicos para el usuario autenticado (ya sea un cliente o un afiliado).
Respuesta:
Tipo: object
Estructura: Devuelve el código/enlace único del usuario, sus estadísticas personales y una lista de sus referidos/conversiones.
```json
{
  "userType": "client",
  "referralCode": "ANAGARCIA25",
  "referralLink": "https://trainererp.com/signup?ref=anagarcia25",
  "stats": {
    "clicks": 58,
    "signups": 5,
    "pendingRewards": 1,
    "earnedRewards": "4 sesiones gratis"
  },
  "activity": [
    {
      "referredName": "Laura M.",
      "status": "rewarded",
      "date": "2024-04-15"
    },
    {
      "referredName": "Pedro S.",
      "status": "pending",
      "date": "2024-05-18"
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El usuario no está inscrito en ningún programa de referidos.

### 4. POST /api/v1/payouts/affiliate
Inicia el proceso de pago de comisiones para un afiliado específico.
Parámetros:
- affiliateId (
- string, body, requerido): ID del afiliado al que se le va a pagar.
- amount (
- number, body, requerido): Monto a pagar.
- commissionIds (
- array<string>, body, requerido): Array de IDs de las comisiones que se están incluyendo en este pago.
Respuesta:
Tipo: object
Estructura: Devuelve un objeto de pago con su estado.
```json
{
  "payoutId": "pay_xyz987",
  "status": "processing",
  "amount": 250.75,
  "currency": "EUR",
  "affiliateId": "aff_xyz",
  "createdAt": "2024-05-21T11:00:00Z"
}
```
Autenticación: Requerida
Errores posibles:
- 402: 
- Payment Required - Fallo en la integración con el procesador de pagos (ej. Stripe Connect).
- 409: 
- Conflict - Una o más de las comisiones ya han sido pagadas.
## Notas Técnicas
Colecciones backend: referralPrograms, affiliatePrograms, referrals, affiliateClicks, commissionPayouts, userReferralData
KPIs visibles: Tasa de Conversión de Referidos (%), Ingresos Totales Generados por Canal (Referidos vs. Afiliados), Costo de Adquisición de Cliente (CAC) por Programa, Tasa de Participación del Programa (%), Top 5 Clientes Referentes (por número de conversiones), Top 5 Afiliados (por ingresos generados)
## Documentación Completa
## Resumen
El módulo de **Referidos y Afiliados** es una herramienta de crecimiento estratégico integrada en TrainerERP, diseñada para que los entrenadores personales aprovechen el poder del marketing de boca a boca y las alianzas profesionales. Esta funcionalidad permite la creación y gestión de dos tipos de programas:
1. **Programa de Referidos para Clientes:** Incentiva a los clientes actuales a recomendar el servicio a sus amigos y familiares a cambio de recompensas (ej. descuentos, sesiones gratis). Esto convierte a la base de clientes en una fuerza de ventas entusiasta y auténtica, reduciendo el coste de adquisición y aumentando la retención.
2. **Programa de Afiliados para Profesionales:** Permite a los entrenadores colaborar con otros profesionales del sector (nutricionistas, fisioterapeutas, tiendas de suplementos) que pueden referir clientes a cambio de una comisión. Esto abre canales de adquisición de leads de alta calidad, basados en la confianza y la autoridad.
El sistema automatiza la generación de enlaces y códigos únicos, el seguimiento de clics y conversiones, la asignación de recompensas y la gestión de comisiones, proporcionando dashboards claros y accionables para el entrenador, el cliente y el afiliado.
---
## Flujo paso a paso de uso real
**Escenario 1: El Entrenador crea un programa de referidos para clientes.**
1. **Acceso:** El Entrenador `Carlos` inicia sesión en su dashboard de TrainerERP.
2. **Navegación:** Se dirige a `Marketing > Referidos y Afiliados`.
3. **Creación:** Hace clic en "Crear Nuevo Programa" y selecciona la opción "Programa de Referidos para Clientes".
4. **Configuración:**
* **Nombre del Programa:** "Recompensa Doble 2024".
* **Recompensa para el Referente (cliente actual):** Selecciona `Descuento en suscripción` y establece el valor en `25%` para el `próximo pago`.
* **Recompensa para el Referido (nuevo cliente):** Selecciona `Descuento en suscripción` y establece el valor en `25%` para el `primer pago`.
* **Términos:** Añade un texto breve: "La recompensa se aplica una vez que tu amigo complete su primer mes de pago".
5. **Activación:** Guarda y activa el programa. El sistema notifica automáticamente a todos sus clientes activos sobre el nuevo programa y su código de referido ya está visible en sus portales de cliente.
**Escenario 2: Una cliente refiere a un amigo.**
1. **Acceso del Cliente:** La cliente `Ana` entra a su portal de cliente en TrainerERP para ver su plan de entrenamiento.
2. **Visualización:** Ve un widget destacado: "¡Gana un 25% de descuento!" con su código `ANA25` y un enlace.
3. **Compartir:** Copia el enlace y se lo envía a su amigo `David` por WhatsApp.
4. **Registro del Referido:** `David` hace clic en el enlace, que lo lleva a la página de registro de Carlos, con el código `ANA25` ya aplicado en el campo de descuento.
5. **Conversión:** `David` se registra en un plan de entrenamiento mensual. El sistema aplica inmediatamente un 25% de descuento en su primer pago.
6. **Asignación de Recompensa:** El sistema registra la conversión exitosa. En el próximo ciclo de facturación de `Ana`, se aplicará automáticamente un descuento del 25% en su cuota. `Ana` recibe una notificación por correo electrónico felicitándola por su referido exitoso.
---
## Riesgos operativos y edge cases
* **Auto-referidos y Fraude:** Un usuario podría intentar registrarse a sí mismo con un correo diferente para obtener el descuento. **Mitigación:** Implementar comprobaciones básicas como la coincidencia de IP o el uso de cookies. Además, el entrenador debe tener una vista para aprobar manualmente las recompensas, pudiendo investigar casos sospechosos.
* **Cancelaciones y Reembolsos:** Un nuevo cliente referido paga, el referente recibe su recompensa, y luego el nuevo cliente solicita un reembolso. **Mitigación:** La política del programa debe definir claramente que las recompensas solo se consolidan después de que expire el período de reembolso (ej. 14 o 30 días). Las comisiones de afiliados deben estar en un estado "pendiente" durante este período antes de ser "aprobadas" para el pago.
* **Acumulación de Descuentos:** ¿Qué pasa si un cliente refiere a 5 personas en un mes? ¿Obtiene un 125% de descuento? **Mitigación:** El sistema debe permitir al entrenador establecer límites, como "un máximo de 1 recompensa por ciclo de facturación" o convertir las recompensas adicionales en un crédito para futuros meses.
* **Atribución de Afiliados:** Un cliente potencial hace clic en el enlace del afiliado A, no se registra, y una semana después hace clic en un anuncio de Google del entrenador y se registra. ¿Quién obtiene el crédito? **Mitigación:** Implementar una política de atribución clara y consistente, como "Último clic no directo", con una ventana de atribución de 30 días (configurable). Esta política debe ser transparente para todos los afiliados.
---
## KPIs y qué significan
* **Tasa de Participación (Participation Rate):** `(Clientes que han compartido su enlace / Clientes totales) * 100`. Indica qué tan atractivo y bien comunicado es el programa. Una tasa baja sugiere que los clientes no lo conocen o la recompensa no es lo suficientemente motivadora.
* **Tasa de Conversión de Referidos (Referral Conversion Rate):** `(Nuevos clientes registrados con código / Clics en enlaces de referido) * 100`. Mide la efectividad del programa para convertir el interés en acción. Una tasa alta significa que la oferta es convincente y el proceso de registro es fácil.
* **Velocidad de Referidos (Referral Velocity):** El número de referidos exitosos por período de tiempo (ej. por semana o mes). Es un indicador del momentum y la salud del crecimiento orgánico. Una velocidad creciente es una señal muy positiva.
* **Ingresos por Referidos/Afiliados:** Suma total de los ingresos generados por los clientes que llegaron a través de estos canales. Este es el KPI de ROI más directo, que muestra el valor monetario del programa.
* **CAC del Programa (Customer Acquisition Cost):** `(Valor total de recompensas y comisiones pagadas / Número de nuevos clientes adquiridos)`. Este coste debe compararse con el CAC de otros canales (ej. anuncios de Facebook, Google Ads). El objetivo es que el CAC de referidos sea significativamente más bajo.
---
## Diagramas de Flujo (Mermaid)
**Flujo de Atribución de un Referido:**
mermaid
graph TD
A[Usuario hace clic en enlace de referido/afiliado] --> B{¿Cookie de atribución ya existe?};
B -- No --> C[Establecer nueva cookie con ID de referente y fecha de expiración de 30 días];
B -- Sí --> D[Sobrescribir cookie existente con nuevo ID de referente (política de último clic)];
C --> E[Redirigir al usuario a la página de registro];
D --> E;
E --> F[Usuario completa el formulario de registro];
F --> G{¿Hay una cookie de atribución válida y no expirada?};
G -- Sí --> H[Asociar nuevo cliente con el referente/afiliado];
H --> I[Aplicar descuento/beneficio al nuevo cliente];
I --> J[Marcar referido como 'convertido' y poner recompensa/comisión en estado 'pendiente'];
G -- No --> K[Proceso de registro estándar sin atribución];
