import React, { useState, useEffect } from 'react';
import { SiteConfig, SkillItem, PortfolioItem, ContactMessage, PortfolioCategory, DetailPageItem, RedesignItem, BannerItem, ThreeDItem, VideoItem } from '../types';
import { compressImage } from '../utils/imageCompressor';
import { X, Lock, Save, Plus, Trash2, Edit3, MessageSquare, Download, Upload, HelpCircle, AlertTriangle, ArrowRight, Check, ChevronUp, ChevronDown } from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onSaveConfig: (newConfig: SiteConfig) => void;
  skills: SkillItem[];
  onSaveSkills: (newSkills: SkillItem[]) => void;
  portfolioItems: PortfolioItem[];
  onSavePortfolioItems: (newItems: PortfolioItem[]) => void;
  messages: ContactMessage[];
  onClearMessages: () => void;
  onDeleteMessage: (id: string) => void;
  onImportBackup: (importedData: { config: SiteConfig; skills: SkillItem[]; portfolioItems: PortfolioItem[] }) => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  skills,
  onSaveSkills,
  portfolioItems,
  onSavePortfolioItems,
  messages,
  onClearMessages,
  onDeleteMessage,
  onImportBackup
}: AdminPanelProps) {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'skills' | 'portfolio' | 'certificates' | 'messages' | 'backup'>('info');

  // Local editing states for Site Info
  const [editHeroTitle, setEditHeroTitle] = useState(config.heroTitle);
  const [editHeroSubLine0, setEditHeroSubLine0] = useState(config.heroSubTitleLines[0] || '');
  const [editHeroSubLine1, setEditHeroSubLine1] = useState(config.heroSubTitleLines[1] || '');
  const [editHeroSubLine2, setEditHeroSubLine2] = useState(config.heroSubTitleLines[2] || '');
  const [editHeroSubLine3, setEditHeroSubLine3] = useState(config.heroSubTitleLines[3] || '');
  const [editIntroTitle, setEditIntroTitle] = useState(config.introTitle);
  const [editIntroDesc, setEditIntroDesc] = useState(config.introDescription);
  const [editEmail, setEditEmail] = useState(config.email);
  const [editBlog, setEditBlog] = useState(config.blogUrl);
  const [editYoutube, setEditYoutube] = useState(config.youtubeUrl);
  const [editYoutubeName, setEditYoutubeName] = useState(config.youtubeChannelName);

  // States for Certificates Management
  const [certsList, setCertsList] = useState<{ id: string; name: string; date: string; issuer: string }[]>(() => config.certificates || [
    { id: 'cert-1', name: '컴퓨터그래픽스운용기능사', date: '2020.12', issuer: '한국산업인력공단 (Q-Net)' },
    { id: 'cert-2', name: '웹디자인기능사', date: '2021.06', issuer: '한국산업인력공단 (Q-Net)' },
    { id: 'cert-3', name: 'GTQ 그래픽기술자격 1급', date: '2019.05', issuer: '한국생산성본부 (KPC)' },
    { id: 'cert-4', name: '컬러리스트산업기사', date: '2022.09', issuer: '한국산업인력공단 (Q-Net)' }
  ]);
  const [newCertName, setNewCertName] = useState('');
  const [newCertDate, setNewCertDate] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [deleteCertConfirmId, setDeleteCertConfirmId] = useState<string | null>(null);

  // States for adding a new Portfolio Item
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemCategory, setNewItemCategory] = useState<PortfolioCategory>('DETAIL_PAGE');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemSubtitle, setNewItemSubtitle] = useState('');
  const [newItemIntro, setNewItemIntro] = useState('');
  const [newItemTools, setNewItemTools] = useState('');
  const [newItemConcept, setNewItemConcept] = useState('');
  
  // Base64 storage states
  const [newItemOverviewImg, setNewItemOverviewImg] = useState('');
  const [newItemBeforeImg, setNewItemBeforeImg] = useState('');
  const [newItemAfterImg, setNewItemAfterImg] = useState('');
  const [newItemSingleImg, setNewItemSingleImg] = useState(''); // Used for BANNER and 3D
  const [newItemVideoUrl, setNewItemVideoUrl] = useState('');
  const [newItemVideoThumb, setNewItemVideoThumb] = useState('');

  // Editing and new metadata upload states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItemThumbnail, setNewItemThumbnail] = useState('');

  // Design Guide Color states (for detail pages / redesigns)
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');
  const [color3, setColor3] = useState('');
  const [color4, setColor4] = useState('');

  // Highlights state for Detail Page item creation (up to 3 highlights)
  const [hl1Title, setHl1Title] = useState('');
  const [hl1Desc, setHl1Desc] = useState('');
  const [hl1Img, setHl1Img] = useState('');
  const [hl2Title, setHl2Title] = useState('');
  const [hl2Desc, setHl2Desc] = useState('');
  const [hl2Img, setHl2Img] = useState('');
  const [hl3Title, setHl3Title] = useState('');
  const [hl3Desc, setHl3Desc] = useState('');
  const [hl3Img, setHl3Img] = useState('');

  const [imageUploading, setImageUploading] = useState(false);

  // States for adding a new Skill
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillIconType, setNewSkillIconType] = useState('photoshop');
  const [newSkillPercentage, setNewSkillPercentage] = useState(80);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // Sync local states when AdminPanel opens or config changes
  useEffect(() => {
    if (isOpen) {
      setEditHeroTitle(config.heroTitle);
      setEditHeroSubLine0(config.heroSubTitleLines[0] || '');
      setEditHeroSubLine1(config.heroSubTitleLines[1] || '');
      setEditHeroSubLine2(config.heroSubTitleLines[2] || '');
      setEditHeroSubLine3(config.heroSubTitleLines[3] || '');
      setEditIntroTitle(config.introTitle);
      setEditIntroDesc(config.introDescription);
      setEditEmail(config.email);
      setEditBlog(config.blogUrl);
      setEditYoutube(config.youtubeUrl);
      setEditYoutubeName(config.youtubeChannelName);
      setCertsList(config.certificates || []);
    }
  }, [isOpen, config]);

  // States for inline delete confirmations to bypass iframe alert/confirm limitations
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteSkillConfirmId, setDeleteSkillConfirmId] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle PIN authentication (Default is 1111)
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1111') {
      setIsUnlocked(true);
      setLoginError(false);
    } else {
      setLoginError(true);
      setPin('');
    }
  };

  // Site Info Save
  const handleSaveInfo = () => {
    onSaveConfig({
      heroTitle: editHeroTitle,
      heroSubTitleLines: [editHeroSubLine0, editHeroSubLine1, editHeroSubLine2, editHeroSubLine3].filter(Boolean),
      introTitle: editIntroTitle,
      introDescription: editIntroDesc,
      email: editEmail,
      blogUrl: editBlog,
      youtubeUrl: editYoutube,
      youtubeChannelName: editYoutubeName,
      certificates: certsList
    });
    alert('기본 웹사이트 정보가 저장되었습니다.');
  };

  // Image Upload Helper with client-side canvas downscaler
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageState: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(true);
      // If it's an animated GIF, read it directly as data URL to preserve full animation!
      if (file.type === 'image/gif') {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setImageState(event.target.result as string);
          }
          setImageUploading(false);
        };
        reader.onerror = () => {
          alert('GIF 파일을 읽어오는데 실패했습니다.');
          setImageUploading(false);
        };
        reader.readAsDataURL(file);
      } else {
        // Compress standard images to a generous max dimension (1600px) so long details stay ultra crisp, but lightweight
        const base64Data = await compressImage(file, 1600, 0.75);
        setImageState(base64Data);
        setImageUploading(false);
      }
    } catch (err: any) {
      alert('이미지 파일 변환 및 압축을 실패했습니다: ' + err.message);
      setImageUploading(false);
    }
  };

  // Video File Upload Helper with base64 conversion
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Direct support for large files using IndexedDB
    if (file.size > 50 * 1024 * 1024) {
      alert('비디오 파일 크기가 매우 큽니다(50MB 초과). 원활한 업로드와 재생을 위해 고화질 저용량 인코딩 비디오 파일 사용을 권장합니다.');
    }

    const reader = new FileReader();
    reader.onloadstart = () => setImageUploading(true);
    reader.onload = (event) => {
      if (event.target?.result) {
        setNewItemVideoUrl(event.target.result as string);
      }
      setImageUploading(false);
    };
    reader.onerror = () => {
      alert('비디오 파일을 불러오는 중 실패했습니다.');
      setImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Add or Edit Portfolio Item
  const handleAddPortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) {
      alert('프로젝트 제목을 입력해주세요.');
      return;
    }

    const toolsArray = newItemTools.split(',').map((t) => t.trim()).filter(Boolean);
    const colorsArray = [color1, color2, color3, color4].map(c => c.trim()).filter(c => /^#[0-9A-F]{3,6}$/i.test(c));
    let createdItem: PortfolioItem;

    const itemId = editingId || (newItemCategory === 'DETAIL_PAGE' 
      ? 'detail-' + Date.now() 
      : newItemCategory === 'REDESIGN' 
      ? 'redesign-' + Date.now()
      : newItemCategory === 'BANNER'
      ? 'banner-' + Date.now()
      : newItemCategory === 'THREE_D'
      ? '3d-' + Date.now()
      : 'video-' + Date.now());

    if (newItemCategory === 'DETAIL_PAGE') {
      if (!newItemOverviewImg) {
        alert('상세페이지 전체 오버뷰 이미지를 올려주세요.');
        return;
      }
      
      const highlights = [];
      if (hl1Title.trim()) {
        highlights.push({
          id: 'hl-custom-1',
          title: hl1Title,
          description: hl1Desc,
          image: hl1Img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="%23eee"></svg>'
        });
      }
      if (hl2Title.trim()) {
        highlights.push({
          id: 'hl-custom-2',
          title: hl2Title,
          description: hl2Desc,
          image: hl2Img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="%23eee"></svg>'
        });
      }
      if (hl3Title.trim()) {
        highlights.push({
          id: 'hl-custom-3',
          title: hl3Title,
          description: hl3Desc,
          image: hl3Img || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" fill="%23eee"></svg>'
        });
      }

      createdItem = {
        id: itemId,
        category: 'DETAIL_PAGE',
        title: newItemTitle,
        subtitle: newItemSubtitle,
        projectIntro: newItemIntro,
        tools: toolsArray,
        concept: newItemConcept,
        overviewImage: newItemOverviewImg,
        highlights,
        thumbnail: newItemThumbnail || undefined,
        colors: colorsArray.length > 0 ? colorsArray : undefined
      };
    } else if (newItemCategory === 'REDESIGN') {
      if (!newItemBeforeImg || !newItemAfterImg) {
        alert('Before 이미지와 After 이미지를 모두 등록해주세요.');
        return;
      }
      createdItem = {
        id: itemId,
        category: 'REDESIGN',
        title: newItemTitle,
        subtitle: newItemSubtitle,
        projectIntro: newItemIntro,
        tools: toolsArray,
        beforeImage: newItemBeforeImg,
        afterImage: newItemAfterImg,
        thumbnail: newItemThumbnail || undefined,
        colors: colorsArray.length > 0 ? colorsArray : undefined
      };
    } else if (newItemCategory === 'BANNER') {
      if (!newItemSingleImg) {
        alert('배너 이미지를 등록해주세요.');
        return;
      }
      createdItem = {
        id: itemId,
        category: 'BANNER',
        title: newItemTitle,
        image: newItemSingleImg,
        thumbnail: newItemThumbnail || undefined
      };
    } else if (newItemCategory === 'THREE_D') {
      if (!newItemSingleImg) {
        alert('3D 렌더링 결과 이미지를 등록해주세요.');
        return;
      }
      createdItem = {
        id: itemId,
        category: 'THREE_D',
        title: newItemTitle,
        description: newItemIntro, // reuse intro as description
        image: newItemSingleImg,
        thumbnail: newItemThumbnail || undefined,
        videoUrl: newItemVideoUrl || undefined
      };
    } else { // VIDEO
      if (!newItemVideoThumb) {
        alert('비디오 썸네일 이미지를 등록해주세요.');
        return;
      }
      createdItem = {
        id: itemId,
        category: 'VIDEO',
        title: newItemTitle,
        description: newItemIntro,
        videoUrl: newItemVideoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: newItemThumbnail || newItemVideoThumb
      };
    }

    if (editingId) {
      onSavePortfolioItems(portfolioItems.map((item) => item.id === editingId ? createdItem : item));
      alert('포트폴리오 작업물이 성공적으로 수정되었습니다.');
    } else {
      onSavePortfolioItems([...portfolioItems, createdItem]);
      alert('새 포트폴리오 항목이 등록되었습니다.');
    }
    
    // Reset Form States
    setShowAddItemForm(false);
    setEditingId(null);
    setNewItemTitle('');
    setNewItemSubtitle('');
    setNewItemIntro('');
    setNewItemTools('');
    setNewItemConcept('');
    setNewItemOverviewImg('');
    setNewItemBeforeImg('');
    setNewItemAfterImg('');
    setNewItemSingleImg('');
    setNewItemVideoUrl('');
    setNewItemVideoThumb('');
    setNewItemThumbnail('');
    setColor1('');
    setColor2('');
    setColor3('');
    setColor4('');
    setHl1Title(''); setHl1Desc(''); setHl1Img('');
    setHl2Title(''); setHl2Desc(''); setHl2Img('');
    setHl3Title(''); setHl3Desc(''); setHl3Img('');
  };

  // Delete Portfolio Item
  const handleDeletePortfolioItem = (id: string) => {
    onSavePortfolioItems(portfolioItems.filter((item) => item.id !== id));
    setDeleteConfirmId(null);
  };

  // Move Portfolio Item up or down
  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...portfolioItems];
    if (direction === 'up' && index > 0) {
      const temp = newItems[index];
      newItems[index] = newItems[index - 1];
      newItems[index - 1] = temp;
    } else if (direction === 'down' && index < newItems.length - 1) {
      const temp = newItems[index];
      newItems[index] = newItems[index + 1];
      newItems[index + 1] = temp;
    }
    onSavePortfolioItems(newItems);
  };

  // Populate state to edit portfolio item
  const handleStartEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setNewItemCategory(item.category);
    setNewItemTitle(item.title);
    setNewItemSubtitle((item as any).subtitle || '');
    setNewItemIntro((item as any).projectIntro || (item as any).description || '');
    setNewItemTools(((item as any).tools || []).join(', '));
    setNewItemConcept((item as any).concept || '');
    setNewItemThumbnail(item.thumbnail || '');

    if (item.category === 'DETAIL_PAGE') {
      setNewItemOverviewImg((item as DetailPageItem).overviewImage || '');
      // Colors
      const colors = (item as DetailPageItem).colors || [];
      setColor1(colors[0] || '');
      setColor2(colors[1] || '');
      setColor3(colors[2] || '');
      setColor4(colors[3] || '');
      // Highlights
      const hls = (item as DetailPageItem).highlights || [];
      setHl1Title(hls[0]?.title || ''); setHl1Desc(hls[0]?.description || ''); setHl1Img(hls[0]?.image || '');
      setHl2Title(hls[1]?.title || ''); setHl2Desc(hls[1]?.description || ''); setHl2Img(hls[1]?.image || '');
      setHl3Title(hls[2]?.title || ''); setHl3Desc(hls[2]?.description || ''); setHl3Img(hls[2]?.image || '');
    } else if (item.category === 'REDESIGN') {
      setNewItemBeforeImg((item as RedesignItem).beforeImage || '');
      setNewItemAfterImg((item as RedesignItem).afterImage || '');
      const colors = (item as RedesignItem).colors || [];
      setColor1(colors[0] || '');
      setColor2(colors[1] || '');
      setColor3(colors[2] || '');
      setColor4(colors[3] || '');
    } else if (item.category === 'BANNER') {
      setNewItemSingleImg((item as BannerItem).image || '');
    } else if (item.category === 'THREE_D') {
      setNewItemSingleImg((item as ThreeDItem).image || '');
      setNewItemVideoUrl((item as ThreeDItem).videoUrl || '');
    } else if (item.category === 'VIDEO') {
      setNewItemVideoUrl((item as VideoItem).videoUrl || '');
      setNewItemVideoThumb((item as VideoItem).thumbnail || '');
    }

    setShowAddItemForm(true);
  };

  // Add or Edit Skill
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    if (editingSkillId) {
      const updatedSkills = skills.map((skill) => 
        skill.id === editingSkillId 
          ? { ...skill, name: newSkillName, iconType: newSkillIconType, percentage: newSkillPercentage }
          : skill
      );
      onSaveSkills(updatedSkills);
      setEditingSkillId(null);
      setNewSkillName('');
      alert('기술 항목이 수정되었습니다.');
    } else {
      const newSkill: SkillItem = {
        id: 'skill-' + Date.now(),
        name: newSkillName,
        iconType: newSkillIconType,
        percentage: newSkillPercentage
      };
      onSaveSkills([...skills, newSkill]);
      setNewSkillName('');
      alert('새 기술 항목이 추가되었습니다.');
    }
  };

  const handleStartEditSkill = (skill: SkillItem) => {
    setEditingSkillId(skill.id);
    setNewSkillName(skill.name);
    setNewSkillIconType(skill.iconType);
    setNewSkillPercentage(skill.percentage);
  };

  // Delete Skill
  const handleDeleteSkill = (id: string) => {
    onSaveSkills(skills.filter((skill) => skill.id !== id));
    setDeleteSkillConfirmId(null);
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(
      JSON.stringify({ config, skills, portfolioItems })
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `park_sungmi_portfolio_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.config && imported.skills && imported.portfolioItems) {
          onImportBackup(imported);
          alert('포트폴리오 백업 데이터가 성공적으로 전체 복원되었습니다!');
          
          // Refresh local editing variables
          setEditHeroTitle(imported.config.heroTitle);
          setEditHeroSubLine0(imported.config.heroSubTitleLines[0] || '');
          setEditHeroSubLine1(imported.config.heroSubTitleLines[1] || '');
          setEditHeroSubLine2(imported.config.heroSubTitleLines[2] || '');
          setEditHeroSubLine3(imported.config.heroSubTitleLines[3] || '');
          setEditIntroTitle(imported.config.introTitle);
          setEditIntroDesc(imported.config.introDescription);
          setEditEmail(imported.config.email);
          setEditBlog(imported.config.blogUrl);
          setEditYoutube(imported.config.youtubeUrl);
          setEditYoutubeName(imported.config.youtubeChannelName);
          setCertsList(imported.config.certificates || []);
        } else {
          alert('올바르지 않은 백업 파일 포맷입니다.');
        }
      } catch (err) {
        alert('파일 파싱에 실패했습니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1C1A]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      
      {/* 1. PASSWORD GATE SCREEN */}
      {!isUnlocked ? (
        <div className="bg-white rounded-3xl p-8 md:p-10 max-w-md w-full shadow-2xl border border-[#E8E8E3] text-center space-y-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center text-[#1C1C1A]">
            <Lock size={24} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-black text-[#1C1C1A]">ADMINISTRATIVE ACCESS</h3>
            <p className="text-xs text-[#70706B]">관리자 계정 확인을 위해 핀 번호를 입력해주세요.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              className="w-full text-center px-4 py-4 text-xl tracking-widest border border-[#E8E8E3] focus:border-[#1C1C1A] rounded-xl focus:outline-none"
              maxLength={4}
              required
              autoFocus
            />
            {loginError && (
              <p className="text-xs text-red-600 font-semibold animate-pulse">핀 번호가 올바르지 않습니다. 다시 시도하십시오.</p>
            )}

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-[#1C1C1A] text-xs font-bold tracking-widest uppercase rounded-xl transition-colors cursor-pointer"
              >
                닫기
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#1C1C1A] text-white hover:bg-[#1C1C1A]/90 text-xs font-bold tracking-widest uppercase rounded-xl transition-colors cursor-pointer"
              >
                접속하기
              </button>
            </div>
          </form>
        </div>
      ) : (

        /* 2. DOCK SYSTEM WORKSPACE */
        <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-[#E8E8E3] max-h-[92vh] flex flex-col animate-fade-in">
          
          {/* Top Panel Bar */}
          <div className="bg-neutral-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <h3 className="text-xs font-black tracking-widest uppercase">PARK SEONGMI DESIGN SYSTEM — CMS CONSOLE</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Admin Navigation Sidebar + Body Container */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#FBFBFA]">
            
            {/* Sidebar Tabs */}
            <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-[#E8E8E3] p-4 space-y-1.5 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeTab === 'info'
                    ? 'bg-[#1C1C1A] text-white'
                    : 'text-[#70706B] hover:bg-neutral-100 hover:text-[#1C1C1A]'
                }`}
              >
                사이트 기본 정보
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeTab === 'skills'
                    ? 'bg-[#1C1C1A] text-white'
                    : 'text-[#70706B] hover:bg-neutral-100 hover:text-[#1C1C1A]'
                }`}
              >
                보유 기술바 편집
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeTab === 'portfolio'
                    ? 'bg-[#1C1C1A] text-white'
                    : 'text-[#70706B] hover:bg-neutral-100 hover:text-[#1C1C1A]'
                }`}
              >
                포트폴리오 관리 ({portfolioItems.length})
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeTab === 'certificates'
                    ? 'bg-[#1C1C1A] text-white'
                    : 'text-[#70706B] hover:bg-neutral-100 hover:text-[#1C1C1A]'
                }`}
              >
                자격증 및 면허 관리 ({certsList.length})
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap flex items-center justify-between ${
                  activeTab === 'messages'
                    ? 'bg-[#1C1C1A] text-white'
                    : 'text-[#70706B] hover:bg-neutral-100 hover:text-[#1C1C1A]'
                }`}
              >
                <span>고객 문의함</span>
                {messages.length > 0 && (
                  <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black animate-bounce">
                    {messages.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all whitespace-nowrap ${
                  activeTab === 'backup'
                    ? 'bg-[#1C1C1A] text-white'
                    : 'text-[#70706B] hover:bg-neutral-100 hover:text-[#1C1C1A]'
                }`}
              >
                백업 및 복원
              </button>
            </div>

            {/* Scrollable Work Desk Content Area */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">

              {/* TAB 1: SITE INFORMATION EDIT */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E8E3] pb-3">
                    <h4 className="text-sm font-black text-[#1C1C1A] tracking-wider uppercase">사이트 기본 정보 및 카피 문구 수정</h4>
                    <p className="text-[10px] text-[#70706B]">홈페이지에 노출되는 대문 타이포그래피 및 자기소개글을 실시간 수정합니다.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Hero Title */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#70706B]">메인 카피 대문 타이틀 (상단 영문)</label>
                      <input
                        type="text"
                        value={editHeroTitle}
                        onChange={(e) => setEditHeroTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#70706B]">연락용 이메일 주소</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Multi-line sub title editing */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-[#70706B] block">홈 대형 메인 슬로건 (한 줄씩 순차 노출)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <input
                        type="text"
                        value={editHeroSubLine0}
                        onChange={(e) => setEditHeroSubLine0(e.target.value)}
                        placeholder="첫 번째 줄"
                        className="w-full px-3 py-2 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                      />
                      <input
                        type="text"
                        value={editHeroSubLine1}
                        onChange={(e) => setEditHeroSubLine1(e.target.value)}
                        placeholder="두 번째 줄"
                        className="w-full px-3 py-2 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                      />
                      <input
                        type="text"
                        value={editHeroSubLine2}
                        onChange={(e) => setEditHeroSubLine2(e.target.value)}
                        placeholder="세 번째 줄"
                        className="w-full px-3 py-2 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                      />
                      <input
                        type="text"
                        value={editHeroSubLine3}
                        onChange={(e) => setEditHeroSubLine3(e.target.value)}
                        placeholder="네 번째 줄 (예: 박성미입니다.)"
                        className="w-full px-3 py-2 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                      />
                    </div>
                  </div>

                  {/* Biography section */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#70706B]">ABOUT ME - 대표 타이틀 메세지</label>
                      <input
                        type="text"
                        value={editIntroTitle}
                        onChange={(e) => setEditIntroTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A] focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#70706B]">ABOUT ME - 자기소개 상세 설명 본문</label>
                      <textarea
                        rows={4}
                        value={editIntroDesc}
                        onChange={(e) => setEditIntroDesc(e.target.value)}
                        className="w-full px-4 py-3 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A] focus:outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Social Channel Links */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#70706B]">네이버 블로그 주소</label>
                      <input
                        type="text"
                        value={editBlog}
                        onChange={(e) => setEditBlog(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#70706B]">유튜브 채널 주소</label>
                      <input
                        type="text"
                        value={editYoutube}
                        onChange={(e) => setEditYoutube(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black tracking-widest text-[#70706B]">유튜브 채널 이름</label>
                      <input
                        type="text"
                        value={editYoutubeName}
                        onChange={(e) => setEditYoutubeName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                      />
                    </div>
                  </div>

                  {/* Submit buttons */}
                  <div className="pt-4 border-t border-[#E8E8E3] flex justify-end">
                    <button
                      onClick={handleSaveInfo}
                      className="px-6 py-3 bg-[#1C1C1A] text-white text-xs font-bold tracking-widest uppercase rounded-xl flex items-center space-x-2 cursor-pointer shadow-md hover:bg-[#1C1C1A]/90"
                    >
                      <Save size={13} />
                      <span>SAVE CHANGES (설정값 저장)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: SKILLS MANAGER */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E8E3] pb-3">
                    <h4 className="text-sm font-black text-[#1C1C1A] tracking-wider uppercase">보유 디자인 소프트웨어 기술바 관리</h4>
                    <p className="text-[10px] text-[#70706B]">보유 중인 프로그램 숙련도 기술바를 새로 등록하거나 삭제 조정합니다.</p>
                  </div>

                  {/* Existing skills table list */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest text-[#70706B] block">현재 노출 중인 기술 리스트</label>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {skills.map((skill) => (
                        <div key={skill.id} className="bg-white border border-[#E8E8E3] p-4 rounded-xl flex items-center justify-between shadow-sm">
                          <div className="flex flex-col">
                            <span className="text-xs font-extrabold text-[#1C1C1A]">{skill.name}</span>
                            <span className="text-[10px] text-[#70706B] uppercase font-bold">아이콘 타입: {skill.iconType} ({skill.percentage}%)</span>
                          </div>
                           <div className="flex space-x-1 items-center">
                            {deleteSkillConfirmId === skill.id ? (
                              <div className="flex items-center space-x-1 bg-red-50 p-1 rounded-lg border border-red-200 animate-fade-in">
                                <span className="text-[9px] font-black text-red-700 px-1 uppercase tracking-tighter">정말 삭제?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSkill(skill.id)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black rounded cursor-pointer"
                                >
                                  삭제
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteSkillConfirmId(null)}
                                  className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 text-[#1C1C1A] text-[9px] font-black rounded cursor-pointer"
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStartEditSkill(skill)}
                                  className="p-1.5 hover:bg-neutral-100 text-[#1C1C1A] rounded-lg transition-colors cursor-pointer"
                                  title="기술 수정"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteSkillConfirmId(skill.id)}
                                  className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                                  title="삭제"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                   {/* Add New Skill form */}
                   <form onSubmit={handleAddSkill} className="bg-[#E8E8E3]/30 p-5 rounded-2xl space-y-4 border border-[#E8E8E3]/60">
                     <span className="text-[11px] font-black text-[#1C1C1A] block">
                       {editingSkillId ? '소프트웨어 기술 항목 수정 (EDITING)' : '새로운 소프트웨어 기술 등록'}
                     </span>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       {/* Name */}
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-[#70706B]">프로그램 이름</label>
                         <input
                           type="text"
                           value={newSkillName}
                           onChange={(e) => setNewSkillName(e.target.value)}
                           placeholder="예시: Photoshop"
                           className="w-full px-3 py-2 border border-[#E8E8E3] rounded-lg text-xs bg-white focus:outline-none"
                           required
                         />
                       </div>

                       {/* Icon Type Selection */}
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-[#70706B]">앱 아이콘 스타일 매칭</label>
                         <select
                           value={newSkillIconType}
                           onChange={(e) => setNewSkillIconType(e.target.value)}
                           className="w-full px-3 py-2 border border-[#E8E8E3] rounded-lg text-xs bg-white focus:outline-none"
                         >
                           <option value="photoshop">Photoshop (Ps)</option>
                           <option value="illustrator">Illustrator (Ai)</option>
                           <option value="figma">Figma (Fg)</option>
                           <option value="premiere">Premiere Pro (Pr)</option>
                           <option value="aftereffects">After Effects (Ae)</option>
                           <option value="cinema4d">Cinema 4D (C4D)</option>
                           <option value="blender">Blender (Bl)</option>
                         </select>
                       </div>

                       {/* Percentage */}
                       <div className="space-y-1.5">
                         <label className="text-[10px] font-bold text-[#70706B] flex justify-between">
                           <span>숙련도 게이지 (%)</span>
                           <span className="font-extrabold text-[#1C1C1A]">{newSkillPercentage}%</span>
                         </label>
                         <input
                           type="range"
                           min="10"
                           max="100"
                           value={newSkillPercentage}
                           onChange={(e) => setNewSkillPercentage(parseInt(e.target.value))}
                           className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#1C1C1A] mt-2"
                         />
                       </div>
                     </div>

                     <div className="flex justify-end space-x-2 pt-2">
                       {editingSkillId && (
                         <button
                           type="button"
                           onClick={() => {
                             setEditingSkillId(null);
                             setNewSkillName('');
                             setNewSkillIconType('photoshop');
                             setNewSkillPercentage(80);
                           }}
                           className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#1C1C1A] text-xs font-bold rounded-xl"
                         >
                           수정 취소
                         </button>
                       )}
                       <button
                         type="submit"
                         className="px-5 py-2.5 bg-[#1C1C1A] text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md hover:bg-[#1C1C1A]/90"
                       >
                         {editingSkillId ? <Save size={12} /> : <Plus size={12} />}
                         <span>{editingSkillId ? 'SAVE SKILL CHANGES (기술 수정 저장)' : 'ADD SKILL (기술 등록)'}</span>
                       </button>
                     </div>
                   </form>
                </div>
              )}

              {/* TAB 3: PORTFOLIO MANAGER */}
              {activeTab === 'portfolio' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E8E3] pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-[#1C1C1A] tracking-wider uppercase">포트폴리오 업로드 및 리스트 수정</h4>
                      <p className="text-[10px] text-[#70706B]">새로운 작업물을 추가하거나 불필요한 기존 항목들을 삭제합니다.</p>
                    </div>
                    
                    {!showAddItemForm && (
                      <button
                        onClick={() => setShowAddItemForm(true)}
                        className="px-4 py-2 bg-[#1C1C1A] text-white text-xs font-black tracking-widest uppercase rounded-full flex items-center space-x-1.5 cursor-pointer shadow-md"
                      >
                        <Plus size={13} />
                        <span>UPLOAD WORK (새 작업물 업로드)</span>
                      </button>
                    )}
                  </div>

                  {/* 3-A. DYNAMIC portfolio item creation form */}
                  {showAddItemForm && (
                    <form onSubmit={handleAddPortfolioItem} className="bg-[#E8E8E3]/30 border border-[#E8E8E3] p-6 md:p-8 rounded-2xl space-y-6 animate-fade-in relative z-10">
                      <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-3">
                        <span className="text-xs font-black tracking-widest text-[#1C1C1A] uppercase">새 포트폴리오 작업물 세부설정</span>
                        <button
                          type="button"
                          onClick={() => setShowAddItemForm(false)}
                          className="p-1 rounded-full hover:bg-[#E8E8E3] text-[#70706B] transition-colors cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      {/* Select category first */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black tracking-widest text-[#70706B] uppercase">포트폴리오 대분류 선택 *</label>
                          <select
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value as PortfolioCategory)}
                            className="w-full px-3 py-2.5 border border-[#E8E8E3] rounded-xl text-xs bg-white focus:outline-none font-bold"
                          >
                            <option value="DETAIL_PAGE">상세페이지 (DETAIL PAGE)</option>
                            <option value="REDESIGN">리디자인 (REDESIGN - Before/After 슬라이더 적용)</option>
                            <option value="BANNER">배너 갤러리 (BANNER)</option>
                            <option value="THREE_D">3D 렌더링 결과 (3D)</option>
                            <option value="VIDEO">영상 콘텐츠 (VIDEO)</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black tracking-widest text-[#70706B] uppercase">프로젝트 타이틀 *</label>
                          <input
                            type="text"
                            value={newItemTitle}
                            onChange={(e) => setNewItemTitle(e.target.value)}
                            placeholder="예시: 헤라 시그니처 립스틱 상세페이지"
                            className="w-full px-3 py-2.5 border border-[#E8E8E3] rounded-xl text-xs bg-white"
                            required
                          />
                        </div>
                      </div>

                      {/* CATEGORY DYNAMIC SUBFIELDS */}
                      
                      {/* Sub fields for DETAIL_PAGE or REDESIGN */}
                      {(newItemCategory === 'DETAIL_PAGE' || newItemCategory === 'REDESIGN') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black tracking-widest text-[#70706B] uppercase">서브 카피 설명 문구</label>
                            <input
                              type="text"
                              value={newItemSubtitle}
                              onChange={(e) => setNewItemSubtitle(e.target.value)}
                              placeholder="예시: 하이엔드 코스메틱 에디토리얼 상세 비주얼"
                              className="w-full px-3 py-2.5 border border-[#E8E8E3] rounded-xl text-xs bg-white"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] font-black tracking-widest text-[#70706B] uppercase">사용 툴 (쉼표로 구분)</label>
                            <input
                              type="text"
                              value={newItemTools}
                              onChange={(e) => setNewItemTools(e.target.value)}
                              placeholder="예시: Figma, Photoshop, Illustrator"
                              className="w-full px-3 py-2.5 border border-[#E8E8E3] rounded-xl text-xs bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* Detail introduction copy */}
                      {newItemCategory !== 'BANNER' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black tracking-widest text-[#70706B] uppercase">
                            {newItemCategory === 'THREE_D' ? '3D 오브젝트/모델링 부연 설명' : '프로젝트 소개 설명글 (Intro)'}
                          </label>
                          <textarea
                            rows={3}
                            value={newItemIntro}
                            onChange={(e) => setNewItemIntro(e.target.value)}
                            placeholder="예시: 이 프로젝트는 현대적 감각을 녹여낸 우아함 중심의 비주얼 개선안으로..."
                            className="w-full px-3 py-2.5 border border-[#E8E8E3] rounded-xl text-xs bg-white resize-none"
                          ></textarea>
                        </div>
                      )}

                      {/* Detail Page specific Design concept field */}
                      {newItemCategory === 'DETAIL_PAGE' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black tracking-widest text-[#70706B] uppercase">디자인 메인 컨셉 (Design Concept)</label>
                          <input
                            type="text"
                            value={newItemConcept}
                            onChange={(e) => setNewItemConcept(e.target.value)}
                            placeholder="예시: MINIMAL LUXURY & ORGANIC FLOW (미니멀 럭셔리)"
                            className="w-full px-3 py-2.5 border border-[#E8E8E3] rounded-xl text-xs bg-white"
                          />
                        </div>
                      )}

                      {/* IMAGE UPLOAD FIELD HANDLERS */}
                      <div className="bg-white p-5 rounded-2xl space-y-4 border border-[#E8E8E3]">
                        <span className="text-[11px] font-black tracking-wider text-[#1C1C1A] block">디자인 소스 및 대표 이미지 설정</span>
                        
                        {imageUploading && (
                          <div className="text-[10px] font-extrabold text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                            파일 로딩 및 압축 인코딩 진행 중... 잠시만 기다려주세요.
                          </div>
                        )}

                        {/* Custom Card Thumbnail Upload */}
                        <div className="space-y-2 border-b border-[#E8E8E3]/60 pb-4">
                          <label className="text-[10px] font-extrabold text-[#1C1C1A] block uppercase tracking-wider">
                            포트폴리오 카드 커스텀 썸네일 이미지 (선택)
                          </label>
                          <p className="text-[9px] text-[#70706B] mb-1">
                            미지정 시 프로젝트 대표 이미지가 자동으로 썸네일로 노출됩니다.
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileChange(e, setNewItemThumbnail)}
                            className="text-xs text-[#70706B] block cursor-pointer border border-[#E8E8E3] p-1.5 rounded-lg w-full bg-[#FBFBFA]"
                          />
                          {newItemThumbnail && (
                            <div className="w-24 h-16 overflow-hidden rounded border border-[#E8E8E3] bg-[#E8E8E3]/20 flex items-center justify-center relative">
                              <img src={newItemThumbnail} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setNewItemThumbnail('')}
                                className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-black"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* DETAIL PAGE: Overview long form image */}
                        {newItemCategory === 'DETAIL_PAGE' && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#70706B] block">상세페이지 전체 오버뷰 세로형 이미지 (1장) *</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, setNewItemOverviewImg)}
                              className="text-xs text-[#70706B] block cursor-pointer border border-[#E8E8E3] p-1.5 rounded-lg w-full"
                            />
                            {newItemOverviewImg && (
                              <div className="w-16 h-24 overflow-hidden rounded border border-[#E8E8E3] bg-[#E8E8E3]/20">
                                <img src={newItemOverviewImg} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* REDESIGN: Before & After comparison images */}
                        {newItemCategory === 'REDESIGN' && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-[#70706B] block">BEFORE 기존 이미지 파일 *</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, setNewItemBeforeImg)}
                                className="text-xs text-[#70706B] block cursor-pointer border border-[#E8E8E3] p-1.5 rounded-lg w-full"
                              />
                              {newItemBeforeImg && (
                                <div className="w-24 h-16 overflow-hidden rounded border border-[#E8E8E3] bg-[#E8E8E3]/20">
                                  <img src={newItemBeforeImg} alt="Before Preview" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-[#70706B] block">AFTER 리디자인 이미지 파일 *</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, setNewItemAfterImg)}
                                className="text-xs text-[#70706B] block cursor-pointer border border-[#E8E8E3] p-1.5 rounded-lg w-full"
                              />
                              {newItemAfterImg && (
                                <div className="w-24 h-16 overflow-hidden rounded border border-[#E8E8E3] bg-[#E8E8E3]/20">
                                  <img src={newItemAfterImg} alt="After Preview" className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* BANNER or 3D: Single large banner image */}
                        {(newItemCategory === 'BANNER' || newItemCategory === 'THREE_D') && (
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-[#70706B] block">대표 포트폴리오 이미지 업로드 *</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageFileChange(e, setNewItemSingleImg)}
                              className="text-xs text-[#70706B] block cursor-pointer border border-[#E8E8E3] p-1.5 rounded-lg w-full"
                            />
                            {newItemSingleImg && (
                              <div className="w-24 h-16 overflow-hidden rounded border border-[#E8E8E3] bg-[#E8E8E3]/20">
                                <img src={newItemSingleImg} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* VIDEO or THREE_D: Thumbnail and Embed URL */}
                        {(newItemCategory === 'VIDEO' || newItemCategory === 'THREE_D') && (
                          <div className="space-y-4 border-t border-[#E8E8E3]/60 pt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold text-[#1C1C1A] uppercase tracking-wider">
                                {newItemCategory === 'THREE_D' ? '3D 비디오 / 영상 연동 설정 (선택 사항)' : '비디오 소스 연동 설정'}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#70706B] block">유튜브 임베드 URL (선택)</label>
                                <input
                                  type="text"
                                  value={newItemVideoUrl && !newItemVideoUrl.startsWith('data:') ? newItemVideoUrl : ''}
                                  onChange={(e) => setNewItemVideoUrl(e.target.value)}
                                  placeholder="예시: https://www.youtube.com/embed/dQw4w9WgXcQ"
                                  className="w-full px-3 py-2 border border-[#E8E8E3] rounded-lg text-xs"
                                  disabled={newItemVideoUrl.startsWith('data:video')}
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#70706B] block">또는 컴퓨터에서 비디오 파일 업로드</label>
                                <input
                                  type="file"
                                  accept="video/*"
                                  onChange={handleVideoFileChange}
                                  className="text-xs text-[#70706B] block cursor-pointer border border-[#E8E8E3] p-1.5 rounded-lg w-full bg-[#FBFBFA]"
                                />
                                {newItemVideoUrl.startsWith('data:video') && (
                                  <div className="text-[9px] font-black text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center justify-between">
                                    <span>비디오 파일 정상 탑재 완료</span>
                                    <button
                                      type="button"
                                      onClick={() => setNewItemVideoUrl('')}
                                      className="text-red-500 hover:text-red-700 font-extrabold"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            {newItemCategory === 'VIDEO' && (
                              <div className="space-y-2">
                                <label className="text-[10px] font-bold text-[#70706B] block">영상 썸네일 대문 이미지 *</label>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageFileChange(e, setNewItemVideoThumb)}
                                  className="text-xs text-[#70706B] block cursor-pointer border border-[#E8E8E3] p-1.5 rounded-lg w-full"
                                />
                                {newItemVideoThumb && (
                                  <div className="w-24 h-16 overflow-hidden rounded border border-[#E8E8E3] bg-[#E8E8E3]/20">
                                    <img src={newItemVideoThumb} alt="Video Thumbnail" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Design Guide Color Selection with Hex codes & visual preview */}
                      {(newItemCategory === 'DETAIL_PAGE' || newItemCategory === 'REDESIGN') && (
                        <div className="bg-white p-5 rounded-2xl space-y-4 border border-[#E8E8E3]">
                          <div>
                            <span className="text-[11px] font-black tracking-wider text-[#1C1C1A] block">디자인 가이딩 컬러칩 커스텀 설정</span>
                            <p className="text-[9px] text-[#70706B] mt-0.5">상세 프로젝트 가이드 영역에 출력될 메인/서브 컬러칩을 헥스코드(#HEX)로 입력하세요.</p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                              { val: color1, set: setColor1, label: '컬러칩 #1' },
                              { val: color2, set: setColor2, label: '컬러칩 #2' },
                              { val: color3, set: setColor3, label: '컬러칩 #3' },
                              { val: color4, set: setColor4, label: '컬러칩 #4' },
                            ].map((item, idx) => (
                              <div key={idx} className="space-y-1.5">
                                <label className="text-[9px] font-bold text-[#70706B] block">{item.label}</label>
                                <div className="flex items-center space-x-1.5">
                                  <div 
                                    className="w-6 h-6 rounded-full border border-neutral-300 shadow-inner flex-shrink-0"
                                    style={{ backgroundColor: /^#[0-9A-F]{3,6}$/i.test(item.val) ? item.val : '#EEEEEE' }}
                                    title="색상 미리보기"
                                  />
                                  <input
                                    type="text"
                                    value={item.val}
                                    onChange={(e) => item.set(e.target.value)}
                                    placeholder="#FFFFFF"
                                    className="w-full px-2 py-1.5 border border-[#E8E8E3] rounded-lg text-xs font-mono"
                                    maxLength={7}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* DETAIL PAGE: Optional Highlights Builder */}
                      {newItemCategory === 'DETAIL_PAGE' && (
                        <div className="bg-white p-5 rounded-2xl space-y-4 border border-[#E8E8E3]">
                          <span className="text-[11px] font-black tracking-wider text-[#1C1C1A] block">디자인 포인트 상세 설명 칩 빌더 (최대 3개 제공)</span>
                          
                          {/* Point 1 */}
                          <div className="p-4 border border-[#E8E8E3]/70 rounded-xl space-y-3 bg-[#FBFBFA]">
                            <span className="text-[10px] font-extrabold text-[#1C1C1A]">하이라이트 포인트 #1</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={hl1Title}
                                onChange={(e) => setHl1Title(e.target.value)}
                                placeholder="포인트 제목 (예시: 에디토리얼 그리드)"
                                className="px-3 py-2 border border-[#E8E8E3] rounded-lg text-xs"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, setHl1Img)}
                                className="text-xs text-[#70706B] cursor-pointer"
                              />
                            </div>
                            <input
                              type="text"
                              value={hl1Desc}
                              onChange={(e) => setHl1Desc(e.target.value)}
                              placeholder="포인트 설명 (예시: 매거진 감성의 비대칭 황금 분할 레이아웃 배치)"
                              className="w-full px-3 py-2 border border-[#E8E8E3] rounded-lg text-xs"
                            />
                          </div>

                          {/* Point 2 */}
                          <div className="p-4 border border-[#E8E8E3]/70 rounded-xl space-y-3 bg-[#FBFBFA]">
                            <span className="text-[10px] font-extrabold text-[#1C1C1A]">하이라이트 포인트 #2</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={hl2Title}
                                onChange={(e) => setHl2Title(e.target.value)}
                                placeholder="포인트 제목"
                                className="px-3 py-2 border border-[#E8E8E3] rounded-lg text-xs"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, setHl2Img)}
                                className="text-xs text-[#70706B] cursor-pointer"
                              />
                            </div>
                            <input
                              type="text"
                              value={hl2Desc}
                              onChange={(e) => setHl2Desc(e.target.value)}
                              placeholder="포인트 설명"
                              className="w-full px-3 py-2 border border-[#E8E8E3] rounded-lg text-xs"
                            />
                          </div>

                          {/* Point 3 */}
                          <div className="p-4 border border-[#E8E8E3]/70 rounded-xl space-y-3 bg-[#FBFBFA]">
                            <span className="text-[10px] font-extrabold text-[#1C1C1A]">하이라이트 포인트 #3</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={hl3Title}
                                onChange={(e) => setHl3Title(e.target.value)}
                                placeholder="포인트 제목"
                                className="px-3 py-2 border border-[#E8E8E3] rounded-lg text-xs"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageFileChange(e, setHl3Img)}
                                className="text-xs text-[#70706B] cursor-pointer"
                              />
                            </div>
                            <input
                              type="text"
                              value={hl3Desc}
                              onChange={(e) => setHl3Desc(e.target.value)}
                              placeholder="포인트 설명"
                              className="w-full px-3 py-2 border border-[#E8E8E3] rounded-lg text-xs"
                            />
                          </div>
                        </div>
                      )}

                      {/* Submit */}
                      <div className="flex justify-end space-x-3 pt-3 border-t border-[#E8E8E3]">
                        <button
                          type="button"
                          onClick={() => { setShowAddItemForm(false); setEditingId(null); }}
                          className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-[#1C1C1A] text-xs font-bold rounded-xl"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          disabled={imageUploading}
                          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center space-x-2 shadow-md cursor-pointer disabled:bg-neutral-300"
                        >
                          <Save size={13} />
                          <span>{editingId ? 'SAVE CHANGES (수정 내용 저장)' : 'PUBLISH WORK (업로드 발행)'}</span>
                        </button>
                      </div>

                    </form>
                  )}

                  {/* 3-B. List of uploaded items */}
                  <div className="space-y-4">
                    <span className="text-[11px] font-black tracking-widest text-[#70706B] block">현재 업로드 완료된 작업물 리스트 ({portfolioItems.length}개)</span>
                    
                    <div className="space-y-3">
                      {portfolioItems.map((item, index) => (
                        <div key={item.id} className="bg-white border border-[#E8E8E3] p-4 rounded-xl flex items-center justify-between shadow-sm">
                          <div className="flex items-center space-x-4">
                            {/* Reorder Controls */}
                            <div className="flex flex-col -space-y-0.5 bg-neutral-50 border border-[#E8E8E3] rounded-lg p-0.5">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => handleMoveItem(index, 'up')}
                                className="p-1 hover:bg-neutral-200 disabled:opacity-25 disabled:pointer-events-none rounded text-[#1C1C1A] transition-colors cursor-pointer"
                                title="위로 이동"
                              >
                                <ChevronUp size={13} />
                              </button>
                              <button
                                type="button"
                                disabled={index === portfolioItems.length - 1}
                                onClick={() => handleMoveItem(index, 'down')}
                                className="p-1 hover:bg-neutral-200 disabled:opacity-25 disabled:pointer-events-none rounded text-[#1C1C1A] transition-colors cursor-pointer"
                                title="아래로 이동"
                              >
                                <ChevronDown size={13} />
                              </button>
                            </div>

                            <div className="w-12 h-12 rounded bg-[#E8E8E3] overflow-hidden flex-shrink-0">
                              <img
                                src={item.category === 'VIDEO' ? (item as VideoItem).thumbnail : (item as any).image || (item as any).overviewImage}
                                alt="Thumb"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <span className="bg-neutral-100 text-[#70706B] text-[8px] font-black px-2 py-0.5 rounded tracking-wider block w-max mb-1">
                                {item.category === 'THREE_D' ? '3D' : item.category.replace('_', ' ')}
                              </span>
                              <h5 className="text-xs font-bold text-[#1C1C1A] line-clamp-1">{item.title}</h5>
                            </div>
                          </div>

                           <div className="flex space-x-1 items-center">
                            {deleteConfirmId === item.id ? (
                              <div className="flex items-center space-x-1 bg-red-50 p-1 rounded-lg border border-red-200 animate-fade-in">
                                <span className="text-[9px] font-black text-red-700 px-1 uppercase tracking-tighter">정말 삭제?</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePortfolioItem(item.id)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black rounded cursor-pointer"
                                >
                                  삭제
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 text-[#1C1C1A] text-[9px] font-black rounded cursor-pointer"
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(item)}
                                  className="p-1.5 hover:bg-neutral-100 text-[#1C1C1A] rounded-lg transition-colors cursor-pointer"
                                  title="작업물 수정하기"
                                >
                                  <Edit3 size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(item.id)}
                                  className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                                  title="작업물 완전 삭제"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: CLIENT MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E8E3] pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-black text-[#1C1C1A] tracking-wider uppercase">고객 제안 및 간편 문의 내역</h4>
                      <p className="text-[10px] text-[#70706B]">사이트 방문 고객이 남긴 실시간 기획의뢰 메시지 내역을 관리 및 열람합니다.</p>
                    </div>

                    {messages.length > 0 && (
                      <button
                        onClick={onClearMessages}
                        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black tracking-widest uppercase rounded-full shadow-sm cursor-pointer"
                      >
                        전체 비우기
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className="bg-white border border-[#E8E8E3] p-5 rounded-2xl shadow-sm space-y-3 relative">
                        <button
                          onClick={() => onDeleteMessage(msg.id)}
                          className="absolute top-4 right-4 p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="메시지 삭제"
                        >
                          <Trash2 size={13} />
                        </button>
                        
                        <div className="flex flex-wrap items-center space-x-3 text-[10px] border-b border-[#E8E8E3] pb-2">
                          <span className="font-extrabold text-[#1C1C1A]">성함: {msg.senderName}</span>
                          <span className="text-[#E8E8E3]">|</span>
                          <span className="font-bold text-[#70706B]">연락처: {msg.senderContact}</span>
                          <span className="text-[#E8E8E3]">|</span>
                          <span className="text-[#70706B]">시간: {new Date(msg.createdAt).toLocaleString()}</span>
                        </div>

                        <p className="text-xs text-[#1C1C1A] leading-relaxed whitespace-pre-wrap pt-1 bg-neutral-50 p-4 rounded-xl">
                          {msg.messageText}
                        </p>
                      </div>
                    ))}

                    {messages.length === 0 && (
                      <div className="text-center py-16 bg-white border border-dashed border-[#E8E8E3] rounded-2xl text-xs text-[#70706B]">
                        현재 보관 중인 문의 메시지가 없습니다.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CERTIFICATES & LICENSES */}
              {activeTab === 'certificates' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E8E3] pb-3">
                    <h4 className="text-sm font-black text-[#1C1C1A] tracking-wider uppercase">자격증 및 라이선스 정보 관리</h4>
                    <p className="text-[10px] text-[#70706B]">이력서 페이지 및 어바웃미 영역에 표기되는 공인 자격증 목록을 실시간 추가/수정/삭제합니다.</p>
                  </div>

                  {/* Add New Certificate Form */}
                  <div className="bg-neutral-50 border border-[#E8E8E3] p-5 rounded-2xl space-y-4">
                    <h5 className="text-[11px] font-extrabold tracking-wider text-[#1C1C1A] uppercase flex items-center space-x-1">
                      <Plus size={14} />
                      <span>새 자격증 추가하기</span>
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black tracking-widest text-[#70706B]">자격증/면허 명칭</label>
                        <input
                          type="text"
                          value={newCertName}
                          onChange={(e) => setNewCertName(e.target.value)}
                          placeholder="예: 컬러리스트산업기사"
                          className="w-full px-3 py-2 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black tracking-widest text-[#70706B]">취득 일자</label>
                        <input
                          type="text"
                          value={newCertDate}
                          onChange={(e) => setNewCertDate(e.target.value)}
                          placeholder="예: 2022.09"
                          className="w-full px-3 py-2 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black tracking-widest text-[#70706B]">발행 기관</label>
                        <input
                          type="text"
                          value={newCertIssuer}
                          onChange={(e) => setNewCertIssuer(e.target.value)}
                          placeholder="예: 한국산업인력공단"
                          className="w-full px-3 py-2 border border-[#E8E8E3] rounded-xl text-xs focus:border-[#1C1C1A]"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newCertName || !newCertDate || !newCertIssuer) {
                          alert('자격증 명칭, 취득일자, 발행기관을 모두 채워주세요.');
                          return;
                        }
                        const newItem = {
                          id: 'cert-' + Date.now(),
                          name: newCertName,
                          date: newCertDate,
                          issuer: newCertIssuer
                        };
                        setCertsList((prev) => [...prev, newItem]);
                        setNewCertName('');
                        setNewCertDate('');
                        setNewCertIssuer('');
                      }}
                      className="px-4 py-2 bg-[#1C1C1A] hover:bg-[#1C1C1A]/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>목록에 임시 추가</span>
                    </button>
                  </div>

                  {/* Existing Certificates List */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black tracking-widest text-[#70706B] block">현재 저장된 자격증 리스트 ({certsList.length}개)</label>
                    
                    <div className="space-y-3">
                      {certsList.map((cert, index) => (
                        <div key={cert.id} className="bg-white border border-[#E8E8E3] p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                            <div>
                              <span className="text-[9px] font-extrabold text-[#70706B] block uppercase">자격증 이름</span>
                              <input
                                type="text"
                                value={cert.name}
                                onChange={(e) => {
                                  const updated = [...certsList];
                                  updated[index].name = e.target.value;
                                  setCertsList(updated);
                                }}
                                className="w-full px-3 py-1.5 border border-[#E8E8E3] rounded-lg text-xs mt-0.5"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] font-extrabold text-[#70706B] block uppercase">취득 일자</span>
                              <input
                                type="text"
                                value={cert.date}
                                onChange={(e) => {
                                  const updated = [...certsList];
                                  updated[index].date = e.target.value;
                                  setCertsList(updated);
                                }}
                                className="w-full px-3 py-1.5 border border-[#E8E8E3] rounded-lg text-xs mt-0.5"
                              />
                            </div>
                            <div>
                              <span className="text-[9px] font-extrabold text-[#70706B] block uppercase">발행 기관</span>
                              <input
                                type="text"
                                value={cert.issuer}
                                onChange={(e) => {
                                  const updated = [...certsList];
                                  updated[index].issuer = e.target.value;
                                  setCertsList(updated);
                                }}
                                className="w-full px-3 py-1.5 border border-[#E8E8E3] rounded-lg text-xs mt-0.5"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 self-end sm:self-center">
                            {deleteCertConfirmId === cert.id ? (
                              <div className="flex items-center space-x-1.5 bg-red-50 border border-red-200 p-1 rounded-lg animate-fade-in">
                                <span className="text-[8px] font-extrabold text-red-700 px-1 uppercase">정말 삭제?</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCertsList((prev) => prev.filter((c) => c.id !== cert.id));
                                    setDeleteCertConfirmId(null);
                                  }}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[9px] font-black rounded cursor-pointer"
                                >
                                  확인
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeleteCertConfirmId(null)}
                                  className="px-2 py-1 bg-neutral-200 hover:bg-neutral-300 text-[#1C1C1A] text-[9px] font-black rounded cursor-pointer"
                                >
                                  취소
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeleteCertConfirmId(cert.id)}
                                className="p-2 text-[#70706B] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="자격증 삭제"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {certsList.length === 0 && (
                        <div className="text-center py-12 bg-white border border-dashed border-[#E8E8E3] rounded-xl text-xs text-[#70706B]">
                          현재 추가된 자격증이 없습니다. 위의 입력창에서 새로운 자격증을 등록해주세요.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4 border-t border-[#E8E8E3] flex justify-end">
                    <button
                      onClick={() => {
                        onSaveConfig({
                          ...config,
                          certificates: certsList
                        });
                        alert('자격증 목록이 사이트에 성공적으로 영구 저장되었습니다!');
                      }}
                      className="px-6 py-3 bg-[#1C1C1A] text-white text-xs font-bold tracking-widest uppercase rounded-xl flex items-center space-x-2 cursor-pointer shadow-md hover:bg-[#1C1C1A]/90"
                    >
                      <Save size={13} />
                      <span>SAVE CERTIFICATES (자격증 정보 영구 저장)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: BACKUP & RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div className="border-b border-[#E8E8E3] pb-3">
                    <h4 className="text-sm font-black text-[#1C1C1A] tracking-wider uppercase">포트폴리오 백업 데이터 다운로드 및 완전 복원</h4>
                    <p className="text-[10px] text-[#70706B]">브라우저를 변경하거나 쿠키 삭제 시 데이터 손실을 방지하기 위해 파일로 다운로드합니다.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* EXPORT DOCK */}
                    <div className="bg-white border border-[#E8E8E3] p-6 rounded-2xl shadow-sm space-y-4">
                      <div className="flex items-center space-x-2">
                        <Download size={18} className="text-[#1C1C1A]" />
                        <h5 className="text-xs font-black text-[#1C1C1A]">내 컴퓨터로 백업 파일 내보내기</h5>
                      </div>
                      <p className="text-[11px] text-[#70706B] leading-relaxed">
                        내가 등록한 모든 상세페이지 문구, 새 기술 게이지바, 그리고 <strong>직접 업로드한 이미지 소스 파일 전체(Base64 고화질 코딩 인코딩)</strong>가 단 하나의 JSON 파일로 백업됩니다.
                      </p>
                      <button
                        onClick={handleExportBackup}
                        className="w-full py-3.5 bg-[#1C1C1A] text-white text-xs font-bold tracking-widest uppercase rounded-xl shadow-md cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <Download size={13} />
                        <span>DOWNLOAD PORTFOLIO BACKUP</span>
                      </button>
                    </div>

                    {/* IMPORT DOCK */}
                    <div className="bg-white border border-[#E8E8E3] p-6 rounded-2xl shadow-sm space-y-4">
                      <div className="flex items-center space-x-2">
                        <Upload size={18} className="text-[#1C1C1A]" />
                        <h5 className="text-xs font-black text-[#1C1C1A]">백업 파일 불러와서 데이터 복원하기</h5>
                      </div>
                      <p className="text-[11px] text-[#70706B] leading-relaxed">
                        기존 컴퓨터 혹은 다른 브라우저에서 다운로드받은 포트폴리오 백업 JSON 파일을 올리시면, 사이트 전체가 그 즉시 과거 상태로 완벽히 복원됩니다.
                      </p>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="text-xs text-[#70706B] cursor-pointer border border-[#E8E8E3] p-2 rounded-xl w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start space-x-2.5">
                    <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-amber-800 uppercase block">경고 조항 (DATA NOTICE)</span>
                      <p className="text-[10px] text-amber-800 leading-relaxed">
                        데이터 복원 파일을 올리면 현재 로컬 브라우저의 변경사항들이 전부 지워지고 백업 당시의 내용으로 전면 덮어쓰기됩니다. 중요한 내역은 미리 다운로드받아 두세요.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </div>

          {/* Bottom Dialog Action Panel */}
          <div className="bg-neutral-100 border-t border-[#E8E8E3] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-[10px] font-bold text-[#70706B] uppercase">
              <HelpCircle size={12} />
              <span>PIN: 1234로 보호 중 | 브라우저 캐시 저장 완료</span>
            </div>
            
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#1C1C1A] text-white hover:bg-[#1C1C1A]/90 text-xs font-black tracking-widest uppercase rounded-full cursor-pointer transition-colors"
            >
              종료 (CLOSE CMS)
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
