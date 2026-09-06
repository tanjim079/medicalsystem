import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLaboratoryStore } from "../../store/useLaboratoryStore";
import { useAuthStore } from "../../store/useAuthStore";
import type { TestParameter, ResultFlag } from "../../types/laboratory";
import { ArrowLeft, Save, FileCheck } from "lucide-react";

export default function TestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const request = useLaboratoryStore((s) => s.requests.find(r => r.id === id));
  const updateRequestStatus = useLaboratoryStore((s) => s.updateRequestStatus);
  const addReport = useLaboratoryStore((s) => s.addReport);

  const [parameters, setParameters] = useState<TestParameter[]>(() => {
    if (!request) return [];
    if (request.testName.includes('CBC')) {
      return [
        { id: "1", name: "Hemoglobin", value: "", unit: "g/dL", referenceRange: "13.0 - 17.0", flag: "normal" },
        { id: "2", name: "WBC Count", value: "", unit: "cells/mcL", referenceRange: "4,500 - 11,000", flag: "normal" },
        { id: "3", name: "Platelet Count", value: "", unit: "cells/mcL", referenceRange: "150,000 - 450,000", flag: "normal" },
      ];
    } else if (request.testName.includes('Sugar')) {
      return [
        { id: "1", name: "Glucose", value: "", unit: "mg/dL", referenceRange: "70 - 100", flag: "normal" }
      ];
    }
    return [{ id: "1", name: "Result", value: "", flag: "normal" }];
  });

  const [remarks, setRemarks] = useState("");
  const [interpretation, setInterpretation] = useState("");

  useEffect(() => {
    if (request && request.status === 'Pending') {
      updateRequestStatus(request.id, 'In Progress');
    }
  }, [request, updateRequestStatus]);

  if (!request) {
    return <div className="p-8 text-center text-gray-500">Test request not found.</div>;
  }

  const handleParameterChange = (id: string, field: keyof TestParameter, value: string) => {
    setParameters(parameters.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addParameter = () => {
    const newId = (parameters.length + 1).toString();
    setParameters([...parameters, { id: newId, name: "", value: "", flag: "normal" }]);
  };

  const handleRemoveParameter = (id: string) => {
    setParameters(parameters.filter(p => p.id !== id));
  };

  const handleSaveDraft = () => {
    // In a real app, this would save to a draft state or partial report
    alert("Draft saved locally (mock).");
  };

  const handleSubmitForValidation = () => {
    // Ensure essential data is filled
    if (parameters.some(p => !p.name || !p.value)) {
      alert("Please fill in all parameter names and values.");
      return;
    }

    addReport({
      requestId: request.id,
      patientId: request.patientId,
      patientName: request.patientName,
      testName: request.testName,
      category: request.category,
      parameters: parameters,
      remarks,
      interpretation,
      reportedBy: user?.id || "unknown",
      reportedByName: user?.name || "Pathologist",
      status: "Awaiting Validation",
      requestedAt: request.requestedAt,
      completedAt: new Date().toISOString()
    });

    navigate('/pathologist/dashboard');
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Process Test Request</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Patient & Request Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b pb-2">Patient Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Name:</span>
                <span className="font-semibold text-gray-900">{request.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ID:</span>
                <span className="font-semibold text-gray-900">{request.patientId}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4 border-b pb-2">Request Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Test:</span>
                <span className="font-semibold text-gray-900 text-right">{request.testName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="font-semibold text-gray-900">{request.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pathologist:</span>
                <span className="font-semibold text-gray-900">{request.requestedByName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-semibold text-gray-900">{new Date(request.requestedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Result Entry */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Laboratory Findings</h2>

            <div className="space-y-4 mb-6">
              {parameters.map((p) => (
                <div key={p.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative">
                  <button
                    onClick={() => handleRemoveParameter(p.id)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 font-bold px-2 py-1"
                  >
                    ×
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Parameter Name</label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handleParameterChange(p.id, 'name', e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        placeholder="e.g. Hemoglobin"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Result Value</label>
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => handleParameterChange(p.id, 'value', e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-sm font-semibold"
                        placeholder="e.g. 14.2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                      <input
                        type="text"
                        value={p.unit || ''}
                        onChange={(e) => handleParameterChange(p.id, 'unit', e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        placeholder="e.g. g/dL"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Ref. Range</label>
                      <input
                        type="text"
                        value={p.referenceRange || ''}
                        onChange={(e) => handleParameterChange(p.id, 'referenceRange', e.target.value)}
                        className="w-full border border-gray-300 rounded p-2 text-sm"
                        placeholder="e.g. 13 - 17"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Flag</label>
                      <select
                        value={p.flag || 'normal'}
                        onChange={(e) => handleParameterChange(p.id, 'flag', e.target.value as ResultFlag)}
                        className={`w-full border border-gray-300 rounded p-2 text-sm font-medium ${p.flag === 'high' || p.flag === 'critical' ? 'text-red-600' : p.flag === 'low' ? 'text-orange-600' : 'text-gray-700'
                          }`}
                      >
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                        <option value="critical">Critical</option>
                        <option value="abnormal">Abnormal</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addParameter}
                className="text-sm text-blue-600 font-medium hover:text-blue-800"
              >
                + Add Parameter
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                rows={2}
                placeholder="Optional remarks..."
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">Interpretation</label>
              <textarea
                value={interpretation}
                onChange={(e) => setInterpretation(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                rows={3}
                placeholder="Laboratory interpretation..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleSaveDraft}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Save size={16} /> Save Draft
              </button>
              <button
                onClick={handleSubmitForValidation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <FileCheck size={16} /> Submit for Validation
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
