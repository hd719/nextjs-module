# Next.js React Server Component Architecture

## Caching in Depth

### Caching with Next.js App Router

- Multiple levels of caching

### 1. Full Route Cache

#### The Full Route Cache Guide

- Caches the full route
- There are 2 types of routes

  - Static Routes:
    - Doesn't involve elements that would necessitate re-rendering on the server for each request
    - Build process generates static HTML for these routes, resulting in the same content served on each request
    - Great for performance
  - Dynamic Routes:
    - Require server-side rendering for each request

- Inspecting the route table generated after building a Next.js application can tell you if a route is static
- Notice the "O" next to the / route. This "O" signifies a statically generated route
- Static routes are optimal for performance, but there are times when you might want to force a route to render dynamically

- Mark routes as dynamic by:
  - `unstable_noStore();`

```jsx
import { unstable_noStore } from "next/cache";
import { revalidatePath } from "next/cache";

import RevalidateHomeButton from "./RevalidateHomeButton";

export default function Home() {
  unstable_noStore();

  async function onRevalidateHome() {
    "use server";
    revalidatePath("/");
  }

  console.log(`Rendering / ${new Date().toLocaleTimeString()}`);
  return (
    <main>
      <div>{new Date().toLocaleTimeString()}</div>
      <RevalidateHomeButton onRevalidateHome={onRevalidateHome} />
    </main>
  );
}
```

#### Dynamic Routes in Next.js (Full Route)

- Actions within the component that suggest dynamic behavior can also achieve this (accessing properties of the incoming request can signal to Next.js that the component needs dynamic rendering)
- Example accessing properties of the incoming request
- Or we can tell nextjs that we are using a dynamic route by using `export const dynamic = "force-dyanmic";` force-dynamic option makes the route dynamic and this would make the entire page dynamic

```jsx
import RevalidateHomeButton from "./RevalidateHomeButton";

import { cookies, headers } from "next/headers";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
// export const dynamic = "auto";
// export const dynamic = "error";
// export const dynamic = "force-static";

export default function Home() {
  headers();
  cookies();
  useSearchParams();

  async function onRevalidateHome() {
    "use server";
    revalidatePath("/");
  }

  console.log(`Rendering / ${new Date().toLocaleTimeString()}`);
  return (
    <main>
      <div>{new Date().toLocaleTimeString()}</div>
      <RevalidateHomeButton onRevalidateHome={onRevalidateHome} />
    </main>
  );
}
```

#### Automatic and Manual Revalidation (Full Route Cache)

- For example updating every 5 seconds and invalidate the cache or when user clicks a button

```jsx
import { revalidatePath } from "next/cache";

import RevalidateHomeButton from "./RevalidateHomeButton";

export const revalidate = 5;

export default function Home() {
  // server action
  async function onRevalidateHome() {
    "use server";
    revalidatePath("/"); // revalidate the home page
  }

  console.log(`Rendering / ${new Date().toLocaleTimeString()}`);
  return (
    <main>
      <div>{new Date().toLocaleTimeString()}</div>
      <RevalidateHomeButton onRevalidateHome={onRevalidateHome} />
    </main>
  );
}
```

#### Next.js API Route Caching (Full Route Cache)

Ex.

```jsx
import { unstable_noStore } from "next/cache";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";
// export const revalidate = 2;

export async function GET() {
  // unstable_noStore();
  // headers();
  // cookies();

  console.log(`GET /time ${new Date().toLocaleTimeString()}`);
  return NextResponse.json({ time: new Date().toLocaleTimeString() });
}

export async function POST() {
  console.log(`POST /time ${new Date().toLocaleTimeString()}`);
  return NextResponse.json({ time: new Date().toLocaleTimeString() });
}
```

- Automatically caches API routes that don't perform actions that would prevent caching, such as data fetching or mutations
- **One important thing to remember is that exporting a POST, PUT, or DELETE handler from your API route file automatically makes the route dynamic**
- Even with revalidate set, the presence of the POST handler will force the route to be dynamic. This ensures that any mutations or data updates performed by these HTTP methods are reflected correctly

