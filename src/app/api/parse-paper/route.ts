import { NextRequest, NextResponse } from 'next/server';
import { extractPaperSections } from '@/lib/pdfExtractor';
import { Paper } from '@/types';


export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const directText = formData.get('text') as string | null;
    const titleOverride = formData.get('title') as string | null;
    const directUrl = formData.get('url') as string | null;

    let extractedText = '';
    let fileName = 'Uploaded-Manuscript.pdf';
    let fileSize = 0;

    if (file) {
      fileName = file.name;
      fileSize = file.size;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          // Dynamic import of pdf-parse v2 to prevent bundling issues
          const pdfParseModule = await import('pdf-parse');
          // Support both class PDFParse and function pdf
          const { PDFParse } = pdfParseModule as any;
          if (typeof PDFParse === 'function') {
            const parser = new PDFParse({ data: buffer });
            const result = await parser.getText();
            extractedText = result.text || '';
          } else {
            extractedText = buffer.toString('utf-8');
          }
        } catch (pdfErr) {
          console.warn('PDF extraction fallback to UTF-8 stream:', pdfErr);
          extractedText = buffer.toString('utf-8');
        }
      } else {
        // Plain text or markdown file
        extractedText = buffer.toString('utf-8');
      }
    } else if (directText) {
      extractedText = directText;
      fileName = titleOverride ? `${titleOverride}.txt` : 'Manual-Entry.txt';
    } else {
      return NextResponse.json({ error: 'No file or text provided' }, { status: 400 });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Could not extract legible text from file. Please ensure it is not scanned/image-only.' },
        { status: 422 }
      );
    }

    // Extract structured sections
    const parsedSections = extractPaperSections(extractedText, fileName);

    // Detect URL / DOI from text if not explicitly provided
    let paperUrl = directUrl?.trim() || '';
    let paperDoi = '';

    const doiMatch = extractedText.match(/\b(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)\b/);
    if (doiMatch) {
      paperDoi = doiMatch[1];
      if (!paperUrl) {
        paperUrl = `https://doi.org/${paperDoi}`;
      }
    }

    if (!paperUrl) {
      const urlMatch = extractedText.match(/https?:\/\/(?:www\.)?(?:ieeexplore\.ieee\.org|arxiv\.org|dl\.acm\.org|link\.springer\.com|nature\.com|sciencedirect\.com|ncbi\.nlm\.nih\.gov)[^\s<>"')]+/i);
      if (urlMatch) {
        paperUrl = urlMatch[0];
      }
    }

    const paper: Paper = {
      id: `paper-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: titleOverride || parsedSections.title || fileName.replace(/\.[^/.]+$/, ''),
      authors: ['Extracted Author(s)'],
      year: new Date().getFullYear(),
      url: paperUrl || undefined,
      doi: paperDoi || undefined,
      abstract: parsedSections.abstract || '',
      methodology: parsedSections.methodology || '',
      datasetOrSample: parsedSections.datasetOrSample || '',
      limitations: parsedSections.limitations || [],
      futureWork: parsedSections.futureWork || [],
      rawText: extractedText.slice(0, 5000), // store preview
      fileName,
      fileSize
    };

    return NextResponse.json({ success: true, paper });
  } catch (error: any) {
    console.error('Paper parsing error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to parse publication.' },
      { status: 500 }
    );
  }
}
