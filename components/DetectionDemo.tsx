
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { detectMaskFromImage } from '../services/gemini';
import { MaskStatus, DetectionResult, FeedbackEntry } from '../types';

interface DetectionDemoProps {
  onFeedback: (entry: FeedbackEntry) => void;
}

const DetectionDemo: React.FC<DetectionDemoProps> = ({ onFeedback }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFrameData, setLastFrameData] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (err) {
      setError("Camera access denied. Please enable permissions.");
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setResult(null);
    clearOverlay();
  };

  const clearOverlay = () => {
    const ctx = overlayRef.current?.getContext('2d');
    if (ctx && overlayRef.current) {
      ctx.clearRect(0, 0, overlayRef.current.width, overlayRef.current.height);
    }
  };

  const drawBoundingBoxes = useCallback((detection: DetectionResult) => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detection.faces.forEach((face) => {
      const { ymin, xmin, ymax, xmax } = face.box;
      const x = (xmin / 1000) * canvas.width;
      const y = (ymin / 1000) * canvas.height;
      const width = ((xmax - xmin) / 1000) * canvas.width;
      const height = ((ymax - ymin) / 1000) * canvas.height;

      const isMask = face.status === MaskStatus.MASK;
      const color = isMask ? '#22c55e' : '#ef4444';

      // Draw box
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);

      // Draw label background
      ctx.fillStyle = color;
      const label = `${face.status} (${(face.confidence * 100).toFixed(0)}%)`;
      ctx.font = 'bold 16px Inter, sans-serif';
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x, y - 30, textWidth + 10, 30);

      // Draw label text
      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, x + 5, y - 8);
    });
  }, []);

  const captureFrame = useCallback(async () => {
    if (!isActive || isProcessing || !videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      setIsProcessing(true);
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      setLastFrameData(imageData);
      
      const detection = await detectMaskFromImage(imageData);
      setResult(detection);
      drawBoundingBoxes(detection);
      setIsProcessing(false);
    }
  }, [isActive, isProcessing, drawBoundingBoxes]);

  useEffect(() => {
    let interval: number;
    if (isActive) {
      interval = window.setInterval(captureFrame, 2000); // 2s polling
    }
    return () => clearInterval(interval);
  }, [isActive, captureFrame]);

  const flagDetection = (type: 'false_positive' | 'false_negative') => {
    if (!lastFrameData || !result) return;
    
    const entry: FeedbackEntry = {
      id: Math.random().toString(36).substring(7),
      imageData: lastFrameData,
      detectedStatus: result.faces.map(f => f.status).join(', '),
      userCorrection: type,
      timestamp: Date.now()
    };
    
    onFeedback(entry);
    alert("Thank you! This incident has been flagged for review.");
  };

  return (
    <section id="demo" className="py-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Live Analysis Center</h2>
          <p className="text-gray-400">Advanced multi-face detection with real-time feedback flagging.</p>
        </div>

        <div className="relative glass-effect rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="aspect-video bg-slate-900 relative">
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-20">
                <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <button 
                  onClick={startCamera}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all"
                >
                  Activate Camera Feed
                </button>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
              </div>
            )}
            
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className={`w-full h-full object-cover ${!isActive ? 'hidden' : 'block'}`}
            />
            
            <canvas 
              ref={overlayRef}
              width="640"
              height="480"
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />

            {isActive && (
              <div className="absolute top-4 left-4 flex gap-2 z-20">
                <div className="flex items-center gap-2 px-3 py-1.5 glass-effect rounded-full text-[10px] font-mono tracking-widest text-white/80">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  LIVE STREAMING
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                <div className="px-4 py-2 glass-effect rounded-full text-sm flex items-center gap-2 text-blue-400">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Gemini Flash 3 Inference...
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-slate-900 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Diagnostic Controls</span>
                <div className="flex gap-2">
                  <button 
                    disabled={!result || result.faces.length === 0}
                    onClick={() => flagDetection('false_positive')}
                    className="px-3 py-1.5 text-xs bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded-lg disabled:opacity-20 transition-all"
                  >
                    Flag False Positive
                  </button>
                  <button 
                    disabled={!result || result.faces.length === 0}
                    onClick={() => flagDetection('false_negative')}
                    className="px-3 py-1.5 text-xs bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg disabled:opacity-20 transition-all"
                  >
                    Flag False Negative
                  </button>
                </div>
              </div>
              
              {isActive && (
                <button 
                  onClick={stopCamera}
                  className="px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold transition-all"
                >
                  Terminate Feed
                </button>
              )}
            </div>
          </div>
        </div>

        <canvas ref={canvasRef} width="640" height="480" className="hidden" />
      </div>
    </section>
  );
};

export default DetectionDemo;
