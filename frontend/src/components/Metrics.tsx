import React from 'react';

export default function Metrics({ metrics }: {metrics: any[]}) {
  return (
    <div>
      <h2>Impact Metrics</h2>
      <ul>
        {metrics.map(m => (
          <li key={m.label}><strong>{m.value}</strong> {m.label}</li>
        ))}
      </ul>
    </div>
  );
}
