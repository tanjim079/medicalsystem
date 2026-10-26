export interface MouDiscountItem {
  sl: string;
  category: string;
  description: string;
  discountPercentage: number;
  highlightTests?: string[];
  exceptions?: string;
  advisedBy: string;
}

export interface MouPartner {
  id: string;
  name: string;
  shortName: string;
  branch: string;
  category: "Diagnostic & Consultation" | "Hospital & Diagnostic Care";
  mouSigningDate: string;
  mouSigningTime: string;
  venue: string;
  organizedBy: string;
  brandColor: {
    primary: string;
    secondary: string;
    light: string;
    badge: string;
    border: string;
  };
  summary: string;
  locationInfo: {
    address: string;
    city: string;
  };
  discounts: MouDiscountItem[];
  specialNotes?: string[];
}

export const mouPartnersData: MouPartner[] = [
  {
    id: "popular-diagnostic-rajshahi",
    name: "Popular Diagnostic Centre Limited",
    shortName: "Popular Diagnostic",
    branch: "Rajshahi Branch",
    category: "Diagnostic & Consultation",
    mouSigningDate: "24th June, 2024",
    mouSigningTime: "5:00 PM",
    venue: "RUET Health Complex, RUET",
    organizedBy: "RUET Health Complex",
    brandColor: {
      primary: "emerald-700",
      secondary: "emerald-600",
      light: "emerald-50",
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      border: "border-emerald-200",
    },
    summary:
      "A premier diagnostic facility offering comprehensive pathology, radiological imaging, and specialized cardiac & endoscopic investigations with up to 40% discount for the RUET community.",
    locationInfo: {
      address: "Lakshmipur More, Greater Road",
      city: "Rajshahi, Bangladesh",
    },
    discounts: [
      {
        sl: "01",
        category: "Pathological Tests",
        description: "Pathological Test (All routine and specialized pathology investigations).",
        discountPercentage: 40,
        highlightTests: ["Routine Blood Tests", "Biochemistry", "Hormone Analysis", "Immunology", "Urine & Stool R/M/E"],
        advisedBy: "Advised by doctor of RUET or Registered doctor outside RUET",
      },
      {
        sl: "02",
        category: "Imaging & Radiology Tests",
        description: "CT Scan, MRI, X-ray, OPG, USG (Ultrasonography), BMD, EEG, ECG etc.",
        discountPercentage: 25,
        highlightTests: ["CT Scan", "MRI", "Digital X-Ray", "OPG", "USG (Ultrasonogram)", "BMD", "EEG", "ECG"],
        advisedBy: "Advised by doctor of RUET or Registered doctor outside RUET",
      },
      {
        sl: "03",
        category: "Specialized Diagnostic Procedures",
        description:
          "Endoscopy, Colonoscopy, Echo Color Doppler, 2D Echo, ETT & Histopathology Test etc.",
        discountPercentage: 20,
        highlightTests: ["2D Echocardiogram", "Echo Color Doppler", "ETT", "Endoscopy", "Histopathology", "Colonoscopy"],
        exceptions: "Excluding Dr. Ariful Hasan (Colonoscopy)",
        advisedBy: "Advised by doctor of RUET or Registered doctor outside RUET",
      },
    ],
    specialNotes: [
      "Colonoscopy performed by Dr. Ariful Hasan is excluded from the 20% discount as per mutual terms.",
      "Valid prescription and RUET identification are mandatory prior to billing.",
    ],
  },
  {
    id: "islami-bank-hospital-rajshahi",
    name: "Islami Bank Hospital",
    shortName: "Islami Bank Hospital",
    branch: "Rajshahi Branch",
    category: "Hospital & Diagnostic Care",
    mouSigningDate: "24th June, 2024",
    mouSigningTime: "5:00 PM",
    venue: "RUET Health Complex, RUET",
    organizedBy: "RUET Health Complex",
    brandColor: {
      primary: "teal-700",
      secondary: "teal-600",
      light: "teal-50",
      badge: "bg-teal-100 text-teal-800 border-teal-200",
      border: "border-teal-200",
    },
    summary:
      "A modern multidisciplinary hospital providing broad diagnostic pathology and imaging discounts across all modalities for RUET students, teachers, officers, and staff.",
    locationInfo: {
      address: "Medical Mor, Kazihata",
      city: "Rajshahi, Bangladesh",
    },
    discounts: [
      {
        sl: "01",
        category: "Pathological Tests",
        description: "Pathological Tests: All kinds of clinical pathology, hematology, and serology tests.",
        discountPercentage: 35,
        highlightTests: ["Complete Blood Count (CBC)", "Lipid Profile", "Liver & Renal Function", "Blood Sugar & HbA1c", "All Pathological Investigations"],
        advisedBy: "Advised by doctor of RUET or Registered medical practitioner",
      },
      {
        sl: "02",
        category: "Imaging & Radiological Tests",
        description: "Imaging Tests & Radiological Tests: All kinds of X-ray, Ultrasound, and diagnostic radiology.",
        discountPercentage: 30,
        highlightTests: ["Digital X-Ray (All Views)", "Ultrasonography (All Organs)", "Radiological Imaging", "Cardiovascular Diagnostics"],
        advisedBy: "Advised by doctor of RUET or Registered medical practitioner",
      },
    ],
    specialNotes: [
      "Applies to all kinds of routine and advanced pathology and imaging investigations.",
      "Patients must show RUET Student ID / Employee ID / RUET Health Card at the reception/billing desk.",
    ],
  },
];

export const mouGuidelines = {
  eligibility: [
    "Regular RUET Students with valid Student ID card.",
    "RUET Teachers, Officers, and Employees with valid RUET Official ID card.",
    "Dependent family members of RUET personnel as recognized under university medical regulations.",
  ],
  requiredDocuments: [
    "Valid RUET Student ID Card or Official Employee Identity Card.",
    "Official Prescription / Test Requisition signed by a RUET Health Complex Medical Officer OR any BMDC-registered physician.",
    "Medical booklet / Health Card (if applicable for students).",
  ],
  stepsToClaim: [
    {
      step: 1,
      title: "Doctor Consultation & Advice",
      description: "Obtain a formal prescription or test advice from RUET Medical Center doctor or any registered doctor outside RUET.",
    },
    {
      step: 2,
      title: "Present RUET ID at Registration Desk",
      description: "Visit the Rajshahi branch of the partner center (Popular Diagnostic or Islami Bank Hospital) and present your RUET ID before invoice generation.",
    },
    {
      step: 3,
      title: "Receive MoU Discount Invoice",
      description: "The billing department will verify the credentials and automatically apply the agreed MoU percentage discount (20% – 40%) to your bill.",
    },
    {
      step: 4,
      title: "Sample Collection & Timely Reports",
      description: "Undergo your diagnostic investigations and collect printed or online test reports according to the center's schedule.",
    },
  ],
};
