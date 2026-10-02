import React from 'react';
import { 
  ShieldAlert, 
  PhoneCall, 
  Share2, 
  MapPin, 
  AlertOctagon, 
  Volume2, 
  Copy, 
  Check, 
  HeartHandshake,
  X
} from 'lucide-react';

interface EmergencyHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyHub: React.FC<EmergencyHubProps> = ({ isOpen, onClose }) => {
  const [copiedShare, setCopiedShare] = React.useState(false);
  const [sirenPlaying, setSirenPlaying] = React.useState(false);

  if (!isOpen) return null;

  const sampleTravelMsg = `Safety Alert - Day Scholar Transit:
I am currently commuting to University Campus on Metro Blue Line M1 / Campus Shuttle 101.
Current Time: ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
If I do not check in within 35 minutes, please reach out to me or Campus Security (011-2659-1000).`;

  const handleCopyStatus = () => {
    navigator.clipboard.writeText(sampleTravelMsg);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handlePlaySiren = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
      osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.6);
      osc.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.9);

      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);

      setSirenPlaying(true);
      setTimeout(() => setSirenPlaying(false), 1500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Day Scholar Safety & SOS Desk
            </h3>
            <p className="text-xs text-slate-500">
              Immediate emergency contacts and location broadcast for commuter peace of mind.
            </p>
          </div>
        </div>

        {/* Emergency Call Buttons */}
        <div className="space-y-2.5 mb-5">
          <a
            href="tel:112"
            className="flex items-center justify-between p-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4" />
              <span>National Emergency SOS (112)</span>
            </div>
            <span className="text-xs bg-rose-800/80 px-2.5 py-1 rounded-lg">Instant Dial</span>
          </a>

          <a
            href="tel:01126591000"
            className="flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <span>University Campus Security Control (24/7)</span>
            </div>
            <span className="text-xs text-slate-400">Main Gate Desk</span>
          </a>

          <a
            href="tel:1091"
            className="flex items-center justify-between p-3.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-xl font-semibold text-sm transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <HeartHandshake className="w-4 h-4 text-purple-700" />
              <span>Women's Commuter Safety Helpline</span>
            </div>
            <span className="text-xs font-mono text-purple-700 font-bold">1091</span>
          </a>
        </div>

        {/* Share Live Commute Status */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              1-Tap Status Share with Family / Roommate
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
            Copy or send this pre-composed safety broadcast with your transit route and expected arrival time.
          </p>

          <div className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 leading-relaxed mb-3">
            {sampleTravelMsg}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopyStatus}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Message!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Safety Broadcast</span>
                </>
              )}
            </button>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(sampleTravelMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <span>Send via WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Audible Siren Alert */}
        <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <div>
            <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
              Audible Transit Siren
            </h4>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Sounds a sharp high-frequency alert from your device speaker to deter harassment.
            </p>
          </div>

          <button
            onClick={handlePlaySiren}
            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${
              sirenPlaying
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
          >
            {sirenPlaying ? 'Alarm Sounding!' : 'Sound Siren'}
          </button>
        </div>

        <div className="mt-5">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
