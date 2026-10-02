import React from 'react';
import { 
  Clock, 
  MapPin, 
  Calendar, 
  Bell, 
  Volume2, 
  ShieldCheck, 
  Plus, 
  Check, 
  Footprints, 
  Navigation2,
  AlertTriangle
} from 'lucide-react';
import { ClassScheduleItem, TransitRoute } from '../types';

interface DeparturePlannerProps {
  schedule: ClassScheduleItem[];
  routes: TransitRoute[];
  onAddClass: (newClass: Omit<ClassScheduleItem, 'id'>) => void;
  selectedRouteForPlanner?: TransitRoute | null;
}

export const DeparturePlanner: React.FC<DeparturePlannerProps> = ({
  schedule,
  routes,
  onAddClass,
  selectedRouteForPlanner,
}) => {
  const [selectedClassId, setSelectedClassId] = React.useState<string>(schedule[0]?.id || '');
  const [homeLocation, setHomeLocation] = React.useState('Green Park / North Gate Sector');
  const [travelDurationMins, setTravelDurationMins] = React.useState<number>(35);
  const [campusWalkBufferMins, setCampusWalkBufferMins] = React.useState<number>(10);
  const [safetyBufferMins, setSafetyBufferMins] = React.useState<number>(10);
  const [alarmActive, setAlarmActive] = React.useState(false);
  const [alarmTriggered, setAlarmTriggered] = React.useState(false);
  const [showAddClassModal, setShowAddClassModal] = React.useState(false);

  // New class form
  const [newClassForm, setNewClassForm] = React.useState({
    subject: '',
    room: '',
    instructor: '',
    startTime: '09:00',
    endTime: '10:15',
    building: 'Main Academic Block',
    day: 'Today',
  });

  const activeClass = schedule.find((c) => c.id === selectedClassId) || schedule[0];

  // Calculate target departure
  const calculateDeparture = () => {
    if (!activeClass) return { departureTimeStr: '08:05 AM', totalPrepMins: 55 };

    const [classHourStr, classMinStr] = activeClass.startTime.split(':');
    const classHour = parseInt(classHourStr, 10);
    const classMin = parseInt(classMinStr, 10);

    const classTotalMinutes = classHour * 60 + classMin;
    const totalDeduction = travelDurationMins + campusWalkBufferMins + safetyBufferMins;
    const departureTotalMinutes = classTotalMinutes - totalDeduction;

    const depHour24 = Math.floor(departureTotalMinutes / 60);
    const depMin = departureTotalMinutes % 60;

    const period = depHour24 >= 12 ? 'PM' : 'AM';
    const depHour12 = depHour24 % 12 === 0 ? 12 : depHour24 % 12;
    const departureTimeStr = `${String(depHour12).padStart(2, '0')}:${String(depMin).padStart(2, '0')} ${period}`;

    return {
      departureTimeStr,
      totalBufferMins: campusWalkBufferMins + safetyBufferMins,
      depHour24,
      depMin,
    };
  };

  const { departureTimeStr, totalBufferMins } = calculateDeparture();

  const handleSoundTest = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.5);
      setAlarmTriggered(true);
      setTimeout(() => setAlarmTriggered(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassForm.subject || !newClassForm.startTime) return;

    onAddClass(newClassForm);
    setShowAddClassModal(false);
    setNewClassForm({
      subject: '',
      room: '',
      instructor: '',
      startTime: '09:00',
      endTime: '10:15',
      building: 'Main Academic Block',
      day: 'Today',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Class & Departure Sync
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            "Will I reach on time?" Reverse-engineer your exact home departure time based on lecture hall location and transit delays.
          </p>
        </div>

        <button
          onClick={() => setShowAddClassModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lecture / Lab</span>
        </button>
      </div>

      {/* Main Grid: Class Selector & Commute Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Class Schedule (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                Select Today's Class Target
              </span>
              <span className="text-xs text-slate-400 font-medium">{schedule.length} Lectures</span>
            </div>

            <div className="space-y-2.5">
              {schedule.map((item) => {
                const isSelected = item.id === selectedClassId;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedClassId(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 shadow-sm ring-1 ring-indigo-500/20'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                        {item.startTime}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.room}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 mt-1.5">{item.subject}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span>{item.building}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.instructor}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Commute parameters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Commute Parameters
            </h4>

            {/* Travel Mode & Duration */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Transit Vehicle Time (Door to Campus Gate)
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs font-medium">
                {[20, 30, 40, 50].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setTravelDurationMins(mins)}
                    className={`py-2 rounded-xl border text-center transition-colors ${
                      travelDurationMins === mins
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {mins} mins
                  </button>
                ))}
              </div>
            </div>

            {/* Campus Walking Buffer */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Campus Gate to Lecture Hall Walk</span>
                <span className="font-mono text-indigo-600 font-bold">{campusWalkBufferMins} min walk</span>
              </label>
              <div className="flex items-center gap-2">
                {[5, 10, 15, 20].map((walk) => (
                  <button
                    key={walk}
                    onClick={() => setCampusWalkBufferMins(walk)}
                    className={`flex-1 py-1.5 text-xs rounded-xl border text-center transition-colors ${
                      campusWalkBufferMins === walk
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {walk}m
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: Engineering and Medical blocks are ~12 mins walk from Main Bus Bay.
              </p>
            </div>

            {/* Rush Hour & Traffic Buffer */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Traffic & Security Gate Cushion</span>
                <span className="font-mono text-amber-700 font-bold">+{safetyBufferMins}m buffer</span>
              </label>
              <input
                type="range"
                min="0"
                max="25"
                step="5"
                value={safetyBufferMins}
                onChange={(e) => setSafetyBufferMins(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Departure Blueprint (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-indigo-800/40 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Navigation2 className="w-3.5 h-3.5 text-amber-400" />
                  Recommended Home Departure
                </span>
                <span className="text-xs text-indigo-300 font-medium">
                  {activeClass?.subject} at {activeClass?.startTime}
                </span>
              </div>

              {/* Big Departure Time Display */}
              <div className="mt-4 mb-2 flex items-baseline gap-3">
                <h2 className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                  {departureTimeStr}
                </h2>
                <span className="text-xs text-indigo-200">
                  Step out the door by this minute
                </span>
              </div>

              <p className="text-xs text-indigo-200/90 leading-relaxed max-w-xl">
                Gives you exactly <strong className="text-white">{travelDurationMins}m</strong> for transit, <strong className="text-white">{campusWalkBufferMins}m</strong> walking from campus gate to <strong className="text-white">{activeClass?.room}</strong>, and <strong className="text-white">{safetyBufferMins}m</strong> cushion for ticket queues.
              </p>

              {/* Quick Departure Alarm Trigger */}
              <div className="mt-5 pt-4 border-t border-indigo-800/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAlarmActive(!alarmActive)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                      alarmActive
                        ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                        : 'bg-indigo-800/80 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{alarmActive ? 'Alarm Enabled (Chime On)' : 'Set Departure Alarm'}</span>
                  </button>

                  <button
                    onClick={handleSoundTest}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-900/60 rounded-xl transition-colors border border-indigo-700/50"
                    title="Test audio chime"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Test Chime</span>
                  </button>
                </div>

                {alarmTriggered && (
                  <span className="text-xs text-amber-300 font-medium animate-bounce">
                    🔔 Chime test sound played!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Commute Timeline Step-by-Step */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
              Your Journey Itinerary Blueprint
            </h4>

            <div className="relative pl-6 space-y-4">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200" />

              {/* Step 1 */}
              <div className="relative flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-[11px] flex items-center justify-center font-bold shrink-0 z-10 shadow-sm">
                  1
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{departureTimeStr}</span>
                    <span className="text-slate-400" aria-hidden="true">·</span>
                    <span className="text-xs font-semibold text-indigo-700">Depart Home</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lock door, ensure ID card & packed lunch in bag. Walk 5 mins to local transit stop.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-mono text-[11px] flex items-center justify-center font-bold shrink-0 z-10 shadow-sm">
                  2
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">En Route ({travelDurationMins}m)</span>
                    <span className="text-slate-400" aria-hidden="true">·</span>
                    <span className="text-xs font-semibold text-slate-700">Campus Transit Transit Ride</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Board Campus Shuttle 101 or Metro Line. Listen to study audio notes or review lecture slides.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-white font-mono text-[11px] flex items-center justify-center font-bold shrink-0 z-10 shadow-sm">
                  3
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">Campus Gate</span>
                    <span className="text-slate-400" aria-hidden="true">·</span>
                    <span className="text-xs font-semibold text-slate-700">Arrival & Security Gate</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Flash College ID at entrance turnstiles. Cross central avenue toward {activeClass?.building}.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-mono text-[11px] flex items-center justify-center font-bold shrink-0 z-10 shadow-sm">
                  ✓
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700">{activeClass?.startTime} Sharp</span>
                    <span className="text-slate-400" aria-hidden="true">·</span>
                    <span className="text-xs font-semibold text-emerald-700">Arrive Inside {activeClass?.room}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Comfortably seated before attendance is taken with zero rush or sweat!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Add Class / Lab to Timetable</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sync your lecture times to get personalized morning departure alerts.
            </p>

            <form onSubmit={handleAddClassSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems / Thermodynamics"
                  value={newClassForm.subject}
                  onChange={(e) => setNewClassForm({ ...newClassForm, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    required
                    value={newClassForm.startTime}
                    onChange={(e) => setNewClassForm({ ...newClassForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="time"
                    required
                    value={newClassForm.endTime}
                    onChange={(e) => setNewClassForm({ ...newClassForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Hall</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hall 401 / Lab 2"
                    value={newClassForm.room}
                    onChange={(e) => setNewClassForm({ ...newClassForm, room: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Building</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Block"
                    value={newClassForm.building}
                    onChange={(e) => setNewClassForm({ ...newClassForm, building: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instructor / Professor</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Ramanujan"
                  value={newClassForm.instructor}
                  onChange={(e) => setNewClassForm({ ...newClassForm, instructor: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  Save Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
