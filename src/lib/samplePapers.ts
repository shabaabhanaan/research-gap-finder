import { Paper } from '@/types';

export const SAMPLE_PAPERS: Paper[] = [
  {
    id: 'paper-med-vlm',
    title: 'Evaluating Vision-Language Models on Medical Diagnostics: A Multimodal Benchmark',
    authors: ['A. Vance', 'H. Chen', 'M. Patel'],
    year: '2025',
    venue: 'IEEE Transactions on Medical Imaging (TMI)',
    url: 'https://ieeexplore.ieee.org/document/10478129',
    doi: '10.1109/TMI.2025.3409182',
    fileName: 'sample_medical_vlm_benchmark.pdf',
    abstract: 'Vision-Language Models (VLMs) demonstrate remarkable multi-modal zero-shot reasoning, but their application to clinical diagnostic workflows remains risky. We evaluate six leading open and proprietary models across 15,000 synthetic radiology scan-report pairs. While models achieve 88.4% diagnostic accuracy on canonical chest X-rays, their performance degrades precipitously when identifying rare pathologies and complex co-morbidities.',
    methodology: 'Zero-shot and few-shot multimodal prompting across GPT-4V, LLaVA-Med, and Med-PaLM. Evaluation metrics include clinical precision, recall, and BLEU-4 on radiological finding summaries.',
    datasetOrSample: '15,000 synthetic chest X-ray and CT scans derived from curated MIMIC-CXR and CheXpert subsets with simulated artifacts.',
    limitations: [
      'Evaluation conducted solely on synthetic radiology benchmarks without real-time physician-in-the-loop validation.',
      'Models exhibit severe hallucinations (18.3% error rate) when confronted with rare pediatric cardiopulmonary abnormalities.',
      'High inference latency (2.4s per scan) prohibits integration into urgent triage/emergency room systems.',
      'Dataset is skewed toward North American demographic representations, lacking global imaging variability.'
    ],
    futureWork: [
      'Investigate uncertainty calibration mechanisms to reject ambiguous scan interpretations.',
      'Develop cross-hospital federated evaluation protocols with non-synthetic, multi-ethnic patient records.',
      'Explore lightweight edge-compatible architectures capable of sub-200ms inference on local hospital PAC systems.'
    ]
  },
  {
    id: 'paper-edge-quant',
    title: 'Edge-Device Compression of Large Language Models via Dynamic Mixed-Precision Quantization',
    authors: ['K. Takahashi', 'S. Lindqvist', 'R. Morales'],
    year: '2024',
    venue: 'NeurIPS Workshop on Efficient Machine Learning',
    url: 'https://arxiv.org/abs/2403.09211',
    doi: '10.48550/arXiv.2403.09211',
    fileName: 'sample_edge_llm_quantization.pdf',
    abstract: 'Deploying 7B+ parameter language models on edge smartphones and micro-controllers requires severe memory compression. We introduce DynQuant, a post-training dynamic mixed-precision quantization strategy that allocates 4-bit representation to attention heads while preserving 8-bit precision for critical feed-forward layers. We achieve a 3.4x memory reduction with under 2.1% perplexity degradation on standard English corpora.',
    methodology: 'Hessian-guided sensitivity ranking to assign variable bit-depths per layer. Deployed on Apple M-series and Snapdragon 8 Gen 3 chips using ONNX runtime and Metal Performance Shaders.',
    datasetOrSample: 'Llama-2 7B and Mistral-7B evaluated on C4, WikiText-2, and MMLU benchmark datasets.',
    limitations: [
      'Evaluation restricted exclusively to English-language corpora; cross-lingual perplexity spikes significantly on agglutinative languages.',
      'Quantization calibration assumes uniform batch distribution, suffering from thermal throttling and dynamic voltage scaling on low-power IoT chips.',
      'Does not support on-device fine-tuning or continual learning without full dequantization overhead.'
    ],
    futureWork: [
      'Extend dynamic quantization to multi-lingual tokenizers and low-resource African/Asian language families.',
      'Formulate hardware-aware energy-budgeted quantization that adapts to battery discharge curves.',
      'Integrate parameter-efficient fine-tuning (e.g., LoRA) directly over quantized weights in embedded RAM.'
    ]
  },
  {
    id: 'paper-fed-privacy',
    title: 'Federated Learning for Cross-Hospital Patient Risk Prediction with Differential Privacy',
    authors: ['D. Rossi', 'E. Nwosu', 'J. Zhang'],
    year: '2024',
    venue: 'ACM Conference on Health, Inference, and Learning (CHIL)',
    url: 'https://dl.acm.org/doi/10.1145/3587889.3587900',
    doi: '10.1145/3587889.3587900',
    fileName: 'sample_federated_clinical_privacy.pdf',
    abstract: 'Patient confidentiality regulations often prevent pooling electronic health records (EHR) across regional healthcare networks. We formulate a privacy-preserving federated survival analysis framework (FedSurv-DP) utilizing (ε, δ)-differential privacy. FedSurv-DP aggregates gradient updates across four regional hospitals for 30-day readmission prediction without sharing raw clinical notes.',
    methodology: 'Federated Averaging (FedAvg) combined with Gaussian noise addition and gradient clipping. Multi-task survival neural network optimized with Cox proportional hazards loss.',
    datasetOrSample: 'Structured EHR data from 42,000 cardiology inpatients across 4 distinct hospital systems in the UK and Germany.',
    limitations: [
      'Extreme non-IID data distribution between specialized cardiology hospitals and general community clinics slowed convergence by 4x.',
      'Strict differential privacy noise budgets (ε < 2.0) drastically reduced risk recall for high-mortality minority patient cohorts.',
      'High bandwidth requirements for gradient synchronization caused dropped rounds across rural satellite clinics with intermittent network connectivity.'
    ],
    futureWork: [
      'Develop adaptive aggregation weights that counteract extreme non-IID skew without centralizing demographic metadata.',
      'Implement asynchronous gossip protocols to tolerate intermittent rural clinic disconnects.',
      'Analyze the fairness trade-offs between rigorous differential privacy bounds and minority patient outcomes.'
    ]
  }
];
