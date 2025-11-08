import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Filter, Images, PencilLine, Search, Send } from 'lucide-react';
import { Button, Card, Input, MetricCards } from '../../../components/componentsreutilizables';
import {
  CalendarPost,
  CreativeAsset,
  fetchCalendarPosts,
  fetchCreativeAssets,
} from '../api';
import { CreativeLibrary, MonthlyCalendar } from '../components';

export function RedesSocialesPlannerSimplePage() {
  const today = new Date();
  const [month] = useState(today.getMonth());
  const [year] = useState(today.getFullYear());
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [assets, setAssets] = useState<CreativeAsset[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [calendarPosts, creativeAssets] = await Promise.all([fetchCalendarPosts(), fetchCreativeAssets()]);
      setPosts(calendarPosts);
      setAssets(creativeAssets);
    };

    void loadData();
  }, []);

  const handleCreatePost = (date: string) => {
    alert(`Crear nueva publicación para ${date} (próximamente).`);
  };

  const handleSelectPost = (postId: string) => {
    alert(`Ver/editar publicación ${postId} (próximamente).`);
  };

  const handleAttachAsset = (assetId: string) => {
    alert(`Adjuntar asset ${assetId} a publicación seleccionada (próximamente).`);
  };

  const metrics = useMemo(() => {
    const scheduled = posts.filter(post => post.status === 'programado').length;
    const drafts = posts.filter(post => post.status === 'borrador').length;
    const published = posts.filter(post => post.status === 'publicado').length;

    return [
      {
        id: 'total-posts',
        title: 'Publicaciones del mes',
        value: posts.length,
        subtitle: 'Incluye borradores, programadas y publicadas',
        color: 'info' as const,
        icon: <CalendarDays size={20} />,
      },
      {
        id: 'scheduled-posts',
        title: 'Programadas',
        value: scheduled,
        subtitle: 'Listas para salir automáticamente',
        color: 'success' as const,
        icon: <Send size={18} />,
      },
      {
        id: 'draft-posts',
        title: 'Borradores',
        value: drafts,
        subtitle: 'Pendientes de revisión',
        color: 'warning' as const,
        icon: <PencilLine size={18} />,
      },
      {
        id: 'published-posts',
        title: 'Publicadas',
        value: published,
        subtitle: 'Ya visibles en redes',
        color: 'primary' as const,
        icon: <Images size={18} />,
      },
    ];
  }, [posts]);

  const filteredAssets = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return assets;
    }

    return assets.filter(asset => {
      return (
        asset.name.toLowerCase().includes(term) ||
        asset.tags.some(tag => tag.toLowerCase().includes(term)) ||
        asset.type.toLowerCase().includes(term)
      );
    });
  }, [assets, searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <header className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="mr-4 rounded-xl bg-blue-100 p-2 ring-1 ring-blue-200/70">
                <CalendarDays size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 md:text-4xl">
                  Planner simple de redes sociales
                </h1>
                <p className="text-gray-600">
                  Planifica el calendario editorial, gestiona creatividades y mantén control de tus contenidos desde un único lugar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-end">
            <Button onClick={() => handleCreatePost(today.toISOString().slice(0, 10))} leftIcon={<Send size={20} />}>
              Programar nueva publicación
            </Button>
          </div>

          <MetricCards data={metrics} columns={4} />

          <Card className="bg-white shadow-sm ring-1 ring-slate-200" padding="md">
            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                  <Input
                    value={searchTerm}
                    onChange={event => setSearchTerm(event.target.value)}
                    placeholder="Buscar por nombre, tipo o etiqueta..."
                    leftIcon={<Search size={18} />}
                    aria-label="Buscar creatividades"
                  />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button variant="secondary" leftIcon={<Filter size={18} />} className="whitespace-nowrap">
                      Filtros avanzados
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setSearchTerm('')}
                      disabled={searchTerm.length === 0}
                      className="whitespace-nowrap text-sm"
                    >
                      Limpiar búsqueda
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{filteredAssets.length} assets disponibles</span>
                <span>{posts.length} publicaciones en calendario</span>
              </div>
            </div>
          </Card>

          <MonthlyCalendar
            month={month}
            year={year}
            posts={posts}
            onCreatePost={handleCreatePost}
            onSelectPost={handleSelectPost}
          />

          <CreativeLibrary assets={filteredAssets} onAttachToPost={handleAttachAsset} />

          <Card padding="lg" className="bg-white text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-lg font-semibold text-gray-900">Próximamente</p>
            <p className="mt-2 text-gray-600">
              Duplicar publicaciones, integración con campañas de pago y analítica de engagement por plataforma.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}

