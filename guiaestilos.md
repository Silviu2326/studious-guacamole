# Sistema de Diseño - ERP CLInicas dentales

**Versión:** 2.0  
**Última actualización:** 2025-01-17  
**Estado:** Activo

---

## 🎨 Identidad Visual

**Personalidad:** Sofisticada, moderna y accesible. "Beauty-tech premium" que inspira confianza y profesionalismo.

**Tono:** Directo, empático y orientado a resultados. Microcopys que guían y educan.

## 🌈 Paleta de Color

### Primarios
- **Primary:** `#6366F1` (Indigo moderno - CTA principal)
- **Primary-600:** `#4F46E5` (Hover states)
- **Primary-700:** `#4338CA` (Active states)
- **Primary-50:** `#EEF2FF` (Backgrounds suaves)
- **On-Primary:** `#FFFFFF`

### Neutros
- **Background:** `#FFFFFF` (Light) / `#0F0F23` (Dark)
- **Surface:** `#F8FAFC` (Light) / `#1E1E2E` (Dark)
- **Surface-2:** `#F1F5F9` (Light) / `#2A2A3A` (Dark)
- **Text-Primary:** `#0F172A` (Light) / `#F1F5F9` (Dark)
- **Text-Secondary:** `#64748B` (Light) / `#94A3B8` (Dark)
- **Text-Muted:** `#94A3B8` (Light) / `#64748B` (Dark)
- **Border:** `#E2E8F0` (Light) / `#334155` (Dark)
- **Border-Light:** `#F1F5F9` (Light) / `#475569` (Dark)

### Estados Semánticos
- **Success:** `#10B981` (Emerald)
- **Success-Light:** `#D1FAE5`
- **Warning:** `#F59E0B` (Amber)
- **Warning-Light:** `#FEF3C7`
- **Error:** `#EF4444` (Red)
- **Error-Light:** `#FEE2E2`
- **Info:** `#3B82F6` (Blue)
- **Info-Light:** `#DBEAFE`

### Gradientes Modernos
- **Primary-Gradient:** `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)`
- **Surface-Gradient:** `linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)`
- **Success-Gradient:** `linear-gradient(135deg, #10B981 0%, #059669 100%)`

> **Contraste:** Cumplir WCAG AA (4.5:1). Opacidades mínimas 70% para texto principal.

## 📝 Tipografía

### Familias de Fuente
- **Primaria:** Inter (Variable) - Moderna y legible
- **Secundaria:** SF Pro Display (iOS) / Roboto (Android)
- **Monospace:** JetBrains Mono (Código)

### Escala Tipográfica
- **Display-Large:** 48px / 56px line-height / 800 weight
- **Display:** 36px / 44px line-height / 700 weight
- **Heading-1:** 30px / 38px line-height / 700 weight
- **Heading-2:** 24px / 32px line-height / 600 weight
- **Heading-3:** 20px / 28px line-height / 600 weight
- **Body-Large:** 18px / 28px line-height / 400 weight
- **Body:** 16px / 24px line-height / 400 weight
- **Body-Small:** 14px / 20px line-height / 400 weight
- **Caption:** 12px / 16px line-height / 500 weight
- **Overline:** 10px / 16px line-height / 600 weight (uppercase)

### Pesos de Fuente
- **Thin:** 100 (Solo para display)
- **Light:** 300 (Textos secundarios)
- **Regular:** 400 (Texto base)
- **Medium:** 500 (Subtítulos)
- **Semibold:** 600 (CTAs, labels)
- **Bold:** 700 (Títulos)
- **Extrabold:** 800 (Display)

## 📏 Espaciado & Geometría

### Sistema de Espaciado (8px base)
- **0.5:** 4px (Bordes, separadores)
- **1:** 8px (Padding mínimo)
- **1.5:** 12px (Espaciado interno)
- **2:** 16px (Espaciado estándar)
- **3:** 24px (Espaciado medio)
- **4:** 32px (Espaciado grande)
- **5:** 40px (Espaciado extra)
- **6:** 48px (Espaciado máximo)

### Radios de Borde
- **None:** 0px (Elementos técnicos)
- **Small:** 6px (Badges, chips)
- **Medium:** 8px (Botones pequeños)
- **Large:** 12px (Botones, inputs)
- **XLarge:** 16px (Cards, modales)
- **2XLarge:** 24px (Contenedores grandes)
- **Full:** 9999px (Pills, avatares)

### Elevación (Sombras)
- **None:** `none`
- **Small:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Medium:** `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Large:** `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`
- **XLarge:** `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
- **2XLarge:** `0 25px 50px -12px rgba(0, 0, 0, 0.25)`

