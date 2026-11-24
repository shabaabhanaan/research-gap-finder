import { MemberComponent } from '@/types';

/**
 * Automatically decomposes a research proposal or project title into
 * 4 balanced, publishable individual research components for a 4-member research group.
 */
export function decomposeInto4MemberComponents(
  projectTitle: string,
  projectText?: string,
  customMemberFocus?: { [key: number]: string }
): MemberComponent[] {
  const titleLower = (projectTitle + ' ' + (projectText || '')).toLowerCase();

  // 1. Detect if this is FlakeLens / Flaky Web Test / Software Testing domain
  if (/flak|test|debug|triage|localiz|repair|software|bug|ci\/cd|regression/i.test(titleLower)) {
    return [
      {
        memberNumber: 1,
        memberName: customMemberFocus?.[1] ? `Member 1 (${customMemberFocus[1]})` : 'Member 1',
        componentTitle: customMemberFocus?.[1] || 'Trace Acquisition & Asynchronous Web Telemetry Profiler',
        scopeAndRole: 'Responsible for designing the low-overhead execution tracing agent that hooks into headless browser runs (Chrome DevTools Protocol), capturing asynchronous DOM mutations, network payloads, WebSocket messages, and event loop microtasks without slowing down CI pipelines.',
        individualResearchGap: 'Existing web testing profilers incur 3x-5x runtime probe overhead and fail to capture non-deterministic asynchronous microtask timing states during concurrent CI executions.',
        individualResearchQuestions: [
          'RQ1.1: How can event-driven telemetry sampling minimize runtime probe overhead below 12% in containerized CI test runs?',
          'RQ1.2: Can differential trace serialization accurately distinguish non-deterministic timing delays from true application state transitions?'
        ],
        proposedMethodology: 'Chrome DevTools Protocol (CDP) instrumentation, event loop microtask interceptors, and compact differential trace serialization (LZ4 streaming).',
        datasetOrEvaluation: 'Evaluated across 20 open-source web applications (Playwright/Cypress test suites) measuring CPU, memory, and tracing latency overhead.',
        expectedDeliverables: [
          'Lightweight headless browser telemetry recorder extension',
          'Standardized trace schema for asynchronous web interactions',
          'Benchmark evaluation report on tracing runtime overhead'
        ]
      },
      {
        memberNumber: 2,
        memberName: customMemberFocus?.[2] ? `Member 2 (${customMemberFocus[2]})` : 'Member 2',
        componentTitle: customMemberFocus?.[2] || 'AI-Assisted Flaky Test Triage & Root-Cause Failure Classifier',
        scopeAndRole: 'Responsible for formulating the machine learning pipeline that parses execution logs and traces to predict whether a failed test is flaky or a genuine regression bug, clustering recurrent failures into explainable root-cause categories.',
        individualResearchGap: 'Current failure triage tools rely on brittle regular expressions and suffer from high false quarantine rates, creating developer alert fatigue and cold-start failures on new test suites.',
        individualResearchQuestions: [
          'RQ2.1: To what extent can sequence embeddings of execution logs and trace tokens accurately classify flaky failure families under severe class imbalance?',
          'RQ2.2: How can contrastive representation learning prevent false quarantining of genuine regression defects?'
        ],
        proposedMethodology: 'Online log parsing (Drain3 template mining), vectorization via TF-IDF + sequence embeddings, and density clustering (HDBSCAN) combined with contrastive classification.',
        datasetOrEvaluation: 'Corpus of 15,000+ historic CI test runs across open-source repositories; measured by Triage Precision, Recall, and False Quarantine Rate.',
        expectedDeliverables: [
          'Automated failure triage and flakiness classifier',
          'Root-cause failure cluster card generator for CI dashboards',
          'Empirical evaluation against baseline heuristic re-run strategies'
        ]
      },
      {
        memberNumber: 3,
        memberName: customMemberFocus?.[3] ? `Member 3 (${customMemberFocus[3]})` : 'Member 3',
        componentTitle: customMemberFocus?.[3] || 'Spectrum-Based Fault Localization & DOM Dependency Isolation',
        scopeAndRole: 'Responsible for identifying the exact failing statement, missing synchronization assertion, or race condition in the test script or frontend UI code that triggers non-deterministic failures.',
        individualResearchGap: 'Traditional spectrum-based fault localization (SBFL) treats statements statically and fails to identify dynamic asynchronous race conditions and DOM dependency order bugs.',
        individualResearchQuestions: [
          'RQ3.1: How can dynamic dependency graph slicing pinpoint asynchronous race conditions within JavaScript asynchronous promises and DOM selectors?',
          'RQ3.2: Can cross-run trace alignment isolate the exact point of behavioral divergence between passing and failing flaky test executions?'
        ],
        proposedMethodology: 'Dynamic program slicing, spectrum-based fault localization (Ochiai/Tarantula metrics), and state-transition graph differential alignment.',
        datasetOrEvaluation: 'Defects4Web and FlakyDB benchmark suites; evaluated by Mean Reciprocal Rank (MRR) and Top-1/Top-5 fault localization accuracy.',
        expectedDeliverables: [
          'Fine-grained fault localization and statement ranker engine',
          'Visual interactive trace divergence inspector for developers',
          'Comparative localization benchmark against static linters'
        ]
      },
      {
        memberNumber: 4,
        memberName: customMemberFocus?.[4] ? `Member 4 (${customMemberFocus[4]})` : 'Member 4',
        componentTitle: customMemberFocus?.[4] || 'Verified Automated Patch Synthesis & Test Assertion Repair',
        scopeAndRole: 'Responsible for automatically synthesizing correct, verified repair patches for flaky tests (such as adaptive wait conditions, robust selector replacements, and state resets) and verifying that the patches eliminate flakiness without masking real bugs.',
        individualResearchGap: 'Existing automated test repair approaches blindly insert arbitrary static sleep timeouts that inflate test execution times and mask genuine application regressions.',
        individualResearchQuestions: [
          'RQ4.1: How can constraint-guided program synthesis formulate deterministic synchronization assertions without inflating test run times?',
          'RQ4.2: What verification criteria guarantee that an automated test repair patch preserves full fault-detection sensitivity against true regression bugs?'
        ],
        proposedMethodology: 'AST-level code transformation, constraint-guided patch synthesis, and multi-run mutation testing to verify fault-detection preservation.',
        datasetOrEvaluation: 'Benchmark of 200+ confirmed flaky test cases; evaluated by Flakiness Elimination Rate, Mutation Score Preservation, and Execution Time Delta.',
        expectedDeliverables: [
          'Automated patch synthesizer for test synchronization repairs',
          'Verified regression-check test harness',
          'Empirical validation report on patch robustness and developer acceptance'
        ]
      }
    ];
  }

  // 2. Generic Intelligent 4-Member Decomposition for Any Academic Project
  const cleanTitle = projectTitle.replace(/^(a|an|the)\s+/i, '').trim();

  return [
    {
      memberNumber: 1,
      memberName: customMemberFocus?.[1] ? `Member 1 (${customMemberFocus[1]})` : 'Member 1',
      componentTitle: customMemberFocus?.[1] || `Data Ingestion, Preprocessing & Feature Extraction Architecture`,
      scopeAndRole: `Responsible for designing the foundational data pipelines, telemetry acquisition, data cleaning, and high-dimensional feature engineering required for ${cleanTitle}.`,
      individualResearchGap: `Existing preprocessing and collection pipelines in ${cleanTitle} suffer from severe noise contamination, high acquisition latency, and lack of standardized cross-system ingestion protocols.`,
      individualResearchQuestions: [
        `RQ1.1: How can multi-modal telemetry preprocessing preserve high-frequency signals while reducing data dimensionality?`,
        `RQ1.2: What data normalization techniques effectively counteract distribution shift across heterogeneous collection sources?`
      ],
      proposedMethodology: 'High-throughput stream processing, adaptive feature extraction, and automated noise filtering algorithms.',
      datasetOrEvaluation: 'Domain benchmark datasets evaluated on signal-to-noise ratio, ingestion throughput, and data fidelity metrics.',
      expectedDeliverables: [
        'Robust data collection and preprocessing module',
        'Standardized feature extraction pipeline',
        'Data profiling and validation benchmark report'
      ]
    },
    {
      memberNumber: 2,
      memberName: customMemberFocus?.[2] ? `Member 2 (${customMemberFocus[2]})` : 'Member 2',
      componentTitle: customMemberFocus?.[2] || `Core Predictive / Analytical Intelligence Engine`,
      scopeAndRole: `Responsible for architecting and training the primary analytical or machine learning models that perform classification, prediction, or diagnostic reasoning for ${cleanTitle}.`,
      individualResearchGap: `Current analytical architectures exhibit sharp accuracy degradation when encountering subtle domain perturbations, edge cases, and tail-end distributions.`,
      individualResearchQuestions: [
        `RQ2.1: How can tailored representation learning achieve state-of-the-art predictive accuracy under limited supervised training labels?`,
        `RQ2.2: Can uncertainty quantification mechanisms reliably identify ambiguous or out-of-distribution inputs?`
      ],
      proposedMethodology: 'Deep neural network architecture design, transfer learning, and Bayesian uncertainty calibration.',
      datasetOrEvaluation: 'Rigorous cross-validation on public and synthetic domain benchmarks measuring Precision, Recall, and AUROC.',
      expectedDeliverables: [
        'Trained and calibrated core analytical model',
        'Uncertainty estimation scoring module',
        'Ablation study and comparative performance matrix'
      ]
    },
    {
      memberNumber: 3,
      memberName: customMemberFocus?.[3] ? `Member 3 (${customMemberFocus[3]})` : 'Member 3',
      componentTitle: customMemberFocus?.[3] || `Optimization, Fault Tolerance & Low-Latency Acceleration`,
      scopeAndRole: `Responsible for optimizing computational performance, memory footprint, edge compatibility, and resilience against system failures for ${cleanTitle}.`,
      individualResearchGap: `State-of-the-art methods impose prohibitive memory footprints and execution latencies that prevent deployment in real-time or resource-constrained environments.`,
      individualResearchQuestions: [
        `RQ3.1: How can dynamic optimization and pruning maintain accuracy while reducing inference latency below acceptable operational thresholds?`,
        `RQ3.2: What fault-tolerant recovery mechanisms guarantee continuous operation during network or component failures?`
      ],
      proposedMethodology: 'Model compression / quantization, asynchronous execution scheduling, and fault-tolerant failover protocols.',
      datasetOrEvaluation: 'Stress testing on varied hardware profiles measuring P99 latency, memory footprint, and recovery time.',
      expectedDeliverables: [
        'Optimized runtime execution engine',
        'Fault-tolerant recovery and synchronization sub-system',
        'Hardware profiling and scalability benchmark'
      ]
    },
    {
      memberNumber: 4,
      memberName: customMemberFocus?.[4] ? `Member 4 (${customMemberFocus[4]})` : 'Member 4',
      componentTitle: customMemberFocus?.[4] || `System Verification, Practical Intervention & User Evaluation`,
      scopeAndRole: `Responsible for end-to-end integration, automated intervention/repair verification, real-world workflow integration, and rigorous experimental validation for ${cleanTitle}.`,
      individualResearchGap: `Existing literature focuses heavily on isolated component metrics, lacking holistic end-to-end evaluation, verified intervention protocols, and human-in-the-loop usability testing.`,
      individualResearchQuestions: [
        `RQ4.1: How can automated intervention recommendations be formally verified before triggering live operational changes?`,
        `RQ4.2: What empirical gains in developer/operator task completion time are achieved compared to conventional manual workflows?`
      ],
      proposedMethodology: 'Automated verification test harness, end-to-end pipeline orchestration, and controlled human-in-the-loop user study.',
      datasetOrEvaluation: 'End-to-end deployment benchmark comparing time-to-resolution, verified success rate, and user usability metrics (SUS).',
      expectedDeliverables: [
        'Integrated end-to-end evaluation platform',
        'Automated intervention verification harness',
        'User study and empirical comparative validation report'
      ]
    }
  ];
}
