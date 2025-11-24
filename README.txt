PoE2 Quick‑Flip Dashboard — VSCode + Live Server

1) Install & run local CORS proxy (CommonJS):
   npm install
   npm run proxy   # http://localhost:8787/api

2) Open index.html with Live Server
   - On localhost it will auto-use http://localhost:8787/api to avoid CORS.

3) In the UI:
   - Category: Currency | Omen (ritual)
   - League: Rise of the Abyssal
   - Reference: exalted (or chaos/divine)
   - TP%: quick flip target (default 3%)
   - Click Refresh and use Download CSV as needed.

Troubleshooting:
- If no rows: ensure proxy is running and port 8787 is free.
- If CORS errors persist: re-open index.html via Live Server (not file://), or change proxy port in proxy.cjs and in code.
