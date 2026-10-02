import React from 'react';
import { ExternalLink, Copy, Check, QrCode, Globe, ShieldCheck } from 'lucide-react';

interface ChromeLinkBannerProps {
  appUrl: string;
  onOpenQr: () => void;
}

export const ChromeLinkBanner: React.FC<ChromeLinkBannerProps> = ({ appUrl, onOpenQr }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 md:p-5 shadow-lg border border-indigo-900/40 relative overflow-hidden">
      {/* Decorative backdrop glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left Information */}
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-indigo-500/20 text-indigo-300 rounded-xl border border-indigo-400/20 shrink-0 mt-0.5">
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Chrome Ready URL</span>
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span className="text-[11px] text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Live Deployment
              </span>
            </div>
            <h2 className="text-base md:text-lg font-bold text-white tracking-tight mt-0.5">
              Open CampusCommute in Google Chrome
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              Bookmark this link on your phone or laptop Chrome browser to check live campus buses, train delays, and student carpools before leaving home.
            </p>
          </div>
        </div>

        {/* Right Actions & URL pill */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl max-w-xs md:max-w-md">
            <span className="text-slate-400 text-xs select-none">🌐</span>
            <span className="text-[11px] font-mono text-slate-200 truncate select-all">{appUrl}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all shadow-sm shrink-0"
            title="Copy link to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 hover:bg-slate-100 active:scale-[0.98] text-xs font-bold rounded-xl transition-all shadow-sm shrink-0"
          >
            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
            <span>Open in Chrome</span>
          </a>

          <button
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl transition-colors shrink-0 border border-slate-700"
            title="Scan QR Code to open on mobile"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phone QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};
