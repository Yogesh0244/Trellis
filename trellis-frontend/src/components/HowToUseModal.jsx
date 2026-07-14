import { LayoutGrid, ClipboardList, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import Modal from './Modal.jsx';

const STEPS = [
  { icon: LayoutGrid, title: 'Create a workspace', description: "Workspaces group everything you're working on — one per team or client is typical." },
  { icon: ClipboardList, title: 'Add a project', description: 'Inside a workspace, spin up a project for each initiative you want to track.' },
  { icon: CheckCircle2, title: 'Create & assign tasks', description: 'Break the project into tasks, set a priority and due date, and assign an owner.' },
  { icon: TrendingUp, title: 'Track progress', description: 'Move tasks through TODO → IN PROGRESS → REVIEW → DONE, sorted and paginated your way.' },
];

export default function HowToUseModal({ onClose }) {
  return (
    <Modal title="How Trellis works" onClose={onClose} size="md">
      <p className="how-to__intro">Four steps from a blank account to a tracked project.</p>
      <div className="how-to__steps">
        {STEPS.map((step, index) => (
          <motion.div
            className="how-to__step"
            key={step.title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08, duration: 0.3, ease: 'easeOut' }}
          >
            <div className="how-to__step-marker">
              <span className="how-to__step-number">{index + 1}</span>
              <step.icon size={18} strokeWidth={2} />
            </div>
            <div className="how-to__step-body">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
            {index < STEPS.length - 1 && <span className="how-to__step-line" aria-hidden="true" />}
          </motion.div>
        ))}
      </div>
      <div className="form-actions">
        <button className="btn btn--primary" onClick={onClose}>Got it</button>
      </div>
    </Modal>
  );
}