import React, { useState, useRef, useEffect } from 'react';
import { PortfolioItem, PortfolioCategory, DetailPageItem, RedesignItem, BannerItem, ThreeDItem, VideoItem } from '../types';
import { Eye, Layers, Image, Video, Box, ChevronRight, X, Play, Volume2, Monitor, Smartphone } from 'lucide-react';

const getToolIcon = (toolName: string) => {
  const name = toolName.toLowerCase().trim();
  if (name.includes('figma')) {
    return (
      <div className="flex items-center space-x-1.5 bg-[#1C1C1A] border border-white/10 text-[10px] font-extrabold text-white px-2 py-1 rounded shadow-sm inline-flex" title="Figma">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-green-400"></span>
        <span className="font-sans text-[9px]">Fg</span>
      </div>
    );
  }
  if (name.includes('photoshop') || name === 'ps') {
    return (
      <div className="flex items-center space-x-1.5 bg-[#001C33] border border-[#005B8C] text-[#00C8FF] text-[10px] font-extrabold px-2 py-1 rounded shadow-sm inline-flex" title="Photoshop">
        <span className="inline-block w-2.5 h-2.5 rounded bg-[#00C8FF]"></span>
        <span className="font-sans text-[9px]">Ps</span>
      </div>
    );
  }
  if (name.includes('illustrator') || name === 'ai') {
    return (
      <div className="flex items-center space-x-1.5 bg-[#261300] border border-[#E68A00] text-[#FF9A00] text-[10px] font-extrabold px-2 py-1 rounded shadow-sm inline-flex" title="Illustrator">
        <span className="inline-block w-2.5 h-2.5 rounded bg-[#FF9A00]"></span>
        <span className="font-sans text-[9px]">Ai</span>
      </div>
    );
  }
  if (name.includes('premiere') || name === 'pr') {
    return (
      <div className="flex items-center space-x-1.5 bg-[#1A002E] border border-[#A64DFF] text-[#EA77FF] text-[10px] font-extrabold px-2 py-1 rounded shadow-sm inline-flex" title="Premiere Pro">
        <span className="inline-block w-2.5 h-2.5 rounded bg-[#EA77FF]"></span>
        <span className="font-sans text-[9px]">Pr</span>
      </div>
    );
  }
  if (name.includes('after') || name.includes('effects') || name === 'ae') {
    return (
      <div className="flex items-center space-x-1.5 bg-[#12002E] border border-[#804DFF] text-[#CCAAFF] text-[10px] font-extrabold px-2 py-1 rounded shadow-sm inline-flex" title="After Effects">
        <span className="inline-block w-2.5 h-2.5 rounded bg-[#CCAAFF]"></span>
        <span className="font-sans text-[9px]">Ae</span>
      </div>
    );
  }
  if (name.includes('cinema') || name.includes('c4d')) {
    return (
      <div className="flex items-center space-x-1.5 bg-[#051124] border border-[#2B73EB] text-[#5AA0FF] text-[10px] font-extrabold px-2 py-1 rounded shadow-sm inline-flex" title="Cinema 4D">
        <span className="inline-block w-2.5 h-2.5 rounded bg-[#5AA0FF]"></span>
        <span className="font-sans text-[9px]">C4D</span>
      </div>
    );
  }
  if (name.includes('blender') || name === 'bl') {
    return (
      <div className="flex items-center space-x-1.5 bg-[#241304] border border-[#D16900] text-[#FF9E15] text-[10px] font-extrabold px-2 py-1 rounded shadow-sm inline-flex" title="Blender">
        <span className="inline-block w-2.5 h-2.5 rounded bg-[#FF9E15]"></span>
        <span className="font-sans text-[9px]">Bl</span>
      </div>
    );
  }
  // Fallback
  return (
    <div className="flex items-center bg-[#F5F5F2] border border-[#D5D5CF] text-[#70706B] text-[10px] font-extrabold px-2.5 py-1 rounded shadow-sm uppercase inline-flex">
      <span className="font-mono text-[9px]">{toolName.trim()}</span>
    </div>
  );
};

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  
  let videoId = '';
  try {
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/v/')) {
      videoId = url.split('youtube.com/v/')[1]?.split('?')[0] || '';
    }
  } catch (err) {
    console.error('Failed to parse youtube url', err);
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : url;
};

