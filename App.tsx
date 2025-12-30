
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import DetectionDemo from './components/DetectionDemo';
import Carousel from './components/Carousel';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ApiKeyGate from './components/ApiKeyGate';
import { FeedbackEntry } from './types';

const App: React.FC = () => {
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEngineReady, setIsEngineReady] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (hasKey) setIsEngineReady(true);
      }
    };
    checkKey();

    const handleAuthError = () => {
      setIsEngineReady(false);
    };
    window.addEventListener('vision-engine-auth-error', handleAuthError);
    return () => window.removeEventListener('vision-engine-auth-error', handleAuthError);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('maskguard_feedback');
    if (saved) {
      try {
        setFeedbackList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse feedback", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('maskguard_feedback', JSON.stringify(feedbackList));
  }, [feedbackList]);

  const handleFeedback = (entry: FeedbackEntry) => {
    setFeedbackList(prev => [entry, ...prev]);
  };

  const clearFeedback = () => {
    if (confirm("Are you sure you want to clear all logged feedback?")) {
      setFeedbackList([]);
    }
  };

  if (!isEngineReady) {
    return <ApiKeyGate onSuccess={() => setIsEngineReady(true)} />;
  }

  return (
    <div className="min-h-screen selection:bg-blue-500/30">
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />
      
      <main>
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/5 blur-[100px] rounded-full" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-purple-600/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <Hero />
        
        <div className="relative">
          <div className="absolute inset-0 bg-slate-900 skew-y-1 -z-10 h-full w-full" />
          <Features />
        </div>

        <DetectionDemo onFeedback={handleFeedback} />
        
        <Carousel />
        
        <section className="py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="glass-effect p-12 md:p-20 rounded-[3rem] border border-white/10 relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-blue-500/20 blur-[80px] rounded-full" />
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Secure Your Premises Today</h2>
              <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                Connect your edge devices to our Vision Engine for enterprise-grade safety compliance.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xl transition-all shadow-xl shadow-blue-500/20"
                >
                  Start Live Feed
                </button>
                <button 
                  onClick={() => setIsAdminOpen(true)} 
                  className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-xl hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Review Compliance Logs
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {isAdminOpen && (
        <AdminDashboard 
          feedbackList={feedbackList} 
          onClear={clearFeedback} 
          onClose={() => setIsAdminOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
