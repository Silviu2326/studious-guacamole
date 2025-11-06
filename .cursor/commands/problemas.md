# Diagnóstico de Sección <SECCION>

Quiero que actúes como analista de producto + tech lead. Objetivo: generar un archivo Markdown en `docs/secciones/<slug-de-seccion>.md` con un diagnóstico completo.

## Inputs
- SECCION: <SECCION>            # Ej: Venta (POS / Tienda)
- ARCHIVOS_CLAVE: <ARCHIVOS>     # Ej: src/components/Sidebar.tsx, src/features/pos/**

Si <SECCION> permanece sin rellenar, pídemela. Si hay `<ARCHIVOS_CLAVE>`, léelos y referencia hallazgos.

## Alcance
1) Identifica las páginas y rutas reales de la sección (<SECCION>) en el repo (rutas, layouts, features, components).
2) Si existe `@Sidebar.tsx` u otros menús, úsalos para mapear navegación, estados activos y accesos rápidos.

## Entregable (crear este archivo):
Ruta: `docs/secciones/<slug-de-seccion>.md`
Contenido (exacto, en este orden):

# <SECCION> — Diagnóstico funcional y de producto

## 1) Mapa de páginas de la sección
- Lista con rutas reales, componentes raíz y relaciones (padre/hijo).
- Estados vacíos, loading, error y guardias (auth/roles).

## 2) 10 problemas que hoy SÍ resuelve
Para cada punto:
- **Problema cubierto**: …  
- **Página(s)**: …  
- **Como lo resuelve el codigo **:  
- **Riesgos/limitaciones**: …

## 3) 10 problemas que AÚN NO resuelve (y debería)
Para cada punto:
- **Necesidad detectada**: …  
- **Propuesta de solución** (alto nivel + impacto)  
- **Páginas/flujo afectados**: …  
- **Complejidad estimada**: Baja/Media/Alta

## 4) Hallazgos desde navegación/menús
- `@Sidebar.tsx` (o equivalente): secciones, ítems, permisos, badges, shortcuts.
- Inconsistencias de UX o naming.

## 5) KPIs y métricas recomendadas
- Métricas de adopción, tiempo de tarea, conversión interna, errores por flujo, latencia clave.

## 6) Backlog priorizado (RICE/MoSCoW)
- MUST (top 3)  
- SHOULD (top 3)  
- COULD (top 3)

## 7) Próximos pasos
- 3 acciones accionables para la próxima iteración.
- Riesgos y supuestos.

> Notas técnicas: enlaza archivos con rutas relativas. Usa bullets claros. Nada de texto de relleno.

## Reglas
- Si faltan datos, pregúntame lo mínimo y sigue.
- No borres contenido existente en `docs/secciones/`; crea o actualiza idempotente.
