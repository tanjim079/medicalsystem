import { Activity, Beaker, Heart, Waves } from "lucide-react";
import { medicalTests } from "../../data/tests";
import type { MedicalTest } from "../../data/tests";

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

const groupedTests: Record<MedicalTest["category"], MedicalTest[]> = {
  Pathology: [],
  ECG: [],
  Ultrasonography: [],
};

medicalTests.forEach((t) => groupedTests[t.category].push(t));

export default function PublicTestsPage() {
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
