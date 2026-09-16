import { useState, useMemo } from 'react';
import {
  X,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  User as UserIcon,
  FileText,
  ChevronDown,
  Lock,
  Check,
  AlertCircle,
  Sparkles,
  Copy,
  CheckCheck,
  Ticket,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppointmentStore } from '../../store/useAppointmentStore';
import { users } from '../../data/users';
import type { Appointment } from '../../types/appointment';
import {
  CONSULTATION_TIME_SLOTS,
  formatTimeTo12Hour,
  areTimesEqual,
} from '../../utils/timeSlots';
import {
  getBookingWindow,
  getBookingWindowBounds,
  validateBookingDate,
  BOOKING_WINDOW_DAYS,
} from '../../utils/dateUtils';

interface Props {
  onClose: () => void;
}

export default function BookAppointmentModal({ onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const appointments = useAppointmentStore((s) => s.appointments);
  const addAppointment = useAppointmentStore((s) => s.addAppointment);
  const isSlotBooked = useAppointmentStore((s) => s.isSlotBooked);
  const getBookedSlots = useAppointmentStore((s) => s.getBookedSlots);
  const getNextSerialNumber = useAppointmentStore((s) => s.getNextSerialNumber);

  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [useCustomTime, setUseCustomTime] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const doctors = users.filter((u) => u.role === 'doctor');
  const selectedDoctor = doctors.find((d) => d.id === doctorId);

  // 7-day open booking window calculations
  const bookingDays = useMemo(() => getBookingWindow(BOOKING_WINDOW_DAYS), []);
  const windowBounds = useMemo(() => getBookingWindowBounds(BOOKING_WINDOW_DAYS), []);

  // Live anticipated serial token for the selected date
  const upcomingSerial = useMemo(() => {
    if (!date) return null;
    return getNextSerialNumber(date);
  }, [date, appointments, getNextSerialNumber]);

  const queuePosition = useMemo(() => {
    if (!upcomingSerial) return null;
    const match = upcomingSerial.match(/^APT-\d{8}-(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
  }, [upcomingSerial]);

  // Active booked appointments for the selected doctor & date
  const bookedAppointmentsOnDate = useMemo(() => {
    if (!doctorId || !date) return [];
    return getBookedSlots(doctorId, date);
  }, [doctorId, date, getBookedSlots]);

  // Is the currently chosen time slot booked?
  const isCurrentTimeBooked = useMemo(() => {
    if (!doctorId || !date || !time) return false;
    return isSlotBooked(doctorId, date, time);
  }, [doctorId, date, time, isSlotBooked]);

  const handleCopyToken = (token: string) => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!doctorId || !date || !time || !symptoms.trim()) {
      setErrorMessage('Please fill all required fields.');
      return;
    }

    const dateValidation = validateBookingDate(date, BOOKING_WINDOW_DAYS);
    if (!dateValidation.isValid) {
      setErrorMessage(dateValidation.error || 'The selected date is blocked.');
      return;
    }

    if (isCurrentTimeBooked) {
      setErrorMessage(
        `The time slot "${time}" on ${date} is already reserved for ${selectedDoctor?.name || 'this doctor'}. Please select another time.`
      );
      return;
    }

    if (user && selectedDoctor) {
      const result = addAppointment({
        patientId: user.id,
        patientName: user.name,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date,
        time,
        symptoms: symptoms.trim(),
      });

      if (!result.success) {
        setErrorMessage(result.message || 'Failed to book appointment.');
        return;
      }

      if (result.appointment) {
        setConfirmedAppointment(result.appointment);
      } else {
        onClose();
      }
    }
  };

  if (confirmedAppointment) {
    const queueNum = confirmedAppointment.serialNumber
      ? parseInt(confirmedAppointment.serialNumber.split('-')[2] || '1', 10)
      : 1;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
          onClick={onClose}
        ></div>

        <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-300 my-auto flex flex-col">
          {/* Header Accent */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-emerald-100">
                <CheckCircle2 size={14} className="text-white" />
                Booking Confirmed
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <h2 className="text-2xl font-black mt-3 tracking-tight">RUET Medical Center</h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">OPD Consultation Serial Token Slip</p>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Token Badge Display */}
            <div className="bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 border-2 border-dashed border-indigo-200 rounded-2xl p-5 text-center relative overflow-hidden">
              <div className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 mb-1 flex items-center justify-center gap-1.5">
                <Ticket size={14} /> Official Serial Token
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">
                {confirmedAppointment.serialNumber}
              </div>
              <div className="mt-2.5 inline-flex items-center gap-2">
                <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Queue Position #{queueNum}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyToken(confirmedAppointment.serialNumber || '')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full transition-all shadow-2xs active:scale-95"
                >
                  {copiedToken ? (
                    <>
                      <CheckCheck size={12} className="text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Token</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Appointment Details Grid */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100 text-xs sm:text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Specialist Doctor</span>
                <span className="font-bold text-slate-800">{confirmedAppointment.doctorName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Consultation Date</span>
                <span className="font-bold text-slate-800">{confirmedAppointment.date}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Reserved Time Slot</span>
                <span className="font-bold text-indigo-600">{confirmedAppointment.time}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Patient</span>
                <span className="font-bold text-slate-800">{confirmedAppointment.patientName} ({confirmedAppointment.patientId})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Slot Status</span>
                <span className="font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md text-xs">
                  Pending Doctor Review
                </span>
              </div>
            </div>

            {/* Helpful Notice */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-start gap-2.5">
              <Sparkles size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <span>
                Please arrive at the RUET Medical Complex 10 minutes prior to your time. Keep your Student ID card and this Serial Token ready at the OPD desk.
              </span>
            </div>

            {/* Actions */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg active:scale-95"
              >
                <span>View in Appointments</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Dynamic Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)] overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-300 my-auto max-h-[92vh] flex flex-col">
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-36 bg-gradient-to-b from-indigo-500/15 via-blue-500/5 to-transparent pointer-events-none rounded-[100%] blur-3xl"></div>

        {/* Header */}
        <div className="relative px-6 sm:px-8 pt-6 sm:pt-8 pb-4 flex items-start justify-between border-b border-slate-100 flex-shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-wider uppercase">
              <CalendarIcon size={12} />
              Book Consultation
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Schedule an Appointment
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Select a doctor, pick a date, and choose an available consultation slot.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100/70 hover:bg-slate-200/80 p-2.5 rounded-full transition-all hover:scale-105 active:scale-95"
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto px-6 sm:px-8 py-6 space-y-6 flex-1">
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3 text-sm animate-in fade-in duration-200">
              <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          <form id="appointment-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Doctor Selection */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1">
                Select Specialist <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative flex items-center transition-all duration-300 rounded-2xl bg-slate-50/90 border ${
                  focusedField === 'doctor'
                    ? 'border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-white'
                }`}
              >
                <div
                  className={`absolute left-4 transition-colors duration-300 ${
                    focusedField === 'doctor' ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  <UserIcon size={20} strokeWidth={2} />
                </div>
                <select
                  value={doctorId}
                  onFocus={() => setFocusedField('doctor')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    setDoctorId(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="w-full bg-transparent py-3.5 pl-12 pr-10 text-slate-800 font-medium outline-none appearance-none cursor-pointer text-sm sm:text-base"
                  required
                >
                  <option value="" disabled>
                    Choose a specialist doctor
                  </option>
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

            {/* Consultation Date Selection: 7 Days Open Window */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Consultation Date <span className="text-red-500">*</span>
                </label>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  7 Days Open to Book
                </span>
              </div>

              {/* 7-Day Visual Selection Strip */}
              <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 px-0.5">
                  <span className="font-medium flex items-center gap-1">
                    <CalendarIcon size={12} className="text-indigo-600" />
                    Open Booking Window:
                  </span>
                  <span className="font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs text-[11px]">
                    {windowBounds.windowLabel}
                  </span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
                  {bookingDays.map((dayItem) => {
                    const isSelected = date === dayItem.dateStr;
                    const isClosed = !dayItem.isOpen;

                    if (isClosed) {
                      return (
                        <div
                          key={dayItem.dateStr}
                          title="RUET Health Complex is closed on Fridays (Date Blocked)"
                          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl border border-dashed border-red-200 bg-red-50/40 text-slate-400 select-none cursor-not-allowed text-center transition-all opacity-80"
                        >
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {dayItem.dayShort}
                          </span>
                          <span className="text-sm font-bold text-slate-400 line-through decoration-slate-400/60 my-0.5">
                            {dayItem.dayNumber}
                          </span>
                          <span className="flex items-center gap-0.5 text-[9px] font-bold text-red-600 bg-red-100/80 px-1.5 py-0.5 rounded">
                            <Lock size={9} /> Closed
                          </span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={dayItem.dateStr}
                        type="button"
                        onClick={() => {
                          setDate(dayItem.dateStr);
                          setErrorMessage(null);
                        }}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 ring-2 ring-indigo-400/40 scale-[1.03]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                        }`}
                      >
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            isSelected ? 'text-indigo-100' : 'text-slate-500'
                          }`}
                        >
                          {dayItem.dayShort}
                        </span>
                        <span
                          className={`text-sm font-extrabold my-0.5 ${
                            isSelected ? 'text-white' : 'text-slate-800'
                          }`}
                        >
                          {dayItem.dayNumber}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : dayItem.isToday
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          }`}
                        >
                          {dayItem.isToday ? 'Today' : 'Open'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Standard Calendar Date Input (Physical Min / Max Constraints) */}
              <div
                className={`relative flex items-center transition-all duration-300 rounded-2xl bg-slate-50/90 border ${
                  focusedField === 'date'
                    ? 'border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-white'
                }`}
              >
                <div
                  className={`absolute left-4 transition-colors duration-300 ${
                    focusedField === 'date' ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  <CalendarIcon size={20} strokeWidth={2} />
                </div>
                <input
                  type="date"
                  value={date}
                  min={windowBounds.minDate}
                  max={windowBounds.maxDate}
                  onFocus={() => setFocusedField('date')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    const val = e.target.value;
                    setErrorMessage(null);
                    if (!val) {
                      setDate('');
                      return;
                    }
                    const validation = validateBookingDate(val, BOOKING_WINDOW_DAYS);
                    if (!validation.isValid) {
                      setErrorMessage(validation.error || 'Date is blocked.');
                      setDate('');
                      return;
                    }
                    setDate(val);
                  }}
                  className="w-full bg-transparent py-3.5 pl-12 pr-4 text-slate-800 font-medium outline-none text-sm sm:text-base cursor-pointer"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span className="flex items-center gap-1">
                  <Lock size={11} className="text-slate-400" />
                  <span>Only the next 7 days are open. Past dates & dates beyond 7 days are blocked.</span>
                </span>
                <span className="hidden sm:inline font-medium text-slate-400">
                  Closed on Fridays
                </span>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1">
                  Select Time Slot <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setUseCustomTime(!useCustomTime);
                    setTime('');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors underline"
                >
                  {useCustomTime ? 'Show Slot Grid' : 'Enter Custom Time'}
                </button>
              </div>

              {!doctorId || !date ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center">
                  <ClockIcon className="mx-auto text-slate-300 mb-2" size={32} />
                  <p className="text-sm font-medium text-slate-600">
                    Select a specialist and date above to view available time slots.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Slots booked or pending acceptance will be automatically blocked.
                  </p>
                </div>
              ) : useCustomTime ? (
                /* Custom Time Input */
                <div className="space-y-2">
                  <div
                    className={`relative flex items-center transition-all duration-300 rounded-2xl bg-slate-50/90 border ${
                      isCurrentTimeBooked
                        ? 'border-red-400 bg-red-50/40'
                        : focusedField === 'time'
                        ? 'border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-white'
                    }`}
                  >
                    <div
                      className={`absolute left-4 transition-colors duration-300 ${
                        isCurrentTimeBooked
                          ? 'text-red-500'
                          : focusedField === 'time'
                          ? 'text-indigo-600'
                          : 'text-slate-400'
                      }`}
                    >
                      <ClockIcon size={20} strokeWidth={2} />
                    </div>
                    <input
                      type="time"
                      value={time}
                      onFocus={() => setFocusedField('time')}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        setTime(e.target.value);
                        setErrorMessage(null);
                      }}
                      className="w-full bg-transparent py-3.5 pl-12 pr-4 text-slate-800 font-medium outline-none text-sm sm:text-base cursor-pointer"
                      required
                    />
                  </div>
                  {isCurrentTimeBooked && (
                    <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium ml-1">
                      <Lock size={13} /> This time is already booked for {selectedDoctor?.name}. Please select another time.
                    </div>
                  )}
                </div>
              ) : (
                /* Visual Consultation Slots Grid */
                <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  {/* Slot Status Legend */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pb-2 border-b border-slate-200/80">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Booked / Blocked
                    </span>
                    <span className="flex items-center gap-1.5 text-indigo-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span> Selected
                    </span>
                    {bookedAppointmentsOnDate.length > 0 && (
                      <span className="ml-auto text-xs text-slate-500 font-medium bg-slate-200/70 px-2 py-0.5 rounded-md">
                        {bookedAppointmentsOnDate.length} slot(s) occupied today
                      </span>
                    )}
                  </div>

                  {CONSULTATION_TIME_SLOTS.map((shift) => (
                    <div key={shift.title} className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-600 tracking-wide">
                        {shift.title}
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {shift.slots.map((slot) => {
                          const booked = isSlotBooked(doctorId, date, slot);
                          const isSelected = areTimesEqual(time, slot);

                          if (booked) {
                            return (
                              <button
                                key={slot}
                                type="button"
                                disabled
                                title={`This slot is already booked for ${selectedDoctor?.name}`}
                                className="relative flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100/80 text-slate-400 cursor-not-allowed text-xs font-medium select-none group"
                              >
                                <span className="line-through decoration-slate-400/60">{slot}</span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-red-500/80 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                                  <Lock size={10} /> Booked
                                </span>
                              </button>
                            );
                          }

                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => {
                                setTime(slot);
                                setErrorMessage(null);
                              }}
                              className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 scale-[1.02]'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'
                              }`}
                            >
                              <span>{slot}</span>
                              {isSelected ? (
                                <Check size={14} className="text-white" strokeWidth={2.5} />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 opacity-80"></span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {time && (
                    <div className="pt-2 flex items-center justify-between text-xs bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-2 text-indigo-900 font-semibold">
                        <Sparkles size={16} className="text-indigo-600" />
                        Selected Consultation Slot:
                      </div>
                      <span className="font-bold text-indigo-700 bg-white px-3 py-1 rounded-lg border border-indigo-200 shadow-sm text-sm">
                        {formatTimeTo12Hour(time) || time}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Live Serial Token Preview Card */}
            {date && upcomingSerial && (
              <div className="bg-gradient-to-br from-indigo-50/90 via-blue-50/70 to-slate-50 border border-indigo-100/90 rounded-2xl p-4 shadow-2xs animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 text-white flex flex-col items-center justify-center font-extrabold shadow-sm flex-shrink-0">
                      <span className="text-[9px] uppercase font-bold tracking-tighter opacity-80">Token</span>
                      <span className="text-base leading-none">#{queuePosition ?? 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                          <Ticket size={13} className="text-indigo-600" />
                          Assigned Serial Token
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Next in Queue
                        </span>
                      </div>
                      <div className="font-mono font-black text-slate-800 text-base tracking-wide mt-0.5">
                        {upcomingSerial}
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right text-xs text-slate-500 pl-14 sm:pl-0">
                    <p className="font-semibold text-slate-700">Date: {date}</p>
                    <p className="text-[11px] text-slate-500">
                      {selectedDoctor ? `Dr. ${selectedDoctor.name.split(' ').slice(-1)[0]} Chamber` : 'RUET Health Complex'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Symptoms / Reason */}
            <div className="group">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 ml-1">
                Symptoms / Reason for Visit <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative flex transition-all duration-300 rounded-2xl bg-slate-50/90 border ${
                  focusedField === 'symptoms'
                    ? 'border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.1)]'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-white'
                }`}
              >
                <div
                  className={`absolute top-4 left-4 transition-colors duration-300 ${
                    focusedField === 'symptoms' ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  <FileText size={20} strokeWidth={2} />
                </div>
                <textarea
                  value={symptoms}
                  onFocus={() => setFocusedField('symptoms')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    setSymptoms(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Describe your symptoms, duration, or any other notes for the doctor..."
                  className="w-full bg-transparent py-3.5 pl-12 pr-4 text-slate-800 font-medium outline-none min-h-[100px] resize-none text-sm sm:text-base placeholder:text-slate-400"
                  required
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-6 text-slate-600 font-bold bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all active:scale-95 text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="appointment-form"
            disabled={!doctorId || !date || !time || isCurrentTimeBooked}
            className="relative overflow-hidden group py-3 px-8 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all active:scale-95 shadow-md hover:shadow-lg disabled:shadow-none text-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 opacity-0 group-hover:opacity-100 disabled:opacity-0 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-2 z-10">
              Confirm Booking
              <CalendarIcon size={16} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
