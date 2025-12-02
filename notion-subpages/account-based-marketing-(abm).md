# Account-Based Marketing (ABM)

**Página padre:** Hola

---

# Account-Based Marketing (ABM)
👥 Tipo de Usuario: Entrenador Personal (Administrador), Entrenador Asociado, Administrador del Sistema
Esta funcionalidad está diseñada para Entrenadores que buscan expandir su negocio más allá del cliente individual (B2C) y entrar en el mercado corporativo (B2B). El 'Entrenador Personal (Administrador)' tendrá acceso completo para crear cuentas, gestionar pipelines y ver analíticas. El 'Entrenador Asociado' podría tener permisos restringidos para gestionar solo las cuentas y oportunidades que le sean asignadas. No es una funcionalidad visible para los roles 'Cliente' o 'Lead/Potencial Cliente'.
📝 Nota: Esta es una especificación/documentación. NO incluye código implementado, solo la especificación de componentes y APIs que se necesitarían desarrollar.
Ruta: /dashboard/abm
## Descripción Funcional
El módulo de Account-Based Marketing (ABM) transforma TrainerERP de una herramienta de gestión de clientes individuales a una potente plataforma de ventas B2B. Está específicamente diseñado para ayudar a los entrenadores personales y estudios de fitness a identificar, contactar y cerrar acuerdos con clientes corporativos. En lugar de un marketing masivo, el ABM se centra en tratar a cada empresa objetivo como un mercado en sí mismo. La página permite a los entrenadores crear perfiles detallados de 'Cuentas Objetivo', que son las empresas a las que desean vender sus servicios de bienestar corporativo, pausas activas o programas de salud para empleados. Dentro de cada cuenta, pueden mapear y gestionar múltiples 'Contactos Clave', como gerentes de RRHH, directores de bienestar o CEOs, personalizando la comunicación para cada uno. La funcionalidad principal es un pipeline de ventas visual, típicamente en formato Kanban, que permite arrastrar y soltar 'Oportunidades' (deals) a través de distintas etapas del ciclo de venta (ej: Prospección, Contacto Inicial, Propuesta Enviada, Negociación, Ganado/Perdido). Además, integra herramientas para crear campañas de email personalizadas, generar propuestas de marca y hacer un seguimiento del engagement a nivel de cuenta, mostrando quién ha abierto un correo o visto una propuesta. Esto proporciona una inteligencia de negocio crucial para realizar seguimientos efectivos y oportunos.
## Valor de Negocio
La incorporación de un módulo de ABM ofrece un valor de negocio transformador para los usuarios de TrainerERP, permitiéndoles escalar sus operaciones y acceder a flujos de ingresos significativamente mayores. El principal beneficio es la diversificación de ingresos; en lugar de depender únicamente de clientes individuales, los entrenadores pueden cerrar contratos corporativos de alto valor que garantizan ingresos recurrentes y estables. Un solo acuerdo corporativo puede equivaler a docenas de clientes individuales. Esta funcionalidad profesionaliza la oferta del entrenador, posicionándolo como un proveedor de soluciones de bienestar empresarial, lo que le otorga una ventaja competitiva decisiva en el mercado. Automatiza y organiza un proceso de ventas B2B que de otro modo sería caótico y manual, ahorrando tiempo y reduciendo la probabilidad de que se pierdan oportunidades. Al proporcionar herramientas para el seguimiento del engagement y la generación de propuestas, aumenta la tasa de cierre. A largo plazo, fomenta relaciones estratégicas con empresas, que no solo generan ingresos directos sino que también pueden actuar como un canal de adquisición para nuevos clientes individuales (los empleados de la empresa).
## Prioridad / Roadmap
- Impacto: medio
- Complejidad: alta
- Fase recomendada: Premium
## User Stories
- Como entrenador que ofrece servicios corporativos, quiero crear un perfil para una empresa objetivo para poder centralizar toda la información, contactos y actividades relacionadas con ella.
- Como dueño de un estudio de fitness, quiero visualizar mi pipeline de ventas B2B en un tablero Kanban para poder seguir el progreso de cada oportunidad de negocio y prever mis ingresos.
- Como coach de bienestar, quiero añadir múltiples contactos a una cuenta de empresa (ej. RRHH, Dirección) para dirigir mis comunicaciones a las personas adecuadas dentro de la organización.
- Como entrenador personal, quiero crear una campaña de email automatizada y personalizada para una empresa específica para presentar mis servicios de forma profesional y eficiente.
- Como administrador, quiero recibir una notificación cuando un contacto clave de una empresa objetivo haya abierto mi email o visualizado la propuesta que envié, para poder hacer un seguimiento en el momento justo.
- Como profesional del fitness, quiero generar una propuesta de servicios corporativos a partir de una plantilla, personalizándola con el logo y los detalles de la empresa, para acelerar mi proceso de ventas.
## Acciones Clave
- Crear, editar y eliminar una 'Cuenta Objetivo' (empresa).
- Añadir, gestionar y contactar a los 'Contactos Clave' dentro de una cuenta.
- Crear una 'Oportunidad' (deal) y asociarla a una cuenta.
- Mover una oportunidad a través de las diferentes etapas del pipeline de ventas (Kanban).
- Generar una propuesta personalizada a partir de una plantilla.
- Ver el dashboard de analíticas de ABM con KPIs clave.
- Filtrar y buscar cuentas u oportunidades por estado, valor o fecha.
## 🧩 Componentes React Sugeridos
### 1. ABMPipelineView
Tipo: container | Componente principal que renderiza el tablero Kanban del pipeline de ventas. Obtiene los datos de las etapas y las oportunidades, y maneja la lógica de arrastrar y soltar (drag-and-drop) para mover deals entre etapas.
Props:
- userId: 
- string (requerido) - ID del entrenador para filtrar las oportunidades que le pertenecen.
Estados: stages: PipelineStage[], deals: Deal[], isLoading: boolean, error: Error | null
Dependencias: react-beautiful-dnd
Ejemplo de uso:
```typescript
<ABMPipelineView userId='trainer-123' />
```

