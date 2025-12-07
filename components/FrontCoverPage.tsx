import React from 'react';

export const FrontCoverPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#fdfbf7] text-stone-800 relative overflow-hidden font-serif items-center justify-center p-6">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

      <div className="relative z-10 w-full h-full border-2 border-double border-stone-200 flex flex-col items-center justify-between py-12 bg-white/30 backdrop-blur-[1px]">
        
        {/* Top: Year */}
        <div className="flex flex-col items-center">
            <h1 className="text-6xl md:text-7xl font-bold text-stone-800 tracking-tighter opacity-90">
            2026
            </h1>
            <p className="text-stone-500 uppercase tracking-[0.4em] mt-2 text-xs font-sans">Calendar</p>
        </div>

        {/* Center: Title */}
        <div className="flex-1 flex items-center justify-center py-8">
            <div className="relative p-8 border border-stone-800 bg-stone-50 shadow-lg">
                <div className="absolute top-2 left-2 right-2 bottom-2 border border-stone-200 pointer-events-none"></div>
                <h1 className="text-5xl md:text-6xl font-bold text-stone-900 leading-tight writing-vertical-rl text-upright font-serif tracking-widest">
                人生<br/>只有<br/>一件事
                </h1>
            </div>
        </div>

        {/* Bottom: Subtitle/Author */}
        <div className="text-center space-y-3">
            <h2 className="text-xl md:text-2xl font-serif text-stone-700 italic">
            Life Only Has One Thing
            </h2>
            <div className="w-12 h-[1px] bg-red-800 mx-auto"></div>
            <p className="text-base text-stone-600 font-serif">
            Jin Wei Chun
            </p>
        </div>
      </div>
    </div>
  );
};