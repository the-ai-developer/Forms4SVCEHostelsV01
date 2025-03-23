# SVCE Hostel Data Engine 🌌

## Core 💡
React client @ `forms.svcehostels.surge.sh` 🔗 GScript API for Sheets/Drive persistence. CORS? Smashed with `no-cors` fetch! 💪

## Stack ⚙️
- **Front**: React + TS ⚡ Surge-hosted 🌐
- **API**: GScript (`AKfycbwWC2-ZbBL34HsHcgdwNud1Ob14xqAfC7nI4jS9paFIp0qDT05pFKsSGNEezCvh3QWkZg`) 🌍
- **Data**: Sheets 📊 + Drive 🗄️

## Flow 🌊
1. Multi-phase form → JSON 🎨
2. `fetch` (`no-cors`) → GScript 🚀
3. GScript → Sheets + Drive URL 🌠

## Launch 🛠️
- Client: `npm run build && surge build forms.svcehostels.surge.sh` 💨
- GScript: Plug `<SHEET_ID>`, `<FOLDER_ID>`, deploy (Anyone) 🔑

## Next Gen 🌟
- Proxy (Node/Vercel) for CORS kill 🔫
- Custom TLD ⚜️
- Schema lock (GScript) 🔒
- Multi-file ingest 📁
- API auth 🛡️

## Collab 🤝
Fork → Branch → PR. Elite tweaks only, da! 🧠

## Glitches ⚠️
- `no-cors` = blind response 😶
- Form POST might teleport 🌐

## Built By 🏆
[@the-ai-developer]—forged in CORS chaos! 🔥

## License 📜
MIT—hack it! 🎉
