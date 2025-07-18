import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Transactions from './components/Transactions';
import Highlights from './components/Highlights';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import CFO from './pages/CFO';
import CPO from './pages/CPO';
import Strategy from './pages/Strategy';
import Technology from './pages/Technology';
import Revenue from './pages/Revenue';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Referrals from './components/Referrals';
import About from './components/About';
import ReferralCarousel from './components/ReferralCarousel';
import FeaturedIn from './components/FeaturedIn';
import InteractiveQuiz from './components/InteractiveQuiz';
import LiveMetrics from './components/LiveMetrics';
import DownloadableResources from './components/DownloadableResources';
import SocialSharing from './components/SocialSharing';
import FinancialPerformance from './components/FinancialPerformance';
import Projects from './components/Projects';

type Theme = {
  primary: string;
  secondary: string;
  bg: string;
};

export type Role = 'default' | 'cfo' | 'cpo' | 'strategy' | 'technology' | 'revenue';

type ThemeContextType = {
  theme: Theme;
  setTheme: (role: Role) => void;
  currentRole: Role;
};

const themePresets: Record<Role, Theme> = {
  default: {
    primary: '#0ea5e9', // bright blue
    secondary: '#64748b',
    bg: '#fff',
  },
  cfo: {
    primary: '#1d4ed8', // deep blue - high contrast
    secondary: '#f59e0b', // amber - high visibility
    bg: '#f0f9ff',
  },
  cpo: {
    primary: '#7c3aed', // vibrant purple - high contrast
    secondary: '#ec4899', // pink - high visibility
    bg: '#faf5ff',
  },
  strategy: {
    primary: '#059669', // emerald green - high contrast
    secondary: '#fbbf24', // yellow - high visibility
    bg: '#f0fdf4',
  },
  technology: {
    primary: '#4f46e5', // indigo - high contrast
    secondary: '#06b6d4', // cyan - high visibility
    bg: '#f5f3ff',
  },
  revenue: {
    primary: '#dc2626', // red - high contrast
    secondary: '#f59e0b', // amber - high visibility
    bg: '#fef2f2',
  },
};

const ThemeContext = createContext<ThemeContextType>({
  theme: themePresets.default,
  setTheme: () => {},
  currentRole: 'default',
});

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>('default');
  const setTheme = (role: Role) => {
    setCurrentRole(role in themePresets ? role : 'default');
  };

  // Inject CSS variables for theming
  useEffect(() => {
    const theme = themePresets[currentRole];
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--secondary', theme.secondary);
    root.style.setProperty('--bg', theme.bg);
  }, [currentRole]);

  return (
    <ThemeContext.Provider value={{ theme: themePresets[currentRole], setTheme, currentRole }}>
      {children}
    </ThemeContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ThemeContext.Consumer>
          {({ theme }) => (
            <div className="min-h-screen" style={{ background: theme.bg }}>
              <Routes>
                <Route path="/" element={
                  <>
                    <Header />
                    <main>
                      <Hero />
                      <Projects />
                      <About />
                      <LiveMetrics />
                      <FinancialPerformance />
                      <InteractiveQuiz />
                      <Experience />
                      <Skills />
                      <Transactions />
                      <Highlights />
                      <ReferralCarousel />
                      <Referrals />
                      <Contact />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/cfo" element={<CFO />} />
                <Route path="/cpo" element={<CPO />} />
                <Route path="/strategy" element={<Strategy />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/revenue" element={<Revenue />} />
                <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
              </Routes>
              <AIChatbot />
            </div>
          )}
        </ThemeContext.Consumer>
      </Router>
    </ThemeProvider>
  );
}

export default App; 