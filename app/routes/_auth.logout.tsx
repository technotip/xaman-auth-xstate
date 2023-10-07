import type { ActionFunctionArgs } from "@remix-run/node";
import { agentLogout } from "../service/session.server";
import { useEffect } from "react";

import { XummAPI } from "../utility/xaman.config";
import { XummPkce } from "xumm-oauth2-pkce";
const auth: any = new XummPkce(XummAPI);

export const action = async ({ request }: ActionFunctionArgs) => {
  return await agentLogout(request);
};

export default function Logout() {
  useEffect(() => {
    (async () => {
      await auth.logout();
      const result = await fetch("/logout", {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (result.redirected) {
        window.location.href = "/";
      }
    })();
  }, []);

  return <></>;
}
