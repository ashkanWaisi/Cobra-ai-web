import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from './hooks/useTranslation';
import { models as initialModels, tutorials, docSections, screenshotPlaceholders, type Model } from './demoData';
import {
  CobraLogo, IconImage, IconVideo, IconChat, IconHub, IconDownload, IconQueue,
  IconHistory, IconGpu, IconPrivacy, IconRuntime, IconError, IconImg2Vid,
  IconMenu, IconClose, IconChevronDown, IconChevronLeft, IconChevronRight,
  IconArrowUp, IconSearch, IconCheck, IconWindows, IconCopy, IconSend,
  IconPause, IconTrash, IconOffline, IconCpu, IconBook,
  IconSettings, IconMonitor, IconGlobe, IconFolder, IconUpload
} from './components/Icons';

// ===== CONFIGURATION =====
// Replace with real installer URL when available
const COBRA_DOWNLOAD_URL = "";
const COBRA_VERSION = "1.0.0";

const screenshotImages = [
  './screenshots/main.png',
  './screenshots/generate.png',
  './screenshots/models-hub.png',
  './screenshots/chat.png',
  './screenshots/history.png',
  './screenshots/settings.png',
];

// ===== MAIN APP =====
export default function App() {
  const { lang, setLang, t, isRTL } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState<string | null>(null);
  const [showLightbox, setShowLightbox] = useState<number | null>(null);

  // Demo states
  const [demoTab, setDemoTab] = useState<'image' | 'video' | 'chat' | 'hub'>('image');
  const [demoGenerating, setDemoGenerating] = useState(false);
  const [demoComplete, setDemoComplete] = useState(false);
  const [workflowTab, setWorkflowTab] = useState<'t2i' | 'i2v' | 'chat'>('t2i');
  const [modelFilter, setModelFilter] = useState('all');
  const [modelSearch, setModelSearch] = useState('');
  const [modelStates, setModelStates] = useState<Model[]>(initialModels);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [docActive, setDocActive] = useState(0);
  const [docSearch, setDocSearch] = useState('');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [dlCheckbox, setDlCheckbox] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Hardware checker
  const [hwRam, setHwRam] = useState('32');
  const [hwVram, setHwVram] = useState('8');
  const [hwStorage, setHwStorage] = useState('ssd');
  const [hwProcessing, setHwProcessing] = useState('gpu');

  // Chat demo messages
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Hello! I\'m running locally on your machine. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const mainRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Navigation items
  const navItems = useMemo(() => [
    { id: 'home', label: t('nav.home') },
    { id: 'features', label: t('nav.features') },
    { id: 'workflows', label: t('nav.workflows') },
    { id: 'model-hub', label: t('nav.modelHub') },
    { id: 'tutorials', label: t('nav.tutorials') },
    { id: 'docs', label: t('nav.docs') },
    { id: 'requirements', label: t('nav.requirements') },
    { id: 'faq', label: t('nav.faq') },
  ], [t]);

  // Scroll handling
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > 600);

      // Active section detection
      const sections = navItems.map(n => document.getElementById(n.id));
      let current = 'home';
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 120) current = section.id;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [navItems]);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [lang, demoTab, docActive, modelFilter]);

  // Escape key handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showDownloadModal) setShowDownloadModal(false);
        if (showTutorialModal) { setShowTutorialModal(null); setTutorialStep(0); }
        if (showLightbox !== null) setShowLightbox(null);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showDownloadModal, showTutorialModal, showLightbox, mobileMenuOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [mobileMenuOpen]);

  // Body scroll lock for modals
  useEffect(() => {
    if (showDownloadModal || showTutorialModal || showLightbox !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showDownloadModal, showTutorialModal, showLightbox]);

  // Lightbox keyboard navigation
  useEffect(() => {
    if (showLightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setShowLightbox(p => p !== null ? (p + 1) % screenshotPlaceholders.length : null);
      if (e.key === 'ArrowLeft') setShowLightbox(p => p !== null ? (p - 1 + screenshotPlaceholders.length) % screenshotPlaceholders.length : null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showLightbox]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  }, []);

  // Demo generate simulation
  const handleDemoGenerate = useCallback(() => {
    if (demoGenerating) return;
    setDemoGenerating(true);
    setDemoComplete(false);
    setTimeout(() => {
      setDemoGenerating(false);
      setDemoComplete(true);
      setTimeout(() => setDemoComplete(false), 3000);
    }, 2500);
  }, [demoGenerating]);

  // Chat send
  const handleChatSend = useCallback(() => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        text: 'This is a demonstration of the local chat interface. In the actual COBRA application, responses are generated by locally installed language models running on your computer.'
      }]);
    }, 1000);
  }, [chatInput]);

  // Model actions
  const handleModelAction = useCallback((id: string, action: 'install' | 'remove' | 'pause' | 'resume') => {
    setModelStates(prev => prev.map(m => {
      if (m.id !== id) return m;
      if (action === 'install') {
        // Start download simulation
        return { ...m, status: 'downloading' as const, progress: 0 };
      }
      if (action === 'pause') return { ...m, status: 'downloading' as const };
      if (action === 'resume') return { ...m, status: 'downloading' as const };
      if (action === 'remove') return { ...m, status: 'available' as const, progress: undefined };
      return m;
    }));

    if (action === 'install') {
      // Simulate download progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setModelStates(prev => prev.map(m =>
            m.id === id ? { ...m, status: 'installed' as const, progress: undefined } : m
          ));
        } else {
          setModelStates(prev => prev.map(m =>
            m.id === id && m.status === 'downloading' ? { ...m, progress: Math.min(progress, 99) } : m
          ));
        }
      }, 500);
    }
  }, []);

  // Copy to clipboard
  const handleCopy = useCallback((text: string, id: string) => {
    navigator.clipboard?.writeText(text).then(() => {
      setCopyFeedback(id);
      setTimeout(() => setCopyFeedback(null), 2000);
    });
  }, []);

  // Hardware checker result
  const hwResult = useMemo(() => {
    const ram = parseInt(hwRam);
    const vram = parseInt(hwVram);
    let score = 0;
    if (ram >= 64) score += 3; else if (ram >= 32) score += 2; else if (ram >= 16) score += 1;
    if (hwProcessing === 'gpu') {
      if (vram >= 16) score += 3; else if (vram >= 8) score += 2; else if (vram >= 6) score += 1;
    }
    if (hwStorage === 'nvme') score += 2; else if (hwStorage === 'ssd') score += 1;
    if (hwProcessing === 'gpu') score += 1;

    if (score >= 8) return 'excellent';
    if (score >= 5) return 'good';
    if (score >= 3) return 'moderate';
    return 'limited';
  }, [hwRam, hwVram, hwStorage, hwProcessing]);

  // Filtered models
  const filteredModels = useMemo(() => {
    return modelStates.filter(m => {
      if (modelFilter === 'image' && m.type !== 'image') return false;
      if (modelFilter === 'video' && m.type !== 'video') return false;
      if (modelFilter === 'chat' && m.type !== 'chat') return false;
      if (modelFilter === 'installed' && m.status !== 'installed') return false;
      if (modelFilter === 'available' && m.status === 'installed') return false;
      if (modelSearch && !m.name.toLowerCase().includes(modelSearch.toLowerCase())) return false;
      return true;
    });
  }, [modelStates, modelFilter, modelSearch]);

  // Filtered docs
  const filteredDocs = useMemo(() => {
    if (!docSearch) return docSections;
    const q = docSearch.toLowerCase();
    return docSections.filter(d =>
      d.title_en.toLowerCase().includes(q) ||
      d.title_fa.toLowerCase().includes(q) ||
      d.content_en.toLowerCase().includes(q)
    );
  }, [docSearch]);

  // Active tutorial data
  const activeTutorial = useMemo(() => {
    if (!showTutorialModal) return null;
    return tutorials.find(t => t.id === showTutorialModal) || null;
  }, [showTutorialModal]);

  // Feature icons map
  const featureItems = [
    { key: 'imgGen', icon: <IconImage /> },
    { key: 'vidGen', icon: <IconVideo /> },
    { key: 'img2vid', icon: <IconImg2Vid /> },
    { key: 'chat', icon: <IconChat /> },
    { key: 'hub', icon: <IconHub /> },
    { key: 'download', icon: <IconDownload /> },
    { key: 'queue', icon: <IconQueue /> },
    { key: 'history', icon: <IconHistory /> },
    { key: 'gpu', icon: <IconGpu /> },
    { key: 'privacy', icon: <IconPrivacy /> },
    { key: 'runtime', icon: <IconRuntime /> },
    { key: 'error', icon: <IconError /> },
  ];

  const comparisonRows = [
    'processing', 'internet', 'upload', 'models', 'cost', 'speed', 'privacy', 'paths'
  ];

  const offlineItems = [
    { key: 'privacy', icon: <IconPrivacy className="text-cobra-primary" /> },
    { key: 'noUpload', icon: <IconUpload className="text-cobra-primary" /> },
    { key: 'control', icon: <IconSettings className="text-cobra-primary" /> },
    { key: 'ownership', icon: <IconFolder className="text-cobra-primary" /> },
    { key: 'nofees', icon: <IconCheck className="text-cobra-primary" /> },
    { key: 'works', icon: <IconOffline className="text-cobra-primary" /> },
    { key: 'processing', icon: <IconGpu className="text-cobra-primary" /> },
  ];

  return (
    <>
      {/* Skip to content */}
      <a href="#main-content" className="skip-link" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); scrollToSection('home'); }}>
        {t('skipToContent')}
      </a>

      {/* Background */}
      <div className="bg-cobra" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-vignette" aria-hidden="true" />

      {/* ===== NAVIGATION ===== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'glass-strong shadow-lg shadow-black/30'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-2.5 group"
              aria-label="COBRA AI Studio — Home"
            >
              <CobraLogo size={36} />
              <span className="text-base font-bold tracking-tight text-cobra-text hidden sm:block">
                COBRA <span className="text-cobra-text2 font-normal text-sm">AI Studio</span>
              </span>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'text-cobra-primary bg-cobra-primary/10'
                      : 'text-cobra-text2 hover:text-cobra-text hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <button
                onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-cobra-text2 hover:text-cobra-text rounded-lg hover:bg-white/5 transition-colors"
                aria-label={lang === 'en' ? 'Switch to Persian' : 'Switch to English'}
              >
                <IconGlobe size={16} />
                <span>{lang === 'en' ? 'فارسی' : 'English'}</span>
              </button>

              {/* Download button */}
              <button
                onClick={() => setShowDownloadModal(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cobra-primary to-cobra-accent text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                <IconDownload size={16} />
                {t('nav.download')}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-cobra-text2 hover:text-cobra-text rounded-lg hover:bg-white/5"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="lg:hidden glass-strong border-t border-white/5 animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-start px-4 py-2.5 text-sm rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'text-cobra-primary bg-cobra-primary/10'
                      : 'text-cobra-text2 hover:text-cobra-text hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setShowDownloadModal(true); setMobileMenuOpen(false); }}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cobra-primary to-cobra-accent text-white text-sm font-medium rounded-lg"
              >
                <IconDownload size={16} />
                {t('nav.download')}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main id="main-content" ref={mainRef} tabIndex={-1} className="relative z-10">

        {/* ===== HERO ===== */}
        <section id="home" className="min-h-screen flex items-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Hero text */}
              <div className="text-center lg:text-start space-y-6 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full text-sm text-cobra-primary">
                  <CobraLogo size={20} />
                  <span className="font-medium">{t('hero.tagline')}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-cobra-text">
                  {t('hero.headline')}
                </h1>
                <p className="text-base sm:text-lg text-cobra-text2 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {t('hero.description')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <button
                    onClick={() => setShowDownloadModal(true)}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-cobra-primary to-cobra-accent text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cobra-primary/25 animate-pulse-glow"
                  >
                    <IconWindows size={20} />
                    {t('hero.downloadBtn')}
                  </button>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 glass text-cobra-text font-medium rounded-xl hover:bg-white/10 transition-colors"
                  >
                    {t('hero.exploreBtn')}
                    {isRTL ? <IconChevronLeft size={18} /> : <IconChevronRight size={18} />}
                  </button>
                </div>
                {/* Trust badges */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                  {['offline', 'local', 'windows', 'gpu'].map(badge => (
                    <span key={badge} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/8 rounded-full text-xs text-cobra-text2">
                      {badge === 'offline' && <IconOffline size={13} />}
                      {badge === 'local' && <IconCpu size={13} />}
                      {badge === 'windows' && <IconWindows size={13} />}
                      {badge === 'gpu' && <IconGpu size={13} />}
                      {t(`hero.badge.${badge}`)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hero product showcase */}
              <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {/* Background glow panels */}
                <div className="absolute -top-8 -right-8 w-64 h-64 bg-cobra-primary/5 rounded-3xl blur-3xl animate-float" aria-hidden="true" />
                <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-cobra-accent/5 rounded-3xl blur-2xl animate-float" style={{ animationDelay: '3s' }} aria-hidden="true" />

                {/* App frame */}
                <div className="relative glass rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
                  {/* Title bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-black/30 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <CobraLogo size={18} />
                      <span className="text-xs font-medium text-cobra-text2">COBRA AI Studio</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                      <div className="w-3 h-3 rounded-full bg-white/10" />
                    </div>
                  </div>

                  {/* App body */}
                  <div className="flex min-h-[320px] sm:min-h-[380px]">
                    {/* Sidebar */}
                    <div className="hidden sm:flex flex-col w-12 bg-black/20 border-r border-white/5 py-3 items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-cobra-primary/20 flex items-center justify-center"><IconImage size={14} className="text-cobra-primary" /></div>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"><IconVideo size={14} className="text-cobra-text2" /></div>
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"><IconChat size={14} className="text-cobra-text2" /></div>
                      <div className="mt-auto w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"><IconSettings size={14} className="text-cobra-text2" /></div>
                    </div>

                    {/* Main content area */}
                    <div className="flex-1 p-3 sm:p-4 space-y-3">
                      {/* Tabs */}
                      <div className="flex gap-1">
                        <div className="px-3 py-1 text-[10px] font-medium bg-cobra-primary/15 text-cobra-primary rounded-md">Image</div>
                        <div className="px-3 py-1 text-[10px] text-cobra-text2 rounded-md">Video</div>
                        <div className="px-3 py-1 text-[10px] text-cobra-text2 rounded-md">Chat</div>
                      </div>
                      {/* Prompt */}
                      <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                        <div className="text-[10px] text-cobra-text2 mb-1">Prompt</div>
                        <div className="text-[11px] text-cobra-text/70 italic">A cinematic landscape at golden hour with dramatic clouds...</div>
                      </div>
                      {/* Settings row */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                          <div className="text-[9px] text-cobra-text2">Model</div>
                          <div className="text-[10px] text-cobra-text">Z-Image Turbo</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                          <div className="text-[9px] text-cobra-text2">Steps</div>
                          <div className="text-[10px] text-cobra-text">28</div>
                        </div>
                        <div className="bg-black/20 rounded-lg p-1.5 border border-white/5">
                          <div className="text-[9px] text-cobra-text2">Size</div>
                          <div className="text-[10px] text-cobra-text">1024×768</div>
                        </div>
                      </div>
                      {/* Generate button */}
                      <button className="w-full py-2 bg-gradient-to-r from-cobra-primary to-cobra-accent text-white text-[11px] font-semibold rounded-lg pointer-events-none">
                        Generate Image
                      </button>
                      {/* Output area */}
                      <div className="bg-black/20 rounded-lg border border-white/5 aspect-video flex items-center justify-center">
                        <div className="text-center space-y-1.5">
                          <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-r from-cobra-primary/20 to-cobra-accent/20 flex items-center justify-center">
                            <IconImage size={16} className="text-cobra-primary" />
                          </div>
                          <div className="text-[10px] text-cobra-text2">Output Preview</div>
                        </div>
                      </div>
                      {/* History thumbnails */}
                      <div className="flex gap-1.5 overflow-hidden">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className="w-10 h-10 flex-shrink-0 rounded bg-gradient-to-br from-cobra-surface to-cobra-surface2 border border-white/5" />
                        ))}
                      </div>
                    </div>

                    {/* Right panel */}
                    <div className="hidden md:flex flex-col w-36 bg-black/20 border-s border-white/5 p-3 space-y-3">
                      <div className="text-[10px] font-medium text-cobra-text2">Queue</div>
                      <div className="bg-black/20 rounded-lg p-2 border border-white/5 space-y-1">
                        <div className="text-[9px] text-cobra-primary">Generating...</div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cobra-primary to-cobra-accent rounded-full w-3/5" />
                        </div>
                      </div>
                      <div className="text-[10px] font-medium text-cobra-text2 mt-2">Downloads</div>
                      <div className="bg-black/20 rounded-lg p-2 border border-white/5 space-y-1">
                        <div className="text-[9px] text-cobra-text">LTX Video</div>
                        <div className="text-[9px] text-cobra-text2">45% — 3.8 GB</div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-cobra-success rounded-full w-[45%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== INTERACTIVE DEMO ===== */}
        <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('demo.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('demo.subtitle')}</p>
            </div>

            {/* Demo tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 reveal" role="tablist" aria-label="Demo modes">
              {(['image', 'video', 'chat', 'hub'] as const).map(tab => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={demoTab === tab}
                  onClick={() => { setDemoTab(tab); setDemoGenerating(false); setDemoComplete(false); }}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    demoTab === tab
                      ? 'bg-gradient-to-r from-cobra-primary to-cobra-accent text-white shadow-lg shadow-cobra-primary/20'
                      : 'glass text-cobra-text2 hover:text-cobra-text hover:bg-white/10'
                  }`}
                >
                  {tab === 'image' && <IconImage size={16} />}
                  {tab === 'video' && <IconVideo size={16} />}
                  {tab === 'chat' && <IconChat size={16} />}
                  {tab === 'hub' && <IconHub size={16} />}
                  {t(`demo.tab.${tab}`)}
                </button>
              ))}
            </div>

            {/* Demo content */}
            <div className="glass rounded-2xl overflow-hidden reveal" role="tabpanel">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Controls */}
                <div className="p-6 sm:p-8 border-b md:border-b-0 md:border-e border-white/5">
                  <h3 className="text-xl font-bold text-cobra-text mb-2">
                    {t(`demo.${demoTab}.title`)}
                  </h3>
                  <p className="text-sm text-cobra-text2 mb-6 leading-relaxed">
                    {t(`demo.${demoTab}.desc`)}
                  </p>

                  {/* Image controls */}
                  {demoTab === 'image' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.image.prompt')}</label>
                        <textarea className="w-full bg-black/30 border border-white/8 rounded-lg p-3 text-sm text-cobra-text placeholder-cobra-text2/50 resize-none h-20 focus:border-cobra-primary/50 focus:outline-none transition-colors" placeholder={t('demo.image.promptPlaceholder')} readOnly />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.image.model')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text">Z-Image Turbo</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.image.seed')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text">42</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.image.steps')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text text-center">28</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.image.width')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text text-center">1024</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.image.height')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text text-center">768</div>
                        </div>
                      </div>
                      <button
                        onClick={handleDemoGenerate}
                        disabled={demoGenerating}
                        className="w-full py-3 bg-gradient-to-r from-cobra-primary to-cobra-accent text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
                      >
                        {demoGenerating ? t('demo.image.generating') : demoComplete ? t('demo.image.complete') : t('demo.image.generate')}
                      </button>
                    </div>
                  )}

                  {/* Video controls */}
                  {demoTab === 'video' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.video.prompt')}</label>
                        <textarea className="w-full bg-black/30 border border-white/8 rounded-lg p-3 text-sm text-cobra-text placeholder-cobra-text2/50 resize-none h-20 focus:border-cobra-primary/50 focus:outline-none transition-colors" placeholder={t('demo.video.promptPlaceholder')} readOnly />
                      </div>
                      <div className="bg-black/30 border border-white/8 border-dashed rounded-lg p-4 text-center">
                        <IconImage size={24} className="text-cobra-text2 mx-auto mb-1" />
                        <div className="text-xs text-cobra-text2">{t('demo.video.refImage')}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.video.model')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text">LTX Video</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.video.duration')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text">4s</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.video.fps')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text">24</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.video.resolution')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text">512×320</div>
                        </div>
                      </div>
                      <button
                        onClick={handleDemoGenerate}
                        disabled={demoGenerating}
                        className="w-full py-3 bg-gradient-to-r from-cobra-primary to-cobra-accent text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-60"
                      >
                        {demoGenerating ? t('demo.video.generating') : demoComplete ? t('demo.video.complete') : t('demo.video.generate')}
                      </button>
                    </div>
                  )}

                  {/* Chat interface */}
                  {demoTab === 'chat' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.chat.model')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text">Local Chat 4B</div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('demo.chat.context')}</label>
                          <div className="bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-success">{t('demo.chat.contextActive')}</div>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-xl border border-white/5 h-48 overflow-y-auto p-3 space-y-3">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                              msg.role === 'user'
                                ? 'bg-cobra-primary/20 text-cobra-text'
                                : 'bg-white/5 text-cobra-text2'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                          placeholder={t('demo.chat.placeholder')}
                          className="flex-1 bg-black/30 border border-white/8 rounded-lg px-3 py-2.5 text-sm text-cobra-text placeholder-cobra-text2/50 focus:border-cobra-primary/50 focus:outline-none transition-colors"
                        />
                        <button
                          onClick={handleChatSend}
                          className="px-4 py-2.5 bg-gradient-to-r from-cobra-primary to-cobra-accent text-white rounded-lg hover:opacity-90 transition-opacity"
                          aria-label={t('demo.chat.send')}
                        >
                          <IconSend size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Model Hub controls */}
                  {demoTab === 'hub' && (
                    <div className="space-y-4">
                      <div className="relative">
                        <IconSearch size={16} className="absolute top-3 start-3 text-cobra-text2" />
                        <input
                          type="text"
                          value={modelSearch}
                          onChange={(e) => setModelSearch(e.target.value)}
                          placeholder={t('demo.hub.search')}
                          className="w-full bg-black/30 border border-white/8 rounded-lg ps-9 pe-3 py-2.5 text-sm text-cobra-text placeholder-cobra-text2/50 focus:border-cobra-primary/50 focus:outline-none transition-colors"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['all', 'image', 'video', 'chat', 'installed', 'available'].map(f => (
                          <button
                            key={f}
                            onClick={() => setModelFilter(f)}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                              modelFilter === f
                                ? 'bg-cobra-primary text-white'
                                : 'bg-white/5 text-cobra-text2 hover:bg-white/10'
                            }`}
                          >
                            {t(`demo.hub.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-2 max-h-52 overflow-y-auto">
                        {filteredModels.length === 0 && (
                          <div className="text-sm text-cobra-text2 text-center py-4">No models found</div>
                        )}
                        {filteredModels.map(model => (
                          <div key={model.id} className="flex items-center justify-between bg-black/20 border border-white/5 rounded-lg p-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                model.type === 'image' ? 'bg-blue-500/15 text-blue-400' :
                                model.type === 'video' ? 'bg-purple-500/15 text-purple-400' :
                                'bg-green-500/15 text-green-400'
                              }`}>
                                {model.type === 'image' && <IconImage size={14} />}
                                {model.type === 'video' && <IconVideo size={14} />}
                                {model.type === 'chat' && <IconChat size={14} />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-cobra-text truncate">{model.name}</div>
                                <div className="text-[11px] text-cobra-text2">{model.size} · VRAM {model.vram}</div>
                                {model.status === 'downloading' && model.progress !== undefined && (
                                  <div className="mt-1 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-cobra-primary rounded-full progress-animated transition-all duration-300" style={{ width: `${model.progress}%` }} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0 ms-3">
                              {model.status === 'installed' && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] text-cobra-success font-medium px-2 py-0.5 bg-cobra-success/10 rounded">{t('demo.hub.installed')}</span>
                                  <button onClick={() => handleModelAction(model.id, 'remove')} className="p-1 text-cobra-text2 hover:text-cobra-error transition-colors" aria-label={t('demo.hub.remove')}>
                                    <IconTrash size={14} />
                                  </button>
                                </div>
                              )}
                              {model.status === 'available' && (
                                <button onClick={() => handleModelAction(model.id, 'install')} className="px-3 py-1 bg-cobra-primary/15 text-cobra-primary text-xs font-medium rounded-lg hover:bg-cobra-primary/25 transition-colors">
                                  {t('demo.hub.install')}
                                </button>
                              )}
                              {model.status === 'downloading' && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-cobra-warning">{Math.round(model.progress || 0)}%</span>
                                  <button onClick={() => handleModelAction(model.id, 'pause')} className="p-1 text-cobra-text2 hover:text-cobra-warning" aria-label={t('demo.hub.pause')}>
                                    <IconPause size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Features & Preview */}
                <div className="p-6 sm:p-8 bg-black/10">
                  <h4 className="text-sm font-semibold text-cobra-text2 uppercase tracking-wider mb-4">
                    {demoTab === 'hub' ? t('demo.hub.title') : lang === 'en' ? 'Key Features' : 'ویژگی‌های کلیدی'}
                  </h4>
                  <ul className="space-y-3 mb-6">
                    {[1,2,3,4].map(i => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-cobra-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <IconCheck size={12} className="text-cobra-primary" />
                        </div>
                        <span className="text-sm text-cobra-text2">{t(`demo.${demoTab}.feat${i}`)}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Simulated preview area */}
                  {(demoTab === 'image' || demoTab === 'video') && (
                    <div className="bg-black/20 rounded-xl border border-white/5 aspect-video flex items-center justify-center">
                      {demoGenerating ? (
                        <div className="text-center space-y-3">
                          <div className="w-10 h-10 mx-auto border-2 border-cobra-primary border-t-transparent rounded-full animate-spin" />
                          <div className="text-sm text-cobra-text2">{demoTab === 'image' ? t('demo.image.generating') : t('demo.video.generating')}</div>
                        </div>
                      ) : demoComplete ? (
                        <div className="text-center space-y-2">
                          <div className="w-10 h-10 mx-auto rounded-full bg-cobra-success/15 flex items-center justify-center">
                            <IconCheck size={20} className="text-cobra-success" />
                          </div>
                          <div className="text-sm text-cobra-success">{demoTab === 'image' ? t('demo.image.complete') : t('demo.video.complete')}</div>
                          <div className="text-[11px] text-cobra-text2">{lang === 'en' ? 'This is a website demonstration' : 'این یک نمایش وبسایت است'}</div>
                        </div>
                      ) : (
                        <div className="text-center space-y-2">
                          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-cobra-primary/10 to-cobra-accent/10 flex items-center justify-center">
                            {demoTab === 'image' ? <IconImage size={24} className="text-cobra-primary" /> : <IconVideo size={24} className="text-cobra-primary" />}
                          </div>
                          <div className="text-sm text-cobra-text2">{lang === 'en' ? 'Output Preview' : 'پیش‌نمایش خروجی'}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FEATURES ===== */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('features.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('features.subtitle')}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {featureItems.map((feat, idx) => (
                <div
                  key={feat.key}
                  className="reveal group glass rounded-xl p-5 hover:bg-white/[0.06] transition-all duration-300 hover:border-cobra-primary/20 hover:shadow-lg hover:shadow-cobra-primary/5 focus-within:border-cobra-primary/30"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  tabIndex={0}
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cobra-primary/15 to-cobra-accent/10 flex items-center justify-center mb-3 text-cobra-primary group-hover:scale-110 transition-transform">
                    {feat.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-cobra-text mb-1.5">{t(`feat.${feat.key}.title`)}</h3>
                  <p className="text-xs text-cobra-text2 leading-relaxed">{t(`feat.${feat.key}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== WORKFLOWS ===== */}
        <section id="workflows" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('workflows.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('workflows.subtitle')}</p>
            </div>

            {/* 4-step workflow */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 reveal">
              {[1,2,3,4].map((step, idx) => (
                <div key={step} className="relative text-center">
                  {/* Connector line */}
                  {idx < 3 && (
                    <div className="hidden lg:block absolute top-8 start-[calc(50%+28px)] w-[calc(100%-56px)] h-0.5 bg-gradient-to-r from-cobra-primary/30 to-cobra-primary/10" aria-hidden="true" />
                  )}
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cobra-primary to-cobra-accent flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg shadow-cobra-primary/20">
                    {step}
                  </div>
                  <h3 className="text-base font-semibold text-cobra-text mb-2">{t(`workflow.step${step}.title`)}</h3>
                  <p className="text-sm text-cobra-text2">{t(`workflow.step${step}.desc`)}</p>
                </div>
              ))}
            </div>

            {/* Specific workflows */}
            <div className="reveal">
              <h3 className="text-lg font-semibold text-cobra-text text-center mb-6">{t('workflows.specific')}</h3>
              <div className="flex justify-center gap-2 mb-6" role="tablist">
                {(['t2i', 'i2v', 'chat'] as const).map(tab => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={workflowTab === tab}
                    onClick={() => setWorkflowTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      workflowTab === tab
                        ? 'bg-cobra-primary text-white'
                        : 'bg-white/5 text-cobra-text2 hover:bg-white/10'
                    }`}
                  >
                    {t(`workflow.${tab}`)}
                  </button>
                ))}
              </div>
              <div className="glass rounded-xl p-6" role="tabpanel">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[1,2,3,4].map(step => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-cobra-primary/15 flex items-center justify-center flex-shrink-0 text-xs font-bold text-cobra-primary">
                        {step}
                      </div>
                      <p className="text-sm text-cobra-text2 pt-1">{t(`workflow.${workflowTab}.s${step}`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== WHY OFFLINE ===== */}
        <section id="offline" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('offline.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('offline.subtitle')}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 reveal">
              {offlineItems.map((item, idx) => (
                <div key={item.key} className="glass rounded-xl p-5 hover:border-cobra-primary/15 transition-colors" style={{ transitionDelay: `${idx * 50}ms` }}>
                  <div className="w-10 h-10 rounded-xl bg-cobra-primary/10 flex items-center justify-center mb-3">
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-cobra-text mb-2">{t(`offline.${item.key}.title`)}</h3>
                  <p className="text-xs text-cobra-text2 leading-relaxed">{t(`offline.${item.key}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== MODEL HUB ===== */}
        <section id="model-hub" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('hub.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('hub.subtitle')}</p>
            </div>

            <div className="reveal">
              {/* Search and filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <IconSearch size={16} className="absolute top-3 start-3 text-cobra-text2" />
                  <input
                    type="text"
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    placeholder={t('hub.search')}
                    className="w-full bg-black/30 border border-white/8 rounded-lg ps-9 pe-3 py-2.5 text-sm text-cobra-text placeholder-cobra-text2/50 focus:border-cobra-primary/50 focus:outline-none transition-colors"
                    aria-label={t('hub.search')}
                  />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['all', 'image', 'video', 'chat', 'installed', 'available'].map(f => (
                    <button
                      key={f}
                      onClick={() => setModelFilter(f)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        modelFilter === f
                          ? 'bg-cobra-primary text-white'
                          : 'bg-white/5 text-cobra-text2 hover:bg-white/10 hover:text-cobra-text'
                      }`}
                    >
                      {t(`demo.hub.filter${f.charAt(0).toUpperCase() + f.slice(1)}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredModels.map(model => (
                  <div key={model.id} className="glass rounded-xl p-5 hover:border-cobra-primary/15 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          model.type === 'image' ? 'bg-blue-500/15 text-blue-400' :
                          model.type === 'video' ? 'bg-purple-500/15 text-purple-400' :
                          'bg-green-500/15 text-green-400'
                        }`}>
                          {model.type === 'image' && <IconImage size={18} />}
                          {model.type === 'video' && <IconVideo size={18} />}
                          {model.type === 'chat' && <IconChat size={18} />}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-cobra-text">{model.name}</h4>
                          <span className="text-[11px] text-cobra-text2 capitalize">{model.type}</span>
                        </div>
                      </div>
                      {model.status === 'installed' && (
                        <span className="text-[10px] text-cobra-success font-medium px-2 py-0.5 bg-cobra-success/10 rounded-full">{t('demo.hub.installed')}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                        <span className="text-cobra-text2">{t('hub.size')}</span>
                        <div className="text-cobra-text font-medium">{model.size}</div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                        <span className="text-cobra-text2">{t('hub.vram')}</span>
                        <div className="text-cobra-text font-medium">{model.vram}</div>
                      </div>
                    </div>

                    {model.status === 'downloading' && model.progress !== undefined && (
                      <div className="mb-3">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-cobra-warning">{t('demo.hub.downloading')}</span>
                          <span className="text-cobra-text2">{Math.round(model.progress)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cobra-primary to-cobra-accent rounded-full progress-animated transition-all duration-300" style={{ width: `${model.progress}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      {model.status === 'available' && (
                        <button
                          onClick={() => handleModelAction(model.id, 'install')}
                          className="flex-1 py-2 bg-cobra-primary/15 text-cobra-primary text-xs font-medium rounded-lg hover:bg-cobra-primary/25 transition-colors"
                        >
                          {t('demo.hub.install')}
                        </button>
                      )}
                      {model.status === 'installed' && (
                        <button
                          onClick={() => handleModelAction(model.id, 'remove')}
                          className="flex-1 py-2 bg-white/5 text-cobra-text2 text-xs font-medium rounded-lg hover:bg-cobra-error/15 hover:text-cobra-error transition-colors"
                        >
                          {t('demo.hub.remove')}
                        </button>
                      )}
                      {model.status === 'downloading' && (
                        <button
                          onClick={() => handleModelAction(model.id, 'pause')}
                          className="flex-1 py-2 bg-cobra-warning/15 text-cobra-warning text-xs font-medium rounded-lg hover:bg-cobra-warning/25 transition-colors"
                        >
                          {t('demo.hub.pause')}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== TUTORIALS ===== */}
        <section id="tutorials" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('tutorials.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('tutorials.subtitle')}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 reveal">
              {tutorials.map((tut, idx) => (
                <div key={tut.id} className="glass rounded-xl p-5 flex flex-col hover:border-cobra-primary/15 transition-all" style={{ transitionDelay: `${idx * 50}ms` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      tut.difficulty === 'beginner' ? 'bg-cobra-success/15 text-cobra-success' :
                      tut.difficulty === 'intermediate' ? 'bg-cobra-warning/15 text-cobra-warning' :
                      'bg-cobra-error/15 text-cobra-error'
                    }`}>
                      {t(`tutorials.${tut.difficulty}`)}
                    </span>
                    <span className="text-[10px] text-cobra-text2">{tut.readTime}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-cobra-text mb-1.5">
                    {lang === 'fa' ? tut.title_fa : tut.title_en}
                  </h4>
                  <p className="text-[11px] text-cobra-text2 mb-4">
                    {lang === 'fa' ? tut.category_fa : tut.category_en}
                  </p>
                  <button
                    onClick={() => { setShowTutorialModal(tut.id); setTutorialStep(0); }}
                    className="mt-auto w-full py-2 bg-white/5 text-cobra-text2 text-xs font-medium rounded-lg hover:bg-cobra-primary/15 hover:text-cobra-primary transition-colors"
                  >
                    {t('tutorials.open')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== DOCUMENTATION ===== */}
        <section id="docs" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('docs.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('docs.subtitle')}</p>
            </div>

            <div className="glass rounded-2xl overflow-hidden reveal">
              <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr]">
                {/* Sidebar */}
                <div className="border-b md:border-b-0 md:border-e border-white/5 p-4 md:p-5">
                  <div className="relative mb-4">
                    <IconSearch size={14} className="absolute top-2.5 start-2.5 text-cobra-text2" />
                    <input
                      type="text"
                      value={docSearch}
                      onChange={(e) => setDocSearch(e.target.value)}
                      placeholder={t('docs.search')}
                      className="w-full bg-black/30 border border-white/8 rounded-lg ps-8 pe-3 py-2 text-xs text-cobra-text placeholder-cobra-text2/50 focus:border-cobra-primary/50 focus:outline-none transition-colors"
                      aria-label={t('docs.search')}
                    />
                  </div>
                  <nav className="space-y-0.5 max-h-64 md:max-h-none overflow-y-auto" aria-label="Documentation sections">
                    {filteredDocs.map((doc) => {
                      const realIdx = docSections.indexOf(doc);
                      return (
                        <button
                          key={doc.id}
                          onClick={() => setDocActive(realIdx)}
                          className={`w-full text-start px-3 py-2 text-xs rounded-lg transition-colors ${
                            docActive === realIdx
                              ? 'bg-cobra-primary/15 text-cobra-primary font-medium'
                              : 'text-cobra-text2 hover:bg-white/5 hover:text-cobra-text'
                          }`}
                        >
                          {lang === 'fa' ? doc.title_fa : doc.title_en}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-8">
                  {docSections[docActive] && (
                    <>
                      <h3 className="text-xl font-bold text-cobra-text mb-2">
                        {lang === 'fa' ? docSections[docActive].title_fa : docSections[docActive].title_en}
                      </h3>

                      {/* Table of contents */}
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-cobra-text2 uppercase tracking-wider mb-2">{t('docs.toc')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {(lang === 'fa' ? docSections[docActive].headings_fa : docSections[docActive].headings_en).map((h, i) => (
                            <span key={i} className="text-[11px] text-cobra-primary bg-cobra-primary/8 px-2 py-0.5 rounded">{h}</span>
                          ))}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-sm text-cobra-text2 leading-relaxed whitespace-pre-line mb-6">
                        {lang === 'fa' ? docSections[docActive].content_fa : docSections[docActive].content_en}
                      </div>

                      {/* Code example */}
                      {docActive === 1 && (
                        <div className="relative mb-6">
                          <div className="code-block">
{`# Installation directory
C:\\Program Files\\COBRA AI Studio\\

# Model storage
C:\\Users\\<username>\\AppData\\Local\\COBRA\\models\\

# Output folder
C:\\Users\\<username>\\Documents\\COBRA\\outputs\\`}
                          </div>
                          <button
                            onClick={() => handleCopy(`C:\\Program Files\\COBRA AI Studio\\`, 'doc-code')}
                            className="absolute top-2 end-2 p-1.5 bg-white/5 text-cobra-text2 rounded hover:bg-white/10 hover:text-cobra-text transition-colors text-xs"
                            aria-label={t('docs.copy')}
                          >
                            {copyFeedback === 'doc-code' ? t('docs.copied') : <IconCopy size={14} />}
                          </button>
                        </div>
                      )}

                      {/* Prev/Next */}
                      <div className="flex justify-between pt-4 border-t border-white/5">
                        <button
                          onClick={() => setDocActive(Math.max(0, docActive - 1))}
                          disabled={docActive === 0}
                          className="flex items-center gap-1.5 text-xs text-cobra-text2 hover:text-cobra-primary disabled:opacity-30 disabled:hover:text-cobra-text2 transition-colors"
                        >
                          {isRTL ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
                          {t('docs.prev')}
                        </button>
                        <button
                          onClick={() => setDocActive(Math.min(docSections.length - 1, docActive + 1))}
                          disabled={docActive === docSections.length - 1}
                          className="flex items-center gap-1.5 text-xs text-cobra-text2 hover:text-cobra-primary disabled:opacity-30 disabled:hover:text-cobra-text2 transition-colors"
                        >
                          {t('docs.next')}
                          {isRTL ? <IconChevronLeft size={14} /> : <IconChevronRight size={14} />}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SYSTEM REQUIREMENTS ===== */}
        <section id="requirements" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('req.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('req.subtitle')}</p>
            </div>

            {/* Tiers */}
            <div className="grid md:grid-cols-3 gap-5 mb-16 reveal">
              {/* Minimum */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-cobra-text mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cobra-warning" />
                  {t('req.minimum')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div><span className="text-cobra-text2">{t('req.os')}:</span><br/><span className="text-cobra-text">Windows 10/11 64-bit</span></div>
                  <div><span className="text-cobra-text2">{t('req.cpu')}:</span><br/><span className="text-cobra-text">{lang === 'en' ? 'Modern multi-core CPU' : 'پردازنده چند هسته‌ای مدرن'}</span></div>
                  <div><span className="text-cobra-text2">{t('req.ram')}:</span><br/><span className="text-cobra-text">16 GB</span></div>
                  <div><span className="text-cobra-text2">{t('req.storage')}:</span><br/><span className="text-cobra-text">{lang === 'en' ? 'Sufficient local storage' : 'فضای ذخیره‌سازی کافی'}</span></div>
                  <div><span className="text-cobra-text2">{t('req.notes')}:</span><br/><span className="text-xs text-cobra-text2">{lang === 'en' ? 'CPU processing available but slower' : 'پردازش CPU موجود اما کندتر'}</span></div>
                </div>
              </div>

              {/* Recommended */}
              <div className="glass rounded-xl p-6 border-cobra-primary/20 shadow-lg shadow-cobra-primary/5">
                <h3 className="text-lg font-bold text-cobra-text mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cobra-primary" />
                  {t('req.recommended')}
                  <span className="text-[10px] bg-cobra-primary/15 text-cobra-primary px-2 py-0.5 rounded-full font-medium">{t('hub.recommended')}</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div><span className="text-cobra-text2">{t('req.os')}:</span><br/><span className="text-cobra-text">Windows 11</span></div>
                  <div><span className="text-cobra-text2">{t('req.gpu')}:</span><br/><span className="text-cobra-text">{lang === 'en' ? 'Modern NVIDIA GPU' : 'GPU NVIDIA مدرن'}</span></div>
                  <div><span className="text-cobra-text2">{t('req.vram')}:</span><br/><span className="text-cobra-text">8–12 GB VRAM</span></div>
                  <div><span className="text-cobra-text2">{t('req.ram')}:</span><br/><span className="text-cobra-text">32 GB</span></div>
                  <div><span className="text-cobra-text2">{t('req.storage')}:</span><br/><span className="text-cobra-text">SSD</span></div>
                </div>
              </div>

              {/* Professional */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-cobra-text mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cobra-accent" />
                  {t('req.professional')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div><span className="text-cobra-text2">{t('req.gpu')}:</span><br/><span className="text-cobra-text">{lang === 'en' ? 'High-performance NVIDIA GPU' : 'GPU NVIDIA با عملکرد بالا'}</span></div>
                  <div><span className="text-cobra-text2">{t('req.vram')}:</span><br/><span className="text-cobra-text">16+ GB VRAM</span></div>
                  <div><span className="text-cobra-text2">{t('req.ram')}:</span><br/><span className="text-cobra-text">64 GB</span></div>
                  <div><span className="text-cobra-text2">{t('req.storage')}:</span><br/><span className="text-cobra-text">{lang === 'en' ? 'High-speed NVMe SSD' : 'SSD NVMe با سرعت بالا'}</span></div>
                </div>
              </div>
            </div>

            {/* Hardware Checker */}
            <div className="glass rounded-2xl p-6 sm:p-8 reveal">
              <h3 className="text-lg font-bold text-cobra-text mb-2">{t('req.checker.title')}</h3>
              <p className="text-sm text-cobra-text2 mb-6">{t('req.checker.subtitle')}</p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('req.checker.ram')}</label>
                  <select
                    value={hwRam}
                    onChange={(e) => setHwRam(e.target.value)}
                    className="w-full bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text focus:border-cobra-primary/50 focus:outline-none"
                  >
                    <option value="8">8 GB</option>
                    <option value="16">16 GB</option>
                    <option value="32">32 GB</option>
                    <option value="64">64 GB</option>
                    <option value="128">128 GB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('req.checker.vram')}</label>
                  <select
                    value={hwVram}
                    onChange={(e) => setHwVram(e.target.value)}
                    className="w-full bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text focus:border-cobra-primary/50 focus:outline-none"
                  >
                    <option value="0">{lang === 'en' ? 'None / Integrated' : 'ندارد / مجتمع'}</option>
                    <option value="4">4 GB</option>
                    <option value="6">6 GB</option>
                    <option value="8">8 GB</option>
                    <option value="12">12 GB</option>
                    <option value="16">16 GB</option>
                    <option value="24">24 GB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('req.checker.storage')}</label>
                  <select
                    value={hwStorage}
                    onChange={(e) => setHwStorage(e.target.value)}
                    className="w-full bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text focus:border-cobra-primary/50 focus:outline-none"
                  >
                    <option value="hdd">HDD</option>
                    <option value="ssd">SSD (SATA)</option>
                    <option value="nvme">NVMe SSD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-cobra-text2 mb-1.5">{t('req.checker.processing')}</label>
                  <select
                    value={hwProcessing}
                    onChange={(e) => setHwProcessing(e.target.value)}
                    className="w-full bg-black/30 border border-white/8 rounded-lg p-2.5 text-sm text-cobra-text focus:border-cobra-primary/50 focus:outline-none"
                  >
                    <option value="gpu">GPU (NVIDIA CUDA)</option>
                    <option value="cpu">CPU</option>
                  </select>
                </div>
              </div>

              <div className={`rounded-xl p-4 border ${
                hwResult === 'excellent' ? 'bg-cobra-success/10 border-cobra-success/20' :
                hwResult === 'good' ? 'bg-blue-500/10 border-blue-500/20' :
                hwResult === 'moderate' ? 'bg-cobra-warning/10 border-cobra-warning/20' :
                'bg-cobra-error/10 border-cobra-error/20'
              }`}>
                <h4 className="text-sm font-semibold text-cobra-text mb-1">{t('req.checker.result')}: <span className={
                  hwResult === 'excellent' ? 'text-cobra-success' :
                  hwResult === 'good' ? 'text-blue-400' :
                  hwResult === 'moderate' ? 'text-cobra-warning' :
                  'text-cobra-error'
                }>{t(`req.checker.${hwResult}`).split('—')[0].trim()}</span></h4>
                <p className="text-xs text-cobra-text2">{t(`req.checker.${hwResult}`).includes('—') ? t(`req.checker.${hwResult}`).split('—')[1].trim() : t(`req.checker.${hwResult}`)}</p>
                <p className="text-[11px] text-cobra-text2/70 mt-2 italic">{t('req.checker.note')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== COMPARISON ===== */}
        <section id="comparison" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('compare.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('compare.subtitle')}</p>
            </div>

            <div className="glass rounded-2xl overflow-hidden reveal">
              {/* Header */}
              <div className="grid grid-cols-3 bg-black/20 border-b border-white/5">
                <div className="p-4 text-xs font-semibold text-cobra-text2 uppercase">{t('compare.feature')}</div>
                <div className="p-4 text-xs font-semibold text-cobra-primary uppercase text-center">{t('compare.cobra')}</div>
                <div className="p-4 text-xs font-semibold text-cobra-text2 uppercase text-center">{t('compare.cloud')}</div>
              </div>
              {/* Rows */}
              {comparisonRows.map((row, i) => (
                <div key={row} className={`grid grid-cols-3 border-b border-white/3 comparison-row ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <div className="p-3 sm:p-4 text-xs sm:text-sm text-cobra-text">{t(`compare.${row}`)}</div>
                  <div className="p-3 sm:p-4 text-xs sm:text-sm text-cobra-success text-center flex items-center justify-center gap-1.5">
                    <IconCheck size={14} className="flex-shrink-0 hidden sm:block" />
                    <span>{t(`compare.${row}.cobra`)}</span>
                  </div>
                  <div className="p-3 sm:p-4 text-xs sm:text-sm text-cobra-text2 text-center">{t(`compare.${row}.cloud`)}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SCREENSHOTS ===== */}
        <section id="screenshots" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('screenshots.title')}</h2>
              <p className="text-cobra-text2 max-w-2xl mx-auto">{t('screenshots.subtitle')}</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 reveal">
              {screenshotPlaceholders.map((ss, idx) => (
                <button
                  key={ss.id}
                  onClick={() => setShowLightbox(idx)}
                  className="group glass rounded-xl overflow-hidden hover:border-cobra-primary/20 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cobra-primary"
                  aria-label={`${lang === 'fa' ? ss.caption_fa : ss.caption_en} — ${lang === 'en' ? 'Click to enlarge' : 'برای بزرگنمایی کلیک کنید'}`}
                >
                  <div className="bg-gradient-to-br from-cobra-surface to-cobra-surface2 overflow-hidden">
                    <img
                      src={screenshotImages[idx]}
                      alt={lang === 'fa' ? ss.caption_fa : ss.caption_en}
                      className="block w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-cobra-text2">{lang === 'fa' ? ss.caption_fa : ss.caption_en}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12 reveal">
              <h2 className="text-3xl sm:text-4xl font-bold text-cobra-text mb-4">{t('faq.title')}</h2>
              <p className="text-cobra-text2">{t('faq.subtitle')}</p>
            </div>
            <div className="space-y-2 reveal" role="region" aria-label="FAQ">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(i => (
                <div key={i} className="glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 sm:p-5 text-start hover:bg-white/[0.02] transition-colors"
                    aria-expanded={faqOpen === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-sm font-medium text-cobra-text pe-4">{t(`faq.q${i}`)}</span>
                    <IconChevronDown
                      size={18}
                      className={`flex-shrink-0 text-cobra-text2 transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    id={`faq-answer-${i}`}
                    role="region"
                    className={`overflow-hidden transition-all duration-300 ${faqOpen === i ? 'max-h-96' : 'max-h-0'}`}
                  >
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                      <p className="text-sm text-cobra-text2 leading-relaxed">{t(`faq.a${i}`)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section id="cta" className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center reveal">
            <div className="mb-6 animate-float">
              <CobraLogo size={64} className="mx-auto" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cobra-text mb-4">{t('cta.headline')}</h2>
            <p className="text-lg text-cobra-text2 mb-8 max-w-xl mx-auto">{t('cta.description')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowDownloadModal(true)}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-cobra-primary to-cobra-accent text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-cobra-primary/25"
              >
                <IconWindows size={20} />
                {t('cta.download')}
              </button>
              <button
                onClick={() => scrollToSection('docs')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 glass text-cobra-text font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                <IconBook size={18} />
                {t('cta.docs')}
              </button>
              <button
                onClick={() => scrollToSection('requirements')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 glass text-cobra-text font-medium rounded-xl hover:bg-white/10 transition-colors"
              >
                <IconMonitor size={18} />
                {t('cta.requirements')}
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-white/5 bg-black/30" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <CobraLogo size={32} />
                <span className="font-bold text-cobra-text">COBRA <span className="text-cobra-text2 font-normal text-sm">AI Studio</span></span>
              </div>
              <p className="text-sm text-cobra-text2 mb-4">{t('footer.tagline')}</p>
              <p className="text-xs text-cobra-text2/60">{lang === 'en' ? 'Professional offline AI generation for image, video and chat — powered by your own computer.' : 'تولید حرفه‌ای آفلاین هوش مصنوعی برای تصویر، ویدیو و گفتگو — با قدرت کامپیوتر شما.'}</p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold text-cobra-text mb-3">{t('footer.product')}</h4>
              <nav className="space-y-2">
                {['features', 'workflows', 'model-hub', 'requirements'].map(id => (
                  <button key={id} onClick={() => scrollToSection(id)} className="block text-sm text-cobra-text2 hover:text-cobra-primary transition-colors">
                    {navItems.find(n => n.id === id)?.label || id}
                  </button>
                ))}
              </nav>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold text-cobra-text mb-3">{t('footer.resources')}</h4>
              <nav className="space-y-2">
                <button onClick={() => scrollToSection('docs')} className="block text-sm text-cobra-text2 hover:text-cobra-primary transition-colors">{t('nav.docs')}</button>
                <button onClick={() => scrollToSection('tutorials')} className="block text-sm text-cobra-text2 hover:text-cobra-primary transition-colors">{t('nav.tutorials')}</button>
                <button onClick={() => scrollToSection('faq')} className="block text-sm text-cobra-text2 hover:text-cobra-primary transition-colors">{t('nav.faq')}</button>
                <span className="block text-sm text-cobra-text2/50">{t('footer.releaseNotes')}</span>
              </nav>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold text-cobra-text mb-3">{t('footer.legal')}</h4>
              <nav className="space-y-2">
                <span className="block text-sm text-cobra-text2/50">{t('footer.privacy')}</span>
                <span className="block text-sm text-cobra-text2/50">{t('footer.terms')}</span>
                <span className="block text-sm text-cobra-text2/50">{t('footer.license')}</span>
              </nav>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-cobra-text2/50">{t('footer.copyright')}</p>
            <p className="text-xs text-cobra-text2/50">{lang === 'en' ? `Version ${COBRA_VERSION}` : `نسخه ${COBRA_VERSION}`}</p>
          </div>
        </div>
      </footer>

      {/* ===== BACK TO TOP ===== */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 end-6 z-50 w-10 h-10 glass rounded-full flex items-center justify-center text-cobra-text2 hover:text-cobra-primary hover:bg-white/10 transition-all shadow-lg animate-fade-in"
          aria-label={t('backToTop')}
        >
          <IconArrowUp size={18} />
        </button>
      )}

      {/* ===== DOWNLOAD MODAL ===== */}
      {showDownloadModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowDownloadModal(false); }} role="dialog" aria-modal="true" aria-label={t('dl.title')}>
          <div className="modal-content" ref={modalRef}>
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <CobraLogo size={28} />
                <h3 className="text-lg font-bold text-cobra-text">{t('dl.title')}</h3>
              </div>
              <button onClick={() => setShowDownloadModal(false)} className="p-1.5 text-cobra-text2 hover:text-cobra-text rounded-lg hover:bg-white/5" aria-label={t('dl.close')}>
                <IconClose size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                  <span className="text-cobra-text2 text-xs">{t('dl.version')}</span>
                  <div className="text-cobra-text font-medium">{COBRA_VERSION}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                  <span className="text-cobra-text2 text-xs">{t('dl.arch')}</span>
                  <div className="text-cobra-text font-medium">{t('dl.archVal')}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                  <span className="text-cobra-text2 text-xs">{t('dl.installer')}</span>
                  <div className="text-cobra-text font-medium">{t('dl.installerVal')}</div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 border border-white/5">
                  <span className="text-cobra-text2 text-xs">{t('dl.size')}</span>
                  <div className="text-cobra-text font-medium">{t('dl.sizeVal')}</div>
                </div>
              </div>

              <div className="flex gap-3 text-xs">
                <button onClick={() => { setShowDownloadModal(false); scrollToSection('requirements'); }} className="text-cobra-primary hover:underline">{t('dl.reqLink')}</button>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dlCheckbox}
                  onChange={(e) => setDlCheckbox(e.target.checked)}
                  className="custom-checkbox"
                />
                <span className="text-sm text-cobra-text2">{t('dl.checkbox')}</span>
              </label>

              {!COBRA_DOWNLOAD_URL ? (
                <div className="bg-cobra-warning/10 border border-cobra-warning/20 rounded-lg p-3">
                  <p className="text-sm text-cobra-warning">{t('dl.noUrl')}</p>
                </div>
              ) : (
                <a
                  href={COBRA_DOWNLOAD_URL}
                  download
                  className={`w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cobra-primary to-cobra-accent text-white font-semibold rounded-xl transition-opacity ${
                    dlCheckbox ? 'hover:opacity-90' : 'opacity-40 pointer-events-none'
                  }`}
                  tabIndex={dlCheckbox ? 0 : -1}
                  aria-disabled={!dlCheckbox}
                >
                  <IconDownload size={18} />
                  {t('dl.downloadBtn')}
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== TUTORIAL MODAL ===== */}
      {showTutorialModal && activeTutorial && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowTutorialModal(null); setTutorialStep(0); }}} role="dialog" aria-modal="true" aria-label={lang === 'fa' ? activeTutorial.title_fa : activeTutorial.title_en}>
          <div className="modal-content max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <h3 className="text-base font-bold text-cobra-text pe-4">{lang === 'fa' ? activeTutorial.title_fa : activeTutorial.title_en}</h3>
              <button onClick={() => { setShowTutorialModal(null); setTutorialStep(0); }} className="p-1.5 text-cobra-text2 hover:text-cobra-text rounded-lg hover:bg-white/5 flex-shrink-0" aria-label={t('tutorials.close')}>
                <IconClose size={18} />
              </button>
            </div>
            <div className="p-5">
              {/* Progress */}
              <div className="flex gap-1 mb-4">
                {(lang === 'fa' ? activeTutorial.steps_fa : activeTutorial.steps_en).map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= tutorialStep ? 'bg-cobra-primary' : 'bg-white/10'}`} />
                ))}
              </div>
              <div className="text-xs text-cobra-text2 mb-3">
                {t('tutorials.step')} {tutorialStep + 1} {t('tutorials.of')} {(lang === 'fa' ? activeTutorial.steps_fa : activeTutorial.steps_en).length}
              </div>
              <p className="text-sm text-cobra-text leading-relaxed min-h-[80px]">
                {(lang === 'fa' ? activeTutorial.steps_fa : activeTutorial.steps_en)[tutorialStep]}
              </p>
            </div>
            <div className="flex items-center justify-between p-5 border-t border-white/5">
              <button
                onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                disabled={tutorialStep === 0}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-cobra-text2 hover:text-cobra-text disabled:opacity-30 disabled:cursor-not-allowed bg-white/5 rounded-lg transition-colors"
              >
                {isRTL ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
                {t('tutorials.prev')}
              </button>
              <button
                onClick={() => {
                  const steps = (lang === 'fa' ? activeTutorial.steps_fa : activeTutorial.steps_en);
                  if (tutorialStep < steps.length - 1) {
                    setTutorialStep(tutorialStep + 1);
                  } else {
                    setShowTutorialModal(null);
                    setTutorialStep(0);
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm bg-cobra-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                {tutorialStep < (lang === 'fa' ? activeTutorial.steps_fa : activeTutorial.steps_en).length - 1 ? t('tutorials.next') : t('tutorials.close')}
                {tutorialStep < (lang === 'fa' ? activeTutorial.steps_fa : activeTutorial.steps_en).length - 1 && (isRTL ? <IconChevronLeft size={14} /> : <IconChevronRight size={14} />)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== LIGHTBOX ===== */}
      {showLightbox !== null && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowLightbox(null); }} role="dialog" aria-modal="true" aria-label={lang === 'fa' ? screenshotPlaceholders[showLightbox].caption_fa : screenshotPlaceholders[showLightbox].caption_en}>
          <div className="max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-cobra-text2">{lang === 'fa' ? screenshotPlaceholders[showLightbox].caption_fa : screenshotPlaceholders[showLightbox].caption_en}</p>
              <button onClick={() => setShowLightbox(null)} className="p-2 text-cobra-text2 hover:text-cobra-text rounded-lg hover:bg-white/10" aria-label={t('dl.close')}>
                <IconClose size={20} />
              </button>
            </div>
            <div className="glass rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={screenshotImages[showLightbox]}
                alt={lang === 'fa' ? screenshotPlaceholders[showLightbox].caption_fa : screenshotPlaceholders[showLightbox].caption_en}
                className="block max-w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setShowLightbox((showLightbox - 1 + screenshotPlaceholders.length) % screenshotPlaceholders.length)}
                className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm text-cobra-text2 hover:text-cobra-text"
                aria-label={isRTL ? 'Next' : 'Previous'}
              >
                {isRTL ? <IconChevronRight size={16} /> : <IconChevronLeft size={16} />}
                {t('tutorials.prev')}
              </button>
              <span className="text-xs text-cobra-text2">{showLightbox + 1} / {screenshotPlaceholders.length}</span>
              <button
                onClick={() => setShowLightbox((showLightbox + 1) % screenshotPlaceholders.length)}
                className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm text-cobra-text2 hover:text-cobra-text"
                aria-label={isRTL ? 'Previous' : 'Next'}
              >
                {t('tutorials.next')}
                {isRTL ? <IconChevronLeft size={16} /> : <IconChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
