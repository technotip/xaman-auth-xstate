import { db } from "~/db/db.server";

export const agentLogin = async ({
  agent,
  raddress,
}: {
  agent: string;
  raddress: string;
}) => {
  const options: any = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-Key": process.env.XummAPI,
      "X-API-Secret": process.env.XummSecret,
    },
  };
  const temp = await fetch(
    "https://xumm.app/api/v1/platform/payload/" + agent,
    options
  );

  const verifyAgent: any = await temp.json();
  if (!verifyAgent || verifyAgent.meta.expired) {
    return { error: true, msg: "Unauthorized Attempt", css: "red" };
  }

  if (verifyAgent.response.account === raddress) {
    const agent = await db.agent.findUnique({
      where: { raddress: verifyAgent.response.account },
      select: { verified: true, agentId: true },
    });

    if (!agent || agent === null)
      return { error: true, msg: "User not found.", css: "red" };
    return agent;
  } else {
    return { error: true, msg: "Contact Admin For Approval.", css: "yellow" };
  }
};
