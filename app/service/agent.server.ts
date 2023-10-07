import { db } from "~/db/db.server";
import { getAgentId } from "./session.server";

export async function Myself(request: Request) {
  const agentId = await getAgentId(request);
  if (!agentId) return null;

  const agent = await db.agent.findUnique({
    where: { agentId: agentId },
  });

  if (!agent) {
    return null;
  }
  return agent;
}

export async function DeleteMyself(request: Request) {
  const agentId = await getAgentId(request);
  if (!agentId) return null;

  const agent = await db.agent.delete({
    where: { agentId: agentId },
  });

  if (!agent) {
    return null;
  }
  return agent;
}
