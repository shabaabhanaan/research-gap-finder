# ResGap — Academic Research Gap Finder & Literature Synthesizer

**ResGap** is a full-stack academic research assistant application designed to systematically ingest peer-reviewed papers (via PDF or text), extract methodology, datasets, constraints, and stated limitations, and synthesize publishable **Research Gaps (Methodological, Empirical, Contextual, Practical, and Theoretical)** along with formulated **Research Questions (RQs)** and a comparative literature matrix.

---

## ✨ Features

- 📄 **Multi-PDF Parsing & Ingestion**:
  - Drag-and-drop or batch file upload for academic papers.
  - Smart section segmentation extracting Title, Abstract, Methodology, Datasets, Limitations, and Future Directions.
  - Manual text/abstract paste option.
- 🔬 **Systematic Gap Synthesis**:
  - Cross-examines multiple papers to isolate overlapping boundaries and unaddressed constraints.
  - Standardized Academic Taxonomy:
    - 🧪 **Methodological Gaps**: Benchmark/metric limitations, calibration flaws, baseline oversights.
    - 📊 **Empirical / Data Gaps**: Synthetic vs real-world data skew, non-IID distributions, cohort imbalances.
    - 🌍 **Contextual / Demographic Gaps**: Geographic biases, language family gaps, demographic underrepresentation.
    - ⚙️ **Practical / Systems Gaps**: Inference latency, energy budgets, memory footprints, hardware throttling.
    - 🧩 **Theoretical Gaps**: Trade-offs between formal guarantees (e.g., differential privacy) and utility fairness.
- 🎯 **Actionable Research Agendas & Formulated RQs**:
  - Auto-formulates precise, publication-ready Research Questions (e.g., *RQ1: To what extent does...*).
  - Categorizes project proposals by venue tier (Conference, Journal, Workshop) and difficulty (Novice, Intermediate, Advanced).
- 📊 **Comparative Literature Matrix**:
  - Generates cross-paper comparison table comparing methods, samples, limitations, and future directions.
- 📥 **Export Ready for Thesis & Papers**:
  - Export full synthesis as a formatted Markdown Literature Review section (`.md`) or structured JSON.
- 🚀 **Dual Inference Modes**:
  - **Built-in Deterministic NLP Engine**: 100% offline, free, and zero API key needed.
  - **Gemini API Mode**: Optional deep LLM reasoning for complex, nuanced papers.
- 📚 **Pre-loaded Academic Samples**:
  - 1-Click "Load 3 Sample Papers" across Medical Multimodal AI, Edge Model Quantization, and Federated Healthcare Privacy.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Glassmorphic dark academic theme)
- **Icons**: Lucide React
- **Parsing**: Node.js buffer stream parsing + Academic section heuristics

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm run start
```

---

## 📖 How to Use

1. **Add Papers**:
   - Click **"Load 3 Sample Papers"** for an instant demonstration, or
   - Drag & drop your own downloaded `.pdf` papers into the upload zone, or
   - Paste paper abstracts and limitation sections under the **"Paste Text / Abstract"** tab.
2. **Review Extracted Data**:
   - Expand any paper card to inspect the extracted Abstract, Methodology, Limitations, and Future Work.
3. **Synthesize**:
   - Click **"Synthesize Gaps"** in the top navigation or banner.
4. **Explore & Export**:
   - Filter gaps by category (*Methodological*, *Empirical*, *Contextual*, *Practical*, *Theoretical*).
   - Click the copy icon next to any Research Question.
   - Click **"Export"** to download the ready-to-use Literature Review markdown or JSON.

---

## 🔒 Privacy & Local Execution

When using the default **Built-in NLP** mode, all analysis is computed locally without transmitting manuscript data to any external cloud provider.
