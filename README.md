# DJ Forever RSVP App

A fullstack RSVP and user management application for events, built with:

- **Backend:** Node.js, Express, MongoDB, GraphQL (Apollo Server)
- **Frontend:** React, Apollo Client, Vite, TypeScript
- **Testing:** Vitest, React Testing Library (client), Jest/Vitest (server)

---

## Table of Contents

- [DJ Forever RSVP App](#dj-forever-rsvp-app)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
      - [Server (`server/.env`)](#server-serverenv)
      - [Production Build](#production-build)
    - [Running Tests](#running-tests)
      - [Server Tests](#server-tests)
      - [Client Tests](#client-tests)
  - [Project Structure](#project-structure)
    - [Notable Scripts](#notable-scripts)
      - [Root Scripts](#root-scripts)
      - [Server Scripts](#server-scripts)
      - [Client Scripts](#client-scripts)
  - [API Overview](#api-overview)
    - [GraphQL Endpoint](#graphql-endpoint)
      - [Example Queries/Mutations](#example-queriesmutations)
  - [Testing](#testing)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)

---

## Features

- User authentication (register, login, JWT-based sessions)
- RSVP creation, update, and management
- User profile management
- Dashboard for users
- Responsive, modern UI
- GraphQL API with robust schema and error handling
- Comprehensive unit and integration tests (server and client)

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Apollo Server (GraphQL)
- **Frontend:** React, Vite, Apollo Client, TypeScript
- **Testing:**
  - Server: Vitest, Jest, Supertest, MongoDB Memory Server
  - Client: Vitest, React Testing Library, MSW, jsdom

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)
- MongoDB (local or Atlas, for production)

### Environment Variables

#### Server (`server/.env`)

```env
MONGODB_URI=mongodb://localhost:27017/djforever
JWT_SECRET=your_jwt_secret
PORT=4000
```text

#### Client Environment

- No required environment variables for local development (uses `/graphql` proxy).

### Installation

From the root directory:

```sh
# Install root dependencies (if any)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```text

### Running the App

#### Development (concurrently runs server and client)

```sh
# From the root directory
npm run dev
```

- Server: [`http://localhost:4000`](http://localhost:4000)
- Client: [`http://localhost:5173`](http://localhost:5173)

#### Production Build

```sh
# From the root directory
npm run build
npm start
```

### Running Tests

#### Server Tests

```sh
cd server
npm test         # Runs all server tests (Vitest/Jest)
```

#### Client Tests

```sh
cd client
npm test         # Runs all client tests (Vitest, React Testing Library)
```

---

## Project Structure

```text
dj-forever/
├── client/         # React frontend (Vite, Apollo Client, TypeScript)
├── server/         # Node.js backend (Express, Apollo Server, MongoDB)
├── workflows/      # CI/CD workflows
├── package.json    # Root scripts (dev, build, start)
├── README.md       # This file
└── ...
```

### Notable Scripts

#### Root Scripts

- `npm run dev` – Start both server and client in development mode
- `npm run build` – Build both server and client
- `npm start` – Start both server and client in production

#### Server Scripts

- `npm run dev` – Start server with nodemon
- `npm run build` – TypeScript build
- `npm start` – Start server
- `npm test` – Run server tests
- `npm run seed` – Seed the database

#### Client Scripts

- `npm run dev` – Start Vite dev server
- `npm run build` – Build client
- `npm start` – Preview production build
- `npm test` – Run client tests

---

## API Overview

### GraphQL Endpoint

- `/graphql` (server)

#### Example Queries/Mutations

- **Login:**

```graphql
mutation Login($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    token
    user {
      id
      name
    }
  }
}
```

- **RSVP:**

```graphql
mutation RSVP($input: RSVPInput!) {
  rsvp(input: $input) {
    id
    user {
      id
      name
    }
    attending
  }
}
```

---

## Testing

- **Server:** All tests in `server/tests/` (Vitest/Jest, Supertest, in-memory MongoDB)
- **Client:** All tests in `client/src/**/*.test.tsx` (Vitest, React Testing Library, MSW)
- Coverage reports generated in both client and server

---

## Deployment

- See `workflows/deploy.yml` for CI/CD pipeline
- Environment variables must be set in production
- Build artifacts are in `client/dist` and `server/dist`

---

## Contributing

1. Fork the repo and create your branch from `main` or `develop`.
2. Run tests and ensure all pass before submitting a PR.
3. Follow code style and commit message conventions.
4. For major changes, open an issue first to discuss.

---

## License

[MIT](LICENSE)
