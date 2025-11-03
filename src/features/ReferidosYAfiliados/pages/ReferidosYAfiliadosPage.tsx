import React, { useState, useEffect } from 'react';
import { Layout } from '../../../components/layout';
import { useAuth } from '../../../context/AuthContext';
import { ReferralStatsCard } from '../components/ReferralStatsCard';
import { ShareableLink } from '../components/ShareableLink';
import {
  getReferralOverview,
  getUserReferralData,
  ReferralOverview,
  UserReferralData
} from '../api/referrals';
import { AlertCircle, Users, DollarSign, TrendingUp, Award } from 'lucide-react';

export default function ReferidosYAfiliadosPage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState<ReferralOverview | null>(null);
  const [userData, setUserData] = useState<UserReferralData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const esEntrenador = user?.role === 'entrenador';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (esEntrenador) {
        const data = await getReferralOverview();
        setOverview(data);
      } else {
        const userDataResponse = await getUserReferralData(user?.id || 'user_demo');
        setUserData(userDataResponse);
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
      setIsLoadingUser(false);
    }
  };

  // Vista del Entrenador (Administrador)
  if (esEntrenador) {
    return (
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Referidos & Afiliados
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona tus programas de crecimiento viral y alianzas estratégicas
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              <Users className="w-5 h-5" />
              Nuevo Programa
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {/* Stats Cards */}
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : overview ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ReferralStatsCard
                  title="Total Conversiones"
                  value={overview.kpis.totalConversions}
                  trend="up"
                />
                <ReferralStatsCard
                  title="Ingresos Generados"
                  value={`€${overview.kpis.totalRevenue.toLocaleString()}`}
                  trend="up"
                />
                <ReferralStatsCard
                  title="Tasa de Conversión"
                  value={`${overview.kpis.conversionRate.toFixed(1)}%`}
                  trend="up"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ReferralStatsCard
                  title="CAC del Programa"
                  value={`€${overview.kpis.referralCAC.toFixed(2)}`}
                  trend="down"
                />
                <ReferralStatsCard
                  title="Tasa de Participación"
                  value={`${overview.kpis.participationRate.toFixed(1)}%`}
                  trend="up"
                />
              </div>

              {/* Top Referrers */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Top Clientes Referentes</h2>
                </div>
                {overview.topReferrers.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No hay referentes aún</p>
                ) : (
                  <div className="space-y-4">
                    {overview.topReferrers.map((referrer, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-700 rounded-full font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{referrer.name}</div>
                            <div className="text-sm text-gray-600">
                              {referrer.conversions} conversiones
                            </div>
                          </div>
                        </div>
                        {referrer.earnedAmount && (
                          <div className="text-lg font-bold text-purple-600">
                            €{referrer.earnedAmount}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Top Affiliates */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-900">Top Afiliados</h2>
                </div>
                {overview.topAffiliates.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No hay afiliados aún</p>
                ) : (
                  <div className="space-y-4">
                    {overview.topAffiliates.map((affiliate, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full font-bold">
                            {idx + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{affiliate.name}</div>
                            <div className="text-sm text-gray-600">
                              {affiliate.conversions} conversiones · €{affiliate.revenue.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          €{affiliate.revenue.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </Layout>
    );
  }

  // Vista del Cliente/Afiliado
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mi Programa de Referidos
          </h1>
          <p className="text-gray-600 mt-2">
            Comparte tu enlace y gana recompensas
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {isLoadingUser ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : userData ? (
          <>
            {/* Shareable Link */}
            <ShareableLink link={userData.referralLink} code={userData.referralCode} />

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ReferralStatsCard title="Clics" value={userData.stats.clicks} />
              <ReferralStatsCard title="Registros" value={userData.stats.signups} />
              <ReferralStatsCard title="Conversiones" value={userData.stats.conversions} />
              <ReferralStatsCard title="Pendientes" value={userData.stats.pendingRewards} />
            </div>

            {/* Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tu Actividad</h2>
              {userData.activity.length === 0 ? (
                <p className="text-gray-600 text-center py-8">Aún no tienes referidos</p>
              ) : (
                <div className="space-y-4">
                  {userData.activity.map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-900">{activity.referredName}</div>
                        <div className="text-sm text-gray-600">{activity.date}</div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'rewarded' ? 'bg-green-100 text-green-700' :
                          activity.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {activity.status === 'rewarded' ? 'Recompensado' :
                           activity.status === 'completed' ? 'Completado' :
                           'Pendiente'}
                        </div>
                        {activity.rewardAmount && (
                          <div className="text-sm font-bold text-purple-600 mt-1">
                            €{activity.rewardAmount}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Earned Rewards */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-900">Recompensas Obtenidas</h3>
              </div>
              <p className="text-2xl font-bold text-purple-600">{userData.stats.earnedRewards}</p>
            </div>
          </>
        ) : null}
      </div>
    </Layout>
  );
}

