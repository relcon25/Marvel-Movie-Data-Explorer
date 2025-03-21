# Marvel Movies Explorer

## Table of Contents

- Overview
- Features
- Architecture
- Installation
- Configuration
- Running the Application
- Usage
- Notes
- License

## Overview

This project implements a Marvel Movies Explorer application that allows users to explore connections between movies, characters, and actors from a selected subset of the Marvel Cinematic Universe (MCU). Data is retrieved from the TMDB API and stored in a local database.

## Features

- Fetch and cache Marvel movie metadata and credits from TMDB
- Periodic refresh with Redis-based distributed locking
- Filtered support for a predefined set of movies and actors
- APIs to:
   - List movies by actor
   - Track character variants across movies
   - Track actor careers and roles
   - View character appearances by different actors

## Architecture

1. **Data Fetching and Caching**:
   - Movies and cast data are periodically fetched from TMDB.
   - Data is stored in PostgreSQL and cached in Redis for fast read access.

2. **API Endpoints**:
   - `/moviesPerActor` – List movies per actor
   - `/charactersWithMultipleActors` – Find characters played by different actors
   - `/actorsWithMultipleCharacters` – Find actors with multiple roles

3. **Distributed Scheduler**:
   - Runs every 5 hours using `node-cron`
   - Uses a Redis-based distributed lock to ensure only one instance executes fetch/update logic

4. **Backend**:
   - Node.js + Express, structured using DDD principles
   - Flyway is used for managing PostgreSQL migrations

## Installation

1. **Clone the Repository:**

```bash
git clone git@github.com:relcon25/quote-of-the-day.git
cd quote-of-the-day
```

## Configuration

Create a `.env` file in your backend directory with the following variables:

```
PORT=3001
FAVQS_API_KEY=your_favqs_api_key  # (optional if using quote fallback)
REDIS_HOST=redis
PG_USER=postgres
PG_HOST=postgres
PG_DATABASE=marvel_movies
PG_PASSWORD=password
PG_PORT=5432
MAX_QUOTES=500
TMDB_API_KEY=your_tmdb_api_key
```

Frontend `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:3001/v1/api
```

## Running the Application

Run the following command from the project root:

```bash
docker-compose up --build
```

This will start all services (backend, Redis, PostgreSQL, migrations).

Then open your browser at:

```
http://localhost:3000
```

Enjoy exploring Marvel movie data ✨

## Notes

- Only a selected list of Marvel movies and actors are supported in the MVP.
- Arbitrary searches are disabled.
- Redis cache expires every 5 hours and is refreshed via scheduler.

## License

MIT

