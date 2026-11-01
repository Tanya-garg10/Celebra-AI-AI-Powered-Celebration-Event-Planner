import React, { useState } from 'react';
import {
  LayoutGrid,
  PlusCircle,
  Trash2,
  Users,
  Move,
  Maximize2,
  Check,
  X,
  Compass,
  Building,
  RotateCw
} from 'lucide-react';
import { CelebrationEvent, SeatingLayout, SeatingZone } from '../types.ts';

interface SeatingPlannerProps {
  event: CelebrationEvent;
  onUpdateSeating?: (layout: SeatingLayout) => void;
  onUpdateLayout?: (layout: SeatingLayout) => void;
}

const DEFAULT_ZONES: SeatingZone[] = [
  { id: 'z-stage', type: 'stage', name: 'Main Ceremonial Stage', x: 50, y: 15, seats: 6, assignedGuestNames: ['Couple / Hosts'] },
  { id: 'z-table1', type: 'table-round', name: 'Table 1 - VIP Elders', x: 25, y: 40, seats: 8, assignedGuestNames: ['Rajesh Mehra', 'Sunita Mehra'] },
  { id: 'z-table2', type: 'table-round', name: 'Table 2 - Family Circle', x: 50, y: 40, seats: 8, assignedGuestNames: ['Singhania Family'] },
  { id: 'z-table3', type: 'table-round', name: 'Table 3 - Friends Enclave', x: 75, y: 40, seats: 8, assignedGuestNames: ['College Friends'] },
  { id: 'z-dance', type: 'dancefloor', name: 'Central Dance Arena', x: 50, y: 65, seats: 0, assignedGuestNames: [] },
  { id: 'z-bar', type: 'bar', name: 'Mocktail & Cocktail Bar', x: 85, y: 70, seats: 0, assignedGuestNames: [] },
  { id: 'z-photo', type: 'photobooth', name: 'Floral Photo Vignette', x: 15, y: 70, seats: 0, assignedGuestNames: [] },
  { id: 'z-entrance', type: 'entrance', name: 'Grand Welcome Foyer', x: 50, y: 90, seats: 0, assignedGuestNames: [] }
];

