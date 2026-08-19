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
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { ErrorBoundary } from './components/ErrorBoundary';

const googleClientIdRaw = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

function App() {
  return (
    <GoogleOAuthProvider clientId={googleClientIdRaw || ''}>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                    <Route path="/reports" element={<ErrorBoundary><Reports /></ErrorBoundary>} />
                    <Route path="/reports/:id" element={<ErrorBoundary><ReportDetails /></ErrorBoundary>} />
                    <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
                    <Route path="/vault" element={<ErrorBoundary><Vault /></ErrorBoundary>} />
                    <Route path="/learning" element={<ErrorBoundary><Learning /></ErrorBoundary>} />
                  </Route>
                </Route>

                <Route path="/demo" element={<LiveDemo />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
