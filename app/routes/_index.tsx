import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import xamanlogo from "../../public/assets/images/xaman.png";
import { authMachine } from "../machine/authentication";
import { useMachine } from "@xstate/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Xaman Authentication" },
    { name: "description", content: "User Identity via Xaman." },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirectTo") ?? "/dashboard";
  return redirectTo;
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const [state, send] = useMachine(authMachine);

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="flex">
        <div className="p-14 m-2">
          <h1 className="text-xl font-bold">User Authentication</h1>
          <div className="flex justify-center items-center my-10 space-x-14">
            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              onClick={() => send({ type: "signin", redirect: data })}
              disabled={state.context.signin === true}
            >
              SignIn
            </button>

            <button
              type="button"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              onClick={() => send({ type: "signup" })}
              disabled={state.context.signin === false}
            >
              SignUp
            </button>
          </div>
          {state.context.message.css && (
            <div className="flex justify-center items-center my-10 space-x-14">
              <div
                className={`bg-${state.context.message.css}-100 border-${state.context.message.css}-400 text-${state.context.message.css}-700 border rounded-md p-2 mb-2`}
              >
                <div className="flex">
                  <p className="text-sm">{state.context.message.msg}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-14 m-2">
          <img src={xamanlogo} alt="workflow team" width="500px" />
        </div>
      </div>
    </div>
  );
}
