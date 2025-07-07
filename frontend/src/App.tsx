import React, { useEffect, useState } from 'react';
import { api } from './api';
import Timeline from './components/Timeline';
import ProjectCards from './components/ProjectCards';
import Metrics from './components/Metrics';

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get('/graphql', { params: { query: `{ portfolio { timeline projects metrics } }`} })
      .then(res => setData(res.data.data.portfolio))
      .catch(err => setData(null));
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div style={{maxWidth: 800, margin: '0 auto', padding: 32}}>
      <h1>Michael Kaminski – Portfolio</h1>
      <Metrics metrics={data.metrics || []}/>
      <Timeline events={data.timeline || []}/>
      <ProjectCards projects={data.projects || []}/>
    </div>
  );
}

export default App;
