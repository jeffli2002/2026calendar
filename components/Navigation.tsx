import React from 'react';

interface NavigationProps {
  currentIndex: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (index: number) => void;
  onSave: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentIndex, totalPages, onNext, onPrev, onSelect, onSave }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 z-[100] flex justify-between items-end pointer-events-none no-print">
      <div className="pointer-events-auto flex gap-2 items-center relative z-[101]">
          {/* Mini Calendar Dots */}
          <div className="hidden md:flex gap-1 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-stone-200">
             {Array.from({ length: totalPages }).map((_, i) => {
               let label = `Page ${i + 1}`;
               if (i === 0) label = "Front Cover";
               else if (i === totalPages - 1) label = "Back Cover";
               else label = `Month ${i}`;

               return (
                 <button
                   key={i}
                   onClick={() => onSelect(i)}
                   title={label}
                   className={`
                     w-3 h-3 rounded-full transition-all duration-300 
                     ${i === currentIndex ? 'bg-red-800 scale-125' : 'bg-stone-300 hover:bg-stone-400'}
                     ${(i === 0 || i === totalPages - 1) ? 'rounded-sm' : ''} 
                   `}
                   aria-label={label}
                 />
               );
             })}
          </div>
          
          {/* Print Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSave();
            }}
            title="Save as PDF / Print"
            className="ml-2 flex items-center justify-center w-10 h-10 bg-white/90 text-stone-700 rounded-full shadow-lg border border-stone-200 hover:bg-stone-100 hover:text-red-800 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z" />
            </svg>
          </button>
      </div>

      <div className="pointer-events-auto flex gap-4 relative z-[101]">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="group flex items-center justify-center w-12 h-12 bg-stone-800 text-stone-100 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors"
        >
          <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNext}
          disabled={currentIndex === totalPages - 1}
          className="group flex items-center justify-center w-12 h-12 bg-stone-800 text-stone-100 rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-stone-700 transition-colors"
        >
          <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};