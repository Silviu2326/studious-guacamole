import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AdherenciaTracker } from './features/adherencia/components/AdherenciaTracker';
import { RestriccionesAlimentariasPage } from './features/restricciones-alimentarias/page';
import BibliotecaEjerciciosPage from './features/biblioteca-ejercicios/page';
import { CajaBancosPage } from './features/caja-bancos';
import { CampanasOutreachPage } from './features/campanas-outreach/page';
import { CatalogoPage } from './features/catalogo-planes';
import { CatalogoProductosPage } from './features/catalogo-productos';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useState } from 'react';
import { ExamplePage } from './components/componentsreutilizables';
import AgendaPage from './features/agenda/page';
function ProtectedRoute() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

function RedirectIfAuthed() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;
  return <Login />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/example" element={<ExamplePage />} />
        <Route path="/login" element={<RedirectIfAuthed />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/** Envuelve las páginas con Layout para mostrar Sidebar */}
          <Route element={<AppLayout />}>
            <Route path="/adherencia" element={<AdherenciaTracker />} />
            <Route path="/restricciones" element={<RestriccionesAlimentariasPage />} />
            <Route path="/biblioteca-ejercicios" element={<BibliotecaEjerciciosPage />} />
            <Route path="/catalogo-planes" element={<CatalogoPage />} />
            <Route path="/catalogo-productos" element={<CatalogoProductosPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/caja-bancos" element={<CajaBancosPage />} />
            <Route path="/campanas-outreach" element={<CampanasOutreachPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

function AppLayout() {
  const [activeView, setActiveView] = useState<string | undefined>(undefined);
  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      <Outlet />
    </Layout>
  );
}
