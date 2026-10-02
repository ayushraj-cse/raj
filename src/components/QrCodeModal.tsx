import React from 'react';
import { X, ExternalLink, Smartphone, Copy, Check } from 'lucide-react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, url }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate SVG QR code matrix (using public standard QR code generation endpoint as reliable image or SVG)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}&color=0f172a&bgcolor=ffffff&margin=1`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex p-3 bg-indigo-50 rounded-2xl text-indigo-600 mb-3">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">Open in Chrome Mobile</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Scan this QR code with your phone camera or copy the link to open in Google Chrome.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 rounded-xl mb-5">
          <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-200">
            <img 
              src={qrImageUrl} 
              alt="Scan to open CampusCommute in Chrome"
              className="w-48 h-48 rounded-lg"
              loading="eager"
            />
          </div>
          <span className="text-[11px] text-slate-400 mt-3 font-medium">Point your mobile camera to scan</span>
        </div>

        {/* URL Box & Copy */}
        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-xl border border-slate-200 mb-4 text-xs">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full bg-transparent text-slate-700 font-mono text-[11px] px-2 outline-none select-all truncate"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shrink-0 font-medium text-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Tip for Chrome */}
        <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900">
          <p className="font-semibold text-amber-950 mb-1 flex items-center gap-1">
            <span>💡</span> Pro-tip for Google Chrome
          </p>
          <p className="text-amber-800/90 text-[11px] leading-relaxed">
            In Chrome, tap the menu (3 dots) and select <strong>"Add to Home screen"</strong> to install CampusCommute as a daily one-tap transit app on your phone.
          </p>
        </div>

        <div className="mt-5 flex gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open Directly in Chrome</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
