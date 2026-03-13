import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import { UserProvider, useUser } from './context/UserContext';

import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Burnout from './pages/Burnout';
import Simulator from './pages/Simulator';
import Report from './pages/Report';
import Resources from './pages/Resources';

function AppContent() {
  const { user } = useUser();

  if (!user) {
    return <Signup />;
  }

  return (
    <ToastProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/burnout" element={<Burnout />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/report" element={<Report />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ToastProvider>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
