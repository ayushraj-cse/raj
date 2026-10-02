import React from 'react';
import { 
  CreditCard, 
  Wallet, 
  PiggyBank, 
  Plus, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Receipt,
  RotateCcw
} from 'lucide-react';
import { ExpenseRecord } from '../types';

export const CommuterWallet: React.FC = () => {
  const [smartCardBalance, setSmartCardBalance] = React.useState<number>(245);
  const [passDaysRemaining, setPassDaysRemaining] = React.useState<number>(14);
  const [expenses, setExpenses] = React.useState<ExpenseRecord[]>([
    { id: '1', date: 'Today, 08:30 AM', mode: 'Metro Blue Line M1', amount: 30, notes: 'Morning college ride' },
    { id: '2', date: 'Today, 08:10 AM', mode: 'Shared E-Rickshaw', amount: 15, notes: 'Metro station to Gate 2' },
    { id: '3', date: 'Yesterday, 05:20 PM', mode: 'Campus Shuttle 101', amount: 15, notes: 'Return home transit' },
    { id: '4', date: 'Yesterday, 05:45 PM', mode: 'Metro Blue Line M1', amount: 30, notes: 'Evening return metro' },
  ]);

  const [showLogModal, setShowLogModal] = React.useState(false);
  const [newExpense, setNewExpense] = React.useState({
    mode: 'Campus Bus Shuttle',
    amount: 15,
    notes: 'Morning ticket',
  });

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const estimatedMonthlyCabCost = 2800; // cabs would cost ₹2,800
  const totalCommuterPassSavings = estimatedMonthlyCabCost - (totalSpent * 6); // projected monthly savings

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const record: ExpenseRecord = {
      id: Date.now().toString(),
      date: 'Just now',
      mode: newExpense.mode,
      amount: Number(newExpense.amount) || 15,
      notes: newExpense.notes || 'Daily commute',
    };
    setExpenses([record, ...expenses]);
    setSmartCardBalance((prev) => Math.max(0, prev - Number(newExpense.amount)));
    setShowLogModal(false);
  };

  const handleRecharge = (amount: number) => {
    setSmartCardBalance((prev) => prev + amount);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Commuter Wallet & Transit Pass
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your monthly campus pass validity, track smart card balance, and log daily transit expenses.
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pass Validity Card */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-sm border border-indigo-800/40 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Student Transit Pass
            </span>
            <span className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-300">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-3 mb-1">
            <div className="text-3xl font-black font-mono text-white">
              {passDaysRemaining} Days Left
            </div>
            <p className="text-xs text-indigo-200 mt-0.5">
              Valid through Oct 16, 2026 (Subsidized Student Route Pass)
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-800/60 flex items-center justify-between text-xs">
            <span className="text-indigo-300">Auto-Renewal: Active</span>
            <button
              onClick={() => setPassDaysRemaining((p) => p + 30)}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline"
            >
              Extend 30 Days
            </button>
          </div>
        </div>

        {/* Smart Card Balance Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Metro & Bus Smart Card
            </span>
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-600">
              <Wallet className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-3 mb-1">
            <div className="text-3xl font-black font-mono text-slate-900">
              ₹{smartCardBalance}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Approx. {Math.floor(smartCardBalance / 30)} Metro rides left
            </p>
          </div>

          {/* Quick recharge buttons */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => handleRecharge(100)}
              className="flex-1 py-1 px-2 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
            >
              + ₹100
            </button>
            <button
              onClick={() => handleRecharge(200)}
              className="flex-1 py-1 px-2 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
            >
              + ₹200
            </button>
            <button
              onClick={() => handleRecharge(500)}
              className="flex-1 py-1 px-2 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
            >
              + ₹500
            </button>
          </div>
        </div>

        {/* Savings vs Cabs Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Monthly Student Savings
            </span>
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <PiggyBank className="w-4 h-4" />
            </span>
          </div>

          <div className="mt-3 mb-1">
            <div className="text-3xl font-black font-mono text-emerald-600">
              ₹{totalCommuterPassSavings > 0 ? totalCommuterPassSavings : 1950}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Saved this month vs daily app-based private cabs
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Daily Budget: ₹50 / day</span>
            <span className="text-emerald-600 font-semibold">Under Budget ✓</span>
          </div>
        </div>
      </div>

      {/* Expense History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Recent Transit Fares Log</h3>
            <p className="text-xs text-slate-400 mt-0.5">Keep track of your bus tokens, metro debits, and auto-pool splits.</p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Transit Fare</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[11px]">
                <th className="pb-2.5 font-semibold">Date & Time</th>
                <th className="pb-2.5 font-semibold">Mode / Transit Line</th>
                <th className="pb-2.5 font-semibold">Notes</th>
                <th className="pb-2.5 font-semibold text-right">Fare Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 text-slate-500 font-mono">{exp.date}</td>
                  <td className="py-3 font-semibold text-slate-800">{exp.mode}</td>
                  <td className="py-3 text-slate-500">{exp.notes}</td>
                  <td className="py-3 text-right font-mono font-bold text-slate-900">
                    ₹{exp.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-lg font-bold text-slate-900">Log Travel Expense</h3>
            <p className="text-xs text-slate-500 mt-0.5">Record a transit fare into your commuter ledger.</p>

            <form onSubmit={handleAddExpense} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Transit Mode</label>
                <select
                  value={newExpense.mode}
                  onChange={(e) => setNewExpense({ ...newExpense, mode: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="Campus Shuttle 101">Campus Shuttle 101 (₹15)</option>
                  <option value="Metro Blue Line M1">Metro Blue Line M1 (₹30)</option>
                  <option value="Suburban Local Train">Suburban Local Train (₹10)</option>
                  <option value="Shared Auto / Van">Shared Auto / Van (₹20)</option>
                  <option value="Carpool Fuel Share">Carpool Fuel Share (₹30)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Return ride from library"
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
