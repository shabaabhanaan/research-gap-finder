import { Paper, ResearchGap, RecommendedDirection, MatrixRow, SynthesisResult, GapCategory, ReferenceItem, MemberComponent } from '@/types';
import { decomposeInto4MemberComponents } from '@/lib/groupDecomposition';

/**
 * Main synthesis entrypoint: Analyzes multiple papers to synthesize research gaps.
 */
export async function synthesizeResearchGaps(
  papers: Paper[],
  apiKey?: string,
  modelName: 'gemini' | 'openai' | 'local' = 'local'
): Promise<SynthesisResult> {
  if (papers.length === 0) {
    throw new Error('Please provide at least one paper for synthesis.');
  }

  // If user provided an API key and selected LLM mode, attempt LLM synthesis
  if (apiKey && (modelName === 'gemini' || modelName === 'openai')) {
    try {
      const llmResult = await runLLMSynthesis(papers, apiKey, modelName);
      if (llmResult) return llmResult;
    } catch (err) {
      console.warn('LLM synthesis failed or timed out, falling back to local academic synthesis engine:', err);
    }
  }

  // Robust Built-in Academic Synthesis Engine
  return runBuiltInAcademicSynthesis(papers);
}

/**
 * Built-in deterministic academic gap synthesis engine
 */
