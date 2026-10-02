import React from 'react';
import { 
  Car, 
  Users, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Filter, 
  Phone, 
  Mail, 
  Check, 
  Search, 
  UserCheck,
  MessageSquare
} from 'lucide-react';
import { CarpoolRide } from '../types';

interface CarpoolBoardProps {
  rides: CarpoolRide[];
  onAddRide: (ride: Omit<CarpoolRide, 'id'>) => void;
}

export const CarpoolBoard: React.FC<CarpoolBoardProps> = ({ rides, onAddRide }) => {
  const [filterFemaleOnly, setFilterFemaleOnly] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedRide, setSelectedRide] = React.useState<CarpoolRide | null>(null);
  const [showOfferModal, setShowOfferModal] = React.useState(false);
  const [requestedRides, setRequestedRides] = React.useState<Record<string, boolean>>({});

  const [newRideForm, setNewRideForm] = React.useState({
    studentName: '',
    studentDegree: 'B.Tech / 3rd Year',
    vehicleType: 'Car (4 Seats)' as CarpoolRide['vehicleType'],
    origin: '',
    destination: 'Campus Engineering Gate',
    departureTime: '08:15 AM',
    availableSeats: 3,
    costPerSeat: 30,
    femaleOnly: false,
    notes: 'Sharing fuel expenses. Polite commuters welcome!',
    contactMethod: 'student.email@campus.edu / Phone',
  });

  const filteredRides = rides.filter((ride) => {
    const matchesFemale = !filterFemaleOnly || ride.femaleOnly;
    const matchesSearch =
      ride.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ride.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFemale && matchesSearch;
  });

  const handleRequestSeat = (rideId: string) => {
    setRequestedRides((prev) => ({ ...prev, [rideId]: true }));
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRideForm.studentName || !newRideForm.origin) return;

    onAddRide({
      studentName: newRideForm.studentName,
      studentDegree: newRideForm.studentDegree,
      verifiedStudent: true,
      avatarBg: 'bg-indigo-600',
      vehicleType: newRideForm.vehicleType,
      origin: newRideForm.origin,
      destination: newRideForm.destination,
      departureTime: newRideForm.departureTime,
      availableSeats: Number(newRideForm.availableSeats) || 2,
      costPerSeat: Number(newRideForm.costPerSeat) || 30,
      femaleOnly: newRideForm.femaleOnly,
      notes: newRideForm.notes,
      contactMethod: newRideForm.contactMethod,
    });

    setShowOfferModal(false);
    setNewRideForm({
      studentName: '',
      studentDegree: 'B.Tech / 3rd Year',
      vehicleType: 'Car (4 Seats)',
      origin: '',
      destination: 'Campus Engineering Gate',
      departureTime: '08:15 AM',
      availableSeats: 3,
      costPerSeat: 30,
      femaleOnly: false,
      notes: 'Sharing fuel expenses. Polite commuters welcome!',
      contactMethod: 'student.email@campus.edu / Phone',
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Campus Carpool & Ride Share
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect with verified college peers traveling along your neighborhood. Cut travel costs, bypass crowds, and make friends.
          </p>
        </div>

        <button
          onClick={() => setShowOfferModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Offer a Ride / Split Cab</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search neighborhood or pickup point..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterFemaleOnly(!filterFemaleOnly)}
            className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors border ${
              filterFemaleOnly
                ? 'bg-rose-50 text-rose-700 border-rose-200 font-semibold'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {filterFemaleOnly ? '✓ Female Co-travelers Only' : 'Female-Only Rides'}
          </button>
        </div>
      </div>

      {/* Rides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRides.map((ride) => {
          const isRequested = requestedRides[ride.id];

          return (
            <div
              key={ride.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 p-4 sm:p-5 shadow-sm flex flex-col justify-between transition-all"
            >
              <div>
                {/* Student info header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl ${ride.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      {ride.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900">{ride.studentName}</span>
                        {ride.verifiedStudent && (
                          <span title="Verified College Student" className="text-indigo-600">
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block">{ride.studentDegree}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                    ₹{ride.costPerSeat} / seat
                  </span>
                </div>

                {/* Ride details badge */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="font-medium text-slate-700">{ride.vehicleType}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 text-indigo-700 font-semibold">
                    <Users className="w-3 h-3" /> {ride.availableSeats} seats free
                  </span>
                  {ride.femaleOnly && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-rose-600 font-semibold text-[11px]">Female Only</span>
                    </>
                  )}
                </div>

                {/* Pickup and dropoff points */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs mb-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Pickup</span>
                      <span className="font-medium text-slate-800">{ride.origin}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Drop-off</span>
                      <span className="font-medium text-slate-800">{ride.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Departs {ride.departureTime}</span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed italic bg-slate-50/60 p-2 rounded-lg border border-slate-100">
                  "{ride.notes}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedRide(ride)}
                  className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors text-center"
                >
                  Contact Rider
                </button>

                <button
                  onClick={() => handleRequestSeat(ride.id)}
                  disabled={isRequested}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-xl transition-all text-center flex items-center justify-center gap-1 ${
                    isRequested
                      ? 'bg-emerald-100 text-emerald-800 cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                  }`}
                >
                  {isRequested ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Seat Reserved</span>
                    </>
                  ) : (
                    <span>Request Seat</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRides.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-800">No student carpools found for this filter</p>
          <p className="text-xs text-slate-400 mt-1">Be the first to offer a ride from your neighborhood!</p>
        </div>
      )}

      {/* Contact Details Modal */}
      {selectedRide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Connect with {selectedRide.studentName}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified {selectedRide.studentDegree} commuter.
            </p>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Contact Details</span>
                <span className="font-semibold text-slate-800">{selectedRide.contactMethod}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Pickup Point</span>
                <span className="text-slate-700">{selectedRide.origin} at {selectedRide.departureTime}</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hi ${selectedRide.studentName}, I saw your CampusCommute ride offer from ${selectedRide.origin} to campus. Is 1 seat still open?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedRide(null)}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offer a Ride Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Post a Student Carpool / Shared Cab</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Help your day scholar batchmates travel safer and split fuel costs.
            </p>

            <form onSubmit={handleSubmitOffer} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Joshi"
                  value={newRideForm.studentName}
                  onChange={(e) => setNewRideForm({ ...newRideForm, studentName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degree / Branch</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech CS 2nd Year"
                    value={newRideForm.studentDegree}
                    onChange={(e) => setNewRideForm({ ...newRideForm, studentDegree: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Type</label>
                  <select
                    value={newRideForm.vehicleType}
                    onChange={(e) => setNewRideForm({ ...newRideForm, vehicleType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                  >
                    <option value="Car (4 Seats)">Car (4 Seats)</option>
                    <option value="Bike / Scooter">Bike / Scooter</option>
                    <option value="Shared Auto Cab">Shared Auto Cab</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Neighborhood</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sector 14 Crossing"
                    value={newRideForm.origin}
                    onChange={(e) => setNewRideForm({ ...newRideForm, origin: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Drop Point</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Gate 1"
                    value={newRideForm.destination}
                    onChange={(e) => setNewRideForm({ ...newRideForm, destination: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Departure</label>
                  <input
                    type="text"
                    required
                    placeholder="08:15 AM"
                    value={newRideForm.departureTime}
                    onChange={(e) => setNewRideForm({ ...newRideForm, departureTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Free Seats</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newRideForm.availableSeats}
                    onChange={(e) => setNewRideForm({ ...newRideForm, availableSeats: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fuel Share (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newRideForm.costPerSeat}
                    onChange={(e) => setNewRideForm({ ...newRideForm, costPerSeat: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Email / Phone</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. vikram.j@college.edu or 98765 00000"
                  value={newRideForm.contactMethod}
                  onChange={(e) => setNewRideForm({ ...newRideForm, contactMethod: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="femaleOnlyCheck"
                  checked={newRideForm.femaleOnly}
                  onChange={(e) => setNewRideForm({ ...newRideForm, femaleOnly: e.target.checked })}
                  className="rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                />
                <label htmlFor="femaleOnlyCheck" className="text-xs text-slate-700 cursor-pointer">
                  Female co-passengers only
                </label>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  Publish Ride
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
