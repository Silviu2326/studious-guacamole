import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  ClipperHighlights,
  ContentRecycler,
  ApprovedContentToCampaigns,
  ContentToFunnelsLinker,
  BrandProfileConfig,
  CreativeVoiceConfig,
  StarFormatsConfig,
  TrainerNichesConfig,
  BrandKitGenerator,
  VisualStyleLearning,
  PromotionalContentTemplates,
  LaunchOrchestrator,
  EventChallengeContentKit,
} from '../components';
import { Button } from '../../../components/componentsreutilizables';
import type { AssetsAndBrandSnapshot } from '../types';
import { getClips, getCategories } from '../../ContentClipper/api/clips';
import { subDays } from 'date-fns';

/**
 * Página dedicada "Activos & Marca"
 * Combina la biblioteca de contenido y la configuración de marca/voz
 * en una única experiencia coherente
 */
export default function AssetsAndBrandPage() {
  const [loading, setLoading] = useState(true);
  const [clipperData, setClipperData] = useState<AssetsAndBrandSnapshot['clipper'] | null>(null);

  useEffect(() => {
    loadClipperData();
  }, []);

  /**
   * Carga los datos del clipper de forma independiente
   * Transforma los datos de la API de ContentClipper al formato esperado por ClipperHighlights
   */
  const loadClipperData = async () => {
    setLoading(true);
    try {
      const [clipsResponse, categoriesResponse] = await Promise.all([
        getClips(),
        getCategories(),
      ]);

      const clips = clipsResponse.data;
      const categories = categoriesResponse || [];

      // Calcular clips nuevos esta semana
      const weekAgo = subDays(new Date(), 7);
      const newThisWeek = clips.filter(
        (clip) => new Date(clip.createdAt) >= weekAgo
      ).length;

      // Transformar categorías
      const categorySummaries = categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        count: clips.filter((clip) => clip.categoryId === cat.id).length,
        color: cat.color,
      }));

      // Extraer tags en tendencia (los más usados)
      const tagCounts: Record<string, number> = {};
      clips.forEach((clip) => {
        clip.tags.forEach((tag) => {
          tagCounts[tag.name] = (tagCounts[tag.name] || 0) + 1;
        });
      });
      const trendingTags = Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tag]) => tag);

      // Transformar clips destacados (los más usados o recientes)
      const featured = clips
        .slice(0, 6)
        .map((clip) => ({
          id: clip.id,
          title: clip.title,
          category: clip.category?.name,
          source: clip.source,
          tags: clip.tags.map((tag) => tag.name),
          savedAt: clip.createdAt,
          usageCount: 0, // Este dato no está disponible en la API actual
          impact: clip.scrapedDescription || clip.personalNotes || undefined,
        }));

      setClipperData({
        totalClips: clipsResponse.pagination.totalItems,
        newThisWeek,
        categories: categorySummaries,
        featured,
        trendingTags,
      });
    } catch (error) {
      console.error('[AssetsAndBrandPage] Error loading clipper data', error);
      // En caso de error, establecer datos vacíos
      setClipperData({
        totalClips: 0,
        newThisWeek: 0,
        categories: [],
        featured: [],
        trendingTags: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Activos & Marca</h1>
            <p className="text-slate-600 mt-2">
              Gestiona tu biblioteca de contenido y configura tu identidad de marca
            </p>
          </div>
          <Link to="/dashboard/content/social-studio">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>

      {/* Zona 1: Biblioteca de contenido */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">Biblioteca de Contenido</h2>
          <p className="text-sm text-slate-600 mt-1">
            Organiza, recicla y distribuye tu contenido aprobado
          </p>
        </div>
        <div className="space-y-6">
          {clipperData && (
            <ClipperHighlights clipper={clipperData} loading={loading} />
          )}
          <ContentRecycler loading={loading} />
          <ApprovedContentToCampaigns loading={loading} />
          <ContentToFunnelsLinker loading={loading} />
        </div>
      </section>

      {/* Zona 2: Identidad de marca */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">Identidad de Marca</h2>
          <p className="text-sm text-slate-600 mt-1">
            Define tu perfil, voz creativa, formatos estrella y nichos principales
          </p>
        </div>
        <div className="space-y-6">
          <BrandProfileConfig loading={loading} />
          <CreativeVoiceConfig loading={loading} />
          <StarFormatsConfig loading={loading} />
          <TrainerNichesConfig loading={loading} />
          <BrandKitGenerator loading={loading} />
          <VisualStyleLearning loading={loading} />
        </div>
      </section>

      {/* Zona 3: Kits & Lanzamientos */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">Kits & Lanzamientos</h2>
          <p className="text-sm text-slate-600 mt-1">
            Genera contenido promocional, orquesta lanzamientos y crea kits para eventos
          </p>
        </div>
        <div className="space-y-6">
          <PromotionalContentTemplates loading={loading} />
          <LaunchOrchestrator loading={loading} />
          <EventChallengeContentKit loading={loading} />
        </div>
      </section>
    </div>
  );
}