### 2. Data Cache

#### Data Caching and Revalidation with React Server Components

- Statically caches the response by default
- Using `cache: "no-store"` will prevent caching
- Provides a revalidate option that allows us to specify how often a statically generated page should be regenerated

```jsx
export default async function APITime() {
  const timeReq = await fetch("http://localhost:8080/time", {
    next: {
      revalidate: 2,
    },
  });
}
```

`On-Demand Revalidation with Server Actions With Tags ex.`

```jsx
import { revalidateTag } from "next/cache";

import RevalidateAPITimeButton from "./RevalidateAPITimeButton";

export default async function APITime() {
  const timeReq = await fetch("http://localhost:8080/time", {
    next: {
      tags: ["api-time"],
    },
  });
  const { time } = await timeReq.json();

  async function onRevalidate() {
    "use server";,
    revalidateTag("api-time");
  }

  console.log(`Render /api-time ${new Date().toLocaleTimeString()}`);

  return (
    <div>
      <h1 className="text-2xl">Time From API</h1>
      <p className="text-xl">{time}</p>
      <RevalidateAPITimeButton onRevalidate={onRevalidate} />
    </div>
  );
}
```

```jsx
"use client";
import { Button } from "@/components/ui/button";

export default function RevalidateAPITimeButton({
  onRevalidate,
}: {
  onRevalidate: () => Promise<void>,
}) {
  return (
    <Button onClick={async () => await onRevalidate()} className="mt-4">
      Revalidate API Time
    </Button>
  );
}
```

- The tagging mechanism offers a flexible way to manage data invalidation across our application, especially when working with databases and filesystems

### Cache-busting with Tags

- `unstable_cache` which is a persistent cache that goes between requests

```jsx
// inside app/db-time/db-time.ts

import { unstable_cache } from "next/cache";

export async function getDBTimeReal() {
  return { time: new Date().toLocaleTimeString() };
}
export const getDBTime = unstable_cache(getDBTimeReal, ["db-time"], {
  tags: ["db-time"],
});
```

```jsx
// inside app/db-time/RerenderDBTimeButton.tsx
"use client";
import { Button } from "@/components/ui/button";

export default function RevalidateDBTimeButton({
  onRevalidate,
}: {
  onRevalidate: () => Promise<void>,
}) {
  return (
    <Button onClick={async () => await onRevalidate()} className="mt-4">
      Revalidate DB Time
    </Button>
  );
}
```

```jsx
import { revalidateTag } from "next/cache";
import { getDBTime } from "./db-time";
import RevalidateDBTimeButton from "./RevalidateDBTimeButton";

export const dynamic = "force-dynamic";

export default async function DBTime() {
  const { time } = await getDBTimeReal();

  console.log(`Render /db-time ${new Date().toLocaleTimeString()}`);

  async function onRevalidate() {
    "use server";
    revalidateTag("db-time");
  }

  return (
    <div>
      <h1 className="text-2xl">Time From DB</h1>
      <p className="text-xl">{time}</p>
      <RevalidateDBTimeButton onRevalidate={onRevalidate} />
    </div>
  );
}
```

- Clicking this button will trigger the server action, which invalidates the 'db-time' tag, causing Next.js to re-fetch data on the next request.
- Using revalidatePath is also an option, but using tags allows for more granular control over which cache to invalidate.

### The Next.js Router Cache (Client Cache)

- Built-in client side cache
- Designed to make navigation between routes super efficient
- **When you visit a route in your Next.js app, the page content gets stored in the cache. If you revisit that same route later, the cached version will load instantly, resulting in a much smoother user experience**

### Revalidation with Server Actions by using `revalidatePath` and going back to the home page

```jsx
// inside app/revalidate-home.tsx
"use server";
import { revalidatePath } from "next/cache";

export async function revalidateHome() {
  revalidatePath("/");
}
```

