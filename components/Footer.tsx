
import React from 'react';

const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-white/5 py-12 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold">M</div>
              <span className="text-xl font-bold">MaskGuard Vision</span>
            </div>
            <p className="text-gray-400 max-w-sm">
              Proprietary computer vision systems for industrial safety. 
              Powered by Gemini 3 Flash Multimodal logic.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><button onClick={() => scrollTo('demo')} className="hover:text-blue-400 transition-colors">Live Monitor</button></li>
              <li><button onClick={() => scrollTo('features')} className="hover:text-blue-400 transition-colors">Edge Features</button></li>
              <li><button className="hover:text-blue-400 transition-colors text-left cursor-default opacity-50">Enterprise API (Coming Soon)</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Diagnostic</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><button className="hover:text-blue-400 transition-colors text-left">Incident Log</button></li>
              <li><button className="hover:text-blue-400 transition-colors text-left">Accuracy Metrics</button></li>
              <li><button className="hover:text-blue-400 transition-colors text-left">System Status</button></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© 2024 MaskGuard Computer Vision. Developed for safety compliance.</p>
          <div className="flex gap-6">
            <span className="cursor-default opacity-30">Status: Operational</span>
            <span className="cursor-default opacity-30">Region: Global</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
