Quiero que leas con muchísimo detalle estos archivos:

- @spec-fitcoach-panel.md → especificación técnica maestra del módulo concreto que quiero implementar o refactorizar.
- @editor_entrenamiento_definitivo.md → documento maestro que define el rediseño completo del editor de entrenamiento, los patrones globales de UX/UI y cómo encaja cada módulo dentro del sistema.

Tu tarea es TRANSFORMAR @spec-fitcoach-panel.md en una lista de prompts secuenciados para implementar ese módulo en código dentro de src\features\EditorEntrenamiento\components\FitCoachPanel.tsx, utilizando @editor_entrenamiento_definitivo.md como guía de coherencia visual y funcional con el resto del editor.


🧩 Placeholders reutilizables (MUY IMPORTANTE)

En este prompt verás dos literales genéricos:

- `@spec-fitcoach-panel.md` → nombre del archivo de especificación del módulo.
- `src\features\EditorEntrenamiento\components\FitCoachPanel.tsx` → ruta del archivo principal de React/TypeScript donde se va a trabajar.

Debes:

1. Usar SIEMPRE esos literales EXACTOS en todos los prompts que generes.
2. Asumir que yo, antes de usar este prompt inicial, haré un “buscar y reemplazar”:
   - `@spec-fitcoach-panel.md` → por el nombre real del archivo de especificación (ej.: `@spec-editor-canvas.md`, `@spec-batch-training-modal.md`, etc.).
   - `src\features\EditorEntrenamiento\components\FitCoachPanel.tsx` → por la ruta real del archivo principal (ej.: `src/features/EditorEntrenamiento/components/EditorCanvas.tsx`).

De esta forma, el mismo prompt inicial me sirve para cualquier módulo cambiando solo esos dos textos.


🔧 Formato de SALIDA (OBLIGATORIO)

Devuélveme ÚNICAMENTE un JSON con esta estructura EXACTA (sin texto adicional, sin explicaciones):

[{
  "prompts": [
    "PROMPT_1",
    "PROMPT_2",
    "PROMPT_3"
  ]
}]

Cada elemento del array `"prompts"` debe ser un string con el estilo del ejemplo siguiente (estructura, no contenido):

"**01_Modulo_Foundation**: INICIO DEL MONTAJE. Quiero que configures la estructura base del módulo en `src\features\EditorEntrenamiento\components\FitCoachPanel.tsx`.\n\n**Instrucciones:**\n1. ...\n2. ...\n\n**Referencias Obligatorias:**\n- Revisa @spec-fitcoach-panel.md (Secciones relevantes que indiques).\n- Revisa @editor_entrenamiento_definitivo.md (para mantener consistencia de layout, estilos y comportamiento global)."


📐 Reglas para CONSTRUIR los prompts

1. **Ruta de archivo obligatoria en TODOS los prompts**
   - Cada prompt debe indicar SIEMPRE que el trabajo se hará en:
     - `src\features\EditorEntrenamiento\components\FitCoachPanel.tsx`
   - Puede mencionar la creación de componentes auxiliares (por ejemplo `Header`, `Sidebar`, `DayCard`, `BatchTrainingPanel`, etc.), pero dejando claro que se integran o usan desde `src\features\EditorEntrenamiento\components\FitCoachPanel.tsx`.

2. **Referencias obligatorias en TODOS los prompts**
   - Cada prompt debe cerrar con un bloque `**Referencias Obligatorias:**` que incluya SIEMPRE:
     - `- Revisa @spec-fitcoach-panel.md (Secciones X, Y, Z que tú estimes relevantes).`
     - `- Revisa @editor_entrenamiento_definitivo.md (para mantener coherencia con el resto del editor de entrenamiento).`
   - Mantén exactamente estos nombres con la arroba delante: `@spec-fitcoach-panel.md` y `@editor_entrenamiento_definitivo.md`.

3. **Orden y numeración (plan paso a paso)**
   - Los prompts deben estar ORDENADOS como un plan de implementación incremental para ese módulo. A partir de la estructura de @spec-fitcoach-panel.md, descompón el trabajo en fases lógicas, por ejemplo:
     1. Fundamentos del módulo: layout base, contenedor principal, integración con el layout global.
     2. Subcomponentes principales (headers, toolbars, paneles, tarjetas, tablas, etc.).
     3. Estados, lógica de negocio y manejo de datos (stores, hooks, props, integración con API si aplica).
     4. Interacciones avanzadas: drag & drop, filtros, modales, batch actions, IA, etc.
     5. Responsive y accesibilidad (a11y).
     6. Integración con otros módulos descritos en @editor_entrenamiento_definitivo.md (cuando aplique).
     7. Pulido final: micro-interacciones, estados vacíos, errores, loading, etc.
   - Usa prefijos numéricos de dos dígitos: `01_`, `02_`, `03_`… en el slug del título de cada prompt.
   - El título debe ir en negrita con este formato: `**01_Nombre_Descriptivo**:`.

4. **Estructura interna de CADA prompt**
   - Todos los prompts deben seguir SIEMPRE esta estructura:

     - Línea 1: Nombre del prompt + frase corta en MAYÚSCULAS indicando el momento del flujo (ej.: `INICIO DEL MONTAJE`, `CONTINUACIÓN`, `LÓGICA DE ESTADOS`, `DND CORE`, `CIERRE Y ACCIONES`, etc.).
     - Párrafo inicial: Explica qué se va a construir o refactorizar y deja claro que el foco es `src\features\EditorEntrenamiento\components\FitCoachPanel.tsx`.
     - Bloque `**Instrucciones:**` con una lista numerada (3–7 pasos concretos y accionables).
     - Bloque `**Referencias Obligatorias:**` con las dos referencias a los .md.

   - El contenido debe estar en **español**, con tono directo, muy específico y preparado para que una IA (Gemini CLI) genere o modifique código sin ambigüedades.

5. **Cobertura completa del módulo**
   - A partir de @spec-fitcoach-panel.md:
     - Identifica todas las secciones, estados, variantes, reglas de negocio, responsive, accesibilidad y dependencias con otros módulos.
     - Asegúrate de que, en conjunto, TODOS los prompts cubren el 100% de lo necesario para implementar ese módulo.
   - Si son necesarios más prompts para cubrir bien el módulo, CREA LOS QUE HAGAN FALTA (no te limites por cantidad).

6. **Estilo y enfoque**
   - Claros, accionables, sin ambigüedades y orientados a implementación real en React + TypeScript + Tailwind dentro de `src\features\EditorEntrenamiento\components\FitCoachPanel.tsx`.
   - Si @spec-fitcoach-panel.md menciona integración con otros módulos (por ejemplo navegación global, top bar, batch training, etc.), incluye en los prompts referencias explícitas a esas interacciones y apunta a @editor_entrenamiento_definitivo.md para asegurar consistencia.

Recuerda: la salida final debe ser SOLO el JSON con la clave `"prompts"` y todos los prompts ya ordenados, numerados, mejorados y listos para usar con Gemini CLI, utilizando los literales `@spec-fitcoach-panel.md` y `src\features\EditorEntrenamiento\components\FitCoachPanel.tsx` tal cual aparezcan en este prompt inicial.
