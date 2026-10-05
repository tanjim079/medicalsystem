export type LaboratoryRequestStatus = 'Pending' | 'In Progress' | 'Awaiting Validation' | 'Awaiting Payment' | 'Validated' | 'Rejected';

export type ResultFlag = 'normal' | 'high' | 'low' | 'critical' | 'abnormal';

export interface TestParameter {
  id: string;
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  flag?: ResultFlag;
}

export interface LaboratoryRequest {
  id: string;
  patientId: string;
  patientName: string;
  testId: string;
  testName: string;
  category: string;
  requestedBy: string; // Doctor ID
  requestedByName: string; // Doctor Name
  requestedAt: string;
  priority: 'Routine' | 'Urgent';
  status: LaboratoryRequestStatus;
}

export interface LaboratoryReport {
  id: string;
  requestId: string;
  patientId: string;
  patientName: string;
  testName: string;
  category: string;
  parameters: TestParameter[];
  remarks?: string;
  interpretation?: string;
  reportedBy: string; // Pathologist ID
  reportedByName: string; // Pathologist Name
  status: LaboratoryRequestStatus;
  requestedAt: string;
  completedAt?: string;
  validatedAt?: string;
}
