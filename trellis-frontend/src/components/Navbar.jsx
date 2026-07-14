import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { HelpCircle, Sun, Moon, LogOut, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import HowToUseModal from './HowToUseModal.jsx';
import ProfileModal from './ProfileModal.jsx';
import { getInitials, getAvatarColorClass } from '../utils/avatar.js';

export default function Navbar({ activeModal, onOpenModal, onCloseModal, onOpenPalette }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="navbar">
        <Link to="/" className="navbar__brand">
          <span className="navbar__brand-mark">T</span>
          <span className="gradient-text">Trellis</span>
        </Link>

        <button className="command-hint" onClick={onOpenPalette}>
          <Search size={14} />
          <span>Search or jump to…</span>
          <kbd>⌘K</kbd>
        </button>

        <div className="navbar__actions">
          <button
            className="icon-btn"
            onClick={() => onOpenModal('help')}
            aria-label="How to use Trellis"
            title="How to use Trellis"
          >
            <HelpCircle size={19} />
          </button>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button
            className={`avatar avatar--sm avatar--clickable ${getAvatarColorClass(user?.id)}`}
            onClick={() => onOpenModal('profile')}
            aria-label="View your profile"
            title="View your profile"
          >
            {getInitials(user?.name)}
          </button>

          <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
            <LogOut size={15} /> Log out
          </button>
        </div>
      </header>

      <AnimatePresence>
        {activeModal === 'help' && <HowToUseModal key="how-to-use" onClose={onCloseModal} />}
        {activeModal === 'profile' && <ProfileModal key="profile" onClose={onCloseModal} />}
      </AnimatePresence>
    </>
  );
}