export const SeatingPlanner: React.FC<SeatingPlannerProps> = ({
  event,
  onUpdateSeating,
  onUpdateLayout,
}) => {
  const currentLayout: SeatingLayout = event.seatingLayout || {
    venueDimensions: '35m x 25m Main Celebration Area',
    totalSeatsPlaced: 180,
    zones: DEFAULT_ZONES
  };

  const saveLayout = (layout: SeatingLayout) => {
    if (onUpdateLayout) onUpdateLayout(layout);
    else if (onUpdateSeating) onUpdateSeating(layout);
  };

  const [zones, setZones] = useState<SeatingZone[]>(currentLayout.zones);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(zones[0]?.id || null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Zone Form
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<SeatingZone['type']>('table-round');
  const [formSeats, setFormSeats] = useState(8);

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  const totalSeated = zones.reduce((s, z) => s + (z.seats || 0), 0);
  const tableCount = zones.filter((z) => z.type === 'table-round' || z.type === 'table-long').length;

  const handleUpdateZone = (id: string, updates: Partial<SeatingZone>) => {
    const updated = zones.map((z) => (z.id === id ? { ...z, ...updates } : z));
    setZones(updated);
    saveLayout({
      ...currentLayout,
      totalSeatsPlaced: updated.reduce((s, z) => s + (z.seats || 0), 0),
      zones: updated
    });
  };

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newZone: SeatingZone = {
      id: `zone-${Date.now()}`,
      type: formType,
      name: formName.trim(),
      x: 50,
      y: 50,
      seats: Number(formSeats) || 0,
      assignedGuestNames: []
    };

    const updated = [...zones, newZone];
    setZones(updated);
    setSelectedZoneId(newZone.id);
    saveLayout({
      ...currentLayout,
      totalSeatsPlaced: updated.reduce((s, z) => s + (z.seats || 0), 0),
      zones: updated
    });
    setIsAddModalOpen(false);
    setFormName('');
  };

  const handleDeleteZone = (id: string) => {
    if (window.confirm('Delete this zone from the venue floorplan?')) {
      const updated = zones.filter((z) => z.id !== id);
      setZones(updated);
      setSelectedZoneId(updated[0]?.id || null);
      saveLayout({
        ...currentLayout,
        totalSeatsPlaced: updated.reduce((s, z) => s + (z.seats || 0), 0),
        zones: updated
      });
    }
  };

  const getZoneColor = (type: SeatingZone['type']) => {
    switch (type) {
      case 'stage':
      case 'mandap':
        return 'bg-purple-700 text-white border-purple-800';
      case 'table-round':
      case 'table-long':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'dancefloor':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'bar':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'photobooth':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'entrance':
        return 'bg-stone-800 text-white border-stone-900';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Smart Venue & Seating Layout Planner
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Visual 2D floorplan planner calculating guest seating ratios, stage positioning, dancefloors, and dining corridors.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-rose-300" />
            <span>Add Venue Zone</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-stone-400">Total Placed Seats</p>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-1">{totalSeated} Seats</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Target: {event.guestCount} guests</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-stone-400">Dining Tables</p>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-1">{tableCount} Tables</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Round & Banquet format</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-stone-400">Venue Footprint</p>
          <p className="font-serif text-base font-bold text-stone-900 mt-1 truncate">{currentLayout.venueDimensions}</p>
          <p className="text-[11px] text-purple-700 font-medium mt-0.5">{event.venuePreference} layout</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-xs">
          <p className="text-[10px] font-bold uppercase text-emerald-800">Seating Capacity</p>
          <p className="font-serif text-2xl font-bold text-emerald-950 mt-1">
            {Math.round((totalSeated / (event.guestCount || 1)) * 100)}%
          </p>
          <p className="text-[11px] text-emerald-800 mt-0.5">Of expected attendee scale</p>
        </div>
      </div>

      {/* Interactive Visual 2D Canvas & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual 2D Floorplan Canvas */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#F5F2EB]/70 border-2 border-stone-200 shadow-inner relative min-h-[460px] overflow-hidden select-none">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#D6D3D1_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-60" />

          {/* Compass & Axis markers */}
          <div className="absolute top-3 left-4 text-[10px] font-bold uppercase text-stone-400 tracking-wider flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>North Stage Direction</span>
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase text-stone-400 tracking-wider">
            Entrance & Guest Flow
          </div>

          {/* Zones rendered on 2D map */}
          {zones.map((zone) => {
            const isSelected = zone.id === selectedZoneId;
            const isRound = zone.type === 'table-round';
            const colorClass = getZoneColor(zone.type);

            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZoneId(zone.id)}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute p-2.5 rounded-2xl border cursor-pointer transition-transform hover:scale-105 shadow-sm text-center ${colorClass} ${
                  isSelected ? 'ring-3 ring-purple-600 shadow-lg scale-105 z-10' : ''
                } ${isRound ? 'w-24 h-24 rounded-full flex flex-col items-center justify-center' : 'min-w-[110px]'}`}
              >
                <p className="text-[11px] font-bold leading-tight truncate max-w-[90px]">
                  {zone.name}
                </p>
                {zone.seats > 0 && (
                  <p className="text-[9px] opacity-80 mt-0.5">
                    {zone.seats} seats
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Zone Inspector & Editor */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4">
          {selectedZone ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                    Zone Inspector
                  </span>
                  <h4 className="font-serif text-lg font-bold text-stone-900 mt-1">
                    {selectedZone.name}
                  </h4>
                </div>

                <button
                  onClick={() => handleDeleteZone(selectedZone.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove Zone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Name Edit */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Zone Label
                </label>
                <input
                  type="text"
                  value={selectedZone.name}
                  onChange={(e) => handleUpdateZone(selectedZone.id, { name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold outline-hidden"
                />
              </div>

              {/* Seats Count */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Seat Capacity
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={selectedZone.seats}
                  onChange={(e) => handleUpdateZone(selectedZone.id, { seats: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold outline-hidden"
                />
              </div>

              {/* Position Coordinate Sliders */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-stone-500">
                    <span>Horizontal Position (X)</span>
                    <span>{selectedZone.x}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={selectedZone.x}
                    onChange={(e) => handleUpdateZone(selectedZone.id, { x: Number(e.target.value) })}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[10px] font-bold text-stone-500">
                    <span>Vertical Position (Y)</span>
                    <span>{selectedZone.y}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={selectedZone.y}
                    onChange={(e) => handleUpdateZone(selectedZone.id, { y: Number(e.target.value) })}
                    className="w-full accent-purple-700 cursor-pointer"
                  />
                </div>
              </div>

              {/* Assigned Guests list */}
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                  Assigned Guests & VIPs
                </label>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                  {(selectedZone.assignedGuestNames?.length || 0) > 0 ? (
                    selectedZone.assignedGuestNames?.map((g, i) => (
                      <p key={i} className="text-stone-700 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                        <span>{g}</span>
                      </p>
                    ))
                  ) : (
                    <p className="text-stone-400 italic text-[11px]">No guests assigned yet. Open Guest Manager to assign groups.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-stone-400 text-xs">
              Select a zone on the floorplan to inspect or edit details.
            </div>
          )}

          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] text-purple-900 leading-snug">
            💡 <strong>Seating Guideline:</strong> Maintain at least 1.5 meters clearance between round banquet tables for smooth waiter passage and elderly mobility.
          </div>
        </div>
      </div>

      {/* Add Zone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Add Zone to Floorplan
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddZone} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Zone Type
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-semibold outline-hidden"
                >
                  <option value="table-round">Round Dining Table (8 Pax)</option>
                  <option value="table-long">Banquet Long Table</option>
                  <option value="stage">Ceremonial Stage</option>
                  <option value="mandap">Mandap / Focal Pavilion</option>
                  <option value="dancefloor">Dance Floor Area</option>
                  <option value="bar">Bar / Drink Station</option>
                  <option value="photobooth">Photo Booth / Vignette</option>
                  <option value="entrance">Welcome Foyer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Zone Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 4 - Groom's Colleagues"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Seats Capacity
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formSeats}
                  onChange={(e) => setFormSeats(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Place Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
