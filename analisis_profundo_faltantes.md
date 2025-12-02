# 🚨 Análisis Profundo de Funcionalidades Faltantes y "Fake Logic"

**Fecha:** 22 de Noviembre 2025
**Estado:** Crítico 🔴
**Objetivo:** Identificar brechas entre la interfaz visual (UI) y la lógica de negocio real.

---

## 🛑 1. Botones y Acciones "Muertas" (UI sin Lógica)

Estos elementos existen visualmente pero no ejecutan ninguna acción real o su acción está incompleta.

| Ubicación | Elemento | Estado Actual | Lo que debería hacer |
| :--- | :--- | :--- | :--- |
| **EditorCanvas (Footer)** | Botón `[+ Agregar Semana]` | **Inerte.** No tiene `onClick`. | Llamar a `addWeek()` en contexto, generar 7 días nuevos y hacer scroll al final. |
| **EditorCanvas (Footer)** | Botón `[BatchTraining]` | **Inerte.** No tiene `onClick`. | Abrir el modal `BatchTrainingModal` que ya existe. |
| **EditorCanvas (Footer)** | Botón `[Copiar Programa]` | **Inerte.** No tiene `onClick`. | Duplicar todo el estado de `daysData` o exportar JSON al portapapeles. |
| **TopBar** | Botón `[Vista Cliente]` | Abre un modal visual. | El modal es solo visual, no permite interacción real ni envío al cliente. |
| **LibraryPanel** | Botón `[+ Crear Bloque]` | Abre modal o hace nada. | Debería permitir crear un bloque personalizado y guardarlo en local/remoto. |
| **EmptyWeekState** | Botón `[Generar con IA]` | `alert()` | Debería abrir el `AIProgramGenerator`. |

---

## 🧠 2. Lógica de Negocio Simulada ("Fake Logic")

El código contiene "stubs" o funciones vacías que imprimen en consola en lugar de manipular los datos.

### A. BatchTraining (`useBatchTraining.ts`)
El wizard funciona visualmente (pasas del paso 1 al 3), pero al finalizar **no ocurre nada**.

*   `applyLinearProgression`: ❌ Solo hace `console.log`. Debería iterar sobre los ejercicios seleccionados y aumentar cargas/series.
*   `duplicateWeek`: ❌ Solo hace `console.log`. Debería clonar los días de la semana origen e insertarlos en la destino.
*   `applyTemplate`: ❌ Solo hace `console.log`. No hay lógica para mapear una plantilla a fechas específicas.

### B. Gestión de Semanas (`ProgramContext.tsx`)
El sistema de datos es plano (`Day[]`), lo que dificulta la gestión por semanas.

*   **No existe entidad "Semana":** Las semanas son solo una ilusión visual en el renderizado (`weeks` memo en `EditorCanvas`).
*   **Consecuencia:** No se puede "borrar una semana", "mover una semana" o "colapsar una semana" fácilmente porque no existe como objeto, solo son 7 días consecutivos.
*   **Falta `addWeek`:** No hay función en el contexto para añadir días.

### C. FitCoach IA (`useFitCoach.ts`)
*   **Respuestas Hardcoded:** El chat siempre responde lo mismo o sigue un script predefinido (`setTimeout` con respuestas fijas).
*   **Sin Análisis Real:** No analiza el programa actual para dar sugerencias. Las alertas de "Desbalance Push/Pull" son estáticas, no calculadas sobre los datos reales.

---

## 📉 3. Problemas de UX y Navegación

### Navegación
*   **Scroll Infinito sin Índice:** Si tienes un programa de 12 semanas, tienes que hacer scroll manual hasta el final. No hay un menú lateral o superior para saltar a "Semana 8".
*   **Falta de Selección de Rango:** No puedes seleccionar "Semana 1 a 4" para aplicar una acción masiva. La UI de selección múltiple en `ExcelView` es manual (checkbox por checkbox).

### Arrastrar y Soltar (Drag & Drop)
*   **Limitado:** Puedes arrastrar de la librería al canvas.
*   **Faltante:** No parece robusto el reordenamiento **entre días** (mover un bloque del Lunes al Martes arrastrando).
*   **Faltante:** No se puede reordenar semanas completas.

---

## 🔌 4. Integración de Datos (Backend)

*   **Persistencia Local Precaria:** Usa `localStorage` de forma básica. Si borras caché, pierdes todo.
*   **Sin Backend:** `MockApiService.ts` simula retardos de red pero no guarda nada en ningún servidor.
*   **Colaboración Falsa:** `CollaborationContext.tsx` simula otros usuarios con `setInterval` y `Math.random`. No hay conexión WebSocket real, por lo que dos pestañas abiertas no se verían entre sí.

---

## 📝 Plan de Acción Recomendado

1.  **Prioridad Alta (Funcionalidad Básica):**
    *   Implementar `addWeek` en `ProgramContext`.
    *   Conectar botones del footer en `EditorCanvas`.
    *   Implementar lógica real en `useBatchTraining` (al menos `duplicateWeek` y `linearProgression`).

2.  **Prioridad Media (Navegación):**
    *   Crear componente `WeekNavigator` (índice de semanas flotante o en sidebar).
    *   Permitir colapsar semanas completas.

3.  **Prioridad Baja (Backend/IA):**
    *   Conectar a Supabase/Firebase real para persistencia.
    *   Integrar API de OpenAI real para el chat.

---
**Conclusión:** El editor es un "prototipo de alta fidelidad". Se ve y se siente como el producto final, pero el motor lógico necesita ser construido casi en su totalidad para las funciones avanzadas.
