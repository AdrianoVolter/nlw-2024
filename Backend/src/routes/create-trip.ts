import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
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

      if(dayjs(start_at).isBefore(new Date())) {
        throw new Error("Invalid start trip date");
      }

      if(dayjs(end_at).isBefore(dayjs(start_at))) {
        throw new Error("Invalid trip end date");
      }

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
