import { useState } from 'react';
import Modal from './Modal.jsx';
import Alert from './Alert.jsx';

export default function ProjectFormModal({ initialValues, onClose, onSubmit }) {
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <Modal title={isEditing ? 'Edit project' : 'New project'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Alert type="error">{error}</Alert>

        <div className="form-field">
          <label htmlFor="project-name">Name</label>
          <input
            id="project-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. API Revamp"
            autoFocus
          />
        </div>

        <div className="form-field">
          <label htmlFor="project-description">Description</label>
          <textarea
            id="project-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What does this project cover?"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}