import fastify from "fastify";
import {prisma} from "./lib/prisma";

const app = fastify();

app.get("/cadastrar", async (request, reply) => {
   await prisma.trip.create({
      data:{
        destination: "São Paulo",
        start_at: new Date(),
        end_at: new Date(),
      }
    })
    return "Viagem cadastrada com sucesso!";
  });

app.get("/listar", async (request, reply) => {
    const trips = await prisma.trip.findMany();
    return trips;
  });

app.listen({port:3333}).then(() => {
    console.log("Server started at http://localhost:3333");
    }
);