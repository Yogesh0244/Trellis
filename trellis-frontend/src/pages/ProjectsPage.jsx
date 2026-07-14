import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { workspaceApi } from '../api/workspaceApi.js';
import { projectApi } from '../api/projectApi.js';
import Alert from '../components/Alert.jsx';
import ProjectFormModal from '../components/ProjectFormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import ProjectCard from '../components/ProjectCard.jsx';

export default function ProjectsPage() {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [workspaceData, projectsData] = await Promise.all([
        workspaceApi.getById(workspaceId),
        projectApi.listByWorkspace(workspaceId),
      ]);
      setWorkspace(workspaceData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId]);

  const handleCreateOrUpdate = async (payload) => {
    if (editingProject) {
      const updated = await projectApi.update(editingProject.id, payload);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    } else {
      const created = await projectApi.create(workspaceId, payload);
      setProjects((prev) => [created, ...prev]);
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const handleDelete = async () => {
    try {
      await projectApi.remove(deletingProject.id);
      setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
      setDeletingProject(null);
    } catch (err) {
      setError(err.message);
      setDeletingProject(null);
    }
  };

  if (error && !workspace && !loading) {
    return (
      <div className="page-center">
        <div className="empty-state">
          <h3>Couldn't load this workspace</h3>
          <p>{error}</p>
          <Link className="btn btn--primary" to="/">Back to workspaces</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link to="/" className="back-link">← All workspaces</Link>

      <div className="page__header">
        <div>
          <h1 className="page__title">{loading ? 'Loading…' : workspace?.name}</h1>
          <p className="page__subtitle">{loading ? ' ' : workspace?.description || 'Projects in this workspace'}</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowForm(true)} disabled={loading}>
          + New project
        </button>
      </div>

      <Alert type="error" onDismiss={() => setError('')}>{error}</Alert>

      {loading ? (
        <div className="card-grid">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects yet</h3>
          <p>Create a project to start tracking tasks inside this workspace.</p>
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>+ New project</button>
        </div>
      ) : (
        <div className="card-grid">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpen={() => navigate(`/workspaces/${workspaceId}/projects/${project.id}`)}
              onEdit={() => { setEditingProject(project); setShowForm(true); }}
              onDelete={() => setDeletingProject(project)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <ProjectFormModal
            key="project-form"
            initialValues={editingProject}
            onClose={() => { setShowForm(false); setEditingProject(null); }}
            onSubmit={handleCreateOrUpdate}
          />
        )}
        {deletingProject && (
          <ConfirmDialog
            key="confirm-delete"
            title="Delete project"
            message={`Delete "${deletingProject.name}"? This will also delete every task inside it.`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}