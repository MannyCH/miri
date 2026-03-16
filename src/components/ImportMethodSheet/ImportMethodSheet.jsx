import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import './ImportMethodSheet.css';

/**
 * ImportMethodSheet — Bottom sheet for selecting a recipe import method.
 * Slides up from the bottom with three options: URL, Photo, File.
 *
 * Props:
 *   isOpen         – controls visibility
 *   onClose()      – called when backdrop is tapped or Escape pressed
 *   onSelectUrl()  – user chose "Paste URL"
 *   onSelectPhoto()– user chose "Take a Photo"
 *   onSelectFile() – user chose "Import File"
 */
export function ImportMethodSheet({ isOpen, onClose, onSelectUrl, onSelectPhoto, onSelectFile }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="import-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Import recipe"
            className="import-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="import-sheet-handle" aria-hidden="true" />
            <h2 className="text-h3-bold import-sheet-title">Import Recipe</h2>
            <ul className="import-sheet-options" role="list">
              <li>
                <button type="button" className="import-sheet-option" onClick={onSelectUrl}>
                  <span className="import-sheet-option-icon" aria-hidden="true"><LinkIcon /></span>
                  <span className="import-sheet-option-label text-body-regular">Paste URL</span>
                  <ChevronIcon />
                </button>
              </li>
              <li>
                <button type="button" className="import-sheet-option" onClick={onSelectPhoto}>
                  <span className="import-sheet-option-icon" aria-hidden="true"><CameraIcon /></span>
                  <span className="import-sheet-option-label text-body-regular">Take a Photo</span>
                  <ChevronIcon />
                </button>
              </li>
              <li>
                <button type="button" className="import-sheet-option" onClick={onSelectFile}>
                  <span className="import-sheet-option-icon" aria-hidden="true"><FileIcon /></span>
                  <span className="import-sheet-option-label text-body-regular">Import File</span>
                  <ChevronIcon />
                </button>
              </li>
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

ImportMethodSheet.displayName = 'ImportMethodSheet';
