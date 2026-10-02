import React from 'react';
import { ShieldAlert, QrCode, Menu, X, Share2, Sparkles } from 'lucide-react';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQr: () => void;
  onOpenSos: () => void;
  alertsCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenQr,
  onOpenSos,
  alertsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'radar', label: 'Transit Radar' },
    { id: 'planner', label: 'Class Planner' },
    { id: 'carpool', label: 'Carpool & Rides' },
    { id: 'wallet', label: 'Pass & Wallet' },
    { id: 'alerts', label: `Alerts (${alertsCount})` },
    { id: 'copilot', label: 'AI Copilot' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setActiveTab('radar')}
            className="text-xl font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors flex items-center gap-1.5 focus:outline-none"
          >
            <span>CampusCommute</span>
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors py-1 relative ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenQr}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Open or share link for Chrome"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Chrome Link</span>
            </button>

            <button
              onClick={onOpenSos}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
              title="Emergency Campus SOS & Safety Contacts"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>SOS</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {item.id === 'copilot' && (
                  <Sparkles className="w-4 h-4 text-amber-500" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