```jsx
// inside app/sub-route/page.tsx
"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { revalidateHome } from "../revalidate-home";

export default function SubRoute() {
  const router = useRouter();

  return (
    <main className="flex flex-col gap-3">
      <div>
        <Button
          onClick={async () => {
            await revalidateHome();
            router.push("/");
          }}
        >
          Go Home
        </Button>
      </div>
    </main>
  );
}
```

```jsx
import Link from "next/link";
import Timer from "./Timer";

export default function Home() {
  return (
    <main>
      <div>Time: {new Date().toLocaleTimeString()}</div>
      <div>
        <Link href="/sub-route">Sub-Route</Link>
      </div>
      <Timer />
    </main>
  );
}
```

### Role of Response Headers in Revalidation (how does it work)

1. When a server action is executed the Next.js client sends a request to the server with a special next-action-id header
2. The server recognizes this header and executes the corresponding server action
3. If this action includes `revalidatePath` or `revalidateTag`, the server's response will include a x-nextjs-revalidate header
4. This header tells the Next.js client to invalidate its cache for the specified route or tags, which will trigger a revalidation on the next navigation

### Revalidation without Server Actions

- What happens if we want to revalidate a route without **directly calling a server action**?
  - Cant use `revalidatePath` or `revalidateTag` bc it can only be used in server actions
- For example, let's say we have an API route that modifies data used on the homepage.

```jsx
// app/api/revalidateHome/route.ts
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export function POST() {
  revalidatePath("/");
  return NextResponse.json({ message: "Home invalidated" });
}
```

```jsx
// inside app/sub-route/page.tsx
"use client";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { revalidateHome } from "../revalidate-home";

export default function SubRoute() {
  const router = useRouter();

  return (
    <main className="flex flex-col gap-3">
      <div>
        <Button
          onClick={async () => {
            await fetch("/api/revalidateHome", { method: "POST" });
            router.push("/");
            router.refresh();
          }}
        >
          Go Home
        </Button>
      </div>
    </main>
  );
}
```

- We can then post to the API route from the sub-route component instead of calling the server action
- We can also use router.refresh() to update the current page content on demand, without navigating to a different route

### When to worry about Router Cache?

- The good news is that the router cache usually works seamlessly in the background
- You'll typically only need to manually interact with it when working with **API routes that modify data used on your pages or when you need fine-grained control over cache invalidation**

## Application Architecture with Options

---

- We'll be using a simple to-do list application as a running example throughout this section
- App includes authorization, data fetching strategies, in our case priorities are fetched publicly without auth however todos are fetched with auth
- This repo is more of a tool kit to adapt to your own project
- Primary authorization will be JWT within HTTP-only cookies and some services will incorporate service tokens

## Local Architecture

---

### The API Variant of Local Systems ex. `nextjs-module/jh-nextjs-client-and-server-cache/03-systems-architecture/local-api`

- The to-do data is stored in an in-memory database, and we'll use Next.js API routes to handle client requests
- This variation of the local systems architecture where our Next.js application communicates with a local API route instead of relying on server actions
- This approach is particularly useful when you have multiple clients, such as web browser, mobile app, desktop app that need access to the same API

#### When to use this architecture?

- By separating the client-side logic from the API endpoints, this approach provides flexibility and scalability (especially when you have multiple client applications)
- While server actions excel in scenarios with a single client (the web browser), the API route approach shines when you need to share your API with other clients or platforms

### Building with local server actions in Next.js ex. `nextjs-module/jh-nextjs-client-and-server-cache/03-systems-architecture/apps/local-sa`

### **NOTE: This is the recommended way of doing things**

- The server action variant of the local architecture is perfect for small teams, startups, or internal admin tools where simplicity and efficiency are key

- The architecture is simple– here's the flow:

  1. Data Fetching (RSC): The app uses a React Server Component (RSC) on the homepage to fetch to-dos from the todos library.
  2. Client-Side Rendering: The RSC passes the fetched data to the client-side component for rendering.
  3. Server Actions: The client utilizes server actions for any updates (adding, marking complete, deleting) to the to-dos.
  4. Revalidation: After a server action completes, we revalidate the / route, triggering a refresh and reflecting the changes in the UI.

