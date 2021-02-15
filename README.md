# RapidFire

**express based web server framework**

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

# Roadmap

## Core
- [x] Base Directory Structure
- [x] Middleware Ordering & Piping

## Interfaces
- [x] Controller
- [x] ServiceLoader
- [x] Service
- [x] Middleware

## Security

# Documentation

[Documentation](https://docs.rapidfirejs.com/)

# Examples
- [x] [Serve Plain HTML](https://github.com/luasenvy/rapidfire-example-serve-html)
- [x] [Express Middleware Plugin](https://github.com/luasenvy/rapidfire-example-express-session)
- [x] [Middleware Ordering](https://github.com/luasenvy/rapidfire-example-order-middlewares)
- [x] [Elasticsearch](https://github.com/luasenvy/rapidfire-example-elasticsearch)
- [x] [Mongodb](https://github.com/luasenvy/rapidfire-example-mongodb)
- [x] [Nuxt](https://github.com/luasenvy/rapidfire-example-nuxt)
- [x] [Vite](https://github.com/luasenvy/rapidfire-example-vite)
  * Vite `MiddlewareMode` Need `entry-server.js` For SSR. But, Not Implemented In This Example.
  * [Vite#setting-up-the-dev-server](https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server)
  * [Vite#example-projects](https://vitejs.dev/guide/ssr.html#example-projects)
- [ ] ~~Svelte~~
- [ ] ~~Typescript~~
- [ ] ~~Sapper~~

# License
BEERWARE
