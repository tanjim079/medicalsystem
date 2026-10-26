import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartHandshake,
  BadgePercent,
  Calendar,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Search,
  Printer,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Stethoscope,
  Info,
  ChevronRight,
} from "lucide-react";
import { mouPartnersData, mouGuidelines, type MouPartner } from "../../data/mouPartners";

export default function PublicMouPage() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredPartners = mouPartnersData.filter((partner) => {
    if (selectedPartnerId !== "all" && partner.id !== selectedPartnerId) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const nameMatch = partner.name.toLowerCase().includes(query);
    const branchMatch = partner.branch.toLowerCase().includes(query);
    const discountMatch = partner.discounts.some(
      (d) =>
        d.category.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.highlightTests?.some((t) => t.toLowerCase().includes(query))
    );
    return nameMatch || branchMatch || discountMatch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 pb-20">
      {/* 🔷 Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white pt-14 pb-16 px-6 relative overflow-hidden print:bg-white print:text-black print:p-0">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-15 pointer-events-none print:hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-400 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-md border border-blue-400/30 px-3.5 py-1.5 rounded-full text-xs md:text-sm font-medium text-blue-200">
              <HeartHandshake size={16} className="text-teal-400" />
              <span>Official Memoranda of Understanding (MoU)</span>
            </div>

            <div className="flex items-center gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm transition-all"
                title="Print or Save as PDF"
              >
                <Printer size={15} />
                <span>Print MoU Summary</span>
              </button>
            </div>
          </div>

          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Healthcare Partnerships <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-200 to-emerald-300">
                & Diagnostic MoUs
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Rajshahi University of Engineering & Technology (RUET) maintains bilateral healthcare agreements with renowned diagnostic centers and hospitals to deliver specialized investigations with exclusive discounts up to <span className="text-teal-300 font-semibold">40%</span> for students, faculty, and staff.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-700/60 print:hidden">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <p className="text-2xl md:text-3xl font-extrabold text-teal-300">40%</p>
              <p className="text-xs text-slate-300 mt-1">Max Pathology Discount</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <p className="text-2xl md:text-3xl font-extrabold text-blue-300">30%</p>
              <p className="text-xs text-slate-300 mt-1">Max Imaging Discount</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <p className="text-2xl md:text-3xl font-extrabold text-emerald-300">2 Leading</p>
              <p className="text-xs text-slate-300 mt-1">Institutions in Rajshahi</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <p className="text-2xl md:text-3xl font-extrabold text-amber-300">100%</p>
              <p className="text-xs text-slate-300 mt-1">RUET Community Coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* 🔷 Search & Filtering Toolbar */}
      <section className="max-w-7xl mx-auto px-6 -mt-6 relative z-20 print:hidden">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Partner Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setSelectedPartnerId("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedPartnerId === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Partners (2)
            </button>
            <button
              onClick={() => setSelectedPartnerId("popular-diagnostic-rajshahi")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedPartnerId === "popular-diagnostic-rajshahi"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              Popular Diagnostic (Up to 40%)
            </button>
            <button
              onClick={() => setSelectedPartnerId("islami-bank-hospital-rajshahi")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedPartnerId === "islami-bank-hospital-rajshahi"
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-teal-50 text-teal-800 hover:bg-teal-100"
              }`}
            >
              Islami Bank Hospital (Up to 35%)
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tests (MRI, CT, Echo...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 🔷 Main MoU Partner Cards Section */}
      <section className="max-w-7xl mx-auto px-6 mt-10">
        <div className="space-y-10">
          {filteredPartners.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <AlertCircle size={40} className="mx-auto text-amber-500 mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No test or partner found</h3>
              <p className="text-sm text-slate-500 mt-1">
                Try adjusting your search query or reset the filter to view all partners.
              </p>
              <button
                onClick={() => {
                  setSelectedPartnerId("all");
                  setSearchQuery("");
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Reset Search Filter
              </button>
            </div>
          ) : (
            filteredPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))
          )}
        </div>
      </section>

      {/* 🔷 Quick Comparison Table */}
      <section className="max-w-7xl mx-auto px-6 mt-16 print:break-before-page">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white px-6 py-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles size={14} /> At A Glance
              </div>
              <h2 className="text-xl md:text-2xl font-bold">MoU Discount Rate Comparison</h2>
            </div>
            <span className="text-xs bg-white/10 border border-white/20 text-slate-200 px-3 py-1 rounded-full w-fit">
              Signing Date: 24 June, 2024
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                  <th className="py-3.5 px-6">Test / Service Category</th>
                  <th className="py-3.5 px-6 bg-emerald-50/70 text-emerald-900 border-x border-slate-200">
                    Popular Diagnostic Centre
                  </th>
                  <th className="py-3.5 px-6 bg-teal-50/70 text-teal-900">
                    Islami Bank Hospital
                  </th>
                  <th className="py-3.5 px-6">Eligibility Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    🔬 Pathological Tests
                    <p className="text-xs font-normal text-slate-500 mt-0.5">
                      Routine & advanced pathology, blood tests, biochemistry, urine & stool
                    </p>
                  </td>
                  <td className="py-4 px-6 bg-emerald-50/30 border-x border-slate-200">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      40% Discount
                    </span>
                  </td>
                  <td className="py-4 px-6 bg-teal-50/30">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-teal-100 text-teal-800 border border-teal-300">
                      35% Discount
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    Prescribed by RUET Doctor or registered doctor outside RUET
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    🩻 Imaging & Radiological Tests
                    <p className="text-xs font-normal text-slate-500 mt-0.5">
                      CT Scan, MRI, Digital X-Ray, OPG, USG (Ultrasonography), BMD, EEG, ECG
                    </p>
                  </td>
                  <td className="py-4 px-6 bg-emerald-50/30 border-x border-slate-200">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      25% Discount
                    </span>
                  </td>
                  <td className="py-4 px-6 bg-teal-50/30">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-teal-100 text-teal-800 border border-teal-300">
                      30% Discount
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    Prescribed by RUET Doctor or registered doctor outside RUET
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 font-semibold text-slate-900">
                    🩺 Specialized Diagnostic Procedures
                    <p className="text-xs font-normal text-slate-500 mt-0.5">
                      Endoscopy, Colonoscopy, Echo Color Doppler, 2D Echo, ETT & Histopathology
                    </p>
                  </td>
                  <td className="py-4 px-6 bg-emerald-50/30 border-x border-slate-200">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      20% Discount
                    </span>
                    <p className="text-xs text-amber-700 font-medium mt-1">
                      * Excl. Dr. Ariful Hasan (Colonoscopy)
                    </p>
                  </td>
                  <td className="py-4 px-6 bg-teal-50/30">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      Standard Hospital Rates
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-600">
                    Prescribed by RUET Doctor or registered doctor outside RUET
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 🔷 Step-by-Step Guide on How to Avail Discounts */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-6 md:p-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-blue-600 text-xs font-bold tracking-wider uppercase inline-flex items-center gap-1.5">
              <ShieldCheck size={16} /> Patient Guidelines
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-950 mt-1">
              How to Avail Your MoU Medical Discount
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Follow these simple steps when visiting our partner centers to guarantee your concession.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {mouGuidelines.stepsToClaim.map((step) => (
              <div
                key={step.step}
                className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4 shadow-sm">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Required Documents Callout */}
          <div className="mt-8 pt-6 border-t border-blue-200/60 grid md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                <FileCheck size={16} className="text-blue-600" />
                Required Identification Documents
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {mouGuidelines.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-2">
                <Info size={16} className="text-blue-600" />
                Eligible Community Beneficiaries
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {mouGuidelines.eligibility.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 size={14} className="text-teal-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 🔷 Official Ceremony & Signatory Archive Info */}
      <section className="max-w-7xl mx-auto px-6 mt-16 print:hidden">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <HeartHandshake size={28} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                MoU Signing Ceremony & Administrative Record
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Both bilateral Memoranda of Understanding were officially executed on <span className="font-semibold text-slate-800">24th June, 2024 at 5:00 PM</span> at the RUET Health Complex, organized under the auspices of Rajshahi University of Engineering & Technology (RUET) administration.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/tests"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Stethoscope size={15} />
              <span>Campus Tests Price List</span>
            </Link>
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              <span>Consult RUET Doctors</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// 🔶 Subcomponent: Individual Partner MoU Card
function PartnerCard({ partner }: { partner: MouPartner }) {
  const isPopular = partner.id === "popular-diagnostic-rajshahi";

  return (
    <div
      id={partner.id}
      className={`bg-white rounded-2xl shadow-sm border ${partner.brandColor.border} overflow-hidden transition-all duration-200 hover:shadow-md`}
    >
      {/* Partner Header */}
      <div className={`p-6 md:p-8 ${isPopular ? "bg-emerald-950/5" : "bg-teal-950/5"} border-b ${partner.brandColor.border}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-bold text-xl shadow-sm ${
                isPopular
                  ? "bg-emerald-600 text-white"
                  : "bg-teal-700 text-white"
              }`}
            >
              {isPopular ? "P" : "IBH"}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${partner.brandColor.badge}`}>
                  {partner.branch}
                </span>
                <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                  {partner.category}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {partner.name}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin size={14} className="text-slate-400" />
                <span>{partner.locationInfo.address}, {partner.locationInfo.city}</span>
              </p>
            </div>
          </div>

          {/* Signing Metadata Pill */}
          <div className="bg-white/90 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1 self-start md:self-auto shrink-0 shadow-xs">
            <div className="flex items-center gap-2 font-medium text-slate-800">
              <Calendar size={14} className="text-blue-600" />
              <span>Signed: {partner.mouSigningDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-blue-600" />
              <span>Time: {partner.mouSigningTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-blue-600" />
              <span>Venue: {partner.venue}</span>
            </div>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-600 mt-4 leading-relaxed max-w-4xl">
          {partner.summary}
        </p>
      </div>

      {/* Discount Table */}
      <div className="p-6 md:p-8">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <BadgePercent size={18} className={isPopular ? "text-emerald-600" : "text-teal-600"} />
          <span>Agreed Concession & Discount Schedule</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-y border-slate-200">
                <th className="py-3 px-4 w-12 text-center">SI</th>
                <th className="py-3 px-4">Test Category & Description</th>
                <th className="py-3 px-4">Covered Investigations</th>
                <th className="py-3 px-4 text-center">Agreed Discount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {partner.discounts.map((item) => (
                <tr key={item.sl} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 text-center font-bold text-slate-400 text-xs">
                    {item.sl}
                  </td>
                  <td className="py-4 px-4 max-w-md">
                    <p className="font-bold text-slate-900 text-sm md:text-base">
                      {item.category}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-blue-700 font-medium mt-1.5 flex items-center gap-1">
                      <Stethoscope size={12} />
                      <span>{item.advisedBy}</span>
                    </p>
                    {item.exceptions && (
                      <span className="inline-block mt-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                        Note: {item.exceptions}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    {item.highlightTests && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.highlightTests.map((test, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                          >
                            {test}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span
                        className={`text-2xl md:text-3xl font-extrabold px-3 py-1 rounded-xl shadow-xs ${
                          isPopular
                            ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                            : "text-teal-700 bg-teal-50 border border-teal-200"
                        }`}
                      >
                        {item.discountPercentage}%
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">
                        Off Bill
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Special Notes & Advice */}
        {partner.specialNotes && partner.specialNotes.length > 0 && (
          <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Info size={13} className="text-blue-600" /> Terms & Verification Notes
            </p>
            {partner.specialNotes.map((note, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <ChevronRight size={13} className="text-slate-400 mt-0.5 shrink-0" />
                <span>{note}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
