import React from 'react';

export default function Timeline({ events }: {events: any[]}) {
  return (
    <div>
      <h2>Career Timeline</h2>
      <ul>
        {events.map(e => (
          <li key={e.id}>
            <strong>{e.title}</strong> – {e.company} ({e.start} - {e.end})<br/>
            <em>{e.summary}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
