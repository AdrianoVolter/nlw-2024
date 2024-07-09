import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import  { prisma }  from "../lib/prisma";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(4),
          start_at: z.coerce.date(),
          end_at: z.coerce.date(),
        }),
      },
    },
    async (request) => {
      const { destination, start_at, end_at } = request.body;   

      const trip = await prisma.trip.create({
        data: {
          destination,
          start_at,
          end_at,
        },
      });
      return {
        statusCode: 200,
        body: trip,
        tripId: trip.id,
      };
    }
  );
}