export function runBuiltInAcademicSynthesis(papers: Paper[]): SynthesisResult {
  const allLimitations: { paperTitle: string; text: string }[] = [];
  const allFutureWork: { paperTitle: string; text: string }[] = [];

  papers.forEach(p => {
    (p.limitations || []).forEach(lim => {
      allLimitations.push({ paperTitle: p.title, text: lim });
    });
    (p.futureWork || []).forEach(fw => {
      allFutureWork.push({ paperTitle: p.title, text: fw });
    });
  });

  // Extract core keywords from titles to determine common domain
  const domain = inferDomain(papers);

  // Group limitations into taxonomy categories
  const gaps: ResearchGap[] = [];

  // 1. Methodological Gaps
  const methodEvidence = findEvidenceMatching(
    allLimitations,
    allFutureWork,
    /method|metric|evaluat|baseline|algorithm|framework|ablation|accuracy|heuristic|ground truth|validation|calibration|benchmark/i
  );
  if (methodEvidence.length > 0) {
    gaps.push({
      id: 'gap-methodological-1',
      category: 'methodological',
      title: 'Absence of Robust Diagnostic Calibration & Real-time Uncertainty Verification',
      description: `Existing methodologies rely on static offline metrics and benchmarks, exhibiting sharp performance cliffs when confronted with ambiguous edge cases, out-of-distribution inputs, or rare classes. Current frameworks lack reliable uncertainty quantification before triggering critical automated decisions.`,
      evidence: methodEvidence.slice(0, 3),
      severity: 'High',
      suggestedQuestions: [
        `RQ1: How can conformal prediction and Bayesian uncertainty estimation be embedded directly into model inferences to reliably flag uncalibrated predictions?`,
        `RQ2: To what extent do existing benchmark metrics (e.g. F1, BLEU, Perplexity) fail to penalize catastrophic safety-critical hallucinations?`
      ],
      suggestedMethodology: 'Design a conformalized uncertainty thresholding module and benchmark across a perturbed stress-test evaluation suite with adversarial perturbations.',
      potentialImpact: 'Provides formal safety guarantees and significantly reduces catastrophic classification errors in high-stakes environments.'
    });
  }

  // 2. Empirical & Data Gaps
  const empiricalEvidence = findEvidenceMatching(
    allLimitations,
    allFutureWork,
    /data|synthetic|sample|size|dataset|non-iid|distribution|ehr|skew|imbalance|cohort|participant|noise|label/i
  );
  if (empiricalEvidence.length > 0 || papers.some(p => /synthetic|skew|ehr|dataset/i.test(p.datasetOrSample))) {
    gaps.push({
      id: 'gap-empirical-1',
      category: 'empirical',
      title: 'Reliance on Curated/Synthetic Corpora & Severe Non-IID Distribution Skew',
      description: `Evaluations predominantly depend on homogenized synthetic benchmarks or single-region datasets. When evaluated across heterogeneous institutions or decentralized non-IID distributions, statistical discrepancies degrade model convergence and disproportionately impact minority cohorts.`,
      evidence: empiricalEvidence.length > 0 ? empiricalEvidence.slice(0, 3) : [
        { paperTitle: papers[0].title, quoteOrNote: papers[0].datasetOrSample }
      ],
      severity: 'High',
      suggestedQuestions: [
        `RQ1: How does training on synthetic surrogate distributions distort representation learning when deployed on longitudinal real-world clinical/operational data?`,
        `RQ2: Can covariate shift adaptation protocols mitigate severe performance degradation across underrepresented minority demographic subsets?`
      ],
      suggestedMethodology: 'Formulate a multi-center benchmark dataset capturing longitudinal real-world drift and evaluate covariate shift adaptation mechanisms.',
      potentialImpact: 'Eliminates demographic disparities and establishes realistic validation boundaries beyond idealized lab benchmarks.'
    });
  }

  // 3. Contextual / Population Gaps
  const contextualEvidence = findEvidenceMatching(
    allLimitations,
    allFutureWork,
    /demographic|ethnic|geographic|global|language|cross-lingual|pediatric|minority|regional|rural|clinic/i
  );
  if (contextualEvidence.length > 0) {
    gaps.push({
      id: 'gap-contextual-1',
      category: 'contextual',
      title: 'Geographic, Demographic, and Linguistic Generalization Deficits',
      description: `Current models and frameworks exhibit geographic and linguistic centralism, failing to generalize across low-resource dialects, non-Western demographic cohorts, or disparate operational infrastructures (such as rural health systems).`,
      evidence: contextualEvidence.slice(0, 3),
      severity: 'Medium',
      suggestedQuestions: [
        `RQ1: What structural factors in current tokenizers and feature extractors induce systematic bias against low-resource and non-English contexts?`,
        `RQ2: How can localized domain-adaptation layers be efficiently fine-tuned with minimal local supervisory signals?`
      ],
      suggestedMethodology: 'Execute cross-regional zero-shot transfers comparing models on localized cohorts with diverse socio-demographic indicators.',
      potentialImpact: 'Ensures global equitable access and resilience against regional deployment blindspots.'
    });
  }

  // 4. Practical / Systems & Implementation Gaps
  const practicalEvidence = findEvidenceMatching(
    allLimitations,
    allFutureWork,
    /latency|compute|memory|hardware|edge|bandwidth|throughput|energy|power|cost|iot|chip|ram|mobile|battery/i
  );
  if (practicalEvidence.length > 0 || papers.some(p => /quantization|edge|compression|bandwidth|federated/i.test(p.title + p.abstract))) {
    gaps.push({
      id: 'gap-practical-1',
      category: 'practical',
      title: 'High Compute/Bandwidth Overhead & Hardware-Constrained Deployment Bottlenecks',
      description: `State-of-the-art architectures impose prohibitive memory, latency, and synchronization bandwidth burdens, hindering deployment on edge devices, low-power microcontrollers, or bandwidth-constrained decentralized networks.`,
      evidence: practicalEvidence.slice(0, 3),
      severity: 'High',
      suggestedQuestions: [
        `RQ1: How can dynamic compute pruning and hardware-aware quantization balance latency and inference fidelity under strict energy and thermal throttling constraints?`,
        `RQ2: Can asynchronous communication protocols preserve global model synchronization without saturating intermittent network uplinks?`
      ],
      suggestedMethodology: 'Profile on-device memory footprints and kernel execution times across consumer-grade microchips; formulate an adaptive compute budget scheduler.',
      potentialImpact: 'Unlocks real-time sub-second on-device execution and slashes cloud inference operating costs.'
    });
  }

  // 5. Theoretical / Governance Gap
  const theoreticalEvidence = findEvidenceMatching(
    allLimitations,
    allFutureWork,
    /privacy|differential privacy|guarantee|formal|trade-off|theoretical|explainab|interpret|fairness|convergence/i
  );
  if (theoreticalEvidence.length > 0) {
    gaps.push({
      id: 'gap-theoretical-1',
      category: 'theoretical',
      title: 'Theoretical Tension Between Differential Privacy Bounds and Model Utility/Fairness',
      description: `Enforcing strict formal privacy bounds (e.g. ε < 2.0) introduces stochastic gradient degradation that disproportionately penalizes tail distributions, creating an unresolved trade-off between privacy guarantees and utility fairness.`,
      evidence: theoreticalEvidence.slice(0, 3),
      severity: 'Medium',
      suggestedQuestions: [
        `RQ1: What are the theoretical Pareto frontiers between differential privacy noise injection and minority cohort classification parity?`,
        `RQ2: Can client-adaptive clipping thresholds preserve formal DP guarantees while preventing gradient attenuation for rare-class instances?`
      ],
      suggestedMethodology: 'Formulate a constrained optimization objective that balances differential privacy epsilon with disparate impact parity metrics.',
      potentialImpact: 'Provides foundational mathematical formulations for ethical, privacy-preserving collaborative intelligence.'
    });
  }

  // If no gaps triggered, provide a comprehensive methodological gap
  if (gaps.length === 0) {
    gaps.push({
      id: 'gap-general-1',
      category: 'methodological',
      title: 'Lack of Standardized Cross-Domain Evaluation and Ablation Protocols',
      description: 'The uploaded literature lacks rigorous cross-validation across independent benchmark domains, leaving open questions regarding true architectural generalizability.',
      evidence: [
        { paperTitle: papers[0].title, quoteOrNote: papers[0].limitations?.[0] || 'Limited experimental testing boundaries.' }
      ],
      severity: 'Medium',
      suggestedQuestions: [
        'RQ1: How do architectural components generalize when subjected to unexpected real-world domain shifts?',
        'RQ2: What ablation benchmarks are essential to isolate genuine capability gains from statistical artifacts?'
      ],
      suggestedMethodology: 'Construct an open benchmark suite incorporating stress testing and cross-validation across multiple distinct domains.',
      potentialImpact: 'Establishes reproducibility and reliable scientific comparability.'
    });
  }

  // Recommended Future Research Agenda
  const recommendedDirections: RecommendedDirection[] = [
    {
      id: 'dir-1',
      title: 'Adaptive Multi-Fidelity Framework with Conformal Uncertainty Bounds',
      rationale: 'Directly tackles the critical methodological and empirical gaps identified across multiple papers by combining uncertainty estimation with dynamic compute allocation.',
      targetVenueType: 'Conference',
      difficulty: 'Advanced',
      expectedContribution: 'Full conference paper proposing a novel architecture with mathematical proof of coverage guarantees.',
      relatedGapIds: gaps.map(g => g.id).slice(0, 2)
    },
    {
      id: 'dir-2',
      title: 'Empirical Benchmark of Cross-Demographic Generalization on Real-World Datasets',
      rationale: 'Addresses the empirical and contextual gap by shifting away from idealized synthetic benchmarks to heterogeneous multi-center datasets.',
      targetVenueType: 'Journal',
      difficulty: 'Intermediate',
      expectedContribution: 'Comprehensive journal benchmarking paper uncovering systemic failure modes in existing state-of-the-art models.',
      relatedGapIds: gaps.filter(g => g.category === 'empirical' || g.category === 'contextual').map(g => g.id)
    },
    {
      id: 'dir-3',
      title: 'Lightweight Asynchronous Protocol for Resource-Constrained Environments',
      rationale: 'Bypasses the practical latency and bandwidth barriers noted in deployment studies.',
      targetVenueType: 'Workshop / Short Paper',
      difficulty: 'Novice',
      expectedContribution: 'High-impact workshop paper or empirical study with immediate industry applicability.',
      relatedGapIds: gaps.filter(g => g.category === 'practical').map(g => g.id)
    }
  ];

  // Build Comparative Literature Matrix
  const comparativeMatrix: MatrixRow[] = papers.map(p => ({
    paperId: p.id,
    title: p.title,
    url: p.url,
    doi: p.doi,
    method: p.methodology ? p.methodology.slice(0, 140) + '...' : 'Empirical benchmark',
    data: p.datasetOrSample ? p.datasetOrSample.slice(0, 120) + '...' : 'Benchmark dataset',
    primaryLimitation: (p.limitations && p.limitations[0]) ? p.limitations[0] : 'Restricted scope of evaluation',
    futureDirection: (p.futureWork && p.futureWork[0]) ? p.futureWork[0] : 'Investigate broader domain generalization'
  }));

  // Build Formatted Academic References
  const references: ReferenceItem[] = papers.map((p, idx) => {
    const authors = p.authors && p.authors.length > 0 ? p.authors : ['Lead Researcher'];
    const year = p.year || new Date().getFullYear();
    const venue = p.venue || 'Academic Proceedings';
    const authorStr = authors.length > 3 ? `${authors[0]} et al.` : authors.join(', ');
    const doiStr = p.doi ? ` https://doi.org/${p.doi}` : '';
    const doiIeee = p.doi ? `, doi: ${p.doi}` : '';

    return {
      id: `ref-${p.id || idx + 1}`,
      title: p.title,
      authors,
      year,
      venue,
      doi: p.doi,
      url: p.url,
      abstract: p.abstract,
      citationApa: `${authorStr} (${year}). ${p.title}. ${venue}.${doiStr}`,
      citationIeee: `[${idx + 1}] ${authorStr}, "${p.title}", in ${venue}, ${year}${doiIeee}.`,
      bibtex: `@article{ref_${idx + 1},
  author = {${authors.join(' and ')}},
  title = {${p.title}},
  journal = {${venue}},
  year = {${year}}
}`
    };
  });

  // Decompose into 4-Member Group Components
  const primaryTitle = papers[0]?.title || 'Research Project Synthesis';
  const memberComponents: MemberComponent[] = decomposeInto4MemberComponents(primaryTitle);

  return {
    domain,
    summary: `Synthesized analysis across ${papers.length} peer papers revealed ${allLimitations.length} explicit limitations and open problems. The most urgent research voids center around ${gaps.map(g => g.category).join(', ')} dimensions, highlighting critical opportunities for high-impact publishable inquiry.`,
    papersAnalyzed: papers.length,
    totalLimitationsFound: allLimitations.length,
    references,
    memberComponents,
    gaps,
    recommendedDirections,
    comparativeMatrix,
    timestamp: new Date().toISOString()
  };
}

