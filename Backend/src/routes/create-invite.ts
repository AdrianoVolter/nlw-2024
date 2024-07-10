import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invite",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) {
        throw new Error("Trip not found");
      }

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const formattedStartDate = dayjs(trip.start_at).format("LL");
      const formattedEndDate = dayjs(trip.end_at).format("LL");

      const mail = await getMailClient();

      const confimationLink = `http:localhost:3333/participant/${participant.id}/confirm`;
      const message = await mail.sendMail({
        from: {
          name: "Trip Planner",
          address: "noreply@tripplanner.com",
        },
        to: participant.email,
        subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
        html: `
                <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                  <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                  <p></p>
                  <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                  <p></p>
                  <p>
                    <a href="${confimationLink}">Confirmar viagem</a>
                  </p>
                  <p></p>
                  <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
                </div>
              `.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return {
        tripId,
        participantId: participant.id,
      };
    }
  );
}
