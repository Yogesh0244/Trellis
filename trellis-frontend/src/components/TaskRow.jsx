import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { taskApi } from '../api/taskApi.js';
import { useSpotlight } from '../hooks/useSpotlight.js';
import ConfettiBurst from './ConfettiBurst.jsx';

const STATUS_OPTIONS = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TaskRow({ task, onEdit, onDelete, onStatusChanged }) {
  const { ref, onMouseMove } = useSpotlight();
  const [celebrate, setCelebrate] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      const updated = await taskApi.updateStatus(task.id, newStatus);
      onStatusChanged(updated);
      if (newStatus === 'DONE' && task.status !== 'DONE') {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 800);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`task-row task-row--${task.priority.toLowerCase()}`}>
      <div className="task-row__main">
        <p className="task-row__title">{task.title}</p>
        {task.description && <p className="task-row__description">{task.description}</p>}
        <div className="task-row__meta">
          <span className={`badge badge--priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
          <span className="task-row__due">Due {formatDate(task.dueDate)}</span>
          <span className="task-row__assignee">
            {task.assignedUserName ? `Assigned to ${task.assignedUserName}` : 'Unassigned'}
          </span>
        </div>
      </div>

      <div className="task-row__actions">
        <div className="status-select-wrap">
          <select
            className={`status-select status-select--${task.status.toLowerCase()}`}
            value={task.status}
            onChange={handleStatusChange}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          {celebrate && <ConfettiBurst />}
        </div>
        <button className="icon-btn icon-btn--sm" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit task">
          <Pencil size={15} />
        </button>
        <button className="icon-btn icon-btn--sm icon-btn--danger" onClick={() => onDelete(task)} aria-label="Delete task" title="Delete task">
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}