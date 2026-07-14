import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pencil, Check, X as XIcon } from 'lucide-react';
import Modal from './Modal.jsx';
import Alert from './Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getInitials, getAvatarColorClass } from '../utils/avatar.js';

function formatJoinedDate(dateStr) {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

export default function ProfileModal({ onClose }) {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const handleEdit = () => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setError('');
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateProfile({ name: name.trim(), bio: bio.trim() });
      setIsEditing(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Modal title="Your profile" onClose={onClose} size="md">
      <div className="profile">
        <div className="profile__header">
          <div className={`avatar avatar--lg ${getAvatarColorClass(user.id)}`}>{getInitials(user.name)}</div>
          <div>
            <h3 className="profile__name">{user.name}</h3>
            <span className="badge badge--role">{(user.role || 'MEMBER').toLowerCase()}</span>
          </div>
        </div>

        <Alert type="error">{error}</Alert>
        <AnimatePresence>
          {justSaved && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Alert type="success">Profile updated</Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="profile__meta-grid">
          <div className="profile__meta-item">
            <span className="profile__meta-label">Email</span>
            <span className="profile__meta-value">{user.email}</span>
          </div>
          <div className="profile__meta-item">
            <span className="profile__meta-label">Joined</span>
            <span className="profile__meta-value">{formatJoinedDate(user.createdAt)}</span>
          </div>
        </div>

        <div className="profile__section">
          <div className="profile__section-header">
            <span className="profile__section-label">About me</span>
            {!isEditing && (
              <button className="btn btn--ghost btn--sm" onClick={handleEdit}>
                <Pencil size={14} /> Edit profile
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
              >
                <div className="form-field">
                  <label htmlFor="profile-name">Name</label>
                  <input id="profile-name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-field">
                  <label htmlFor="profile-bio">About me</label>
                  <textarea
                    id="profile-bio"
                    rows={3}
                    maxLength={280}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell your team what you're working on…"
                  />
                  <p className="form-hint">{bio.length}/280</p>
                </div>
                <div className="form-actions">
                  <button className="btn btn--ghost" onClick={handleCancel} disabled={saving}>
                    <XIcon size={15} /> Cancel
                  </button>
                  <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
                    <Check size={15} /> {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="view"
                className="profile__bio"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
              >
                {user.bio || 'No bio yet — click "Edit profile" to add one.'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}