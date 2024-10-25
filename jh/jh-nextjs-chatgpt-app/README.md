nextjs-chatgpt-app

- Start a conversation with ChatGPT using the ChatGPT API

1. Authenticated User (using NextAuth - Github)
  a. Secret management using 1password
2. Routing with App Router (Parallel routes + Streaming)
3. Chat Interface
4. Shadcn
  a. Want to add components use this command `npx shadcn@latest add input`
5. Deployed to Vercel and the app is containerized using Docker
6. Using Devbox for development (checkout devbox.json)

App uses 1password for secret management run the app with `op run --env-file="./.env.development.local" -- pnpm run dev`
