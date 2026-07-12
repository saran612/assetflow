import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // --- Body scroll lock ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // --- Mount / Unmount lifecycle ---
  // When isOpen becomes true: mount the DOM immediately, then activate transitions after a frame.
  // When isOpen becomes false: deactivate transitions, wait for exit animation to finish, then unmount.
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      setShouldRender(true);

      // Double-rAF to ensure the element is painted at its initial (inactive) state
      // before the active state triggers the CSS transition.
      const frameId = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsActive(true);
        });
      });
      return () => cancelAnimationFrame(frameId);
    } else {
      setIsActive(false);
      const exitTimer = setTimeout(() => {
        setShouldRender(false);
        // Return focus to the element that originally triggered the modal
        if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
          previousFocusRef.current.focus();
        }
      }, 250); // matches the longest exit transition duration
      return () => clearTimeout(exitTimer);
    }
  }, [isOpen]);

  // --- Focus first focusable element when modal becomes active ---
  useEffect(() => {
    if (isActive && modalRef.current) {
      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusable = modalRef.current.querySelectorAll(focusableSelector);
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    }
  }, [isActive]);

  // --- Focus trap + Escape key handler ---
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }

    if (e.key === 'Tab' && modalRef.current) {
      const focusableSelector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const focusable = Array.from(modalRef.current.querySelectorAll(focusableSelector));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }, [onClose]);

  if (!shouldRender) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      style={{
        opacity: isActive ? 1 : 0,
        transition: 'opacity 0.2s ease-out'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{
          opacity: isActive ? 1 : 0,
          transform: isActive ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          transition: 'opacity 0.25s ease-out, transform 0.25s ease-out'
        }}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
