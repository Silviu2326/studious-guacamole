import { useEffect, useMemo, useState } from 'react';
import {
  CampaignTemplate,
  Promotion,
  Segment,
  fetchActivePromotions,
  fetchCampaignTemplates,
  fetchSimpleSegments,
} from '../api';
import { EmailSmsBasics, PromotionsManager, SegmentsSelector } from '../components';
import { Button, Card, Input, MetricCards } from '../../../components/componentsreutilizables';
import { ArrowUpRight, Filter, Layers, MailCheck, Megaphone, Search, Send, Sparkles, Users } from 'lucide-react';

export function CampanasPromocionesPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>();
  const [segmentSearch, setSegmentSearch] = useState('');
  const [promotionSearch, setPromotionSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [segmentsData, templatesData, promotionsData] = await Promise.all([
        fetchSimpleSegments(),
        fetchCampaignTemplates(),
        fetchActivePromotions(),
      ]);

      setSegments(segmentsData);
      setTemplates(templatesData);
      setPromotions(promotionsData);

      if (segmentsData.length > 0) {
        setSelectedSegmentId(segmentsData[0].id);
      }
      if (templatesData.length > 0) {
        setSelectedTemplateId(templatesData[0].id);
      }
    };

    void loadData();
  }, []);

  const handleCreatePromotion = () => {
    alert('Crear promoción (pendiente de implementación)');
  };

  const metrics = useMemo(() => {
    const totalSegments = segments.length;
    const totalTemplates = templates.length;
    const totalPromotions = promotions.length;
    const totalContacts = segments.reduce((sum, segment) => sum + segment.size, 0);

    return [
      {
        id: 'segments',
        title: 'Segmentos disponibles',
        value: totalSegments,
        subtitle: `${totalContacts} contactos totales`,
        color: 'info' as const,
        icon: <Users size={18} />,
      },
      {
        id: 'templates',
        title: 'Plantillas listas',
        value: totalTemplates,
        subtitle: 'Email & SMS optimizados',
        color: 'primary' as const,
        icon: <MailCheck size={18} />,
      },
      {
        id: 'promotions',
        title: 'Promos activas',
        value: totalPromotions,
        subtitle: 'Cupones y códigos referidos',
        color: 'success' as const,
        icon: <Megaphone size={18} />,
      },
      {
        id: 'selected-segment',
        title: 'Segmento activo',
        value: selectedSegmentId ? segments.find(seg => seg.id === selectedSegmentId)?.name ?? '—' : 'Selecciona uno',
        subtitle: selectedSegmentId ? segments.find(seg => seg.id === selectedSegmentId)?.description ?? '' : 'Elige un segmento para configurar campañas',
        color: 'warning' as const,
        icon: <Layers size={18} />,
      },
    ];
  }, [segments, templates, promotions, selectedSegmentId]);

  const filteredSegments = useMemo(() => {
    const term = segmentSearch.trim().toLowerCase();
    if (!term) {
      return segments;
    }

    return segments.filter(segment => {
      return (
        segment.name.toLowerCase().includes(term) ||
        segment.description.toLowerCase().includes(term)
      );
    });
  }, [segments, segmentSearch]);

  const filteredPromotions = useMemo(() => {
    const term = promotionSearch.trim().toLowerCase();
    if (!term) {
      return promotions;
    }

    return promotions.filter(promotion => {
      return (
        promotion.name.toLowerCase().includes(term) ||
        promotion.type.toLowerCase().includes(term) ||
        promotion.value.toLowerCase().includes(term)
      );
    });
  }, [promotions, promotionSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="mr-4 rounded-xl bg-blue-100 p-2 ring-1 ring-blue-200/70">
                <Send size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                  Campañas & promociones
                </h1>
                <p className="text-gray-600">
                  Lanza campañas segmentadas en minutos: elige audiencia, activa plantillas y añade promociones que impulsan la conversión.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" leftIcon={<Sparkles size={18} />}>
              Crear campaña avanzada
            </Button>
            <Button variant="primary" leftIcon={<ArrowUpRight size={18} />} onClick={handleCreatePromotion}>
              Nueva promoción
            </Button>
          </div>

          <MetricCards data={metrics} columns={4} />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200" padding="md">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <Input
                    value={segmentSearch}
                    onChange={event => setSegmentSearch(event.target.value)}
                    placeholder="Buscar segmentos por nombre o descripción..."
                    leftIcon={<Search size={18} />}
                    aria-label="Buscar segmentos"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button variant="secondary" leftIcon={<Filter size={18} />} className="whitespace-nowrap">
                      Filtros avanzados
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setSegmentSearch('')}
                      disabled={segmentSearch.length === 0}
                      className="whitespace-nowrap text-sm"
                    >
                      Limpiar búsqueda
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                <span>{filteredSegments.length} segmentos coinciden</span>
                <span>{segments.length} segmentos en total</span>
              </div>
            </div>
          </Card>

          <SegmentsSelector
            segments={filteredSegments}
            selectedSegmentId={selectedSegmentId}
            onSelectSegment={setSelectedSegmentId}
          />

          <EmailSmsBasics
            templates={templates}
            selectedTemplateId={selectedTemplateId}
            onSelectTemplate={setSelectedTemplateId}
          />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200" padding="md">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <Input
                    value={promotionSearch}
                    onChange={event => setPromotionSearch(event.target.value)}
                    placeholder="Buscar promociones por nombre o tipo..."
                    leftIcon={<Search size={18} />}
                    aria-label="Buscar promociones"
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setPromotionSearch('')}
                    disabled={promotionSearch.length === 0}
                    className="whitespace-nowrap text-sm"
                  >
                    Limpiar búsqueda
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                <span>{filteredPromotions.length} promociones disponibles</span>
                <span>{promotions.length} activas actualmente</span>
              </div>
            </div>
          </Card>

          <PromotionsManager promotions={filteredPromotions} onCreatePromotion={handleCreatePromotion} />

          <Card padding="lg" className="bg-white text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-semibold text-gray-900">Próximamente</p>
            <p className="mt-2 text-gray-600">
              Seguimiento de resultados en tiempo real, automatizaciones omnicanal y editor visual de campañas.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
