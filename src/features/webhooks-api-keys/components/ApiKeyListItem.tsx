import React from 'react';
import { ApiKey } from '../types';
import { Trash2, Copy, CheckCircle } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { Badge } from '../../../components/componentsreutilizables';

interface ApiKeyListItemProps {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
}

export const ApiKeyListItem: React.FC<ApiKeyListItemProps> = ({ apiKey, onRevoke }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (apiKey.secretKey) {
      navigator.clipboard.writeText(apiKey.secretKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {apiKey.name}
            </h3>
            {apiKey.status === 'active' ? (
              <Badge variant="success" size="sm">Activa</Badge>
            ) : (
              <Badge variant="destructive" size="sm">Revocada</Badge>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-2">
            <span className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark} font-mono`}>
              {apiKey.prefix}
            </span>
            {apiKey.secretKey && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs">Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-xs">Copiar</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {apiKey.scopes.map((scope) => (
              <Badge key={scope} variant="secondary" size="sm">
                {scope}
              </Badge>
            ))}
          </div>

          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            Creada: {formatDate(apiKey.createdAt)}
          </p>
        </div>

        <button
          onClick={() => onRevoke(apiKey.id)}
          disabled={apiKey.status === 'revoked'}
          className="ml-4 p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Revocar API Key"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

