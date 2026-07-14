import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { projectApi } from '../api/projectApi.js';
import { taskApi } from '../api/taskApi.js';
import Alert from '../components/Alert.jsx';
import TaskFormModal from '../components/TaskFormModal.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import TaskRow from '../components/TaskRow.jsx';
import Pagination from '../components/Pagination.jsx';
import SkeletonRow from '../components/SkeletonRow.jsx';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date created' },
  { value: 'dueDate', label: 'Due date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

export default function TasksPage() {
  const { workspaceId, projectId } = useParams();

  const [project, setProject] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('DESC');

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await taskApi.listByProject(projectId, { page, size, sortBy, sortDirection });
      setPageData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    projectApi.getById(projectId).then(setProject).catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, page, size, sortBy, sortDirection]);

  const handleCreateOrUpdate = async (payload) => {
    if (editingTask) {
      const updated = await taskApi.update(editingTask.id, payload);
      setPageData((prev) => ({
        ...prev,
        content: prev.content.map((t) => (t.id === updated.id ? updated : t)),
      }));
    } else {
      await taskApi.create(projectId, payload);
      setPage(0);
      await loadTasks();
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDelete = async () => {
    try {
      await taskApi.remove(deletingTask.id);
      setDeletingTask(null);
      await loadTasks();
    } catch (err) {
      setError(err.message);
      setDeletingTask(null);
    }
  };

  const handleStatusChanged = (updatedTask) => {
    setPageData((prev) => ({
      ...prev,
      content: prev.content.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
    }));
  };

  const toggleSortDirection = () => {
    setPage(0);
    setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
  };

  return (
    <div className="page">
      <Link to={`/workspaces/${workspaceId}`} className="back-link">
        ← All projects
      </Link>

      <div className="page__header">
        <div>
          <h1 className="page__title">{project?.name || 'Tasks'}</h1>
          <p className="page__subtitle">{project?.description || 'Tasks in this project'}</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowForm(true)}>
          + New task
        </button>
      </div>

      <Alert type="error" onDismiss={() => setError('')}>
        {error}
      </Alert>

      <div className="toolbar">
        <div className="toolbar__group">
          <label htmlFor="sort-by">Sort by</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => {
              setPage(0);
              setSortBy(e.target.value);
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button className="btn btn--ghost btn--sm" onClick={toggleSortDirection}>
            {sortDirection === 'ASC' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>

        <div className="toolbar__group">
          <label htmlFor="page-size">Per page</label>
          <select
            id="page-size"
            value={size}
            onChange={(e) => {
              setPage(0);
              setSize(Number(e.target.value));
            }}
          >
            {[5, 10, 20].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="task-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : pageData && pageData.content.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks yet</h3>
          <p>Add your first task to start tracking work in this project.</p>
          <button className="btn btn--primary" onClick={() => setShowForm(true)}>
            + New task
          </button>
        </div>
      ) : (
        <>
          <div className="task-list">
            <AnimatePresence initial={false}>
              {pageData?.content.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  <TaskRow
                    task={task}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setShowForm(true);
                    }}
                    onDelete={setDeletingTask}
                    onStatusChanged={handleStatusChanged}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Pagination pageData={pageData} onPageChange={setPage} />
        </>
      )}

      <AnimatePresence>
        {showForm && (
          <TaskFormModal
            key="task-form"
            initialValues={editingTask}
            onClose={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            onSubmit={handleCreateOrUpdate}
          />
        )}
        {deletingTask && (
          <ConfirmDialog
            key="confirm-delete"
            title="Delete task"
            message={`Delete "${deletingTask.title}"?`}
            onConfirm={handleDelete}
            onCancel={() => setDeletingTask(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}