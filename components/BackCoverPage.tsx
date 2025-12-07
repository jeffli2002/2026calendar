import React from 'react';

export const BackCoverPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#fdfbf7] text-stone-800 relative overflow-hidden font-serif items-center justify-center p-6">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

      <div className="relative z-10 w-full h-full border-2 border-double border-stone-200 flex flex-col items-center justify-center bg-white/30 backdrop-blur-[1px]">
        
        <div className="flex flex-col items-center gap-10">
            {/* Zen Circle / Seal */}
            <div className="relative w-24 h-24 md:w-36 md:h-36 flex items-center justify-center">
                <div className="absolute inset-0 border-[4px] border-stone-800 rounded-full opacity-80" style={{ borderRadius: '55% 45% 60% 40% / 50% 60% 30% 70%' }}></div>
                <div className="absolute inset-0 border-[1px] border-stone-600 rounded-full opacity-40 rotate-45 scale-95" style={{ borderRadius: '45% 55% 40% 60% / 60% 30% 70% 40%' }}></div>
                <span className="text-3xl md:text-4xl font-serif font-bold text-stone-800">圓滿</span>
            </div>

            <div className="text-center space-y-4 max-w-sm">
                <p className="text-lg md:text-xl font-serif text-stone-700 leading-relaxed">
                    Live simply.<br/>
                    Live profoundly.
                </p>
                
                <div className="flex items-center justify-center gap-3 text-stone-400 text-xs tracking-widest uppercase font-sans mt-6">
                    <span>2026</span>
                    <span>•</span>
                    <span>Life Only Has One Thing</span>
                </div>
            </div>
        </div>

        {/* Footer stamp */}
        <div className="absolute bottom-10 right-10 opacity-60">
            <div className="w-10 h-10 border border-red-900 flex items-center justify-center bg-red-50/50">
                 <span className="text-red-900 text-[10px] writing-vertical-rl font-bold">金惟純</span>
            </div>
        </div>
      </div>
    </div>
  );
};