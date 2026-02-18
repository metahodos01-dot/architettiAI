import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const apiKey = process.env.N8N_API_KEY;
        const apiUrl = process.env.N8N_API_URL;

        if (!apiKey || !apiUrl) {
            return NextResponse.json({ error: 'N8N configuration missing' }, { status: 500 });
        }

        // Default to listing workflows if no body provided, or creating if body provided
        // Actually, let's make this route specifically for CREATING or LISTING based on method or query?
        // Let's assume POST is for creating

        const response = await fetch(`${apiUrl}/workflows`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-N8N-API-KEY': apiKey
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const apiKey = process.env.N8N_API_KEY;
        const apiUrl = process.env.N8N_API_URL;

        if (!apiKey || !apiUrl) {
            return NextResponse.json({ error: 'N8N configuration missing' }, { status: 500 });
        }

        const response = await fetch(`${apiUrl}/workflows`, {
            headers: {
                'X-N8N-API-KEY': apiKey
            }
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
