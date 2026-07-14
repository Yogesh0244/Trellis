import { motion } from 'motion/react';
import { useSpotlight } from '../hooks/useSpotlight.js';

export default function ProjectCard({ project, index, onOpen, onEdit, onDelete }) {
  const { ref, onMouseMove } = useSpotlight();

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      className="entity-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04, ease: 'easeOut' }}
    >
      <div onClick={onOpen} className="entity-card__clickable">
        <h3 className="entity-card__title">{project.name}</h3>
        <p className="entity-card__description">{project.description || 'No description'}</p>
      </div>
      <div className="entity-card__actions">
        <button className="btn btn--ghost btn--sm" onClick={onEdit}>Edit</button>
        <button className="btn btn--ghost btn--sm btn--danger-text" onClick={onDelete}>Delete</button>
      </div>
    </motion.div>
  );
}