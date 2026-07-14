import { useRef, useCallback } from 'react';

// Mutates CSS custom properties directly via ref instead of React state,
// so a mousemove doesn't trigger a re-render of the whole card tree.
export function useSpotlight() {
  const ref = useRef(null);

  const onMouseMove = useCallback((e) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty('--spot-x', `${x}%`);
    node.style.setProperty('--spot-y', `${y}%`);
  }, []);

  return { ref, onMouseMove };
}