export type GapCategory = 
  | 'methodological'
  | 'empirical'
  | 'theoretical'
  | 'contextual'
  | 'practical';

export interface Paper {
  id: string;
  title: string;
  authors?: string[];
  year?: string | number;
  venue?: string;
  url?: string;
  doi?: string;
  abstract: string;
  methodology: string;
  datasetOrSample: string;
  limitations: string[];
  futureWork: string[];
  rawText?: string;
  fileName: string;
  fileSize?: number;
}

export interface ResearchGap {
  id: string;
  category: GapCategory;
  title: string;
  description: string;
  evidence: {
    paperTitle: string;
    quoteOrNote: string;
  }[];
  severity: 'High' | 'Medium' | 'Low';
  suggestedQuestions: string[];
  suggestedMethodology: string;
  potentialImpact: string;
}

export interface RecommendedDirection {
  id: string;
  title: string;
  rationale: string;
  targetVenueType: 'Conference' | 'Journal' | 'Workshop / Short Paper';
  difficulty: 'Novice' | 'Intermediate' | 'Advanced';
  expectedContribution: string;
  relatedGapIds: string[];
}

export interface MatrixRow {
  paperId: string;
  title: string;
  url?: string;
  doi?: string;
  method: string;
  data: string;
  primaryLimitation: string;
  futureDirection: string;
}

export interface ReferenceItem {
  id: string;
  title: string;
  authors: string[];
  year: string | number;
  venue: string;
  publisher?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  citationApa: string;
  citationIeee: string;
  bibtex?: string;
}

export interface MemberComponent {
  memberNumber: number; // 1, 2, 3, 4
  memberName?: string;
  componentTitle: string;
  scopeAndRole: string;
  individualResearchGap: string;
  individualResearchQuestions: string[];
  proposedMethodology: string;
  datasetOrEvaluation: string;
  expectedDeliverables: string[];
}

export interface SynthesisResult {
  domain: string;
  summary: string;
  proposalTitle?: string;
  proposalText?: string;
  references?: ReferenceItem[];
  memberComponents?: MemberComponent[];
  papersAnalyzed: number;
  totalLimitationsFound: number;
  gaps: ResearchGap[];
  recommendedDirections: RecommendedDirection[];
  comparativeMatrix: MatrixRow[];
  timestamp: string;
}
