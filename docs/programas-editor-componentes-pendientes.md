# Integración sugerida de componentes pendientes en `ProgramasDeEntrenoEditorPage`

Este documento resume dónde encaja cada componente aún no montado dentro del editor de programas (`src/features/programas-de-entreno/pages/ProgramasDeEntrenoEditorPage.tsx`) y qué props debería recibir reutilizando el estado ya existente.

## 1. `AsistenteIAPrograma`

- **Ubicación recomendada**: reemplazar el contenido del modal `Fit Coach` (estado `isFitCoachOpen`).  
- **Datos disponibles en la página**:
  - `weeklyPlan`, `weekDays`, `weeklyTargets`, `selectedDay`, `selectedDayPlan`, `selectedClient`.
  - Función `setWeeklyPlan` (para manejar bloques generados vía `onAddBlock`).  
- **Integración**:
  - Sustituir el JSX del modal “Fit Coach · Recomendaciones…” por `<AsistenteIAPrograma … />`.
  - Pasar `weeklyPlan`, `selectedDay`, `selectedDayPlan`, `selectedClient`, `weeklyTargets` y los resúmenes (`aiRecommendations`, `weeklyOverview`, `contextoCliente` si se expone).
  - Implementar `onAddBlock` para insertar bloques directamente en el día activo usando `setWeeklyPlan`.

## 2. `CuestionarioConfiguracion`

- **Ubicación recomendada**: botón adicional en la cabecera `EditorHeader`.  
- **Motivación**: permite ajustar layout y preferencias del editor sin abandonar la página.  
- **Estado nuevo**: `isLayoutSurveyOpen` boolean.  
- **Props mínimas**: no requiere datos externos; puede recibir callbacks para guardar respuesta o solo cerrar.  
- **Integración**:
  - Añadir botón “Configurar layout” junto a “Automatización”.
  - Renderizar `<CuestionarioConfiguracion />` dentro de un `<Modal>` controlado por el nuevo estado.

## 3. `GestorFormulas`

- **Ubicación recomendada**: modal accesible desde el panel derecho (`SummarySidebar`) o desde el submenú “Gráficos”.  
- **Dependencias**: ya existen métodos para calcular métricas; el gestor debería actualizar estas fórmulas.  
- **Estado nuevo**: `isFormulaManagerOpen`.  
- **Integración**:
  - Añadir botón “Fórmulas personalizadas” dentro del bloque “Objetivos semanales” o “Progreso”.
  - Invocar `<GestorFormulas isOpen={isFormulaManagerOpen} onClose={…} onFormulasChange={(formulas) => {/* recalcular overview */}} />`.

## 4. `GestorPresetsAutomatizaciones`

- **Ubicación recomendada**: junto al flujo `BulkAutomationFlow`.  
- **Estado existente**: `isBulkAutomationOpen`.  
- **Integración**:
  - Añadir botón “Presets de automatización” (por ejemplo, junto al botón “Automatización” en `EditorHeader`).
  - Controlar un nuevo estado `isAutomationPresetsOpen` y renderizar `<GestorPresetsAutomatizaciones open={…} onOpenChange={…} onSeleccionarPreset={(preset) => {/* abrir Batch o aplicar */}} />`.
  - Tras seleccionar un preset, reutilizar `setWeeklyPlan` o abrir `BulkAutomationFlow` precargado.

## 5. `InsightsAssistantPanel`

- **Ubicación recomendada**: panel lateral derecho alternativo al resumen (`SummarySidebar`).  
- **Integración**:
  - Añadir toggles/tab en la parte superior del `SummarySidebar` para alternar entre “Resumen” e “Insights”.
  - En la vista Insights renderizar `<InsightsAssistantPanel weeklyPlan={weeklyPlan} weekDays={weekDays} contextoCliente={selectedClient} objetivosProgreso={/* derivado */} weeklyTargets={weeklyTargets} />`.
  - Las acciones (`onInsightAction`) pueden derivar a `setWeeklyPlan`, `handleUpdateDayPlan` o abrir otros modales.

## 6. `NotasAcuerdosRecordatorios`

