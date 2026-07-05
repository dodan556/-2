import React, { useState, useEffect } from 'react';
import { SiteConfig, SkillItem, PortfolioItem, ContactMessage } from './types';
import { DEFAULT_SITE_CONFIG, DEFAULT_SKILLS, DEFAULT_PORTFOLIO_ITEMS } from './data';
import { savePortfolioToDB, loadPortfolioFromDB } from './utils/db';
import { 
  fetchSiteConfig, 
  saveSiteConfig, 
  fetchSkills, 
  saveSkills, 
  fetchPortfolioItems, 
  savePortfolioItems, 
  fetchContactMessages, 
  saveContactMessage, 
  deleteContactMessage, 
  clearAllContactMessages,
  testFirestoreConnection
} from './lib/firebase';

import Header from './components/Header';
import HomeHero from './components/HomeHero';
import AboutMe from './components/AboutMe';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Durable local states synced with LocalStorage
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    const saved = localStorage.getItem('park_seongmi_site_config') || localStorage.getItem('park_sungmi_site_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        let migrated = false;
        
        // Auto-migrate old 4-line main tagline to the new 3-line one
        if (parsed.heroSubTitleLines && parsed.heroSubTitleLines.length === 4 && parsed.heroSubTitleLines.includes("웹 & 비주얼 디자이너")) {
          parsed.heroSubTitleLines = [
            "브랜드의 가치를",
            "디자인으로 전달하는",
            "박성미입니다."
          ];
          migrated = true;
        }
        
        // Auto-migrate old multi-line intro description to the new concise description
        if (parsed.introTitle && parsed.introTitle.includes("상세페이지를 중심으로")) {
          parsed.introTitle = "상세페이지 · 배너 · 리디자인 · 3D 연출 · 영상 제작, 편집";
          migrated = true;
        }
        
        // Auto-migrate to populate default certificates if missing
        if (!parsed.certificates || parsed.certificates.length === 0) {
          parsed.certificates = DEFAULT_SITE_CONFIG.certificates;
          migrated = true;
        }
        
        if (migrated) {
          localStorage.setItem('park_seongmi_site_config', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse site config', e);
      }
    }
    return DEFAULT_SITE_CONFIG;
  });

  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const saved = localStorage.getItem('park_seongmi_skills') || localStorage.getItem('park_sungmi_skills');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse skills', e);
      }
    }
    return DEFAULT_SKILLS;
  });

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    // Synchronously try localStorage first on startup for fast first render, but we'll load from IndexedDB immediately after
    const saved = localStorage.getItem('park_seongmi_portfolio_items') || localStorage.getItem('park_sungmi_portfolio_items');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse portfolio items from localStorage', e);
      }
    }
    return DEFAULT_PORTFOLIO_ITEMS;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('park_seongmi_contact_messages') || localStorage.getItem('park_sungmi_contact_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse contact messages', e);
      }
    }
    return [];
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPortfolioLoaded, setIsPortfolioLoaded] = useState(false);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  // 1. Load local cache from IndexedDB on mount for rapid initial render
  useEffect(() => {
    async function loadFromDB() {
      try {
        const dbItems = await loadPortfolioFromDB();
        if (dbItems && dbItems.length > 0) {
          setPortfolioItems(dbItems);
        }
      } catch (err) {
        console.error('Failed to load portfolio items from IndexedDB', err);
      } finally {
        setIsPortfolioLoaded(true);
      }
    }
    loadFromDB();
  }, []);

  // 2. Load and synchronize with Firebase Firestore in the background
  useEffect(() => {
    async function syncWithFirebase() {
      // Run Firestore connection test first
      const connTest = await testFirestoreConnection();
      if (!connTest.success) {
        console.error("Firestore connection test failed on App mount! Detailed error:", connTest.message, connTest.error);
      } else {
        console.log("Firestore connection test passed successfully!", connTest.message);
      }

      try {
        // Fetch site config
        const fbConfig = await fetchSiteConfig();
        if (fbConfig) {
          setSiteConfig(fbConfig);
        } else {
          console.warn("Could not read 'site_config' document (it might be missing or Firestore is offline).");
        }

        // Fetch skills
        const fbSkills = await fetchSkills();
        if (fbSkills) {
          setSkills(fbSkills);
        }

        // Fetch portfolio items
        const fbPortfolio = await fetchPortfolioItems();
        if (fbPortfolio && fbPortfolio.length > 0) {
          setPortfolioItems(fbPortfolio);
        }

        // Fetch contact messages
        const fbMessages = await fetchContactMessages();
        if (fbMessages) {
          setMessages(fbMessages);
        }

        setFirebaseLoaded(true);
      } catch (err) {
        console.error('Firebase sync error on mount:', err);
        setFirebaseLoaded(true); // Proceed anyway to allow local persistence fallback
      }
    }
    syncWithFirebase();
  }, []);

  // Sync state modifications to local storage only (never auto-save to Firestore on render)
  useEffect(() => {
    localStorage.setItem('park_seongmi_site_config', JSON.stringify(siteConfig));
  }, [siteConfig]);

  useEffect(() => {
    localStorage.setItem('park_seongmi_skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    if (!isPortfolioLoaded) return; // Prevent overwriting with initial state

    // Save to IndexedDB first
    savePortfolioToDB(portfolioItems);

    // Try saving to localStorage
    try {
      localStorage.setItem('park_seongmi_portfolio_items', JSON.stringify(portfolioItems));
    } catch (e) {
      console.warn('LocalStorage storage limit reached. Large portfolio items saved in IndexedDB instead.', e);
    }
  }, [portfolioItems, isPortfolioLoaded]);

  useEffect(() => {
    localStorage.setItem('park_seongmi_contact_messages', JSON.stringify(messages));
  }, [messages]);

  // Explicit handlers to save modifications to both local memory and remote Firebase Firestore
  const handleSaveConfig = async (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    if (firebaseLoaded) {
      await saveSiteConfig(newConfig);
    }
  };

  const handleSaveSkills = async (newSkills: SkillItem[]) => {
    setSkills(newSkills);
    if (firebaseLoaded) {
      await saveSkills(newSkills);
    }
  };

  const handleSavePortfolioItems = async (newItems: PortfolioItem[]) => {
    setPortfolioItems(newItems);
    savePortfolioToDB(newItems);
    try {
      localStorage.setItem('park_seongmi_portfolio_items', JSON.stringify(newItems));
    } catch (e) {
      console.warn('LocalStorage storage limit reached. Portfolio items saved in IndexedDB.', e);
    }
    if (firebaseLoaded) {
      await savePortfolioItems(newItems);
    }
  };

  // Handle addition of inquiries from clients
  const handleNewMessage = async (newMsg: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    const messageItem: ContactMessage = {
      ...newMsg,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [messageItem, ...prev]);
    await saveContactMessage(messageItem);
  };

  // Delete single inquiry
  const handleDeleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await deleteContactMessage(id);
  };

  // Clear all inquiries
  const handleClearMessages = async () => {
    if (confirm('모든 접수된 문의 내역을 비우시겠습니까?')) {
      const currentMessages = [...messages];
      setMessages([]);
      await clearAllContactMessages(currentMessages);
    }
  };

  // Import Backup data block
  const handleImportBackup = async (imported: { config: SiteConfig; skills: SkillItem[]; portfolioItems: PortfolioItem[] }) => {
    setSiteConfig(imported.config);
    setSkills(imported.skills);
    setPortfolioItems(imported.portfolioItems);
    if (firebaseLoaded) {
      await saveSiteConfig(imported.config);
      await saveSkills(imported.skills);
      await savePortfolioItems(imported.portfolioItems);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div id="portfolio-applet" className="min-h-screen bg-[#FBFBFA] flex flex-col relative">
      
      {/* Navigation Header */}
      <Header
        onAdminClick={() => setIsAdminOpen(!isAdminOpen)}
        isAdminActive={isAdminOpen}
      />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* HOME SECTION */}
        <HomeHero
          config={siteConfig}
          portfolioItems={portfolioItems}
          onScrollToSection={scrollToSection}
        />

        {/* ABOUT ME SECTION */}
        <AboutMe
          config={siteConfig}
          skills={skills}
        />

        {/* PORTFOLIO SECTION */}
        <Portfolio
          items={portfolioItems}
        />

        {/* CONTACT SECTION */}
        <Contact
          config={siteConfig}
          onNewMessage={handleNewMessage}
        />
      </main>

      {/* Premium minimal luxury Footer */}
      <footer className="py-12 bg-[#1C1C1A] text-white border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
            <span className="text-xs font-black tracking-[0.25em] text-white uppercase">PARK SEONGMI</span>
            <span className="text-[10px] text-white/50 tracking-wider">WEB &amp; VISUAL DESIGNER PORTFOLIO</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[10px] font-extrabold tracking-widest text-white/60 hover:text-white transition-colors"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[10px] font-extrabold tracking-widest text-white/60 hover:text-white transition-colors"
            >
              ABOUT ME
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="text-[10px] font-extrabold tracking-widest text-white/60 hover:text-white transition-colors"
            >
              PORTFOLIO
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-[10px] font-extrabold tracking-widest text-white/60 hover:text-white transition-colors"
            >
              CONTACT
            </button>
          </div>

          <div className="text-[10px] text-white/40 font-bold tracking-widest">
            © 2026 PARK SEONGMI. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* ADMIN CONTROL PANEL WORKSPACE MODAL */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={siteConfig}
        onSaveConfig={handleSaveConfig}
        skills={skills}
        onSaveSkills={handleSaveSkills}
        portfolioItems={portfolioItems}
        onSavePortfolioItems={handleSavePortfolioItems}
        messages={messages}
        onClearMessages={handleClearMessages}
        onDeleteMessage={handleDeleteMessage}
        onImportBackup={handleImportBackup}
      />

    </div>
  );
}
