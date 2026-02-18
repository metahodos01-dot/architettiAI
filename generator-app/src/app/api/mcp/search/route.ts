import { NextResponse } from 'next/server';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query, limit = 10 } = body;

        if (!query) {
            return NextResponse.json({ error: 'Query required' }, { status: 400 });
        }

        // Create temp file with MCP commands
        const tmpFile = join(tmpdir(), `mcp_input_${Date.now()}.txt`);
        const initCmd = JSON.stringify({
            jsonrpc: '2.0',
            method: 'initialize',
            params: {
                protocolVersion: '2024-11-05',
                capabilities: {},
                clientInfo: { name: 'generator-app', version: '1.0' }
            },
            id: 0
        });

        const searchCmd = JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
                name: 'search_nodes',
                arguments: { query, limit }
            },
            id: 1
        });

        writeFileSync(tmpFile, `${initCmd}\n${searchCmd}\n`);

        try {
            // Execute MCP with input from file
            const result = execSync(
                `cat "${tmpFile}" | MCP_MODE=stdio LOG_LEVEL=error DISABLE_CONSOLE_OUTPUT=true npx -y n8n-mcp 2>/dev/null`,
                {
                    encoding: 'utf-8',
                    timeout: 60000,
                    shell: '/bin/bash'
                }
            );

            // Parse the response
            const lines = result.trim().split('\n');
            for (const line of lines) {
                try {
                    const json = JSON.parse(line);
                    if (json.id === 1 && json.result) {
                        if (json.result.content?.[0]?.text) {
                            const data = JSON.parse(json.result.content[0].text);
                            return NextResponse.json(data);
                        }
                        return NextResponse.json(json.result);
                    }
                } catch {
                    continue;
                }
            }

            return NextResponse.json({ error: 'No valid response from MCP' }, { status: 500 });
        } finally {
            try { unlinkSync(tmpFile); } catch { }
        }
    } catch (error: any) {
        console.error('MCP Search Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
