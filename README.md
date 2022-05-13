# RapidFire

**Express Based WebServer Framework**

# Quick Start

## Installation

```
npm i -S @luasenvy/rapidfire
```

## Startup Web Server

```
const { RapidFire } = require('@luasenvy/rapidfire')

const rapidFire = new RapidFire({ host: 'localhost', port: 8000 })

rapidFire.ignition()
```

`http://localhost:8000` will response `Cannot GET /`

# Benefit

- Lightweight
  - Depends On: `express`, `body-parser`, `debug` Only.
- Make Directory Structure What You Need.
- Making Project Skeleton Rapidly.
- Friendly Structure Module Concept
- Simple Lifecycle.

# Roadmap

## Core

- [x] Base Directory Structure
- [x] Middleware Ordering & Piping

## Interfaces

- [x] Controller
- [x] ServiceLoader
- [x] Service
- [x] Middleware

# Documentation

[Documentation](https://docs.rapidfirejs.com/)

# Examples

- [x] [Serve Plain HTML](https://github.com/luasenvy/rapidfire-example-serve-html)
- [x] [Express Middleware Plugin](https://github.com/luasenvy/rapidfire-example-express-session)
- [x] [Middleware Ordering](https://github.com/luasenvy/rapidfire-example-order-middlewares)
- [x] [Elasticsearch](https://github.com/luasenvy/rapidfire-example-elasticsearch)
- [x] [Mongodb](https://github.com/luasenvy/rapidfire-example-mongodb)
- [x] [GraphQL](https://github.com/luasenvy/rapidfire-example-express-graphql)
  - `express-graphql` with `elasticsearch`
- [x] [Nuxt](https://github.com/luasenvy/rapidfire-example-nuxt)
- [x] [Vite](https://github.com/luasenvy/rapidfire-example-vite)
  - Vite `MiddlewareMode` Need `entry-server.js` For SSR. But, Not Implemented In This Example.
  - [Vite#setting-up-the-dev-server](https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server)
  - [Vite#example-projects](https://vitejs.dev/guide/ssr.html#example-projects)

# License

BEERWARE
