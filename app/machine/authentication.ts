import { XummAPI } from "../utility/xaman.config";
import { XummPkce } from "xumm-oauth2-pkce";
import { assign, createMachine, fromPromise } from "xstate";
const auth: any = new XummPkce(XummAPI);

export const authMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOgJYQBswBiWXKAO1QAcBtABgF1FRqB7M9XNilkAD0QA2egHZsAJgAsAZlFSJADikBGKfSEAaEAE9EqqZICcQoxKP0L9KaMUBfO9rRY8hEmUq4KDZkhDtObl4-QQQRcWk5BWU1DW09BHMVbCMVAFYhNMtRenSjKTSHJwwcAA1kAFtkCgBJCDAKLnQdYggeMDwKADc2AGsO-krqnz4A3C4ePlCVawlsGTk0pVy1UVF4xBlLefUhRTEJGRUjlSKQZzKh2vrG8ZawACcHtgfsagJkdAAzF4rsQaq3iYow44yCU2EYkksnkSgMcV0iBURiM82UMkUEhUajSaVSojOF2wACUwFBcLB0I9Wu1Oj1+tgiaTyZTHggvD0AMafII+EZ+MYTYKgUJKGQpNJHGRSCwLFTKDZhKRCbArGXS0RGRTyoyEkokskUqkPYiPZ6vd6fH4PP5Mw2sh7s7psblCvnAgWgoUQxKKcVGSXHGX0OUKxEIXHiqT7CTSITSLGKIR6lwAGTY5IoNIoHQ5fQ6RPTmadXJ5PHdvlYXvBISRR0U2HkKMUilEQmjysVmWSeIx2OUBSUusc531Ra8pqeLzeH2+v0ZY4zXhLLrLQMY-KrgUmtYQxwk9FVFlxQhyUnUbcVuNRGgkaQUWsUZlbKZwsFQnM5cFgxE3-mrO4inW8qNjKj5th2WjhjIEgqtGCyiLB6rIsOxQuO+n7fr+KiVv+27CgISKzPMizLNiNjrOG2pHqRyj3ko8oOCOFBsPU8B+BcIL4T6AC0UEJDxaQpCiImiSJ7aFCORL4EQXFgoBhEINGDYFPGeLIioORal2IiSNqSiYpkCjSK+2DlICdQNE0CRbvJBGhKIuLYKeYH5EmohbCoirmIYGSqOkxxHKkMimcyRqPHJ3q7goXZYo22JZDIFh7KYEimeOBGCjWQF7ksyQonsMyqGs9BpFe96NgOyyYk+aQElJ+oYV+sDsbZUU5SoB6GKI8oeci9ASB5UiKjBQmDT1mmlQUHn2ExQA */
    id: "auth",
    initial: "idle",
    types: {
      context: {} as {
        data: string | null;
        redirect: string;
        signin: boolean | null;
        message: { msg: string | null; css: string | null };
      },
    },
    context: {
      data: null,
      redirect: "/dashboard",
      signin: null,
      message: { msg: null, css: null },
    },
    states: {
      idle: {
        entry: assign({
          signin: null,
          data: null,
        }),
        on: {
          signup: {
            actions: assign({
              signin: false,
            }),
            target: "XamanIdentity",
            reenter: false,
          },
          signin: {
            actions: assign({
              redirect: ({ context, event }) => event.redirect,
              signin: true,
            }),
            target: "XamanIdentity",
            reenter: false,
          },
        },
      },
      XamanIdentity: {
        entry: assign({
          message: ({ context, event }) => ({
            msg: context.signin
              ? "Login: Scan with Xaman"
              : "Register: Scan with Xaman",
            css: "blue",
          }),
        }),
        invoke: {
          id: "xaman",
          src: "fetchInformation",
          input: ({ context }) => context.signin,
          onDone: {
            target: "success",
            actions: assign({
              data: ({ context, event }) => {
                return event.output;
              },
              message: ({ context, event }) => ({
                msg: "checking the backend ...",
                css: "blue",
              }),
            }),
          },
          onError: {
            actions: assign({
              message: ({ context, event }) => ({
                msg: context.signin ? "Login Failed." : "Registration Failed.",
                css: "red",
              }),
            }),
            target: "idle",
            reenter: false,
          },
        },
      },
      Register: {
        invoke: {
          src: "checkDatabase",
          input: ({ context }) => context.data,
          onDone: {
            actions: assign({
              message: ({ context, event }) => event.output, // Database returns result with proper formating.
            }),
            target: "idle",
            reenter: false,
          },
          onError: {
            actions: assign({
              message: ({ context, event }) => ({
                msg: "Register: Database Error. Please try again later.",
                css: "red",
              }),
            }),
            target: "idle",
            reenter: false,
          },
        },
      },
      Login: {
        invoke: {
          src: "checkPresence",
          input: ({ context }) => context,
          onDone: {
            actions: assign({
              message: ({ context, event }) => event.output, // Database returns result with proper formating.
            }),
            target: "idle",
            reenter: false,
          },
          onError: {
            actions: assign({
              message: ({ context, event }) => ({
                msg: "Login: Database Error. Please try again later.",
                css: "red",
              }),
            }),
            target: "idle",
            reenter: false,
          },
        },
      },
      success: {
        always: [
          {
            guard: ({ context, event }) => context.signin === null,
            target: "idle",
          },
          {
            guard: ({ context, event }) => context.signin === true,
            target: "Login",
          },
          {
            guard: ({ context, event }) => context.signin === false,
            target: "Register",
          },
        ],
      },
    },
  },
  {
    actions: {},
    actors: {
      fetchInformation: fromPromise(async ({ input }: { input: string }) => {
        if (window) {
          try {
            return await xaman(input);
          } catch (e) {
            throw new Error(); // user might have closed the QR window.
          }
        }
      }),
      checkDatabase: fromPromise(
        async ({
          input,
        }: {
          input: {
            data: {
              name: string;
              raddress: string;
              agent: string;
              usertoken: string;
            };
            redirect: string;
          };
        }) => {
          try {
            const result = await fetch("./register", {
              method: "POST",
              body: JSON.stringify(input),
            });
            return await result.json();
          } catch (e) {
            throw new Error(); // Error connecting to Database.
          }
        }
      ),
      checkPresence: fromPromise(
        async ({
          input,
        }: {
          input: {
            data: {
              name: string;
              raddress: string;
              agent: string;
              usertoken: string;
            };
            redirect: string;
          };
        }) => {
          try {
            const result = await fetch("./login", {
              method: "POST",
              body: JSON.stringify(input),
            });
            if (result.redirected) {
              window.location.href = result.url;
              return { msg: "Logging in ..", css: "green" };
            } else {
              await xamanLogout();
              if (result.status !== 200) {
                return {
                  msg: "Critical error. Please report admin.",
                  css: "red",
                };
              }
              return await result.json();
            }
          } catch (e) {
            throw new Error(); // Error connecting to Database.
          }
        }
      ),
    },
  }
);

const xaman = async (signin: string) => {
  if (!signin) {
    await xamanLogout();
  }

  const authorized = await auth.authorize();
  const pong = await authorized.sdk.ping();
  const name = authorized.me.name;
  const raddress = pong.jwtData.sub;
  const agent = pong.jwtData.payload_uuidv4;
  const usertoken = pong.jwtData.usertoken_uuidv4;
  return { name, raddress, agent, usertoken };
};

const xamanLogout = async () => {
  await auth.logout();
};
