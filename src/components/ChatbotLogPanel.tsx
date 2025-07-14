import React, { useState, useEffect, useRef } from 'react';

interface LogEntry {
  timestamp: string;
  question: string;
  response: string;
}

interface Visitor {
  id: string;
  firstVisit: string;
  lastVisit: string;
  interactions: number;
}

const ChatbotLogPanel: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [interactions, setInteractions] = useState(0);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedLog = localStorage.getItem('ai-chat-log');
    const savedVisitors = localStorage.getItem('ai-chat-visitors');
    const savedInteractions = localStorage.getItem('ai-chat-interactions');
    
    if (savedLog) {
      setLog(JSON.parse(savedLog));
    }
    if (savedVisitors) {
      setVisitors(JSON.parse(savedVisitors));
    }
    if (savedInteractions) {
      setInteractions(parseInt(savedInteractions));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ai-chat-log', JSON.stringify(log));
  }, [log]);

  useEffect(() => {
    localStorage.setItem('ai-chat-visitors', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('ai-chat-interactions', interactions.toString());
  }, [interactions]);

  // Track new visitors
  useEffect(() => {
    const visitorId = localStorage.getItem('visitor-id');
    if (!visitorId) {
      const newVisitorId = `visitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitor-id', newVisitorId);
      
      const newVisitor: Visitor = {
        id: newVisitorId,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        interactions: 0
      };
      
      setVisitors(prev => [...prev, newVisitor]);
    } else {
      // Update existing visitor's last visit
      setVisitors(prev => prev.map(v => 
        v.id === visitorId 
          ? { ...v, lastVisit: new Date().toISOString() }
          : v
      ));
    }
  }, []);

  // Listen for AI chat interactions
  useEffect(() => {
    const handleInteraction = (event: CustomEvent) => {
      const { question, response } = event.detail;
      const newEntry: LogEntry = {
        timestamp: new Date().toLocaleString(),
        question,
        response
      };
      
      setLog(prev => [...prev, newEntry]);
      setInteractions(prev => prev + 1);
      
      // Update visitor interaction count
      const visitorId = localStorage.getItem('visitor-id');
      if (visitorId) {
        setVisitors(prev => prev.map(v => 
          v.id === visitorId 
            ? { ...v, interactions: v.interactions + 1, lastVisit: new Date().toISOString() }
            : v
        ));
      }
    };

    window.addEventListener('ai-chat-interaction', handleInteraction as EventListener);
    return () => window.removeEventListener('ai-chat-interaction', handleInteraction as EventListener);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  const avgInteractions = visitors.length > 0 ? (interactions / visitors.length).toFixed(1) : '0';

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <button
        className="bg-primary-700 text-white px-4 py-2 rounded-t-lg shadow-lg hover:bg-primary-800 focus:outline-none"
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? 'Hide' : 'Show'} AI Log & Analytics
      </button>
      {expanded && (
        <div className="w-96 max-w-full bg-white rounded-b-lg shadow-2xl border border-primary-200 overflow-hidden flex flex-col" style={{ maxHeight: 400 }}>
          <div className="p-4 border-b border-primary-100 bg-primary-50">
            <div className="flex flex-wrap gap-4 justify-between text-sm font-medium text-primary-800">
              <span>Total Visitors: {visitors.length}</span>
              <span>Total Interactions: {interactions}</span>
              <span>Avg/Visitor: {avgInteractions}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {log.length === 0 && <div className="text-gray-400 text-center">No interactions yet.</div>}
            {log.map((entry, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow p-3 border border-gray-100">
                <div className="text-xs text-gray-400 mb-1">{entry.timestamp}</div>
                <div className="mb-1"><span className="font-semibold text-primary-700">Q:</span> {entry.question}</div>
                <div><span className="font-semibold text-primary-700">A:</span> {entry.response}</div>
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotLogPanel; 