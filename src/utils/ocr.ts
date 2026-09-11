import Tesseract from 'tesseract.js';

export interface OcrResult {
  text: string;
  confidence: number;
  method: 'tesseract' | 'svg' | 'metadata' | 'none';
}

/**
 * Extracts readable text from an image file or blob using client-side OCR.
 * Supports raster images via Tesseract.js and vector images via SVG parsing.
 */
export async function extractTextFromImage(fileOrBlob: File | Blob | string): Promise<OcrResult> {
  // 1. Check for SVG text
  if (typeof fileOrBlob !== 'string' && fileOrBlob.type === 'image/svg+xml') {
    try {
      const text = await fileOrBlob.text();
      const textMatches = text.match(/<text[^>]*>([\s\S]*?)<\/text>/gi) || [];
      const extracted = textMatches.map(m => m.replace(/<[^>]+>/g, '').trim()).filter(Boolean).join(' ');
      if (extracted.length > 5) {
        return { text: extracted, confidence: 95, method: 'svg' };
      }
    } catch {
      // fallback to tesseract
    }
  }

  // 2. Client-side OCR via Tesseract.js with safety timeout
  try {
    const ocrPromise = (async () => {
      let imageSource: any = fileOrBlob;
      if (typeof fileOrBlob !== 'string' && typeof window !== 'undefined') {
        imageSource = URL.createObjectURL(fileOrBlob);
      }
      
      const result = await Tesseract.recognize(imageSource, 'eng', {
        logger: () => {}
      });

      if (typeof fileOrBlob !== 'string' && typeof window !== 'undefined' && typeof imageSource === 'string' && imageSource.startsWith('blob:')) {
        URL.revokeObjectURL(imageSource);
      }

      const rawText = result.data?.text || '';
      const cleanText = rawText.replace(/\r\n/g, '\n').trim();
      const confidence = result.data?.confidence || 0;

      return {
        text: cleanText,
        confidence,
        method: 'tesseract' as const
      };
    })();

    // 8 second safety timeout so user is never blocked
    const timeoutPromise = new Promise<OcrResult>((resolve) => {
      setTimeout(() => {
        resolve({ text: '', confidence: 0, method: 'none' });
      }, 8000);
    });

    return await Promise.race([ocrPromise, timeoutPromise]);
  } catch (err) {
    console.warn('ScamShield OCR extraction warning:', err);
    return { text: '', confidence: 0, method: 'none' };
  }
}
