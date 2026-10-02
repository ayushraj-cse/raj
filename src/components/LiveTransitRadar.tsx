import React from 'react';
import { 
  Bus, 
  Train, 
  Car, 
  Clock, 
  MapPin, 
  Users, 
  Search, 
  Star, 
  Plus, 
  RotateCw, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Navigation,
  ArrowUpRight
} from 'lucide-react';
import { TransitRoute, TransitMode } from '../types';

interface LiveTransitRadarProps {
  routes: TransitRoute[];
  onToggleFavorite: (routeId: string) => void;
  onAddRoute: (newRoute: Omit<TransitRoute, 'id'>) => void;
  onSelectRouteForPlanner: (route: TransitRoute) => void;
}

export const LiveTransitRadar: React.FC<LiveTransitRadarProps> = ({
  routes,
  onToggleFavorite,
  onAddRoute,
  onSelectRouteForPlanner,
}) => {
  const [selectedMode, setSelectedMode] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedRouteId, setExpandedRouteId] = React.useState<string | null>('route-1');
  const [showAddModal, setShowAddModal] = React.useState(false);

  // Form state for adding custom route
  const [newRouteForm, setNewRouteForm] = React.useState({
    name: '',
    routeNumber: '',
    mode: 'bus' as TransitMode,
    origin: '',
    destination: 'Campus Main Gate',
    frequencyMinutes: 15,
    fare: 20,
    stopsText: 'Origin Stop, Market Crossing, Ring Road, Campus Main Gate',
  });

  // Filter routes
  const filteredRoutes = routes.filter((route) => {
    const matchesMode = selectedMode === 'all' || route.mode === selectedMode;
    const matchesSearch =
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.stops.some(stop => stop.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMode && matchesSearch;
  });

  const getModeIcon = (mode: TransitMode) => {
    switch (mode) {
      case 'bus':
        return <Bus className="w-4 h-4 text-amber-600" />;
      case 'metro':
        return <Train className="w-4 h-4 text-indigo-600" />;
      case 'train':
        return <Train className="w-4 h-4 text-emerald-600" />;
      case 'auto':
      case 'carpool':
        return <Car className="w-4 h-4 text-teal-600" />;
      default:
        return <Bus className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteForm.name || !newRouteForm.origin) return;

    const stopsArray = newRouteForm.stopsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    onAddRoute({
      name: newRouteForm.name,
      routeNumber: newRouteForm.routeNumber || 'Custom Route',
      mode: newRouteForm.mode,
      origin: newRouteForm.origin,
      destination: newRouteForm.destination,
      nextDepartureMinutes: 6,
      frequencyMinutes: Number(newRouteForm.frequencyMinutes) || 15,
      status: 'on-time',
      occupancy: 'moderate',
      fare: Number(newRouteForm.fare) || 20,
      stops: stopsArray.length > 0 ? stopsArray : [newRouteForm.origin, newRouteForm.destination],
      currentStopIndex: 0,
      isFavorite: true,
    });

    setShowAddModal(false);
    setNewRouteForm({
      name: '',
      routeNumber: '',
      mode: 'bus',
      origin: '',
      destination: 'Campus Main Gate',
      frequencyMinutes: 15,
      fare: 20,
      stopsText: 'Origin Stop, Market Crossing, Ring Road, Campus Main Gate',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Live Campus Transit Radar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time departures, seat occupancy, and arrival countdowns for day scholar commute lines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold rounded-xl transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add My Route</span>
          </button>
        </div>
      </div>

      {/* Mode Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setSelectedMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedMode === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Transit ({routes.length})
          </button>
          <button
            onClick={() => setSelectedMode('bus')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedMode === 'bus'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Campus Bus
          </button>
          <button
            onClick={() => setSelectedMode('metro')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedMode === 'metro'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Metro Line
          </button>
          <button
            onClick={() => setSelectedMode('train')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedMode === 'train'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Local Train
          </button>
          <button
            onClick={() => setSelectedMode('auto')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              selectedMode === 'auto'
                ? 'bg-white text-slate-900 shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shared Auto
          </button>
        </div>

        {/* Search input */}
        <div className="relative flex-1 md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stops, bus #, or areas..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredRoutes.map((route) => {
          const isExpanded = expandedRouteId === route.id;

          return (
            <div
              key={route.id}
              className={`bg-white rounded-2xl border transition-all ${
                isExpanded
                  ? 'border-indigo-300 shadow-md ring-1 ring-indigo-500/10'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              } p-4 sm:p-5 flex flex-col justify-between`}
            >
              <div>
                {/* Header line */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-slate-100 rounded-xl">
                      {getModeIcon(route.mode)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {route.routeNumber}
                        </span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="text-xs text-slate-500 capitalize">{route.mode}</span>
                        {route.status === 'delayed' && (
                          <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-500" />
                            +{route.delayMinutes}m delay
                          </span>
                        )}
                        {route.status === 'approaching' && (
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Arriving now
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800 line-clamp-1 mt-0.5">
                        {route.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFavorite(route.id)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"
                    title={route.isFavorite ? 'Remove from favorites' : 'Add to daily favorite'}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        route.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Route origin to destination */}
                <div className="my-3 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="text-slate-600 truncate">{route.origin}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-medium text-slate-900 truncate">{route.destination}</span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-slate-700 ml-2 shrink-0">
                    ₹{route.fare}
                  </span>
                </div>

                {/* Live Stats Row */}
                <div className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-3">
                    {/* Departure Countdown */}
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-bold text-slate-900 font-mono text-sm">
                        {route.nextDepartureMinutes === 0
                          ? 'Now'
                          : `${route.nextDepartureMinutes} mins`}
                      </span>
                    </div>

                    <span className="text-slate-300" aria-hidden="true">·</span>

                    <span className="text-slate-500">
                      Every {route.frequencyMinutes}m
                    </span>
                  </div>

                  {/* Seat Occupancy */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>
                      {route.occupancy === 'low' && 'Seats available'}
                      {route.occupancy === 'moderate' && 'Moderate crowd'}
                      {route.occupancy === 'crowded' && 'Standing room only'}
                    </span>
                  </div>
                </div>

                {/* Expanded Route Stops Timeline */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Live Route Progression ({route.stops.length} Stops)
                      </span>
                      <span className="text-[11px] text-indigo-600 font-medium">
                        Vehicle at Stop #{route.currentStopIndex + 1}
                      </span>
                    </div>

                    <div className="relative pl-4 space-y-2 mt-2">
                      {/* Vertical line connecting stops */}
                      <div className="absolute left-[7px] top-1.5 bottom-1.5 w-0.5 bg-slate-200" />

                      {route.stops.map((stop, idx) => {
                        const isCurrent = idx === route.currentStopIndex;
                        const isPast = idx < route.currentStopIndex;

                        return (
                          <div key={idx} className="relative flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-3.5 h-3.5 rounded-full z-10 flex items-center justify-center ${
                                  isCurrent
                                    ? 'bg-indigo-600 ring-4 ring-indigo-100 animate-pulse'
                                    : isPast
                                    ? 'bg-slate-400'
                                    : 'bg-white border-2 border-slate-300'
                                }`}
                              >
                                {isPast && <CheckCircle2 className="w-3 h-3 text-white" />}
                              </div>
                              <span
                                className={`${
                                  isCurrent
                                    ? 'font-bold text-indigo-900'
                                    : isPast
                                    ? 'text-slate-400 line-through'
                                    : 'text-slate-700'
                                }`}
                              >
                                {stop}
                              </span>
                            </div>

                            {isCurrent && (
                              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                Approaching
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setExpandedRouteId(isExpanded ? null : route.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 py-1"
                >
                  <span>{isExpanded ? 'Hide stops' : 'View route stops'}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                <button
                  onClick={() => onSelectRouteForPlanner(route)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <span>Plan with Class</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRoutes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-800">No transit routes found matching query</p>
          <p className="text-xs text-slate-400 mt-1">Try switching transit filters or add your personal commuter route.</p>
        </div>
      )}

      {/* Add Custom Route Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Add Your Daily Commute Route</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add your personal morning bus, local shuttle, or van line to your daily radar.
            </p>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Route Number / Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bus 18, Van 4"
                    value={newRouteForm.routeNumber}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, routeNumber: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Transit Type</label>
                  <select
                    value={newRouteForm.mode}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, mode: e.target.value as TransitMode })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="bus">Campus Bus / City Bus</option>
                    <option value="metro">Metro / Subway</option>
                    <option value="train">Suburban Local Train</option>
                    <option value="auto">Shared Auto / Van</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Route Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 15 Direct College Express"
                  value={newRouteForm.name}
                  onChange={(e) => setNewRouteForm({ ...newRouteForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Boarding Stop (Origin)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Model Town Market"
                    value={newRouteForm.origin}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, origin: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Drop-off (Destination)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Engineering Gate 1"
                    value={newRouteForm.destination}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, destination: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Stops List (comma separated)</label>
                <input
                  type="text"
                  placeholder="Stop 1, Stop 2, Stop 3, Campus Gate"
                  value={newRouteForm.stopsText}
                  onChange={(e) => setNewRouteForm({ ...newRouteForm, stopsText: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Frequency (minutes)</label>
                  <input
                    type="number"
                    min="2"
                    max="120"
                    value={newRouteForm.frequencyMinutes}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, frequencyMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">One-Way Fare (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newRouteForm.fare}
                    onChange={(e) => setNewRouteForm({ ...newRouteForm, fare: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