### 2. DealCard
Tipo: presentational | Representa una tarjeta individual de una oportunidad (deal) dentro de una columna del Kanban. Muestra información clave y es el elemento que se puede arrastrar.
Props:
- deal: 
- { id: string; title: string; accountName: string; value: number; nextStepDate?: string } (requerido) - Objeto con la información del deal a mostrar.
Dependencias: styled-components
Ejemplo de uso:
```typescript
<DealCard deal={{ id: 'deal-01', title: 'Programa Wellness Q3', accountName: 'TechCorp', value: 5000 }} />
```

### 3. AccountDetailPanel
Tipo: container | Un panel o vista modal que muestra toda la información de una 'Cuenta Objetivo' cuando se hace clic en ella. Incluye detalles de la empresa, una lista de contactos asociados, historial de actividades y deals relacionados.
Props:
- accountId: 
- string (requerido) - ID de la cuenta a cargar y mostrar.
Estados: accountData: Account | null, contacts: Contact[], activities: Activity[], isLoading: boolean
Ejemplo de uso:
```typescript
<AccountDetailPanel accountId='acc-456' />
```

### 4. useABMData
Tipo: hook | Hook personalizado para abstraer la lógica de fetching y actualización de los datos del pipeline de ABM. Maneja la comunicación con la API, el estado de carga y los errores.
Props:
- userId: 
- string (requerido) - ID del usuario para filtrar los datos.
Dependencias: axios, react-query
Ejemplo de uso:
```typescript
const { deals, stages, updateDealStage } = useABMData(userId);
```
## 🔌 APIs Requeridas
### 1. GET /api/abm/deals
Obtiene una lista de todas las oportunidades (deals) para el pipeline del usuario autenticado. Permite filtrar por etapa o buscar por nombre.
Parámetros:
- stageId (
- string, query, opcional): Filtra los deals por el ID de una etapa específica del pipeline.
- search (
- string, query, opcional): Término de búsqueda para filtrar por nombre del deal o de la cuenta.
Respuesta:
Tipo: array
Estructura: Un array de objetos 'deal'. Cada objeto contiene id, title, value, accountName, stageId.
```json
[
  {
    "id": "deal-01",
    "title": "Programa Wellness Q3",
    "value": 5000,
    "accountName": "TechCorp",
    "stageId": "stage-02"
  }
]
```
Autenticación: Requerida
Errores posibles:
- 401: 
- Unauthorized - El usuario no está autenticado.
- 403: 
- Forbidden - El usuario no tiene permisos para ver deals.

### 2. POST /api/abm/accounts
Crea una nueva cuenta objetivo en el sistema.
Parámetros:
- accountData (
- object, body, requerido): Objeto con los detalles de la nueva cuenta.
Respuesta:
Tipo: object
Estructura: El objeto de la cuenta recién creada, incluyendo su ID generado por el sistema.
```json
{
  "id": "acc-789",
  "companyName": "Innovate Solutions",
  "industry": "Technology",
  "website": "innovate.com",
  "ownerId": "trainer-123"
}
```
Autenticación: Requerida
Errores posibles:
- 400: 
- Bad Request - Faltan campos requeridos como 'companyName'.
- 409: 
- Conflict - Ya existe una cuenta con el mismo nombre o dominio.

