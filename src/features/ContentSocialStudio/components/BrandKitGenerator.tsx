import { useState, useEffect } from 'react';
import {
  Palette,
  Type,
  MessageSquare,
  Download,
  Share2,
  Sparkles,
  CheckCircle2,
  Copy,
  X,
  Eye,
} from 'lucide-react';
import {
  Button,
  Card,
  Input,
  Select,
  Textarea,
  Badge,
} from '../../../components/componentsreutilizables';
import type {
  BrandKit,
  GenerateBrandKitRequest,
  BrandColor,
  BrandTypography,
  BrandSlogan,
  ToneOfVoice,
} from '../types';
import {
  generateBrandKit,
  getBrandKits,
  shareBrandKit,
  deleteBrandKit,
} from '../api/brandKit';
import { getAvailableTones } from '../api/brandProfile';
import { getTeamMembers } from '../api/contentAssignments';
import type { TeamMember } from '../types';

interface BrandKitGeneratorProps {
  loading?: boolean;
}

export function BrandKitGenerator({ loading: externalLoading }: BrandKitGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [brandKits, setBrandKits] = useState<BrandKit[]>([]);
  const [selectedKit, setSelectedKit] = useState<BrandKit | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [formData, setFormData] = useState<GenerateBrandKitRequest>({
    name: '',
    description: '',
    includeColors: true,
    includeTypography: true,
    includeSlogans: true,
    colorPreferences: {
      style: 'professional',
    },
    typographyPreferences: {
      style: 'modern',
    },
    sloganPreferences: {
      tone: 'motivacional',
      count: 4,
    },
  });

  const tones = getAvailableTones();
  const colorStyles = [
    { value: 'vibrant', label: 'Vibrante' },
    { value: 'minimal', label: 'Minimalista' },
    { value: 'professional', label: 'Profesional' },
    { value: 'energetic', label: 'Energético' },
    { value: 'calm', label: 'Calmado' },
  ];
  const typographyStyles = [
    { value: 'modern', label: 'Moderno' },
    { value: 'classic', label: 'Clásico' },
    { value: 'bold', label: 'Bold' },
    { value: 'elegant', label: 'Elegante' },
    { value: 'playful', label: 'Juguetón' },
  ];

  useEffect(() => {
    loadBrandKits();
    loadTeamMembers();
  }, []);

  const loadBrandKits = async () => {
    setLoading(true);
    try {
      const kits = await getBrandKits();
      setBrandKits(kits);
      if (kits.length > 0 && !selectedKit) {
        setSelectedKit(kits[0]);
      }
    } catch (error) {
      console.error('Error loading brand kits:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const members = await getTeamMembers();
      setTeamMembers(members.filter((m) => m.isActive));
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleGenerate = async () => {
    if (!formData.name.trim()) {
      alert('Por favor, ingresa un nombre para el kit de marca');
      return;
    }

    setGenerating(true);
    try {
      const response = await generateBrandKit(formData);
      setBrandKits([response.brandKit, ...brandKits]);
      setSelectedKit(response.brandKit);
      setShowGenerator(false);
      setFormData({
        name: '',
        description: '',
        includeColors: true,
        includeTypography: true,
        includeSlogans: true,
        colorPreferences: { style: 'professional' },
        typographyPreferences: { style: 'modern' },
        sloganPreferences: { tone: 'motivacional', count: 4 },
      });
    } catch (error) {
      console.error('Error generating brand kit:', error);
      alert('Error al generar el kit de marca. Intenta nuevamente.');
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async (teamMemberIds: string[]) => {
    if (!selectedKit) return;

    try {
      await shareBrandKit({
        brandKitId: selectedKit.id,
        teamMemberIds,
        accessLevel: 'download',
      });
      await loadBrandKits();
      setShowShareModal(false);
      alert('Kit compartido exitosamente');
    } catch (error) {
      console.error('Error sharing brand kit:', error);
      alert('Error al compartir el kit. Intenta nuevamente.');
    }
  };

  const copyColorHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    alert(`Color ${hex} copiado al portapapeles`);
  };

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-500" />
            Generador de Kits de Marca
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Genera kits de marca coherentes con paleta de colores, tipografías y slogans para tu equipo externo
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowGenerator(!showGenerator)}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          {showGenerator ? 'Cancelar' : 'Generar Nuevo Kit'}
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {showGenerator && (
          <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-100 space-y-4">
            <h3 className="text-lg font-semibold text-indigo-900">Configuración del Kit</h3>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nombre del Kit *
              </label>
              <Input
                placeholder="Ej: Kit de Marca 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Descripción (Opcional)
              </label>
              <Textarea
                placeholder="Describe el propósito de este kit de marca..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeColors"
                  checked={formData.includeColors}
                  onChange={(e) =>
                    setFormData({ ...formData, includeColors: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="includeColors" className="text-sm font-medium text-slate-700">
                  Incluir Paleta de Colores
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeTypography"
                  checked={formData.includeTypography}
                  onChange={(e) =>
                    setFormData({ ...formData, includeTypography: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="includeTypography" className="text-sm font-medium text-slate-700">
                  Incluir Tipografías
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeSlogans"
                  checked={formData.includeSlogans}
                  onChange={(e) =>
                    setFormData({ ...formData, includeSlogans: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="includeSlogans" className="text-sm font-medium text-slate-700">
                  Incluir Slogans
                </label>
              </div>
            </div>

            {formData.includeColors && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estilo de Colores
                </label>
                <Select
                  options={colorStyles}
                  value={formData.colorPreferences?.style || 'professional'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      colorPreferences: {
                        ...formData.colorPreferences,
                        style: e.target.value as any,
                      },
                    })
                  }
                />
              </div>
            )}

            {formData.includeTypography && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Estilo de Tipografía
                </label>
                <Select
                  options={typographyStyles}
                  value={formData.typographyPreferences?.style || 'modern'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      typographyPreferences: {
                        ...formData.typographyPreferences,
                        style: e.target.value as any,
                      },
                    })
                  }
                />
              </div>
            )}

            {formData.includeSlogans && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Tono para Slogans
                </label>
                <Select
                  options={tones.map((t) => ({ value: t.value, label: t.label }))}
                  value={formData.sloganPreferences?.tone || 'motivacional'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sloganPreferences: {
                        ...formData.sloganPreferences,
                        tone: e.target.value as ToneOfVoice,
                      },
                    })
                  }
                />
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={generating}
              leftIcon={generating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              className="w-full"
            >
              {generating ? 'Generando...' : 'Generar Kit de Marca'}
            </Button>
          </div>
        )}

        {brandKits.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Kits Generados</h3>
              <Select
                options={brandKits.map((kit) => ({ value: kit.id, label: kit.name }))}
                value={selectedKit?.id || ''}
                onChange={(e) => {
                  const kit = brandKits.find((k) => k.id === e.target.value);
                  setSelectedKit(kit || null);
                }}
                placeholder="Selecciona un kit"
              />
            </div>

            {selectedKit && (
              <div className="space-y-6">
                {/* Paleta de Colores */}
                {selectedKit.colorPalette.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-5 h-5 text-indigo-500" />
                      <h4 className="text-md font-semibold text-slate-900">Paleta de Colores</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      {selectedKit.colorPalette.map((color) => (
                        <div
                          key={color.id}
                          className="border border-slate-200 rounded-lg overflow-hidden"
                        >
                          <div
                            className="h-20 w-full"
                            style={{ backgroundColor: color.hex }}
                          />
                          <div className="p-3">
                            <p className="text-xs font-semibold text-slate-900">{color.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <code className="text-xs text-slate-600">{color.hex}</code>
                              <button
                                onClick={() => copyColorHex(color.hex)}
                                className="text-slate-400 hover:text-slate-600"
                                title="Copiar"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                            <Badge variant="blue" size="sm" className="mt-1">
                              {color.usage}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tipografías */}
                {selectedKit.typographies.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Type className="w-5 h-5 text-indigo-500" />
                      <h4 className="text-md font-semibold text-slate-900">Tipografías</h4>
                    </div>
                    <div className="space-y-3">
                      {selectedKit.typographies.map((typography) => (
                        <div
                          key={typography.id}
                          className="p-4 border border-slate-200 rounded-lg"
                          style={{ fontFamily: typography.fontFamily }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-slate-900">{typography.name}</p>
                            <Badge variant="purple" size="sm">
                              {typography.usage}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-1">
                            {typography.fontFamily}
                          </p>
                          <p className="text-sm text-slate-500">
                            Pesos: {typography.fontWeights.join(', ')}
                          </p>
                          {typography.description && (
                            <p className="text-xs text-slate-400 mt-2">{typography.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Slogans */}
                {selectedKit.slogans.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-5 h-5 text-indigo-500" />
                      <h4 className="text-md font-semibold text-slate-900">Slogans</h4>
                    </div>
                    <div className="space-y-2">
                      {selectedKit.slogans.map((slogan) => (
                        <div
                          key={slogan.id}
                          className="p-4 border border-slate-200 rounded-lg bg-slate-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-slate-900 mb-1">{slogan.text}</p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="green" size="sm">
                                  {slogan.variant}
                                </Badge>
                                {slogan.usage?.map((use, idx) => (
                                  <Badge key={idx} variant="gray" size="sm">
                                    {use}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowShareModal(true)}
                    leftIcon={<Share2 className="w-4 h-4" />}
                  >
                    Compartir con Equipo
                  </Button>
                  <Button variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                    Exportar PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {brandKits.length === 0 && !showGenerator && (
          <div className="text-center py-12">
            <Palette className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">No hay kits de marca generados aún</p>
            <Button
              variant="primary"
              onClick={() => setShowGenerator(true)}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Generar tu Primer Kit
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Compartir */}
      {showShareModal && selectedKit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Compartir Kit de Marca</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Selecciona los miembros del equipo con los que quieres compartir este kit
            </p>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded">
                  <input
                    type="checkbox"
                    id={`member-${member.id}`}
                    className="w-4 h-4"
                    onChange={(e) => {
                      // Handle selection
                    }}
                  />
                  <label
                    htmlFor={`member-${member.id}`}
                    className="flex-1 text-sm font-medium text-slate-700 cursor-pointer"
                  >
                    {member.name} - {member.roleLabel}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  const selectedIds = teamMembers
                    .filter((m) => {
                      const checkbox = document.getElementById(`member-${m.id}`) as HTMLInputElement;
                      return checkbox?.checked;
                    })
                    .map((m) => m.id);
                  if (selectedIds.length > 0) {
                    handleShare(selectedIds);
                  } else {
                    alert('Selecciona al menos un miembro del equipo');
                  }
                }}
              >
                Compartir
              </Button>
              <Button variant="secondary" onClick={() => setShowShareModal(false)}>
                Cancelar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
}

