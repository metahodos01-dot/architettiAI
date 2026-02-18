import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'GEMINI_API_KEY non configurata' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'File audio non fornito' },
        { status: 400 }
      );
    }

    // Converti Blob in base64
    const buffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString('base64');

    // Chiama Gemini API per trascrizione
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inline_data: {
                  mime_type: audioFile.type || 'audio/webm',
                  data: base64Audio,
                },
              },
              {
                text: 'Trascrivi questo audio in italiano. Fornisci solo il testo trascritto, niente altro.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Gemini API error:', error);
      return NextResponse.json(
        { success: false, error: 'Errore nella trascrizione Gemini' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Estrai testo dalla risposta
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Nessun testo trascritto' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      text: text.trim(),
    });
  } catch (error) {
    console.error('Transcribe API error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
