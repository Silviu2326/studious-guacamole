# 📘 Documentación Maestra: Editor de Entrenamiento Avanzado (FitPro IDE)

**Versión del Documento:** 2.0
**Módulo:** `src/features/EditorEntrenamiento`
**Estado:** Producción / High-Fidelity Prototype

---

## 1. Introducción y Propósito
El **Editor de Entrenamiento** no es simplemente un formulario de entrada de datos; es un **Entorno de Desarrollo Integrado (IDE)** diseñado específicamente para entrenadores de alto rendimiento. Su objetivo es reducir el tiempo de programación en un 80% mediante herramientas de automatización, inteligencia artificial y una interfaz de usuario optimizada para flujos de trabajo complejos.

### Arquitectura de Alto Nivel
El sistema funciona como una **Single Page Application (SPA)** compleja montada sobre React, utilizando una arquitectura de gestión de estado distribuida mediante múltiples contextos para garantizar el rendimiento y la separación de responsabilidades.

*   **Persistencia:** Modelo híbrido "Local-First". Los cambios se guardan instantáneamente en `LocalStorage` para latencia cero y se sincronizan en segundo plano con el servidor (simulado por `MockApiService` y `offlineQueue`).
*   **Estado Global:** Gestionado por `ProgramContext` con soporte nativo para Deshacer/Rehacer (`useHistory` hook).

---

## 2. Área de Trabajo (Canvas y Vistas)

El editor desacopla los datos de la representación visual, permitiendo manipular el mismo programa desde cuatro perspectivas distintas según la fase de diseño.

### A. Vista Semanal (Standard View)
La vista principal tipo "Kanban/Calendario".
*   **Tarjetas de Día (`DayCard`):**
    *   **Estado Colapsable:** Permite ver la estructura general o el detalle de los ejercicios.
    *   **Validación Inline:** Iconos de alerta (triángulo amarillo) aparecen directamente en el encabezado del día si hay errores (ej. día vacío sin etiqueta).
    *   **Menú Contextual:** Clic derecho o botón de opciones para: Copiar día, Pegar, Limpiar, o activar **Smart Fill**.
    *   **Etiquetado Rápido:** Gestión de tags (Fuerza, Hipertrofia) directamente en la cabecera del día.
*   **Resumen de Carga (`WeeklySummaryFooter`):** Al pie de cada columna semanal, se generan gráficos en tiempo real:
    *   **Distribución de Zonas:** Gráfico de pastel (Fuerza vs. Metabólico vs. Hipertrofia).
    *   **Métricas Clave:** Conteo total de series, tonelaje estimado y RPE promedio de la semana.

### B. Vista Excel (`ExcelView`)
Una interfaz tabular densa diseñada para la edición masiva y rápida de variables numéricas.
*   **Edición Inline Real:** Las celdas de la tabla son inputs. Se puede navegar con tabulador y editar Series, Reps, RPE y Carga sin abrir modales.
*   **Barra de Acciones Flotante:** Al seleccionar múltiples filas (checkboxes), aparece una barra inferior ("Floating Action Bar") que permite:
    *   **Ajuste de RPE Masivo:** "Fijar RPE de todos los ejercicios seleccionados a 8".
    *   **Multiplicador de Volumen:** "Aumentar series un 20% (x1.2)" para todos los seleccionados.
    *   **Edición de Notas:** Agregar la misma nota a múltiples ejercicios.
*   **Visualización Jerárquica:** Muestra la estructura Semana > Día > Bloque > Ejercicio en una tabla plana con indentación visual.

### C. Vista Timeline (`TimelineView`)
Visualización macroscópica para la periodización a largo plazo.
*   **Agrupación por Mesociclos:** Detecta automáticamente fases de entrenamiento (ej. 4 semanas) y las agrupa visualmente.
*   **Gráficos de Tendencia:** Muestra barras verticales para Volumen (altura) e Intensidad (color/relleno) para evaluar la ondulación de la carga a lo largo de las semanas.
*   **Detección de Deload:** Marca visualmente las semanas de descarga (volumen < 50%).

### D. Vista Comparativa (`ComparisonView`)
Herramienta de auditoría para comparar el programa actual con una versión anterior o una plantilla.
*   **Diffing de Métricas:** Muestra lado a lado el Volumen Total, Intensidad Promedio y Distribución de Patrones.
*   **Resaltado de Cambios:** Usa colores (Verde/Rojo) para indicar aumentos o disminuciones significativas en la carga de trabajo entre las dos versiones.

