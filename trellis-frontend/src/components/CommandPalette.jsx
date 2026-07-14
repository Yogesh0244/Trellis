import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, LayoutGrid, Sun, Moon, UserCircle, HelpCircle, LogOut, Plus, CornerDownLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { workspaceApi } from '../api/workspaceApi.js';

export default function CommandPalette({ open, onOpenChange, onOpenModal }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [workspaces, setWorkspaces] = useState([]);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isCmdK) {
        e.preventDefault();
        onOpenChange((prev) => !prev);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      workspaceApi.list().then(setWorkspaces).catch(() => setWorkspaces([]));
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const runAndClose = useCallback((fn) => { fn(); close(); }, [close]);

  const actions = useMemo(
    () => [
      { id: 'dashboard', label: 'Go to dashboard', icon: LayoutGrid, run: () => navigate('/') },
      { id: 'new-workspace', label: 'Create new workspace', icon: Plus, run: () => navigate('/?new=workspace') },
      { id: 'profile', label: 'View profile', icon: UserCircle, run: () => onOpenModal('profile') },
      { id: 'help', label: 'How to use Trellis', icon: HelpCircle, run: () => onOpenModal('help') },
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        icon: theme === 'dark' ? Sun : Moon,
        run: toggleTheme,
      },
      { id: 'logout', label: 'Log out', icon: LogOut, run: () => { logout(); navigate('/login'); } },
    ],
    [navigate, onOpenModal, theme, toggleTheme, logout]
  );

  const workspaceResults = workspaces
    .filter((w) => w.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 5)
    .map((w) => ({
      id: `workspace-${w.id}`,
      label: w.name,
      hint: 'Workspace',
      icon: LayoutGrid,
      run: () => navigate(`/workspaces/${w.id}`),
    }));

  const actionResults = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));
  const results = [...workspaceResults, ...actionResults];

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      runAndClose(results[activeIndex].run);
    } else if (e.key === 'Escape') {
      close();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="command-overlay"
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="command-palette"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="command-palette__search">
              <Search size={17} />
              <input
                autoFocus
                type="text"
                placeholder="Search workspaces or run a command…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <kbd>Esc</kbd>
            </div>

            <div className="command-palette__list">
              {results.length === 0 ? (
                <p className="command-palette__empty">No matches for "{query}"</p>
              ) : (
                results.map((item, index) => (
                  <button
                    key={item.id}
                    className={`command-palette__item ${index === activeIndex ? 'is-active' : ''}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => runAndClose(item.run)}
                  >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                    {item.hint && <span className="command-palette__hint">{item.hint}</span>}
                    {index === activeIndex && <CornerDownLeft size={13} className="command-palette__enter" />}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}