import React, { useState, useCallback } from 'react';
import { BookCover } from './components/BookCover';
import { MonthPage } from './components/MonthPage';
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

  const handleStart = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchBookMaxims();
      setMaxims(result.maxims);
      setGroundingChunks(result.groundingChunks);
      if (result.maxims.length > 0) {
        setAppState('calendar');
        setCurrentIndex(0); // Start at Front Cover
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
    // Prevent multiple calls for same maxim if already loading or if image exists
    if (targetMaxim.imageUrl || targetMaxim.imageLoading) return;

    // Optimistically update loading state
    setMaxims(prev => prev.map(m => m.id === targetMaxim.id ? { ...m, imageLoading: true, imageFailed: false } : m));

    const imageUrl = await generateMaximIllustration(targetMaxim);

    if (imageUrl) {
      setMaxims(prev => prev.map(m => 
        m.id === targetMaxim.id 
          ? { ...m, imageUrl, imageLoading: false, imageFailed: false } 
          : m
      ));
    } else {
      // Handle failure: Stop loading, mark as failed, do NOT keep url empty (which would trigger useEffect loop)
      setMaxims(prev => prev.map(m => 
        m.id === targetMaxim.id 
          ? { ...m, imageLoading: false, imageFailed: true } 
          : m
      ));
    }
  }, []);

  // Total pages = 1 (Front) + Maxims + 1 (Back)
  const totalPages = maxims.length > 0 ? maxims.length + 2 : 0;

  const goToNext = () => {
    if (currentIndex < totalPages - 1) setCurrentIndex(c => c + 1);
  };

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  const handlePrint = () => {
    // Add a delay to ensure the UI handles the click event fully before opening the print dialog
    setTimeout(() => {
      window.print();
    }, 100);
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
      
      <main className="flex-1 w-full h-full relative overflow-hidden">
        {currentIndex === 0 && <FrontCoverPage />}
        
        {currentIndex > 0 && currentIndex <= maxims.length && maxims[currentIndex - 1] && (
          <MonthPage 
            key={maxims[currentIndex - 1].id} 
            maxim={maxims[currentIndex - 1]} 
            onGenerateImage={handleGenerateImage}
          />
        )}

        {currentIndex === totalPages - 1 && <BackCoverPage />}
      </main>

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