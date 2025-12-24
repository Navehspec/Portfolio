import React, { useState, useEffect, useCallback } from 'react';

const Modal = ({ project, onClose }) => {
  const [activeMedia, setActiveMedia] = useState([]);
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    const resolvePath = (path) => `${base}${path}`.replace('//', '/');

    const images = Array.isArray(project.photos) ? project.photos.filter(Boolean) : [];
    const videos = Array.isArray(project.videos) ? project.videos.filter(Boolean) : [];
    let media = [
      ...images.map((src) => ({ type: 'image', src: resolvePath(`images/projects/${project.slug}/${src}`) })),
      ...videos.map((src) => ({ type: 'video', src: resolvePath(`images/projects/${project.slug}/${src}`) }))
    ];
    if (!media.length && project.image) {
      media = [{ type: 'image', src: resolvePath(`images/projects/${project.slug}/${project.image}`) }];
    }
    setActiveMedia(media);
    setMediaIndex(0);
  }, [project]);

  const handleNav = useCallback((direction) => {
    setMediaIndex((prevIndex) => (prevIndex + direction + activeMedia.length) % activeMedia.length);
  }, [activeMedia.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
      if (event.key === 'ArrowLeft') {
        handleNav(-1);
      }
      if (event.key === 'ArrowRight') {
        handleNav(1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handleNav]);

  const setMedia = (index) => {
    setMediaIndex(index);
  };
  
  const currentMedia = activeMedia[mediaIndex];

  return (
    <div className="modal-overlay is-open" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" type="button" aria-label="Close" onClick={onClose}>&times;</button>
        <div className="modal-media">
          <button className="modal-nav prev" type="button" aria-label="Previous photo" onClick={() => handleNav(-1)}>&lsaquo;</button>
          <div className="modal-display">
            {currentMedia?.type === 'video' ? (
              <video className="modal-image" src={currentMedia.src} controls autoPlay loop playsInline />
            ) : (
              <img src={currentMedia?.src} alt={`${project.title} media ${mediaIndex + 1}`} className="modal-image" loading="lazy" />
            )}
          </div>
          <button className="modal-nav next" type="button" aria-label="Next photo" onClick={() => handleNav(1)}>&rsaquo;</button>
        </div>
        <div className="thumb-row" aria-label="Project photo gallery">
          {activeMedia.map((item, idx) => (
            <button key={idx} type="button" className={`thumb ${idx === mediaIndex ? 'is-active' : ''}`} onClick={() => setMedia(idx)}>
              {item.type === 'video' ? (
                <div className="thumb-video">Video {idx + 1}</div>
              ) : (
                <img src={item.src} alt={`${project.title} thumbnail ${idx + 1}`} loading="lazy" />
              )}
            </button>
          ))}
        </div>
        <div className="modal-body">
          <h3 id="modal-title">{project.title}</h3>
          <p>{project.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
