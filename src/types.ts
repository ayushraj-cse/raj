export type TransitMode = 'bus' | 'metro' | 'train' | 'carpool' | 'auto';

export interface TransitRoute {
  id: string;
  name: string;
  routeNumber: string;
  mode: TransitMode;
  origin: string;
  destination: string;
  nextDepartureMinutes: number; // e.g. 4 minutes
  frequencyMinutes: number; // e.g. every 12 mins
  status: 'on-time' | 'delayed' | 'approaching';
  delayMinutes?: number;
  occupancy: 'low' | 'moderate' | 'crowded';
  fare: number;
  stops: string[];
  currentStopIndex: number;
  isFavorite?: boolean;
}

export interface ClassScheduleItem {
  id: string;
  subject: string;
  room: string;
  instructor: string;
  startTime: string; // e.g. "09:00"
  endTime: string; // e.g. "10:15"
  building: string;
  day: string;
}

export interface CarpoolRide {
  id: string;
  studentName: string;
  studentDegree: string;
  verifiedStudent: boolean;
  avatarBg: string;
  vehicleType: 'Car (4 Seats)' | 'Bike / Scooter' | 'Shared Auto Cab';
  origin: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  costPerSeat: number;
  notes: string;
  contactMethod: string;
  femaleOnly?: boolean;
}

export interface CommuteAlert {
  id: string;
  reportedBy: string;
  category: 'traffic' | 'weather' | 'breakdown' | 'crowd';
  title: string;
  description: string;
  routeTag: string;
  timestamp: string;
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface ExpenseRecord {
  id: string;
  date: string;
  mode: string;
  amount: number;
  notes: string;
}

export interface BagItem {
  id: string;
  name: string;
  category: 'essential' | 'electronics' | 'study' | 'food';
  icon: string;
  checked: boolean;
}
