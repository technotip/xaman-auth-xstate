# Welcome to Xaman Authentication using xState

## Tech Stack Used

1. Remixjs
2. MongoDB(Database)
3. Prisma(ORM)
4. [XummPkce](https://github.com/XRPL-Labs/XummPkce)
5. xstate: [StateMachine](https://stately.ai/registry/editor/83c484d9-9bdc-475c-bc45-5b4a3e98b2bd?machineId=a243be4b-2b0e-46fb-b62c-fbfe9ac234f9&mode=Simulate)

# Demo

[xaman-auth-xstate.vercel.app](https://xaman-auth-xstate.vercel.app/)

# Implementation

All the logic for **signup** and **signin** are present inside the xstate: [statemachine](https://github.com/technotip/xaman-auth-xstate/blob/main/app/machine/authentication.ts)
The UI is separated from the logic: [index.tsx](https://github.com/technotip/xaman-auth-xstate/blob/main/app/routes/_index.tsx)

# Things to check

1. Login without Registering.
2. Register.
3. Try to Register once again.
4. Login.
5. Once logged in, click on Logout button.
6. Login once again.
7. Delete your account.
8. Try to login.
9. Register.
10. Login.

# Steps

1. `npm install -force`
2. Create database and fill in appropriate environment variables.

## .env file

```
DATABASE_URL="mongodb+srv://user:password@cluster0.sdhooeap.mongodb.net/xamanAuth?retryWrites=true&w=majority"

SESSION_SECRET=""
XummAPI = ""
XummSecret = ""
```

You can get XummAPI and XummSecret from https://apps.xumm.dev/

(While you are at apps.xumm.dev portal -> go to settings and in the **Origin/Redirect URIs** enter http://localhost:3000/ Change the port number appropriately.)

Also make sure to change the XummAPI key in utility/xaman.config.ts file.

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
