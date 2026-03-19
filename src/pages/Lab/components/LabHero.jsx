import React from 'react';
import InteractiveCard from '../../../components/Lab/InteractiveCard';

const LabHero = () => {
  return (
    <section className="lab-hero-section px-8 py-32 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-4xl mx-auto">
        <InteractiveCard className="max-w-[700px] mx-auto aspect-video">
           <div className="flex flex-col items-center justify-center w-full h-full p-12 text-center">
              <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4">
                Research <span className="text-[var(--accent)]">&</span> Development
              </h1>
              <p className="text-sm md:text-base opacity-60 max-w-md font-mono uppercase tracking-widest">
                Experimental Hub for UI/UX Prototypes
              </p>
           </div>
        </InteractiveCard>
      </div>
    </section>
  );
};

export default LabHero;
