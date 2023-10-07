import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import MenuComponent from "~/components/menu";
import { Outlet } from "@remix-run/react";
import { getAgentId } from "../service/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const agentId = await getAgentId(request);
  if (!agentId) {
    const url = new URL(request.url);
    const redirectTo = url.searchParams.get("redirectTo") ?? "/dashboard";
    return redirect(`/?redirectTo=${redirectTo}`);
  }
  return 1;
};

export default function Dashboard() {
  return (
    <>
      <div>
        <MenuComponent />
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
