import type {
  BrandKit,
  BrandColor,
  BrandTypography,
  BrandSlogan,
  GenerateBrandKitRequest,
  GenerateBrandKitResponse,
  ShareBrandKitRequest,
  ShareBrandKitResponse,
  ToneOfVoice,
} from '../types';
import { getBrandProfileConfig } from './brandProfile';

// Mock storage - en producción vendría del backend
let brandKits: BrandKit[] = [];

/**
 * Simula latencia de red
 */
const simulateLatency = async (ms: number = 300) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Genera colores de marca basados en preferencias
 */
function generateColorPalette(preferences?: GenerateBrandKitRequest['colorPreferences']): BrandColor[] {
  const colors: BrandColor[] = [];

  // Colores primarios
  if (preferences?.primaryColor) {
    const primaryHex = preferences.primaryColor;
    const rgb = hexToRgb(primaryHex);
    colors.push({
      id: 'color-primary',
      name: 'Color Principal',
      hex: primaryHex,
      rgb: rgb || { r: 79, g: 70, b: 229 },
      usage: 'primary',
      description: 'Color principal de la marca',
    });
  } else {
    // Color por defecto basado en estilo
    const defaultColors: Record<string, string> = {
      vibrant: '#FF6B6B',
      minimal: '#2D3748',
      professional: '#4F46E5',
      energetic: '#F59E0B',
      calm: '#10B981',
    };
    const style = preferences?.style || 'professional';
    const hex = defaultColors[style] || defaultColors.professional;
    const rgb = hexToRgb(hex);
    colors.push({
      id: 'color-primary',
      name: 'Color Principal',
      hex,
      rgb: rgb || { r: 79, g: 70, b: 229 },
      usage: 'primary',
      description: 'Color principal de la marca',
    });
  }

  // Colores secundarios y de acento
  const primaryColor = colors[0];
  const secondaryHex = adjustBrightness(primaryColor.hex, -20);
  const accentHex = adjustBrightness(primaryColor.hex, 30);
  const neutralHex = '#6B7280';
  const backgroundHex = '#F9FAFB';
  const textHex = '#111827';

  colors.push(
    {
      id: 'color-secondary',
      name: 'Color Secundario',
      hex: secondaryHex,
      rgb: hexToRgb(secondaryHex) || { r: 99, g: 102, b: 241 },
      usage: 'secondary',
      description: 'Color secundario para complementar el principal',
    },
    {
      id: 'color-accent',
      name: 'Color de Acento',
      hex: accentHex,
      rgb: hexToRgb(accentHex) || { r: 139, g: 92, b: 246 },
      usage: 'accent',
      description: 'Color de acento para destacar elementos importantes',
    },
    {
      id: 'color-neutral',
      name: 'Neutro',
      hex: neutralHex,
      rgb: hexToRgb(neutralHex) || { r: 107, g: 114, b: 128 },
      usage: 'neutral',
      description: 'Color neutro para textos y elementos secundarios',
    },
    {
      id: 'color-background',
      name: 'Fondo',
      hex: backgroundHex,
      rgb: hexToRgb(backgroundHex) || { r: 249, g: 250, b: 251 },
      usage: 'background',
      description: 'Color de fondo para espacios en blanco',
    },
    {
      id: 'color-text',
      name: 'Texto',
      hex: textHex,
      rgb: hexToRgb(textHex) || { r: 17, g: 24, b: 39 },
      usage: 'text',
      description: 'Color principal para textos',
    }
  );

  return colors;
}

/**
 * Genera tipografías de marca
 */
