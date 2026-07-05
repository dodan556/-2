import React, { useState, useEffect } from 'react';
import { SiteConfig, SkillItem, PortfolioItem, ContactMessage } from './types';
import { DEFAULT_SITE_CONFIG, DEFAULT_SKILLS, DEFAULT_PORTFOLIO_ITEMS } from './data';
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
  // Use DEFAULT data directly as the initial states, and load the real Single Source of Truth from Firestore
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO_ITEMS);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  // Load and synchronize with Firebase Firestore as the Single Source of Truth
  useEffect(() => {
    async function syncWithFirebase() {
      // Run Firestore connection test
      const connTest = await testFirestoreConnection();
      if (!connTest.success) {
        console.error("Firestore connection failed on App mount.");
      }

      try {
        // Fetch site config from Firestore
        const fbConfig = await fetchSiteConfig();
        if (fbConfig) {
          setSiteConfig(fbConfig);
        }

        // Fetch skills from Firestore
        const fbSkills = await fetchSkills();
        if (fbSkills) {
          setSkills(fbSkills);
        }

        // Fetch portfolio items from Firestore
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
        setFirebaseLoaded(true);
      }
    }
    syncWithFirebase();
  }, []);

  // Explicit handlers to save modifications solely to remote Firebase Firestore and local React memory
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