- **Ubicación recomendada**: reemplazar o ampliar la sección “Notas de seguimiento” del `SummarySidebar`.  
- **Integración**:
  - Sustituir la lógica manual de notas por `<NotasAcuerdosRecordatorios programaId="current-program" clienteId={selectedClient.id} />`.
  - Esto elimina la necesidad de gestionar estados locales (`followUpNotes`, `isAddingNote`, etc.), simplificando el sidebar.

## 7. `RecommendedBlocksPanel`

- **Ubicación recomendada**: dentro del `LibrarySidebar`, debajo del bloque “Acciones rápidas”.  
- **Integration hook**:
  - Pasar `weeklyPlan`, `weekDays`, `onBlockClick={(block) => setSelectedDay(...)/setActiveView('daily')}`, `onApplyBlock` para añadir sesiones.
  - También se puede aprovechar `onDragStart` ya existente para arrastrar bloques a los días.
  - Añadir un toggle para mostrar/ocultar recomendaciones si se desea evitar saturar el panel.

## 8. `RiskAlertsPanel`

- **Ubicación recomendada**: sección fija sobre el canvas principal cuando la vista es semanal (`activeView === 'weekly'`).  
- **Integración**:
  - Renderizar antes de `<WeeklyEditorView />` cuando existan riesgos.
  - Pasar `weeklyPlan`, `weekDays`, `onInsertPlan={(day, sessions) => {/* merge con setWeeklyPlan */}}` y `onUpdateDayPlan={handleUpdateDayPlan}`.
  - Para no recargar la UI diaria, ocultarlo en vistas `daily`/`excel`.

## 9. `SelectorPlantillas`

- **Ubicación recomendada**: botón “Importar plantilla guardada” del `LibrarySidebar`.  
- **Integración**:
  - Reemplazar el botón actual por una función que abra `<SelectorPlantillas isOpen={isTemplatesSelectorOpen} onClose={…} onSeleccionarPlantilla={(plantilla) => {/* insertar en weeklyPlan */}} />`.
  - El callback puede crear un nuevo día o sobrescribir `selectedDayPlan`.

## 10. `SimuladorReglas`

- **Ubicación recomendada**: antes de abrir `BatchTrainingModal` o como paso previo dentro del mismo modal.  
- **Integración**:
  - Añadir botón “Simulador de reglas” dentro del modal de Batch Training o en el top bar.
  - Controlar estado `isRuleSimulatorOpen` y renderizar `<SimuladorReglas weeklyPlan={weeklyPlan} open={isRuleSimulatorOpen} onOpenChange={setIsRuleSimulatorOpen} onAplicarSimulacion={(resultado) => {/* sincronizar con setWeeklyPlan */}} contextoCliente={selectedClient} programaId="current-program" clienteId={selectedClient.id} />`.

## 11. `TimelineMilestonesPanel`

- **Ubicación recomendada**: modal tipo dashboard accesible desde la cabecera (botón “Hitos” o similar) o como pestaña adicional dentro de `SummarySidebar`.  
- **Integración**:
  - Crear estado `isMilestonesOpen`.
  - Renderizar `<TimelineMilestonesPanel clienteId={selectedClient.id} programaId={draftId ?? 'current-program'} onHitoClick={(hito) => {/* navegar a día */}} />`.
  - Permite dar contexto temporal al plan, complementando la vista semanal.

---

### Resumen de estados adicionales sugeridos

| Estado | Uso | Componentes asociados |
| --- | --- | --- |
| `isLayoutSurveyOpen` | Mostrar `CuestionarioConfiguracion` | CuestionarioConfiguracion |
| `isFormulaManagerOpen` | Gestionar fórmulas personalizadas | GestorFormulas |
| `isAutomationPresetsOpen` | Abrir gestor de presets | GestorPresetsAutomatizaciones |
| `isInsightsView` (toggle) | Alternar resumen/insights en sidebar | InsightsAssistantPanel |
| `isTemplatesSelectorOpen` | Elegir plantillas predefinidas | SelectorPlantillas |
| `isRuleSimulatorOpen` | Simular reglas antes de batch | SimuladorReglas |
| `isMilestonesOpen` | Ver hitos en timeline | TimelineMilestonesPanel |

Con estas ubicaciones, cada componente cubre un hueco funcional concreto del editor sin duplicar lógica existente y aprovechando estados ya presentes para mantener la coherencia de la experiencia.





