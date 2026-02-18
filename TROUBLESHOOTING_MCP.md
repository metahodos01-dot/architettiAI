# Risoluzione Problemi Installazione Server MCP

Sembra che ci siano problemi ricorrenti nell'installazione dei server MCP in Antigravity. Analizzando il tuo ambiente, abbiamo individuato una probabile causa legata al **PATH** di sistema e alla mancanza di Token per servizi esterni.

## 1. Problema "Command not found" o simile (n8n-mcp)

Le applicazioni GUI su macOS (come Antigravity) spesso non ereditano le stesse variabili d'ambiente del terminale. Di conseguenza, comandi come `npx` o `node` potrebbero non essere trovati.

**Soluzione:**
Usa il **percorso assoluto** dell'eseguibile `npx`.
Nel tuo caso: `/usr/local/bin/npx`

## 2. Problema "Context deadline exceeded" (GitHub MCP)

Questo errore indica che il server MCP è partito ma non ha risposto in tempo. Per il server GitHub, la causa più comune è la mancanza del **Personal Access Token**. Senza questo token, il server non può autenticarsi e rimane in attesa, causando il timeout.

**Soluzione:**
Devi configurare manualmente il server nel file `.agent/mcp.json` e inserire il tuo token.

**Esempio configurazione completa (`.agent/mcp.json`):**

```json
{
  "mcpServers": {
    "n8n-mcp": {
      "command": "/usr/local/bin/npx",
      "args": ["-y", "n8n-mcp"],
      "env": {
        "MCP_MODE": "stdio"
      },
      "autoAllow": true
    },
    "github": {
      "command": "/usr/local/bin/npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "INSERISCI_QUI_IL_TUO_TOKEN"
      },
      "autoAllow": true
    }
  }
}
```

### Come ottenere il Token GitHub?

1. Vai su GitHub -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic).
2. Genera un nuovo token (glifi `repo` e `user` sono solitamente sufficienti).
3. Incolla il token al posto di `INSERISCI_QUI_IL_TUO_TOKEN`.

## Verifica

Dopo aver aggiornato il file `.agent/mcp.json`:

1. Salva il file.
2. Ricarica la finestra dell'agente o riavvia l'applicazione.
