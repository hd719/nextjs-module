# Next.js Foundations for Professional Web Development

## Routing

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

## Data Fetching

1. Server-side data fetching

```jsx
export default async function Page() {
  let data = await fetch('https://api.vercel.app/blog')
  let posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

2. Client-side data fetching

```jsx
'use client' // This is way is not recommended (use a library like SWR or TanStack Query - you dont caching, loading, error, states, and revalidation)

import { useState, useEffect } from 'react'

export function Posts() {
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    async function fetchPosts() {
      let res = await fetch('https://api.vercel.app/blog')
      let data = await res.json()
      setPosts(data)
    }
    fetchPosts()
  }, [])

  if (!posts) return <div>Loading...</div>

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

3. Client-side data fetching with API Route Handlers

```jsx
// src/app/api/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = request.url;

  return NextResponse.json({
    message: "Hello from the API",
    request: requestUrl,
  });
}

export async function HEAD(request: NextRequest) {}

// Pass in the API KEY HERE -> API key is hidden on the client
const API_KEY = process.env.MY_API_KEY;
export async function POST(request) {
  const authHeader = request.headers.get('Authorization');

  // Check if API key is present and correct
  if (!authHeader || authHeader !== `Bearer ${API_KEY}`) {
    return NextResponse.json(
      { message: 'Unauthorized: Invalid API Key' },
      { status: 401 }
    );
  }

  const data = await request.json();
  items.push(data);
  return NextResponse.json({ message: 'Item added successfully', items });
}

export async function PUT(request: NextRequest) {}

export async function DELETE(request: NextRequest) {}

export async function PATCH(request: NextRequest) {}

// If `OPTIONS` is not defined, Next.js will automatically implement `OPTIONS` and  set the appropriate Response `Allow` header depending on the other methods defined in the route handler.
export async function OPTIONS(request: NextRequest) {}
```

```jsx
// ClientComponent

"use client";
import { useEffect, useState } from 'react';

export default function ItemsComponent() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  // Fetch items on component mount
  useEffect(() => {
    async function fetchItems() {
      const response = await fetch('/api/items');
      const data = await response.json();
      setItems(data.items);
    }
    fetchItems();
  }, []);

  // Add a new item
  const addItem = async () => {
    if (!newItem) return;

    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newItem }),
    });

    const data = await response.json();
    setItems(data.items);
    setNewItem(''); // Clear the input field
  };

  return (
    <div>
      <h2>Items List</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>

      <input
        type="text"
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        placeholder="Add a new item"
      />
      <button onClick={addItem}>Add Item</button>
    </div>
  );
}
```

## Server Actions

- There are two different ways to define a server action:
- Adding "use server"; at the top of the file indicates that every function inside the module is a server action.
- Alternatively, adding "use server"; inside the definition of a function indicates that the function is a server action.

### Got ya's with Server Actions

- When fetching data from server actions the request method to fetch is a POST, which means we can't cache the request
- Making GET requests to the server using server actions will always result in POST requests
- If you were to use an API route, you get to control the verb and could use GET to fetch the data and have it stay as a GET
- API routes also allow you to control the format of the request, which you can't do with server actions

## Client Components

- Run on the client and server **(Hydrated on the client)**
- Run hooks, use state, use effect, etc.
- Add `use client` to the top of the file to make it a client component
- Cannot import server components into client components
- Can import client components into server components
- **Server actions cannot be called from client components** , however you can pass down server actions from server components to client components
- When a component is promoted to a client component, you can use hooks inside it without explicitly marking it with 'use client'
- Bringing useState into the Container component, we could toggle the visibility of the children based on the state without any issues.
- The Container component uses the useState hook to manage the visibility state, and it works as expected without the need for the 'use client' directive.

### Why use server components over client components?

- This is huge because the server-component code is not sent to the client, which not only reduces the size of the bundle that you send to the client, it also speeds up the application because there's less code to run on the client
- Good for security too, because that RSC code is only run on the server. So you don't have to worry about leakage of secrets out to the client, because that code never actually gets to the client
- Loading data on RSE is a huge win because it makes it very easy to call back-end services and then render the result and easily send data to the client
- faster because you're probably talking to services in the same cluster as opposed to over the open internet
- RSC's make it so much easier to load data into your application and to do it securely

### Tips

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

### Using as Prop Deep Dive

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

## Suspense and out of order streaming

- The out-of-order streaming behavior provided by Suspense is incredibly powerful.
- Here's what happens:
  1. When you request the homepage from a server, it sends back everything that isn't wrapped in Suspense first and It holds the connection open until all the Suspense boundaries are resolved
  2. It takes the output of the Suspense boundaries and streams it to the client
  3. The client goes ahead and updates that content anywhere on the page based on its own schedule (this is why it's referred to as "out-of-order streaming")

### Previously (pages router)

- It used to be that you would have to render the page and then pause if you had some promise-type request ongoing and then continue. You couldn't finish the HTML until the whole page was done.
**However, with out-of-order streaming, you can stream the whole page and change out parts of it using the Suspense system**

### App Router vs Pages Router

- One of the biggest advantages of the App Router system over the Pages Router system comes down to managing laggy components
- With the Pages Router system, it was far more involved, yuou'd have to bail out of getServerSideProps, make requests off the client, open up APIs, and so on
- It required a lot of work, potentially opening up a host of security issues
- With App Router, it's as simple as adding a Suspense. It works wherever you need it, with minimal fuss.

## Parallel Routes

- Parallel routes work on the file system level by creating a folder with the @ symbol followed by the name of the parallel route
- Next.js automatically detects that the component is blocking and uses the optional loading.tsx file to display a loading UI!
- This is an example of implicit suspense behavior at the route level. If you want more fine-grained control over suspense boundaries and loading states, you can use the Suspense component as we did in the previous lesson.
- Parallel Routes in Next.js App Router provide a powerful way to load multiple components simultaneously, improving the performance and user experience of your application.
- By using Parallel Routes, we were able to add a chat menu sidebar that loads in parallel with the main chat content, without blocking the entire page
