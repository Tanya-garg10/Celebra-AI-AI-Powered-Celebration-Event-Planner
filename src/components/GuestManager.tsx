import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Search,
  Trash2,
  Edit2,
  X,
  Copy,
  Check
} from 'lucide-react';
import { CelebrationEvent, Guest } from '../types.ts';

interface GuestManagerProps {
  event: CelebrationEvent;
  onUpdateGuests: (guests: Guest[]) => void;
}

export const GuestManager: React.FC<GuestManagerProps> = ({
  event,
  onUpdateGuests,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [copiedCSV, setCopiedCSV] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'Confirmed' | 'Pending' | 'Declined'>('Pending');
  const [formMeal, setFormMeal] = useState<'Vegetarian' | 'Non-vegetarian' | 'Vegan' | 'Jain' | 'Kids'>('Vegetarian');
  const [formPlusCount, setFormPlusCount] = useState<number>(0);
  const [formNotes, setFormNotes] = useState('');

  // Calculations
  const totalInvitedCount = event.guests.length;
  const confirmedCount = event.guests.filter((g) => g.status === 'Confirmed').length;
  const pendingCount = event.guests.filter((g) => g.status === 'Pending').length;
  const declinedCount = event.guests.filter((g) => g.status === 'Declined').length;

  // Headcount including plus ones for confirmed
  const confirmedHeadcount = event.guests
    .filter((g) => g.status === 'Confirmed')
    .reduce((sum, g) => sum + 1 + (g.plusCount || 0), 0);

  // Dietary counts for confirmed guests
  const vegCount = event.guests.filter((g) => g.status === 'Confirmed' && g.mealPreference === 'Vegetarian').length;
  const nonVegCount = event.guests.filter((g) => g.status === 'Confirmed' && g.mealPreference === 'Non-vegetarian').length;
  const jainCount = event.guests.filter((g) => g.status === 'Confirmed' && g.mealPreference === 'Jain').length;
  const veganCount = event.guests.filter((g) => g.status === 'Confirmed' && g.mealPreference === 'Vegan').length;

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormStatus('Pending');
    setFormMeal('Vegetarian');
    setFormPlusCount(0);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: Guest) => {
    setEditingGuest(g);
    setFormName(g.name);
    setFormEmail(g.email);
    setFormPhone(g.phone);
    setFormStatus(g.status);
    setFormMeal(g.mealPreference);
    setFormPlusCount(g.plusCount);
    setFormNotes(g.notes || '');
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this guest from the RSVP tracking list?')) {
      onUpdateGuests(event.guests.filter((g) => g.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingGuest) {
      const updated = event.guests.map((g) =>
        g.id === editingGuest.id
          ? {
              ...g,
              name: formName.trim(),
              email: formEmail.trim(),
              phone: formPhone.trim(),
              status: formStatus,
              mealPreference: formMeal,
              plusCount: Number(formPlusCount),
              notes: formNotes.trim()
            }
          : g
      );
      onUpdateGuests(updated);
    } else {
      const newGuest: Guest = {
        id: `gst-${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim(),
        phone: formPhone.trim(),
        status: formStatus,
        mealPreference: formMeal,
        plusCount: Number(formPlusCount),
        notes: formNotes.trim()
      };
      onUpdateGuests([...event.guests, newGuest]);
    }
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Status', 'Meal Preference', 'Plus Ones', 'Phone', 'Email', 'Notes'];
    const rows = event.guests.map((g) => [
      `"${g.name}"`,
      `"${g.status}"`,
      `"${g.mealPreference}"`,
      g.plusCount,
      `"${g.phone}"`,
      `"${g.email}"`,
      `"${g.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${event.name.replace(/\s+/g, '_')}_Guest_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredGuests = event.guests.filter((g) => {
    if (statusFilter !== 'All' && g.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        g.name.toLowerCase().includes(q) ||
        g.phone.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 text-left">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <p className="text-[11px] font-bold uppercase text-stone-500">Total Invited</p>
          <p className="font-serif text-2xl font-bold text-stone-900 mt-1">{totalInvitedCount} Invites</p>
          <p className="text-[11px] text-stone-500 mt-0.5">Target: {event.guestCount} guests</p>
        </div>

        <div className="p-5 rounded-3xl bg-emerald-50/60 border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase text-emerald-800">Confirmed RSVPs</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-950 mt-1">{confirmedCount}</p>
          <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
            {confirmedHeadcount} Attendees Total
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-amber-50/60 border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase text-amber-800">Awaiting Response</p>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-amber-950 mt-1">{pendingCount}</p>
          <p className="text-[11px] text-amber-800 mt-0.5">Follow-up needed</p>
        </div>

        <div className="p-5 rounded-3xl bg-stone-50 border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase text-stone-500">Declined</p>
            <XCircle className="w-4 h-4 text-stone-400" />
          </div>
          <p className="font-serif text-2xl font-bold text-stone-700 mt-1">{declinedCount}</p>
          <p className="text-[11px] text-stone-400 mt-0.5">Regrets received</p>
        </div>
      </div>

      {/* Dietary Overview Strip for Confirmed Guests */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-900">Confirmed Plate Breakdown:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            🌱 Vegetarian: {vegCount}
          </span>
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-800 font-semibold border border-rose-200">
            🍗 Non-Veg: {nonVegCount}
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200">
            🪷 Jain: {jainCount}
          </span>
          <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-800 font-semibold border border-purple-200">
            🥑 Vegan: {veganCount}
          </span>
        </div>
      </div>

      {/* Search, Filter & Actions Toolbar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search guests by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-xs focus:border-purple-600 outline-hidden"
          />
        </div>

        {/* Status Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Confirmed', 'Pending', 'Declined'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                statusFilter === st
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 text-rose-300" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Guest Table */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider font-bold">
              <th className="py-3 px-3">Guest / Family</th>
              <th className="py-3 px-3">RSVP Status</th>
              <th className="py-3 px-3">Dietary Preference</th>
              <th className="py-3 px-3">Plus Ones</th>
              <th className="py-3 px-3">Contact</th>
              <th className="py-3 px-3">Notes</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredGuests.map((guest) => (
              <tr key={guest.id} className="hover:bg-stone-50/70 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-stone-900">{guest.name}</p>
                    {guest.group && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                        {guest.group}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      guest.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : guest.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {guest.status}
                  </span>
                </td>
                <td className="py-3.5 px-3 font-medium text-stone-700">
                  {guest.mealPreference}
                </td>
                <td className="py-3.5 px-3 text-stone-600 font-semibold">
                  {guest.plusCount > 0 ? `+${guest.plusCount} family` : 'Solo'}
                </td>
                <td className="py-3.5 px-3 text-stone-500">
                  {guest.phone || guest.email || '—'}
                </td>
                <td className="py-3.5 px-3 text-stone-500 max-w-xs truncate">
                  {guest.notes || '—'}
                </td>
                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(guest)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Edit Guest"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(guest.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Guest"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-stone-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingGuest ? 'Edit Guest Details' : 'Add Guest to Celebration'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name / Family Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh & Sunita Mehra"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-purple-600 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    RSVP Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white outline-hidden"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Meal Preference
                  </label>
                  <select
                    value={formMeal}
                    onChange={(e) => setFormMeal(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white outline-hidden"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-vegetarian">Non-vegetarian</option>
                    <option value="Jain">Jain (No Root Veg)</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Kids">Kids Meal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Additional Family (+Pax)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formPlusCount}
                    onChange={(e) => setFormPlusCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98200 12345"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="guest@gmail.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Table Group or Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Groom's college friends / Requires wheelchair access"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold cursor-pointer"
                >
                  Save Guest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