function generateTypography(
  preferences?: GenerateBrandKitRequest['typographyPreferences']
): BrandTypography[] {
  const typographies: BrandTypography[] = [];

  const style = preferences?.style || 'modern';
  const fontConfigs: Record<string, { heading: string; body: string }> = {
    modern: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    classic: {
      heading: 'Playfair Display, serif',
      body: 'Lora, serif',
    },
    bold: {
      heading: 'Montserrat, sans-serif',
      body: 'Open Sans, sans-serif',
    },
    elegant: {
      heading: 'Cormorant Garamond, serif',
      body: 'Cormorant Garamond, serif',
    },
    playful: {
      heading: 'Poppins, sans-serif',
      body: 'Nunito, sans-serif',
    },
  };

  const fonts = fontConfigs[style] || fontConfigs.modern;

  typographies.push(
    {
      id: 'typography-heading',
      name: 'Tipografía para Títulos',
      fontFamily: fonts.heading,
      fontWeights: [600, 700, 800],
      usage: 'heading',
      sizes: {
        desktop: '2rem - 3.5rem',
        mobile: '1.5rem - 2.5rem',
      },
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      description: 'Usar para títulos principales y encabezados',
    },
    {
      id: 'typography-body',
      name: 'Tipografía para Cuerpo',
      fontFamily: fonts.body,
      fontWeights: [400, 500, 600],
      usage: 'body',
      sizes: {
        desktop: '1rem - 1.25rem',
        mobile: '0.875rem - 1rem',
      },
      lineHeight: '1.6',
      letterSpacing: '0',
      description: 'Usar para textos de cuerpo y párrafos',
    },
    {
      id: 'typography-accent',
      name: 'Tipografía de Acento',
      fontFamily: fonts.heading,
      fontWeights: [700, 800],
      usage: 'accent',
      sizes: {
        desktop: '1.25rem - 2rem',
        mobile: '1rem - 1.5rem',
      },
      lineHeight: '1.3',
      letterSpacing: '-0.01em',
      description: 'Usar para destacar frases importantes o CTAs',
    }
  );

  return typographies;
}

/**
 * Genera slogans de marca
 */
async function generateSlogans(
  preferences?: GenerateBrandKitRequest['sloganPreferences']
): Promise<BrandSlogan[]> {
  const slogans: BrandSlogan[] = [];

  // Intentar obtener el perfil de marca para generar slogans coherentes
  const brandProfile = await getBrandProfileConfig();
  const tone = preferences?.tone || brandProfile?.toneOfVoice || 'motivacional';

  const sloganTemplates: Record<ToneOfVoice, string[]> = {
    motivacional: [
      'Transforma tu cuerpo, transforma tu vida',
      'Tu mejor versión te está esperando',
      'Cada entrenamiento te acerca a tus metas',
      'La disciplina es la clave del éxito',
    ],
    tecnico: [
      'Entrenamiento basado en evidencia científica',
      'Resultados medibles, progreso constante',
      'Metodología probada para tu transformación',
    ],
    cercano: [
      'Tu entrenador personal, tu compañero de viaje',
      'Juntos alcanzamos tus objetivos',
      'Entrenamiento personalizado para ti',
    ],
    profesional: [
      'Excelencia en entrenamiento personal',
      'Comprometidos con tu éxito',
      'Resultados profesionales, atención personalizada',
    ],
    energetico: [
      '¡Enciende tu potencial!',
      'Energía, fuerza, resultados',
      '¡Vamos por más!',
    ],
    empatico: [
      'Entendemos tu proceso, acompañamos tu transformación',
      'Cada paso cuenta, cada logro importa',
      'Tu bienestar es nuestra prioridad',
    ],
    educativo: [
      'Aprende, entrena, transforma',
      'Conocimiento y acción para resultados reales',
      'Educación en movimiento',
    ],
    directo: [
      'Resultados. Punto.',
      'Entrena duro, logra más',
      'Sin excusas, solo resultados',
    ],
  };

  const templates = sloganTemplates[tone] || sloganTemplates.motivacional;
  const count = preferences?.count || 4;

  templates.slice(0, count).forEach((text, index) => {
    slogans.push({
      id: `slogan-${index + 1}`,
      text,
      variant: index === 0 ? 'primary' : index === 1 ? 'secondary' : 'tagline',
      context: 'Uso general en contenido de marca',
      usage: ['redes sociales', 'marketing', 'presentaciones'],
    });
  });

  // Agregar CTA específico
  slogans.push({
    id: 'slogan-cta',
    text: '¡Comienza tu transformación hoy!',
    variant: 'cta',
    context: 'Llamado a la acción',
    usage: ['landing pages', 'redes sociales', 'emails'],
  });

  return slogans;
}

/**
 * Convierte hex a RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Ajusta el brillo de un color
 */
function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.max(0, Math.min(255, rgb.r + (rgb.r * percent) / 100));
  const g = Math.max(0, Math.min(255, rgb.g + (rgb.g * percent) / 100));
  const b = Math.max(0, Math.min(255, rgb.b + (rgb.b * percent) / 100));

  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

