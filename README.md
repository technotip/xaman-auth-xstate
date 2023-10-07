# Welcome to Xaman Authentication using xState

## Tech Stack Used

1. Remixjs
2. MongoDB(Database)
3. Prisma(ORM)
4. [XummPkce](https://github.com/XRPL-Labs/XummPkce)

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
