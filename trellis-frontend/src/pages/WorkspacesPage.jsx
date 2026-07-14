import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { workspaceApi } from '../api/workspaceApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import Alert from '../components/Alert.jsx';
import WorkspaceFormModal from '../components/WorkspaceFormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import WorkspaceCard from '../components/WorkspaceCard.jsx';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function WorkspacesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [deletingWorkspace, setDeletingWorkspace] = useState(null);

  const loadWorkspaces = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await workspaceApi.list();
      setWorkspaces(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkspaces();
  }, []);

  // Lets the command palette's "Create new workspace" action open this form via a URL param.
  useEffect(() => {
    if (searchParams.get('new') === 'workspace') {
      setShowForm(true);
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleCreateOrUpdate = async (payload) => {
    if (editingWorkspace) {
      const updated = await workspaceApi.update(editingWorkspace.id, payload);
      setWorkspaces((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
    } else {
      const created = await workspaceApi.create(payload);
      setWorkspaces((prev) => [created, ...prev]);
    }
    setShowForm(false);
    setEditingWorkspace(null);
  };

  const handleDelete = async () => {
    try {
      await workspaceApi.remove(deletingWorkspace.id);
      setWorkspaces((prev) => prev.filter((w) => w.id !== deletingWorkspace.id));
      setDeletingWorkspace(null);
    } catch (err) {
      setError(err.message);
      setDeletingWorkspace(null);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">
            {getGreeting()}, {firstName} <span className="wave">👋</span>
          </h1>
          <p className="page__subtitle">
            {workspaces.length > 0
              ? `You have ${workspaces.length} workspace${workspaces.length === 1 ? '' : 's'}.`
              : 'Everything you own, in one place.'}
          </p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowForm(true)}>
          + New workspace
        </button>
      </div>

      <Alert type="error" onDismiss={() => setError('')}>{error}</Alert>

      {loading ? (
        <div className="card-grid">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="empty-state">
          <h3>No workspaces yet</h3>
          <p>Create your first workspace to start organizing projects and tasks.</p>
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>+ New workspace</button>
        </div>
      ) : (
        <div className="card-grid">
          {workspaces.map((workspace, index) => (
            <WorkspaceCard
              key={workspace.id}
              workspace={workspace}
              index={index}
              onOpen={() => navigate(`/workspaces/${workspace.id}`)}
              onEdit={() => { setEditingWorkspace(workspace); setShowForm(true); }}
              onDelete={() => setDeletingWorkspace(workspace)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <WorkspaceFormModal
            key="workspace-form"
            initialValues={editingWorkspace}
            onClose={() => { setShowForm(false); setEditingWorkspace(null); }}
            onSubmit={handleCreateOrUpdate}
          />
        )}
        {deletingWorkspace && (
          <ConfirmDialog
            key="confirm-delete"
            title="Delete workspace"
            message={`Delete "${deletingWorkspace.name}"? This will also delete every project and task inside it.`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingWorkspace(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}