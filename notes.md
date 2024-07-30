# NextJS Intro

- NextJS is a React framework that allows you to build server-side rendered (SSR) applications.

## File based routing

- You can create a new page by creating a new file in the pages directory
- The file name will be the route of the page
- page.tsx is the entry point of the page (home page)

- Directories must have page.tsx file to be considered a route
- Nested routes can be created by creating a folder with the same name as the route and creating an index.js file inside it
  - ex.
    - pages/
      - about.js
      - contact.js
      - blog/
        - page.tsx # Route: /blog
- Dynamic routes can be created by creating a file with square brackets in the name
  - ex.
    - pages/
      - blog/
        - [slug].tsx # Route: /blog/:slug

## @ Symbol

- The @ symbol is used to import modules from the root of the project, instead of using relative paths (../../..)
  - ex.
    - import { Layout } from '@/components/Layout'

## Image Component

- NextJS provides an Image component that optimizes images for the web
- Optimizes images by lazy loading, resizing, and serving images in modern formats (web)
- Use with local or remote images
- Next server will optimize images on the fly (6000 x 4000 - Desktop image will be resized to 1200 x 800 - mobile) and will be cached

### Image component sizing (section 1 - video 11)

- When you import the image from NextJS and console.log the exported image you get the following:
  - src: '/_next/image?url=%2Fimages%2Fprofile.jpg&w=384&q=75'
  - height: 192
  - width: 384
  - blurDataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAABKklEQVR42mL8//8/AyUYTFh

- The height and width is given
- Using the fill prop will stretch the image to the container size
- 3 options:
  1. layout="fill" - stretches the image to the container size
  2. Using a local image, dimensions are taken from the imported image (like above)
  3. Assigning a width and height to the image will override the imported image dimensions

## Server Actions (async functions)

- Number 1 way to change data in a next app
- Super close integration with HTML forms
- Server actions are functions that will be called with the values a user entered into a form
- Will run when the user submits a form
- Can be used to send data to a server, save data to a database, or send an email
- Server actions are defined in the same file as the form

```jsx
'use server';

async function createSnippet(formData: FormData) {
  // This needs to be a server action
  "use server"; // This is a server action, it will be run on the server

  // Check the user's input and make sure its valid
  const title = formData.get("title") as string;
  const code = formData.get("code") as string;

  // Take the user input and create a new record in the db
  const snippet = await db.snippet.create({
    data: {
      title,
      code,
    },
  });

  console.log("Created new snippet", snippet);

  // Redirect the user to the new snippet's page
  redirect("/");
}
```

## Server Components

- Run on the server
- Functions that return jsx
- By default all components are server components (mostly used, better UX and better performance)
- Cannot use hooks and cannot attach event handlers
- Can use async/await directly in the functions or 3rd party state management libraries

## Client Components

- Run on the client
- Run hooks, use state, use effect, etc.
- Add `use client` to the top of the file to make it a client component
- Cannot import server components into client components
- Can import client components into server components
- **Server actions cannot be called from client components** , however you can pass down server actions from server components to client components

## Next Server

- Next server is a node server that runs your NextJS app
- On 1st request (initial load): Both server component and client component will be rendered as html (w/o js) **on the server** !!
- Note: The client component only on initial request will be rendered on the server
- On 2nd request: The NextJS server will look at the client components and will send the necessary JS to the client

## Not Found

- NextJS provides a built-in 404 page
- In this case we put it in the [id] directory this will be the 404 page for the snippets, next js finds the closest 404 page to the route

## Loading

- NextJS provides a built-in loading component that can be used to show a loading spinner while the page is loading
- Same thing as Not Found, we put it in the [id] directory this will be the loading page for the snippets, next js finds the closest loading page to the route

## Redirect()

- Do not put these in try catch blocks because the catch block will think the redirect is an error

## Caching

- Next has 4 types of caching
  1. Data Cache
  2. Route Cache
  3. Request Memoization
  4. Full Route Cache -> Default caching behavior

### Control caching

- Time base caching: stale-while-revalidate

```jsx
  export const revalidate = 60; // 1 minute 
  export const getServerSideProps = async (context) => {
    return {
      props: {
        snippets,
      },
    };
  };
```

- On Demand caching: Forcibly purge a cached response
- Disable caching: Do not do any caching
- You can check the cache-control header in the network tab in the browser
- NextJS you can force a route to be dynamic by adding the following to the file
  - export const dynamicRoute = 'force-dynamic'

- 1 Hour caching ex.

```jsx
  export const getServerSideProps = async (context) => {
    return {
      props: {
        snippets,
      },
      revalidate: 3600,
    };
  };
```

### generateStaticParams()

- Used to generate static paths for dynamic routes, for example if you have a dynamic route that is based on a database you can use this function to generate the paths (check out the code below that we used to generate the paths for the snippets in the database 0 get the id of each snippet)

```jsx
// Only happens in production
export async function generateStaticParams() {
  const snippets = await db.snippet.findMany();

  return snippets.map((snippet) => {
    return {
      id: snippet.id.toString(),
    };
  });
}
```

## Implementing Oauth - Check out diagram in OneNote

## Why is / showing up as dynamic route in the build output?

```md
┌ λ /                                    148 B          84.6 kB
├ λ /_not-found                          870 B          85.3 kB
├ λ /api/auth/[...nextauth]              0 B                0 B
├ λ /topics/[slug]                       148 B          84.6 kB
├ λ /topics/[slug]/posts/[postId]        148 B          84.6 kB
└ λ /topics/[slug]/posts/new             148 B          84.6 kB
+ First Load JS shared by all            84.5 kB
  ├ chunks/472-32f0eb17436428b8.js       29.2 kB
  ├ chunks/fd9d1056-457a8107954bcc1e.js  53.3 kB
  ├ chunks/main-app-089614cbb082edf9.js  218 B
  └ chunks/webpack-d4dd01fad3bcece4.js   1.72 kB
```

- The reason because in our codebase we have a <Header /> component that encapsulates all of the pages in our app, due to this all routes will be considered dynamic routes because the header is on all pages

## Content Streaming

## Request Memoization

- In our case we are going to pass the prop `postId` to all of our components and pass our function `fetchCommentsByPostId(postId)` -> the issue is we are doing uncessary data fetching
- We can use request memoization to cache functions (also database queries) that have the same URL and method


## Query Strings (tricky check slides for page components (server and client))

- Client components with `useSearchParams` hook will need to wrapped with `Suspense` otherwise you will get a strange warning at build time
- Any page that references `searchParams` will be marked as dynamic for purposes of build time caching
