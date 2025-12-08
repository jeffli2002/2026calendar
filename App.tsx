
import React, { useState, useCallback, useEffect } from 'react';
import { BookCover } from './components/BookCover';
import { MaximArtPage } from './components/MaximArtPage';
import { CalendarGridPage } from './components/CalendarGridPage';
import { FrontCoverPage } from './components/FrontCoverPage';
import { BackCoverPage } from './components/BackCoverPage';
import { Navigation } from './components/Navigation';
import { GroundingSources } from './components/GroundingSources';
import { fetchBookMaxims, generateMaximIllustration } from './services/gemini';
import { Maxim, GroundingChunk } from './types';

const App: React.FC = () => {
  const [maxims, setMaxims] = useState<Maxim[]>([]);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [appState, setAppState] = useState<'cover' | 'calendar' | 'error'>('cover');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Queue to manage sequential image generation
  const [generationQueue, setGenerationQueue] = useState<number[]>([]);

  const handleStart = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchBookMaxims();
      setMaxims(result.maxims);
      setGroundingChunks(result.groundingChunks);
      if (result.maxims.length > 0) {
        setAppState('calendar');
        setCurrentIndex(0); // Start at Front Cover
        
        // Populate queue with all maxim IDs to trigger sequential background generation
        setGenerationQueue(result.maxims.map(m => m.id));
      } else {
        throw new Error("No maxims found.");
      }
    } catch (error) {
      console.error(error);
      setAppState('error');
      setErrorMessage("Could not retrieve book content. Please verify your API Key or try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateImage = useCallback(async (targetMaxim: Maxim) => {
    // Prevent multiple calls
    if (targetMaxim.imageUrl || targetMaxim.imageLoading) return;

    setMaxims(prev => prev.map(m => m.id === targetMaxim.id ? { ...m, imageLoading: true, imageFailed: false } : m));

    const imageUrl = await generateMaximIllustration(targetMaxim);

    if (imageUrl) {
      setMaxims(prev => prev.map(m => 
        m.id === targetMaxim.id 
          ? { ...m, imageUrl, imageLoading: false, imageFailed: false } 
          : m
      ));
    } else {
      setMaxims(prev => prev.map(m => 
        m.id === targetMaxim.id 
          ? { ...m, imageLoading: false, imageFailed: true } 
          : m
      ));
    }
  }, []);

  // Background generator for Print Mode readiness
  useEffect(() => {
    const processQueue = async () => {
       if (generationQueue.length === 0) return;
       
       const nextId = generationQueue[0];
       const maxim = maxims.find(m => m.id === nextId);

       if (maxim && !maxim.imageUrl && !maxim.imageLoading && !maxim.imageFailed) {
          await handleGenerateImage(maxim);
       }

       // Remove from queue regardless of success to move to next
       setGenerationQueue(prev => prev.slice(1));
    };

    if (generationQueue.length > 0) {
       // Small delay to allow React state updates to settle and avoid slamming API
       const timer = setTimeout(processQueue, 1000);
       return () => clearTimeout(timer);
    }
  }, [generationQueue, maxims, handleGenerateImage]);

  // Logic to determine Total Pages and Current View
  // Pages: Front Cover (1) + 12 Months * 2 (Art + Grid) + Back Cover (1) = 2 + 24 = 26 pages
  // Index 0: Front Cover
  // Index 1: Month 1 Art
  // Index 2: Month 1 Grid
  // ...
  // Index 25: Back Cover

  const totalPages = maxims.length > 0 ? (maxims.length * 2) + 2 : 0;

  const goToNext = () => {
    if (currentIndex < totalPages - 1) setCurrentIndex(c => c + 1);
  };

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Helper to get maxim based on page index
  const getCurrentPageContent = () => {
    if (currentIndex === 0) return <FrontCoverPage />;
    if (currentIndex === totalPages - 1) return <BackCoverPage />;

    const adjustedIndex = currentIndex - 1; // 0 to 23
    const monthIndex = Math.floor(adjustedIndex / 2);
    const isArtPage = adjustedIndex % 2 === 0;
    const maxim = maxims[monthIndex];

    if (!maxim) return <div>Loading...</div>;

    if (isArtPage) {
      return (
        <MaximArtPage 
          maxim={maxim} 
          onGenerateImage={handleGenerateImage} 
        />
      );
    } else {
      return (
        <CalendarGridPage 
          maxim={maxim} 
        />
      );
    }
  };

  if (appState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100 text-stone-800 p-8">
        <div className="text-center max-w-md">
           <h2 className="text-2xl font-serif text-red-800 mb-4">Error</h2>
           <p className="mb-6 text-stone-600">{errorMessage}</p>
           <button 
             onClick={() => setAppState('cover')} 
             className="px-6 py-2 border border-stone-400 hover:bg-stone-200 transition-colors"
           >
             Return Home
           </button>
        </div>
      </div>
    );
  }

  if (appState === 'cover') {
    return <BookCover onOpen={handleStart} isLoading={isLoading} />;
  }

  return (
    <div className="w-full h-screen bg-[#fafaf9] flex flex-col relative">
      <div className="no-print">
         <GroundingSources chunks={groundingChunks} />
      </div>
      
      {/* SCREEN VIEW */}
      <main className="flex-1 w-full h-full relative overflow-hidden no-print">
        {getCurrentPageContent()}
      </main>

      {/* PRINT VIEW (Hidden on Screen, Visible on Print) */}
      <div className="hidden print:block w-full">
         <FrontCoverPage />
         <div className="break-after-page"></div>
         
         {maxims.map((maxim) => (
             <React.Fragment key={maxim.id}>
                {/* Page 1: Art + Maxim */}
                <div className="w-full h-screen break-after-page print:h-[100vh] overflow-hidden">
                   <MaximArtPage 
                     maxim={maxim} 
                     onGenerateImage={handleGenerateImage}
                     className="h-full"
                   />
                </div>
                {/* Page 2: Grid */}
                <div className="w-full h-screen break-after-page print:h-[100vh] overflow-hidden">
                   <CalendarGridPage 
                     maxim={maxim}
                     className="h-full"
                   />
                </div>
             </React.Fragment>
         ))}
         
         <BackCoverPage />
      </div>

      <Navigation 
        currentIndex={currentIndex} 
        totalPages={totalPages} 
        onNext={goToNext} 
        onPrev={goToPrev}
        onSelect={setCurrentIndex}
        onSave={handlePrint}
      />
    </div>
  );
};

export default App;
