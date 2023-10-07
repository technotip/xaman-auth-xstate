import type { ActionFunctionArgs } from "@remix-run/node";
import { createAgentSession, getAgentId } from "../service/session.server";
import { redirect, json } from "@remix-run/node";
import { agentLogin } from "../service/login.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json();

  switch (request.method) {
    case "POST": {
      const agentId = await getAgentId(request);
      const redirectTo = data.redirect;
      if (!agentId) {
        const raddress = data.data.raddress;
        const agent = data.data.agent;

        if (agent && raddress) {
          const user: any = await agentLogin({ agent, raddress });
          if (user.error) {
            return json({ msg: user.msg, css: user.css });
          } else {
            return createAgentSession(user.agentId, redirectTo);
          }
        } else return { msg: "Xumm Login Error", css: "red" };
      } else {
        return redirect(redirectTo);
      }
    }
  }
};
