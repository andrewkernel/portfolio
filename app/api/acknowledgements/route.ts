const counterKey = "portfolio:acknowledgements";

type CounterGlobal = typeof globalThis & {
  portfolioAcknowledgements?: number;
};

type RedisPayload = {
  result?: number | string | null;
};

function getRedisConfig() {
  return {
    url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN,
  };
}

async function runRedis(command: string[]) {
  const { url, token } = getRedisConfig();

  if (!url || !token) {
    return null;
  }

  const response = await fetch(`${url}/${command.map(encodeURIComponent).join("/")}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("The acknowledgement store could not be reached.");
  }

  const payload = (await response.json()) as RedisPayload;
  return Number(payload.result || 0);
}

function getDevelopmentCounter() {
  const counterGlobal = globalThis as CounterGlobal;
  counterGlobal.portfolioAcknowledgements ??= 0;
  return counterGlobal;
}

async function readCount() {
  const storedCount = await runRedis(["get", counterKey]);
  return storedCount ?? getDevelopmentCounter().portfolioAcknowledgements ?? 0;
}

async function incrementCount() {
  const storedCount = await runRedis(["incr", counterKey]);

  if (storedCount !== null) {
    return storedCount;
  }

  const counterGlobal = getDevelopmentCounter();
  counterGlobal.portfolioAcknowledgements = (counterGlobal.portfolioAcknowledgements ?? 0) + 1;
  return counterGlobal.portfolioAcknowledgements;
}

export async function GET() {
  return Response.json({ count: await readCount() });
}

export async function POST() {
  return Response.json({ count: await incrementCount() });
}
