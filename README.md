# SVCE Hostel Data Ingestion Framework

## Synopsis
React-based client (`forms.svcehostels.surge.sh`) leverages a GScript endpoint for data persistence into Sheets/Drive. CORS mitigated via `no-cors` fetch.

## Architecture
- **Client**: React + TS, Surge-hosted.
- **API**: GScript Web App (`AKfycbwWC2-ZbBL34HsHcgdwNud1Ob14xqAfC7nI4jS9paFIp0qDT05pFKsSGNEezCvh3QWkZg`).
- **Storage**: Sheets (tabular), Drive (binary).

## Workflow
1. Multi-phase form → JSON payload.
2. `fetch` (`no-cors`) → GScript.
3. GScript → Sheets row + Drive blob URL.

## Deploy
- Client: `npm run build && surge build forms.svcehostels.surge.sh`.
- GScript: Inject `<SHEET_ID>`, `<FOLDER_ID>`, deploy (Anyone).

## Roadmap
- Proxy layer (Node/Vercel) for CORS annihilation.
- Custom TLD integration.
- Schema validation (GScript).
- Multi-binary ingestion.
- Authenticated endpoint.

## Contribution
Fork → Branch → PR. High-IQ optimizations only.

## Caveats
- `no-cors` blinds response.
- Form POST may redirect.

## Attribution
Engineered amidst existential CORS crises by PrinceTheProgrammer [@the-ai-developer].

## License
MIT
