import { redirect, createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret)
  throw new Error("Must set environment variable SESSION_SECRET");

const storage = createCookieSessionStorage({
  cookie: {
    name: "xamanAuth",
    secure: true,
    httpOnly: true,
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 400,
    path: "/",
    secrets: [sessionSecret],
  },
});

function getAgentSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getAgentId(request: Request) {
  const session = await getAgentSession(request);
  const agentId = session.get("agentId");

  if (typeof agentId !== "string") return null;
  return agentId;
}

export async function createAgentSession(agentId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("agentId", agentId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function agentLogout(request: Request) {
  const session = await getAgentSession(request);
  throw redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
