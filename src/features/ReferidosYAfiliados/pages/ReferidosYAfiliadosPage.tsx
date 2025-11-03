import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ShareableLink } from '../components/ShareableLink';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';
import {
  getReferralOverview,
  getUserReferralData,
  ReferralOverview,
  UserReferralData
} from '../api/referrals';
import { AlertCircle, Users, DollarSign, TrendingUp, Award, Loader2, UserPlus, MousePointerClick } from 'lucide-react';

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
    const metricas = overview ? [
      {
        id: 'total-conversiones',
        title: 'Total Conversiones',
        value: overview.kpis.totalConversions,
        trend: { value: 12, direction: 'up' as const },
        icon: <Users size={20} />,
        color: 'info' as const,
      },
      {
        id: 'ingresos',
        title: 'Ingresos Generados',
        value: `€${overview.kpis.totalRevenue.toLocaleString()}`,
        trend: { value: 8, direction: 'up' as const },
        icon: <DollarSign size={20} />,
        color: 'success' as const,
      },
      {
        id: 'tasa-conversion',
        title: 'Tasa de Conversión',
        value: `${overview.kpis.conversionRate.toFixed(1)}%`,
        trend: { value: 5, direction: 'up' as const },
        icon: <TrendingUp size={20} />,
        color: 'info' as const,
      },
      {
        id: 'cac',
        title: 'CAC del Programa',
        value: `€${overview.kpis.referralCAC.toFixed(2)}`,
        trend: { value: 3, direction: 'down' as const },
        icon: <DollarSign size={20} />,
        color: 'warning' as const,
      },
      {
        id: 'participacion',
        title: 'Tasa de Participación',
        value: `${overview.kpis.participationRate.toFixed(1)}%`,
        trend: { value: 7, direction: 'up' as const },
        icon: <Users size={20} />,
        color: 'success' as const,
      },
    ] : [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
          {/* Header */}
          <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
              <div className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                      <UserPlus size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                        Referidos & Afiliados
                      </h1>
                      <p className="text-gray-600">
                        Gestiona tus programas de crecimiento viral y alianzas estratégicas
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => {}} leftIcon={<Users size={20} />}>
                    Nuevo Programa
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenedor Principal */}
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
            <div className="space-y-6">
              {/* Error Banner */}
              {error && (
                <Card className="p-4 bg-white shadow-sm">
                  <div className="flex items-center gap-3 text-red-600">
                    <AlertCircle size={20} />
                    <div>
                      <strong className="font-bold">Error:</strong>
                      <span className="ml-2">{error}</span>
                    </div>
                  </div>
                </Card>
              )}

              {/* Estado de Carga */}
              {isLoading ? (
                <Card className="p-8 text-center bg-white shadow-sm">
                  <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                  <p className="text-gray-600">Cargando...</p>
                </Card>
              ) : overview ? (
                <>
                  {/* Métricas */}
                  <MetricCards data={metricas} columns={5} />

                  {/* Top Referrers */}
                  <Card className="p-6 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <Award size={20} className="text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-900">Top Clientes Referentes</h2>
                    </div>
                    {overview.topReferrers.length === 0 ? (
                      <div className="text-center py-8">
                        <Users size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay referentes aún</h3>
                        <p className="text-gray-600">Los clientes referentes aparecerán aquí cuando comiencen a referir a otros.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {overview.topReferrers.map((referrer, idx) => (
                          <Card
                            key={idx}
                            variant="hover"
                            className="p-4 bg-white shadow-sm"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 rounded-full font-bold">
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
                                <div className="text-lg font-bold text-blue-600">
                                  €{referrer.earnedAmount}
                                </div>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Top Affiliates */}
                  <Card className="p-6 bg-white shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                      <TrendingUp size={20} className="text-blue-600" />
                      <h2 className="text-xl font-bold text-gray-900">Top Afiliados</h2>
                    </div>
                    {overview.topAffiliates.length === 0 ? (
                      <div className="text-center py-8">
                        <TrendingUp size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay afiliados aún</h3>
                        <p className="text-gray-600">Los afiliados aparecerán aquí cuando comiencen a generar conversiones.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {overview.topAffiliates.map((affiliate, idx) => (
                          <Card
                            key={idx}
                            variant="hover"
                            className="p-4 bg-white shadow-sm"
                          >
                            <div className="flex items-center justify-between">
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
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card>
                </>
              ) : null}
            </div>
          </div>
        </div>
    );
  }

  // Vista del Cliente/Afiliado
  const metricasUsuario = userData ? [
    {
      id: 'clics',
      title: 'Clics',
      value: userData.stats.clicks,
      icon: <MousePointerClick size={20} />,
      color: 'info' as const,
    },
    {
      id: 'registros',
      title: 'Registros',
      value: userData.stats.signups,
      icon: <Users size={20} />,
      color: 'info' as const,
    },
    {
      id: 'conversiones',
      title: 'Conversiones',
      value: userData.stats.conversions,
      icon: <TrendingUp size={20} />,
      color: 'success' as const,
    },
    {
      id: 'pendientes',
      title: 'Pendientes',
      value: userData.stats.pendingRewards,
      icon: <AlertCircle size={20} />,
      color: 'warning' as const,
    },
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header */}
        <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
            <div className="py-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                  <UserPlus size={24} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                    Mi Programa de Referidos
                  </h1>
                  <p className="text-gray-600">
                    Comparte tu enlace y gana recompensas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
          <div className="space-y-6">
            {/* Error Banner */}
            {error && (
              <Card className="p-4 bg-white shadow-sm">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle size={20} />
                  <div>
                    <strong className="font-bold">Error:</strong>
                    <span className="ml-2">{error}</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Estado de Carga */}
            {isLoadingUser ? (
              <Card className="p-8 text-center bg-white shadow-sm">
                <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
                <p className="text-gray-600">Cargando...</p>
              </Card>
            ) : userData ? (
              <>
                {/* Shareable Link */}
                <ShareableLink link={userData.referralLink} code={userData.referralCode} />

                {/* Métricas */}
                <MetricCards data={metricasUsuario} columns={4} />

                {/* Activity */}
                <Card className="p-6 bg-white shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Tu Actividad</h2>
                  {userData.activity.length === 0 ? (
                    <div className="text-center py-8">
                      <Users size={48} className="mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Aún no tienes referidos</h3>
                      <p className="text-gray-600 mb-4">Comparte tu enlace para comenzar a ganar recompensas.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userData.activity.map((activity, idx) => (
                        <Card
                          key={idx}
                          variant="hover"
                          className="p-4 bg-white shadow-sm"
                        >
                          <div className="flex items-center justify-between">
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
                                <div className="text-sm font-bold text-blue-600 mt-1">
                                  €{activity.rewardAmount}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Earned Rewards */}
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={24} className="text-blue-600" />
                    <h3 className="text-xl font-bold text-gray-900">Recompensas Obtenidas</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{userData.stats.earnedRewards}</p>
                </Card>
              </>
            ) : null}
          </div>
        </div>
      </div>
  );
}

