import { NextRequest, NextResponse } from 'next/server';
import { extractPaperSections } from '@/lib/pdfExtractor';
import { searchAcademicLiterature } from '@/lib/academicSearch';
import { synthesizeResearchGaps } from '@/lib/gapSynthesis';
import { decomposeInto4MemberComponents } from '@/lib/groupDecomposition';
import { Paper, SynthesisResult } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const directTitle = formData.get('title') as string | null;
    const directText = formData.get('text') as string | null;
    const apiKey = formData.get('apiKey') as string | null;
    const model = (formData.get('model') as any) || 'local';

    let proposalTitle = directTitle?.trim() || '';
    let proposalText = directText?.trim() || '';

    // If PDF proposal uploaded, extract text from it
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          const pdfParseModule = await import('pdf-parse');
          const { PDFParse } = pdfParseModule as any;
          if (typeof PDFParse === 'function') {
            const parser = new PDFParse({ data: buffer });
            const result = await parser.getText();
            proposalText = result.text || '';
          } else {
            proposalText = buffer.toString('utf-8');
          }
        } catch (pdfErr) {
          console.warn('PDF proposal extraction fallback:', pdfErr);
          proposalText = buffer.toString('utf-8');
        }
      } else {
        proposalText = buffer.toString('utf-8');
      }

      if (!proposalTitle) {
        const parsed = extractPaperSections(proposalText, file.name);
        proposalTitle = parsed.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      }
    }

    if (!proposalTitle && !proposalText) {
      return NextResponse.json(
        { error: 'Please enter a proposal title, description, or upload a research proposal document.' },
        { status: 400 }
      );
    }

    const searchQuery = `${proposalTitle} ${proposalText.slice(0, 200)}`.trim();

    // 1. Search academic literature for relevant peer-reviewed papers
    const { references, papers: retrievedPapers } = await searchAcademicLiterature(searchQuery, 5);

    // 2. Synthesize gaps comparing the proposal against the retrieved literature
    const synthesis = await synthesizeResearchGaps(retrievedPapers, apiKey || undefined, model);

    // 3. Decompose project into 4 individual member components
    const customMemberFocus: { [key: number]: string } = {};
    for (let m = 1; m <= 4; m++) {
      const val = formData.get(`member${m}`) as string | null;
      if (val && val.trim()) customMemberFocus[m] = val.trim();
    }
    const memberComponents = decomposeInto4MemberComponents(proposalTitle || 'Research Project', proposalText, customMemberFocus);

    // 4. Attach proposal metadata, retrieved academic references, and 4-member breakdown
    const finalResult: SynthesisResult = {
      ...synthesis,
      proposalTitle: proposalTitle || 'Proposed Research Direction',
      proposalText: proposalText.slice(0, 1500),
      references,
      memberComponents
    };

    return NextResponse.json({
      success: true,
      result: finalResult,
      retrievedPapers
    });
  } catch (error: any) {
    console.error('Proposal analysis error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to analyze proposal and discover references.' },
      { status: 500 }
    );
  }
}