- **RECOMMENDED WAY: In this architecture there are no API routes, the server actions handle all the data fetching and updating (new way of doing it - the old way was to use API routes)**
- This server action-based local architecture excels for its simplicity
- It's easy to understand, has minimal boilerplate, and is performant way to build applications at this scale

## Backend for Frontend (BFF) Architecture

---

### BFF Architecture with Graphql

- **NOTE: DO NOT USE THE CURRENT AUTH PACKAGE IN PRODUCTION**
- Take a look at [Next-Auth Email Provider](https://next-auth.js.org/providers/credentials) and [NextJS Auth](https://nextjs.org/docs/pages/building-your-application/authentication)

- Build a Backend for Frontend (BFF) using GraphQL within a Next.js application
- Useful when you have graphql microservice architecture, but prefer to avoid exposing Graphql directly to the client
- Setup involves a BFF GraphQL Next.js App Router application, and the GraphQL backend
- Client interacts with the BFF via REST which then uses GraphQL to interact with the `api-gql` service
- This separation offers a layer of security, mitigating vulnerabilities associated with exposing GraphQL endpoints publicly
- The API routes handle communication between the client-side component and the API GraphQL backend
- Useful if you have Graphql backend

### Backend for Frontend (BFF) Architecture with Server Actions `RECOMMENDED`

- Simplest way to build a BFF is to use server actions
- Our Next.js application acts as a client-facing frontend and a backend-for-frontend (BFF), communicating with a REST microservice using server actions
- Use server actions to talk between the client and the Next.js App Router application inside of the bff-sa directory.
- Our application architecture involves three main components:s

  1. Next.js App (BFF): This acts as a client-facing frontend and a backend-for-frontend (BFF). It handles user interactions, server-side rendering, and communication with the microservice.
  2. Server Actions: These functions, running on the server-side within our Next.js application, provide a secure way to interact with the microservice.
  3. REST Microservice: This independent service handles the application's core logic and data persistence.

- **NOTE:** We pass cookies from the incoming request to the REST API for authentication. This ensures that the REST API knows who is making the request.
- **NOTE:** Priorities are unauthenticated, while to-dos are authenticated and require a user ID

#### Benefits of this Architecture

- By using server actions and a REST microservice, the Next.js application doesn't need to directly manage data. Instead, it can rely on the microservice as the source of truth
- Server actions provide a secure channel for communication, protecting sensitive data and operations

### Backend for Frontend (BFF) Architecture with API Variant

- Where the client uses a REST API located on the BFF API app to make mutations to their to-do list
- The BFF API app, in turn, makes requests to the API REST microservice, which interacts with the To-Do's database
- The trick here is in the authorization
- We take the cookie from the incoming request to the Next.js server and proxy it through to the API server
- This allows the API REST server to know who it's talking to
- It can use the same JWT decoding algorithm that's used by NextAuth to get the user ID out of the JWT
- This BFF pattern is especially beneficial if you have other clients besides your web app, like mobile apps, desktop apps, or CLIs, that need to interact with your API
- This pattern provides a dedicated layer for each client type

### BFF Pattern with gRPC (TwirpScript)

- The client is talking to the Next.js server through either server actions or REST, but the Next.js server is in turn talking to its microservice backend through gRPC
- TwirpScript provides a more developer-friendly way to work with gRPC, while having essentially the same architecture
- There are two different gRPC services, one for priorities and one for ToDos
- Both services are reside on the api-twirp server
- The associated functions are in the repo/twirp-protos package, which is shared between the Next.js application and the API for Twirp
- This is one of the cleanest approaches to building a BFF with a gRPC architecture, and is highly recommended if you're planning to use gRPC in your future projects

### BFF Pattern with tRPC

- tRPC provides a way to handle communication between servers or between a client and a Next.js server
- Our setup will use a Next.js server for the BFF, which will communicate with a REST microservice
- The Next.js server will use tRPC to communicate with the frontend, while using REST to talk to the microservice
- tRPC leverages Zod for type safety
- Zod allows us to define schemas for our data using its straightforward syntax
- For instance, the TodoSchema defines the structure of a to-do item
- We use Zod to validate both the data coming in from requests and the data being sent back in responses

## External Architectures

---

### Server Architecture with External API Domain

- Imagine your Next.js server, hosted on mycompany.com, needs to interact with an external REST API
- Here's the interesting part, if the API changes, it triggers a webhook to tell the Next.js server to update its cache - his ensures we always have the latest data
- After the Next.js server fetches data, it passes it to a client-side component
- When the client component needs to modify data, it talks directly to the API using api.mycompany.com. Again, a webhook notifies the Next.js server to revalidate the cache
- Think of it this way: the server fetches the initial data, and the client handles updates, both talking to the same API.
- When the API makes a mutation, it sends a POST request to this route with the event type and relevant data. The route then revalidates the cache for the specific page associated with the updated data
- Inside the REST API endpoint at apps/api-rest/src/server.ts we see that when a mutation occurs, a webhook is sent to the Next.js server. This webhook includes the event type and relevant data. The server then checks if a front-end server is defined in the environment variables, and if so, sends a POST request to the webhook route

### Proxying External Systems with Next.js

- This approach uses an external proxy for client-side requests, keeping our application code blissfully unaware of the proxying
- Code for this example can be found in the external-proxied dir
- This configuration handles routing requests made to /rest to our external REST API, running locally on port 5001
- This configuration makes it so the application code has no idea that requests are being made, so there isn't an opportunity to look at the request

```js
// inside apps/external-proxied/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  rewrites: async () => {
    return [
      {
        source: "/rest/:path*",
        destination: "http://localhost:5001/:path*",
      },
    ];
  },
};

export default nextConfig;
```

#### Handling Mutations

- When a mutation occurs in our REST API, we need to update our application state. We achieve this through a webhook that triggers revalidation on specific paths
- A POST request to api/callback triggers revalidation for the homepage

- Inside the API REST server implementation in the api-rest directory, we have a postWebhook function that sends a POST request to the Next.js webhook endpoint

```js
function postWebhook(event: string, payload: any) {
  console.log("Posting webhook", process.env.FRONTEND_SERVER, event, payload);
  if (process.env.FRONTEND_SERVER) {
    fetch(`${process.env.FRONTEND_SERVER}/api/callback`, {
      // to our nextjs application
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        payload,
      }),
    });
  }
}

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(cors({ origin: true, credentials: true }))
    .use(cookieParser())
    .use(urlencoded({ extended: true }))
    .use(json())
    .get("/priorities", (_, res) => {
      return res.json(PRIORITIES);
    })
    .get("/todos", async (req, res) => {
      const info =
        (await decodeJWT) <
        { sub: string } >
        req.cookies["authjs.session-token"];
      if (!info) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { sub } = info;
      const todos = getTodos(sub);
      return res.json(todos);
    })
    .get("/todo/:id", async (req, res) => {
      const info =
        (await decodeJWT) <
        { sub: string } >
        req.cookies["authjs.session-token"];
      if (!info) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { sub } = info;
      const { id } = req.params;
      const todos = getTodoById(sub, id);
      return res.json(todos);
    })
    .post("/todo", async (req, res) => {
      const info =
        (await decodeJWT) <
        { sub: string } >
        req.cookies["authjs.session-token"];
      if (!info) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { sub } = info;
      const todo = req.body;
      todo.id = `${sub}-${Date.now()}`;
      const newTodo = addTodo(sub, todo);

      postWebhook("todo-added", newTodo);

      return res.json(newTodo);
    })
    .put("/todo/:id", async (req, res) => {
      const info =
        (await decodeJWT) <
        { sub: string } >
        req.cookies["authjs.session-token"];
      if (!info) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { sub } = info;
      const { id } = req.params;
      updateTodoCompletion(sub, id, req.body.completed);

      const newTodo = getTodoById(sub, id);

      postWebhook("todo-changed", {
        id,
        completed: req.body.completed,
      });

      return res.json(newTodo);
    });

  return app;
};
```

- When the API REST server makes a mutation, it calls back to the API callback
- Then the API callback unconditionally revalidates the path, including all event details

#### Advantages and Limitations

- This approach provides client components with simple access to the backend, but it means that you do not get the BFF ability to actually look at what the requests are

### Token Variation of the External Systems Architecture

- This approach uses a service token to handle authentication between a Next.js client and an external API
- We'll set up a proxy in Next.js and use a bearer token strategy to make authenticated requests.

#### Security Considerations

- It is important to note that this architecture method exposes the access token to the client-side JavaScript
- This is in contrast to other examples we've looked at that use HTTP-only cookies that are not accessible to the client
- A more secure approach would be to handle token-based communication entirely on the server side
- In this setup, the client would talk to the Next.js server, then the Next.js server would have access to the Bearer token on the server
- It would make the request, then send the data back to the client

## Streaming and Suspense (Partial Pre-Rendering PPR) dir. jh-nextjs-client-and-server-cache/05-suspense-and-diy-streaming

- Which can be used to handle async operations like data fetching
- Is a mechanism in React for handling asynchronous operations like data fetching
- Instead of blocking the entire page while waiting for data, we can use Suspense to display a fallback UI

```jsx
// inside of the Home component return:
<Dashboard />
```

```jsx
// inside of app/dashboard.tsx
export default async function Dashboard() {
  const stocks = await getStocks();

  return (
    <div className="grid grid-cols-3 gap-4 mt-5">
      {stocks.map((stockPromise, index) => (
        <Suspense key={index} fallback={<div>Loading...</div>}>
          <StockDisplay stockPromise={stockPromise} />
        </Suspense>
      ))}
    </div>
  );
}
```

```jsx
// inside of app/dashboard.tsx

import { Suspense, use } from "react";

import { getStocks } from "@/lib/getStocks";
import { StockInfo } from "@/types";

function StockDisplay({ stockPromise }: { stockPromise: Promise<StockInfo> }) {
  const { name, ui } = use(stockPromise);
  return (
    <div>
      <div className="font-bold text-3xl">{name}</div>
      <div>{ui}</div>
    </div>
  );
}
```

## Advance Topics

### DIY Streaming with Server Actions (Go over this 1 more time)

```jsx
// Create the server action src/get-stocks-action.ts

"use server";
import { getStocks } from "@/lib/getStocks";

export async function getStocksAction() {
  return await getStocks();
}
```

- This server action will handle fetching our stock data

```jsx
// inside app/dashboard.tsx

"use client";
import { Suspense, use, useState, useEffect } from "react";

export default function Dashboard() {
  const [stocks, setStocks] = useState<StockInfo[]>([]);

  useEffect(() => {
    getStocksAction().then((stocks) => setStocks(stocks));
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mt-5">
      {stocks.map((stockPromise, index) => (
        <Suspense key={index} fallback={<div>Loading...</div>}>
          <StockDisplay stockPromise={stockPromise} />
        </Suspense>
      ))}
    </div>
  );
}
```

- Since we're working with server actions, we'll need to convert it into a client component and remove the async keyword
- We'll also initialize our stock state using useState, but instead of storing an array of stock information, we'll store an array of promises that resolve to stock information

- The above code will result in an error, that basically says "The error message tells us that the stock-with-counter.tsx module isn't in the React Client Manifest."

- Add this component and initialize it

```jsx
import StockWithCounter from "@/components/stock-with-counter";
const foo = StockWithCounter;
```

- This setup avoids the tree-shaking issue and ensures the component is included in the client manifest, and the dashboard loads as expected
- This DIY streaming approach, where a single server request streams back UI and data, offers a user experience unmatched by other frameworks.

### Cached Server Actions in NextJS (server actions can return not only data but UI) - dir. (jh-nextjs-client-and-server-cache/04-cacheable-server-actions)

- Server actions can return parts of the UI, which can be cached and reused across multiple components

**NOTE** - Method to intercept routes and check headers on client side

```jsx
// useCacheableServerAction";

import { useEffect } from "react";
import sha256 from "crypto-js/sha256";

export function useCacheableServerAction() {
  useEffect(() => {
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      let [resource, config] = args;
      if (
        // @ts-ignore
        config?.headers?.["Next-Action"] &&
        config.method === "POST" &&
        config.body
      ) {
        // @ts-ignore
        const json = JSON.parse(config.body);
        const hash = await sha256(
          // @ts-ignore
          `${config?.headers?.["Next-Action"]}:${JSON.stringify(json)}`
        );
        resource = `?hash=${hash}`;
      }
      const response = await originalFetch(resource, config);
      return response;
    };
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
}
```

- You can use in client like this:

```jsx
"use client";
import { useState, useEffect } from "react";

import { useCacheableServerAction } from "./useCacheableServerAction";

export default function ClientContentSection({
  onGetCounter,
  onGetTimer,
}: {
  onGetCounter: (start: number) => Promise<React.ReactNode>,
  onGetTimer: () => Promise<React.ReactNode>,
}) {
  const [counter, setCounter] = useState < React.ReactNode > null;
  const [timer, setTimer] = useState < React.ReactNode > null;

  useCacheableServerAction(); // --------> RIGHT HERE

  useEffect(() => {
    (async () => {
      setCounter(await onGetCounter(10));
      setTimer(await onGetTimer());
    })();
  }, []);

  return (
    <>
      <h1>Client Content Component</h1>
      <div>{timer}</div>
      <div>{counter}</div>
    </>
  );
}
```

#### Understanding the Problem

- Let's imagine we're building a site like Slashdot. Typically, high-traffic sites use a CDN (Content Delivery Network) to handle a lot of the requests and reduce the load on their servers.

- Here's how it works:

- The client makes a request to Slashdot.
- The CDN intercepts the request.
- If the CDN has the page cached, it returns it.
- If not, the CDN forwards the request to the origin server (our Next.js app).
- The Next.js server returns the page to the CDN.
- The CDN caches the page and returns it to the client.
- This is great because it takes a lot of pressure off of our Next.js server, but it usually works on the whole page level.

- Server Actions can return UI

```jsx
async function getCounter(start: number) {
  "use server";
  return <Counter start={start} />;
}

async function getTimer() {
  "use server";
  return <Timer />;
}
```

- We can return static HTML, a combination of static HTML and client components, or even full client components, continuing with the Slashdot example, let's say we have a client component for the "Most Discussed" section.

- Here's how it can work with a server action:
  - The client component makes a server action request to get the "Most Discussed" content.
  - The server action returns the rendered HTML or client components for that section.
  - The client component renders the received content.

#### How Server Actions Works (IMPORTANT)

- Server actions work by having the client send a POST request to the same route it's on, but with a special header called **Next-Action**
- The Next.js server, seeing this header, knows to execute the server action, instead of a normal page request
  - It does the work, gets the content, and sends it back to the client
- What gets sent back to the client is "flight data", essentially a serialized version of the UI that's ready to be hydrated on the client-side

1. First, intercept the client's server action request and create a unique hash based on the request (including any arguments passed to the server action). This hash will be used as a key for caching the server action response.
2. If the hash is found in the cache, return the cached response. If not, let the request go through to the Next.js server, cache the response, and then return it to the client.
3. Normally, CDNs don't cache any POST, PUT, PATCH, or DELETE requests, so there would be special configuration needed to make this work in a real-world scenario.

### File Uploads in NextJS App Router Apps dir. jh-nextjs-client-and-server-cache/02-file-uploads

## NextJS 15 Caching (check out 06-nextjs-15-caching in jh-nextjs-client-and-server-cache)