/**
 * Filter limitations and future work for matching topics
 */
function findEvidenceMatching(
  limitations: { paperTitle: string; text: string }[],
  futureWork: { paperTitle: string; text: string }[],
  regex: RegExp
): { paperTitle: string; quoteOrNote: string }[] {
  const matches: { paperTitle: string; quoteOrNote: string }[] = [];

  for (const item of limitations) {
    if (regex.test(item.text)) {
      matches.push({ paperTitle: item.paperTitle, quoteOrNote: item.text });
    }
  }

  for (const item of futureWork) {
    if (regex.test(item.text)) {
      matches.push({ paperTitle: item.paperTitle, quoteOrNote: `Future Work: ${item.text}` });
    }
  }

  return matches;
}

/**
 * Infer domain from paper titles and abstracts
 */
function inferDomain(papers: Paper[]): string {
  const combined = papers.map(p => `${p.title} ${p.abstract}`).join(' ').toLowerCase();
  if (/flak|test|debug|triage|localiz|repair|software|bug|code|ci\/cd|regression/i.test(combined)) {
    return 'Automated Software Engineering & Intelligent Test Systems';
  }
  if (/security|vulnerab|cryptog|malware|privacy|attack|threat/i.test(combined)) {
    return 'Cybersecurity, System Verification & Privacy';
  }
  if (/medical|diagnostic|clinical|radiology|hospital|patient|health/i.test(combined)) {
    return 'Multimodal Clinical AI & Biomedical Informatics';
  }
  if (/federated|distributed|differential privacy|gossip/i.test(combined)) {
    return 'Privacy-Preserving Distributed & Federated Systems';
  }
  if (/quantization|compression|edge|mobile|hardware|iot|microcontroller/i.test(combined)) {
    return 'Efficient Deep Learning & Edge Computing';
  }
  if (/language model|llm|nlp|transformer|text generation/i.test(combined)) {
    return 'Natural Language Processing & Large Language Models';
  }
  return 'Applied Machine Learning & Computational Systems';
}

