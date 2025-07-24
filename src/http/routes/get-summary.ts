import { count, eq } from "drizzle-orm";
import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";

export const getSummaryRoute: FastifyPluginCallbackZod = (app) => {
  app.get("/rooms/:roomId/sumarry", async () => {
    const results = await db
      .select({
        id: schema.sumarryChunks.id,
        content: schema.sumarryChunks.content,
        createdAt: schema.sumarryChunks.createdAt,
      })
      .from(schema.sumarryChunks)
      .leftJoin(schema.rooms, eq(schema.sumarryChunks.roomId, schema.rooms.id))
      .limit(1);

    return results.at(0) ?? null;
  });
};
