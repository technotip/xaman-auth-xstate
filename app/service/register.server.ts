import { Role } from "@prisma/client";
import { db } from "../db/db.server";

export async function userRegistration({
  name,
  raddress,
  agent,
  usertoken,
}: {
  name: string;
  raddress: string;
  agent: string;
  usertoken: string;
}) {
  const agentExists = await db.agent.findUnique({
    where: { raddress: raddress },
  });

  if (agentExists) {
    return {
      msg: "User already exisits.",
      css: "yellow",
    };
  }

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
    return {
      msg: "Token Expired.",
      css: "red",
    };
  }

  if (verifyAgent.response.account === raddress) {
    try {
      const agent = await db.agent.create({
        data: {
          name: name,
          raddress: verifyAgent.response.account,
          usertoken: usertoken,
          verified: true,
          role: Role.ADMIN,
        },
        select: { verified: true },
      });
      if (!agent) return null;
      return {
        msg: "Registration Successful. ", //Waiting for approval from Admin.
        css: "green",
      };
    } catch (e) {
      return {
        msg: "Unknown Database Error.",
        css: "red",
      };
    }
  } else {
    return {
      msg: "Unauthorized Agent.",
      css: "red",
    }; // unauthorized agent - I hope this logic never executes.
  }
}
