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