import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LaboratoryRequest, LaboratoryReport, LaboratoryRequestStatus } from '../types/laboratory';

interface LaboratoryState {
  requests: LaboratoryRequest[];
  reports: LaboratoryReport[];
  
  addRequest: (request: Omit<LaboratoryRequest, 'id' | 'requestedAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: LaboratoryRequestStatus) => void;
  
  addReport: (report: Omit<LaboratoryReport, 'id'>) => void;
  updateReport: (id: string, updates: Partial<LaboratoryReport>) => void;
  validateReport: (id: string) => void;

  getRequestsByStatus: (status: LaboratoryRequestStatus) => LaboratoryRequest[];
  getReportsByStatus: (status: LaboratoryRequestStatus) => LaboratoryReport[];
  getReportsByPatient: (patientId: string) => LaboratoryReport[];
}

// Initial mock data
const initialRequests: LaboratoryRequest[] = [
  {
    id: "REQ-1001",
    patientId: "2204001",
    patientName: "Fatin",
    testId: "T-005",
    testName: "CBC",
    category: "Pathology",
    requestedBy: "DOC001",
    requestedByName: "Dr. Md. Azizul Islam",
    requestedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    priority: "Routine",
    status: "Pending"
  },
  {
    id: "REQ-1002",
    patientId: "2204002",
    patientName: "Tanjim",
    testId: "T-007",
    testName: "Fasting Blood Sugar (FBS) with CUS",
    category: "Pathology",
    requestedBy: "DOC002",
    requestedByName: "Dr. Farhana Rahman",
    requestedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    priority: "Urgent",
    status: "In Progress"
  }
];

const initialReports: LaboratoryReport[] = [
  {
    id: "REP-1001",
    requestId: "REQ-1000",
    patientId: "2204001",
    patientName: "Fatin",
    testName: "Urine for R/M/E",
    category: "Pathology",
    parameters: [
      { id: "p1", name: "Color", value: "Pale Yellow" },
      { id: "p2", name: "Appearance", value: "Clear" },
      { id: "p3", name: "pH", value: "6.0", referenceRange: "4.5 - 8.0", flag: "normal" }
    ],
    remarks: "Normal study.",
    reportedBy: "PATH001",
    reportedByName: "Dr. Rahman",
    status: "Validated",
    requestedAt: new Date(Date.now() - 172800000).toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    validatedAt: new Date(Date.now() - 80000000).toISOString()
  },
  {
    id: "REP-1002",
    requestId: "REQ-1002",
    patientId: "2204002",
    patientName: "Tanjim",
    testName: "Fasting Blood Sugar (FBS) with CUS",
    category: "Pathology",
    parameters: [
      { id: "p1", name: "Fasting Blood Sugar", value: "115", unit: "mg/dL", referenceRange: "70 - 100", flag: "high" }
    ],
    remarks: "Pre-diabetic range.",
    reportedBy: "PATH001",
    reportedByName: "Dr. Rahman",
    status: "Awaiting Validation",
    requestedAt: new Date(Date.now() - 3600000).toISOString(),
    completedAt: new Date().toISOString()
  }
];

export const useLaboratoryStore = create<LaboratoryState>()(
  persist(
    (set, get) => ({
      requests: initialRequests,
      reports: initialReports,

      addRequest: (requestData) => {
        const newRequest: LaboratoryRequest = {
          ...requestData,
          id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
          requestedAt: new Date().toISOString(),
          status: 'Pending',
        };
        set((state) => ({ requests: [newRequest, ...state.requests] }));
      },

      updateRequestStatus: (id, status) => {
        set((state) => ({
          requests: state.requests.map((r) => r.id === id ? { ...r, status } : r)
        }));
      },

      addReport: (reportData) => {
        const newReport: LaboratoryReport = {
          ...reportData,
          id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        };
        set((state) => ({ reports: [newReport, ...state.reports] }));
      },

      updateReport: (id, updates) => {
        set((state) => ({
          reports: state.reports.map((r) => r.id === id ? { ...r, ...updates } : r)
        }));
      },

      validateReport: (id) => {
        set((state) => ({
          reports: state.reports.map((r) => 
            r.id === id 
              ? { ...r, status: 'Validated', validatedAt: new Date().toISOString() } 
              : r
          )
        }));
      },

      getRequestsByStatus: (status) => {
        return get().requests.filter(r => r.status === status);
      },
      
      getReportsByStatus: (status) => {
        return get().reports.filter(r => r.status === status);
      },

      getReportsByPatient: (patientId) => {
        return get().reports.filter(r => r.patientId.toLowerCase() === patientId.toLowerCase());
      }
    }),
    {
      name: 'laboratory-storage',
    }
  )
);
