import DashboardComponent from "~/components/dashboard";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Myself, DeleteMyself } from "../service/agent.server";
import { redirect } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await Myself(request);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await DeleteMyself(request);
  return redirect("/logout");
};

export default function DashboardContent() {
  const info = useLoaderData<typeof loader>();

  return (
    <>
      <main className="lg:pl-20">
        <div className="xl:pl-10">
          <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
            <DashboardComponent user={info} />
          </div>
        </div>
      </main>
    </>
  );
}
