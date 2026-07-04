import React, { useState } from 'react';
import { SiteConfig, ContactMessage } from '../types';
import { Mail, Film, Link as LinkIcon, Send, CheckCircle } from 'lucide-react';

interface ContactProps {
  config: SiteConfig;
  onNewMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt'>) => void;
}

export default function Contact({ config, onNewMessage }: ContactProps) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      setIsError(true);
      return;
    }

    onNewMessage({
      senderName: name,
      senderContact: contact,
      messageText: message
    });

    setIsSubmitted(true);
    setIsError(false);
    setName('');
    setContact('');
    setMessage('');

    // Clear success message after 4 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <section id="contact" className="py-24 bg-[#FBFBFA] border-t border-[#E8E8E3]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Contact Links Info */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <span className="text-xs font-extrabold tracking-[0.4em] text-[#70706B] uppercase block">
                GET IN TOUCH
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1A] leading-tight tracking-tight">
                새로운 가치를 만드는<br />
                디자인 프로젝트를 제안하세요
              </h2>
              <p className="text-sm text-[#70706B] leading-relaxed max-w-sm">
                상세페이지 기획, 리디자인, 브랜딩 광고 배너, 모션 크리에이티브 등 박성미 디자이너와 함께 프로젝트 비주얼을 한 차원 높여보세요.
              </p>
            </div>

            {/* Premium Social Links Cards Grid */}
            <div className="space-y-4">
              
              {/* Email Card */}
              <a
                href={`mailto:${config.email}`}
                className="group flex items-center space-x-4 bg-white border border-[#E8E8E3] hover:border-[#1C1C1A] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-[#1C1C1A] group-hover:text-white text-[#1C1C1A] flex items-center justify-center transition-colors">
                  <Mail size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black tracking-widest text-[#70706B] uppercase">EMAIL ADDRESS</p>
                  <p className="text-xs sm:text-sm font-bold text-[#1C1C1A] truncate">{config.email}</p>
                </div>
              </a>

              {/* Naver Blog Card */}
              <a
                href={config.blogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-4 bg-white border border-[#E8E8E3] hover:border-[#1C1C1A] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-emerald-600 group-hover:text-white text-emerald-600 flex items-center justify-center transition-colors">
                  <LinkIcon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black tracking-widest text-[#70706B] uppercase">DESIGN NAVER BLOG</p>
                  <p className="text-xs sm:text-sm font-bold text-[#1C1C1A] truncate">블로그 방문하기</p>
                </div>
              </a>

              {/* YouTube (Choonsung Studio) Card */}
              <a
                href={config.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-4 bg-white border border-[#E8E8E3] hover:border-[#1C1C1A] p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-100 group-hover:bg-red-600 group-hover:text-white text-red-600 flex items-center justify-center transition-colors">
                  <Film size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black tracking-widest text-[#70706B] uppercase">YOUTUBE CHANNEL</p>
                  <p className="text-xs sm:text-sm font-bold text-[#1C1C1A] truncate">{config.youtubeChannelName}</p>
                </div>
              </a>

            </div>
          </div>

          {/* Right Column: Dynamic Client Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#E8E8E3] rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#E8E8E3]/20 to-transparent rounded-bl-full pointer-events-none"></div>
              
              <h3 className="text-lg font-black text-[#1C1C1A] tracking-tight mb-6">
                QUICK INQUIRY FORM (간편 문의)
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {/* Sender Name */}
                <div className="space-y-1.5">
                  <label htmlFor="client-name" className="text-[10px] font-extrabold tracking-widest text-[#70706B] uppercase">
                    성함 또는 기업명 *
                  </label>
                  <input
                    id="client-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="예시: 박성미 컴퍼니"
                    className="w-full px-4 py-3 border border-[#E8E8E3] focus:border-[#1C1C1A] rounded-xl text-xs sm:text-sm bg-[#FBFBFA] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Sender Contact (Email/Phone) */}
                <div className="space-y-1.5">
                  <label htmlFor="client-contact" className="text-[10px] font-extrabold tracking-widest text-[#70706B] uppercase">
                    회신받으실 연락처 / 이메일 *
                  </label>
                  <input
                    id="client-contact"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="예시: design@company.com"
                    className="w-full px-4 py-3 border border-[#E8E8E3] focus:border-[#1C1C1A] rounded-xl text-xs sm:text-sm bg-[#FBFBFA] focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Message text */}
                <div className="space-y-1.5">
                  <label htmlFor="client-message" className="text-[10px] font-extrabold tracking-widest text-[#70706B] uppercase">
                    프로젝트 제안 문의 내용 *
                  </label>
                  <textarea
                    id="client-message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="예시: 상세페이지 및 배너 디자인 의뢰 제안드립니다..."
                    className="w-full px-4 py-3 border border-[#E8E8E3] focus:border-[#1C1C1A] rounded-xl text-xs sm:text-sm bg-[#FBFBFA] focus:outline-none transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                {/* Success/Error Notices */}
                {isSubmitted && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
                    <CheckCircle size={16} />
                    <span>문의가 성공적으로 접수되었습니다. 디자이너가 곧 연락을 드리겠습니다!</span>
                  </div>
                )}

                {isError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold">
                    모든 필수 항목을 기입해주세요.
                  </div>
                )}

                {/* Send Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#1C1C1A] hover:bg-[#1C1C1A]/95 text-white text-xs font-bold tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-md"
                >
                  <Send size={13} />
                  <span>SEND INQUIRY (문의 보내기)</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
