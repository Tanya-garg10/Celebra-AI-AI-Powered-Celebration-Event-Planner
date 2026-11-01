import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  Phone,
  Mail,
  IndianRupee,
  Star,
  CheckCircle2,
  Trash2,
  Edit2,
  X,
  Scale,
  Sparkles,
  Info
} from 'lucide-react';
import { CelebrationEvent, Vendor } from '../types.ts';
import { formatINR } from '../utils/formatters.ts';

interface VendorManagerProps {
  event: CelebrationEvent;
  onUpdateVendors: (vendors: Vendor[]) => void;
}

const VENDOR_CATEGORIES = [
  'Venue',
  'Catering',
  'Decoration',
  'Photography',
  'Makeup',
  'Entertainment',
  'Transportation',
  'Invitations'
] as const;

export const VendorManager: React.FC<VendorManagerProps> = ({
  event,
  onUpdateVendors,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Form State
  const [formCategory, setFormCategory] = useState<any>('Venue');
  const [formName, setFormName] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formEstimatedCost, setFormEstimatedCost] = useState<number>(0);
  const [formAdvancePaid, setFormAdvancePaid] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<any>('Shortlisted');
  const [formRating, setFormRating] = useState<number>(5);
  const [formNotes, setFormNotes] = useState('');

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setFormCategory('Venue');
    setFormName('');
    setFormContactPerson('');
    setFormPhone('');
    setFormEmail('');
    setFormEstimatedCost(50000);
    setFormAdvancePaid(0);
    setFormStatus('Shortlisted');
    setFormRating(5);
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setFormCategory(v.category);
    setFormName(v.name);
    setFormContactPerson(v.contactPerson);
    setFormPhone(v.phone);
    setFormEmail(v.email);
    setFormEstimatedCost(v.estimatedCost);
    setFormAdvancePaid(v.advancePaid);
    setFormStatus(v.status);
    setFormRating(v.rating);
    setFormNotes(v.notes);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this vendor from your tracking list?')) {
      onUpdateVendors(event.vendors.filter((v) => v.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingVendor) {
      const updated = event.vendors.map((v) =>
        v.id === editingVendor.id
          ? {
              ...v,
              category: formCategory,
              name: formName.trim(),
              contactPerson: formContactPerson.trim(),
              phone: formPhone.trim(),
              email: formEmail.trim(),
              estimatedCost: Number(formEstimatedCost),
              advancePaid: Number(formAdvancePaid),
              status: formStatus,
              rating: Number(formRating),
              notes: formNotes.trim(),
              isDemo: false
            }
          : v
      );
      onUpdateVendors(updated);
    } else {
      const newVendor: Vendor = {
        id: `vnd-${Date.now()}`,
        category: formCategory,
        name: formName.trim(),
        contactPerson: formContactPerson.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        estimatedCost: Number(formEstimatedCost),
        advancePaid: Number(formAdvancePaid),
        status: formStatus,
        rating: Number(formRating),
        notes: formNotes.trim(),
        isDemo: false
      };
      onUpdateVendors([...event.vendors, newVendor]);
    }
    setIsModalOpen(false);
  };

  const filteredVendors = event.vendors.filter(
    (v) => selectedCategory === 'All' || v.category === selectedCategory
  );

  const bookedCount = event.vendors.filter((v) => v.status === 'Booked' || v.status === 'Completed').length;
  const totalVendorCost = event.vendors.reduce((s, v) => s + (v.estimatedCost || 0), 0);
  const totalAdvanceDisbursed = event.vendors.reduce((s, v) => s + (v.advancePaid || 0), 0);

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner & Metrics */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-700" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Celebration Vendor Hub
            </h3>
          </div>
          <p className="text-xs text-stone-600 font-normal">
            Track contracts, booking deposits, and comparison notes across all celebration suppliers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-purple-50 text-center min-w-[75px]">
            <p className="text-base font-serif font-bold text-purple-950">{bookedCount} / {event.vendors.length}</p>
            <p className="text-[10px] font-bold uppercase text-purple-600">Locked In</p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-amber-50 text-center min-w-[85px]">
            <p className="text-base font-serif font-bold text-amber-950">{formatINR(totalVendorCost)}</p>
            <p className="text-[10px] font-bold uppercase text-amber-600">Contract Total</p>
          </div>

          {event.vendors.length >= 2 && (
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Scale className="w-4 h-4 text-purple-700" />
              <span>Compare Vendors</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="px-4 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-rose-300" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Demo Data Disclaimer Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Sample Records Policy:</strong> Initial starter vendors are clearly marked as illustrative demo records with simulated contact information. Add your genuine local vendors at any time.
        </span>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {['All', ...VENDOR_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-purple-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                  {vendor.category}
                </span>

                {vendor.isDemo && (
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                    Sample Record
                  </span>
                )}
              </div>

              <h4 className="font-serif text-lg font-bold text-stone-900 truncate">
                {vendor.name}
              </h4>
              <p className="text-xs text-stone-500 font-medium">
                {vendor.contactPerson || 'Point of Contact'}
              </p>

              {/* Status & Rating */}
              <div className="flex items-center justify-between mt-3 pb-3 border-b border-stone-100">
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    vendor.status === 'Booked' || vendor.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : vendor.status === 'Contacted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {vendor.status}
                </span>

                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{vendor.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Cost & Advance */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Agreed Quote</p>
                  <p className="font-bold text-stone-900">{formatINR(vendor.estimatedCost)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase">Advance Paid</p>
                  <p className="font-bold text-emerald-700">{formatINR(vendor.advancePaid)}</p>
                </div>
              </div>

              {/* Contact details */}
              <div className="mt-3 space-y-1 text-xs text-stone-600">
                {vendor.phone && (
                  <p className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{vendor.phone}</span>
                  </p>
                )}
                {vendor.email && (
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                    <span>{vendor.email}</span>
                  </p>
                )}
              </div>

              {vendor.notes && (
                <p className="mt-3 p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[11px] text-stone-600 leading-snug">
                  {vendor.notes}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(vendor)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                title="Edit Vendor"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(vendor.id)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Vendor"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Compare Vendors Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-stone-100 p-6 space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-700" />
                <h3 className="font-serif text-lg font-bold text-stone-900">
                  Vendor Comparison Matrix
                </h3>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 uppercase text-[10px] tracking-wider font-bold">
                    <th className="py-2.5 px-3">Vendor</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Agreed Cost</th>
                    <th className="py-2.5 px-3">Deposit Paid</th>
                    <th className="py-2.5 px-3">Rating</th>
                    <th className="py-2.5 px-3">Inclusions / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {event.vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-stone-50">
                      <td className="py-3 px-3 font-bold text-stone-900">{v.name}</td>
                      <td className="py-3 px-3 text-purple-800 font-semibold">{v.category}</td>
                      <td className="py-3 px-3 font-semibold">{v.status}</td>
                      <td className="py-3 px-3 font-bold text-stone-900">{formatINR(v.estimatedCost)}</td>
                      <td className="py-3 px-3 text-emerald-700 font-bold">{formatINR(v.advancePaid)}</td>
                      <td className="py-3 px-3 font-bold text-amber-600">★ {v.rating}</td>
                      <td className="py-3 px-3 text-stone-600 max-w-xs">{v.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-stone-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {editingVendor ? 'Edit Vendor Record' : 'Add Celebration Vendor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Vendor Business Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Palace Banquets"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-purple-600 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:border-purple-600 outline-hidden"
                  >
                    {VENDOR_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikramaditya"
                    value={formContactPerson}
                    onChange={(e) => setFormContactPerson(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="contact@vendor.in"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Estimated / Agreed (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formEstimatedCost}
                    onChange={(e) => setFormEstimatedCost(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Advance Paid (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formAdvancePaid}
                    onChange={(e) => setFormAdvancePaid(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Booking Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white outline-hidden"
                  >
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Booked">Booked</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Contract Inclusions / Scope of Work
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Mandap structure, 4k video reels, 2 live chaat counters, 50% due post-setup"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 outline-hidden"
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
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