---

## 3. Motores de Inteligencia y Automatización (The "Magic")

Estas herramientas diferencian a este editor de una hoja de cálculo tradicional.

### 🔥 Batch Training (Edición por Lotes)
Un potente asistente modal (`BatchTrainingModal`) que ejecuta algoritmos complejos sobre múltiples semanas.
1.  **Duplicar Semana:** Copia profunda (Deep Clone) de una semana origen a un rango de semanas destino (ej. Copiar Semana 1 a Semanas 2-4).
2.  **Progresión Lineal:** Algoritmo matemático que incrementa variables progresivamente.
    *   *Inputs:* Variable a progresar (Carga %, RPE, Series, Reps) y magnitud del incremento por semana.
    *   *Lógica:* Calcula `ValorBase + (Incremento * (SemanaActual - SemanaInicio))`.
3.  **Aplicar Plantilla:** Inyecta estructuras predefinidas (ej. Upper/Lower) respetando las fechas.
4.  **Ajuste Masivo:** Operación "Buscar y Reemplazar" pero lógica (ej. "Sumar +1 RPE a todo", "Restar 10seg de descanso a todo").

### ⚡ Smart Fill (Relleno Inteligente)
Un motor de resolución de restricciones (`SmartFillSolver`) que adapta un día de entrenamiento a limitaciones de la vida real.
*   **Restricción de Tiempo:** Si el usuario indica "Tengo 45 mins", el algoritmo prioriza ejercicios compuestos y recorta series de accesorios hasta encajar en el tiempo estimado.
*   **Restricción de Material:** Si el usuario indica "Solo mancuernas", el sistema busca en su base de datos de equivalencias y sustituye *Barbell Bench Press* por *Dumbbell Press*.
*   **Restricción de Lesiones:** Si se marca "Dolor de rodilla", sustituye ejercicios de alto impacto/flexión (Sentadilla) por alternativas seguras (Puente de Glúteo).

### 🤖 FitCoach IA (Asistente Contextual)
Un panel lateral (`FitCoachPanel`) que actúa como un copiloto inteligente.
*   **Chatbot Contextual:** Entiende comandos como "Optimiza la semana 1 para fuerza" o "¿Qué hago si al cliente le duele el hombro?".
*   **Análisis de Patrones (Insights):**
    *   **Radar Chart:** Visualiza el equilibrio entre patrones de movimiento (Empuje, Tracción, Rodilla, Cadera, Core).
    *   **Detección de Anomalías:** Alerta si hay un desequilibrio (ej. "Ratio Empuje/Tracción es 3:1, riesgo de lesión").
*   **Memoria de Usuario:** El servicio `FitCoachMemoryService` aprende de las acciones del entrenador (ej. "Veo que siempre usas series de 8 reps, ¿quieres que lo configure por defecto?").

### ✨ Generadores Generativos
*   **AI Program Generator:** Un "Wizard" paso a paso que crea un programa de 4-16 semanas desde cero basándose en: Objetivo (Hipertrofia/Fuerza), Disponibilidad (Días/sem) y Limitaciones.
*   **Variation Generator:** Permite reescribir un programa existente mediante un prompt de lenguaje natural (ej. "Adapta todo el programa para hacerlo en casa sin material").

---

## 4. Gestión de Contenido y Biblioteca (`LibraryPanel`)

Un panel lateral derecho con capacidades avanzadas de búsqueda y arrastre.

*   **Búsqueda Semántica y Sugerencias Inteligentes:**
    *   Si el programa tiene mucha "Sentadilla", la librería sugiere automáticamente bloques de "Movilidad de Cadera" o "Compensación".
    *   Las sugerencias se resaltan visualmente (borde amarillo/dorado).
*   **Sistema Drag & Drop (`GlobalDnDContext`):**
    *   **Elementos:** Se pueden arrastrar Ejercicios individuales, Bloques completos o Plantillas enteras.
    *   **Zonas de Caída:** El canvas detecta dónde se suelta el elemento y lo transforma (ej. soltar un ejercicio en un día vacío crea automáticamente un bloque nuevo para contenerlo).
