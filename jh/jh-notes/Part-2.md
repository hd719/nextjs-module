# Styling NextJS Application with CSS (each style has its own branch)

## Styling Challenges with React Server Components

- The introduction of React Server Components (RSCs) in the App Router has brought some challenges when it comes to styling. RSCs cannot use hooks or context, which means that popular CSS libraries like Emotion and Material UI may not be compatible out of the box

- This can be a pain point, as it requires all components styled with such libraries to be client components, limiting the benefits of the App Router

- We'll explore various styling options, including:
  - Built-in CSS Modules
  - Tailwind CSS
  - Meta's Stylex, a build-time CSS system
  - Materialize Pigment CSS
  - Making Emotion work with the App Router
  - Practical Demonstration

## Create a Layout with CSS Modules

## Refine the layout with CSS Modules

- Container queries are a powerful feature that allows you to create layouts dependent on the size of the container, similar to media queries, but instead of being based on the viewport size, they're based on the specified container

## Configure Container Queries with Tailwind

## Combination using CSS Modules and Tailwind

## Styling with Meta's Stylex

- StyleX provides a more rigid approach compared to CSS modules and Tailwind, but it can be beneficial when you need well-defined and locked-in styles. Let's apply StyleX to our current unstyled application

### When to use StyleX (Build Time CSS)

- Looking back at the code for this example project, it's important to note that this example isn't necessarily showcasing StyleX at its best
- StyleX is designed for creating precisely controlled design systems, which is particularly useful for large companies like Meta
- In those environments, you want a reliable design system with constraints
- You might want to limit the modifications users can make to specific parts of a design element, like a button
- StyleX allows you to define exactly which attributes of a button can be changed, which is a unique feature not found in other CSS libraries.
- If you're working on a design infrastructure team at a large company or on an open-source project where you want to define a controlled design system for third-party contributors, StyleX is definitely worth considering.
- However, developers coming from a CSS Modules or Tailwind background might find StyleX to be overly restrictive, like a "CSS straitjacket."
- But in larger environments, that level of control is often necessary.

## Styling with Materialize Pigment CSS (Build Time CSS)

- Material UI is a popular component framework for Next.js applications that use the Pages Router
- However, it doesn't work natively with React Server Components
- This is because Material UI is based on Emotion, which uses context for theming
- Since React Server Components can't handle context, Material UI components need to be client components to manage their own styling
- This is a fundamental issue that can't be fixed with a spot fix, so the team behind Material UI created Pigment CSS

## Styling with Emotion

- Can not be used with React Server Components
- Emotion captures all of the CSS classes into a registry

### A Note on Client Components

- You might be wondering why this works even though we didn't add the 'use client' directive to the ProductCard component
- The reason is that the page.tsx file is already a Client Component because of the 'use client' directive at the top
- This establishes a boundary, and anything that page.tsx imports and uses inherits that directive and becomes a Client Component as well.

### A Note on Using Emotion with the App Router

- Wouldn't recommend using Emotion with the App Router, I don't think it's the ideal combination.
- When you're working with the App Router, I believe it's better to use either CSS Modules or a build-time solution like StyleX or Pigment.
- Pigment, in particular, offers a similar styled-component syntax to Emotion, so if you like that style of defining your styles, I'd recommend switching to Pigment.
- The main benefits of using a build-time solution over Emotion are that you don't need to set up the Emotion registry, and the CSS will be more performant because there's no runtime CSS generation on the client.
- While it's certainly possible to use Emotion with the App Router, I think there are other styling solutions out there that are better suited to the App Router's design and goals.
- Just remember to consider the tradeoffs and explore alternative styling solutions that might be a better fit for your project.

## Component Libraries (ShadCN, ParkUI, Bootstrap, Ant Design, Material UI, Chakra UI, Wedges, NextUI, and Mantine)

### ShadCN

- ShadCN is a component library that provides a set of components for building Next.js applications
- It's designed to work with the App Router and React Server Components
- ShadCN sits on top of Radix UI, which is a low-level component library that provides a set of primitives for building accessible and composable UI components
- You can add components from ShadCN to your Next.js application by importing them from the shadcn package
- Relies on tailwindcss
- Commands:
  - `npx shadcn-ui@latest init` - to install the library
  - `npx shadcn-ui@latest add button input form` - to add components