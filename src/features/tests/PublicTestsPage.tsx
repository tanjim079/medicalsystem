import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, Beaker, Heart, Waves, HeartHandshake, ArrowRight } from "lucide-react";
import type { MedicalTest } from "../../data/tests";
import { useTestStore } from "../../store/useTestStore";

const categoryIcon = (category: MedicalTest["category"]) => {
  switch (category) {
    case "Pathology":
      return <Beaker size={14} className="text-teal-600" />;
    case "ECG":
      return <Heart size={14} className="text-rose-500" />;
    case "Ultrasonography":
      return <Waves size={14} className="text-blue-500" />;
  }
};

const categoryBadgeClass = (category: MedicalTest["category"]) => {
  switch (category) {
    case "Pathology":
      return "bg-teal-100 text-teal-800";
    case "ECG":
      return "bg-rose-100 text-rose-800";
    case "Ultrasonography":
      return "bg-blue-100 text-blue-800";
  }
};

const categoryIconBgClass = (category: MedicalTest["category"]) => {
  switch (category) {
    case "Pathology":
      return "bg-teal-50";
    case "ECG":
      return "bg-rose-50";
    case "Ultrasonography":
      return "bg-blue-50";
  }
};

export default function PublicTestsPage() {
  const { tests, fetchTests, loading } = useTestStore();

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const groupedTests: Record<string, MedicalTest[]> = {
    Pathology: [],
    ECG: [],
    Ultrasonography: [],
  };

  tests.forEach((t) => {
    if (!groupedTests[t.category]) {
      groupedTests[t.category] = [];
    }
    groupedTests[t.category].push(t);
  });

  if (loading && tests.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 text-center text-gray-500">
        Loading medical tests...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl mb-4">
          <Activity size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Medical Tests</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We offer a variety of diagnostic tests on campus at subsidized rates for the
          convenience of our students and staff.
        </p>
      </div>

      {/* 🔷 External Diagnostic MoU Notice Banner */}
      <div className="mb-10 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-teal-200/80 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <HeartHandshake size={22} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base">
              Need Advanced Imaging, MRI, CT Scan or Specialized Tests?
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mt-0.5">
              RUET community members enjoy <strong>20% to 40% discount</strong> at Popular Diagnostic Centre & Islami Bank Hospital under bilateral MoUs.
            </p>
          </div>
        </div>
        <Link
          to="/mou"
          className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-xs"
        >
          <span>View MoU Discounts</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Tables grouped by category */}
      {(Object.keys(groupedTests) as MedicalTest["category"][]).map((category) => (
        <div key={category} className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${categoryIconBgClass(category)}`}>
              {categoryIcon(category)}
            </div>
            <h2 className="text-xl font-bold text-gray-800">{category}</h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryBadgeClass(category)}`}>
              {groupedTests[category].length} test{groupedTests[category].length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 font-semibold text-gray-600 text-sm">Test Name</th>
                    <th className="py-3 px-6 font-semibold text-gray-600 text-sm text-right">Student Rate</th>
                    <th className="py-3 px-6 font-semibold text-gray-600 text-sm text-right">Employee Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {groupedTests[category].map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${categoryIconBgClass(category)}`}>
                            {categoryIcon(category)}
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{test.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-right font-semibold text-teal-700 text-sm">
                        ৳{test.studentPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-6 text-right font-semibold text-blue-700 text-sm">
                        ৳{test.employeePrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      {/* Footer note */}
      <div className="bg-blue-50/50 p-4 border border-blue-100 rounded-xl text-sm text-blue-800 text-center">
        <strong>Note:</strong> Test prices are subject to change. Please confirm at the reception counter.
      </div>
    </div>
  );
}
