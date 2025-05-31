# DJ Forever Monorepo

## Getting Started

### 1. Install dependencies

```sh
npm run install
```

### 2. Development (concurrently runs server and client)

```sh
npm run dev
```

- Client: <http://localhost:3000>
- Server: <http://localhost:3001/graphql>

### 3. Build for production

```sh
npm run build
```

### 4. Lint and Format

```sh
npm run lint
npm run format
```

### 5. Environment Variables

- See `server/.env.example` and `client/.env.example` for required variables.

### 6. Seeding the Database

```sh
npm run seed
```

---

- In development, the client proxies `/graphql` to the server.
- In production, the server serves the built client and handles `/graphql`.

---

For more details, see the `client/` and `server/` README sections.
