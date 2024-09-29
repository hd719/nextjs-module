# Professional Next.js Workshops - JH

## Next.js Foundations for Professional Web Development

### Routing

Checkout the dir. nextjs-route-test - this is using App Router

| Path                               | URL Examples                                 |
|------------------------------------|----------------------------------------------|
| `/page.tsx`                        | `/`                                          |
| `/about/page.tsx`                  | `/about`                                     |
| `/about/you/page.tsx`              | `/about/you`                                 |
| `/product/[productId]/page.tsx`    | `/product/foo`, `/product/bar`               |
| `/product/page.tsx`                | `/product`                                   |
| `/setting/[...setting]/page.tsx`   | `/setting/a`, `/setting/b/c`                 |
| `/setting/page.tsx`                | `/setting`                                   |
| `/info/[[...item]]/page.tsx`       | `/info`, `/info/23`, `/info/23/detail`       |
| `/(teamA)/editor/page.tsx`         | `/editor`                                    |

- Heads up you can use `route.ts` file instead of `page.tsx` file if you want to create a route handler

### Server Actions

- There are two different ways to define a server action:
- Adding "use server"; at the top of the file indicates that every function inside the module is a server action.
- Alternatively, adding "use server"; inside the definition of a function indicates that the function is a server action.

#### Got ya's with Server Actions

- When fetching data from server actions the request method to fetch is a POST, which means we can't cache the request
- Making GET requests to the server using server actions will always result in POST requests
- If you were to use an API route, you get to control the verb and could use GET to fetch the data and have it stay as a GET
- API routes also allow you to control the format of the request, which you can't do with server actions

### Client Components

- Run on the client and server **(Hydrated on the client)**
- Run hooks, use state, use effect, etc.
- Add `use client` to the top of the file to make it a client component
- Cannot import server components into client components
- Can import client components into server components
- **Server actions cannot be called from client components** , however you can pass down server actions from server components to client components
- When a component is promoted to a client component, you can use hooks inside it without explicitly marking it with 'use client'
- Bringing useState into the Container component, we could toggle the visibility of the children based on the state without any issues.
- The Container component uses the useState hook to manage the visibility state, and it works as expected without the need for the 'use client' directive.

#### Why use server components over client components?

- This is huge because the server-component code is not sent to the client, which not only reduces the size of the bundle that you send to the client, it also speeds up the application because there's less code to run on the client
- Good for security too, because that RSC code is only run on the server. So you don't have to worry about leakage of secrets out to the client, because that code never actually gets to the client
- Loading data on RSE is a huge win because it makes it very easy to call back-end services and then render the result and easily send data to the client
- faster because you're probably talking to services in the same cluster as opposed to over the open internet
- RSC's make it so much easier to load data into your application and to do it securely

#### Tips

- **DO NOT USE CONTEXT OR EXTERNAL STATE MANAGERS** in server components, use props instead or take advantage of the nextjs caching
- Do not send functions to client components specifically event handlers instead use server actions
- **Client components cannot directly invoke asynchronous server components**

`Home.tsx`

```jsx
export default async function Home() {
  return (
    <div>
      <ClientComponent />
      <ServerComponent>
    </div>
  )
}
```

`ClientComponent.tsx`

```jsx
export default async function ClientComponent() {
  return (
    <ServerComponent />
  )
}
```

- Trying to render a server component directly inside a client component will result in an error

- Instead use **COMPOSITION** or pass the server component as prop

`Home.tsx`

```jsx
export default async function Home() {
  return (
    <div>
      <ClientComponent content={<ServerComponent />}>
        <ServerComponent>
      </ClientComponent>
      <ServerComponent>
    </div>
  )
}
```

`ClientComponent.tsx`

```jsx
export default async function ClientComponent({children, content}) {
  return (
    <>
      <div>{children}</div>
      <div>{content}</div>
    </>

  )
}
```

- This allows the client component to contain the server component without directly invoking it
- By passing the server component as a child to the client component, we can successfully compose them together
- The server component remains a server component, while the client component acts as a container.

- This is the same idea we saw with the SessionProvider component
- By wrapping the application with SessionProvider, you don't automatically turn everything inside it into client components
Instead, the client component can contain server components through composition

#### Using as Prop Deep Dive

