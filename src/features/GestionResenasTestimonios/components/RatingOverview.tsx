import { Star, TrendingUp } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { RatingSummary } from '../api';

interface RatingOverviewProps {
  summary?: RatingSummary;
}

const scoreLabels: Record<number, string> = {
  5: 'Excelente',
  4: 'Muy bueno',
  3: 'Aceptable',
  2: 'Mejorar',
  1: 'Crítico',
};

export function RatingOverview({ summary }: RatingOverviewProps) {
  if (!summary) return null;

  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Rating general</h2>
            <p className="text-sm text-slate-600">
              Visualiza el promedio global y la distribución de reseñas recientes.
            </p>
          </div>
          <Badge variant="blue" size="sm" leftIcon={<TrendingUp size={14} />}>
            {summary.last30Days} reseñas últimas 4 semanas
          </Badge>
        </header>

        <div className="grid gap-6 md:grid-cols-[240px,1fr]">
          <Card className="flex flex-col items-center justify-center bg-slate-50 text-center ring-1 ring-slate-200" padding="lg">
            <div className="flex items-center gap-2 text-5xl font-bold text-blue-600">
              <Star size={36} className="fill-blue-500 text-blue-500" />
              {summary.average.toFixed(1)}
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-700">Puntuación media</p>
            <p className="mt-2 text-xs text-slate-500">
              {summary.totalReviews} reseñas totales · {summary.last30Days} en últimos 30 días
            </p>
          </Card>

          <div className="space-y-4">
            {summary.distribution.map(item => (
              <Card key={item.score} className="bg-slate-50 ring-1 ring-slate-200" padding="md">
                <div className="flex items-center gap-4">
                  <div className="w-28 text-sm font-semibold text-slate-700">
                    {item.score} estrellas · {scoreLabels[item.score]}
                  </div>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                      style={{ width: `${(item.count / summary.totalReviews) * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm text-slate-500">{item.count}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

