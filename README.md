# Todos Frontend

React + TypeScript frontend for a Todo application built with Vite.  
It provides user registration, login, and a protected Todos page where authenticated users can create, update, complete, and delete todos.


---

## Table of contents

- [Key features](#key-features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Routing & UX behavior](#routing--ux-behavior)
- [Configuration & environment](#configuration--environment)


---

## Key features

- User registration and login flows
- Token-based authentication stored in localStorage (key: `token`)
- Protected `/todos` route (redirects to login when unauthenticated)
- Fetch, create, update, complete/uncomplete, and delete todos
- Toast notifications for user feedback
- Simple, responsive UI styles using CSS

---

## Tech stack

- React (TypeScript)
- Vite
- react-router-dom (routing)
- react-toastify (notifications)
- ESLint + TypeScript for linting/type checking

Dependencies in package.json:
- react, react-dom, react-router-dom, react-toastify
Dev dependencies:
- vite, typescript, @vitejs/plugin-react, eslint, and related typings/plugins

Scripts from package.json:
- `npm run dev` — start dev server (vite)
- `npm run build` — run TypeScript build then `vite build`
- `npm run preview` — preview production build
- `npm run lint` — run eslint

---

## Project structure (important files)

- index.html — Vite entry HTML
- vite.config.ts — Vite configuration
- package.json / package-lock.json
- public/
  - favicon.svg
  - icons.svg
- src/
  - main.tsx — React entry point
  - App.tsx — main app component (navigation, route guarding, ToastContainer)
  - config.ts — API URL configuration
  - App.css, index.css — styles
  - assets/ — hero.png, react.svg, vite.svg
  - pages/
    - register.tsx — registration page/form
    - login.tsx — login page/form
    - todos.tsx — todos page (list, create, update, delete)
- tsconfig*.json — TypeScript configs
- vercel.json — Vercel config for deployment

---

## Routing & UX behavior

- `/register` — registration page. On successful registration the app redirects to the login page.
- `/login` — login page. On successful login the app saves the token to localStorage and navigates to `/todos`.
- `/todos` — protected page. If there is no token in localStorage, the app redirects to `/login`. On this page the app:
  - GETs the list of todos from the API
  - POSTs to create a new todo
  - PATCHes to update a todo (including marking completed/uncompleted)
  - DELETEs to remove a todo

The app uses fetch and checks `response.ok` to determine success vs error. User-facing feedback is shown with toast messages.

---


## Configuration & environment

- `src/config.ts` reads the base API URL:

```ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';