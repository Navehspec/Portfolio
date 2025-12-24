import React from 'react';

const ProjectCard = ({ project, onClick }) => {
  const base = import.meta.env.BASE_URL;
  // Remove trailing slash from base if present to avoid double slashes, 
  // though Vite usually handles this. keeping it simple:
  // BASE_URL usually ends with / if set to /Portfolio/
  
  // Clean logic:
  // If base is '/', path is /images/...
  // If base is '/Portfolio/', path is /Portfolio/images/...
  
  const resolvePath = (path) => `${base}${path}`.replace('//', '/');

  const cover = project.slug && Array.isArray(project.photos) && project.photos.length 
    ? resolvePath(`images/projects/${project.slug}/${project.photos[0]}`)
    : (project.slug && project.image ? resolvePath(`images/projects/${project.slug}/${project.image}`) : project.image);

  return (
    <article className="project-card" onClick={() => onClick(project)}>
      <div className="card-img-wrap">
        <img className="card-image" src={cover} alt={project.title} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-meta">
          <h3 className="card-title">{project.title}</h3>
        </div>
        <p className="card-desc">{project.short}</p>
      </div>
    </article>
  );
};

export default ProjectCard;