## 🎯 Iconografía

### Librerías de Iconos
- **Primaria:** Lucide React - Amplia variedad 
- **Secundaria:** Heroicons (Outline + Solid) - Consistencia y modernidad
- **Especializada:** Tabler Icons - Iconos específicos de negocio

### Tamaños Estándar
- **XS:** 12px (Indicadores, estados)
- **SM:** 16px (Labels, badges)
- **MD:** 20px (Botones, navegación)
- **LG:** 24px (Headers, CTAs)
- **XL:** 32px (Hero sections)
- **2XL:** 48px (Display, landing)

### Colores de Iconos
- **Primary:** `#6366F1` (Acciones principales)
- **Secondary:** `#64748B` (Iconos secundarios)
- **Muted:** `#94A3B8` (Estados deshabilitados)
- **Success:** `#10B981` (Confirmaciones)
- **Warning:** `#F59E0B` (Alertas)
- **Error:** `#EF4444` (Errores)

## 🖼️ Imágenes & Medios

### Especificaciones Técnicas
- **Ratio:** 16:9 (hero), 4:3 (cards), 1:1 (avatares)
- **Calidad:** WebP con fallback JPEG
- **Lazy Loading:** Intersection Observer
- **Placeholders:** Skeleton con shimmer effect

### Avatares
- **XS:** 24px (Comentarios)
- **SM:** 32px (Listas)
- **MD:** 40px (Headers)
- **LG:** 48px (Perfiles)
- **XL:** 64px (Hero profiles)
- **2XL:** 96px (Landing)

### Optimización
- **Compresión:** 85% JPEG, 90% WebP
- **Responsive:** srcset con breakpoints
- **CDN:** Cloudinary o similar
- **Fallbacks:** SVG placeholders

## ⚡ Animaciones & Microinteracciones

### Duración de Transiciones
- **Instant:** 0ms (Estados críticos)
- **Fast:** 100ms (Hover, focus)
- **Normal:** 200ms (Navegación, modales)
- **Slow:** 300ms (Page transitions)
- **Slower:** 500ms (Loading states)

### Easing Functions
- **Ease-out:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)` (Entrada)
- **Ease-in:** `cubic-bezier(0.55, 0.055, 0.675, 0.19)` (Salida)
- **Ease-in-out:** `cubic-bezier(0.4, 0, 0.2, 1)` (Transiciones)
- **Bounce:** `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (Success)

### Gestos Modernos
- **Swipe:** Horizontal para navegación
- **Pull-to-refresh:** Vertical con indicador
- **Pinch-to-zoom:** Imágenes y mapas
- **Long-press:** Menús contextuales
- **Haptic feedback:** Vibración sutil en móviles

## 🧩 Componentes Base

### Botones

#### Primary Button
- **Fondo:** `#6366F1` con gradiente sutil
- **Texto:** `#FFFFFF` (on-primary)
- **Hover:** `#4F46E5` + elevación
- **Active:** `#4338CA` + scale(0.98)
- **Disabled:** `#94A3B8` + cursor not-allowed

#### Secondary Button
- **Fondo:** `#F8FAFC` con borde
- **Borde:** `#E2E8F0` 1px
- **Texto:** `#0F172A` (text-primary)
- **Hover:** `#F1F5F9` + borde `#6366F1`

#### Ghost Button
- **Fondo:** Transparente
- **Texto:** `#6366F1` (primary)
- **Hover:** `#EEF2FF` (primary-50)
- **Active:** `#E0E7FF` (primary-100)

#### Destructive Button
- **Fondo:** `#EF4444` (error)
- **Texto:** `#FFFFFF`
- **Hover:** `#DC2626` + elevación
- **Active:** `#B91C1C` + scale(0.98)

### Inputs & Formularios

#### Text Input
- **Altura:** 48px (lg) / 40px (md) / 32px (sm)
- **Padding:** 12px horizontal, 8px vertical
- **Borde:** `#E2E8F0` 1px, radio 12px
- **Focus:** Borde `#6366F1` + sombra sutil
- **Error:** Borde `#EF4444` + texto error
- **Disabled:** Fondo `#F8FAFC` + texto `#94A3B8`

#### Select Dropdown
- **Estilo:** Consistente con input
- **Chevron:** Icono de 16px, color `#64748B`
- **Options:** Padding 12px, hover `#F8FAFC`

### Chips & Tags

#### Chip Base
- **Padding:** 8px 16px
- **Radio:** 20px (pill shape)
- **Fondo:** `#F1F5F9` (surface-2)
- **Texto:** `#64748B` (text-secondary)

