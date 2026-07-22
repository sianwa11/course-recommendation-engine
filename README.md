# Course Recommendation Engine

A course recommendation engine built with Node.js, TypeScript, Express, and PostgreSQL.

## Prerequisites

Before getting started, ensure you have the following installed:

- Node.js (v18 or later)
- PostgreSQL
- npm

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

Create a database named `recommendations`.

For example, using `psql`:

```sql
CREATE DATABASE recommendations;
```

### 4. Configure environment variables

Create a `.env`(look at .env.example for reference) file in the project root with the following contents:

```env
# Server
PORT=3000

# PostgreSQL
# Replace the username and password with your local PostgreSQL credentials.
DATABASE_URL=postgres://postgres:secret@localhost:5432/recommendations
```

Update the connection string if your PostgreSQL username, password, host, port, or database name differs.

### 5. Create the database schema

```bash
npm run schema
```

### 6. Seed the database

```bash
npm run seed
```

### 7. Start the application

```bash
npm run dev
```

The server will start on:

```
http://localhost:3000
```

## API Endpoints

### Get users

```
GET /users
```

Returns the users available in the seeded database.

### Get recommendations

```
GET /recommendations/:userId
```

Example:

```
GET /recommendations/1
```

Returns personalised course recommendations for the specified user.

## Demo UI

After starting the application, open:

```
http://localhost:3000
```

Select a user from the dropdown to view their recommended courses.
