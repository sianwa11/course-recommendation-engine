# Course Recommendation Engine

A lightweight course recommendation engine built with **Node.js**, **TypeScript**, **Express**, and **PostgreSQL**. The engine generates personalised course recommendations by combining user profile information, survey responses, and learning history.

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (v18 or later)
- npm
- PostgreSQL

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd course-recommendation-engine
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the PostgreSQL database

Ensure your PostgreSQL server is running.

Create a database named `recommendations`.

For example, using `psql`:

```bash
psql -U postgres
```

Once connected, run:

```sql
CREATE DATABASE recommendations;
```

If you're using another PostgreSQL client (such as pgAdmin), simply create a new database named `recommendations`.

### 4. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then update the values in `.env` if your PostgreSQL credentials differ.

Example:

```env
# Server
PORT=3000

# PostgreSQL
DATABASE_URL=postgres://postgres:secret@localhost:5432/recommendations
```

> **Note:** Replace the username, password, host or port in `DATABASE_URL` if your local PostgreSQL installation uses different credentials.

### 5. Create the database schema

Run:

```bash
npm run schema
```

This creates all required database tables and types.

### 6. Seed the database

Run:

```bash
npm run seed
```

This populates the database with sample users, courses, survey responses and usage history.

### 7. Start the application

```bash
npm run dev
```

The server will start on:

```
http://localhost:3000
```

## API Endpoints

### Get all users

```
GET /users
```

Returns the list of users available in the seeded database.

### Get recommendations

```
GET /recommendations/:userId
```

Example:

```
GET /recommendations/1
```

Returns personalised course recommendations for the specified user, including the recommendation score and explanation.

## Demo UI

Once the server is running, open:

```
http://localhost:3000
```

Use the user dropdown to select a seeded user and view their personalised course recommendations.
