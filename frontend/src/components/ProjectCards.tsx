import React from 'react';

export default function ProjectCards({ projects }: {projects: any[]}) {
  return (
    <div>
      <h2>Key Projects</h2>
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {projects.map(p => (
          <div key={p.id} style={{border: '1px solid #ccc', margin: 8, padding: 8, width: 260}}>
            <strong>{p.name}</strong>
            <p>{p.description}</p>
            <p><b>Stack:</b> {p.stack}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
