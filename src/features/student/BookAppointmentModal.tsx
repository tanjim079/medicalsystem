import { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock as ClockIcon, User as UserIcon, FileText, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { users } from '../../data/users';

interface Props {
  onClose: () => void;
}

export default function BookAppointmentModal({ onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const addAppointment = useAppointmentStore((s) => s.addAppointment);

  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [symptoms, setSymptoms] = useState('');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const doctors = users.filter((u) => u.role === 'doctor');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorId || !date || !time || !symptoms) {
      alert('Please fill all fields');
      return;
    }

    const doctor = doctors.find((d) => d.id === doctorId);

    if (user && doctor) {
      addAppointment({
        patientId: user.id,
        patientName: user.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date,
        time,
        symptoms,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dynamic Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] overflow-hidden border border-white/50 animate-in fade-in zoom-in-95 duration-300 slide-in-from-bottom-4">
        
        {/* Glow effect in background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-48 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none rounded-[100%] blur-3xl"></div>

        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold tracking-wider uppercase mb-2">
              <CalendarIcon size={12} />
              New Appointment
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-900">
              Schedule Visit
            </h2>
            <p className="text-sm font-medium text-slate-500">Provide details for your upcoming consultation.</p>
          </div>
          
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100/50 hover:bg-slate-100 p-2.5 rounded-full transition-all hover:scale-105 active:scale-95"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative px-8 pb-8 space-y-6">
          
          {/* Doctor Selection */}
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Select Specialist
            </label>
            <div className={`relative flex items-center transition-all duration-300 rounded-2xl bg-slate-50/80 border ${focusedField === 'doctor' ? 'border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-slate-200 hover:border-indigo-300 hover:bg-white'}`}>
              <div className={`absolute left-4 transition-colors duration-300 ${focusedField === 'doctor' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                <UserIcon size={20} strokeWidth={2} />
              </div>
              <select
                value={doctorId}
                onFocus={() => setFocusedField('doctor')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full bg-transparent py-4 pl-12 pr-10 text-slate-700 font-medium outline-none appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Choose a preferred doctor</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 pointer-events-none text-slate-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Date */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Date
              </label>
              <div className={`relative flex items-center transition-all duration-300 rounded-2xl bg-slate-50/80 border ${focusedField === 'date' ? 'border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-slate-200 hover:border-indigo-300 hover:bg-white'}`}>
                <div className={`absolute left-4 transition-colors duration-300 ${focusedField === 'date' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                  <CalendarIcon size={20} strokeWidth={2} />
                </div>
                <input
                  type="date"
                  value={date}
                  onFocus={() => setFocusedField('date')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      const [year, month, day] = val.split('-');
                      const localDate = new Date(Number(year), Number(month) - 1, Number(day));
                      if (localDate.getDay() === 5) {
                        alert("The Health Complex is closed on Fridays. Please select another date.");
                        setDate('');
                        return;
                      }
                    }
                    setDate(val);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-slate-700 font-medium outline-none"
                  required
                />
              </div>
            </div>

            {/* Time */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Time
              </label>
              <div className={`relative flex items-center transition-all duration-300 rounded-2xl bg-slate-50/80 border ${focusedField === 'time' ? 'border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-slate-200 hover:border-indigo-300 hover:bg-white'}`}>
                <div className={`absolute left-4 transition-colors duration-300 ${focusedField === 'time' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                  <ClockIcon size={20} strokeWidth={2} />
                </div>
                <input
                  type="time"
                  value={time}
                  onFocus={() => setFocusedField('time')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-transparent py-4 pl-12 pr-4 text-slate-700 font-medium outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              Symptoms / Reason
            </label>
            <div className={`relative flex transition-all duration-300 rounded-2xl bg-slate-50/80 border ${focusedField === 'symptoms' ? 'border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-slate-200 hover:border-indigo-300 hover:bg-white'}`}>
              <div className={`absolute top-4 left-4 transition-colors duration-300 ${focusedField === 'symptoms' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-400'}`}>
                <FileText size={20} strokeWidth={2} />
              </div>
              <textarea
                value={symptoms}
                onFocus={() => setFocusedField('symptoms')}
                onBlur={() => setFocusedField(null)}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Briefly describe what you're experiencing..."
                className="w-full bg-transparent py-4 pl-12 pr-4 text-slate-700 font-medium outline-none min-h-[120px] resize-none"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-between gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] relative overflow-hidden group py-4 px-6 bg-slate-900 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_30px_-15px_rgba(99,102,241,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center gap-2 z-10">
                Confirm Booking
                <CalendarIcon size={18} className="group-hover:rotate-12 transition-transform duration-300" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
