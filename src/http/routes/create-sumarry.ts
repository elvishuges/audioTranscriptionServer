import { and, eq, sql } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod/v4";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts";

export const createSumarryRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/rooms/:roomId/sumarry",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          content: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const { content } = request.body;

      const embeddings = await generateEmbeddings(content);

      const result = await db
        .insert(schema.sumarryChunks)
        .values({
          roomId,
          content,
          embeddings,
        })
        .returning();

      const createdText = result[0];

      return reply.status(201).send({
        textId: createdText.id,
      });
    }
  );
};
