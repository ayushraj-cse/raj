import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Plus, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  PackageCheck,
  CreditCard,
  BatteryCharging,
  Headphones,
  Utensils,
  Umbrella,
  Book,
  Coins
} from 'lucide-react';
import { BagItem } from '../types';

interface BagChecklistProps {
  items: BagItem[];
  onToggleItem: (id: string) => void;
  onAddItem: (name: string, category: BagItem['category']) => void;
  onResetItems: () => void;
}

export const BagChecklist: React.FC<BagChecklistProps> = ({
  items,
  onToggleItem,
  onAddItem,
  onResetItems,
}) => {
  const [newItemName, setNewItemName] = React.useState('');
  const [newItemCategory, setNewItemCategory] = React.useState<BagItem['category']>('essential');
  const [showAddModal, setShowAddModal] = React.useState(false);

  const checkedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((checkedCount / items.length) * 100) || 0;
  const isAllPacked = checkedCount === items.length && items.length > 0;

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'badge':
      case 'credit-card':
        return <CreditCard className="w-4 h-4 text-indigo-600" />;
      case 'battery-charging':
        return <BatteryCharging className="w-4 h-4 text-emerald-600" />;
      case 'headphones':
        return <Headphones className="w-4 h-4 text-purple-600" />;
      case 'utensils':
        return <Utensils className="w-4 h-4 text-amber-600" />;
      case 'umbrella':
        return <Umbrella className="w-4 h-4 text-blue-600" />;
      case 'book':
        return <Book className="w-4 h-4 text-teal-600" />;
      case 'coins':
        return <Coins className="w-4 h-4 text-orange-600" />;
      default:
        return <PackageCheck className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    onAddItem(newItemName.trim(), newItemCategory);
    setNewItemName('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">Day Scholar Bag Checklist</h3>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span className="text-xs text-slate-500 font-medium">Never leave essentials behind</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Since you can't run back to a dorm room, double-check your backpack before boarding transit!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetItems}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            title="Reset checks for tomorrow morning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset for Tomorrow</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Status */}
      <div className="mb-5 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-700">
            Backpack Readiness: {checkedCount} of {items.length} items packed
          </span>
          <span className="font-mono font-bold text-indigo-700">{progressPercent}%</span>
        </div>

        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              isAllPacked ? 'bg-emerald-500' : 'bg-indigo-600'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {isAllPacked && (
          <div className="mt-2.5 flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50/80 p-2 rounded-lg border border-emerald-200">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Packed! You're ready to head out for your morning transit commute.</span>
          </div>
        )}
      </div>

      {/* Item Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggleItem(item.id)}
            className={`text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
              item.checked
                ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                : 'bg-white border-slate-200 hover:border-indigo-300 text-slate-800 shadow-xs'
            }`}
          >
            <div className="shrink-0">
              {item.checked ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span
                className={`text-xs block leading-tight line-clamp-2 ${
                  item.checked ? 'line-through text-slate-400 font-normal' : 'font-semibold text-slate-800'
                }`}
              >
                {item.name}
              </span>
              <span className="text-[10px] text-slate-400 capitalize mt-0.5 block">
                {item.category}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900">Add Essential to Checklist</h3>
            <p className="text-xs text-slate-500 mt-0.5">Custom daily item you cannot forget.</p>

            <form onSubmit={handleAddSubmit} className="mt-3.5 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab Coat, Calculator, Bus Card"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="essential">Essential (ID, Pass, Keys)</option>
                  <option value="electronics">Electronics (Charger, Earphones)</option>
                  <option value="food">Food & Hydration (Lunch, Bottle)</option>
                  <option value="study">Study (Books, Calculator, Drafter)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