### 3. PATCH /api/abm/deals/{dealId}/stage
Actualiza la etapa de una oportunidad en el pipeline. Se utiliza cuando el usuario arrastra un 'DealCard' a una nueva columna.
Parámetros:
- dealId (
- string, path, requerido): ID del deal que se va a mover.
- stageUpdate (
- object, body, requerido): Objeto que contiene el ID de la nueva etapa.
Respuesta:
Tipo: object
Estructura: El objeto del deal actualizado.
```json
{
  "id": "deal-01",
  "title": "Programa Wellness Q3",
  "value": 5000,
  "accountName": "TechCorp",
  "stageId": "stage-03"
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - El deal con el ID especificado no existe.
- 400: 
- Bad Request - El 'newStageId' proporcionado no es válido o no existe.

### 4. GET /api/abm/accounts/{accountId}
Obtiene todos los detalles de una cuenta específica, incluyendo su lista de contactos, historial de actividades y oportunidades asociadas.
Parámetros:
- accountId (
- string, path, requerido): ID de la cuenta a consultar.
Respuesta:
Tipo: object
Estructura: Un objeto completo con los datos de la cuenta y arrays anidados para contactos, deals y actividades.
```json
{
  "id": "acc-789",
  "companyName": "Innovate Solutions",
  "contacts": [
    {
      "id": "cont-1",
      "name": "Ana García",
      "role": "HR Manager"
    }
  ],
  "deals": [
    {
      "id": "deal-02",
      "title": "Pausas Activas 2024",
      "value": 2500
    }
  ],
  "activityLog": [
    {
      "timestamp": "2023-10-27T10:00:00Z",
      "activity": "Email enviado a Ana García"
    }
  ]
}
```
Autenticación: Requerida
Errores posibles:
- 404: 
- Not Found - La cuenta con el ID especificado no existe.
- 403: 
- Forbidden - El usuario no tiene permiso para ver esta cuenta.
## Notas Técnicas
Colecciones backend: abm_accounts, abm_contacts, abm_deals, abm_pipeline_stages, abm_proposals, abm_activity_log
KPIs visibles: Valor Total del Pipeline (suma del valor de todos los deals abiertos)., Tasa de Conversión de Oportunidades (deals ganados / deals creados)., Duración del Ciclo de Venta (tiempo promedio desde la creación hasta el cierre de un deal)., Número de Cuentas Nuevas Contactadas (por mes/trimestre)., Tasa de Engagement de Propuestas (propuestas vistas / propuestas enviadas)., Ingresos Generados por ABM.
## Documentación Completa
## Resumen
El módulo de Account-Based Marketing (ABM) es una suite de herramientas de nivel premium dentro de TrainerERP, diseñada para empoderar a los entrenadores personales y estudios de fitness en la captación de clientes corporativos. Esta funcionalidad representa un cambio estratégico del modelo B2C (Business-to-Consumer) al B2B (Business-to-Business), abriendo nuevas y lucrativas vías de ingresos. En esencia, es un CRM de ventas especializado para el nicho del fitness, que permite gestionar todo el ciclo de vida de una venta corporativa, desde la identificación de una empresa objetivo hasta el cierre del acuerdo.
El objetivo es centralizar y simplificar un proceso complejo. En lugar de utilizar hojas de cálculo dispersas, notas y calendarios, el entrenador puede gestionar perfiles de empresas ('Cuentas'), contactos clave dentro de esas empresas, oportunidades de negocio ('Deals') y la comunicación asociada, todo en un único lugar. La interfaz principal es un pipeline de ventas visual (Kanban), que ofrece una visión clara y en tiempo real del estado de todas las negociaciones, permitiendo una mejor toma de decisiones y una previsión de ingresos más precisa.
## Flujo paso a paso de uso real
Imaginemos a una entrenadora, Sofía, que quiere ofrecer su programa "Oficina Activa" a empresas locales.
1. **Identificación y Creación de Cuenta:** Sofía identifica a "Logística Rápida S.L." como un cliente potencial. En TrainerERP, navega a la sección de ABM y hace clic en "Crear Cuenta". Rellena los datos: nombre de la empresa, sector (logística), número de empleados y su sitio web.
2. **Mapeo de Contactos:** A través de LinkedIn, descubre que el Gerente de Recursos Humanos es Javier Torres. En la ficha de la cuenta "Logística Rápida S.L.", añade a Javier como un nuevo "Contacto Clave", incluyendo su cargo, email y teléfono.
3. **Creación de la Oportunidad (Deal):** Sofía decide iniciar el proceso de venta. Crea una nueva "Oportunidad" llamada "Programa Oficina Activa - LR", le asigna un valor estimado de 3.000€ y la asocia a la cuenta "Logística Rápida S.L.". Automáticamente, esta oportunidad aparece como una tarjeta en la primera columna de su pipeline, "Prospección".
4. **Ejecución de Campaña:** Sofía utiliza una plantilla de email de "Primer Contacto B2B" dentro de TrainerERP. La personaliza para Javier y la envía. El sistema registra esta acción en el historial de la cuenta.
5. **Seguimiento y Avance:** El sistema notifica a Sofía que Javier ha abierto el email. Dos días después, Javier responde mostrando interés. Sofía arrastra la tarjeta de la oportunidad a la siguiente columna del pipeline, "Contacto Establecido", y añade una nota sobre la conversación.
6. **Propuesta y Negociación:** Tras una llamada, Sofía utiliza el generador de propuestas de TrainerERP. Elige una plantilla, que se rellena automáticamente con los datos de Logística Rápida S.L., y ajusta los detalles del servicio. Envía la propuesta en PDF directamente desde la plataforma. La oportunidad avanza a la columna "Propuesta Enviada".
7. **Cierre:** El sistema le notifica que Javier ha visto la propuesta. Tras una breve negociación, aceptan el acuerdo. Sofía, con gran satisfacción, arrastra la tarjeta a la columna "Ganado". El valor de 3.000€ se suma a sus KPIs de ingresos por ABM.
## Riesgos operativos y edge cases
* **Confidencialidad de datos:** La información de contacto B2B, aunque a menudo pública, debe manejarse de acuerdo con las normativas de privacidad (GDPR, CCPA). El sistema debe asegurar que los datos se almacenen de forma segura y se utilicen para fines legítimos de comunicación comercial.
* **Propiedad de la cuenta:** En un estudio con varios entrenadores, se debe definir claramente quién es el "dueño" de una cuenta para evitar que varios entrenadores contacten a la misma empresa de forma descoordinada.
* **Ciclos de venta largos:** Las ventas B2B pueden tardar meses. El sistema debe tener mecanismos para marcar oportunidades como "en espera" o programar seguimientos a largo plazo para que no se pierdan en el pipeline.
* **Pérdida de la oportunidad:** Si un deal se marca como "Perdido", es crucial que el sistema pida al usuario que seleccione un motivo (ej: precio, competencia, sin presupuesto). Estos datos son vitales para mejorar la estrategia de ventas futura.
## KPIs y qué significan
* **Valor Total del Pipeline:** Es la suma del valor monetario de todas las oportunidades que no están cerradas (ni ganadas ni perdidas). Es un indicador clave de la salud futura del negocio B2B del entrenador.
* **Tasa de Conversión de Oportunidades:** (`Deals Ganados` / `Total de Deals Creados`) x 100. Mide la eficacia del proceso de ventas. Una tasa baja puede indicar problemas en la cualificación de leads o en la propuesta de valor.
* **Duración del Ciclo de Venta:** El número promedio de días que tarda una oportunidad en pasar de "Prospección" a "Ganado". Ayuda a los entrenadores a planificar su flujo de caja y a identificar cuellos de botella en el proceso.
* **Tasa de Engagement de Propuestas:** (`Propuestas Vistas` / `Propuestas Enviadas`) x 100. Un KPI crucial que indica si las propuestas están llegando y captando la atención de los decisores. Una tasa baja podría significar que los correos van a spam o que el asunto no es atractivo.
## Diagramas de Flujo (Mermaid)
### Ciclo de vida de una Oportunidad (Deal)
mermaid
graph TD
A[Prospección] --> B{Contacto Iniciado?};
B -- Sí --> C[Calificación];
B -- No / Sin Respuesta --> A;
C --> D{Propuesta Requerida?};
D -- Sí --> E[Propuesta Enviada];
D -- No --> F[Descartado];
E --> G[Negociación];
G --> H{Acuerdo Cerrado?};
H -- Ganado --> I[GANADO];
H -- Perdido --> J[PERDIDO];
