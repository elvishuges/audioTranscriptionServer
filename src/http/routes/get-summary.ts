import { count, eq } from "drizzle-orm";
import { z } from "zod/v4";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getSummaryRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    "/rooms/:roomId/sumarry",
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request) => {
      const { roomId } = request.params;
      const results = await db
        .select({
          id: schema.sumarryChunks.id,
          content: schema.sumarryChunks.content,
          createdAt: schema.sumarryChunks.createdAt,
        })
        .from(schema.sumarryChunks)
        .where(eq(schema.sumarryChunks.roomId, roomId))
        .limit(1);

      return results.at(0) ?? null;
    }
  );
};
