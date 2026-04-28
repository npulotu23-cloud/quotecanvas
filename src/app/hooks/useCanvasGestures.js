import { useCallback, useRef } from 'react';

export function useCanvasGestures({ canvasRef, overrides, setOverrides, commitOverrides, onWordTap, onAuthorTap }) {
  const pointersRef = useRef(new Map());
  const gestureStartRef = useRef(null);
  const movedRef = useRef(false);
  const tapStartTimeRef = useRef(0);

  // Hit-test helper: returns 'author' | 'word:N' | null based on canvas-normalized coords
  const hitTestAt = (canvas, nx, ny) => {
    if (!canvas) return null;
    // Author has higher priority (smaller, sits at edges)
    const ahb = canvas._qcAuthorHitBox;
    if (ahb) {
      const padX = Math.max(0.02, ahb.h * 0.6);
      const padY = ahb.h * 0.6;
      if (nx >= ahb.x - padX && nx <= ahb.x + ahb.w + padX &&
          ny >= ahb.y - padY && ny <= ahb.y + ahb.h + padY) {
        return { type: 'author' };
      }
    }
    const boxes = canvas._qcHitBoxes || [];
    const wordHit = boxes.find(b => {
      const pad = b.h * 0.2;
      return nx >= b.x - pad && nx <= b.x + b.w + pad &&
             ny >= b.y - pad && ny <= b.y + b.h + pad;
    });
    if (wordHit) return { type: 'word', index: wordHit.wordIndex };
    return null;
  };

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    try { canvas.setPointerCapture(e.pointerId); } catch {
      // Pointer capture is best-effort across browsers.
    }
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    movedRef.current = false;
    tapStartTimeRef.current = Date.now();

    const rect = canvas.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    const hit = hitTestAt(canvas, nx, ny);

    if (pointersRef.current.size === 1) {
      // If we're starting on the author, this drag will move the author specifically
      if (hit?.type === 'author') {
        gestureStartRef.current = {
          type: 'drag-author',
          startX: e.clientX,
          startY: e.clientY,
          startOffsetX: overrides.authorOffsetX || 0,
          startOffsetY: overrides.authorOffsetY || 0
        };
      } else {
        // Default: drag the quote block
        gestureStartRef.current = {
          type: 'drag',
          startX: e.clientX,
          startY: e.clientY,
          startOffsetX: overrides.offsetX || 0,
          startOffsetY: overrides.offsetY || 0
        };
      }
    } else if (pointersRef.current.size === 2) {
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      gestureStartRef.current = {
        type: 'pinch',
        startDistance: dist,
        startAngle: angle,
        startSizeMul: overrides.fontSizeMultiplier || 1,
        startRotation: overrides.rotationOverride || 0
      };
    }
  }, [canvasRef, overrides]);

  const handlePointerMove = useCallback((e) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const gesture = gestureStartRef.current;
    if (!gesture) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (gesture.type === 'drag' && pointersRef.current.size === 1) {
      const deltaX = e.clientX - gesture.startX;
      const deltaY = e.clientY - gesture.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) movedRef.current = true;
      const normDX = deltaX / rect.width;
      const normDY = deltaY / rect.height;
      const newOffsetX = Math.max(-0.45, Math.min(0.45, gesture.startOffsetX + normDX));
      const newOffsetY = Math.max(-0.45, Math.min(0.45, gesture.startOffsetY + normDY));
      setOverrides(prev => ({ ...prev, offsetX: newOffsetX, offsetY: newOffsetY }));
    } else if (gesture.type === 'drag-author' && pointersRef.current.size === 1) {
      const deltaX = e.clientX - gesture.startX;
      const deltaY = e.clientY - gesture.startY;
      if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) movedRef.current = true;
      const normDX = deltaX / rect.width;
      const normDY = deltaY / rect.height;
      const newAOX = Math.max(-0.5, Math.min(0.5, gesture.startOffsetX + normDX));
      const newAOY = Math.max(-0.6, Math.min(0.6, gesture.startOffsetY + normDY));
      setOverrides(prev => ({ ...prev, authorOffsetX: newAOX, authorOffsetY: newAOY }));
    } else if (gesture.type === 'pinch' && pointersRef.current.size >= 2) {
      movedRef.current = true;
      const pts = [...pointersRef.current.values()];
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const angle = Math.atan2(pts[1].y - pts[0].y, pts[1].x - pts[0].x);
      const scale = dist / gesture.startDistance;
      const newSize = Math.max(0.4, Math.min(2.5, gesture.startSizeMul * scale));
      // Rotation delta in degrees
      const rotationDelta = (angle - gesture.startAngle) * 180 / Math.PI;
      const newRotation = gesture.startRotation + rotationDelta;
      // Clamp to -180..180 for sanity
      const clampedRotation = ((newRotation + 540) % 360) - 180;
      setOverrides(prev => ({ ...prev, fontSizeMultiplier: newSize, rotationOverride: clampedRotation }));
    }
  }, [canvasRef, setOverrides]);

  const handlePointerUp = useCallback((e) => {
    const canvas = canvasRef.current;
    try { canvas?.releasePointerCapture(e.pointerId); } catch {
      // Pointer capture is best-effort across browsers.
    }
    const existed = pointersRef.current.has(e.pointerId);
    pointersRef.current.delete(e.pointerId);

    const wasShortTap = Date.now() - tapStartTimeRef.current < 300 && !movedRef.current;
    const wasGestureActive = gestureStartRef.current !== null;

    if (pointersRef.current.size === 0) {
      // End of gesture
      if (wasShortTap && existed && canvas) {
        // Hit-test
        const rect = canvas.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        const hit = hitTestAt(canvas, nx, ny);
        if (hit?.type === 'author' && onAuthorTap) {
          onAuthorTap();
        } else if (hit?.type === 'word' && onWordTap) {
          onWordTap(hit.index);
        }
      } else if (wasGestureActive && movedRef.current && commitOverrides) {
        commitOverrides();
      }
      gestureStartRef.current = null;
      movedRef.current = false;
    } else if (pointersRef.current.size === 1 && gestureStartRef.current?.type === 'pinch') {
      const remaining = [...pointersRef.current.values()][0];
      gestureStartRef.current = {
        type: 'drag',
        startX: remaining.x,
        startY: remaining.y,
        startOffsetX: overrides.offsetX || 0,
        startOffsetY: overrides.offsetY || 0
      };
    }
  }, [canvasRef, onWordTap, onAuthorTap, commitOverrides, overrides]);

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}
