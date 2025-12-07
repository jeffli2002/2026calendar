import React, { useEffect, useState } from 'react';
import { Maxim } from '../types';

interface MonthPageProps {
  maxim: Maxim;
  onGenerateImage: (maxim: Maxim) => Promise<void>;
}

// 2026 Lunar Month approximation
const LUNAR_MONTHS_2026 = [
  "乙巳年 臘月", // Jan
  "丙午年 正月", // Feb
  "丙午年 二月", // Mar
  "丙午年 三月", // Apr
  "丙午年 四月", // May
  "丙午年 五月", // Jun
  "丙午年 六月", // Jul
  "丙午年 七月", // Aug
  "丙午年 八月", // Sep
  "丙午年 九月", // Oct
  "丙午年 十月", // Nov
  "丙午年 十一月" // Dec
];

export const MonthPage: React.FC<MonthPageProps> = ({ maxim, onGenerateImage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Only request generation if no image, not currently loading, and hasn't failed yet
    if (!maxim.imageUrl && !maxim.imageLoading && !maxim.imageFailed) {
      onGenerateImage(maxim);
    }
  }, [maxim, onGenerateImage]);

  const lunarMonth = LUNAR_MONTHS_2026[maxim.id - 1] || "";

  return (
    <div className="flex flex-col h-full bg-[#fdfbf7] text-stone-800 relative overflow-hidden shadow-inner font-serif">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

      {/* Date Header - Reduced sizing */}
      <div className="relative z-10 pt-6 px-8 flex justify-between items-start border-b border-stone-200 pb-3 mx-4">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-stone-400 uppercase tracking-tighter select-none flex items-baseline gap-3">
            <span>{maxim.month}</span>
            <span className="text-lg text-stone-400 font-light">2026</span>
          </h2>
          <span className="text-sm text-stone-500 font-serif mt-1 tracking-widest border-l border-red-800 pl-2">{lunarMonth}</span>
        </div>
        <span className="text-4xl font-serif text-red-900 font-bold opacity-80 writing-vertical-rl text-upright h-full pt-1">
            {String(maxim.id).padStart(2, '0')}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10 p-6 gap-8 items-center justify-center">
        
        {/* Image Frame - Reduced max width */}
        <div className="w-full md:w-1/2 aspect-square max-w-[400px] relative bg-white shadow-xl p-3 md:p-4 transition-transform duration-700 ease-out hover:scale-[1.01]">
           <div className="absolute inset-0 border border-stone-100 m-2 pointer-events-none"></div>
           <div className="w-full h-full bg-stone-50 flex items-center justify-center overflow-hidden relative group">
              {maxim.imageUrl ? (
                <img 
                  src={maxim.imageUrl} 
                  alt={maxim.title} 
                  className={`w-full h-full object-cover mix-blend-multiply filter contrast-125 grayscale transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
              ) : maxim.imageFailed ? (
                 <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <span className="text-stone-400 text-sm">Illustration failed to load.</span>
                    <button 
                      onClick={() => onGenerateImage(maxim)}
                      className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-600 text-xs rounded shadow-sm transition-colors"
                    >
                      Regenerate
                    </button>
                 </div>
              ) : (
                <div className="flex flex-col items-center space-y-2 opacity-50">
                    <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-600 rounded-full animate-spin"></div>
                    <span className="text-stone-500 text-xs tracking-widest font-serif">INKING...</span>
                </div>
              )}
           </div>
           {/* Stamp */}
           <div className="absolute bottom-4 right-4 w-8 h-8 border border-red-900 rounded-sm flex items-center justify-center opacity-70">
              <span className="text-red-900 text-[10px] font-serif font-bold writing-vertical-rl">禪心</span>
           </div>
        </div>

        {/* Text Content - Reduced fonts significantly */}
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 text-center md:text-left max-w-md">
          <div className="space-y-2">
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-wide leading-tight">{maxim.title}</h3>
            <h4 className="text-lg md:text-xl text-stone-500 font-serif italic tracking-wide">{maxim.translation}</h4>
          </div>
          
          <div className="w-8 h-[1px] bg-red-800 mx-auto md:mx-0 opacity-40"></div>
          
          <div className="space-y-4">
            <p className="text-xl md:text-2xl leading-relaxed text-stone-800 font-serif font-medium">
              {maxim.chineseDescription}
            </p>
            <p className="text-sm leading-relaxed text-stone-500 font-light font-sans tracking-wide">
              {maxim.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};