import { Activity, Beaker, FileText } from "lucide-react";

export default function PublicTestsPage() {
  const tests = [
    { id: "TST001", name: "Complete Blood Count (CBC)", category: "Pathology", price: "৳400" },
    { id: "TST002", name: "Blood Sugar (Fasting)", category: "Pathology", price: "৳150" },
    { id: "TST003", name: "Lipid Profile", category: "Pathology", price: "৳800" },
    { id: "TST004", name: "Chest X-Ray", category: "Radiology", price: "৳600" },
    { id: "TST005", name: "ECG", category: "Cardiology", price: "৳300" },
    { id: "TST006", name: "Urine Routine Examination", category: "Pathology", price: "৳200" },
    { id: "TST007", name: "Dengue NS1 Antigen", category: "Pathology", price: "৳500" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl mb-4">
          <Activity size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Available Medical Tests</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We offer a variety of diagnostic tests on campus at subsidized rates for the convenience of our students and Staffs.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 font-semibold text-gray-600">Test Name</th>
                <th className="py-4 px-6 font-semibold text-gray-600">Category</th>
                <th className="py-4 px-6 font-semibold text-gray-600 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
                        {test.category === "Radiology" ? <FileText size={14} className="text-teal-600" /> : <Beaker size={14} className="text-teal-600" />}
                      </div>
                      <span className="font-medium text-gray-900">{test.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {test.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold text-gray-900">
                    {test.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-blue-50/50 p-4 border-t border-blue-100 text-sm text-blue-800 text-center">
          <strong>Note:</strong> Test prices are subject to change. Please confirm at the reception counter.
        </div>
      </div>
    </div>
  );
}