interface PortfolioProps {
  items: PortfolioItem[];
}

export default function Portfolio({ items }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<PortfolioCategory | 'ALL'>('ALL');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  
  // States for Detail Page Modal Tab (overview, highlight)
  const [detailTab, setDetailTab] = useState<'overview' | 'highlight'>('overview');
  const [redesignTab, setRedesignTab] = useState<'slider' | 'full'>('slider');
  
  // Before / After Slider Position State (0 to 100)
  const [sliderPos, setSliderPos] = useState(50);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Filter items based on active category
  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const categories: { key: PortfolioCategory | 'ALL'; label: string; icon: React.ReactNode }[] = [
    { key: 'ALL', label: 'ALL', icon: <Layers size={13} /> },
    { key: 'DETAIL_PAGE', label: 'DETAIL PAGE', icon: <Layers size={13} /> },
    { key: 'REDESIGN', label: 'REDESIGN', icon: <Layers size={13} /> },
    { key: 'BANNER', label: 'BANNER', icon: <Image size={13} /> },
    { key: 'THREE_D', label: '3D RENDER', icon: <Box size={13} /> },
    { key: 'VIDEO', label: 'VIDEO', icon: <Video size={13} /> },
  ];

  // Before/After drag event handlers
  const handleMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleMouseUp);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);
  };

  // Reset states when modal changes
  useEffect(() => {
    setDetailTab('overview');
    setRedesignTab('slider');
    setSliderPos(50);
    setPlayingVideoId(null);
  }, [activeItem]);

  return (
    <section id="portfolio" className="py-24 bg-[#F5F5F2] border-t border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
          <div className="space-y-3">
            <span className="text-xs font-extrabold tracking-[0.4em] text-[#70706B] uppercase block">
              VISUAL WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1A] tracking-tight uppercase">
              CREATIVE PORTFOLIO
            </h2>
          </div>
          <p className="text-xs text-[#70706B] font-bold tracking-widest uppercase">
            {filteredItems.length} ITEMS SHOWN
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2.5 border-b border-[#E8E8E3] pb-6 mb-10 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-[11px] font-extrabold tracking-widest cursor-pointer border transition-all ${
                selectedCategory === cat.key
                  ? 'bg-[#1C1C1A] border-[#1C1C1A] text-white shadow-md'
                  : 'bg-white border-[#E8E8E3] text-[#70706B] hover:text-[#1C1C1A] hover:border-[#1C1C1A]'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const isVideo = item.category === 'VIDEO';
            const isThreeD = item.category === 'THREE_D';
            const videoUrl = isVideo ? (item as VideoItem).videoUrl : (item as any).videoUrl;
            const isDirectVideo = (isVideo || isThreeD) && videoUrl && !videoUrl.includes('youtube') && !videoUrl.includes('youtu.be');
            const isHovered = hoveredItemId === item.id;
            const thumbnailSrc = item.thumbnail || (isVideo ? (item as VideoItem).thumbnail : (item as any).image || (item as any).overviewImage);
            const isGif = (item as any).image?.toLowerCase().includes('.gif') || (item as any).thumbnail?.toLowerCase().includes('.gif');
            const displayImage = (isHovered && isGif) ? ((item as any).image || thumbnailSrc) : thumbnailSrc;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#E8E8E3] hover:border-[#1C1C1A] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between isolate transform-gpu"
              >
                {/* Visual Thumbnail */}
                <div 
                  className="relative aspect-[4/3] bg-[#E8E8E3] overflow-hidden rounded-t-2xl cursor-pointer isolate transform-gpu"
                  onClick={() => {
                    if (isVideo) {
                      setPlayingVideoId(playingVideoId === item.id ? null : item.id);
                    } else {
                      setActiveItem(item);
                    }
                  }}
                >
                  {isVideo && playingVideoId === item.id ? (
                    (item as VideoItem).videoUrl.includes('youtube') || (item as VideoItem).videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={getEmbedUrl((item as VideoItem).videoUrl)}
                        title={item.title}
                        className="w-full h-full bg-black border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <video
                        src={(item as VideoItem).videoUrl}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover bg-black"
                        onClick={(e) => e.stopPropagation()}
                      />
                    )
                  ) : isHovered && isDirectVideo ? (
                    <video
                      src={videoUrl}
                      muted
                      loop
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover bg-black"
                    />
                  ) : (
                    <>
                      <img
                        src={displayImage}
                        alt={item.title}
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                      
                      {/* Category Pill Tag */}
                      <div className="absolute top-4 left-4 bg-[#1C1C1A]/90 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-full text-[9px] font-black text-white tracking-widest uppercase">
                        {item.category === 'THREE_D' ? '3D' : item.category.replace('_', ' ')}
                      </div>

                      {/* Play or view icons */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35 z-10">
                        <div className="w-12 h-12 rounded-full bg-white text-[#1C1C1A] flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-500">
                          {isVideo ? <Play size={18} className="fill-current ml-0.5" /> : <Eye size={18} />}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Info block */}
                <div 
                  onClick={() => setActiveItem(item)}
                  className="p-6 space-y-2 cursor-pointer flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-[#1C1C1A] tracking-tight group-hover:text-[#70706B] transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#70706B] font-medium leading-relaxed line-clamp-2">
                      {(item as any).subtitle || (item as any).description || '비주얼 아웃풋 포트폴리오'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty placeholder */}
        {filteredItems.length === 0 && (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-[#E8E8E3] space-y-4">
            <span className="text-sm text-[#70706B] block">선택한 카테고리에 업로드된 작업물이 없습니다.</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* PORTFOLIO DETAILED POPUP MODAL SCREEN */}
        {/* ======================================================== */}
        {activeItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1C1A]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
            <div className="bg-[#FBFBFA] w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] flex flex-col animate-fade-in relative">
              
              {/* Modal Top Header (Sticky) */}
              <div className="flex items-center justify-between border-b border-[#E8E8E3] px-6 py-5 bg-[#FBFBFA] z-20">
                <div className="flex items-center space-x-3">
                  <span className="bg-[#1C1C1A] text-white text-[9px] font-black px-2.5 py-1 rounded-full tracking-widest uppercase">
                    {activeItem.category === 'THREE_D' ? '3D' : activeItem.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-extrabold text-[#70706B] uppercase tracking-wider hidden sm:inline">
                    Interactive Portfolio Viewer
                  </span>
                </div>
                <button
                  onClick={() => setActiveItem(null)}
                  className="p-1.5 rounded-full hover:bg-[#E8E8E3]/50 text-[#1C1C1A] transition-colors cursor-pointer"
                  title="닫기"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Inner Scroll Area */}
              <div className="overflow-y-auto flex-1 p-6 md:p-10 space-y-8">
                
                {/* 1. DETAIL PAGE MODAL TEMPLATE */}
                {activeItem.category === 'DETAIL_PAGE' && (
                  <div className="space-y-10">
                    {/* Design Guide Banner */}
                    <div className="bg-[#1C1C1A] text-white p-6 md:p-8 rounded-2xl space-y-6 relative overflow-hidden">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold text-white/50 tracking-[0.3em] uppercase block">PROJECT GUIDELINES</span>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tight">{(activeItem as DetailPageItem).title}</h3>
                        <p className="text-xs sm:text-sm text-white/70">{(activeItem as DetailPageItem).subtitle}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
                        <div>
                          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-1">PROJECT INTRO</span>
                          <p className="text-xs text-white/80 leading-relaxed">{(activeItem as DetailPageItem).projectIntro}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-2.5">USED TOOLS</span>
                          <div className="flex flex-wrap gap-1.5">
                            {(activeItem as DetailPageItem).tools.map((tool, idx) => (
                              <React.Fragment key={idx}>
                                {getToolIcon(tool)}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest block mb-1.5">CONCEPT &amp; COLOR GUIDE</span>
                          <p className="text-xs text-[#E6C9A8] font-bold leading-relaxed mb-3">{(activeItem as DetailPageItem).concept}</p>
                          {((activeItem as any).colors?.length > 0) && (
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 mt-2">
                              {(activeItem as any).colors.map((color: string, idx: number) => (
                                <div key={idx} className="flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-full shadow-sm">
                                  <div 
                                    className="w-3.5 h-3.5 rounded-full border border-white/25 shadow-md flex-shrink-0 animate-fade-in"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                  <span className="text-[8.5px] font-mono font-bold text-white/85">{color}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Tab Selectors */}
                    <div className="flex justify-center border-b border-[#E8E8E3] pb-4">
                      <div className="bg-[#E8E8E3]/50 p-1 rounded-full flex flex-wrap items-center justify-center gap-1">
                        <button
                          onClick={() => setDetailTab('overview')}
                          className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all cursor-pointer ${
                            detailTab === 'overview'
                              ? 'bg-[#1C1C1A] text-white shadow-md'
                              : 'text-[#70706B] hover:text-[#1C1C1A]'
                          }`}
                        >
                          TAB 1. PREVIEW (전체 원본 보기)
                        </button>
                        <button
                          onClick={() => setDetailTab('highlight')}
                          className={`px-6 py-2 rounded-full text-xs font-black tracking-widest transition-all cursor-pointer ${
                            detailTab === 'highlight'
                              ? 'bg-[#1C1C1A] text-white shadow-md'
                              : 'text-[#70706B] hover:text-[#1C1C1A]'
                          }`}
                        >
                          TAB 2. HIGHLIGHT (핵심 포인트 가이드)
                        </button>
                      </div>
                    </div>

                    {/* Tab Contents */}
                    {detailTab === 'overview' && (
                      <div className="space-y-4 animate-fade-in">
                        <div className="text-center">
                          <p className="text-[11px] font-bold text-[#70706B] tracking-widest uppercase">FULL SIZE HIGH-FIDELITY DESIGN SCROLL</p>
                          <span className="text-[10px] text-[#70706B]/70">(스크롤하여 왜곡 없는 원래 비율 그대로의 디자인 원본 전체를 감상해보세요)</span>
                        </div>
                        {/* Scroll Frame Viewport with natural aspect ratio */}
                        <div className="w-full max-w-3xl mx-auto border border-[#E8E8E3] rounded-2xl overflow-hidden shadow-xl bg-white max-h-[85vh] overflow-y-auto">
                          <img
                            src={(activeItem as DetailPageItem).overviewImage}
                            alt="Full Original Layout"
                            className="w-full h-auto block"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                    )}

                    {detailTab === 'highlight' && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="text-center space-y-1">
                          <p className="text-[11px] font-bold text-[#70706B] tracking-widest uppercase">DESIGN DECISIONS &amp; POINT HIGHLIGHTS</p>
                          <span className="text-[10px] text-[#70706B]/70 block font-medium">*(각 카드의 이미지 영역을 마우스 스크롤하시면 세로형 디자인 원본 전체를 왜곡 없이 감상하실 수 있습니다)</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {(activeItem as DetailPageItem).highlights.map((hl) => (
                            <div key={hl.id} className="bg-white border border-[#E8E8E3] rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                              <div className="h-[280px] sm:h-[350px] overflow-y-auto bg-[#1C1C1A] relative group/scroll">
                                <img
                                  src={hl.image}
                                  alt={hl.title}
                                  className="w-full h-auto block"
                                  referrerPolicy="no-referrer"
                                />
                                {/* Soft indicator overlay at the bottom that fades on hover */}
                                <div className="absolute bottom-2 right-2 bg-black/60 text-[9px] text-white px-2 py-0.5 rounded backdrop-blur-sm pointer-events-none opacity-80 group-hover/scroll:opacity-0 transition-opacity duration-300 font-mono">
                                  SCROLL ↕
                                </div>
                              </div>
                              <div className="p-5 space-y-2">
                                <h4 className="text-xs font-black text-[#1C1C1A] tracking-tight uppercase border-b border-[#E8E8E3] pb-2">
                                  {hl.title}
                                </h4>
                                <p className="text-[11px] text-[#70706B] leading-relaxed">
                                  {hl.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                 {/* 2. REDESIGN MODAL TEMPLATE */}
                 {activeItem.category === 'REDESIGN' && (
                   <div className="space-y-8 animate-fade-in">
                     {/* Header Details */}
                     <div className="space-y-4">
                       <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                         <div className="space-y-1.5">
                           <h3 className="text-xl sm:text-2xl font-black text-[#1C1C1A] tracking-tight">{(activeItem as RedesignItem).title}</h3>
                           <p className="text-xs text-[#70706B]">{(activeItem as RedesignItem).subtitle}</p>
                         </div>
                         <div className="flex flex-wrap gap-1.5">
                           {(activeItem as RedesignItem).tools.map((tool, idx) => (
                             <React.Fragment key={idx}>
                               {getToolIcon(tool)}
                             </React.Fragment>
                           ))}
                         </div>
                       </div>
                       
                       <p className="text-xs text-[#70706B] leading-relaxed max-w-3xl pt-1">
                         {(activeItem as RedesignItem).projectIntro}
                       </p>

                       {((activeItem as any).colors?.length > 0) && (
                         <div className="pt-3 border-t border-[#E8E8E3] w-max">
                           <span className="text-[9px] font-bold text-[#70706B] uppercase tracking-widest block mb-2">BRAND COLOR GUIDE</span>
                           <div className="flex flex-wrap gap-2">
                             {(activeItem as any).colors.map((color: string, idx: number) => (
                               <div key={idx} className="flex items-center space-x-1.5 bg-white border border-[#E8E8E3] px-2.5 py-1 rounded-full shadow-sm">
                                 <div 
                                   className="w-3.5 h-3.5 rounded-full border border-neutral-200"
                                   style={{ backgroundColor: color }}
                                 />
                                 <span className="text-[8.5px] font-mono font-bold text-[#1C1C1A]">{color}</span>
                               </div>
                             ))}
                           </div>
                         </div>
                       )}
                     </div>

                                          <div className="space-y-6 animate-fade-in">
                       <div className="text-center">
                         <p className="text-[11px] font-bold text-[#70706B] tracking-widest uppercase font-mono">REDESIGN HIGH-FIDELITY COMPARISON</p>
                         <span className="text-[10px] text-[#70706B]/70">(기존 디자인과 리디자인 전체 원본을 왜곡 없이 아래로 길게 스크롤하여 세밀하게 확인하실 수 있습니다)</span>
                       </div>
                       <div className="rounded-2xl border border-[#E8E8E3] bg-white p-4 md:p-6 space-y-10 shadow-sm">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {/* Before Image */}
                           <div className="space-y-3">
                             <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-2">
                               <span className="text-xs font-black text-[#70706B] tracking-wider">BEFORE (기존안)</span>
                               <span className="bg-red-50 text-red-600 text-[9px] font-extrabold px-2.5 py-1 rounded border border-red-100 uppercase tracking-widest">OLD DESIGN</span>
                             </div>
                             <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 shadow-md max-h-[75vh] overflow-y-auto scrollbar-thin">
                               <img src={(activeItem as RedesignItem).beforeImage} alt="Before full" className="w-full h-auto block" referrerPolicy="no-referrer" />
                             </div>
                           </div>

                           {/* After Image */}
                           <div className="space-y-3">
                             <div className="flex items-center justify-between border-b border-[#E8E8E3] pb-2">
                               <span className="text-xs font-black text-[#1C1C1A] tracking-wider">AFTER REDESIGN (개선안)</span>
                               <span className="bg-emerald-50 text-emerald-700 text-[9px] font-extrabold px-2.5 py-1 rounded border border-emerald-100 uppercase tracking-widest">NEW CREATIVE</span>
                             </div>
                             <div className="border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50 shadow-md max-h-[75vh] overflow-y-auto scrollbar-thin">
                               <img src={(activeItem as RedesignItem).afterImage} alt="After full" className="w-full h-auto block" referrerPolicy="no-referrer" />
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                    </div>
                  )}

                {/* 3. BANNER MODAL TEMPLATE */}
                {activeItem.category === 'BANNER' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-[#1C1C1A]">{(activeItem as BannerItem).title}</h3>
                      <p className="text-xs text-[#70706B]">포커스형 비주얼 결과물 위주의 갤러리 컷</p>
                    </div>

                    <div className="border border-[#E8E8E3] rounded-2xl overflow-hidden bg-white shadow-lg max-h-[75vh] overflow-y-auto scrollbar-thin">
                      <img
                        src={(activeItem as BannerItem).image}
                        alt={(activeItem as BannerItem).title}
                        className="w-full h-auto block object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                )}

                {/* 4. THREE_D MODAL TEMPLATE */}
                {activeItem.category === 'THREE_D' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-[#1C1C1A]">{(activeItem as ThreeDItem).title}</h3>
                      <p className="text-xs text-[#70706B]">{(activeItem as ThreeDItem).description || '시네마 4D 및 블렌더 피지컬 오브젝트 시각화'}</p>
                    </div>

                    <div className="border border-[#E8E8E3] rounded-2xl overflow-hidden bg-[#1C1C1A] shadow-xl relative">
                      {(activeItem as ThreeDItem).videoUrl ? (
                        (activeItem as ThreeDItem).videoUrl!.includes('youtube') || (activeItem as ThreeDItem).videoUrl!.includes('youtu.be') ? (
                          <div className="aspect-video w-full bg-black">
                            <iframe
                              src={getEmbedUrl((activeItem as ThreeDItem).videoUrl!)}
                              title={(activeItem as ThreeDItem).title}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        ) : (
                          <div className="aspect-video w-full bg-black flex items-center justify-center">
                            <video
                              src={(activeItem as ThreeDItem).videoUrl}
                              controls
                              autoPlay
                              loop
                              playsInline
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )
                      ) : (
                        <div className="max-h-[75vh] overflow-y-auto scrollbar-thin">
                          <img
                            src={(activeItem as ThreeDItem).image}
                            alt={(activeItem as ThreeDItem).title}
                            className="w-full h-auto block object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. VIDEO MODAL TEMPLATE */}
                {activeItem.category === 'VIDEO' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-[#1C1C1A]">{(activeItem as VideoItem).title}</h3>
                      <p className="text-xs text-[#70706B]">{(activeItem as VideoItem).description || '춘성스튜디오 감성 비주얼 모션 크리에이션'}</p>
                    </div>

                    {/* Playback Container */}
                    <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 relative flex items-center justify-center">
                      {(activeItem as VideoItem).videoUrl.includes('youtube') ? (
                        <iframe
                          src={(activeItem as VideoItem).videoUrl}
                          title={(activeItem as VideoItem).title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        // Customized Simulated Cinema Player
                        <div className="w-full h-full relative flex flex-col justify-between p-6 bg-gradient-to-br from-[#121E12] to-[#0A0D0A]">
                          <div className="flex items-center justify-between text-white/50 text-[10px] tracking-widest font-black uppercase">
                            <span>ONLINE PLAYBACK SIMULATION</span>
                            <span>24 FPS | PRORES</span>
                          </div>
                          
                          {/* Simulated pulsing graphics */}
                          <div className="flex items-center justify-center">
                            <div className="relative">
                              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                              <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-emerald-500 flex items-center justify-center animate-spin">
                                <div className="w-10 h-10 rounded-full border border-dashed border-emerald-400"></div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <button className="p-1.5 bg-[#A3E635] text-black rounded-lg">
                                <Play size={14} className="fill-current" />
                              </button>
                              <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full w-2/3 bg-[#A3E635] animate-pulse"></div>
                              </div>
                              <span className="text-[10px] text-white/70 font-mono">01:24 / 02:10</span>
                            </div>
                            <p className="text-[10px] text-white/40 text-center font-bold tracking-widest uppercase">
                              ADMIN HAS CONNECTED THIS DESIGN FILM SUCCESSFULLY
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Bottom Footer (Sticky) */}
              <div className="border-t border-[#E8E8E3] px-6 py-4 bg-[#FBFBFA] flex items-center justify-end">
                <button
                  onClick={() => setActiveItem(null)}
                  className="px-6 py-2.5 bg-[#1C1C1A] text-white hover:bg-[#1C1C1A]/90 text-xs font-bold tracking-widest uppercase rounded-full transition-colors cursor-pointer shadow-md"
                >
                  CLOSE VIEW
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}