#### Chip Selected
- **Fondo:** `#EEF2FF` (primary-50)
- **Borde:** `#6366F1` 1px
- **Texto:** `#6366F1` (primary)

### Cards & Contenedores

#### Card Base
- **Fondo:** `#FFFFFF`
- **Borde:** `#E2E8F0` 1px
- **Radio:** 16px
- **Sombra:** Medium elevation
- **Padding:** 24px

#### Card Hover
- **Sombra:** Large elevation
- **Transform:** translateY(-2px)
- **Transición:** 200ms ease-out

### Badges & Estados

#### Badge Success
- **Fondo:** `#D1FAE5` (success-light)
- **Texto:** `#10B981` (success)
- **Tamaño:** 12px font, 6px padding

#### Badge Warning
- **Fondo:** `#FEF3C7` (warning-light)
- **Texto:** `#F59E0B` (warning)

#### Badge Error
- **Fondo:** `#FEE2E2` (error-light)
- **Texto:** `#EF4444` (error)

### Modales & Overlays

#### Modal Base
- **Fondo:** `#FFFFFF`
- **Radio:** 16px
- **Sombra:** 2XLarge elevation
- **Backdrop:** `rgba(0, 0, 0, 0.5)` con blur
- **Animación:** Scale + fade in

#### Bottom Sheet
- **Handle:** 4px alto, 40px ancho, `#E2E8F0`
- **Radio:** 16px top corners
- **Safe area:** Padding bottom automático

### Notificaciones

#### Toast/Snackbar
- **Máximo:** 2 líneas de texto
- **Duración:** 4000ms (success) / 6000ms (error)
- **Acción:** "Deshacer" con 3000ms adicionales
- **Posición:** Top-right con stack

## 🎯 Patrones de UI Modernos

### Exploración & Navegación
- **Mapa inteligente:** Clustering automático (≤30 pines), mini-cards al tap
- **Búsqueda predictiva:** Autocompletado con categorías (servicios/ubicación/estilistas)
- **Filtros avanzados:** Sidebar deslizable, chips con contadores dinámicos
- **Navegación breadcrumb:** Para flujos complejos de múltiples pasos

### Estados de Disponibilidad
- **Badges semánticos:** Colores + iconos + texto descriptivo
- **Indicadores temporales:** "Hoy", "Mañana", "Esta semana" + horarios aproximados
- **Estados en tiempo real:** Actualización automática de disponibilidad

### Flujos de Conversión
- **Checkout optimizado:** Pasos progresivos, resumen flotante, CTA sticky
- **Onboarding guiado:** Tours interactivos con tooltips contextuales
- **Confirmaciones claras:** Estados de éxito con próximos pasos

## ♿ Accesibilidad & Inclusión

### Estándares WCAG 2.1 AA
- **Contraste:** Mínimo 4.5:1 para texto normal, 3:1 para texto grande
- **Tamaños táctiles:** Mínimo 44×44px para elementos interactivos
- **Navegación por teclado:** Tab order lógico, focus visible
- **Screen readers:** Labels descriptivos, roles semánticos

### Adaptabilidad
- **Dynamic Type:** Respeta escalado del sistema operativo
- **Alto contraste:** Modo automático para usuarios con necesidades visuales
- **Reducción de movimiento:** Respeta `prefers-reduced-motion`
- **Idiomas:** Soporte RTL para árabe/hebreo

## 📱 Microinteracciones & Feedback

### Haptic Feedback
- **Success:** Vibración suave (100ms) para confirmaciones
- **Error:** Vibración doble (200ms) para errores críticos
- **Navigation:** Vibración sutil (50ms) para cambios de estado
- **Long press:** Vibración media (150ms) para acciones contextuales

### Estados del Sistema
- **Loading:** Skeleton screens con shimmer, nunca spinners indefinidos
- **Empty states:** Ilustraciones + texto útil + CTA de acción
- **Error states:** Mensaje humano + botón de reintento + fallback
- **Offline:** Funcionalidad limitada + indicador de estado + sincronización automática

## 💬 Tono & Microcopy

### Principios de Comunicación
- **Empático:** "Entendemos tu frustración" en lugar de "Error del sistema"
- **Orientado a acción:** "Completa tu perfil" en lugar de "Información faltante"
- **Progresivo:** "Paso 2 de 4" para flujos largos
- **Contextual:** Mensajes específicos según la situación del usuario

### Formatos Específicos
- **Monedas:** Formato local con separadores regionales (€1.234,56)
- **Fechas:** "Hoy", "Mañana", "Esta semana" + fechas absolutas
- **Tiempo:** "En 2 horas" + timestamp exacto
- **Ubicación:** "A 5 min caminando" + dirección completa

## 🛠️ Implementación Técnica

