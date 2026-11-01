export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function formatShortDate(dateString: string): string {
  if (!dateString) return 'Date TBD';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

export function getDaysRemaining(dateString: string): { days: number; isPast: boolean; label: string } {
  if (!dateString) return { days: 0, isPast: false, label: 'Date pending' };
  try {
    const target = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (days < 0) {
      return { days: Math.abs(days), isPast: true, label: `${Math.abs(days)} days ago` };
    }
    if (days === 0) {
      return { days: 0, isPast: false, label: 'Today!' };
    }
    if (days === 1) {
      return { days: 1, isPast: false, label: 'Tomorrow' };
    }
    return { days, isPast: false, label: `${days} days left` };
  } catch (e) {
    return { days: 0, isPast: false, label: 'Date pending' };
  }
}
