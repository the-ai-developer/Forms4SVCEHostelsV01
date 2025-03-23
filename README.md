# SVCE Hostel Data Engine 🌌
A bleeding-edge React ingestion portal ⚡ hosted on Surge (forms.svcehostels.surge.sh) 🔗, wired to a GScript endpoint (`AKfycbwWC2-ZbBL34HsHcgdwNud1Ob14xqAfC7nI4jS9paFIp0qDT05pFKsSGNEezCvh3QWkZg`) 🌍. Streams multi-phase form data 🎨 into Sheets 📊 and Drive 🗄️ via no-cors fetch—nuking CORS in orbit! 💪 Built for SVCE hostel ops—admission IDs, pics, and all—optimized for the elite. Future-ready: proxy integration 🔫, auth 🔒, and multi-file uploads 📁. Deploy it, hack it, own it, da! 🎉

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

## Built By 🏆
[@the-ai-developer]—forged in CORS chaos! 🔥

## License 📜
MIT—hack it! 🎉
