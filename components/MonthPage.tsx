
import React, { useEffect, useState } from 'react';
import { Maxim } from '../types';
import { getCalendarData, CalendarDay } from '../calendar';

interface MonthPageProps {
  maxim: Maxim;
  onGenerateImage: (maxim: Maxim) => Promise<void>;
  className?: string;
}

// 2026 Lunar Month Header mapping
const LUNAR_MONTHS_2026 = [
  "乙巳年 臘月 / 丙午年 正月", // Jan
  "丙午年 正月 / 二月", // Feb
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

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export const MonthPage: React.FC<MonthPageProps> = ({ maxim, onGenerateImage, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const calendarDays = getCalendarData(2026, maxim.id - 1);

  useEffect(() => {
    if (!maxim.imageUrl && !maxim.imageLoading && !maxim.imageFailed) {
      onGenerateImage(maxim);
    }
  }, [maxim, onGenerateImage]);

  const lunarYearText = LUNAR_MONTHS_2026[maxim.id - 1] || "";

  return (
    <div className={`flex flex-col w-full h-full bg-[#fdfbf7] text-stone-800 relative overflow-hidden font-serif ${className}`}>
      {/* Paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-0"></div>

      <div className="relative z-10 flex flex-col md:flex-row h-full">
        
        {/* LEFT PANEL: Art & Wisdom */}
        <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col p-6 md:p-8 border-b md:border-b-0 md:border-r border-stone-200 bg-white/40">
           
           {/* Header for Image Section */}
           <div className="mb-6 flex items-center justify-between">
              <span className="text-4xl text-red-900/20 font-bold font-sans">{String(maxim.id).padStart(2, '0')}</span>
              <div className="w-8 h-8 border border-red-900 flex items-center justify-center opacity-60">
                 <span className="text-red-900 text-[10px] writing-vertical-rl font-bold">智慧</span>
              </div>
           </div>

           {/* Image Frame */}
           <div className="w-full aspect-square relative bg-white shadow-lg p-3 transition-transform duration-700 hover:shadow-xl mb-6">
               <div className="w-full h-full bg-stone-50 flex items-center justify-center overflow-hidden relative border border-stone-100">
                  {maxim.imageUrl ? (
                    <img 
                      src={maxim.imageUrl} 
                      alt={maxim.title} 
                      className={`w-full h-full object-cover mix-blend-multiply filter grayscale contrast-125 transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImageLoaded(true)}
                    />
                  ) : maxim.imageFailed ? (
                     <div className="flex flex-col items-center gap-2 p-4 text-center">
                        <span className="text-stone-400 text-xs">Generation failed.</span>
                        <button 
                          onClick={() => onGenerateImage(maxim)}
                          className="px-2 py-1 bg-stone-200 text-stone-600 text-xs rounded"
                        >
                          Retry
                        </button>
                     </div>
                  ) : (
                    <span className="text-stone-400 text-xs tracking-widest animate-pulse">INKING...</span>
                  )}
               </div>
           </div>

           {/* Maxim Content */}
           <div className="flex-1 flex flex-col justify-center space-y-4">
              <div>
                <h3 className="text-3xl font-serif font-bold text-stone-900 leading-tight mb-1">{maxim.title}</h3>
                <h4 className="text-sm text-stone-500 italic font-serif">{maxim.translation}</h4>
              </div>
              <div className="w-8 h-[1px] bg-red-800 opacity-30"></div>
              <p className="text-lg leading-relaxed text-stone-800 font-medium">
                {maxim.chineseDescription}
              </p>
              <p className="text-xs leading-relaxed text-stone-500 font-light font-sans">
                {maxim.description}
              </p>
           </div>
        </div>

        {/* RIGHT PANEL: Calendar Grid */}
        <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col p-6 md:p-10">
           
           {/* Calendar Header */}
           <div className="flex justify-between items-end mb-6 border-b-2 border-red-800/80 pb-2">
              <div className="flex flex-col">
                 <h2 className="text-5xl font-sans font-bold text-stone-800 uppercase tracking-tighter">
                   {maxim.month}
                 </h2>
                 <span className="text-sm text-stone-500 tracking-[0.2em] font-light">2026 CALENDAR</span>
              </div>
              <div className="text-right">
                 <div className="text-2xl font-bold text-red-800/80">2026</div>
                 <div className="text-xs text-stone-500 font-serif">{lunarYearText}</div>
              </div>
           </div>

           {/* Grid */}
           <div className="flex-1 flex flex-col">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 mb-2">
                 {WEEKDAYS.map((day, i) => (
                   <div key={day} className={`text-center text-xs font-bold tracking-widest py-2 ${i === 0 || i === 6 ? 'text-red-800' : 'text-stone-500'}`}>
                     {day}
                   </div>
                 ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 grid-rows-6 h-full gap-[1px] bg-stone-200 border border-stone-200">
                 {calendarDays.map((day, idx) => (
                   <div 
                      key={idx} 
                      className={`
                        relative bg-[#fdfbf7] p-1 md:p-2 flex flex-col justify-between min-h-[60px] md:min-h-[80px]
                        ${!day.isCurrentMonth ? 'opacity-30 bg-stone-100' : ''}
                      `}
                   >
                      <div className="flex justify-between items-start">
                        <span className={`text-lg md:text-xl font-sans font-medium ${day.isWeekend || day.holiday ? 'text-red-700' : 'text-stone-700'}`}>
                          {day.dayOfMonth}
                        </span>
                        {day.holiday && (
                          <span className="text-[10px] text-red-600 font-bold border border-red-200 px-1 rounded-sm bg-red-50 hidden md:inline-block whitespace-nowrap">
                            {day.holiday}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-col items-end gap-0.5">
                         {day.term && (
                           <span className="text-[10px] text-green-700 font-bold">{day.term}</span>
                         )}
                         <span className={`text-[10px] font-serif ${day.term ? 'text-stone-500' : 'text-stone-400'}`}>
                           {day.holiday && !day.term ? day.holiday : day.lunarText}
                         </span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
