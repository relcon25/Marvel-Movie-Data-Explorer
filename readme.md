# Quote of the Day App

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

This project implements a "Quotes of the Day" application where users can enter a number and receive a random list of quotes (with authors) retrieved from the FavQs API.
The application also supports filtering by tags.

## Architecture

1. **Data Fetching and Caching**:
    - The backend periodically fetches quotes from the FavQs API.
    - The quotes are saved in the database for persistence and cached in Redis for fast access.

2. **API Endpoints**:
    - A primary endpoint accepts a `count` parameter (and optionally pagination parameters - not implemented) to return a random set of quotes.

3. **Distributed Scheduler**:
    - Ensures that only one instance (in a distributed setup) refreshes the quotes cache using a Redis-based distributed lock.

4. **Frontend**:
    - A simple React app where users can input a number, click a button, and view the random quotes with their authors.

## Installation

1. **Clone the Repository:**

       git clone git@github.com:relcon25/quote-of-the-day.git
       cd quote-of-the-day

## Configuration

Create a `.env` file in your backend directory with the following variables (adjust values as needed):

       PORT=3001
       FAVQS_API_KEY=your_favqs_api_key
       REDIS_HOST=redis
       PG_USER=postgres
       PG_HOST=postgres
       PG_DATABASE=quote_of_day
       PG_PASSWORD=password
       PG_PORT=5432
       MAX_QUOTES=500
       QUOTES_PER_PAGE=50

Create a `.env` file in you frontend directory with:

       REACT_APP_API_BASE_URL=http://localhost:3001/v1/api

## Running the Application

Run the following command from the project root:

       docker-compose up --build

This will start all services (backend, frontend, Redis, postgres, and Flyway migrations).
Now you can go to:

       http://localhost:3000

and found the app.
Enjoy :)