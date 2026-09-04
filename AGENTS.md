<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Dev Server & Process Management Rule
- **NEVER leave a background dev server (`next dev`, `npm run dev`) or test process running after completing verification or ending a turn.**
- If a dev server or test process is launched in the background to verify code, you MUST kill it before finishing your turn (`manage_task` kill or `pkill -f "next dev"`).
- Always verify that port 3000 is completely released (`Port 3000 is clean`).
- The user runs `npm run dev` in their local terminal and must never encounter port 3000 collisions or the error: `Another next dev server is already running`.
