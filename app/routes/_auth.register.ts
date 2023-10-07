import type { ActionFunction } from "@remix-run/node";
import { userRegistration } from "../service/register.server";

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  switch (request.method) {
    case "POST": {
      const result = await userRegistration(data);
      return result;
    }
  }
};