/**
 * Genera un kit de marca completo
 */
export const generateBrandKit = async (
  request: GenerateBrandKitRequest
): Promise<GenerateBrandKitResponse> => {
  await simulateLatency(800);

  const trainerId = 'trn_current'; // En producción vendría del contexto de autenticación
  const now = new Date().toISOString();

  const colorPalette: BrandColor[] = request.includeColors ? generateColorPalette(request.colorPreferences) : [];
  const typographies: BrandTypography[] = request.includeTypography
    ? generateTypography(request.typographyPreferences)
    : [];
  const slogans: BrandSlogan[] = request.includeSlogans ? await generateSlogans(request.sloganPreferences) : [];

  const brandKit: BrandKit = {
    id: `brandkit-${Date.now()}`,
    trainerId,
    name: request.name,
    description: request.description,
    colorPalette,
    typographies,
    slogans,
    brandGuidelines: {
      do: [
        'Usar los colores principales en elementos destacados',
        'Mantener consistencia en tipografías',
        'Aplicar los slogans según el contexto adecuado',
        'Respetar los espacios y proporciones recomendadas',
      ],
      dont: [
        'No mezclar más de 3 colores principales en un mismo diseño',
        'No usar tipografías que no estén en el kit',
        'No modificar los colores sin justificación',
        'No usar slogans fuera de contexto',
      ],
      spacingRules: 'Mantener un espaciado mínimo de 1.5x el tamaño de fuente entre elementos',
      usageExamples: [
        'Redes sociales: Usar colores primarios y secundarios',
        'Presentaciones: Combinar tipografías heading y body',
        'Marketing: Incorporar slogans según el tono del mensaje',
      ],
    },
    exportFormats: ['pdf', 'png', 'svg', 'json'],
    createdAt: now,
    updatedAt: now,
  };

  brandKits.push(brandKit);

  return {
    success: true,
    message: 'Kit de marca generado exitosamente',
    brandKit,
  };
};

/**
 * Obtiene todos los kits de marca del entrenador
 */
export const getBrandKits = async (): Promise<BrandKit[]> => {
  await simulateLatency(300);
  return brandKits.filter((kit) => kit.trainerId === 'trn_current');
};

/**
 * Obtiene un kit de marca por ID
 */
export const getBrandKitById = async (id: string): Promise<BrandKit | null> => {
  await simulateLatency(200);
  return brandKits.find((kit) => kit.id === id && kit.trainerId === 'trn_current') || null;
};

/**
 * Comparte un kit de marca con miembros del equipo
 */
export const shareBrandKit = async (
  request: ShareBrandKitRequest
): Promise<ShareBrandKitResponse> => {
  await simulateLatency(400);

  const kit = brandKits.find((k) => k.id === request.brandKitId);
  if (!kit) {
    throw new Error('Kit de marca no encontrado');
  }

  // Mock de miembros del equipo
  const teamMembers = [
    { id: 'tm-1', name: 'María García', role: 'designer' as const },
    { id: 'tm-2', name: 'Carlos López', role: 'video-editor' as const },
    { id: 'tm-3', name: 'Ana Martínez', role: 'copywriter' as const },
  ];

  const sharedWith = request.teamMemberIds.map((memberId) => {
    const member = teamMembers.find((tm) => tm.id === memberId);
    return {
      teamMemberId: memberId,
      teamMemberName: member?.name || 'Miembro del equipo',
      accessLevel: request.accessLevel,
    };
  });

  // Actualizar el kit con la información de compartido
  kit.sharedWith = [
    ...(kit.sharedWith || []),
    ...sharedWith.map((sw) => ({
      ...sw,
      role: teamMembers.find((tm) => tm.id === sw.teamMemberId)?.role || 'designer',
      sharedAt: new Date().toISOString(),
    })),
  ];

  return {
    success: true,
    message: `Kit compartido con ${sharedWith.length} miembro(s) del equipo`,
    sharedWith,
  };
};

/**
 * Elimina un kit de marca
 */
export const deleteBrandKit = async (id: string): Promise<void> => {
  await simulateLatency(200);
  brandKits = brandKits.filter((kit) => kit.id !== id);
};

