import React, { createContext, useContext, useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { initGA } from './utils/analytics';
import Seo from './components/Seo';
import SmoothScroll from './components/SmoothScroll';
import Cursor from './components/Cursor';
import Header from './components/Header';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Transactions from './components/Transactions';
import Highlights from './components/Highlights';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AIChatbot from './components/AIChatbot';
import ReferralCarousel from './components/ReferralCarousel';

// Secondary routes are code-split so they don't ship in the main bundle.
const CPO = lazy(() => import('./pages/CPO'));
const Strategy = lazy(() => import('./pages/Strategy'));
const Technology = lazy(() => import('./pages/Technology'));
const KnowledgeGraph = lazy(() => import('./pages/KnowledgeGraph'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const JiraPRD = lazy(() => import('./pages/JiraPRD'));
const Writing = lazy(() => import('./pages/Writing'));
const Article = lazy(() => import('./pages/Article'));
const Clips = lazy(() => import('./pages/Clips'));
const Websites = lazy(() => import('./pages/Websites'));
const Products = lazy(() => import('./pages/Products'));
const Changelog = lazy(() => import('./pages/Changelog'));
const Projects = lazy(() => import('./pages/Projects'));
const CaseStudy = lazy(() => import('./pages/CaseStudy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const About = lazy(() => import('./pages/About'));

const HOME_TITLE = 'Michael Kaminski — AI Agents & Agent Infrastructure | Atlanta & NYC';
const HOME_DESCRIPTION =
  'Michael Kaminski builds AI agents that run in production. Took an agent capability from prototype through security, legal, and compliance review inside a regulated lender. Custom MCP servers, multi-agent orchestration, and eval harnesses in Python and TypeScript. Atlanta, relocating to New York City.';

const RouteFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>
);

type Theme = {
  primary: string;
  secondary: string;
  bg: string;
};

export type Role = 'default' | 'cpo' | 'strategy' | 'technology';

type ThemeContextType = {
  theme: Theme;
  setTheme: (role: Role) => void;
  currentRole: Role;
};

// The whole site is on one dark editorial theme now, so every role shares the
// same dark palette. (Previously each role had a light background, which leaked
// onto the home page whenever a role was selected/persisted — turning sections
// pastel on back/reload. Keeping all presets dark makes that impossible.)
const DARK_THEME: Theme = {
  primary: '#fff500', // Rilla electric yellow
  secondary: '#a3a3a3',
  bg: '#060606',
};

const themePresets: Record<Role, Theme> = {
  default: DARK_THEME,
  cpo: DARK_THEME,
  strategy: DARK_THEME,
  technology: DARK_THEME,
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
      <SmoothScroll>
      <Cursor />
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
                      {/* Recruiter-first order: lead with proof, close with fit/contact */}
                      <Hero />
                      <Transactions />
                      <Highlights />
                      <Experience />
                      <Skills />
                      <ReferralCarousel />
                      <Contact />
                    </main>
                    <Footer />
                  </>
                } />
                <Route path="/cpo" element={<CPO />} />
                <Route path="/strategy" element={<Strategy />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/knowledge-graph" element={<KnowledgeGraph />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/jira-prd" element={<JiraPRD />} />
                <Route path="/writing" element={<Writing />} />
                <Route path="/writing/:slug" element={<Article />} />
                <Route path="/clips" element={<Clips />} />
                <Route path="/websites" element={<Websites />} />
                <Route path="/products" element={<Products />} />
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<CaseStudy />} />
                {/* Catch-all. Without it a typo'd URL returned 200 with the
                    home page's HTML and then rendered nothing at all. */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              </Suspense>
              <AIChatbot />
              <Analytics />
            </div>
          )}
        </ThemeContext.Consumer>
      </Router>
      </SmoothScroll>
      </MotionConfig>
    </ThemeProvider>
  );
}

export default App; 