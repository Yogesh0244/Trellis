import { useState } from 'react';
import Modal from './Modal.jsx';
import Alert from './Alert.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH'];

export default function TaskFormModal({ initialValues, onClose, onSubmit }) {
  const { user } = useAuth();
  const isEditing = Boolean(initialValues);

  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [status, setStatus] = useState(initialValues?.status || 'TODO');
  const [priority, setPriority] = useState(initialValues?.priority || 'MEDIUM');
  const [dueDate, setDueDate] = useState(initialValues?.dueDate || '');
  const [assignedUserId, setAssignedUserId] = useState(initialValues?.assignedUserId || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate || null,
        assignedUserId: assignedUserId ? Number(assignedUserId) : null,
      });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <Modal title={isEditing ? 'Edit task' : 'New task'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Alert type="error">{error}</Alert>

        <div className="form-field">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Design the database schema"
            autoFocus
          />
        </div>

        <div className="form-field">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more detail…"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="task-status">Status</label>
            <select id="task-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="task-priority">Priority</label>
            <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="task-due-date">Due date</label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate || ''}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="task-assignee">Assigned user ID</label>
            <div className="assignee-input">
              <input
                id="task-assignee"
                type="number"
                min="1"
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
                placeholder="Unassigned"
              />
              {user && (
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setAssignedUserId(user.id)}>
                  Assign to me
                </button>
              )}
            </div>
            <p className="form-hint">There's no user directory yet — enter a registered user's numeric ID.</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create task'}
          </button>
        </div>
      </form>
    </Modal>
  );
}