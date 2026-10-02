import React from 'react';
import { TopNav } from './components/TopNav';
import { ChromeLinkBanner } from './components/ChromeLinkBanner';
import { LiveTransitRadar } from './components/LiveTransitRadar';
import { DeparturePlanner } from './components/DeparturePlanner';
import { CarpoolBoard } from './components/CarpoolBoard';
import { CrowdsourcedAlerts } from './components/CrowdsourcedAlerts';
import { CommuterWallet } from './components/CommuterWallet';
import { BagChecklist } from './components/BagChecklist';
import { EmergencyHub } from './components/EmergencyHub';
import { AiCommuteCopilot } from './components/AiCommuteCopilot';
import { QrCodeModal } from './components/QrCodeModal';

import {
  INITIAL_TRANSIT_ROUTES,
  INITIAL_SCHEDULE,
  INITIAL_CARPOOLS,
  INITIAL_ALERTS,
  INITIAL_BAG_ITEMS,
} from './data/mockCommuteData';
import { TransitRoute, ClassScheduleItem, CarpoolRide, CommuteAlert, BagItem } from './types';
import { 
  Bus, 
  Clock, 
  MapPin, 
  Sparkles, 
  Navigation, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = React.useState<string>('radar');
  const [appUrl, setAppUrl] = React.useState<string>(
    'https://ais-pre-z5og2sx3u3cjxmeugt57qq-38486606256.asia-southeast1.run.app'
  );

  // Modals
  const [showQrModal, setShowQrModal] = React.useState(false);
  const [showSosModal, setShowSosModal] = React.useState(false);

  // Core Data States
  const [routes, setRoutes] = React.useState<TransitRoute[]>(INITIAL_TRANSIT_ROUTES);
  const [schedule, setSchedule] = React.useState<ClassScheduleItem[]>(INITIAL_SCHEDULE);
  const [carpools, setCarpools] = React.useState<CarpoolRide[]>(INITIAL_CARPOOLS);
  const [alerts, setAlerts] = React.useState<CommuteAlert[]>(INITIAL_ALERTS);
  const [bagItems, setBagItems] = React.useState<BagItem[]>(INITIAL_BAG_ITEMS);
  const [selectedRouteForPlanner, setSelectedRouteForPlanner] = React.useState<TransitRoute | null>(null);

  // Fetch app info on mount to guarantee exact live Chrome URL
  React.useEffect(() => {
    fetch('/api/app-info')
      .then((res) => res.json())
      .then((data) => {
        if (data.appUrl) {
          setAppUrl(data.appUrl);
        }
      })
      .catch(() => {
        // Fallback already pre-configured to public shared URL
      });
  }, []);

  // Live timer tick to decrement route countdowns for realism
  React.useEffect(() => {
    const timer = setInterval(() => {
      setRoutes((prevRoutes) =>
        prevRoutes.map((route) => {
          if (route.nextDepartureMinutes <= 1) {
            return {
              ...route,
              nextDepartureMinutes: route.frequencyMinutes,
              status: 'approaching',
            };
          }
          return {
            ...route,
            nextDepartureMinutes: route.nextDepartureMinutes - 1,
            status: route.nextDepartureMinutes - 1 <= 3 ? 'approaching' : route.status,
          };
        })
      );
    }, 45000); // Ticks every 45s

    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleToggleFavorite = (routeId: string) => {
    setRoutes((prev) =>
      prev.map((r) => (r.id === routeId ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  const handleAddRoute = (newRoute: Omit<TransitRoute, 'id'>) => {
    const created: TransitRoute = {
      ...newRoute,
      id: `route-${Date.now()}`,
    };
    setRoutes((prev) => [created, ...prev]);
  };

  const handleSelectRouteForPlanner = (route: TransitRoute) => {
    setSelectedRouteForPlanner(route);
    setActiveTab('planner');
  };

  const handleAddClass = (newClass: Omit<ClassScheduleItem, 'id'>) => {
    const created: ClassScheduleItem = {
      ...newClass,
      id: `class-${Date.now()}`,
    };
    setSchedule((prev) => [...prev, created]);
  };

  const handleAddRide = (newRide: Omit<CarpoolRide, 'id'>) => {
    const created: CarpoolRide = {
      ...newRide,
      id: `ride-${Date.now()}`,
    };
    setCarpools((prev) => [created, ...prev]);
  };

  const handleUpvoteAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const hasUpvoted = !a.hasUpvoted;
          return {
            ...a,
            hasUpvoted,
            upvotes: hasUpvoted ? a.upvotes + 1 : a.upvotes - 1,
          };
        }
        return a;
      })
    );
  };

  const handleAddAlert = (
    newAlert: Omit<CommuteAlert, 'id' | 'timestamp' | 'upvotes' | 'hasUpvoted'>
  ) => {
    const created: CommuteAlert = {
      ...newAlert,
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
    };
    setAlerts((prev) => [created, ...prev]);
  };

  const handleToggleBagItem = (id: string) => {
    setBagItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddBagItem = (name: string, category: BagItem['category']) => {
    const newItem: BagItem = {
      id: `item-${Date.now()}`,
      name,
      category,
      icon: 'package-check',
      checked: true,
    };
    setBagItems((prev) => [...prev, newItem]);
  };

  const handleResetBagItems = () => {
    setBagItems((prev) => prev.map((item) => ({ ...item, checked: false })));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-amber-400 selection:text-slate-950">
      {/* Top Bar Contract (One Row, Three Zones) */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQr={() => setShowQrModal(true)}
        onOpenSos={() => setShowSosModal(true)}
        alertsCount={alerts.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Prominent Chrome Link Banner with 1-click launch and copy */}
        <ChromeLinkBanner
          appUrl={appUrl}
          onOpenQr={() => setShowQrModal(true)}
        />

        {/* Content Tabs */}
        {activeTab === 'radar' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <LiveTransitRadar
              routes={routes}
              onToggleFavorite={handleToggleFavorite}
              onAddRoute={handleAddRoute}
              onSelectRouteForPlanner={handleSelectRouteForPlanner}
            />

            {/* Quick Bag Checklist preview for morning preparedness */}
            <div className="pt-2">
              <BagChecklist
                items={bagItems}
                onToggleItem={handleToggleBagItem}
                onAddItem={handleAddBagItem}
                onResetItems={handleResetBagItems}
              />
            </div>
          </div>
        )}

        {activeTab === 'planner' && (
          <div className="animate-in fade-in duration-200">
            <DeparturePlanner
              schedule={schedule}
              routes={routes}
              onAddClass={handleAddClass}
              selectedRouteForPlanner={selectedRouteForPlanner}
            />
          </div>
        )}

        {activeTab === 'carpool' && (
          <div className="animate-in fade-in duration-200">
            <CarpoolBoard
              rides={carpools}
              onAddRide={handleAddRide}
            />
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="animate-in fade-in duration-200">
            <CommuterWallet />
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="animate-in fade-in duration-200">
            <CrowdsourcedAlerts
              alerts={alerts}
              onUpvoteAlert={handleUpvoteAlert}
              onAddAlert={handleAddAlert}
            />
          </div>
        )}

        {activeTab === 'copilot' && (
          <div className="animate-in fade-in duration-200">
            <AiCommuteCopilot />
          </div>
        )}
      </main>

      {/* Modals */}
      <QrCodeModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        url={appUrl}
      />

      <EmergencyHub
        isOpen={showSosModal}
        onClose={() => setShowSosModal(false)}
      />

      {/* Quiet, polished footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">CampusCommute</span>
            <span aria-hidden="true">·</span>
            <span>Built for university day scholars</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => setShowQrModal(true)}
              className="hover:text-indigo-600 transition-colors"
            >
              Scan Chrome QR
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <a
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={() => setShowSosModal(true)}
              className="text-rose-600 hover:text-rose-700 font-semibold transition-colors"
            >
              Emergency Helpline
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
