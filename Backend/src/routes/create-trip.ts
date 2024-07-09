import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dayjs from "dayjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";

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
    async (request) => {
      const {
        destination,
        start_at,
        end_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body;

      if (dayjs(start_at).isBefore(new Date())) {
        throw new Error("Invalid start trip date");
      }

      if (dayjs(end_at).isBefore(dayjs(start_at))) {
        throw new Error("Invalid trip end date");
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          start_at,
          end_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_confirmed: true,
                  is_owner: true,
                },
                ...emails_to_invite.map((email) => {
                  return { email };
                }),
              ],
            },
          },
        },
      });

      const mail = await getMailClient();

      const message = await mail.sendMail({
        from: {
          name: "Trip Planner",
          address: "noreply@tripplanner.com",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: "Trip created successfully! 🎉 - email de test",
        html: "<p>Hello, this is a test email from Trip Planner</p>",
      });

      console.log(nodemailer.getTestMessageUrl(message));
      return {
        statusCode: 200,
        body: trip,
        tripId: trip.id,
      };
    }
  );
}
