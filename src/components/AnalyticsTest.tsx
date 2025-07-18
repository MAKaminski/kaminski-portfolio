import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

const AnalyticsTest: React.FC = () => {
  useEffect(() => {
    // Log to console to verify component is mounting
    console.log('Analytics component mounted');
    
    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      console.log('Running in production mode');
    } else {
      console.log('Running in development mode');
    }
  }, []);

  return (
    <div style={{ display: 'none' }}>
      <Analytics debug={true} />
    </div>
  );
};

export default AnalyticsTest; 