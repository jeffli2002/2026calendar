import React, { useState } from 'react';
import { GroundingChunk } from '../types';

interface GroundingSourcesProps {
  chunks: GroundingChunk[];
}

export const GroundingSources: React.FC<GroundingSourcesProps> = ({ chunks }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!chunks || chunks.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end pointer-events-auto">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/80 hover:bg-white backdrop-blur border border-stone-200 text-xs px-3 py-1 rounded-full shadow-sm text-stone-500 hover:text-stone-800 transition-all"
      >
        {isOpen ? 'Hide Sources' : 'Sources'}
      </button>

      {isOpen && (
        <div className="mt-2 bg-white/95 backdrop-blur-md border border-stone-200 p-4 rounded-lg shadow-xl max-w-xs w-64 text-left max-h-[80vh] overflow-y-auto">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">Search References</h4>
          <ul className="space-y-2">
            {chunks.map((chunk, idx) => (
              chunk.web ? (
                <li key={idx} className="text-xs">
                  <a 
                    href={chunk.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-stone-700 hover:text-red-700 hover:underline block truncate"
                    title={chunk.web.title}
                  >
                    {chunk.web.title || chunk.web.uri}
                  </a>
                </li>
              ) : null
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
