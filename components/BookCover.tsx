import React from 'react';

interface BookCoverProps {
  onOpen: () => void;
  isLoading: boolean;
}

export const BookCover: React.FC<BookCoverProps> = ({ onOpen, isLoading }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-stone-100 text-stone-800">
      <div className="max-w-md w-full bg-white shadow-2xl rounded-sm overflow-hidden border border-stone-200 relative">
        {/* Binding effect */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-stone-800 z-10"></div>
        <div className="absolute left-4 top-0 bottom-0 w-[1px] bg-stone-300 z-10"></div>
        
        <div className="p-12 pl-16 flex flex-col items-center text-center space-y-8 aspect-[3/4]">
          <div className="flex-1 flex flex-col justify-center items-center w-full border-4 border-double border-stone-800 p-6">
            <h2 className="text-xl tracking-[0.3em] uppercase text-stone-500 mb-4">Jin Wei Chun</h2>
            <h1 className="text-5xl md:text-6xl font-bold text-stone-900 mb-6 leading-tight writing-vertical-rl text-upright font-serif">
              人生<br/>只有<br/>一件事
            </h1>
            <p className="text-lg italic serif text-stone-600 mt-4">Life Only Has One Thing</p>
          </div>
          
          <button
            onClick={onOpen}
            disabled={isLoading}
            className={`
              w-full py-4 px-6 text-white text-lg tracking-widest transition-all duration-300
              ${isLoading ? 'bg-stone-400 cursor-not-allowed' : 'bg-red-800 hover:bg-red-900 shadow-lg hover:shadow-xl'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                SEARCHING BOOK...
              </span>
            ) : (
              "OPEN CALENDAR"
            )}
          </button>
        </div>
      </div>
      <p className="mt-8 text-stone-500 text-sm max-w-sm text-center">
        Discover the 12 wisdoms of living a simple and profound life.
      </p>
    </div>
  );
};
