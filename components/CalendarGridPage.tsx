
import React from 'react';
import { Maxim } from '../types';
import { getCalendarData } from '../calendar';

interface CalendarGridPageProps {
  maxim: Maxim;
  className?: string;
}

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

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export const CalendarGridPage: React.FC<CalendarGridPageProps> = ({ maxim, className = '' }) => {
  const calendarDays = getCalendarData(2026, maxim.id - 1);
  const lunarYearText = LUNAR_MONTHS_2026[maxim.id - 1] || "";

  return (
    <div className={`flex flex-col w-full h-full bg-[#fdfbf7] text-stone-800 relative overflow-hidden font-serif p-8 md:p-16 ${className}`}>
      {/* Paper texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-0"></div>

      <div className="relative z-10 w-full h-full border-[1px] border-stone-300 p-8 flex flex-col bg-white/40 shadow-inner">
         
         {/* Header */}
         <div className="flex justify-between items-end mb-8 border-b-2 border-red-800 pb-4">
            <div className="flex flex-col">
               <h2 className="text-6xl font-sans font-bold text-stone-800 uppercase tracking-tighter">
                 {maxim.month}
               </h2>
               <div className="flex items-center gap-4 mt-2">
                   <span className="text-sm text-stone-500 tracking-[0.3em] font-light uppercase">2026 Calendar</span>
                   <span className="text-sm text-stone-400 font-serif italic">{maxim.translation}</span>
               </div>
            </div>
            <div className="text-right">
               <div className="text-3xl font-bold text-red-800">2026</div>
               <div className="text-sm text-stone-600 font-serif mt-1">{lunarYearText}</div>
            </div>
         </div>

         {/* Grid Container */}
         <div className="flex-1 flex flex-col">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-4">
               {WEEKDAYS.map((day, i) => (
                 <div key={day} className={`text-center text-xs font-bold tracking-[0.2em] py-2 uppercase ${i === 0 || i === 6 ? 'text-red-800' : 'text-stone-500'}`}>
                   {day}
                 </div>
               ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 grid-rows-6 h-full gap-px bg-stone-200 border border-stone-200 shadow-sm">
               {calendarDays.map((day, idx) => (
                 <div 
                    key={idx} 
                    className={`
                      relative bg-[#fdfbf7] p-2 md:p-3 flex flex-col justify-between
                      ${!day.isCurrentMonth ? 'opacity-30 bg-stone-100' : ''}
                    `}
                 >
                    <div className="flex justify-between items-start">
                      <span className={`text-xl md:text-3xl font-sans font-light ${day.isWeekend || day.holiday ? 'text-red-700' : 'text-stone-800'}`}>
                        {day.dayOfMonth}
                      </span>
                      {day.holiday && (
                        <span className="text-[9px] md:text-[10px] text-red-600 font-bold border border-red-200 px-1 rounded-sm bg-red-50 truncate max-w-[50px]">
                          {day.holiday}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-1 mt-auto">
                       {day.term && (
                         <span className="text-[10px] md:text-xs text-green-800 font-bold">{day.term}</span>
                       )}
                       <span className={`text-[10px] md:text-xs font-serif ${day.term ? 'text-stone-500' : 'text-stone-400'}`}>
                         {day.holiday && !day.term ? day.holiday : day.lunarText}
                       </span>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
