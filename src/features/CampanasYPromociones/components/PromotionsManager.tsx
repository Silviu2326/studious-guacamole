import { Gift, TicketPercent } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { Promotion } from '../api';

interface PromotionsManagerProps {
  promotions: Promotion[];
  onCreatePromotion: () => void;
}

const PROMO_TYPE_LABEL: Record<Promotion['type'], string> = {
  discount: 'Descuento',
  coupon: 'Cupón',
  referral: 'Código amigos',
};

export function PromotionsManager({ promotions, onCreatePromotion }: PromotionsManagerProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Promos, cupones y códigos amigos</h2>
            <p className="text-sm text-slate-600">
              Gestiona ofertas puntuales, cupones de campaña y códigos de referidos para tus mensajes multicanal.
            </p>
          </div>
          <Button variant="primary" leftIcon={<Gift size={18} />} onClick={onCreatePromotion}>
            Crear promoción
          </Button>
        </header>

        <div className="space-y-3">
          {promotions.map(promotion => (
            <Card
              key={promotion.id}
              className="flex flex-col gap-2 bg-slate-50 ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between"
              padding="lg"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900">{promotion.name}</h3>
                <Badge variant="secondary" size="sm" leftIcon={<TicketPercent size={14} />}>
                  {PROMO_TYPE_LABEL[promotion.type]}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span className="font-semibold text-slate-900">{promotion.value}</span>
                {promotion.expiresAt && <span>Válido hasta {promotion.expiresAt}</span>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}

