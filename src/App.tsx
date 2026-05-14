import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layout/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Reports } from './pages/Reports';
import { ReportDetails } from './pages/ReportDetails';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Landing } from './pages/Landing';
import { Vault } from './pages/Vault';
import { Learning } from './pages/Learning';
import { LiveDemo } from './pages/LiveDemo';
import { ThemeProvider } from './components/ThemeProvider';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

const googleClientIdRaw = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={googleClientIdRaw || ''}>
      {children}
    </GoogleOAuthProvider>
  );
};

function App() {

  return (
    <AppProviders>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/reports/:id" element={<ReportDetails />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/vault" element={<Vault />} />
                <Route path="/learning" element={<Learning />} />
              </Route>
            </Route>

            <Route path="/demo" element={<LiveDemo />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AppProviders>
  );
}

export default App;