- This will work `content={<ServerComponent />}` this will "not" `content={() => <ServerComponent />}`

`Home.tsx`

```jsx
export default async function Home() {
  return (
    <div>
      <ClientComponent content={<ServerComponent />}>
        <ServerComponent>
      </ClientComponent>
      <ServerComponent>
    </div>
  )
}
```

`ClientComponent.tsx`

```jsx
export default async function ClientComponent({content}) {
  return (
    <div>{content}</div>
  )
}
```

- Flexibility

```jsx
export default async function Home() {
  return (
    <div>
      <ClientComponent content={async () => {
        "use server";
        return <ServerComponent />;
      }}>
        <ServerComponent>
      </ClientComponent>
      <ServerComponent>
    </div>
  )
}
```

`ClientComponent.tsx`

```jsx
export default async function ClientComponent({content: () => Promise<React.ReactNode>}) {
  return (
    <div>
      <Suspense>{content()}<Suspense/>
    </div>
  )
}
```

### Suspense and out of order streaming

- The out-of-order streaming behavior provided by Suspense is incredibly powerful.
- Here's what happens:
  1. When you request the homepage from a server, it sends back everything that isn't wrapped in Suspense first and It holds the connection open until all the Suspense boundaries are resolved
  2. It takes the output of the Suspense boundaries and streams it to the client
  3. The client goes ahead and updates that content anywhere on the page based on its own schedule (this is why it's referred to as "out-of-order streaming")

#### Previously (pages router)

- It used to be that you would have to render the page and then pause if you had some promise-type request ongoing and then continue. You couldn't finish the HTML until the whole page was done.
**However, with out-of-order streaming, you can stream the whole page and change out parts of it using the Suspense system**

#### App Router vs Pages Router

- One of the biggest advantages of the App Router system over the Pages Router system comes down to managing laggy components
- With the Pages Router system, it was far more involved, yuou'd have to bail out of getServerSideProps, make requests off the client, open up APIs, and so on
- It required a lot of work, potentially opening up a host of security issues
- With App Router, it's as simple as adding a Suspense. It works wherever you need it, with minimal fuss.

### Parallel Routes

- Parallel routes work on the file system level by creating a folder with the @ symbol followed by the name of the parallel route
- Next.js automatically detects that the component is blocking and uses the optional loading.tsx file to display a loading UI!
- This is an example of implicit suspense behavior at the route level. If you want more fine-grained control over suspense boundaries and loading states, you can use the Suspense component as we did in the previous lesson.
- Parallel Routes in Next.js App Router provide a powerful way to load multiple components simultaneously, improving the performance and user experience of your application.
- By using Parallel Routes, we were able to add a chat menu sidebar that loads in parallel with the main chat content, without blocking the entire page.

## Styling NextJS Application with CSS

**EACH THEM HAS ITS DOWN DEDICATED BRANCH**

### Styling Challenges with React Server Components

- The introduction of React Server Components (RSCs) in the App Router has brought some challenges when it comes to styling. RSCs cannot use hooks or context, which means that popular CSS libraries like Emotion and Material UI may not be compatible out of the box

- This can be a pain point, as it requires all components styled with such libraries to be client components, limiting the benefits of the App Router

- We'll explore various styling options, including:
  - Built-in CSS Modules
  - Tailwind CSS
  - Meta's Stylex, a build-time CSS system
  - Materialize Pigment CSS
  - Making Emotion work with the App Router
  - Practical Demonstration

### Create a Layout with CSS Modules

### Refine the layout with CSS Modules

- Container queries are a powerful feature that allows you to create layouts dependent on the size of the container, similar to media queries, but instead of being based on the viewport size, they're based on the specified container

### Configure Container Queries with Tailwind

### Combination using CSS Modules and Tailwind

### Styling with Meta's Stylex

- StyleX provides a more rigid approach compared to CSS modules and Tailwind, but it can be beneficial when you need well-defined and locked-in styles. Let's apply StyleX to our current unstyled application

#### When to use StyleX (Build Time CSS)

- Looking back at the code for this example project, it's important to note that this example isn't necessarily showcasing StyleX at its best
- StyleX is designed for creating precisely controlled design systems, which is particularly useful for large companies like Meta
- In those environments, you want a reliable design system with constraints
- You might want to limit the modifications users can make to specific parts of a design element, like a button
- StyleX allows you to define exactly which attributes of a button can be changed, which is a unique feature not found in other CSS libraries.
- If you're working on a design infrastructure team at a large company or on an open-source project where you want to define a controlled design system for third-party contributors, StyleX is definitely worth considering.
- However, developers coming from a CSS Modules or Tailwind background might find StyleX to be overly restrictive, like a "CSS straitjacket."
- But in larger environments, that level of control is often necessary.

### Styling with Materialize Pigment CSS (Build Time CSS)

- Material UI is a popular component framework for Next.js applications that use the Pages Router
- However, it doesn't work natively with React Server Components
- This is because Material UI is based on Emotion, which uses context for theming
- Since React Server Components can't handle context, Material UI components need to be client components to manage their own styling
- This is a fundamental issue that can't be fixed with a spot fix, so the team behind Material UI created Pigment CSS

### Styling with Emotion

- Can not be used with React Server Components
- Emotion captures all of the CSS classes into a registry

#### A Note on Client Components

- You might be wondering why this works even though we didn't add the 'use client' directive to the ProductCard component
- The reason is that the page.tsx file is already a Client Component because of the 'use client' directive at the top
- This establishes a boundary, and anything that page.tsx imports and uses inherits that directive and becomes a Client Component as well.

#### A Note on Using Emotion with the App Router

- Wouldn't recommend using Emotion with the App Router, I don't think it's the ideal combination.
- When you're working with the App Router, I believe it's better to use either CSS Modules or a build-time solution like StyleX or Pigment.
- Pigment, in particular, offers a similar styled-component syntax to Emotion, so if you like that style of defining your styles, I'd recommend switching to Pigment.
- The main benefits of using a build-time solution over Emotion are that you don't need to set up the Emotion registry, and the CSS will be more performant because there's no runtime CSS generation on the client.
- While it's certainly possible to use Emotion with the App Router, I think there are other styling solutions out there that are better suited to the App Router's design and goals.
- Just remember to consider the tradeoffs and explore alternative styling solutions that might be a better fit for your project.

### Component Libraries (ShadCN, ParkUI, Bootstrap, Ant Design, Material UI, Chakra UI, Wedges, NextUI, and Mantine)

#### ShadCN

- ShadCN is a component library that provides a set of components for building Next.js applications
- It's designed to work with the App Router and React Server Components
- ShadCN sits on top of Radix UI, which is a low-level component library that provides a set of primitives for building accessible and composable UI components
- You can add components from ShadCN to your Next.js application by importing them from the shadcn package
- Relies on tailwindcss
- Commands:
  - `npx shadcn-ui@latest init` - to install the library
  - `npx shadcn-ui@latest add button input form` - to add components

## Next.js Production Project Setup and Infrastructure

- [Repo](https://github.com/ProNextJS/project-infrastructure)
- [Forked Repo](https://github.com/hd719/jh-nextjs-project-infrastructure)
- [Infrastructure Template](https://github.com/ProNextJS/project-infrastructure/blob/main/INFRASTRUCTURE.md)

### Code Quality from the start

#### Setting up Esling and Prettier

- Next.js projects come with ESLint set up, using the `next/core-web-vitals config`
- Default command `pnpm run lint`
- Prettier install `pnpm add eslint-config-prettier prettier prettier-plugin-tailwindcss -D`
  - eslint-config-prettier: This package makes ESLint and Prettier work together without conflicts.
  - prettier: The main Prettier package for code formatting.
  - prettier-plugin-tailwindcss: This plugin formats Tailwind CSS classes in your code

- Sort import Plugin `pnpm add @ianvs/prettier-plugin-sort-imports -D`

```json
{
  "plugins": ["prettier-plugin-tailwindcss", "@ianvs/sort-imports"],
  "importOrder": [
    "^(react/(.*)$)|^(react$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^[./]"
  ]
}
```

### Project Structure

#### Importing Component Files

Ex.

```jsx
// inside page.tsx
import { Button } from './Button/Button';
```

- The import can be simplified by creating a `index.tsx` file and export the component from there

```jsx
export { Button } from './Button';
```

#### Default Export

```jsx
export default function Button() { ... }
```

```jsx
index.ts

export { default } from './Button'
```

- Organizing components into directories like this helps make the project structure easier to understand
- The directory is also easier to share and reuse across the application or in other projects
- While it might seem like a lot for smaller components, using this structure from the beginning sets a good foundation and encourages good organization

#### Organizing Components into Directories

- Components are in upper case
- **KEEP COMPONENTS CLOSEST TO WHERE THEY ARE USED**

#### Organizing Component Files - checkout this dir. 03-one-component-per-file

- Rule of thumb is one exported component per file, with files ideally less than 100 lines and not bigger than around 250 lines

### Storybook with NextJS

`npx storybook@latest init`

Initializing Storybook for Next.js

### Unit Testing

- Keep the test next to the component

### End-to-End Testing

### Bundle Size checker

- Keeping bundle size under control is important for maintaining optimal performance
- To help with this, we'll use GitHub Actions to automate bundle size checks on pull requests and pushes to the main branch
- Additionally, we'll use Husky to run these same checks locally before committing code

### MonoRepo

### Advanced Component Structure - 16-lego-components

- Introduced in Next.js v14
- These components are complete and self-contained just like real Lego blocks and can manage their own state, fetch data, and render themselves
- We'll convert the PokemonList component into a Lego component that can be shared between multiple applications in a Turborepo app
- Only available in the App Router

### Naming and Organizing Server and Client Components - 15-client-server-components

- This illustrates an emerging pattern: a symbiotic relationship between server and client components
- The server component manages data fetching and server-side operations, while the client component handles interactivity and presentation
- One way developers denote this relationship is by appending .server and .client to the filenames

ex.

```md
  PokemonList/
    PokemonList.server.tsx
    PokemonList.client.tsx
```

- OR create an index.ts file that exports the server component by default:

```jsx
// inside PokemonList/index.ts
export { default } from "./PokemonList.server";
```

```jsx
// inside app/page.tsx

import PokemonList from "./PokemonList";

export default function Home() {
  return <PokemonList />;
}
```

- This directory-based approach hides the server-client component relationship, presenting a single PokemonList component to the user
- It streamlines the code and prevents confusion about entry points

## Next.js React Server Component Architecture

### Caching in Depth

#### Caching with Next.js App Router

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

##### Dynamic Routes in Next.js (Full Route)

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

##### Automatic and Manual Revalidation (Full Route Cache)

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

##### Next.js API Route Caching (Full Route Cache)

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

#### 2. Data Cache

##### Data Caching and Revalidation with React Server Components

- Statically caches the response by default
- Using `cache: "no-store"` will prevent caching
- Provides a revalidate option that allows us to specify how often a statically generated page should be regenerated

```jsx
export default async function APITime() {
  const timeReq = await fetch("http://localhost:8080/time", {
    next: {
      revalidate: 2
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
  onRevalidate: () => Promise<void>;
}) {
  return (
    <Button onClick={async () => await onRevalidate()} className="mt-4">
      Revalidate API Time
    </Button>
  );
}
```

- The tagging mechanism offers a flexible way to manage data invalidation across our application, especially when working with databases and filesystems

#### Cache-busting with Tags

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
  onRevalidate: () => Promise<void>;
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

#### The Next.js Router Cache (Client Cache)

- Built-in client side cache
- Designed to make navigation between routes super efficient
- **When you visit a route in your Next.js app, the page content gets stored in the cache. If you revisit that same route later, the cached version will load instantly, resulting in a much smoother user experience**

#### Revalidation with Server Actions by using `revalidatePath` and going back to the home page

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
            router.push('/');
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

#### Role of Response Headers in Revalidation (how does it work)

1. When a server action is executed the Next.js client sends a request to the server with a special next-action-id header
2. The server recognizes this header and executes the corresponding server action
3. If this action includes `revalidatePath` or `revalidateTag`, the server's response will include a x-nextjs-revalidate header
4. This header tells the Next.js client to invalidate its cache for the specified route or tags, which will trigger a revalidation on the next navigation

#### Revalidation without Server Actions

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

#### When to worry about Router Cache?

- The good news is that the router cache usually works seamlessly in the background
- You'll typically only need to manually interact with it when working with **API routes that modify data used on your pages or when you need fine-grained control over cache invalidation**
