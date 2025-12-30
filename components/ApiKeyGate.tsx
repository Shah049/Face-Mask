
import React from 'react';

interface ApiKeyGateProps {
  onSuccess: () => void;
}

const ApiKeyGate: React.FC<ApiKeyGateProps> = ({ onSuccess }) => {
  const handleConnect = async () => {
    try {
      if (typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
        // Proceed immediately after calling as per guidelines to avoid race conditions
        onSuccess();
      }
    } catch (err) {
      console.error("Failed to open key selector", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 p-6">
      <div className="max-w-md w-full glass-effect rounded-[2.5rem] p-12 text-center border border-blue-500/20 shadow-2xl">
        <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Initialize Vision Engine</h2>
        <p className="text-gray-400 mb-10 leading-relaxed">
          To enable real-time safety monitoring, please connect your AI Studio environment.
        </p>
        <button 
          onClick={handleConnect}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/30 active:scale-95"
        >
          Activate Engine
        </button>
        <p className="mt-6 text-xs text-gray-500">
          Uses Gemini 3 Flash Vision for high-speed edge compliance.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyGate;
