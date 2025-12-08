
export interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  lunarText: string;
  term?: string;
  holiday?: string;
  isWeekend: boolean;
}

const SOLAR_TERMS_2026: Record<string, string> = {
  "1-5": "小寒", "1-20": "大寒",
  "2-4": "立春", "2-19": "雨水",
  "3-5": "驚蟄", "3-20": "春分",
  "4-5": "清明", "4-20": "穀雨",
  "5-5": "立夏", "5-21": "小滿",
  "6-6": "芒種", "6-21": "夏至",
  "7-7": "小暑", "7-23": "大暑",
  "8-7": "立秋", "8-23": "處暑",
  "9-7": "白露", "9-23": "秋分",
  "10-8": "寒露", "10-23": "霜降",
  "11-7": "立冬", "11-22": "小雪",
  "12-7": "大雪", "12-22": "冬至"
};

const HOLIDAYS_2026: Record<string, string> = {
  "1-1": "元旦",
  "2-17": "春節",
  "2-28": "紀念日",
  "4-5": "清明",
  "5-1": "勞動節",
  "6-19": "端午",
  "9-25": "中秋",
  "10-10": "國慶"
};

// Native Intl formatter for Chinese Lunar Calendar
const lunarFormatter = new Intl.DateTimeFormat('zh-Hant-TW', {
  calendar: 'chinese',
  day: 'numeric',
  month: 'numeric'
});

export const getCalendarData = (year: number, monthIndex: number): CalendarDay[] => {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
  const totalDays = lastDay.getDate();

  const days: CalendarDay[] = [];

  // Padding for previous month
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, monthIndex, -(i)),
      dayOfMonth: prevMonthLastDay - i,
      isCurrentMonth: false,
      lunarText: "",
      isWeekend: false // styling choice: mute weekends of other months?
    });
  }

  // Current month
  for (let i = 1; i <= totalDays; i++) {
    const current = new Date(year, monthIndex, i);
    const dayOfWeek = current.getDay();
    const key = `${monthIndex + 1}-${i}`;
    
    // Get Lunar Date
    // Format usually returns "M月D" or just "D" depending on browser. 
    // We want to handle the "First day of month" case specially to show the month name.
    const parts = lunarFormatter.formatToParts(current);
    const lunarMonthPart = parts.find(p => p.type === 'month')?.value;
    const lunarDayPart = parts.find(p => p.type === 'day')?.value;
    
    let lunarText = lunarDayPart || "";
    
    // If it's the first day (初一), usually Intl returns "初一". 
    // Sometimes we want to replace "初一" with the month name "X月" for clarity, 
    // but standard calendars often show "X月" if it's the 1st, or just "初一" with month in header.
    // Let's rely on standard output but if it is '1', show month. 
    // Actually Intl 'chinese' usually gives "7月" or "七月" for the month part.
    if (lunarDayPart === '1' || lunarDayPart === '初一') {
        lunarText = lunarMonthPart ? `${lunarMonthPart}` : lunarDayPart || '初一';
    }

    days.push({
      date: current,
      dayOfMonth: i,
      isCurrentMonth: true,
      lunarText: lunarText,
      term: SOLAR_TERMS_2026[key],
      holiday: HOLIDAYS_2026[key],
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6
    });
  }

  // Padding for next month to complete the 6-row grid (42 cells max usually)
  const remainingCells = 42 - days.length; // 6 rows * 7 cols
  for (let i = 1; i <= remainingCells; i++) {
     days.push({
       date: new Date(year, monthIndex + 1, i),
       dayOfMonth: i,
       isCurrentMonth: false,
       lunarText: "",
       isWeekend: false
     });
  }

  return days;
};
