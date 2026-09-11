export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE' | 'INSUFFICIENT_EVIDENCE';

export interface WarningSignal {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  whyItIncreasesRisk: string;
  scoreContribution?: number;
}

export interface ScoreBreakdownItem {
  label: string;
  points: number;
  explanation?: string;
}

export interface AttachedEvidence {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  extractedText?: string;
  ocrPerformed?: boolean;
}

export interface OptionalIdentifiers {
  instagramHandle?: string;
  whatsappPhone?: string;
  upiId?: string;
  websiteUrl?: string;
  otherIdentifier?: string;
}

export interface ExtractedIdentifiers {
  upiIds: string[];
  phoneNumbers: string[];
  urls: string[];
  amounts: string[];
  sellerHandles: string[];
  otherIdentifiers?: string[];
  suspiciousKeywords: string[];
}

export interface CommunityMatchInfo {
  hasMatch: boolean;
  matchedIdentifiers: string[];
  corroboratingReportsCount: number;
  matchingThreats: CommunityThreat[];
  summaryNote: string;
}

export interface VerificationStatus {
  businessVerification: string;
  paymentVerification: string;
  communityStatus: string;
}

export interface ScamAnalysisResult {
  id: string;
  timestamp: string;
  rawText: string;
  senderHandle?: string;
  providedIdentifiers?: OptionalIdentifiers;
  attachedEvidence?: AttachedEvidence[];
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  scamCategory: string;
  headline: string;
  explanation: string;
  warningSignals: WarningSignal[];
  scoreBreakdown: ScoreBreakdownItem[];
  isInsufficientEvidence?: boolean;
  evidenceSummaryNote?: string;
  extractedIdentifiers: ExtractedIdentifiers;
  communityMatch?: CommunityMatchInfo;
  verificationStatus?: VerificationStatus;
  recommendedActions: string[];
  dangerousActionsToAvoid: string[];
  estimatedLossPotential: string;
  assessmentDisclaimer: string;
}

export interface CaseRecord {
  id: string;
  title: string;
  platform: 'Instagram' | 'WhatsApp' | 'Telegram' | 'SMS' | 'Online Marketplace';
  scamCategory: string;
  riskLevel: RiskLevel;
  riskScore: number;
  date: string;
  sellerHandle: string;
  savedLossEstimate: string;
  status: 'Loss Avoided' | 'Under Review' | 'Reported to 1930';
  notes: string;
  originalSnippet: string;
  attachedEvidence?: AttachedEvidence[];
  scoreBreakdown?: ScoreBreakdownItem[];
  analysisResult?: ScamAnalysisResult;
}

export interface CommunityThreat {
  id: string;
  title: string;
  platform: 'Instagram' | 'WhatsApp' | 'Telegram' | 'SMS' | 'Online Marketplace';
  scamType: string;
  reportedHandleOrUPI: string;
  description: string;
  upvoteCount: number;
  userUpvoted?: boolean;
  reportedDate: string;
  lossReported: string;
  verifiedCount: number;
  severity: RiskLevel;
}

export interface DemoPreset {
  id: string;
  name: string;
  platform: 'Instagram' | 'WhatsApp' | 'Telegram' | 'SMS' | 'Store';
  previewBadge: string;
  sellerHandle: string;
  messageText: string;
  expectedRisk: RiskLevel;
  description: string;
}
