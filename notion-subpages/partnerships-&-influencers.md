# Partnerships & Influencers

**Página padre:** Hola

---

# Partnerships & Influencers
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado
Esta funcionalidad está diseñada principalmente para los entrenadores que gestionan el negocio (Administradores y Asociados). Les permite establecer, gestionar y monetizar relaciones estratégicas con otros profesionales e influencers, actuando como una herramienta de crecimiento y expansión del negocio. Los clientes no interactúan directamente con esta sección.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/partnerships
## Descripción Funcional
La página de 'Partnerships & Influencers' es un centro de mando estratégico diseñado para que los entrenadores personales transformen su negocio de una operación individual a un ecosistema de bienestar conectado. Este módulo permite formalizar y gestionar colaboraciones con profesionales complementarios como nutricionistas, fisioterapeutas, psicólogos deportivos, y otros coaches, así como con influencers del sector fitness para campañas de marketing. El sistema proporciona herramientas para crear acuerdos de colaboración, incluyendo la definición de comisiones por referidos (tanto enviados como recibidos). Cada partner recibe un perfil dentro de la plataforma, donde se pueden almacenar sus datos de contacto, especialidad y los términos del acuerdo. La funcionalidad clave es la generación de enlaces de seguimiento únicos (referral links) para cada partner o campaña de influencer, permitiendo un tracking preciso de cada lead o cliente que llega a través de su red. Esto elimina las conjeturas y las hojas de cálculo manuales, proporcionando un dashboard en tiempo real que muestra el rendimiento de cada colaboración: referidos enviados, referidos convertidos, comisiones generadas, y el valor de vida del cliente (LTV) proveniente de cada canal. Es más que un simple directorio; es una herramienta de crecimiento que abre nuevas vías de ingresos y mejora la propuesta de valor para los clientes, ofreciéndoles un servicio más holístico.
## Valor de Negocio
El valor de negocio de la funcionalidad 'Partnerships & Influencers' es multifacético y crucial para la escalabilidad del entrenador moderno. Primero, establece nuevos flujos de ingresos pasivos y activos a través de comisiones por referir clientes a servicios complementarios (nutrición, fisioterapia), convirtiendo la red de contactos del entrenador en un activo monetizable. Segundo, mejora drásticamente la retención y el valor del cliente (LTV) al permitir que el entrenador ofrezca una solución de bienestar integral; en lugar de perder un cliente con una necesidad específica (ej. una lesión), puede referirlo a un partner de confianza, manteniendo al cliente dentro de su ecosistema. Tercero, funciona como un potente motor de adquisición de clientes, ya que las colaboraciones son bidireccionales, generando un flujo constante de nuevos leads cualificados desde la red de partners. Cuarto, al colaborar con influencers, los entrenadores pueden amplificar su alcance y construir prueba social a una escala que sería imposible de lograr orgánicamente en el corto plazo. Finalmente, profesionaliza la gestión de colaboraciones, pasando de acuerdos informales a un sistema transparente y medible que fomenta la confianza y relaciones a largo plazo con los partners.
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: media
- Fase recomendada: Post-MVP
## User Stories
- Como entrenador personal, quiero añadir a mi fisioterapeuta de confianza como partner en el sistema para poder referirle clientes lesionados y hacer seguimiento de su recuperación.
- Como coach online, quiero generar un enlace de afiliado único para una influencer de Instagram, para que promocione mi reto de 21 días y yo pueda rastrear cuántas inscripciones genera y pagarle su comisión automáticamente.
- Como dueño de un estudio de entrenamiento, quiero tener un dashboard que me muestre qué partners (nutricionistas, coaches, etc.) nos envían más clientes cualificados cada mes.
- Como entrenador independiente, quiero configurar un acuerdo de comisión del 15% sobre el primer mes para un nutricionista al que le envío clientes, y que el sistema calcule automáticamente el monto a pagar.
- Como gestor de un centro de fitness, quiero poder registrar manualmente un referido que llegó por recomendación de 'boca a boca' de un gimnasio aliado, para atribuirle correctamente la nueva alta.
## Acciones Clave
- Añadir, editar y archivar un nuevo Partner (Nutricionista, Fisio, Influencer).
- Configurar los términos de un acuerdo de partnership (ej. % de comisión, tipo de comisión, duración).
- Generar y compartir enlaces de seguimiento únicos por partner o por campaña.
- Visualizar el dashboard de rendimiento con métricas de referidos, conversiones y comisiones.
- Registrar un referido de forma manual (tanto enviado como recibido).
- Gestionar el estado de las comisiones (pendiente, pagada, recibida).
- Acceder al perfil de un partner para ver su historial de colaboración y comunicación.
## 🧩 Componentes React Sugeridos
### 1. PartnersDashboardContainer
Tipo: container | Componente principal que orquesta la página. Realiza las llamadas a la API para obtener la lista de partners, las estadísticas generales y maneja el estado global de la sección, como filtros y modales abiertos.
Props:
- trainerId: 
- string (requerido) - ID del entrenador actualmente logueado para filtrar los datos.
Estados: partnersList, kpiData, isLoading, error, isAddPartnerModalOpen
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
<PartnersDashboardContainer trainerId={currentUser.id} />
```

### 2. PartnersList
Tipo: presentational | Muestra una tabla o una lista de tarjetas con todos los partners. Permite ordenar y filtrar. Cada item de la lista tiene acciones rápidas como 'Ver Detalles' o 'Generar Link'.
Props:
- partners: 
- Partner[] (requerido) - Array de objetos de partners a mostrar.
- onSelectPartner: 
- (partnerId: string) => void (requerido) - Callback que se ejecuta al seleccionar un partner para ver sus detalles.
Dependencias: shadcn/ui (Table), lucide-react (Icons)
Ejemplo de uso:
```typescript
<PartnersList partners={partnersData} onSelectPartner={handleShowDetails} />
```

### 3. AddPartnerModal
Tipo: container | Un modal con un formulario para añadir un nuevo partner. Maneja la validación de los campos y la llamada a la API para la creación del nuevo registro.
Props:
- isOpen: 
- boolean (requerido) - Controla la visibilidad del modal.
- onClose: 
- () => void (requerido) - Función para cerrar el modal.
- onPartnerAdded: 
- (newPartner: Partner) => void (requerido) - Callback que se ejecuta después de añadir un partner exitosamente.
Estados: formData, validationErrors, isSubmitting
Dependencias: react-hook-form, zod
Ejemplo de uso:
```typescript
<AddPartnerModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onPartnerAdded={refreshPartnersList} />
```

### 4. usePartnershipsApi
Tipo: hook | Hook personalizado que encapsula toda la lógica de comunicación con la API de partnerships. Expone funciones para obtener, crear, y actualizar partners y referidos, además de manejar el estado de carga y errores.
Estados: isLoading, error
Dependencias: react-query
Ejemplo de uso:
```typescript
const { data: partners, isLoading, createPartner } = usePartnershipsApi(trainerId);
```
## 🔌 APIs Requeridas
### 1. GET /api/partnerships/partners
Obtiene la lista de todos los partners asociados al entrenador autenticado. Permite filtrar por tipo y estado.
Parámetros:
- type (
- string, query, opcional): Filtra por tipo de partner ('professional' o 'influencer').
- status (
- string, query, opcional): Filtra por estado ('active' o 'inactive').
Respuesta:
Tipo: array
Estructura: Un array de objetos Partner, cada uno con { id, name, type, specialty, totalReferrals, totalCommissions }.
```json
[
  {
    "id": "part_123",
    "name": "Ana Morales - Nutricionista",
    "type": "professional",
    "specialty": "Nutrición Deportiva",
    "totalReferrals": 15,
    "totalCommissions": 450
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El token de autenticación es inválido o no se proporcionó.
- 500: 
- Internal Server Error - Error inesperado en el servidor.

### 2. POST /api/partnerships/partners
Crea un nuevo partner y un acuerdo inicial.
Parámetros:
- partnerData (
- object, body, requerido): Objeto con la información del nuevo partner y su acuerdo.
Respuesta:
Tipo: object
Estructura: El objeto del partner recién creado.
```json
{
  "id": "part_456",
  "name": "Carlos Ruiz - Fisioterapeuta",
  "type": "professional",
  "contact": {
    "email": "carlos@fisio.com"
  },
  "agreement": {
    "commissionType": "fixed",
    "commissionValue": 50
  }
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Datos incompletos o con formato incorrecto en el body.
- 409: 
- Conflict - Ya existe un partner con el mismo email.

### 3. POST /api/partnerships/partners/{partnerId}/referral-link
Genera o recupera el enlace de seguimiento único para un partner específico.
Parámetros:
- partnerId (
- string, path, requerido): ID del partner para el cual generar el enlace.
Respuesta:
Tipo: object
Estructura: Un objeto que contiene el enlace de seguimiento.
```json
{
  "referralLink": "https://trainererp.com/signup?ref=part_123_abc"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El partner con el ID especificado no existe.

### 4. GET /api/partnerships/referrals
Obtiene una lista de todos los referidos, con opciones de filtrado por partner, dirección y estado.
Parámetros:
- partnerId (
- string, query, opcional): Filtra los referidos de un partner específico.
- direction (
- string, query, opcional): Filtra por dirección ('sent' o 'received').
Respuesta:
Tipo: array
Estructura: Array de objetos de referidos con detalles del cliente, estado y comisión.
```json
[
  {
    "id": "ref_789",
    "partnerName": "Ana Morales - Nutricionista",
    "clientName": "Lucía Pérez",
    "direction": "sent",
    "status": "converted",
    "conversionDate": "2023-10-26T10:00:00Z",
    "commission": 45
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - Acceso no autorizado.
## Notas Técnicas
Colecciones backend: partners (partnerId, trainerId, name, contactInfo, type: ['professional', 'influencer'], specialty, status: ['active', 'inactive']), agreements (agreementId, partnerId, trainerId, commissionType: ['percentage', 'fixed'], commissionValue, terms, effectiveDate), referrals (referralId, partnerId, trackingCode, referredClientInfo, direction: ['sent', 'received'], status: ['pending', 'converted', 'rejected'], conversionDate, commissionAmount), payouts (payoutId, partnerId, trainerId, amount, status: ['due', 'paid'], paymentDate, relatedReferralIds)
KPIs visibles: Total de Partners Activos, Referidos Enviados vs. Convertidos (últimos 30/90 días), Referidos Recibidos vs. Convertidos (últimos 30/90 días), Tasa de Conversión por Partner, Comisiones Totales Generadas (Pendientes de Pago), Ingresos Totales por Referidos Recibidos, Top 5 Partners (por conversiones o por comisiones generadas)
## Documentación Completa
## Resumen
El módulo de **Partnerships & Influencers** es una herramienta de crecimiento estratégico integrada en TrainerERP, diseñada para empoderar a los entrenadores personales a expandir su negocio más allá de la gestión de clientes. Permite formalizar, rastrear y monetizar colaboraciones con otros profesionales del sector del bienestar (nutricionistas, fisioterapeutas) y con influencers de fitness. La funcionalidad principal se centra en la gestión de referidos bidireccionales, el cálculo automático de comisiones y el análisis del rendimiento de cada socio. Al transformar una red de contactos informal en un ecosistema estructurado, los entrenadores pueden crear nuevas fuentes de ingresos, aumentar la retención de clientes ofreciendo un servicio holístico y adquirir nuevos clientes a través de canales de confianza. Este módulo es fundamental para el entrenador que busca escalar su marca personal y posicionarse como un centro de referencia en salud y fitness.
---
## Flujo paso a paso de uso real
**Escenario 1: Colaboración con un Profesional (Nutricionista)**
1. **Registro del Partner**: Juan, un entrenador personal, se reúne con Sofía, una nutricionista. Acuerdan colaborar. Juan entra a su dashboard de TrainerERP, va a la sección 'Partnerships' y hace clic en 'Añadir Partner'.
2. **Configuración del Acuerdo**: Rellena los datos de Sofía (nombre, email, especialidad) y la clasifica como 'Profesional'. En la sección de 'Acuerdo', establece una comisión del `15%` sobre el primer pago de cada cliente que él le envíe.
3. **Referencia de un Cliente**: Un cliente de Juan, David, menciona que necesita ayuda con su dieta. Juan abre el perfil de Sofía en TrainerERP, copia su 'Enlace de Referido' y se lo envía a David por WhatsApp.
4. **Tracking y Conversión**: David hace clic en el enlace, que lo lleva a la página de servicios de Sofía (integrada con un píxel o un parámetro UTM). David contrata un plan de nutrición. El sistema de Sofía (o una entrada manual) notifica la conversión.
5. **Cálculo de Comisión**: TrainerERP registra que el referido de David se ha convertido. Si el plan de Sofía costó 200€, el sistema calcula automáticamente una comisión de 30€ (15% de 200€) para Juan y la añade al dashboard de comisiones como 'Pendiente de Cobro'.
6. **Liquidación**: A final de mes, Juan ve que tiene 150€ pendientes de cobro de Sofía. Le envía la factura y, una vez Sofía le paga, Juan marca esas comisiones como 'Recibidas' en el sistema para mantener un registro limpio.
**Escenario 2: Colaboración con un Influencer**
1. **Acuerdo con Influencer**: María, una coach online, contacta a Alex, un influencer de fitness con 50k seguidores. Acuerdan que Alex promocionará el nuevo 'Reto de 6 Semanas' de María por una comisión del 20% por cada inscripción.
2. **Generación de Campaña**: María añade a Alex como 'Influencer' en TrainerERP. En lugar de un enlace genérico, podría crear un enlace específico para la campaña 'Reto6Semanas'.
3. **Promoción**: Alex publica historias y un post en Instagram con el enlace de afiliado. Sus seguidores hacen clic y se registran en la landing page del reto de María.
4. **Atribución Automática**: Cada vez que alguien se inscribe a través de ese enlace, TrainerERP atribuye la venta a Alex y calcula la comisión del 20% sobre el precio del reto. El dashboard de María se actualiza en tiempo real, mostrando las inscripciones y las comisiones generadas por la campaña de Alex.
---
## Riesgos operativos y edge cases
* **Atribución Múltiple**: ¿Qué pasa si un cliente hace clic en el enlace del influencer Alex, pero dos días después hace clic en el enlace del nutricionista Sofía antes de comprar? El sistema debe tener una política de atribución clara, por defecto 'Last Click Wins' (el último enlace antes de la conversión se lleva el 100% de la comisión), con una ventana de atribución configurable (ej. 30 días).
* **Reembolsos y Contracargos**: Un cliente referido por Alex pide un reembolso. El sistema debe tener un flujo para anular la comisión correspondiente ('clawback'). El acuerdo con el partner debe especificar cómo se manejan estas situaciones (ej. las comisiones solo se validan después del período de garantía de 30 días).
* **Referidos Offline**: Un cliente menciona que fue referido por 'Sofía la nutricionista' pero no usó el enlace. El entrenador necesita una forma sencilla de registrar manualmente este referido y atribuirlo a Sofía. Esto requiere un proceso de validación para evitar abusos.
* **Privacidad de Datos**: Al referir un cliente, es crucial cumplir con GDPR. El flujo de referido debe incluir un paso de consentimiento explícito del cliente para compartir su información de contacto con el partner.
---
## KPIs y qué significan
* **Tasa de Conversión por Partner**: (`Referidos Convertidos` / `Referidos Enviados`) * 100. Este es el KPI más importante. Una tasa alta indica una gran alineación entre tu clientela y los servicios del partner. Una tasa baja puede significar que la oferta del partner no es atractiva o que la calidad de los referidos no es buena. Sirve para optimizar con qué partners trabajar más estrechamente.
* **Comisiones Generadas (Pendientes)**: El total de dinero que tus partners te deben o que tú les debes. Es una métrica de flujo de caja. Ayuda a prever ingresos y a gestionar los pagos a tiempo para mantener buenas relaciones.
* **Valor de Vida del Cliente (LTV) por Partner**: Calcula el LTV promedio de los clientes que llegaron a través de un partner específico. Un LTV alto indica que el partner está enviando clientes de alta calidad y lealtad, lo que lo convierte en un socio estratégico muy valioso.
* **Velocidad de Referido**: El tiempo promedio que tarda un referido en convertirse. Una velocidad rápida es un indicador de un proceso de venta eficiente por parte del partner.
* **Dependencia de Partners**: El porcentaje de tus nuevos clientes que proviene de tu red de partners. Un número saludable (ej. 20-30%) indica una buena diversificación de canales de adquisición, pero un número muy alto (ej. 80%) podría ser un riesgo si un partner clave deja de colaborar.
---
## Diagramas de Flujo (Mermaid)
**Flujo de Atribución de Referido Enviado**
mermaid
graph TD
A[Entrenador genera y comparte link de Partner P] --> B{Cliente C hace clic en el link};
B --> C[Se instala cookie de seguimiento con ID de Partner P en el navegador de C];
C --> D{Cliente C se registra/compra en la web del Partner P};
D --> E[Sistema del Partner detecta la cookie o el código de referido];
E --> F[Sistema del Partner notifica a TrainerERP vía API o webhook];
F --> G[TrainerERP registra la conversión y la atribuye a P];
G --> H[Se calcula la comisión según el acuerdo y se añade al dashboard];
