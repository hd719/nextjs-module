# Next.js Production Project Setup and Infrastructure

- [Repo](https://github.com/ProNextJS/project-infrastructure)
- [Forked Repo](https://github.com/hd719/jh-nextjs-project-infrastructure)
- [Infrastructure Template](https://github.com/ProNextJS/project-infrastructure/blob/main/INFRASTRUCTURE.md)

## Code Quality from the start

### Setting up Esling and Prettier

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

## Project Structure

### Importing Component Files

Ex.

```jsx
// inside page.tsx
import { Button } from './Button/Button';
```

- The import can be simplified by creating a `index.tsx` file and export the component from there

```jsx
export { Button } from './Button';
```

### Default Export

```jsx
export default function Button() { ... }
```

```jsx
// index.ts

export { default } from './Button'
```

- Organizing components into directories like this helps make the project structure easier to understand
- The directory is also easier to share and reuse across the application or in other projects
- While it might seem like a lot for smaller components, using this structure from the beginning sets a good foundation and encourages good organization

### Organizing Components into Directories

- Components are in upper case
- **KEEP COMPONENTS CLOSEST TO WHERE THEY ARE USED**

### Organizing Component Files - checkout this dir. 03-one-component-per-file

- Rule of thumb is one exported component per file, with files ideally less than 100 lines and not bigger than around 250 lines

## Storybook with NextJS

`npx storybook@latest init`

Initializing Storybook for Next.js

## Unit Testing

- Keep the test next to the component

## End-to-End Testing

## Bundle Size checker

- Keeping bundle size under control is important for maintaining optimal performance
- To help with this, we'll use GitHub Actions to automate bundle size checks on pull requests and pushes to the main branch
- Additionally, we'll use Husky to run these same checks locally before committing code

## MonoRepo

## Advanced Component Structure - 16-lego-components

- Introduced in Next.js v14
- These components are complete and self-contained just like real Lego blocks and can manage their own state, fetch data, and render themselves
- We'll convert the PokemonList component into a Lego component that can be shared between multiple applications in a Turborepo app
- Only available in the App Router

## Naming and Organizing Server and Client Components - 15-client-server-components

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