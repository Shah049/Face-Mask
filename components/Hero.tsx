
import React from 'react';

const Hero: React.FC = () => {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          <span className="block">Next-Gen AI Vision for</span>
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Public Safety Compliance
          </span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-400 leading-relaxed">
          Leveraging Gemini 3 Multimodal intelligence to deliver hyper-accurate, 
          real-time face mask detection for modern workspaces and public venues.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={scrollToDemo}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            Try Live Monitor
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button 
            type="button"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-lg backdrop-blur-sm transition-all"
          >
            View Case Studies
          </button>
        </div>
        
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex justify-center items-center text-xl font-bold text-gray-400">G-TECH</div>
          <div className="flex justify-center items-center text-xl font-bold text-gray-400">AURORA</div>
          <div className="flex justify-center items-center text-xl font-bold text-gray-400">NEXUS</div>
          <div className="flex justify-center items-center text-xl font-bold text-gray-400">QUANTUM</div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
