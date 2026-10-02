import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/db";

async function bootstrap() {
  await connectDatabase();

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`[server] Listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("[server] Failed to start:", error);
  process.exit(1);
});