*   **Favoritos y Filtros:** Filtrado por grupo muscular, equipamiento y tipo. Gestión de favoritos persistente.

---

## 5. Componentes de Edición (Micro-Interacciones)

Detalles de UX que mejoran la velocidad de uso.

*   **Training Block (Bloque de Entrenamiento):**
    *   Contenedor de ejercicios.
    *   **Temporizador Integrado:** Widget flotante (`TimerWidget`) para bloques tipo EMOM o HIIT.
    *   **Agrupación:** Capacidad visual para indicar super-series (borde lateral de color compartido).
*   **Exercise Row (Fila de Ejercicio):**
    *   **Calculadora de Carga Automática:** Si el usuario escribe "80%", el sistema busca el 1RM del ejercicio para ese cliente y muestra automáticamente "80% (100kg)".
    *   **Validación de RPE:** Si se introduce RPE > 10, marca el input en rojo.
    *   **Context Menu:** Opciones para ver video, sustituir ejercicio o añadir comentario.
*   **Teclado (Shortcuts):**
    *   `Cmd/Ctrl + Z`: Deshacer.
    *   `Cmd/Ctrl + D`: Duplicar día seleccionado.
    *   `.` (Punto): Añadir ejercicio rápido al día seleccionado.
    *   `Cmd/Ctrl + K`: Abrir paleta de comandos global.

---

## 6. Validación y Seguridad (`validationEngine`)

Un motor de reglas que se ejecuta en tiempo real con cada cambio en el estado del programa.

*   **Reglas Críticas (Rojo):** Errores lógicos graves (RPE > 10, series negativas).
*   **Reglas de Advertencia (Amarillo):** Violaciones de principios de entrenamiento (Volumen semanal > 30 series por grupo muscular, incrementos de carga aguda > 20%).
*   **Reglas de Sugerencia (Azul):** Días vacíos sin etiqueta de "Descanso".
*   **Sistema de Alertas:** Las alertas se centralizan en la pestaña "Alertas" del `FitCoachPanel` y también se muestran contextualmente en el canvas.

---

## 7. Colaboración y Versionado

Diseñado para equipos y entornos multi-usuario.

*   **Historial de Versiones (`VersionHistoryModal`):**
    *   Snapshots automáticos y manuales del estado completo del programa.
    *   Capacidad de "Viajar en el tiempo": Previsualizar cualquier versión antigua y restaurarla.
*   **Colaboración en Tiempo Real (Simulación):**
    *   **Cursores de Presencia:** Muestra avatares de otros usuarios editando el mismo programa.
    *   **Bloqueo de Recursos:** Si el Usuario A está editando el "Bloque 1", este aparece bloqueado (gris y con candado) para el Usuario B para evitar conflictos de escritura.
*   **Sistema de Comentarios (`CommentThread`):**
    *   Permite dejar notas/hilos de conversación a nivel de ejercicio.
    *   Útil para comunicación Asíncrona Entrenador-Cliente o Entrenador-Entrenador.

---

## 8. Ecosistema Móvil y Cliente

*   **Previsualización Móvil (`ClientMobilePreview`):**
    *   Un simulador de alta fidelidad que muestra exactamente cómo verá el cliente el entrenamiento en su App (iOS/Android).
    *   Permite verificar que las notas y videos se visualizan correctamente.
*   **Exportación:**
    *   **PDF Profesional:** Genera un documento imprimible.
    *   **Excel:** Exporta los datos crudos para análisis.
    *   **Push a App:** Asignación directa al perfil del cliente.

---

## 9. Stack Tecnológico del Módulo

*   **Framework:** React + TypeScript + Vite.
*   **Estilos:** Tailwind CSS (Diseño responsivo y sistema de diseño `ds`).
*   **Estado:** React Context API + Reducers (`useHistory` para undo/redo).
*   **Drag & Drop:** `@dnd-kit/core` (Sensores, colisiones, accesibilidad).
*   **Gráficos:** `recharts` (Radar, Pie, Bar, Line charts).
*   **Iconos:** `lucide-react`.
*   **Componentes UI:** Headless UI (Modales, Combobox).
*   **Virtualización:** (Preparado para listas largas con `react-window` si fuera necesario en el futuro, aunque actualmente usa renderizado directo optimizado).