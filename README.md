# Project Sakay — Transportation Queue and Dispatch Management System

Project Sakay is a REST API for managing a small transport operation: user
accounts, routes, vehicles, passenger queues, dispatches, and vehicle
locations. It authenticates users with JWT, enforces role-based access, and
stores records in a MySQL-compatible database through TypeORM.

## Tech Stack

| Component    | Technology |
| ------------ | ---------- |
| Framework    | NestJS 12 |
| Language     | TypeScript |
| ORM          | TypeORM |
| Database     | MySQL (MariaDB) via `mysql2` |
| Auth         | JWT (`passport-jwt`) + bcrypt password hashing |
| API Testing  | Postman |
| Versioning   | Git & GitHub |

## How to Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure the database** — start MariaDB, create `sakay_db` and a database
   user, then copy the environment template.
   ```bash
   sudo systemctl start mariadb
   mariadb -u root -p
   ```
   ```sql
   CREATE DATABASE sakay_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'sakay_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON sakay_db.* TO 'sakay_user'@'localhost';
   ```
   ```bash
   cp .env.example .env
   ```
   Fill in `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, and
   `JWT_SECRET` in `.env`.
3. **Start the backend**
   ```bash
   npm run start:dev
   ```
   Tables are auto-created by TypeORM (`synchronize: true`). The API runs at
   `http://localhost:3000/api/v1`.

> If XAMPP is used instead, start it with `sudo /opt/lampp/lampp start` and use
> its MariaDB server. Do not run the system MariaDB and XAMPP on the same port.

## API Overview (34 endpoints)

| Module        | Endpoints |
| ------------- | --------- |
| Root          | `GET /api/v1` |
| Auth          | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| Users         | `GET/POST /api/v1/users`, `GET/PATCH/DELETE /api/v1/users/:id` |
| Vehicles      | `GET/POST /api/v1/vehicles`, `GET/PATCH/DELETE /api/v1/vehicles/:id` |
| Routes        | `GET/POST /api/v1/routes`, `GET/PATCH/DELETE /api/v1/routes/:id` |
| Queues        | `GET/POST /api/v1/queues`, `GET/PATCH/DELETE /api/v1/queues/:id` |
| Dispatches    | `GET/POST /api/v1/dispatches`, `GET/PATCH/DELETE /api/v1/dispatches/:id` |
| Locations     | `GET/POST /api/v1/locations`, `GET/PATCH/DELETE /api/v1/locations/:id` |

Public registration always creates a `Commuter`; sending a `role` field is
rejected. All resource endpoints below Auth require a Bearer token.

## User Roles

| Role       | Capabilities |
| ---------- | ------------ |
| `Commuter` | Default public role. Reads routes and vehicles; full CRUD on queues, dispatches, and locations; reads/updates own user record |
| `Driver`   | Same API permissions as Commuter; no endpoint is restricted to this role |
| `Dispatcher` | Same API permissions as Commuter; may be assigned as `dispatcherId` on a dispatch |
| `Admin`    | Full access — manages users and creates, updates, or deletes routes and vehicles |

## Database Design

Six tables:

- `users` — accounts with roles `Commuter`, `Driver`, `Dispatcher`, or `Admin`;
  email and password hash are stored here.
- `routes` — route name, origin, destination, and estimated travel time.
- `vehicles` — plate number, type, capacity, status, and assigned route.
- `queues` — a user waiting for a route, with queue number, wait time, and status.
- `dispatches` — a queue entry assigned to a vehicle and a dispatcher.
- `locations` — latitude/longitude readings for a vehicle with a timestamp.

Relationships:

- `users` → many `queues` and many `dispatches` (as dispatcher)
- `routes` → many `vehicles` and many `queues`
- `vehicles` → many `dispatches` and many `locations`
- `queues` → many `dispatches`
- Deletes are restricted while rows still reference a parent record.

## Project Structure

```text
project-sakay/
├── src/
│   ├── auth/            # login, registration, JWT strategy, guards, role decorator
│   ├── users/           # user CRUD, password hashing
│   ├── vehicles/        # vehicle CRUD
│   ├── routes/          # route CRUD
│   ├── queues/          # passenger queue CRUD
│   ├── dispatches/      # dispatch CRUD and capacity checks
│   ├── locations/       # vehicle location CRUD
│   ├── common/          # database error helpers and shared validators
│   ├── app.module.ts    # root module and TypeORM configuration
│   └── main.ts          # global prefix, validation pipe, server port
├── backups/             # reference SQL schema dumps
├── test/                # Jest end-to-end test
├── .env.example         # environment variable template
├── package.json
└── tsconfig.json
```

Each feature folder follows the NestJS pattern: `*.module.ts`,
`*.controller.ts`, `*.service.ts`, plus `dto/` and `entities/`. There is no
separate repository layer; services use TypeORM's built-in `Repository`.