/**
 * LLM-powered synthesis for users who provide an API Key
 */
async function runLLMSynthesis(
  papers: Paper[],
  apiKey: string,
  modelName: 'gemini' | 'openai'
): Promise<SynthesisResult | null> {
  // Construct the prompt
  const paperSummaries = papers.map((p, idx) => `
Paper [${idx + 1}]: "${p.title}" (${p.year || 'N/A'})
- Abstract: ${p.abstract}
- Methodology: ${p.methodology}
- Dataset/Sample: ${p.datasetOrSample}
- Limitations: ${(p.limitations || []).map(l => `* ${l}`).join('\n')}
- Future Work: ${(p.futureWork || []).map(f => `* ${f}`).join('\n')}
`).join('\n---\n');

  const systemPrompt = `You are a Principal AI Research Scientist and Senior Academic Reviewer.
Analyze the provided research papers, cross-examine their stated limitations and future work, and identify publishable, high-impact RESEARCH GAPS.
Return a STRICT JSON response conforming to the following TypeScript interface:
{
  "domain": string,
  "summary": string,
  "gaps": [
    {
      "id": string,
      "category": "methodological" | "empirical" | "theoretical" | "contextual" | "practical",
      "title": string,
      "description": string,
      "severity": "High" | "Medium" | "Low",
      "evidence": [{"paperTitle": string, "quoteOrNote": string}],
      "suggestedQuestions": string[],
      "suggestedMethodology": string,
      "potentialImpact": string
    }
  ],
  "recommendedDirections": [
    {
      "id": string,
      "title": string,
      "rationale": string,
      "targetVenueType": "Conference" | "Journal" | "Workshop / Short Paper",
      "difficulty": "Novice" | "Intermediate" | "Advanced",
      "expectedContribution": string,
      "relatedGapIds": string[]
    }
  ]
}`;

  if (modelName === 'gemini') {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nHere are the papers to synthesize:\n${paperSummaries}` }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (rawText) {
      const parsed = JSON.parse(rawText);
      const matrix: MatrixRow[] = papers.map(p => ({
        paperId: p.id,
        title: p.title,
        method: p.methodology ? p.methodology.slice(0, 140) + '...' : 'Empirical benchmark',
        data: p.datasetOrSample ? p.datasetOrSample.slice(0, 120) + '...' : 'Benchmark dataset',
        primaryLimitation: (p.limitations && p.limitations[0]) ? p.limitations[0] : 'Restricted scope of evaluation',
        futureDirection: (p.futureWork && p.futureWork[0]) ? p.futureWork[0] : 'Investigate broader domain generalization'
      }));

      return {
        domain: parsed.domain || inferDomain(papers),
        summary: parsed.summary || 'LLM Synthesized Analysis of Academic Gaps',
        papersAnalyzed: papers.length,
        totalLimitationsFound: papers.reduce((acc, p) => acc + (p.limitations?.length || 0), 0),
        gaps: parsed.gaps || [],
        recommendedDirections: parsed.recommendedDirections || [],
        comparativeMatrix: matrix,
        timestamp: new Date().toISOString()
      };
    }
  }

  return null;
}
