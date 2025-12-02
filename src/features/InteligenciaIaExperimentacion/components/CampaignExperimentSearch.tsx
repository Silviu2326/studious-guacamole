import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, FlaskConical, Megaphone, ArrowRight } from 'lucide-react';
import { TopCampaign, ExperimentRecord } from '../types';

interface CampaignExperimentSearchProps {
  campaigns?: TopCampaign[];
  experiments?: ExperimentRecord[];
  onCampaignClick?: (campaignId: string) => void;
  onExperimentClick?: (experimentId: string) => void;
}

interface SearchResult {
  id: string;
  name: string;
  type: 'campaign' | 'experiment';
  subtitle?: string;
  metadata?: string;
}

export const CampaignExperimentSearch: React.FC<CampaignExperimentSearchProps> = ({
  campaigns = [],
  experiments = [],
  onCampaignClick,
  onExperimentClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Buscar en campañas
    campaigns.forEach((campaign) => {
      if (
        campaign.name.toLowerCase().includes(query) ||
        campaign.channel.toLowerCase().includes(query)
      ) {
        results.push({
          id: campaign.id,
          name: campaign.name,
          type: 'campaign',
          subtitle: campaign.channel,
          metadata: `${campaign.conversionRate.toFixed(1)}% conversión`,
        });
      }
    });

    // Buscar en experimentos
    experiments.forEach((experiment) => {
      if (
        experiment.name.toLowerCase().includes(query) ||
        experiment.hypothesis.toLowerCase().includes(query) ||
        experiment.primaryMetric.toLowerCase().includes(query)
      ) {
        results.push({
          id: experiment.id,
          name: experiment.name,
          type: 'experiment',
          subtitle: experiment.hypothesis,
          metadata: experiment.status === 'running' ? 'En curso' : experiment.status,
        });
      }
    });

    return results.slice(0, 8); // Limitar a 8 resultados
  }, [searchQuery, campaigns, experiments]);

  useEffect(() => {
    setShowResults(isFocused && searchResults.length > 0 && searchQuery.length >= 2);
  }, [isFocused, searchResults, searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'campaign') {
      onCampaignClick?.(result.id);
    } else {
      onExperimentClick?.(result.id);
    }
    setSearchQuery('');
    setIsFocused(false);
    setShowResults(false);
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsFocused(false);
    setShowResults(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay para permitir clicks en resultados
            setTimeout(() => {
              setIsFocused(false);
              setShowResults(false);
            }, 200);
          }}
          placeholder="Buscar campañas, experimentos o palabras clave..."
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10 pr-10 py-2.5 text-sm transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-slate-700 transition-colors"
            type="button"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Resultados en tiempo real */}
      {showResults && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200/70 max-h-96 overflow-y-auto">
          <div className="p-2">
            {searchResults.length > 0 ? (
              <>
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                </div>
                {searchResults.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                    type="button"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        result.type === 'campaign'
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {result.type === 'campaign' ? (
                          <Megaphone size={16} />
                        ) : (
                          <FlaskConical size={16} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {result.name}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            result.type === 'campaign'
                              ? 'bg-indigo-50 text-indigo-700'
                              : 'bg-purple-50 text-purple-700'
                          }`}>
                            {result.type === 'campaign' ? 'Campaña' : 'Experimento'}
                          </span>
                        </div>
                        {result.subtitle && (
                          <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                            {result.subtitle}
                          </p>
                        )}
                        {result.metadata && (
                          <p className="text-xs text-slate-500 mt-1">
                            {result.metadata}
                          </p>
                        )}
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-slate-400 group-hover:text-indigo-600 transition-colors flex-shrink-0 mt-1"
                      />
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="px-3 py-8 text-center">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">
                  No se encontraron resultados para "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignExperimentSearch;

