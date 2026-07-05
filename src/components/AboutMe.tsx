import React from 'react';
import { SiteConfig, SkillItem } from '../types';

interface AboutMeProps {
  config: SiteConfig;
  skills: SkillItem[];
}

export default function AboutMe({ config, skills }: AboutMeProps) {
  
  // Custom Render for each Skill Icon to look like a high-fidelity creative app launcher icon
  const renderSkillIcon = (iconType: string) => {
    switch (iconType.toLowerCase()) {
      case 'photoshop':
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#001D34] to-[#000F1F] border border-[#00C4FF]/30 flex items-center justify-center font-extrabold text-[#00C4FF] text-lg shadow-md relative overflow-hidden group-hover:shadow-[#00C4FF]/10 group-hover:border-[#00C4FF]/60 transition-all duration-300">
            Ps
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#00C4FF] rounded-full"></div>
          </div>
        );
      case 'illustrator':
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#261300] to-[#120800] border border-[#FF9A00]/30 flex items-center justify-center font-extrabold text-[#FF9A00] text-lg shadow-md relative overflow-hidden group-hover:shadow-[#FF9A00]/10 group-hover:border-[#FF9A00]/60 transition-all duration-300">
            Ai
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#FF9A00] rounded-full"></div>
          </div>
        );
      case 'figma':
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-white/10 flex items-center justify-center shadow-md relative overflow-hidden group-hover:shadow-white/10 group-hover:border-white/30 transition-all duration-300">
            <svg width="22" height="32" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 8C5.5 4.96244 7.96244 2.5 11 2.5C14.0376 2.5 16.5 4.96244 16.5 8C16.5 11.0376 14.0376 13.5 11 13.5C7.96244 13.5 5.5 11.0376 5.5 8Z" fill="#F24E1E"/>
              <path d="M5.5 16C5.5 12.9624 7.96244 10.5 11 10.5C14.0376 10.5 16.5 12.9624 16.5 16C16.5 19.0376 14.0376 21.5 11 21.5C7.96244 21.5 5.5 19.0376 5.5 16Z" fill="#A259FF"/>
              <path d="M5.5 24C5.5 20.9624 7.96244 18.5 11 18.5C14.0376 18.5 16.5 20.9624 16.5 24C16.5 27.0376 14.0376 29.5 11 29.5C7.96244 29.5 5.5 27.0376 5.5 24Z" fill="#0ACF83"/>
              <path d="M11 18.5C11 15.4624 13.4624 13 16.5 13C19.5376 13 22 15.4624 22 18.5C22 21.5376 19.5376 24 16.5 24C13.4624 24 11 21.5376 11 18.5Z" fill="#1ABCFE"/>
            </svg>
          </div>
        );
      case 'premiere':
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E0030] to-[#0A0014] border border-[#EA77FF]/30 flex items-center justify-center font-extrabold text-[#EA77FF] text-lg shadow-md relative overflow-hidden group-hover:shadow-[#EA77FF]/10 group-hover:border-[#EA77FF]/60 transition-all duration-300">
            Pr
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#EA77FF] rounded-full"></div>
          </div>
        );
      case 'aftereffects':
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A0034] to-[#080017] border border-[#D192FF]/30 flex items-center justify-center font-extrabold text-[#D192FF] text-lg shadow-md relative overflow-hidden group-hover:shadow-[#D192FF]/10 group-hover:border-[#D192FF]/60 transition-all duration-300">
            Ae
            <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#D192FF] rounded-full"></div>
          </div>
        );
      case 'cinema4d':
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1A1108] to-[#0A0602] border border-[#448CFA]/30 flex items-center justify-center shadow-md relative overflow-hidden group-hover:border-[#448CFA]/60 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#448CFA" strokeWidth="2" fill="none"/>
              <circle cx="12" cy="12" r="5" fill="#448CFA" fillOpacity="0.3" stroke="#448CFA" strokeWidth="1.5"/>
              <path d="M12 12 L17 17" stroke="#448CFA" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        );
      case 'blender':
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2E1A00] to-[#120A00] border border-[#F57C00]/30 flex items-center justify-center shadow-md relative overflow-hidden group-hover:shadow-[#F57C00]/10 group-hover:border-[#F57C00]/60 transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Abstract blender camera fan */}
              <circle cx="12" cy="13" r="4" fill="#F57C00"/>
              <path d="M12 9 C 14 6, 17 6, 19 8" stroke="#F57C00" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M 12 13 L 20 6" stroke="#F57C00" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="6" r="1.5" fill="#F57C00"/>
              <circle cx="12" cy="13" r="1.5" fill="white"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3E3E3E] to-[#1E1E1E] border border-white/10 flex items-center justify-center font-bold text-white text-sm shadow-md transition-all duration-300">
            {iconType.substring(0, 2).toUpperCase()}
          </div>
        );
    }
  };

  const certs = config.certificates || [
    { id: 'cert-1', name: '컴퓨터그래픽스운용기능사', date: '2020.12', issuer: '한국산업인력공단 (Q-Net)' },
    { id: 'cert-2', name: '웹디자인기능사', date: '2021.06', issuer: '한국산업인력공단 (Q-Net)' },
    { id: 'cert-3', name: 'GTQ 그래픽기술자격 1급', date: '2019.05', issuer: '한국생산성본부 (KPC)' },
    { id: 'cert-4', name: '컬러리스트산업기사', date: '2022.09', issuer: '한국산업인력공단 (Q-Net)' }
  ];

  return (
    <section
      id="about"
      className="py-24 bg-[#FBFBFA] border-t border-[#E8E8E3]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Section label, title and main design statement/ment */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <span className="text-xs font-extrabold tracking-[0.4em] text-[#70706B] uppercase block">
                ABOUT ME
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1A] leading-tight tracking-tight">
                독창적인 가치와 비주얼,<br />
                정교하게 결합되다
              </h2>
              
              {/* Moved Design Ment section here */}
              <div className="space-y-4 pt-4 border-t border-[#E8E8E3]">
                <h3 className="text-base sm:text-lg font-bold text-[#1C1C1A] tracking-tight leading-snug whitespace-pre-line">
                  {config.introTitle}
                </h3>
                <p className="text-xs sm:text-sm text-[#70706B] leading-relaxed">
                  {config.introDescription}
                </p>
              </div>
            </div>
            
            {/* Visual branding quote card */}
            <div className="hidden lg:block bg-white border border-[#E8E8E3] p-6 rounded-2xl shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#E8E8E3]/20 to-transparent rounded-bl-full pointer-events-none"></div>
              <p className="text-xs font-black tracking-widest text-[#1C1C1A] uppercase mb-2">DESIGN MANIFESTO</p>
              <p className="text-xs text-[#70706B] leading-relaxed italic">
                "진정한 디자인은 불필요한 장식을 덜어내고, 브랜드 고유의 진실된 정체성을 부각시키는 것에서부터 시작됩니다."
              </p>
            </div>
          </div>

          {/* Right Column: Skill icons and Certificates */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Skill Cards grid */}
            <div className="space-y-6">
              <h4 className="text-[11px] font-extrabold tracking-[0.25em] text-[#1C1C1A] uppercase">
                CORE DESIGN TOOL SKILLS
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group flex items-center space-x-3.5 bg-white border border-[#E8E8E3] hover:border-[#1C1C1A] p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {renderSkillIcon(skill.iconType)}
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1C1C1A] tracking-tight">
                        {skill.name}
                      </span>
                      {skill.percentage !== undefined && (
                        <div className="flex items-center mt-1">
                          <span className="text-[9px] font-black tracking-wider text-[#C5A880] bg-[#C5A880]/10 px-2 py-0.5 rounded-md font-sans">
                            {skill.percentage >= 85 ? 'Advanced' : skill.percentage >= 60 ? 'Intermediate' : 'Basic'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certificates & Licenses Section */}
            <div className="space-y-6 pt-6 border-t border-[#E8E8E3]">
              <h4 className="text-[11px] font-extrabold tracking-[0.25em] text-[#1C1C1A] uppercase">
                CERTIFICATES &amp; LICENSES
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certs.map((cert) => (
                  <div key={cert.id} className="flex items-start space-x-4 bg-white border border-[#E8E8E3] p-4 rounded-xl shadow-sm hover:border-[#1C1C1A] transition-all duration-300">
                    <div className="p-2 bg-[#B89B73]/10 text-[#B89B73] rounded-lg flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h5 className="text-xs font-bold text-[#1C1C1A] tracking-tight truncate">{cert.name}</h5>
                        <span className="text-[9px] font-extrabold text-[#B89B73] bg-[#B89B73]/10 px-1.5 py-0.5 rounded flex-shrink-0">{cert.date}</span>
                      </div>
                      <p className="text-[10px] text-[#70706B] font-medium mt-1">{cert.issuer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
