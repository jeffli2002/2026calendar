
import React from 'react';
import { getCalendarData } from '../calendar';

interface DateStripProps {
  year: number;
  monthIndex: number; // 0-11
}

const WEEKDAYS_ZH = ['日', '一', '二', '三', '四', '五', '六'];

export const DateStrip: React.FC<DateStripProps> = ({ year, monthIndex }) => {
  const days = getCalendarData(year, monthIndex).filter(d => d.isCurrentMonth);
  const monthNum = String(monthIndex + 1).padStart(2, '0');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthName = monthNames[monthIndex];

  return (
    <div className="w-full bg-white border-t border-stone-300 p-2 flex items-center h-24 md:h-28 overflow-hidden">
      {/* Month Label Block */}
      <div className="flex-shrink-0 w-24 md:w-32 border-r-2 border-red-800/20 pr-4 mr-4 flex flex-col justify-center items-end text-red-800">
        <div className="flex items-baseline leading-none">
            <span className="text-4xl md:text-5xl font-bold tracking-tighter">{monthNum}</span>
            <span className="text-xl md:text-2xl font-light ml-1">/</span>
        </div>
        <div className="flex items-baseline gap-2 leading-none mt-1">
            <span className="text-xs md:text-sm font-bold tracking-widest">{monthName}</span>
            <span className="text-xs md:text-sm text-stone-500 font-sans">{year}</span>
        </div>
      </div>

      {/* Days Strip */}
      <div className="flex-1 flex justify-between items-center h-full">
         {days.map((day, idx) => (
             <div key={idx} className="flex flex-col items-center justify-between h-full py-1 flex-1 min-w-[20px]">
                 {/* Weekday */}
                 <span className={`text-[10px] md:text-xs font-serif ${day.isWeekend ? 'text-red-800' : 'text-stone-400'}`}>
                    {WEEKDAYS_ZH[day.date.getDay()]}
                 </span>
                 
                 {/* Date */}
                 <span className={`text-lg md:text-xl font-bold font-sans leading-none ${day.isWeekend || day.holiday ? 'text-red-700' : 'text-stone-800'}`}>
                    {day.dayOfMonth}
                 </span>
                 
                 {/* Lunar/Term */}
                 <div className="flex flex-col items-center">
                    {day.term ? (
                        <span className="text-[8px] md:text-[10px] text-green-700 font-bold whitespace-nowrap scale-90 origin-center">{day.term}</span>
                    ) : day.holiday ? (
                        <span className="text-[8px] md:text-[10px] text-red-600 font-bold whitespace-nowrap scale-90 origin-center">{day.holiday}</span>
                    ) : (
                        <span className="text-[8px] md:text-[10px] text-stone-400 font-serif whitespace-nowrap scale-90 origin-center">{day.lunarText}</span>
                    )}
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};
