import { fetchAuth } from '../lib/fetchAuth';
import { create } from 'zustand';
import type { LaboratoryRequest, LaboratoryReport, LaboratoryRequestStatus } from '../types/laboratory';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface LaboratoryState {
  requests: LaboratoryRequest[];
  reports: LaboratoryReport[];
  loading: boolean;
  
  fetchLaboratoryData: () => Promise<void>;
  addRequest: (request: Omit<LaboratoryRequest, 'id' | 'requestedAt' | 'status'>) => Promise<LaboratoryRequest | null>;
  updateRequestStatus: (id: string, status: LaboratoryRequestStatus) => Promise<void>;
  
  addReport: (report: Omit<LaboratoryReport, 'id'>) => Promise<LaboratoryReport | null>;
  updateReport: (id: string, updates: Partial<LaboratoryReport>) => Promise<void>;
  validateReport: (id: string) => Promise<void>;
  approveReport: (id: string) => Promise<void>;

  getRequestsByStatus: (status: LaboratoryRequestStatus) => LaboratoryRequest[];
  getReportsByStatus: (status: LaboratoryRequestStatus) => LaboratoryReport[];
  getReportsByPatient: (patientId: string) => LaboratoryReport[];
}

export const useLaboratoryStore = create<LaboratoryState>()((set, get) => ({
  requests: [],
  reports: [],
  loading: false,

  fetchLaboratoryData: async () => {
    set({ loading: true });
    try {
      const [reqRes, repRes] = await Promise.all([
        fetchAuth(`${API_URL}/laboratory/requests`),
        fetchAuth(`${API_URL}/laboratory/reports`)
      ]);
      
      if (reqRes.ok && repRes.ok) {
        const requests = await reqRes.json();
        const reports = await repRes.json();
        set({ requests, reports });
      }
    } catch (error) {
      console.error("Error fetching laboratory data:", error);
    } finally {
      set({ loading: false });
    }
  },

  addRequest: async (requestData) => {
    const payload = {
      ...requestData,
      status: 'Pending',
      requestedAt: new Date().toISOString()
    };
    try {
      const res = await fetchAuth(`${API_URL}/laboratory/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newRequest = await res.json();
        set((state) => ({ requests: [...state.requests, newRequest] }));
        return newRequest;
      }
      return null;
    } catch (error) {
      console.error("Error adding lab request:", error);
      return null;
    }
  },

  updateRequestStatus: async (id, status) => {
    try {
      const res = await fetchAuth(`${API_URL}/laboratory/requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          requests: state.requests.map((r) => (r.id === id ? updated : r)),
        }));
      }
    } catch (error) {
      console.error("Error updating lab request status:", error);
    }
  },

  addReport: async (reportData) => {
    const payload = {
      ...reportData,
      id: `REP-${Math.floor(Math.random() * 10000)}`
    };
    try {
      const res = await fetchAuth(`${API_URL}/laboratory/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newReport = await res.json();
        set((state) => ({ reports: [...state.reports, newReport] }));
        return newReport;
      }
      return null;
    } catch (error) {
      console.error("Error adding lab report:", error);
      return null;
    }
  },

  updateReport: async (id, updates) => {
    try {
      const res = await fetchAuth(`${API_URL}/laboratory/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          reports: state.reports.map((r) => (r.id === id ? updated : r)),
        }));
      }
    } catch (error) {
      console.error("Error updating lab report:", error);
    }
  },

  validateReport: async (id) => {
    try {
      const res = await fetchAuth(`${API_URL}/laboratory/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Awaiting Payment' })
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          reports: state.reports.map((r) => (r.id === id ? updated : r)),
        }));
      }
    } catch (error) {
      console.error('Error validating lab report:', error);
    }
  },

  approveReport: async (id) => {
    try {
      const res = await fetchAuth(`${API_URL}/laboratory/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Validated', validatedAt: new Date().toISOString() })
      });
      if (res.ok) {
        const updated = await res.json();
        set((state) => ({
          reports: state.reports.map((r) => (r.id === id ? updated : r)),
        }));
      }
    } catch (error) {
      console.error('Error approving lab report:', error);
    }
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
}));


