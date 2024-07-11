# API Trip Plann.er

API para gerenciamento de viagens onde os usuários podem criar viagens, convidar pessoas e receber confirmações por email. A API também permite a criação de atividades diárias durante a viagem.

## Tecnologias Utilizadas

- **Framework**: Fastify
- **Banco de Dados**: Prisma
- **Validação de Dados**: Zod
- **Linguagem**: TypeScript

## Tabela de Conteúdos

- [Instalação](#instalação)
- [Scripts](#scripts)
- [Dependências](#dependências)
- [Dependências de Desenvolvimento](#dependências-de-desenvolvimento)
- [Tratamento de Erros](#tratamento-de-erros)
- [Validação](#validação)
- [Autor](#autor)

## Instalação

1. Clone o repositório:

    ```bash
    git clone https://github.com/AdrianoVolter/nlw-2024
    cd backend
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz do diretório e adicione suas variáveis de ambiente necessárias.

## Scripts

- **dev**: Inicia o servidor de desenvolvimento com reinicialização automática ao detectar mudanças nos arquivos.

    ```bash
    npm run dev
    ```

## Dependências

- `@fastify/cors`: Suporte CORS para Fastify.
- `@prisma/client`: Cliente Prisma para interação com o banco de dados.
- `dayjs`: Biblioteca leve para manipulação de datas.
- `fastify`: Framework web para Node.js.
- `fastify-type-provider-zod`: Provedor de tipos Zod para Fastify.
- `nodemailer`: Biblioteca para envio de emails.
- `zod`: Biblioteca para declaração e validação de esquemas TypeScript-first.

## Dependências de Desenvolvimento

- `@types/node`: Definições TypeScript para Node.js.
- `@types/nodemailer`: Definições TypeScript para Nodemailer.
- `prisma`: CLI do Prisma para gerenciamento de esquema de banco de dados.
- `tsx`: Ambiente de execução TypeScript para Node.js.
- `typescript`: Suporte à linguagem TypeScript.

## Tratamento de Erros

O projeto utiliza um tratador de erros personalizado para gerenciar erros da aplicação, distinguindo entre erros do cliente e erros internos do servidor.

### Erro do Cliente

Erros do cliente são instâncias da classe `ClientError` e resultam em um código de status 400.

```javascript
export class ClientError extends Error {}

```

### Tratador de Erros
O tratador de erros é um plugin do Fastify que captura erros e envia uma resposta apropriada para o cliente.

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

### Validação
O projeto utiliza Zod para validação de entrada. Zod é uma biblioteca de declaração e validação de esquemas TypeScript-first.

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

## Autor
Adriano Volter

Api | Gerenciamento de viagens | Back-end da aplicação desenvolvida durante o NLW Journey da Rocketseat.


