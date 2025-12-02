import React, { useEffect, useMemo, useState } from 'react';
import { Card, Select } from '../../../components/componentsreutilizables';
import { getCheckInsAnalyticsClientes } from '../api/checkins';
import { TrendingUp, Users, AlertTriangle } from 'lucide-react';

interface ClienteOption {
  value: string;
  label: string;
}

interface Props {
  optionsClientes: ClienteOption[];
}

export const AnalyticsAgregadoClientes: React.FC<Props> = ({ optionsClientes }) => {
  const [seleccion, setSeleccion] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Awaited<ReturnType<typeof getCheckInsAnalyticsClientes>> | null>(null);

  const handleLoad = async () => {
    setLoading(true);
    const res = await getCheckInsAnalyticsClientes(seleccion);
    setData(res);
    setLoading(false);
  };

  const selectedLabels = useMemo(() => {
    const map = new Map(optionsClientes.map((o) => [o.value, o.label]));
    return (data?.porCliente || []).map((c) => ({ ...c, label: map.get(c.clienteId) || c.clienteId }));
  }, [data, optionsClientes]);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={20} className="text-blue-600" />
          Selección de Clientes
        </h3>
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <Select
              multiple
              value={seleccion}
              onChange={(e: any) => {
                const value = Array.isArray(e) ? e : e?.target?.value;
                setSeleccion(value || []);
              }}
              options={optionsClientes}
              placeholder="Elige uno o varios clientes"
            />
          </div>
          <button
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            disabled={loading || seleccion.length === 0}
            onClick={handleLoad}
          >
            {loading ? 'Cargando...' : 'Comparar'}
          </button>
        </div>
      </Card>

      {data && (
        <>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" />
              Resumen comparativo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-slate-50 border">
                <div className="text-xs text-slate-600">Clientes</div>
                <div className="text-2xl font-bold text-slate-900">{data.comparativo.totalClientes}</div>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                <div className="text-xs text-slate-600">Total Check-ins</div>
                <div className="text-2xl font-bold text-purple-700">{data.comparativo.totalCheckIns}</div>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="text-xs text-slate-600">Promedio Semáforo Global</div>
                <div className="text-2xl font-bold text-green-700">{data.comparativo.promedioSemaforoGlobal.toFixed(2)}</div>
              </div>
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                <div className="text-xs text-slate-600">RPE Promedio Global</div>
                <div className="text-2xl font-bold text-indigo-700">{data.comparativo.promedioRPEGlobal}</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-2">Distribución Global</div>
                <div className="space-y-2">
                  {(['verde', 'amarillo', 'rojo'] as const).map((k) => {
                    const total = data.comparativo.totalCheckIns || 1;
                    const v = data.comparativo.distribucionGlobal[k];
                    const pct = Math.round((v / total) * 100);
                    const color =
                      k === 'verde' ? 'bg-green-500' : k === 'amarillo' ? 'bg-yellow-500' : 'bg-red-500';
                    return (
                      <div key={k}>
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize">{k}</span>
                          <span className="font-semibold">{v} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div className={`${color} h-3 rounded-full`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm font-medium text-slate-700 mb-2">Ranking por Riesgo</div>
                <div className="space-y-2">
                  {data.comparativo.rankingPorRiesgo.map((r, i) => {
                    const label = optionsClientes.find((o) => o.value === r.clienteId)?.label || r.clienteId;
                    return (
                      <div key={r.clienteId} className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-white rounded border">{i + 1}</span>
                          <span className="text-sm font-medium text-slate-800">{label}</span>
                        </div>
                        <div className="text-sm font-semibold text-red-700 flex items-center gap-1">
                          <AlertTriangle size={16} />
                          {r.scoreRiesgo}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparativa por cliente</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2 border">Cliente</th>
                    <th className="text-left px-3 py-2 border">Total Check-ins</th>
                    <th className="text-left px-3 py-2 border">Prom. Semáforo</th>
                    <th className="text-left px-3 py-2 border">RPE Promedio</th>
                    <th className="text-left px-3 py-2 border">Verde</th>
                    <th className="text-left px-3 py-2 border">Amarillo</th>
                    <th className="text-left px-3 py-2 border">Rojo</th>
                    <th className="text-left px-3 py-2 border">Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLabels.map((c) => (
                    <tr key={c.clienteId} className="odd:bg-white even:bg-slate-50">
                      <td className="px-3 py-2 border">{c.label}</td>
                      <td className="px-3 py-2 border">{c.totalCheckIns}</td>
                      <td className="px-3 py-2 border">{c.promedioSemaforo.toFixed(2)}</td>
                      <td className="px-3 py-2 border">{c.promedioRPE}</td>
                      <td className="px-3 py-2 border">{c.distribucionSemaforos.verde}</td>
                      <td className="px-3 py-2 border">{c.distribucionSemaforos.amarillo}</td>
                      <td className="px-3 py-2 border">{c.distribucionSemaforos.rojo}</td>
                      <td className="px-3 py-2 border capitalize">{c.tendenciaGeneral}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};


