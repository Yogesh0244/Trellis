import { motion } from 'motion/react';

const COLORS = ['#6D5DF6', '#00C2FF', '#34D6C0', '#F0A93D', '#FF7A6E'];
const PIECES = Array.from({ length: 14 });

export default function ConfettiBurst() {
  return (
    <div className="confetti-burst" aria-hidden="true">
      {PIECES.map((_, i) => {
        const angle = (i / PIECES.length) * 2 * Math.PI;
        const distance = 40 + Math.random() * 30;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <motion.span
            key={i}
            className="confetti-piece"
            style={{ background: COLORS[i % COLORS.length] }}
            initial={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
            animate={{ opacity: 0, x, y: y - 20, scale: 0.4, rotate: Math.random() * 180 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}