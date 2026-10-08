import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { siteSettings } from "../config/siteSettings";
import {
  Mail, Lock, Eye, EyeOff, Phone, Clock,
  ShieldCheck, AlertCircle, ArrowRight, Activity,
  Stethoscope,
} from "lucide-react";


/* ─── animated EKG SVG line ─── */
function EkgLine() {
  return (
    <svg viewBox="0 0 400 60" className="w-full" fill="none">
      <path
        d="M0,30 L60,30 L75,30 L82,8 L90,52 L98,8 L106,30 L120,30 L134,30 L141,18 L148,42 L155,18 L162,30 L180,30 L400,30"
        stroke="rgba(147,210,255,0.7)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="800"
        className="animate-draw-ekg"
      />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState<"email" | "password" | null>(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      const userData = {
        id: data.user.id,
        name: data.user.user_metadata?.name || "User",
        role: data.user.user_metadata?.role || "patient",
        email: data.user.email,
      };
      setUser(userData, data.session.access_token);
      if (userData.role === "doctor") navigate("/doctor", { replace: true });
      else if (userData.role === "admin") navigate("/admin", { replace: true });
      else if (userData.role === "teacher") navigate("/teacher", { replace: true });
      else if (["patient", "student", "officer"].includes(userData.role)) navigate("/student", { replace: true });
      else if (userData.role === "receptionist") navigate("/receptionist/patients", { replace: true });
      else if (userData.role === "pathologist") navigate("/pathologist/dashboard", { replace: true });
      else alert(`${userData.role} dashboard not implemented yet`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };


  return (
    <div className="min-h-screen flex overflow-hidden">


      {/* ══════════════════════════════════════════
          LEFT PANEL
      ══════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-14 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 45%, #2563eb 75%, #1e40af 100%)",
        }}
      >
        {/* ── Two subtle ambient orbs only ── */}
        <div
          className="absolute top-[-140px] right-[-140px] w-[480px] h-[480px] rounded-full opacity-[0.12] animate-float-slow pointer-events-none"
          style={{ background: "radial-gradient(circle, #93c5fd, transparent 65%)" }}
        />
        <div
          className="absolute bottom-[-100px] left-[-100px] w-[380px] h-[380px] rounded-full opacity-[0.10] animate-float-mid pointer-events-none"
          style={{ background: "radial-gradient(circle, #a5b4fc, transparent 65%)", animationDelay: "2.5s" }}
        />

        {/* ── Top: Logo + name ── */}
        <div className="relative z-10 flex items-center gap-4 animate-fade-in">
          <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="RUET" className="h-14 w-14 object-contain drop-shadow-lg" style={{ mixBlendMode: "screen" }} />
          <div>
            <p className="text-white font-bold text-xl leading-tight tracking-tight">RUET Health Complex</p>
            <p className="text-blue-300 text-[11px] uppercase tracking-[0.22em] mt-0.5 font-medium">Integrated Healthcare Portal</p>
          </div>
        </div>

        {/* ── Middle: Main content ── */}
        <div className="relative z-10 space-y-9 pt-8">

          {/* Headline block */}
          <div className="space-y-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-100 border border-white/15 bg-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              On-Campus Healthcare System
            </div>
            <h1 className="text-[2.75rem] font-black text-white leading-[1.1] tracking-tight">
              Your Health.<br />
              <span
                style={{
                  background: "linear-gradient(90deg, #bfdbfe, #a5f3fc, #bfdbfe)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shimmer-x 3.5s linear infinite",
                }}
              >
                Our Mission.
              </span>
            </h1>
            <p className="text-blue-100/80 text-[0.9rem] leading-relaxed max-w-[360px] font-light">
              Free, comprehensive medical care for every student, faculty, and staff member of the RUET community.
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            {[
              { value: "24/7",    label: "Ambulance"   },
              { value: "Free",    label: "Healthcare"  },
              { value: "100%",    label: "Secure"      },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-blue-300 text-[11px] uppercase tracking-widest mt-0.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Thin separator */}
          <div className="w-full h-px bg-white/10" />

          {/* EKG strip */}
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-2">
              <Activity size={13} className="text-blue-300" />
              <span className="text-blue-300 text-[11px] uppercase tracking-[0.18em] font-semibold">Live System Monitor</span>
              <span className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-ping" />
            </div>
            <EkgLine />
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.35s" }}>
            <div
              className="rounded-2xl p-4 border border-white/10 hover:border-white/25 transition-all duration-300 space-y-2"
              style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                  <Clock size={13} className="text-blue-200" />
                </div>
                <span className="text-white text-xs font-bold">Service Hours</span>
              </div>
              <p className="text-blue-100/80 text-[11px] leading-relaxed">
                {siteSettings.serviceHours.workingDaysShort}<br />
                {siteSettings.serviceHours.time}
              </p>
              <p className="text-blue-400 text-[11px]">Lunch: {siteSettings.serviceHours.lunchBreakTime}</p>
            </div>

            <div
              className="rounded-2xl p-4 border border-white/10 hover:border-white/25 transition-all duration-300 space-y-2"
              style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-red-500/25 flex items-center justify-center">
                  <Phone size={13} className="text-red-300" />
                </div>
                <span className="text-white text-xs font-bold">Emergency</span>
              </div>
              <p className="text-blue-100/80 text-[11px] leading-relaxed font-mono">
                {siteSettings.contacts.ambulance.phone1}<br />
                {siteSettings.contacts.ambulance.phone2}
              </p>
              <p className="flex items-center gap-1 text-green-300 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                Always available
              </p>
            </div>
          </div>

          {/* Trust strip */}
          <div className="flex items-center gap-5 animate-fade-in" style={{ animationDelay: "0.45s" }}>
            <div className="flex items-center gap-1.5 text-blue-200/80 text-xs">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Encrypted &amp; Secure</span>
            </div>
            <div className="w-px h-3.5 bg-white/15" />
            <div className="flex items-center gap-1.5 text-blue-200/80 text-xs">
              <Stethoscope size={14} className="text-blue-300" />
              <span>Free for RUET Community</span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="relative z-10 text-blue-400/60 text-[11px] animate-fade-in" style={{ animationDelay: "0.5s" }}>
          © {new Date().getFullYear()} RUET Health Complex · Rajshahi University of Engineering &amp; Technology
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — Login Form
      ══════════════════════════════════════════ */}
      <div className="flex-1 relative flex items-center justify-center px-6 py-12 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #f8faff 0%, #eef2ff 50%, #f0f9ff 100%)" }}
      >
        {/* Subtle background circle decoration */}
        <div className="absolute top-[-100px] right-[-100px] w-72 h-72 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-80px] left-[-80px] w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-slide-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 animate-fade-in">
            <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
              <img src={`${import.meta.env.BASE_URL}ruet-logo.png`} alt="RUET" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">RUET Health Complex</p>
              <p className="text-gray-500 text-xs">Healthcare Portal</p>
            </div>
          </div>

          {/* ── The Card ── */}
          <div
            className="rounded-[28px] p-8 md:p-10"
            style={{
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 20px 60px rgba(59,130,246,0.12), 0 1px 0 rgba(255,255,255,0.9) inset",
              border: "1px solid rgba(255,255,255,0.7)",
            }}
          >
            {/* Header */}
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Secure Login</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 leading-tight">Welcome back</h2>
              <p className="text-gray-500 text-sm mt-1.5">Sign in to access your health portal</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 p-4 rounded-2xl text-red-700 text-sm animate-slide-up"
                style={{ background: "rgba(254,226,226,0.8)", border: "1px solid rgba(252,165,165,0.5)" }}>
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div
                  className="relative rounded-2xl transition-all duration-300"
                  style={{
                    boxShadow: focused === "email"
                      ? "0 0 0 3px rgba(59,130,246,0.15), 0 1px 3px rgba(0,0,0,0.05)"
                      : "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail size={17} className={`transition-colors duration-200 ${focused === "email" ? "text-blue-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="student@ruet.ac.bd"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200"
                    style={{
                      background: focused === "email" ? "rgba(255,255,255,1)" : "rgba(248,250,252,0.8)",
                      border: focused === "email" ? "1.5px solid rgba(59,130,246,0.5)" : "1.5px solid rgba(226,232,240,0.8)",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 animate-fade-in" style={{ animationDelay: "0.25s" }}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div
                  className="relative rounded-2xl transition-all duration-300"
                  style={{
                    boxShadow: focused === "password"
                      ? "0 0 0 3px rgba(59,130,246,0.15), 0 1px 3px rgba(0,0,0,0.05)"
                      : "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock size={17} className={`transition-colors duration-200 ${focused === "password" ? "text-blue-500" : "text-gray-400"}`} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200"
                    style={{
                      background: focused === "password" ? "rgba(255,255,255,1)" : "rgba(248,250,252,0.8)",
                      border: focused === "password" ? "1.5px solid rgba(59,130,246,0.5)" : "1.5px solid rgba(226,232,240,0.8)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 pl-1">Students: use registration number as password</p>
              </div>

              {/* Submit */}
              <div className="animate-fade-in pt-1" style={{ animationDelay: "0.35s" }}>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full relative flex items-center justify-center gap-2.5 text-white font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 overflow-hidden group disabled:opacity-70"
                  style={{
                    background: loading
                      ? "linear-gradient(135deg, #60a5fa, #818cf8)"
                      : "linear-gradient(135deg, #2563eb, #4f46e5)",
                    boxShadow: "0 8px 24px rgba(37,99,235,0.35), 0 1px 0 rgba(255,255,255,0.15) inset",
                  }}
                >
                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
                      animation: "shimmer-x 1.5s linear infinite",
                    }}
                  />
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs text-gray-400" style={{ background: "rgba(255,255,255,0.9)" }}>
                  Authorized portal access only
                </span>
              </div>
            </div>

            {/* Security notice */}
            <div
              className="flex items-start gap-3 p-4 rounded-2xl animate-fade-in"
              style={{
                background: "linear-gradient(135deg, rgba(239,246,255,0.8), rgba(238,242,255,0.8))",
                border: "1px solid rgba(191,219,254,0.6)",
                animationDelay: "0.45s",
              }}
            >
              <ShieldCheck size={17} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 leading-relaxed">
                This portal is exclusively for RUET students, faculty, and medical staff. Contact the Health Complex for account assistance.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <p className="text-xs text-gray-400">
              Emergency?&nbsp;
              <a
                href={`tel:${siteSettings.contacts.ambulance.phone1}`}
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                {siteSettings.contacts.ambulance.phone1}
              </a>
              &nbsp;· Available 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
