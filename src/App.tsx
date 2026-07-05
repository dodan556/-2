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
  clearAllContactMessages 
} from './lib/firebase';

import Header from './components/Header';
import HomeHero from './components/HomeHero';
import AboutMe from './components/AboutMe';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Master states initialized directly from static src/data.ts for robust, cross-device consistency.
  // This completely prevents stale LocalStorage / IndexedDB caches on other devices like iPad/Mobile!
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [skills, setSkills] = useState<SkillItem[]>(DEFAULT_SKILLS);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO_ITEMS);

  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isPortfolioLoaded, setIsPortfolioLoaded] = useState(true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  // Load and synchronize only Contact Messages on mount to prevent any data loss
  useEffect(() => {
    async function initializeAndSync() {
      // Step 1: Load local messages cache instantly
      try {
        const savedMessages = localStorage.getItem('park_seongmi_contact_messages');
        if (savedMessages) {
          try { setMessages(JSON.parse(savedMessages)); } catch (e) {}
        }
      } catch (err) {
        console.error('Failed to load local cached messages:', err);
      }

      // Step 2: Fetch fresh contact messages from Firebase Cloud DB
      try {
        const fbMessages = await fetchContactMessages();
        if (fbMessages) {
          setMessages(fbMessages);
          localStorage.setItem('park_seongmi_contact_messages', JSON.stringify(fbMessages));
        }
        setFirebaseLoaded(true);
      } catch (err) {
        console.error('Firebase Cloud synchronization failed for messages:', err);
        setFirebaseLoaded(true); // Proceed anyway with cached messages
      }
    }

    initializeAndSync();
  }, []);

  // Handlers will update state instantly for live previews in the current session
  const handleSaveConfig = async (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
    // Notify the user about permanent code editing
    alert("💡 사이트 설정이 현재 브라우저에 임시로 반영되었습니다.\n\n모바일/아이패드 등 모든 기기에 영구 배포하려면 'src/data.ts' 파일의 DEFAULT_SITE_CONFIG 값을 직접 타이핑해 수정해 주세요!");
  };

  const handleSaveSkills = async (newSkills: SkillItem[]) => {
    setSkills(newSkills);
    alert("💡 스킬 능력이 현재 브라우저에 임시로 반영되었습니다.\n\n모바일/아이패드 등 모든 기기에 영구 배포하려면 'src/data.ts' 파일의 DEFAULT_SKILLS 값을 직접 타이핑해 수정해 주세요!");
  };

  const handleSavePortfolioItems = async (newItems: PortfolioItem[]) => {
    setPortfolioItems(newItems);
    alert("💡 포트폴리오 목록이 현재 브라우저에 임시로 반영되었습니다.\n\n모바일/아이패드 등 모든 기기에 영구 배포하려면 'src/data.ts' 파일의 DEFAULT_PORTFOLIO_ITEMS 값을 직접 타이핑해 수정해 주세요!");
  };

  // Handle addition of inquiries from clients (This goes to Firestore as usual!)
  const handleNewMessage = async (newMsg: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    const messageItem: ContactMessage = {
      ...newMsg,
      id: 'msg-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => {
      const updated = [messageItem, ...prev];
      localStorage.setItem('park_seongmi_contact_messages', JSON.stringify(updated));
      return updated;
    });
    await saveContactMessage(messageItem);
  };

  // Delete single inquiry
  const handleDeleteMessage = async (id: string) => {
    setMessages((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      localStorage.setItem('park_seongmi_contact_messages', JSON.stringify(updated));
      return updated;
    });
    await deleteContactMessage(id);
  };

  // Clear all inquiries
  const handleClearMessages = async () => {
    if (confirm('모든 접수된 문의 내역을 비우시겠습니까?')) {
      const currentMessages = [...messages];
      setMessages([]);
      localStorage.setItem('park_seongmi_contact_messages', JSON.stringify([]));
      await clearAllContactMessages(currentMessages);
    }
  };

  // Import Backup data block
  const handleImportBackup = async (imported: { config: SiteConfig; skills: SkillItem[]; portfolioItems: PortfolioItem[] }) => {
    setSiteConfig(imported.config);
    setSkills(imported.skills);
    setPortfolioItems(imported.portfolioItems);
    alert("💡 백업 데이터가 현재 브라우저 세션에 임시로 주입되었습니다.\n\n이를 모든 기기 및 클라우드에 영구 배포하려면 가져온 내용을 바탕으로 'src/data.ts' 코드 파일을 직접 수정해 주세요!");
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
