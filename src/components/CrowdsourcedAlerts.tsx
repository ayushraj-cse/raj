import React from 'react';
import { 
  AlertTriangle, 
  ThumbsUp, 
  CloudRain, 
  Car, 
  Wrench, 
  Users, 
  Plus, 
  Clock, 
  Check, 
  ShieldAlert 
} from 'lucide-react';
import { CommuteAlert } from '../types';

interface CrowdsourcedAlertsProps {
  alerts: CommuteAlert[];
  onUpvoteAlert: (alertId: string) => void;
  onAddAlert: (alert: Omit<CommuteAlert, 'id' | 'timestamp' | 'upvotes' | 'hasUpvoted'>) => void;
}

export const CrowdsourcedAlerts: React.FC<CrowdsourcedAlertsProps> = ({
  alerts,
  onUpvoteAlert,
  onAddAlert,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [showAddModal, setShowAddModal] = React.useState(false);

  const [newAlertForm, setNewAlertForm] = React.useState({
    reportedBy: '',
    category: 'traffic' as CommuteAlert['category'],
    title: '',
    description: '',
    routeTag: '',
  });

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedCategory === 'all') return true;
    return alert.category === selectedCategory;
  });

  const getCategoryIcon = (category: CommuteAlert['category']) => {
    switch (category) {
      case 'traffic':
        return <Car className="w-4 h-4 text-amber-600" />;
      case 'weather':
        return <CloudRain className="w-4 h-4 text-blue-600" />;
      case 'breakdown':
        return <Wrench className="w-4 h-4 text-rose-600" />;
      case 'crowd':
        return <Users className="w-4 h-4 text-purple-600" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlertForm.title || !newAlertForm.description) return;

    onAddAlert({
      reportedBy: newAlertForm.reportedBy || 'Day Scholar Student',
      category: newAlertForm.category,
      title: newAlertForm.title,
      description: newAlertForm.description,
      routeTag: newAlertForm.routeTag || 'General Campus Route',
    });

    setShowAddModal(false);
    setNewAlertForm({
      reportedBy: '',
      category: 'traffic',
      title: '',
      description: '',
      routeTag: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Crowdsourced Commute Alerts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time transit pings from fellow day scholars: road diversions, metro gates, heavy rain, and shuttle delays.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post Delay / Hazard Ping</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-x-auto text-xs font-medium w-full sm:w-auto self-start">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Pings ({alerts.length})
        </button>
        <button
          onClick={() => setSelectedCategory('traffic')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            selectedCategory === 'traffic'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Traffic Jam
        </button>
        <button
          onClick={() => setSelectedCategory('weather')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            selectedCategory === 'weather'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Rain & Weather
        </button>
        <button
          onClick={() => setSelectedCategory('crowd')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            selectedCategory === 'crowd'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Crowded Station
        </button>
        <button
          onClick={() => setSelectedCategory('breakdown')}
          className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
            selectedCategory === 'breakdown'
              ? 'bg-slate-900 text-white font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Vehicle Breakdown
        </button>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3.5">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-slate-100 rounded-xl shrink-0 mt-0.5">
                {getCategoryIcon(alert.category)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                    {alert.routeTag}
                  </span>
                  <span className="text-slate-300" aria-hidden="true">·</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {alert.timestamp}
                  </span>
                  <span className="text-slate-300" aria-hidden="true">·</span>
                  <span className="text-xs text-slate-500 font-medium">By {alert.reportedBy}</span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-slate-900 mt-1">
                  {alert.title}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                  {alert.description}
                </p>
              </div>
            </div>

            {/* Upvote & confirmation button */}
            <button
              onClick={() => onUpvoteAlert(alert.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 self-end sm:self-center ${
                alert.hasUpvoted
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Confirm that this alert is accurate"
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${alert.hasUpvoted ? 'fill-emerald-600' : ''}`} />
              <span className="font-mono">{alert.upvotes}</span>
              <span>{alert.hasUpvoted ? 'Confirmed' : 'Confirm'}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Post Alert Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Post Live Commute Hazard / Delay</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Notify students commuting behind you so they can re-route in time.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Category</label>
                <select
                  value={newAlertForm.category}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="traffic">Traffic Jam / Roadwork</option>
                  <option value="weather">Waterlogging / Heavy Rain</option>
                  <option value="crowd">Metro / Bus Gate Heavy Crowd</option>
                  <option value="breakdown">Shuttle / Vehicle Breakdown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Route / Area Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ring Road Flyover / Bus 42 / Gate 3"
                  value={newAlertForm.routeTag}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, routeTag: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alert Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Massive delay due to overturned truck"
                  value={newAlertForm.title}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details & Advice</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Moving 100 meters every 10 mins. Recommend taking Bypass Road instead."
                  value={newAlertForm.description}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name or Department (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Aditya (ECE Dept)"
                  value={newAlertForm.reportedBy}
                  onChange={(e) => setNewAlertForm({ ...newAlertForm, reportedBy: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl transition-colors"
                >
                  Broadcast Ping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
