
import React, { useEffect, useState } from 'react';
import { Maxim } from '../types';
import { DateStrip } from './DateStrip';

interface MaximArtPageProps {
  maxim: Maxim;
  onGenerateImage: (maxim: Maxim) => Promise<void>;
  className?: string;
}

export const MaximArtPage: React.FC<MaximArtPageProps> = ({ maxim, onGenerateImage, className = '' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!maxim.imageUrl && !maxim.imageLoading && !maxim.imageFailed) {
      onGenerateImage(maxim);
    }
  }, [maxim, onGenerateImage]);

  return (
    <div className={`flex flex-col w-full h-full bg-[#fdfbf7] text-stone-800 relative overflow-hidden font-serif ${className}`}>
       {/* Paper texture overlay */}
       <div className="absolute inset-0 pointer-events-none opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] z-0"></div>

       <div className="relative z-10 flex-1 flex flex-col p-8 md:p-12 items-center justify-center">
          
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 md:gap-16 items-center">
             
             {/* Image Section */}
             <div className="w-full md:w-1/2 aspect-square relative bg-white shadow-xl p-4 transform rotate-1 transition-transform hover:rotate-0 duration-700">
                <div className="absolute -top-4 -left-4 text-6xl text-stone-100 font-bold z-0 pointer-events-none select-none">
                    {String(maxim.id).padStart(2, '0')}
                </div>
                <div className="w-full h-full bg-stone-50 flex items-center justify-center overflow-hidden relative border border-stone-100 z-10">
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

             {/* Text Section */}
             <div className="w-full md:w-1/2 flex flex-col space-y-6 text-center md:text-left">
                <div className="space-y-2">
                    <h2 className="text-5xl font-bold text-stone-900 leading-tight font-serif">{maxim.title}</h2>
                    <h3 className="text-lg text-stone-500 italic font-serif">{maxim.translation}</h3>
                </div>
                
                <div className="w-16 h-1 bg-red-800/80 mx-auto md:mx-0"></div>
                
                <p className="text-2xl leading-relaxed text-stone-800 font-medium font-serif">
                    {maxim.chineseDescription}
                </p>
                <p className="text-sm leading-relaxed text-stone-500 font-sans">
                    {maxim.description}
                </p>
             </div>
          </div>
       </div>

       {/* Footer Strip */}
       <div className="relative z-20">
          <DateStrip year={2026} monthIndex={maxim.id - 1} />
       </div>
    </div>
  );
};
