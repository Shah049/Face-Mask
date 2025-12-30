
import React from 'react';
import { FeedbackEntry } from '../types';

interface AdminDashboardProps {
  feedbackList: FeedbackEntry[];
  onClear: () => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ feedbackList, onClear, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Feedback Review Center</h2>
            <p className="text-gray-400 text-sm">Review flagged incidents for model fine-tuning.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClear}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm transition-all"
            >
              Clear All
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {feedbackList.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 italic">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              No flagged detections found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {feedbackList.map((entry) => (
                <div key={entry.id} className="glass-effect rounded-2xl overflow-hidden border border-white/5 flex flex-col">
                  <div className="aspect-video relative bg-black">
                    <img src={`data:image/jpeg;base64,${entry.imageData}`} className="w-full h-full object-contain" alt="Flagged" />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${entry.userCorrection === 'false_positive' ? 'bg-orange-500/20 text-orange-400' : 'bg-purple-500/20 text-purple-400'}`}>
                        {entry.userCorrection.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">
                      AI identified as <span className="font-bold text-white underline">{entry.detectedStatus}</span>, but user disagreed.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