### Sistema de Tema Moderno

```typescript
// theme.ts - Sistema de diseño v2.0
export const theme = {
  colors: {
    // Primarios modernos
    primary: "#6366F1",
    primaryHover: "#4F46E5", 
    primaryActive: "#4338CA",
    primaryLight: "#EEF2FF",
    
    // Neutros actualizados
    background: "#FFFFFF",
    surface: "#F8FAFC",
    surface2: "#F1F5F9",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    textMuted: "#94A3B8",
    border: "#E2E8F0",
    borderLight: "#F1F5F9",
    
    // Estados semánticos
    success: "#10B981",
    successLight: "#D1FAE5",
    warning: "#F59E0B", 
    warningLight: "#FEF3C7",
    error: "#EF4444",
    errorLight: "#FEE2E2",
    info: "#3B82F6",
    infoLight: "#DBEAFE",
  },
  
  // Sistema de espaciado 8px
  spacing: {
    0.5: 4, 1: 8, 1.5: 12, 2: 16, 3: 24, 4: 32, 5: 40, 6: 48
  },
  
  // Radios modernos
  radius: {
    none: 0, sm: 6, md: 8, lg: 12, xl: 16, "2xl": 24, full: 9999
  },
  
  // Tipografía escalable
  typography: {
    displayLarge: { size: 48, lineHeight: 56, weight: 800 },
    display: { size: 36, lineHeight: 44, weight: 700 },
    h1: { size: 30, lineHeight: 38, weight: 700 },
    h2: { size: 24, lineHeight: 32, weight: 600 },
    h3: { size: 20, lineHeight: 28, weight: 600 },
    bodyLarge: { size: 18, lineHeight: 28, weight: 400 },
    body: { size: 16, lineHeight: 24, weight: 400 },
    bodySmall: { size: 14, lineHeight: 20, weight: 400 },
    caption: { size: 12, lineHeight: 16, weight: 500 },
  },
  
  // Animaciones fluidas
  transitions: {
    fast: "100ms ease-out",
    normal: "200ms ease-out", 
    slow: "300ms ease-out",
    slower: "500ms ease-out"
  },
  
  // Elevación moderna
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
  }
}
```

### Componentes React Modernos

```typescript
// Button.tsx - Componente moderno
import React from 'react';
import { getTailwindClasses } from './theme';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  onClick
}) => {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-[#6366F1] text-white hover:bg-[#4F46E5] focus:ring-[#6366F1] shadow-md hover:shadow-lg",
    secondary: "bg-white text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F8FAFC] focus:ring-[#6366F1]",
    ghost: "text-[#6366F1] hover:bg-[#EEF2FF] focus:ring-[#6366F1]",
    destructive: "bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444] shadow-md hover:shadow-lg"
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base", 
    lg: "px-6 py-3 text-lg"
  };
  
  const disabledClasses = "opacity-50 cursor-not-allowed";
  
  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabled ? disabledClasses : ''}
      `}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      ) : null}
      {children}
    </button>
  );
};
```

## 🌙 Modo Oscuro

### Paleta Invertida
- **Background:** `#0F0F23` (negro profundo)
- **Surface:** `#1E1E2E` (gris oscuro)
- **Text:** `#F1F5F9` (blanco suave)
- **Borders:** `#334155` (gris medio)
- **Primary:** Mantiene `#6366F1` (consistencia)

### Activación Automática
- **Sistema:** Respeta `prefers-color-scheme: dark`
- **Manual:** Toggle en configuración de usuario
- **Persistencia:** Guarda preferencia en localStorage

## ⚡ Optimización & Rendimiento

### Técnicas Modernas
- **Virtualización:** React Window para listas largas
- **Lazy Loading:** Intersection Observer para imágenes
- **Code Splitting:** Lazy imports por rutas
- **Memoización:** React.memo para componentes pesados
- **Debouncing:** Para búsquedas y filtros

### Métricas Objetivo
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Cumulative Layout Shift:** < 0.1
- **Time to Interactive:** < 3.5s

## ✅ Do's & Don'ts

### ✅ Hacer
- Usar el sistema de espaciado 8px consistentemente
- Aplicar transiciones de 200ms para interacciones
- Mantener contraste mínimo 4.5:1
- Usar iconos de 20px para navegación
- Implementar estados de loading con skeleton
- Aplicar focus visible en todos los elementos interactivos

### ❌ No Hacer
- Mezclar diferentes sistemas de espaciado
- Usar transiciones > 500ms para interacciones
- Crear elementos táctiles < 44px
- Usar colores de estado para texto principal
- Implementar spinners indefinidos
- Olvidar estados de error y vacío