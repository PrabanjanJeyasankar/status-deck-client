

# Status Deck 



Status Deck Frontend is a ****clean Vite + React + Tailwind dashboard**** for ****real-time API health monitoring**** using FastAPI, Prisma, WebSockets, and Redis as the backend.



---



## 🚀 Local Development



Install dependencies:



```bash

npm install

```



or



```bash

pnpm install

```



---



Run the frontend development server:



```bash

npm run dev

```



or



```bash

pnpm dev

```



This will:



✅ Start Vite on `http://127.0.0.1:5173` (or `5174` depending on your config)

✅ Enable ****hot module reloading**** for instant UI updates

✅ Connect live to your Status Deck FastAPI backend and WebSocket broadcaster

✅ Display live API and incident data on dashboards in real time



---



Stop using:



```bash

Ctrl + C

```



to cleanly terminate the frontend dev server.



---


### 🔄 Notes



✅ This frontend expects your FastAPI backend running on `http://127.0.0.1:8000` by default.

✅ It expects WebSocket connections to `ws://127.0.0.1:8001` for incident and monitor updates.



Update your environment or proxy settings in `vite.config.ts` if needed.



---



When backend Prisma models or routes change, ****no frontend rebuild is required**** unless you have adjusted the API contracts or added new routes requiring frontend consumption.
