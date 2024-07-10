import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participants/:participantId",
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { participantId } = request.params;

      const participant = await prisma.participant.findUnique({
        select: {
            id: true,
            name: true,
            email: true,
            is_confirmed: true,
        },
        where: {
          id: participantId,
        },
        
      });

      if (!participant) {
        throw new Error("Trip not found");
      }

      return { participant };
    }
  );
}
