import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import CommandPalette from './components/CommandPalette.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import WorkspacesPage from './pages/WorkspacesPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const { user } = useAuth();
  const location = useLocation();
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'help' | null
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="app-shell">
      {user && (
        <>
          <Navbar
            activeModal={activeModal}
            onOpenModal={setActiveModal}
            onCloseModal={() => setActiveModal(null)}
            onOpenPalette={() => setPaletteOpen(true)}
          />
          <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onOpenModal={setActiveModal} />
        </>
      )}
      <main className="app-main">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <PageTransition><WorkspacesPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workspaces/:workspaceId"
              element={
                <ProtectedRoute>
                  <PageTransition><ProjectsPage /></PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/workspaces/:workspaceId/projects/:projectId"
              element={
                <ProtectedRoute>
                  <PageTransition><TasksPage /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}