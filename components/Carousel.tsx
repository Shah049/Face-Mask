
import React, { useState, useEffect } from 'react';

const slides = [
  {
    image: "https://picsum.photos/seed/office1/1200/400",
    title: "Corporate Headquaters",
    desc: "Achieved 99.8% compliance across 12 floors within the first month of deployment."
  },
  {
    image: "https://picsum.photos/seed/transit/1200/400",
    title: "Public Transit Hubs",
    desc: "Seamless integration with existing CCTV infrastructure for real-time alerting."
  },
  {
    image: "https://picsum.photos/seed/medical/1200/400",
    title: "Healthcare Facilities",
    desc: "Ensuring sterile environments through constant automated visual auditing."
  }
];

const Carousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
          {slides.map((slide, idx) => (
            <div 
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img src={slide.image} className="absolute inset-0 w-full h-full object-cover" alt={slide.title} />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
              <div className="relative px-12 max-w-xl">
                <span className="inline-block px-3 py-1 bg-blue-600 text-[10px] font-bold tracking-widest uppercase rounded mb-4">Implementation</span>
                <h3 className="text-4xl font-bold text-white mb-4">{slide.title}</h3>
                <p className="text-gray-300 text-lg">{slide.desc}</p>
              </div>
            </div>
          ))}
          
          <div className="absolute bottom-8 left-12 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button 
                key={idx} 
                onClick={() => setCurrent(idx)}
                className={`h-1.5 transition-all duration-300 rounded-full ${idx === current ? 'w-8 bg-blue-500' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
