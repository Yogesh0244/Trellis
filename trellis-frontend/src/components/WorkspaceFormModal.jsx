import { useState } from 'react';
import Modal from './Modal.jsx';
import Alert from './Alert.jsx';

export default function WorkspaceFormModal({ initialValues, onClose, onSubmit }) {
  const [name, setName] = useState(initialValues?.name || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Workspace name is required');
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
    <Modal title={isEditing ? 'Edit workspace' : 'New workspace'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Alert type="error">{error}</Alert>

        <div className="form-field">
          <label htmlFor="workspace-name">Name</label>
          <input
            id="workspace-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Engineering"
            autoFocus
          />
        </div>

        <div className="form-field">
          <label htmlFor="workspace-description">Description</label>
          <textarea
            id="workspace-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is this workspace for?"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create workspace'}
          </button>
        </div>
      </form>
    </Modal>
  );
}