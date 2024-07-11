# Backend Project

This project is a backend service built using Fastify, Zod, and Prisma, with TypeScript for type safety. It includes custom error handling and validation mechanisms.

## Table of Contents

- [Installation](#installation)
- [Scripts](#scripts)
- [Dependencies](#dependencies)
- [Development Dependencies](#development-dependencies)
- [Error Handling](#error-handling)
- [Validation](#validation)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/AdrianoVolter/nlw-2024
    cd backend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables.

## Scripts

- **dev**: Runs the development server with automatic restarts on file changes.

    ```bash
    npm run dev
    ```

## Dependencies

- `@fastify/cors`: CORS support for Fastify.
- `@prisma/client`: Prisma Client for database interaction.
- `dayjs`: Lightweight date library for parsing, validating, manipulating, and formatting dates.
- `fastify`: Web framework for Node.js.
- `fastify-type-provider-zod`: Zod type provider for Fastify.
- `nodemailer`: Email sending library.
- `zod`: TypeScript-first schema declaration and validation library.

## Development Dependencies

- `@types/node`: TypeScript definitions for Node.js.
- `@types/nodemailer`: TypeScript definitions for Nodemailer.
- `prisma`: Prisma CLI for database schema management.
- `tsx`: TypeScript execution environment for Node.js.
- `typescript`: TypeScript language support.

## Error Handling

This project uses a custom error handler to manage application errors. The error handler distinguishes between client errors and internal server errors.

### Client Error

Client errors are instances of the `ClientError` class and result in a 400 status code.

```javascript
export class ClientError extends Error {}
```

### Error Handler

The error handler is a Fastify plugin that catches errors and sends an appropriate response to the client.

```javascript
import type { FastifyInstance } from "fastify"
import { ClientError } from "./errors/client-error"
import { ZodError } from "zod"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Invalid input',
      errors: error.flatten().fieldErrors
    })
  }

  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error.message
    })
  }
  
  return reply.status(500).send({ message: 'Internal server error' })
}
```

### Validation 

This project uses Zod for input validation. Zod is a TypeScript-first schema declaration and validation library.

```javascript

//example of a route using zod for validation
import { z } from "zod"

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          start_at: z.coerce.date(),
          end_at: z.coerce.date(),
          owner_name: z.string().min(4),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email()),
        }),
      },
    },
})
```

## author
Adriano Volter

Api | Gerenciamento de viagens | Back-end da aplicação desenvolvida durante o NLW Journey da Rocketseat.


