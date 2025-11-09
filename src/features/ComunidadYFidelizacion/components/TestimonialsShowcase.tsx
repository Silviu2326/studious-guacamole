import { Star, Quote, Share2, MessageCircle } from 'lucide-react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { Testimonial } from '../types';

interface TestimonialsShowcaseProps {
  testimonials: Testimonial[];
  loading?: boolean;
}

export function TestimonialsShowcase({ testimonials, loading }: TestimonialsShowcaseProps) {
  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Motor de reseñas y testimonios
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Destaca los momentos épicos de tus miembros y capitaliza la prueba social en campañas, páginas
            de registro y automatizaciones de nurture.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="inline-flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Crear snippet social
          </Button>
          <Button variant="ghost" className="inline-flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Pedir nuevo testimonio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {(loading ? Array.from({ length: 3 }) : testimonials).map((testimonial, index) => (
          <article
            key={testimonial?.id ?? index}
            className="relative h-full rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-6 shadow-sm"
          >
            <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-200 dark:text-slate-800" />
            {testimonial ? (
              <>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {testimonial.customerName}
                    </p>
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {testimonial.role}
                    </p>
                  </div>
                  <Badge variant="blue" size="sm">
                    {testimonial.channel}
                  </Badge>
                </div>
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-5">
                    “{testimonial.quote}”
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-amber-500 dark:text-amber-300">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-semibold">{testimonial.score.toFixed(1)}</span>
                    </span>
                    <Badge variant="blue" size="sm">
                      {testimonial.impactTag}
                    </Badge>
                  </div>
                </div>
              </>
            ) : (
              <SkeletonTestimonial />
            )}
          </article>
        ))}
      </div>
    </Card>
  );
}

function SkeletonTestimonial() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-24 bg-slate-200/80 dark:bg-slate-800/80 rounded-md" />
          <div className="mt-2 h-3 w-32 bg-slate-200/60 dark:bg-slate-800/60 rounded-md" />
        </div>
        <div className="h-5 w-20 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-md" />
        <div className="h-3 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-md" />
        <div className="h-3 w-1/2 bg-slate-200/70 dark:bg-slate-800/70 rounded-md" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 bg-slate-200/80 dark:bg-slate-800/70 rounded-md" />
        <div className="h-5 w-20 bg-slate-200/60 dark:bg-slate-800/60 rounded-full" />
      </div>
    </div>
  );
}


