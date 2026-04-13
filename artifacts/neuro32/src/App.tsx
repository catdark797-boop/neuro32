import { useState, useEffect, useCallback } from 'react';
import { Switch, Route, Router as WouterRouter, useLocation } from 'wouter';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import { useIsMobile } from './hooks/use-mobile';
import Nav from './components/Nav';
import AIWidget from './components/AIWidget';
import EnrollModal from './components/EnrollModal';
import { analytics } from './lib/analytics';
import Footer from './components/Footer';
import Home from './pages/Home';
import Kids from './pages/Kids';
import Teens from './pages/Teens';
import Adults from './pages/Adults';
import Cyber from './pages/Cyber';
import Packages from './pages/Packages';
import About from './pages/About';
import Safety from './pages/Safety';
import Reviews from './pages/Reviews';
import Contact from './pages/Contact';
import AISecretary from './pages/AISecretary';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import LK from './pages/LK';
import Admin from './pages/Admin';
import Privacy from './pages/Privacy';
import Offer from './pages/Offer';

function ScrollToTop() {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); });
  return null;
}

function BackToTopBtn() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const onScroll = () => setVis(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button className={`scroll-top${vis ? ' vis' : ''}`} aria-label="Наверх"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h > 0) setPct(window.scrollY / h * 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div id="progress" style={{ width: `${pct}%` }} />;
}

function RevealObserver() {
  useEffect(() => {
    let obs: IntersectionObserver;
    const observe = () => {
      if (obs) obs.disconnect();
      obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis'); }),
        { threshold: 0.07 }
      );
      document.querySelectorAll('.rv:not(.vis), .rv-s:not(.vis)').forEach(el => obs.observe(el));
    };
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { obs?.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

function PageTransition({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  const dur = prefersReduced ? 0 : 0.28;
  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: prefersReduced ? 0 : -8 }}
      transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes({ openEnroll, toggleAI }: { openEnroll: (p?: string) => void; toggleAI: () => void }) {
  const [location] = useLocation();
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location}>
        <Switch>
          <Route path="/" component={() => <Home onAIToggle={toggleAI} onEnroll={openEnroll} />} />
          <Route path="/kids" component={() => <Kids onEnroll={openEnroll} />} />
          <Route path="/teens" component={() => <Teens onEnroll={openEnroll} />} />
          <Route path="/adults" component={() => <Adults onEnroll={openEnroll} />} />
          <Route path="/cyber" component={() => <Cyber onEnroll={openEnroll} />} />
          <Route path="/packages" component={() => <Packages onEnroll={openEnroll} />} />
          <Route path="/about" component={() => <About onEnroll={openEnroll} />} />
          <Route path="/safety" component={Safety} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/contact" component={Contact} />
          <Route path="/aisecretary" component={AISecretary} />
          <Route path="/auth" component={Auth} />
          <Route path="/auth/callback" component={AuthCallback} />
          <Route path="/lk" component={LK} />
          <Route path="/admin" component={Admin} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/offer" component={Offer} />
          <Route component={() => (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{ fontFamily: 'var(--fu)', fontSize: '5rem', color: 'var(--amber)', opacity: .2, fontWeight: 700 }}>404</div>
              <div style={{ fontFamily: 'var(--fb)', fontSize: '1.8rem', color: '#fff' }}>Страница не найдена</div>
              <a href={base + '/'} className="btn btn-amber btn-lg">На главную →</a>
            </div>
          )} />
        </Switch>
      </PageTransition>
    </AnimatePresence>
  );
}

function AppContent() {
  const [loaded, setLoaded] = useState(false);
  const [aiOpen, setAIOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollProgram, setEnrollProgram] = useState('');
  const isMobile = useIsMobile();
  const handleLoaded = useCallback(() => setLoaded(true), []);
  const toggleAI = useCallback(() => {
    setAIOpen(v => {
      if (!v) analytics.aiWidgetOpen();
      return !v;
    });
  }, []);
  const openEnroll = useCallback((program = '') => {
    analytics.enrollClick();
    setEnrollProgram(program);
    setEnrollOpen(true);
  }, []);

  return (
    <>
      {!isMobile && <Cursor />}
      <ScrollProgress />
      {!loaded && <Loader onDone={handleLoaded} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity .4s ease', visibility: loaded ? 'visible' : 'hidden' }}>
        <RevealObserver />
        <Nav onEnroll={openEnroll} />
        <main style={{ paddingTop: 'var(--nav-h)' }}>
          <AnimatedRoutes openEnroll={openEnroll} toggleAI={toggleAI} />
        </main>
        <AIWidget open={aiOpen} onClose={toggleAI} />
        <EnrollModal open={enrollOpen} onClose={() => setEnrollOpen(false)} program={enrollProgram} />
        <Footer onEnroll={openEnroll} />
        <BackToTopBtn />
      </div>
    </>
  );
}

export default function App() {
  return (
    <WouterRouter base={base}>
      <ScrollToTop />
      <AppContent />
    </WouterRouter>
  );
}
