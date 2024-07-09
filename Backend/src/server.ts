import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import {
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";

const app = fastify();

app.register(cors , {
  origin: "http://localhost:3000",
});
 


// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);

app.listen({ port: 3333 }).then(() => {
  console.log("Server started at http://localhost:3333");
});
