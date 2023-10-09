import { XummAPI } from "../utility/xaman.config";
import { XummPkce } from "xumm-oauth2-pkce";
import { assign, createMachine, fromPromise } from "xstate";
const auth: any = new XummPkce(XummAPI);

export const authMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgOgJYQBswBiWXKAO1QAcBtABgF1FRqB7M9XNilkAD0QBOAKwA2bACYhAZgDsADnpyZIgCwyZkgDQgAnohliR2AIxyR9SfSGn6l0zIC+T3Wix5CJMpVwUGzEgg7JzcvEGCCKIS0vJKKuqaOvqIamL02HL0YpJiogqSSgoubhg4ABrIALbIFACSEGAUXOh6xBA8YHgUAG5sANZd-NW1AXwhuFw8fJHRUrKKyqoaWroGCGKmQthqC3n0mgq7zq4g7hUj9Y3Nk21gAE73bPfY1ATI6ABmz1XYwzX+JjjDiTMIzYQiOTYMQyNRqOzScybNRrRCSOSSaEaOQYrb2OxCMQlM5lbAAJTAUFwsHQD3anW6fUG2HO5Mp1Np9wQfj6AGMPmEAmMghMpuFQJFxNsCTIhAopbZzKiENYMo5seJJAqCsTWRSqTS6Q8ni83h9vvdfnr2YauTy2PyxUKgSKQWLwQgpWYbLL5XlFXJldJMWJjGI1BjDiojLrSQAZNhUij0ihde3M1kJpPc3oOgU8Z2BVhusERRBemVyhWmJUpBAyeVmQkKUSiBswuSxjxZvzEY3PV7vL4-FnxxN+HN8-OAxjC4uhaZlz15b2yKv+muBusRqEYhSmOFiFTytT2Ls4WCoXm8uCwYhz4IlxcSxCmffYA6mSRqeX2eFGMRlXfH05GORQclMHJz2wS9r1ve9TCLR8F3FARX2AmQvx-Sx1EcUNlTUSRMXlTC4XoBR5DEJQTlKDxYJvWA71oSQkNFUsXwQN9TA-TDv1-XCAKDeRMiEbJMIbXYqxOU4KDYRp4CCc5gRQj0AFpALrdToPwIhlNBZ80IQRRMVUHICiEbF5VMINROwBQFAsSRTEsOQD3kGiSQ8SoAQaJoWnWed9NQyIa0gj8wxEKtIREWFlSMNRsEsKjZBEGtLAbaD9Q5B49PdJdYQSyxrH3cMRAKUMRCDL9EvkdLQK1CwiVOTNx1QtiDMiWEZB2L8isImLHEguKhChdJ6CsKxxHoQjYWg+jb1y9jDMI5UhExDRNXUQiW0kGMXCcIA */
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
          src: "createAccount",
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
      createAccount: fromPromise(
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
