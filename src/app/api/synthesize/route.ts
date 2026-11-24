import { NextRequest, NextResponse } from 'next/server';
import { synthesizeResearchGaps } from '@/lib/gapSynthesis';
import { Paper } from '@/types';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { papers, apiKey, model } = body as {
      papers: Paper[];
      apiKey?: string;
      model?: 'gemini' | 'openai' | 'local';
    };

    if (!papers || !Array.isArray(papers) || papers.length === 0) {
      return NextResponse.json(
        { error: 'At least one research paper is required to synthesize gaps.' },
        { status: 400 }
      );
    }

    const result = await synthesizeResearchGaps(papers, apiKey, model || 'local');

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Synthesis error:', error);
    return NextResponse.json(
      { error: error?.message || 'Synthesis failed.' },
      { status: 500 }
    );
  }
}
