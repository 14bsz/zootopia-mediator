export interface UserInput {
  name: string;
  role: string; // 'A' or 'B'
  description: string;
  demand: string;
  image: File | null;
  imageBase64?: string;
}

export interface MediationResult {
  judyAnalysis: string; // Judy's logical opening
  nickComment: string; // Nick's humorous follow-up
  responsibility: {
    partyA: number;
    partyB: number;
  };
  adviceForA: string;
  adviceForB: string;
  reconciliationPlan: string[]; // List of actionable steps
  synergyScoreChange: number; // How much score to deduct
}

export interface HistoryItem {
  id: string;
  date: string;
  partyA: string;
  partyB: string;
  result: MediationResult;
  reconciled: boolean;
}

export enum AppStep {
  ONBOARDING = 'ONBOARDING',
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  RECONCILIATION = 'RECONCILIATION'
}