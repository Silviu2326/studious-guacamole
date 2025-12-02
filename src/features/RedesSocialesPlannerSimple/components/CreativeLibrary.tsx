import { FolderGit, Paperclip, PlusCircle, Tags } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { CreativeAsset } from '../api';

interface CreativeLibraryProps {
  assets: CreativeAsset[];
  onAttachToPost: (assetId: string) => void;
}

const typeLabels: Record<CreativeAsset['type'], string> = {
  imagen: 'Imagen',
  video: 'Video',
  documento: 'Documento',
};

export function CreativeLibrary({ assets, onAttachToPost }: CreativeLibraryProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <FolderGit size={18} />
              <span>Creatividades guardadas</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Biblioteca centralizada</h2>
            <p className="text-sm text-gray-600">
              Organiza, etiqueta y reutiliza tus piezas visuales para mantener coherencia y acelerar la producción.
            </p>
          </div>
          <Button variant="secondary" leftIcon={<PlusCircle size={18} />} onClick={() => alert('Subir asset (próximamente).')}>
            Subir nuevo asset
          </Button>
        </header>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assets.map(asset => (
            <Card
              key={asset.id}
              variant="hover"
              className="flex h-full flex-col gap-4 bg-slate-50 ring-1 ring-slate-200"
              padding="lg"
            >
              <header className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{asset.name}</h3>
                  <p className="text-xs text-slate-500">ID: {asset.id}</p>
                </div>
                <Badge variant="purple" size="sm">
                  {typeLabels[asset.type]}
                </Badge>
              </header>

              <div className="space-y-2 text-sm text-slate-600">
                {asset.lastUsed ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Paperclip size={14} />
                    <span>Último uso: {asset.lastUsed}</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">Aún no se ha utilizado</div>
                )}
                {asset.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 text-xs">
                    <span className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-slate-500">
                      <Tags size={12} />
                      Etiquetas
                    </span>
                    {asset.tags.map(tag => (
                      <Badge key={tag} variant="secondary" size="sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={() => onAttachToPost(asset.id)}
                variant="primary"
                size="sm"
                leftIcon={<Paperclip size={16} />}
                className="mt-auto"
              >
                Adjuntar a publicación
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Card>
  );
}

