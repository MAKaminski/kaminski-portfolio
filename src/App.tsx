import React, { createContext, useContext, useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { initGA } from './utils/analytics';
import Seo from './components/Seo';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Transactions from './components/Transactions';
import Highlights from './components/Highlights';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import Referrals from './components/Referrals';
import About from './components/About';
import ReferralCarousel from './components/ReferralCarousel';
import InteractiveQuiz from './components/InteractiveQuiz';
import LiveMetrics from './components/LiveMetrics';
import FinancialPerformance from './components/FinancialPerformance';
import Projects from './components/Projects';
import FavoritePieces from './components/FavoritePieces';

// Secondary routes are code-split so they don't ship in the main bundle.
const CFO = lazy(() => import('./pages/CFO'));
const CPO = lazy(() => import('./pages/CPO'));
const Strategy = lazy(() => import('./pages/Strategy'));
const Technology = lazy(() => import('./pages/Technology'));
const Revenue = lazy(() => import('./pages/Revenue'));
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'));
const ClientOutcomes = lazy(() => import('./pages/ClientOutcomes'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const JiraPRD = lazy(() => import('./pages/JiraPRD'));

const HOME_TITLE = 'Michael Kaminski | Fintech Finance & Engineering Leader in Atlanta';
const HOME_DESCRIPTION =
  'Michael Kaminski is an Atlanta-based fintech leader fluent in both PE-grade finance and hands-on software engineering — 20+ years across GreenSky, Home Depot, HD Supply, KPMG and fintech startups. Fractional CFO/CTO, product & payments leadership.';

const RouteFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>
);

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
  // Initialize Google Analytics only when a real Measurement ID is configured
  // (set REACT_APP_GA_MEASUREMENT_ID in the environment). Avoids firing the
  // old placeholder 'G-XXXXXXXXXX' in production.
  useEffect(() => {
    const gaId = process.env.REACT_APP_GA_MEASUREMENT_ID;
    if (gaId) {
      initGA(gaId);
    }
  }, []);

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
      <Router>
        <ThemeContext.Consumer>
          {({ theme }) => (
            <div className="min-h-screen" style={{ background: theme.bg }}>
              <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={
                  <>
                    <Seo title={HOME_TITLE} description={HOME_DESCRIPTION} canonicalPath="/" />
                    <Header />
                    <main>
                      <Hero />
                      <Projects />
                      <About />
                      <FavoritePieces />
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
                <Route path="/client-outcomes" element={<ClientOutcomes />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/jira-prd" element={<JiraPRD />} />
              </Routes>
              </Suspense>
              <AIChatbot />
              <Analytics />
            </div>
          )}
        </ThemeContext.Consumer>
      </Router>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App; 